import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasElement, InvitationPage, ViewportMode } from '../../types';
import { ElementRenderer } from './ElementRenderer';
import { resolveElementForViewport, setElementResponsiveOverride } from '../../utils/responsiveUtils';
import {
  Lock,
  Unlock,
  EyeOff,
  Copy,
  Trash2,
  Move,
  RotateCw,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Group,
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Play,
  Sparkles
} from 'lucide-react';

interface VisualCanvasProps {
  page: InvitationPage;
  selectedElementIds: string[];
  onSelectElement: (id: string | null, isMulti?: boolean) => void;
  onSelectMultipleElements: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateMultipleElements: (updatesMap: Record<string, Partial<CanvasElement>>) => void;
  onDeleteElement: (idOrIds: string | string[]) => void;
  onDuplicateElement: (idOrIds: string | string[]) => void;
  onToggleLockElement?: (idOrIds: string | string[], forceLock?: boolean) => void;
  onToggleHideElement?: (idOrIds: string | string[], forceHide?: boolean) => void;
  onBringForward: (idOrIds: string | string[]) => void;
  onSendBackward: (idOrIds: string | string[]) => void;
  onBringToFront: (idOrIds: string | string[]) => void;
  onSendToBack: (idOrIds: string | string[]) => void;
  onGroup?: (ids?: string[]) => void;
  onUngroup?: (id?: string) => void;
  onCopy?: (ids?: string[]) => void;
  onPaste?: () => void;
  onAlign?: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute?: (axis: 'horizontal' | 'vertical') => void;
  viewportMode: 'mobile' | 'tablet' | 'desktop';
  zoomLevel: number;
  showGrid?: boolean;
  previewAnimationElementId?: string | null;
  previewAnimationKey?: number;
  onPreviewAnimation?: (elementId: string) => void;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  page,
  selectedElementIds = [],
  onSelectElement,
  onSelectMultipleElements,
  onUpdateElement,
  onUpdateMultipleElements,
  onDeleteElement,
  onDuplicateElement,
  onToggleLockElement,
  onToggleHideElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onGroup,
  onUngroup,
  onCopy,
  onPaste,
  onAlign,
  onDistribute,
  viewportMode,
  zoomLevel,
  showGrid = false,
  previewAnimationElementId,
  previewAnimationKey,
  onPreviewAnimation
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Drag & Transform states
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map of starting positions for all dragging elements
  const [elementsStartPositions, setElementsStartPositions] = useState<
    Record<string, { x: number; y: number; width: number; height: number; rotation: number }>
  >({});

