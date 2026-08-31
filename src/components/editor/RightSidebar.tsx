import React, { useState } from 'react';
import {
  CanvasElement,
  InvitationPage,
  ContainerShape,
  AnimationType,
  BackgroundType,
  InvitationTheme,
  ElementType
} from '../../types';
import { GOOGLE_FONTS_LIST } from '../../data/stockAssets';
import { ContainerInspector } from './ContainerInspector';
import { ResponsiveInspector } from './inspectors/ResponsiveInspector';
import { TextInspector } from './inspectors/TextInspector';
import { ImageInspector } from './inspectors/ImageInspector';
import { VideoInspector } from './inspectors/VideoInspector';
import { ButtonInspector } from './inspectors/ButtonInspector';
import { AudioInspector } from './inspectors/AudioInspector';
import { IconShapeDividerInspector } from './inspectors/IconShapeDividerInspector';
import { InvitationElementsInspector } from './inspectors/InvitationElementsInspector';
import { AnimationInspector } from './inspectors/AnimationInspector';
import { PAGE_TRANSITIONS } from '../../utils/animationUtils';
import {
  Sliders,
  Type,
  Sparkles,
  Layers,
  Shapes,
  Palette,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Clock,
  RotateCw,
  Move,
  Layout,
  Maximize2,
  Calendar,
  Heart,
  ArrowUpRight,
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
  Lock,
  Unlock
} from 'lucide-react';

interface RightSidebarProps {
  selectedElements?: CanvasElement[];
  selectedElement: CanvasElement | null;
  page: InvitationPage;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateMultipleElements?: (updatesMap: Record<string, Partial<CanvasElement>>) => void;
  onUpdatePage: (updates: Partial<InvitationPage>) => void;
  onDeleteElement: (idOrIds: string | string[]) => void;
  onDuplicateElement: (idOrIds: string | string[]) => void;
  onToggleLockElement?: (idOrIds: string | string[], forceLock?: boolean) => void;
  onToggleHideElement?: (idOrIds: string | string[], forceHide?: boolean) => void;
  onBringForward?: (idOrIds: string | string[]) => void;
  onSendBackward?: (idOrIds: string | string[]) => void;
  onBringToFront?: (idOrIds: string | string[]) => void;
  onSendToBack?: (idOrIds: string | string[]) => void;
  onGroup?: (ids?: string[]) => void;
  onUngroup?: (id?: string) => void;
  onAlign?: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute?: (axis: 'horizontal' | 'vertical') => void;
  onAddElement?: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  onDetachFromContainer?: (id: string) => void;
  onSelectElement?: (id: string | null) => void;
  theme: InvitationTheme;
  onUpdateTheme: (updates: Partial<InvitationTheme>) => void;
  currentInvitationId?: string;
  businessId?: string;
  onPreviewAnimation?: (elementId: string) => void;
  onPreviewPageAnimations?: () => void;
  viewportMode?: 'mobile' | 'tablet' | 'desktop';
  onChangeViewport?: (mode: 'mobile' | 'tablet' | 'desktop') => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedElements = [],
  selectedElement,
  page,
  onUpdateElement,
  onUpdateMultipleElements,
  onUpdatePage,
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
  onAlign,
  onDistribute,
  onAddElement,
  onDetachFromContainer,
  onSelectElement,
  theme,
  onUpdateTheme,
  currentInvitationId,
  businessId,
  onPreviewAnimation,
  onPreviewPageAnimations,
  viewportMode = 'mobile',
  onChangeViewport
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'responsive' | 'content' | 'animation' | 'container'>('style');