  // Marquee Selection state
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState({ x: 0, y: 0 });
  const [marqueeBox, setMarqueeBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const selectedElements = page.elements.filter(el => selectedElementIds.includes(el.id));
  const isSingleSelection = selectedElements.length === 1;
  const singleElement = isSingleSelection ? selectedElements[0] : null;

  // Viewport dimensions
  const getCanvasWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 390;
      case 'tablet':
        return 768;
      case 'desktop':
        return 960;
      default:
        return 390;
    }
  };

  const canvasWidth = getCanvasWidth();
  const canvasHeight = page.height || 844;

  // Page background style
  const getPageBgStyle = () => {
    const bg = page.background;
    if (!bg) return { backgroundColor: '#000000' };

    switch (bg.type) {
      case 'color':
        return { backgroundColor: bg.color || '#000000' };
      case 'gradient':
        if (bg.gradient) {
          const colors = bg.gradient.colors.join(', ');
          const angle = bg.gradient.angle ?? 180;
          return {
            background: bg.gradient.type === 'radial'
              ? `radial-gradient(circle, ${colors})`
              : `linear-gradient(${angle}deg, ${colors})`
          };
        }
        return { backgroundColor: bg.color || '#000000' };
      case 'image':
      case 'pattern':
      case 'texture': {
        const url = bg.imageUrl || bg.pattern || bg.texture;
        return {
          backgroundImage: url ? `url("${url}")` : undefined,
          backgroundSize: bg.size || (bg.type === 'pattern' ? 'auto' : 'cover'),
          backgroundRepeat: bg.repeat || (bg.type === 'pattern' ? 'repeat' : 'no-repeat'),
          backgroundPosition: bg.position || 'center',
          backgroundColor: '#000000'
        };
      }
      case 'video':
        return { backgroundColor: '#000000' };
      default:
        return { backgroundColor: '#000000' };
    }
  };

  // Keyboard Nudge & Short keys (Up/Down/Left/Right nudging)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (selectedElements.length === 0) return;
      const allLocked = selectedElements.every(el => el.isLocked);
      if (allLocked) return;

      const step = e.shiftKey ? 10 : 1;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;

        const updates: Record<string, Partial<CanvasElement>> = {};
        selectedElements.forEach(el => {
          if (!el.isLocked) {
            updates[el.id] = {
              style: {
                ...el.style,
                x: el.style.x + dx,
                y: el.style.y + dy
              }
            };
          }
        });
        onUpdateMultipleElements(updates);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, onUpdateMultipleElements]);

  // Handle Element MouseDown
  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();

    const isShiftOrCmd = e.shiftKey || e.metaKey || e.ctrlKey;

    if (isShiftOrCmd) {
      onSelectElement(element.id, true);
      return;
    }

    // If clicking an unselected element without shift, select only this element
    let activeIds = selectedElementIds;
    if (!selectedElementIds.includes(element.id)) {
      activeIds = [element.id];
      onSelectElement(element.id, false);
    }

    if (element.isLocked) return;

    // Start dragging all selected elements
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });

    const activeElements = page.elements.filter(el => activeIds.includes(el.id) && !el.isLocked);
    const startMap: Record<string, { x: number; y: number; width: number; height: number; rotation: number }> = {};

    activeElements.forEach(el => {
      const { style: resolved } = resolveElementForViewport(el, viewportMode);
      startMap[el.id] = {
        x: resolved.x,
        y: resolved.y,
        width: resolved.width,
        height: resolved.height,
        rotation: resolved.rotation || 0
      };
    });

    setElementsStartPositions(startMap);
  };

  // Handle Canvas Background MouseDown (Marquee Drag selection)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && !(e.target as HTMLElement).classList.contains('canvas-background')) {
      return;
    }

    const scale = zoomLevel / 100;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const startX = (e.clientX - canvasRect.left) / scale;
    const startY = (e.clientY - canvasRect.top) / scale;

    setIsMarqueeActive(true);
    setMarqueeStart({ x: startX, y: startY });
    setMarqueeBox({ x: startX, y: startY, width: 0, height: 0 });

    if (!e.shiftKey) {
      onSelectElement(null);
    }
  };

  // Handle Resize MouseDown (Single selected element)
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (!singleElement || singleElement.isLocked) return;
    e.stopPropagation();
    setIsResizing(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    const { style: resolved } = resolveElementForViewport(singleElement, viewportMode);
    setElementsStartPositions({
      [singleElement.id]: {
        x: resolved.x,
        y: resolved.y,
        width: resolved.width,
        height: resolved.height,
        rotation: resolved.rotation || 0
      }
    });
  };

  // Handle Rotation Start (Single selected element)
  const handleRotateStart = (e: React.MouseEvent) => {
    if (!singleElement || singleElement.isLocked) return;
    e.stopPropagation();
    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    const { style: resolved } = resolveElementForViewport(singleElement, viewportMode);
    setElementsStartPositions({
      [singleElement.id]: {
        x: resolved.x,
        y: resolved.y,
        width: resolved.width,
        height: resolved.height,
        rotation: resolved.rotation || 0
      }
    });
  };

  // Global Mouse Move & Mouse Up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const scale = zoomLevel / 100;

      // 1. MARQUEE SELECTION DRAG
      if (isMarqueeActive && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const currentX = (e.clientX - canvasRect.left) / scale;
        const currentY = (e.clientY - canvasRect.top) / scale;

        const left = Math.min(marqueeStart.x, currentX);
        const top = Math.min(marqueeStart.y, currentY);
        const width = Math.abs(currentX - marqueeStart.x);
        const height = Math.abs(currentY - marqueeStart.y);

        const currentBox = { x: left, y: top, width, height };
        setMarqueeBox(currentBox);

        // Find elements intersecting with marquee box
        const topElements = page.elements.filter(el => !el.parentContainerId && !el.isHidden);
        const intersectingIds = topElements
          .filter(el => {
            const { style: resolved } = resolveElementForViewport(el, viewportMode);
            const elRight = resolved.x + resolved.width;
            const elBottom = resolved.y + resolved.height;
            const boxRight = currentBox.x + currentBox.width;
            const boxBottom = currentBox.y + currentBox.height;

            return (
              resolved.x < boxRight &&
              elRight > currentBox.x &&
              resolved.y < boxBottom &&
              elBottom > currentBox.y
            );
          })
          .map(el => el.id);

        onSelectMultipleElements(intersectingIds);
        return;
      }

      // 2. ELEMENT DRAGGING (Single or Multiple)
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / scale;
        const dy = (e.clientY - dragStart.y) / scale;

        const updates: Record<string, Partial<CanvasElement>> = {};

        Object.entries(elementsStartPositions).forEach(([id, startPos]) => {
          const pos = startPos as { x: number; y: number; width: number; height: number; rotation: number };
          let newX = Math.round(pos.x + dx);
          let newY = Math.round(pos.y + dy);

          if (showGrid) {
            newX = Math.round(newX / 8) * 8;
            newY = Math.round(newY / 8) * 8;
          }

          const existing = page.elements.find(el => el.id === id);
          if (existing) {
            if (viewportMode === 'mobile') {
              updates[id] = {
                style: {
                  ...existing.style,
                  x: newX,
                  y: newY
                }
              };
            } else {
              updates[id] = setElementResponsiveOverride(existing, viewportMode, {
                x: newX,
                y: newY
              });
            }
          }
        });

        onUpdateMultipleElements(updates);
        return;
      }

      // 3. ELEMENT RESIZING
      if (isResizing && singleElement) {
        const dx = (e.clientX - dragStart.x) / scale;
        const dy = (e.clientY - dragStart.y) / scale;
        const startPos = elementsStartPositions[singleElement.id];
        if (!startPos) return;

        let { x, y, width, height } = startPos;

        if (isResizing.includes('e')) width = Math.max(20, width + dx);
        if (isResizing.includes('s')) height = Math.max(20, height + dy);
        if (isResizing.includes('w')) {
          const newW = Math.max(20, width - dx);
          x = x + (width - newW);
          width = newW;
        }
        if (isResizing.includes('n')) {
          const newH = Math.max(20, height - dy);
          y = y + (height - newH);
          height = newH;
        }

        if (viewportMode === 'mobile') {
          onUpdateElement(singleElement.id, {
            style: {
              ...singleElement.style,
              x: Math.round(x),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            }
          });
        } else {
          onUpdateElement(
            singleElement.id,
            setElementResponsiveOverride(singleElement, viewportMode, {
              x: Math.round(x),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            })
          );
        }
        return;
      }

      // 4. ELEMENT ROTATING
      if (isRotating && singleElement) {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        const startPos = elementsStartPositions[singleElement.id];
        if (canvasRect && startPos) {
          const centerX = canvasRect.left + (startPos.x + startPos.width / 2) * scale;
          const centerY = canvasRect.top + (startPos.y + startPos.height / 2) * scale;
          const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          let deg = Math.round(rad * (180 / Math.PI) + 90);
          if (deg < 0) deg += 360;
          onUpdateElement(singleElement.id, {
            style: { ...singleElement.style, rotation: deg }
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
      setIsRotating(false);
      setIsMarqueeActive(false);
      setMarqueeBox(null);
    };

    if (isDragging || isResizing || isRotating || isMarqueeActive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    isRotating,
    isMarqueeActive,
    marqueeStart,
    dragStart,
    elementsStartPositions,
    singleElement,
    zoomLevel,
    showGrid,
    page.elements,
    onUpdateElement,
    onUpdateMultipleElements,
    onSelectMultipleElements
  ]);

  // Top level elements (not inside a container)
  const topLevelElements = page.elements.filter(el => !el.parentContainerId && !el.isHidden);

  // Calculate collective multi-selection bounding box
  const multiSelectionBounds = (() => {
    if (selectedElements.length <= 1) return null;
    const minX = Math.min(...selectedElements.map(e => e.style.x));
    const minY = Math.min(...selectedElements.map(e => e.style.y));
    const maxX = Math.max(...selectedElements.map(e => e.style.x + e.style.width));
    const maxY = Math.max(...selectedElements.map(e => e.style.y + e.style.height));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  })();

  return (
    <div
      className="relative flex items-center justify-center p-8 min-h-full overflow-auto select-none"
      onClick={() => onSelectElement(null)}
    >
      {/* Design Canvas Board */}
      <div
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        className="canvas-background relative bg-white border border-slate-200 shadow-2xl rounded-2xl transition-all duration-150 origin-top overflow-hidden"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${zoomLevel / 100})`,
          ...getPageBgStyle()
        }}
      >
        {/* Optional Snap Grid */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        )}

        {/* Video Background */}
        {page.background?.type === 'video' && page.background.videoUrl && (
          <video
            src={page.background.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          />
        )}

        {/* Elements Stack */}
        {topLevelElements.map(element => {
          const isSelected = selectedElementIds.includes(element.id);
          const isSoleSelection = isSelected && selectedElementIds.length === 1;
          const { style: resolvedStyle, isHidden: isResolvedHidden } = resolveElementForViewport(element, viewportMode);

          return (
            <div
              key={element.id}
              id={`canvas-elem-${element.id}`}
              className={`absolute cursor-move group transition-shadow ${
                isSelected ? 'z-50' : 'hover:outline hover:outline-1 hover:outline-slate-400/50'
              } ${isResolvedHidden ? 'opacity-40 ring-1 ring-rose-400/50 ring-dashed' : ''}`}
              style={{
                left: `${resolvedStyle.x}px`,
                top: `${resolvedStyle.y}px`,
                width: `${resolvedStyle.width}px`,
                height: `${resolvedStyle.height}px`,
                transform: resolvedStyle.rotation ? `rotate(${resolvedStyle.rotation}deg)` : undefined,
                zIndex: isSelected ? 999 : resolvedStyle.zIndex || 1
              }}
              onMouseDown={e => handleElementMouseDown(e, element)}
              onClick={e => {
                e.stopPropagation();
                if (e.shiftKey || e.metaKey || e.ctrlKey) {
                  onSelectElement(element.id, true);
                } else {
                  onSelectElement(element.id, false);
                }
              }}
            >
              {/* Responsive Hidden Indicator Badge in Editor */}
              {isResolvedHidden && (
                <div className="absolute -top-4 right-0 px-1 py-0.2 bg-rose-600 text-[9px] text-white font-semibold rounded pointer-events-none z-50">
                  Hidden on {viewportMode}
                </div>
              )}

              {/* Element Visual Content */}
              <ElementRenderer
                element={element}
                isEditor={true}
                viewportMode={viewportMode}
                allElements={page.elements}
                onSelectElement={(id) => onSelectElement(id, false)}
                selectedElementId={selectedElementIds[0] || null}
                previewKey={
                  previewAnimationKey && (previewAnimationElementId === element.id || previewAnimationElementId === 'ALL')
                    ? previewAnimationKey
                    : undefined
                }
                forceAnimate={
                  Boolean(previewAnimationKey && (previewAnimationElementId === element.id || previewAnimationElementId === 'ALL'))
                }
              />

              {/* Selection Border for Multi-Select items */}
              {isSelected && selectedElementIds.length > 1 && (
                <div className="absolute inset-0 border-2 border-slate-900 pointer-events-none rounded-[2px]" />
              )}

              {/* Single Selection Bounding Box & 8-point Transform Handles */}
              {isSoleSelection && (
                <div className="absolute inset-0 border-2 border-slate-900 pointer-events-none rounded-[2px] shadow-sm">
                  {/* Floating Action Toolbar */}
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-1 shadow-lg pointer-events-auto z-50 whitespace-nowrap">
                    {/* Quick Test Animation Trigger if element has animation */}
                    {element.animation && element.animation.type !== 'none' && onPreviewAnimation && (
                      <button
                        type="button"
                        title={`Test ${element.animation.type} Animation`}
                        onClick={e => {
                          e.stopPropagation();
                          onPreviewAnimation(element.id);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 rounded-full text-xs font-semibold transition-colors cursor-pointer border border-amber-300"
                      >
                        <Play className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>Animate</span>
                      </button>
                    )}

                    {/* Ungroup button if it's a container / group */}
                    {element.type === 'container' && onUngroup && (
                      <button
                        type="button"
                        title="Ungroup Container (Ctrl+Shift+G)"
                        onClick={e => {
                          e.stopPropagation();
                          onUngroup(element.id);
                        }}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Ungroup className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      title="Duplicate (Ctrl+D)"
                      onClick={e => {
                        e.stopPropagation();
                        onDuplicateElement(element.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Bring to Front (Ctrl+Shift+])"
                      onClick={e => {
                        e.stopPropagation();
                        onBringToFront(element.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowUpToLine className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Bring Forward (Ctrl+])"
                      onClick={e => {
                        e.stopPropagation();
                        onBringForward(element.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Send Backward (Ctrl+[)"
                      onClick={e => {
                        e.stopPropagation();
                        onSendBackward(element.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Send to Back (Ctrl+Shift+[)"
                      onClick={e => {
                        e.stopPropagation();
                        onSendToBack(element.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title={element.isLocked ? 'Unlock Element' : 'Lock Element'}
                      onClick={e => {
                        e.stopPropagation();
                        if (onToggleLockElement) {
                          onToggleLockElement(element.id);
                        } else {
                          onUpdateElement(element.id, { isLocked: !element.isLocked });
                        }
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {element.isLocked ? (
                        <Unlock className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Delete (Delete / Backspace)"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteElement(element.id);
                      }}
                      className="p-1 hover:bg-rose-50 rounded-full text-slate-600 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Rotation Handle */}
                  {!element.isLocked && (
                    <>
                      <div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-2 border-white rounded-full cursor-grab pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform shadow"
                        onMouseDown={handleRotateStart}
                        title="Rotate Element"
                      >
                        <RotateCw className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-900" />

                      {/* 8-Point Resize Knobs */}
                      {/* NW */}
                      <div
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'nw')}
                      />
                      {/* N */}
                      <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'n')}
                      />
                      {/* NE */}
                      <div
                        className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'ne')}
                      />
                      {/* E */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'e')}
                      />
                      {/* SE */}
                      <div
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'se')}
                      />
                      {/* S */}
                      <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 's')}
                      />
                      {/* SW */}
                      <div
                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'sw')}
                      />
                      {/* W */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-sm cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={e => handleResizeStart(e, 'w')}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Collective Multi-Selection Outer Bounding Box & Toolbar */}
        {multiSelectionBounds && (
          <div
            className="absolute border border-dashed border-slate-900 pointer-events-none z-50"
            style={{
              left: `${multiSelectionBounds.x - 4}px`,
              top: `${multiSelectionBounds.y - 4}px`,
              width: `${multiSelectionBounds.width + 8}px`,
              height: `${multiSelectionBounds.height + 8}px`
            }}
          >
            {/* Floating Multi-Selection Actions Bar */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900 text-white rounded-full px-3 py-1 shadow-2xl pointer-events-auto whitespace-nowrap">
              <span className="text-[11px] font-medium pr-1 border-r border-slate-700 text-slate-300">
                {selectedElements.length} items
              </span>

              {/* Group */}
              {onGroup && (
                <button
                  type="button"
                  title="Group Selection (Ctrl+G)"
                  onClick={e => {
                    e.stopPropagation();
                    onGroup();
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 hover:bg-slate-800 rounded-full text-xs text-white transition-colors"
                >
                  <Group className="w-3.5 h-3.5" />
                  <span>Group</span>
                </button>
              )}

              {/* Alignment shortcuts */}
              {onAlign && (
                <div className="flex items-center gap-0.5 border-l border-r border-slate-700 px-1">
                  <button
                    type="button"
                    title="Align Left"
                    onClick={e => {
                      e.stopPropagation();
                      onAlign('left');
                    }}
                    className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Align Center"
                    onClick={e => {
                      e.stopPropagation();
                      onAlign('center');
                    }}
                    className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Align Right"
                    onClick={e => {
                      e.stopPropagation();
                      onAlign('right');
                    }}
                    className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Duplicate */}
              <button
                type="button"
                title="Duplicate All (Ctrl+D)"
                onClick={e => {
                  e.stopPropagation();
                  onDuplicateElement(selectedElementIds);
                }}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                title="Delete All (Delete)"
                onClick={e => {
                  e.stopPropagation();
                  onDeleteElement(selectedElementIds);
                }}
                className="p-1 hover:bg-rose-950 rounded-full text-slate-300 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Marquee Selection Drag Box */}
        {marqueeBox && isMarqueeActive && (
          <div
            className="absolute border border-slate-900 bg-slate-900/10 pointer-events-none z-50 rounded-sm"
            style={{
              left: `${marqueeBox.x}px`,
              top: `${marqueeBox.y}px`,
              width: `${marqueeBox.width}px`,
              height: `${marqueeBox.height}px`
            }}
          />
        )}
      </div>
    </div>
  );
};