  const shapes: Array<{ id: ContainerShape; label: string }> = [
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'rounded-rectangle', label: 'Rounded Rect' },
    { id: 'circle', label: 'Circle' },
    { id: 'square', label: 'Square' },
    { id: 'oval', label: 'Oval' },
    { id: 'arch', label: 'Arch Window' },
    { id: 'ticket', label: 'VIP Ticket' },
    { id: 'diamond', label: 'Diamond' },
    { id: 'hexagon', label: 'Hexagon' },
    { id: 'heart', label: 'Heart' },
    { id: 'scallop', label: 'Scalloped' },
    { id: 'shield', label: 'Shield' },
    { id: 'wave', label: 'Wave' },
    { id: 'ribbon', label: 'Ribbon' }
  ];

  const animations: Array<{ id: AnimationType; label: string }> = [
    { id: 'none', label: 'None' },
    { id: 'fadeIn', label: 'Fade In' },
    { id: 'slideUp', label: 'Slide Up' },
    { id: 'slideDown', label: 'Slide Down' },
    { id: 'slideLeft', label: 'Slide Left' },
    { id: 'slideRight', label: 'Slide Right' },
    { id: 'zoomIn', label: 'Zoom In' },
    { id: 'zoomOut', label: 'Zoom Out' },
    { id: 'bounce', label: 'Gentle Bounce' },
    { id: 'float', label: 'Floating Loop' },
    { id: 'pulse', label: 'Subtle Pulse' },
    { id: 'rotate', label: 'Slow Rotation' }
  ];

  // MULTI-SELECTION INSPECTOR
  if (selectedElements.length > 1) {
    const selectedIds = selectedElements.map(e => e.id);
    const anyLocked = selectedElements.some(e => e.isLocked);
    const anyHidden = selectedElements.some(e => e.isHidden);

    return (
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none text-slate-800">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
              {selectedElements.length}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multiple Items
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Bulk canvas actions</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Duplicate All (Ctrl+D)"
              onClick={() => onDuplicateElement(selectedIds)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Delete All (Delete)"
              onClick={() => onDeleteElement(selectedIds)}
              className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-600 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Group Action Banner */}
          {onGroup && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-[11px]">Group as Container</span>
                <span className="text-[10px] font-mono text-slate-400">Ctrl+G</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Combine selected elements into a single container block that moves and scales together.
              </p>
              <button
                type="button"
                onClick={() => onGroup(selectedIds)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Group className="w-3.5 h-3.5" />
                <span>Group Selected Elements</span>
              </button>
            </div>
          )}

          {/* Alignment Tools */}
          {onAlign && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Align Selection
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onAlign('left')}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlign('center')}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlign('right')}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Right</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlign('top')}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Align Top"
                >
                  <ArrowUpToLine className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Top</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlign('middle')}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Align Middle"
                >
                  <AlignJustify className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Middle</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlign('bottom')}
                  className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Align Bottom"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Bottom</span>
                </button>
              </div>
            </div>
          )}

          {/* Distribution Tools */}
          {onDistribute && selectedElements.length >= 3 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Distribute Spacing
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onDistribute('horizontal')}
                  className="py-2 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer text-center"
                >
                  Distribute Horizontally
                </button>
                <button
                  type="button"
                  onClick={() => onDistribute('vertical')}
                  className="py-2 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer text-center"
                >
                  Distribute Vertically
                </button>
              </div>
            </div>
          )}

          {/* Layer Ordering Controls */}
          {(onBringForward || onSendBackward || onBringToFront || onSendToBack) && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Layer Ordering
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {onBringToFront && (
                  <button
                    type="button"
                    onClick={() => onBringToFront(selectedIds)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <ArrowUpToLine className="w-3.5 h-3.5" />
                    <span>Bring to Front</span>
                  </button>
                )}
                {onBringForward && (
                  <button
                    type="button"
                    onClick={() => onBringForward(selectedIds)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Bring Forward</span>
                  </button>
                )}
                {onSendBackward && (
                  <button
                    type="button"
                    onClick={() => onSendBackward(selectedIds)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Send Backward</span>
                  </button>
                )}
                {onSendToBack && (
                  <button
                    type="button"
                    onClick={() => onSendToBack(selectedIds)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Send to Back</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bulk Style Adjustments */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Bulk Adjustments
            </span>

            {/* Bulk Opacity */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                <span>Collective Opacity</span>
                <span className="font-mono text-slate-800 font-medium">
                  {Math.round((selectedElements[0]?.style.opacity ?? 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={selectedElements[0]?.style.opacity ?? 1}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updates: Record<string, Partial<CanvasElement>> = {};
                  selectedElements.forEach(el => {
                    updates[el.id] = { style: { ...el.style, opacity: val } };
                  });
                  if (onUpdateMultipleElements) {
                    onUpdateMultipleElements(updates);
                  }
                }}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* Bulk Lock & Hide */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onToggleLockElement) {
                    onToggleLockElement(selectedIds, !anyLocked);
                  }
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
              >
                {anyLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{anyLocked ? 'Unlock All' : 'Lock All'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onToggleHideElement) {
                    onToggleHideElement(selectedIds, !anyHidden);
                  }
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
              >
                {anyHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{anyHidden ? 'Show All' : 'Hide All'}</span>
              </button>
            </div>
          </div>

          {/* List of Selected Elements */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Selected Elements ({selectedElements.length})
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {selectedElements.map((el) => (
                <div
                  key={el.id}
                  onClick={() => onSelectElement && onSelectElement(el.id)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {el.name || el.type}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">{el.type}</div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    {el.isLocked && <Lock className="w-3 h-3 text-amber-600" />}
                    {el.isHidden && <EyeOff className="w-3 h-3 text-slate-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedElement) {
    // Page & Global Settings Inspector
    return (
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none text-slate-800">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Page & Theme Settings</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Page Info */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
              Page Title
            </label>
            <input
              type="text"
              value={page.name}
              onChange={(e) => onUpdatePage({ name: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Page Height Configuration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">Page Height Mode</span>
              <span className="text-slate-900 font-mono font-medium text-[11px]">
                {page.heightMode === 'viewport' || page.isFullHeight
                  ? 'Viewport (100vh)'
                  : page.heightMode === 'auto'
                  ? 'Auto Height'
                  : `${page.height || 844}px`}
              </span>
            </div>

            {/* Height Mode Selector */}
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => onUpdatePage({ heightMode: 'viewport', isFullHeight: true, height: 844 })}
                className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  page.heightMode === 'viewport' || page.isFullHeight
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Viewport
              </button>
              <button
                type="button"
                onClick={() => onUpdatePage({ heightMode: 'auto', isFullHeight: false })}
                className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  page.heightMode === 'auto'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => onUpdatePage({ heightMode: 'custom', isFullHeight: false, height: page.height || 844 })}
                className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  page.heightMode === 'custom' || (!page.heightMode && !page.isFullHeight)
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Custom Px
              </button>
            </div>

            {/* Custom Height Slider & Presets if custom */}
            {(page.heightMode === 'custom' || (!page.heightMode && !page.isFullHeight)) && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="400"
                    max="2000"
                    step="20"
                    value={page.height || 844}
                    onChange={(e) => onUpdatePage({ height: Number(e.target.value), heightMode: 'custom' })}
                    className="flex-1 accent-slate-900"
                  />
                  <input
                    type="number"
                    min="400"
                    max="3000"
                    value={page.height || 844}
                    onChange={(e) => onUpdatePage({ height: Number(e.target.value), heightMode: 'custom' })}
                    className="w-16 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-center"
                  />
                </div>

                <div className="flex gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => onUpdatePage({ height: 844, heightMode: 'custom' })}
                    className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Mobile (844px)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePage({ height: 1100, heightMode: 'custom' })}
                    className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Medium (1100px)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePage({ height: 1500, heightMode: 'custom' })}
                    className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Long (1500px)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Page Background */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Page Background
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">
                {page.background?.type || 'color'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[11px]">
              {(['color', 'gradient', 'image', 'video'] as BackgroundType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdatePage({
                    background: {
                      ...page.background,
                      type: t,
                      color: page.background?.color || '#071912',
                      videoUrl: t === 'video' ? (page.background?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4') : page.background?.videoUrl,
                      imageUrl: t === 'image' ? (page.background?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80') : page.background?.imageUrl
                    }
                  })}
                  className={`py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer text-center ${
                    page.background?.type === t ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* COLOR BACKGROUND */}
            {page.background?.type === 'color' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={page.background.color || '#071912'}
                    onChange={(e) => onUpdatePage({
                      background: { ...page.background, color: e.target.value }
                    })}
                    className="w-8 h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={page.background.color || '#071912'}
                    onChange={(e) => onUpdatePage({
                      background: { ...page.background, color: e.target.value }
                    })}
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>

                {/* Quick Color Palette swatches */}
                <div className="flex items-center gap-1.5 pt-1">
                  {['#071912', '#0f172a', '#18181b', '#1a1625', '#f8fafc', '#fffbeb', '#faf5ff', '#fff1f2'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onUpdatePage({ background: { ...page.background, color: c } })}
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* GRADIENT BACKGROUND */}
            {page.background?.type === 'gradient' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Color 1:</span>
                    <input
                      type="color"
                      value={page.background.gradient?.colors?.[0] || '#071912'}
                      onChange={(e) => {
                        const colors = [...(page.background?.gradient?.colors || ['#071912', '#0f382a'])];
                        colors[0] = e.target.value;
                        onUpdatePage({
                          background: { ...page.background, gradient: { ...page.background?.gradient, type: page.background?.gradient?.type || 'linear', colors, angle: page.background?.gradient?.angle || 180 } }
                        });
                      }}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Color 2:</span>
                    <input
                      type="color"
                      value={page.background.gradient?.colors?.[1] || '#0f382a'}
                      onChange={(e) => {
                        const colors = [...(page.background?.gradient?.colors || ['#071912', '#0f382a'])];
                        colors[1] = e.target.value;
                        onUpdatePage({
                          background: { ...page.background, gradient: { ...page.background?.gradient, type: page.background?.gradient?.type || 'linear', colors, angle: page.background?.gradient?.angle || 180 } }
                        });
                      }}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Gradient Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Luxury Gradient Presets:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { name: 'Emerald Night', colors: ['#071912', '#0b261b'] },
                      { name: 'Royal Gold', colors: ['#1c160c', '#382e16'] },
                      { name: 'Midnight Blue', colors: ['#090d16', '#1e293b'] },
                      { name: 'Rose Romance', colors: ['#1e0f14', '#3b1d28'] }
                    ].map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => onUpdatePage({
                          background: {
                            ...page.background,
                            type: 'gradient',
                            gradient: { type: 'linear', colors: preset.colors, angle: 180 }
                          }
                        })}
                        className="h-7 rounded-md border border-slate-300 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* IMAGE BACKGROUND */}
            {page.background?.type === 'image' && (
              <div className="space-y-2">
                <label className="text-[11px] text-slate-600 block font-medium">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={page.background.imageUrl || ''}
                  onChange={(e) => onUpdatePage({
                    background: { ...page.background, imageUrl: e.target.value }
                  })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                />

                {/* Preset background images */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Background Presets:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: 'Botanical', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Luxury Hall', url: 'https://images.unsplash.com/photo-1519225429780-e37d8001712a?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Gold Texture', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' }
                    ].map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => onUpdatePage({ background: { ...page.background, imageUrl: p.url } })}
                        className="p-1 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 truncate cursor-pointer text-slate-700"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO BACKGROUND */}
            {page.background?.type === 'video' && (
              <div className="space-y-2">
                <label className="text-[11px] text-slate-600 block font-medium">Video URL (MP4 / WebM)</label>
                <input
                  type="text"
                  placeholder="https://assets.mixkit.co/..."
                  value={page.background.videoUrl || ''}
                  onChange={(e) => onUpdatePage({
                    background: { ...page.background, videoUrl: e.target.value }
                  })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                />

                {/* Preset ambient background video */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Preset Ambient Videos:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdatePage({
                        background: {
                          ...page.background,
                          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4'
                        }
                      })}
                      className="p-1.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 cursor-pointer font-medium"
                    >
                      ✨ Golden Bokeh
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdatePage({
                        background: {
                          ...page.background,
                          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-silk-fabric-waving-in-the-wind-41484-large.mp4'
                        }
                      })}
                      className="p-1.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 cursor-pointer font-medium"
                    >
                      🕊️ Silk Flow
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Palette */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
              Global Color Palette
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-600 block mb-1">Primary Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={theme.primaryColor || '#0f172a'}
                    onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                    className="w-6 h-6 rounded border border-slate-200 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-800">{theme.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-1">Secondary Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={theme.secondaryColor || '#475569'}
                    onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                    className="w-6 h-6 rounded border border-slate-200 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-800">{theme.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE TRANSITION & ANIMATION SETTINGS */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Page Transition & Motion
              </span>
              {onPreviewPageAnimations && (
                <button
                  type="button"
                  onClick={onPreviewPageAnimations}
                  className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded text-[10px] font-bold cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Replay Page</span>
                </button>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Page Transition Style</label>
              <select
                value={page.transition?.type || 'fade'}
                onChange={(e) => onUpdatePage({
                  transition: {
                    ...page.transition,
                    type: e.target.value as any,
                    duration: page.transition?.duration || 0.6
                  }
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {PAGE_TRANSITIONS.map((trans) => (
                  <option key={trans.id} value={trans.id}>
                    {trans.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600 mb-1">
                <span>Transition Duration</span>
                <span className="font-mono text-slate-800">{page.transition?.duration || 0.6}s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={page.transition?.duration || 0.6}
                onChange={(e) => onUpdatePage({
                  transition: {
                    type: page.transition?.type || 'fade',
                    duration: Number(e.target.value)
                  }
                })}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Selected Element Inspector
  const { style, content, animation } = selectedElement;
  const parentId = selectedElement.parentContainerId || selectedElement.parentId;
  const parentElement = parentId ? page.elements.find(el => el.id === parentId) : null;

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none text-slate-800">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <div className="truncate pr-2">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
            {selectedElement.name || selectedElement.type}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span className="capitalize">{selectedElement.type}</span>
            {selectedElement.isLocked && (
              <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1 rounded">
                Locked
              </span>
            )}
            {selectedElement.isHidden && (
              <span className="text-[9px] bg-slate-200 text-slate-700 font-semibold px-1 rounded">
                Hidden
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            title={selectedElement.isLocked ? 'Unlock Element' : 'Lock Element'}
            onClick={() => {
              if (onToggleLockElement) {
                onToggleLockElement(selectedElement.id);
              } else {
                onUpdateElement(selectedElement.id, { isLocked: !selectedElement.isLocked });
              }
            }}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {selectedElement.isLocked ? (
              <Unlock className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            title={selectedElement.isHidden ? 'Show Element' : 'Hide Element'}
            onClick={() => {
              if (onToggleHideElement) {
                onToggleHideElement(selectedElement.id);
              } else {
                onUpdateElement(selectedElement.id, { isHidden: !selectedElement.isHidden });
              }
            }}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {selectedElement.isHidden ? (
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            title="Duplicate (Ctrl+D)"
            onClick={() => onDuplicateElement(selectedElement.id)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete (Delete / Backspace)"
            onClick={() => onDeleteElement(selectedElement.id)}
            className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Parent Container Breadcrumb Banner */}
      {parentElement && (
        <div className="px-3 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-indigo-950 text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span className="truncate">
              Inside <strong className="font-semibold">{parentElement.name || 'Container'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onSelectElement && (
              <button
                type="button"
                onClick={() => onSelectElement(parentElement.id)}
                title="Select Parent Container"
                className="p-1 hover:bg-indigo-100 rounded text-indigo-700 transition-colors cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onDetachFromContainer && (
              <button
                type="button"
                onClick={() => onDetachFromContainer(selectedElement.id)}
                title="Detach to Page"
                className="px-1.5 py-0.5 text-[10px] bg-white border border-indigo-200 hover:bg-indigo-100 rounded text-indigo-700 font-medium transition-colors cursor-pointer"
              >
                Detach
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`grid ${selectedElement.type === 'container' ? 'grid-cols-5' : 'grid-cols-4'} border-b border-slate-200 bg-slate-50/80 text-[11px] font-medium text-center`}>
        {[
          ...(selectedElement.type === 'container' ? [{ id: 'container', label: 'Container' }] : []),
          { id: 'style', label: 'Style' },
          { id: 'responsive', label: 'Responsive' },
          { id: 'content', label: 'Content' },
          { id: 'animation', label: 'Animation' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-slate-900 text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* CONTAINER TAB (For Container Blocks) */}
        {activeTab === 'container' && selectedElement.type === 'container' && (
          <ContainerInspector
            element={selectedElement}
            allElements={page.elements}
            onUpdateElement={onUpdateElement}
            onDeleteElement={onDeleteElement}
            onDuplicateElement={onDuplicateElement}
            onAddChildElement={onAddElement}
            onDetachFromContainer={onDetachFromContainer}
            onSelectElement={onSelectElement}
          />
        )}

        {/* RESPONSIVE TAB */}
        {activeTab === 'responsive' && (
          <ResponsiveInspector
            element={selectedElement}
            onUpdateElement={onUpdateElement}
            activeViewportMode={viewportMode}
            onChangeActiveViewport={onChangeViewport}
          />
        )}
        {/* STYLE TAB */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Position & Size */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Transform & Bounds
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block">X Pos</label>
                  <input
                    type="number"
                    value={style.x}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, x: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Y Pos</label>
                  <input
                    type="number"
                    value={style.y}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, y: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Width</label>
                  <input
                    type="number"
                    value={style.width}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, width: Math.max(10, Number(e.target.value)) }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Height</label>
                  <input
                    type="number"
                    value={style.height}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, height: Math.max(10, Number(e.target.value)) }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Rotation (°)</label>
                  <input
                    type="number"
                    value={style.rotation || 0}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, rotation: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Opacity</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={style.opacity ?? 1}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, opacity: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Layer Ordering Buttons */}
              {(onBringForward || onSendBackward || onBringToFront || onSendToBack) && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-semibold text-slate-600 block">Layer Ordering</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {onBringToFront && (
                      <button
                        type="button"
                        onClick={() => onBringToFront(selectedElement.id)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        title="Bring to Front (Ctrl+Shift+])"
                      >
                        <ArrowUpToLine className="w-3 h-3" />
                        <span>Bring to Front</span>
                      </button>
                    )}
                    {onBringForward && (
                      <button
                        type="button"
                        onClick={() => onBringForward(selectedElement.id)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        title="Bring Forward (Ctrl+])"
                      >
                        <ArrowUp className="w-3 h-3" />
                        <span>Forward</span>
                      </button>
                    )}
                    {onSendBackward && (
                      <button
                        type="button"
                        onClick={() => onSendBackward(selectedElement.id)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        title="Send Backward (Ctrl+[)"
                      >
                        <ArrowDown className="w-3 h-3" />
                        <span>Backward</span>
                      </button>
                    )}
                    {onSendToBack && (
                      <button
                        type="button"
                        onClick={() => onSendToBack(selectedElement.id)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        title="Send to Back (Ctrl+Shift+[)"
                      >
                        <ArrowDownToLine className="w-3 h-3" />
                        <span>Send to Back</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Ungroup Container button if type is container */}
              {selectedElement.type === 'container' && onUngroup && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onUngroup(selectedElement.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Ungroup className="w-3.5 h-3.5" />
                    <span>Ungroup Container (Release Elements)</span>
                  </button>
                </div>
              )}
            </div>

            {/* TYPE-SPECIFIC STYLING */}
            {['heading', 'text', 'paragraph'].includes(selectedElement.type) && (
              <TextInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {selectedElement.type === 'image' && (
              <ImageInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {selectedElement.type === 'video' && (
              <VideoInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {selectedElement.type === 'button' && (
              <ButtonInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {selectedElement.type === 'audio' && (
              <AudioInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {['icon', 'shape', 'divider'].includes(selectedElement.type) && (
              <IconShapeDividerInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {['event-date', 'event-time', 'countdown', 'calendar', 'venue', 'google-maps', 'timeline', 'photo-gallery', 'whatsapp-button', 'qr-code', 'rsvp-form', 'guestbook', 'couple-names'].includes(selectedElement.type) && (
              <InvitationElementsInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {/* Container Shape Properties */}
            {selectedElement.type === 'container' && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
                  Container Shape & Masking
                </span>

                {/* Shape selection */}
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Shape Silhouette</label>
                  <select
                    value={style.shape || 'rectangle'}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, shape: e.target.value as ContainerShape }
                    })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                  >
                    {shapes.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clip mask toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Clip / Mask Children</div>
                    <div className="text-[10px] text-slate-500">Crops child image/video inside shape</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={style.clipMask !== false}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      style: { ...style, clipMask: e.target.checked }
                    })}
                    className="w-4 h-4 accent-slate-900"
                  />
                </div>

                {/* Border and Colors */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Border Width (px)</label>
                    <input
                      type="number"
                      value={style.borderWidth || 0}
                      onChange={(e) => onUpdateElement(selectedElement.id, {
                        style: { ...style, borderWidth: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Border Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={style.borderColor || '#cbd5e1'}
                        onChange={(e) => onUpdateElement(selectedElement.id, {
                          style: { ...style, borderColor: e.target.value }
                        })}
                        className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={style.borderColor || '#cbd5e1'}
                        onChange={(e) => onUpdateElement(selectedElement.id, {
                          style: { ...style, borderColor: e.target.value }
                        })}
                        className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Fill Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.backgroundColor || '#f8fafc'}
                      onChange={(e) => onUpdateElement(selectedElement.id, {
                        style: { ...style, backgroundColor: e.target.value }
                      })}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={style.backgroundColor || '#f8fafc'}
                      onChange={(e) => onUpdateElement(selectedElement.id, {
                        style: { ...style, backgroundColor: e.target.value }
                      })}
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-4 text-xs">
            {['heading', 'text', 'paragraph'].includes(selectedElement.type) && (
              <TextInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {selectedElement.type === 'image' && (
              <ImageInspector
                element={selectedElement}
                onUpdateElement={onUpdateElement}
                currentInvitationId={currentInvitationId}
                businessId={businessId}
              />
            )}

            {selectedElement.type === 'video' && (
              <VideoInspector
                element={selectedElement}
                onUpdateElement={onUpdateElement}
                currentInvitationId={currentInvitationId}
                businessId={businessId}
              />
            )}

            {selectedElement.type === 'button' && (
              <ButtonInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {selectedElement.type === 'audio' && (
              <AudioInspector
                element={selectedElement}
                onUpdateElement={onUpdateElement}
                currentInvitationId={currentInvitationId}
                businessId={businessId}
              />
            )}

            {['icon', 'shape', 'divider'].includes(selectedElement.type) && (
              <IconShapeDividerInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}

            {['event-date', 'event-time', 'countdown', 'calendar', 'venue', 'google-maps', 'timeline', 'photo-gallery', 'whatsapp-button', 'qr-code', 'rsvp-form', 'guestbook', 'couple-names'].includes(selectedElement.type) && (
              <InvitationElementsInspector element={selectedElement} onUpdateElement={onUpdateElement} />
            )}
          </div>
        )}

        {/* ANIMATION TAB */}
        {activeTab === 'animation' && (
          <AnimationInspector
            element={selectedElement}
            onUpdateElement={onUpdateElement}
            onPreviewAnimation={onPreviewAnimation}
          />
        )}
      </div>
    </div>
  );
};
