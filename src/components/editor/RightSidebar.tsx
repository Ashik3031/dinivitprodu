import React, { useState } from 'react';
import {
  CanvasElement,
  InvitationPage,
  ContainerShape,
  AnimationType,
  BackgroundType,
  InvitationTheme,
  ElementType,
  OpeningScreenConfig,
  ViewportMode,
  OuterDropEffectType
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
import { InvitationStyleInspector } from './inspectors/InvitationStyleInspector';
import { InvitationDesignInspector } from './inspectors/InvitationDesignInspector';
import { copyElementStyle, getCopiedStyle } from '../../utils/colorUtils';
import { OpeningScreenInspector } from './inspectors/OpeningScreenInspector';
import { AnimationInspector } from './inspectors/AnimationInspector';
import { PAGE_TRANSITIONS } from '../../utils/animationUtils';
import { getPageCalculatedHeight } from '../../utils/responsiveUtils';
import { useToast } from '../../context/ToastContext';
import { BackgroundAssetPickerModal } from '../media/BackgroundAssetPickerModal';
import { DEFAULT_BACKGROUND_ADJUSTMENTS } from '../../utils/backgroundStyles';
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
  RotateCcw,
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
  Unlock,
  Mail,
  MailOpen,
  ChevronDown,
  ChevronUp,
  Paintbrush,
  Check,
  FolderOpen,
  Image as ImageIcon,
  Video,
  ZoomIn,
  RefreshCw,
  X
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
  onApplyThemeToAllPages?: () => void;
  currentInvitationId?: string;
  businessId?: string;
  onPreviewAnimation?: (elementId: string) => void;
  onPreviewPageAnimations?: () => void;
  viewportMode?: ViewportMode;
  onChangeViewport?: (mode: ViewportMode) => void;
  isOpeningScreen?: boolean;
  openingScreenConfig?: OpeningScreenConfig;
  onUpdateOpeningScreen?: (updates: Partial<OpeningScreenConfig>) => void;
  onTestOpeningScreen?: () => void;
  activeSpecialInspector?: 'canvas-decorations' | null;
  onCloseSpecialInspector?: () => void;
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
  viewportMode = 'mobile' as ViewportMode,
  onChangeViewport,
  isOpeningScreen = false,
  openingScreenConfig,
  onUpdateOpeningScreen,
  onTestOpeningScreen,
  onApplyThemeToAllPages,
  activeSpecialInspector,
  onCloseSpecialInspector
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'design' | 'responsive' | 'animation' | 'container'>('design');
  const [copiedStyleSuccess, setCopiedStyleSuccess] = useState(false);

  // Accordion states for Page & Theme Settings (collapsed by default)
  const [isAdvancedDimensionsOpen, setIsAdvancedDimensionsOpen] = useState(false);
  const [isAdvancedBackgroundOpen, setIsAdvancedBackgroundOpen] = useState(false);
  const [isThemeColorsOpen, setIsThemeColorsOpen] = useState(false);
  const [isPageAnimationOpen, setIsPageAnimationOpen] = useState(false);
  const [isAdvancedMotionOpen, setIsAdvancedMotionOpen] = useState(false);

  // Background Asset Picker State & Controls
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [assetPickerMode, setAssetPickerMode] = useState<'image' | 'video'>('image');
  const [isCustomPositionOpen, setIsCustomPositionOpen] = useState(false);

  const handleOpenAssetPicker = (mode: 'image' | 'video' = 'image') => {
    setAssetPickerMode(mode);
    setIsAssetPickerOpen(true);
  };

  const handleSelectBackground = (url: string, asset?: any) => {
    if (assetPickerMode === 'video') {
      onUpdatePage({
        background: {
          ...page.background,
          type: 'video',
          videoUrl: url
        }
      });
    } else {
      onUpdatePage({
        background: {
          ...page.background,
          type: 'image',
          imageUrl: url,
          size: page.background?.size || 'cover',
          position: page.background?.position || 'center',
          repeat: page.background?.repeat || 'no-repeat'
        }
      });
    }
    toast.success('Background applied successfully.');
    setIsAssetPickerOpen(false);
  };

  const handleResetAdjustments = () => {
    if (!page.background?.imageUrl && !page.background?.videoUrl) return;
    onUpdatePage({
      background: {
        ...page.background,
        ...DEFAULT_BACKGROUND_ADJUSTMENTS
      }
    });
    toast.success('Background adjustments reset.');
  };

  const handleRemoveBackground = () => {
    onUpdatePage({
      background: {
        type: 'color',
        color: theme?.backgroundColor || '#f8fafc'
      }
    });
    toast.success('Background removed.');
  };

  const NINE_POSITIONS = [
    { label: 'Top Left', value: 'top left', x: 0, y: 0 },
    { label: 'Top Center', value: 'top center', x: 50, y: 0 },
    { label: 'Top Right', value: 'top right', x: 100, y: 0 },
    { label: 'Center Left', value: 'center left', x: 0, y: 50 },
    { label: 'Center', value: 'center', x: 50, y: 50 },
    { label: 'Center Right', value: 'center right', x: 100, y: 50 },
    { label: 'Bottom Left', value: 'bottom left', x: 0, y: 100 },
    { label: 'Bottom Center', value: 'bottom center', x: 50, y: 100 },
    { label: 'Bottom Right', value: 'bottom right', x: 100, y: 100 }
  ];

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
    // Dedicated Canvas Decorations Inspector (activated from Invitation Elements grid)
    if (activeSpecialInspector === 'canvas-decorations') {
      return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none text-slate-800">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 tracking-tight block">
                  Canvas Decorations
                </span>
                <span className="text-[10px] text-slate-400">Outside Canvas Stage Area</span>
              </div>
            </div>
            {onCloseSpecialInspector && (
              <button
                type="button"
                onClick={onCloseSpecialInspector}
                className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Done
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Customize the outer stage backdrop surrounding your invitation card and floating ambient particle effects.
            </p>

            {/* 1. Outer Canvas Background Color */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/90">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Outer Canvas Background</span>
                <span className="font-mono text-[10.5px] font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {theme?.outerBackgroundColor || openingScreenConfig?.outerBackgroundColor || '#0a0a0a'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme?.outerBackgroundColor || openingScreenConfig?.outerBackgroundColor || '#0a0a0a'}
                  onChange={(e) => {
                    const color = e.target.value;
                    onUpdateTheme?.({ outerBackgroundColor: color });
                    onUpdateOpeningScreen?.({ outerBackgroundColor: color });
                  }}
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent overflow-hidden"
                />
                <input
                  type="text"
                  value={theme?.outerBackgroundColor || openingScreenConfig?.outerBackgroundColor || '#0a0a0a'}
                  onChange={(e) => {
                    const color = e.target.value;
                    onUpdateTheme?.({ outerBackgroundColor: color });
                    onUpdateOpeningScreen?.({ outerBackgroundColor: color });
                  }}
                  placeholder="#0a0a0a"
                  className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              {/* Preset Backdrop Colors */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">
                  Preset Backdrop Colors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Midnight Dark', color: '#0a0a0a' },
                    { name: 'Charcoal', color: '#171717' },
                    { name: 'Slate Navy', color: '#0f172a' },
                    { name: 'Espresso', color: '#1c1917' },
                    { name: 'Deep Wine', color: '#2a080c' },
                    { name: 'Deep Emerald', color: '#071912' },
                    { name: 'Warm Ivory', color: '#fdfbf7' },
                    { name: 'Light Slate', color: '#f1f5f9' }
                  ].map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => {
                        onUpdateTheme?.({ outerBackgroundColor: p.color });
                        onUpdateOpeningScreen?.({ outerBackgroundColor: p.color });
                      }}
                      title={p.name}
                      className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: p.color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Floating Effects */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50/60 via-pink-50/30 to-amber-50/20 border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span className="text-xs font-semibold text-rose-950">
                    Floating Particle Effects
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(theme?.showOuterDrops || openingScreenConfig?.showOuterDrops)}
                  onChange={(e) => {
                    const enable = e.target.checked;
                    const effect = enable ? (theme?.outerDropEffect || openingScreenConfig?.outerDropEffect || 'hearts') : 'none';
                    onUpdateTheme?.({
                      showOuterDrops: enable,
                      outerDropEffect: effect
                    });
                    onUpdateOpeningScreen?.({
                      showOuterDrops: enable,
                      outerDropEffect: effect
                    });
                  }}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {(theme?.showOuterDrops || openingScreenConfig?.showOuterDrops) && (
                <div className="space-y-3 bg-white/90 p-2.5 rounded-lg border border-rose-200/70 text-xs">
                  {/* Drop Symbol Style Dropdown */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                      Effect Style
                    </label>
                    <select
                      value={theme?.outerDropEffect || openingScreenConfig?.outerDropEffect || 'hearts'}
                      onChange={(e) => {
                        const effect = e.target.value as OuterDropEffectType;
                        onUpdateTheme?.({ outerDropEffect: effect, showOuterDrops: true });
                        onUpdateOpeningScreen?.({ outerDropEffect: effect, showOuterDrops: true });
                      }}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:outline-none focus:border-rose-500 font-medium cursor-pointer"
                    >
                      <option value="hearts">❤️ Romantic Hearts</option>
                      <option value="petals">🌸 Rose & Sakura Petals</option>
                      <option value="sparkles">✨ Golden Sparkles</option>
                      <option value="stars">⭐ Starlight Stars</option>
                      <option value="butterflies">🦋 Fluttering Butterflies</option>
                      <option value="leaves">🍃 Botanical Leaves</option>
                      <option value="snow">❄️ Winter Snowflakes</option>
                      <option value="confetti">🎊 Celebration Confetti</option>
                      <option value="bubbles">🫧 Iridescent Bubbles</option>
                      <option value="rings">💍 Wedding Rings & Gems</option>
                    </select>
                  </div>

                  {/* Drop Symbol Color */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-700">Particle Color:</span>
                      <span className="font-mono text-slate-800 font-semibold">
                        {theme?.outerDropColor || openingScreenConfig?.outerDropColor || '#f43f5e'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme?.outerDropColor || openingScreenConfig?.outerDropColor || '#f43f5e'}
                        onChange={(e) => {
                          const color = e.target.value;
                          onUpdateTheme?.({ outerDropColor: color });
                          onUpdateOpeningScreen?.({ outerDropColor: color });
                        }}
                        className="w-7 h-7 rounded border border-rose-300 cursor-pointer p-0 bg-white shadow-2xs"
                      />
                      <div className="flex items-center gap-1.5 flex-1">
                        {[
                          { name: 'Rose Pink', color: '#f43f5e' },
                          { name: 'Gilded Gold', color: '#d4af37' },
                          { name: 'Ruby Red', color: '#e11d48' },
                          { name: 'Soft Blush', color: '#fda4af' },
                          { name: 'Velvet White', color: '#ffffff' }
                        ].map((c) => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => {
                              onUpdateTheme?.({ outerDropColor: c.color });
                              onUpdateOpeningScreen?.({ outerDropColor: c.color });
                            }}
                            title={c.name}
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Page & Global Settings Inspector (or Opening Screen Inspector)
    return (
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none text-slate-800">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOpeningScreen ? (
              <MailOpen className="w-4 h-4 text-amber-600" />
            ) : (
              <Layout className="w-4 h-4 text-slate-700" />
            )}
            <span className="text-sm font-semibold text-slate-900 tracking-tight">
              {isOpeningScreen ? 'Opening Screen' : 'Page Settings'}
            </span>
          </div>
          {isOpeningScreen && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-medium text-amber-800 border border-amber-200">
              Cover
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* Regular Page Title (Hidden on Opening Screen to avoid duplicate title fields) */}
          {!isOpeningScreen && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-500">
                Page Title
              </label>
              <input
                type="text"
                value={page.name}
                onChange={(e) => onUpdatePage({ name: e.target.value })}
                className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="e.g. Save the Date, Ceremony"
              />
            </div>
          )}

          {/* Opening Screen Comprehensive Customizer */}
          {isOpeningScreen && openingScreenConfig && onUpdateOpeningScreen && (
            <OpeningScreenInspector
              config={openingScreenConfig}
              page={page}
              onUpdate={onUpdateOpeningScreen}
              onTestOpeningScreen={onTestOpeningScreen}
              onSelectElement={onSelectElement}
              onAddElement={onAddElement}
              onUpdatePage={onUpdatePage}
            />
          )}

          {/* Standard Page & Global Theme Settings (when not opening screen) */}
          {!isOpeningScreen && (
            <>
              {/* 1. PAGE SETTINGS (Dimensions & Size Presets) */}
              <div className="space-y-3.5">
                {/* Simple Page Size Presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-500">Page Size</label>
                    <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {page.width || 390}px
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'Mobile', width: 390, hint: '390px' },
                      { label: 'Large Mobile', width: 420, hint: '420px' },
                      { label: 'Invitation Card', width: 480, hint: '480px' },
                      { label: 'Tablet', width: 768, hint: '768px' }
                    ].map((preset) => {
                      const isSelected = (page.width || 390) === preset.width;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => onUpdatePage({ width: preset.width })}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                            }`}
                        >
                          <span>{preset.label}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {preset.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Page Height Mode */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-500">Page Height</label>
                    <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {page.heightMode === 'viewport' || (page.isFullHeight && page.heightMode !== 'custom' && page.heightMode !== 'auto')
                        ? `Fit Screen (${getPageCalculatedHeight(page, viewportMode)}px)`
                        : page.heightMode === 'auto'
                          ? `Auto (${getPageCalculatedHeight(page, viewportMode)}px)`
                          : `Custom (${page.height || 844}px)`}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdatePage({
                        heightMode: 'viewport',
                        isFullHeight: true,
                        height: typeof window !== 'undefined' ? window.innerHeight : 844
                      })}
                      className={`py-1.5 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${page.heightMode === 'viewport' || (page.isFullHeight && page.heightMode !== 'custom' && page.heightMode !== 'auto')
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Fit Screen
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdatePage({ heightMode: 'auto', isFullHeight: false })}
                      className={`py-1.5 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${page.heightMode === 'auto'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Auto Height
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdatePage({
                        heightMode: 'custom',
                        isFullHeight: false,
                        height: page.height || 844
                      })}
                      className={`py-1.5 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${page.heightMode === 'custom'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Custom Height
                    </button>
                  </div>
                </div>

                {/* Advanced Dimensions (collapsed accordion) */}
                <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsAdvancedDimensionsOpen(!isAdvancedDimensionsOpen)}
                    className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>Advanced Dimensions</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAdvancedDimensionsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAdvancedDimensionsOpen && (
                    <div className="p-3 pt-1 space-y-3 bg-slate-50/50 border-t border-slate-100 text-xs">
                      {/* Custom Height Slider & Presets */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] text-slate-600">
                          <span>Custom Height (px)</span>
                          <span className="font-mono">{page.height || 844}px</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="400"
                            max="2000"
                            step="20"
                            value={page.height || 844}
                            onChange={(e) => onUpdatePage({ height: Number(e.target.value), heightMode: 'custom', isFullHeight: false })}
                            className="flex-1 accent-slate-900 cursor-pointer"
                          />
                          <input
                            type="number"
                            min="400"
                            max="3000"
                            value={page.height || 844}
                            onChange={(e) => onUpdatePage({ height: Number(e.target.value), heightMode: 'custom', isFullHeight: false })}
                            className="w-16 text-xs bg-white border border-slate-200 rounded p-1 font-mono text-center"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => onUpdatePage({
                              height: typeof window !== 'undefined' ? window.innerHeight : 720,
                              heightMode: 'custom',
                              isFullHeight: false
                            })}
                            className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-700 truncate cursor-pointer"
                            title="Set to screen height"
                          >
                            Fit Screen ({typeof window !== 'undefined' ? window.innerHeight : 720}px)
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePage({ height: 844, heightMode: 'custom', isFullHeight: false })}
                            className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-700 cursor-pointer"
                          >
                            iPhone (844px)
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePage({ height: 1100, heightMode: 'custom', isFullHeight: false })}
                            className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-700 cursor-pointer"
                          >
                            Medium (1100px)
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePage({ height: 1500, heightMode: 'custom', isFullHeight: false })}
                            className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-700 cursor-pointer"
                          >
                            Long (1500px)
                          </button>
                        </div>
                      </div>

                      {/* Custom Width Slider & Inputs */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                        <div className="flex justify-between items-center text-[11px] text-slate-600">
                          <span>Custom Width (px)</span>
                          <span className="font-mono">{page.width || 390}px</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="320"
                            max="850"
                            step="10"
                            value={page.width || 390}
                            onChange={(e) => onUpdatePage({ width: Number(e.target.value) })}
                            className="flex-1 accent-slate-900 cursor-pointer"
                          />
                          <input
                            type="number"
                            min="320"
                            max="950"
                            value={page.width || 390}
                            onChange={(e) => onUpdatePage({ width: Number(e.target.value) })}
                            className="w-16 text-xs bg-white border border-slate-200 rounded p-1 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. BACKGROUND SETTINGS */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 tracking-tight">
                    Background
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-medium">
                    {page.background?.type || 'color'}
                  </span>
                </div>

                {/* 4-segment control */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
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
                      className={`py-1.5 rounded-md capitalize font-medium transition-all cursor-pointer text-center ${(page.background?.type || 'color') === t
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* COLOR BACKGROUND */}
                {(page.background?.type === 'color' || !page.background?.type) && (
                  <div className="space-y-3">
                    {/* Native Color Picker + Hex Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={page.background?.color || '#071912'}
                        onChange={(e) => onUpdatePage({
                          background: { ...page.background, type: 'color', color: e.target.value }
                        })}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                      />
                      <input
                        type="text"
                        value={page.background?.color || '#071912'}
                        onChange={(e) => onUpdatePage({
                          background: { ...page.background, type: 'color', color: e.target.value }
                        })}
                        className="flex-1 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                        placeholder="#071912"
                      />
                    </div>

                    {/* Theme Colors Swatches */}
                    {theme && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Theme Palette</span>
                        <div className="flex items-center gap-2">
                          {[
                            { label: 'Primary', color: theme.primaryColor },
                            { label: 'Secondary', color: theme.secondaryColor },
                            { label: 'Accent', color: theme.accentColor },
                            { label: 'Background', color: theme.backgroundColor }
                          ].filter(t => Boolean(t.color)).map(t => (
                            <button
                              key={t.label}
                              type="button"
                              onClick={() => onUpdatePage({ background: { ...page.background, type: 'color', color: t.color } })}
                              className="group relative flex flex-col items-center cursor-pointer"
                              title={`${t.label}: ${t.color}`}
                            >
                              <div
                                className="w-6 h-6 rounded-full border border-slate-200/80 shadow-2xs hover:scale-110 transition-transform flex items-center justify-center"
                                style={{ backgroundColor: t.color }}
                              >
                                {(page.background?.color?.toLowerCase() === t.color.toLowerCase()) && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attractive Color Swatches Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Color Presets</span>
                      <div className="grid grid-cols-6 gap-2 pt-0.5">
                        {[
                          '#071912', '#0f172a', '#18181b', '#1c1917', '#2a080c', '#382e16',
                          '#f8fafc', '#ffffff', '#fffbeb', '#faf5ff', '#fff1f2', '#f0fdf4',
                          '#c5a059', '#e11d48', '#059669', '#3b82f6', '#8b5cf6', '#d97706'
                        ].map(c => {
                          const isSelected = page.background?.color?.toLowerCase() === c.toLowerCase();
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => onUpdatePage({ background: { ...page.background, type: 'color', color: c } })}
                              className={`w-7 h-7 rounded-full border shadow-2xs hover:scale-110 transition-all cursor-pointer flex items-center justify-center ${isSelected ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-200'
                                }`}
                              style={{ backgroundColor: c }}
                              title={c}
                            >
                              {isSelected && (
                                <div className={`w-1.5 h-1.5 rounded-full ${c === '#ffffff' || c.startsWith('#f') ? 'bg-slate-900' : 'bg-white'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* GRADIENT BACKGROUND */}
                {page.background?.type === 'gradient' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-medium">Color 1</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={page.background.gradient?.colors?.[0] || '#071912'}
                            onChange={(e) => {
                              const colors = [...(page.background?.gradient?.colors || ['#071912', '#0f382a'])];
                              colors[0] = e.target.value;
                              onUpdatePage({
                                background: {
                                  ...page.background,
                                  gradient: { ...page.background?.gradient, type: page.background?.gradient?.type || 'linear', colors, angle: page.background?.gradient?.angle || 180 }
                                }
                              });
                            }}
                            className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <span className="text-xs font-mono text-slate-700">{page.background.gradient?.colors?.[0] || '#071912'}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-medium">Color 2</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={page.background.gradient?.colors?.[1] || '#0f382a'}
                            onChange={(e) => {
                              const colors = [...(page.background?.gradient?.colors || ['#071912', '#0f382a'])];
                              colors[1] = e.target.value;
                              onUpdatePage({
                                background: {
                                  ...page.background,
                                  gradient: { ...page.background?.gradient, type: page.background?.gradient?.type || 'linear', colors, angle: page.background?.gradient?.angle || 180 }
                                }
                              });
                            }}
                            className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <span className="text-xs font-mono text-slate-700">{page.background.gradient?.colors?.[1] || '#0f382a'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Gradient Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Gradient Presets</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: 'Emerald Night', colors: ['#071912', '#0b261b'] },
                          { name: 'Royal Gold', colors: ['#1c160c', '#382e16'] },
                          { name: 'Midnight Blue', colors: ['#090d16', '#1e293b'] },
                          { name: 'Rose Romance', colors: ['#1e0f14', '#3b1d28'] },
                          { name: 'Warm Sunset', colors: ['#fff1f2', '#fecdd3'] },
                          { name: 'Champagne', colors: ['#fdfbf7', '#f5ebe0'] },
                          { name: 'Amethyst', colors: ['#1a0b2e', '#2e1065'] },
                          { name: 'Pure Minimal', colors: ['#ffffff', '#f1f5f9'] }
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
                            className="h-9 rounded-lg border border-slate-200 shadow-2xs hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group"
                            style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                            title={preset.name}
                          >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* IMAGE BACKGROUND */}
                {page.background?.type === 'image' && (
                  <div className="space-y-4">
                    {/* Current Background Preview or Selection Card */}
                    {page.background.imageUrl ? (
                      <div className="p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-14 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0 relative group shadow-2xs">
                            <img
                              src={page.background.imageUrl}
                              alt="Background preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-slate-800 truncate" title={page.background.imageUrl}>
                              {page.background.imageUrl.split('/').pop()?.split('?')[0] || 'Image Background'}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {page.background.imageUrl.includes('http') ? new URL(page.background.imageUrl).hostname : 'Uploaded Asset'}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                              <button
                                type="button"
                                onClick={() => handleOpenAssetPicker('image')}
                                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] font-medium text-slate-700 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <FolderOpen className="w-3 h-3 text-slate-500" />
                                <span>Replace</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveBackground}
                                className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-md text-[10px] font-medium shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                                title="Remove background image"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenAssetPicker('image')}
                          className="w-full py-2 px-3 bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Choose from Asset Library</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAssetPicker('image')}
                          className="w-full py-4 px-3 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center group"
                        >
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                            <FolderOpen className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-indigo-900">Choose from Asset Library</span>
                          <span className="text-[10px] text-slate-500">Pick from Background Images, Stock & Media</span>
                        </button>
                      </div>
                    )}

                    {/* Image URL input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={page.background.imageUrl || ''}
                        onChange={(e) => onUpdatePage({
                          background: { ...page.background, imageUrl: e.target.value }
                        })}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    {/* Curated Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Curated Presets</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'Botanical', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
                          { label: 'Luxury Hall', url: 'https://images.unsplash.com/photo-1519225429780-e37d8001712a?auto=format&fit=crop&w=800&q=80' },
                          { label: 'Gold Texture', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
                          { label: 'Floral Arch', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80' },
                          { label: 'Velvet Silk', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
                          { label: 'Marble Stone', url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80' }
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => onUpdatePage({ background: { ...page.background, imageUrl: p.url } })}
                            className="p-1.5 text-[11px] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 truncate cursor-pointer text-slate-700 font-medium text-center hover:border-slate-300 transition-colors"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Fit Options */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-600">Image Fit</span>
                        <span className="text-[10px] text-slate-400 capitalize">{page.background.size || 'cover'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { label: 'Cover', value: 'cover' },
                          { label: 'Contain', value: 'contain' },
                          { label: 'Original', value: 'auto' }
                        ].map((fit) => {
                          const isSelected = (page.background?.size || 'cover') === fit.value;
                          return (
                            <button
                              key={fit.value}
                              type="button"
                              onClick={() => onUpdatePage({
                                background: { ...page.background, size: fit.value as 'cover' | 'contain' | 'auto' }
                              })}
                              className={`py-1.5 px-2 rounded-lg border text-center cursor-pointer transition-all ${isSelected
                                ? 'bg-slate-900 text-white font-semibold border-slate-900 shadow-2xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                            >
                              <div className="text-xs">{fit.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 9-Point Positioning Grid */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-600">Alignment (9-Point Grid)</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {page.background.position || 'center'}
                        </span>
                      </div>
                      <div className="flex justify-center p-2 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <div className="grid grid-cols-3 gap-1.5 w-32">
                          {NINE_POSITIONS.map((pos) => {
                            const isCurrent = (page.background?.position || 'center') === pos.value;
                            return (
                              <button
                                key={pos.value}
                                type="button"
                                title={pos.label}
                                onClick={() => onUpdatePage({
                                  background: {
                                    ...page.background,
                                    position: pos.value,
                                    customPosition: { x: pos.x, y: pos.y }
                                  }
                                })}
                                className={`h-8 rounded-md border flex items-center justify-center transition-all cursor-pointer ${isCurrent
                                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20'
                                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
                                  }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-slate-300'}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Custom Position Sliders (Accordion/collapsible) */}
                    <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setIsCustomPositionOpen(!isCustomPositionOpen)}
                        className="w-full flex items-center justify-between p-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>Custom Position (X / Y)</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCustomPositionOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isCustomPositionOpen && (
                        <div className="p-2.5 pt-1 space-y-2 bg-slate-50/50 border-t border-slate-100 text-xs">
                          {/* X Position */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[11px] text-slate-600">
                              <span>Horizontal X</span>
                              <span className="font-mono">{page.background?.customPosition?.x ?? 50}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={page.background?.customPosition?.x ?? 50}
                              onChange={(e) => {
                                const newX = Number(e.target.value);
                                const curY = page.background?.customPosition?.y ?? 50;
                                onUpdatePage({
                                  background: {
                                    ...page.background,
                                    position: `${newX}% ${curY}%`,
                                    customPosition: { x: newX, y: curY }
                                  }
                                });
                              }}
                              className="w-full accent-slate-900 cursor-pointer"
                            />
                          </div>

                          {/* Y Position */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[11px] text-slate-600">
                              <span>Vertical Y</span>
                              <span className="font-mono">{page.background?.customPosition?.y ?? 50}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={page.background?.customPosition?.y ?? 50}
                              onChange={(e) => {
                                const curX = page.background?.customPosition?.x ?? 50;
                                const newY = Number(e.target.value);
                                onUpdatePage({
                                  background: {
                                    ...page.background,
                                    position: `${curX}% ${newY}%`,
                                    customPosition: { x: curX, y: newY }
                                  }
                                });
                              }}
                              className="w-full accent-slate-900 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Zoom Slider */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-600 flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                          <span>Zoom</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-800 font-semibold">
                            {page.background.zoom || 100}%
                          </span>
                          {(page.background.zoom && page.background.zoom !== 100) && (
                            <button
                              type="button"
                              onClick={() => onUpdatePage({
                                background: { ...page.background, zoom: 100 }
                              })}
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="300"
                        step="5"
                        value={page.background.zoom || 100}
                        onChange={(e) => onUpdatePage({
                          background: { ...page.background, zoom: Number(e.target.value) }
                        })}
                        className="w-full accent-slate-900 cursor-pointer"
                      />
                    </div>

                    {/* Contrast Dim Overlay */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={page.background.overlayEnabled ?? ((page.background.overlayOpacity || 0) > 0)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              onUpdatePage({
                                background: {
                                  ...page.background,
                                  overlayEnabled: checked,
                                  overlayOpacity: checked ? (page.background?.overlayOpacity || 0.3) : 0,
                                  overlayColor: page.background?.overlayColor || '#000000'
                                }
                              });
                            }}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                          />
                          <span>Dim Overlay (Text Contrast)</span>
                        </label>
                        <span className="font-mono text-[11px] text-slate-600">
                          {Math.round((page.background.overlayOpacity || 0) * 100)}%
                        </span>
                      </div>

                      {(page.background.overlayEnabled ?? ((page.background.overlayOpacity || 0) > 0)) && (
                        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 space-y-2.5 text-xs">
                          {/* Color Swatches & Picker */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-medium">Overlay Color</span>
                            <div className="flex items-center gap-1.5">
                              {['#000000', '#ffffff', '#1e293b', '#1e1b4b', '#3b0764'].map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => onUpdatePage({
                                    background: { ...page.background, overlayColor: color }
                                  })}
                                  className={`w-5 h-5 rounded-full border shadow-2xs cursor-pointer transition-transform ${page.background?.overlayColor === color ? 'scale-110 ring-2 ring-slate-900' : 'hover:scale-105'
                                    }`}
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                              <input
                                type="color"
                                value={page.background?.overlayColor || '#000000'}
                                onChange={(e) => onUpdatePage({
                                  background: { ...page.background, overlayColor: e.target.value }
                                })}
                                className="w-6 h-6 rounded-md border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                              />
                            </div>
                          </div>

                          {/* Opacity Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span>Overlay Opacity</span>
                              <span className="font-mono">{Math.round((page.background?.overlayOpacity || 0) * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="0.9"
                              step="0.05"
                              value={page.background?.overlayOpacity || 0}
                              onChange={(e) => onUpdatePage({
                                background: {
                                  ...page.background,
                                  overlayOpacity: Number(e.target.value),
                                  overlayEnabled: true
                                }
                              })}
                              className="w-full accent-slate-900 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Reset Adjustments & Remove Background */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleResetAdjustments}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Reset Adjustments</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveBackground}
                        className="py-1.5 px-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-medium shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        title="Remove Background"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VIDEO BACKGROUND */}
                {page.background?.type === 'video' && (
                  <div className="space-y-3">
                    {/* Choose from Library or Current Video Indicator */}
                    {page.background.videoUrl ? (
                      <div className="p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <Video className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate">Video Background Active</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveBackground}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Remove video background"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenAssetPicker('video')}
                          className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Change from Asset Library</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenAssetPicker('video')}
                        className="w-full py-3.5 px-3 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center group"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-indigo-900">Choose Video from Library</span>
                        <span className="text-[10px] text-slate-500">Stock Videos & Ambient Loops</span>
                      </button>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-500">Video URL (MP4 / WebM)</label>
                      <input
                        type="text"
                        placeholder="https://assets.mixkit.co/..."
                        value={page.background.videoUrl || ''}
                        onChange={(e) => onUpdatePage({
                          background: { ...page.background, videoUrl: e.target.value }
                        })}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    {/* Preset ambient background video */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Ambient Loops</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdatePage({
                            background: {
                              ...page.background,
                              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4'
                            }
                          })}
                          className="p-2 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 cursor-pointer font-medium text-left flex items-center gap-1.5"
                        >
                          <span>✨</span>
                          <span className="truncate">Golden Bokeh</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdatePage({
                            background: {
                              ...page.background,
                              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-silk-fabric-waving-in-the-wind-41484-large.mp4'
                            }
                          })}
                          className="p-2 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 cursor-pointer font-medium text-left flex items-center gap-1.5"
                        >
                          <span>🕊️</span>
                          <span className="truncate">Silk Flow</span>
                        </button>
                      </div>
                    </div>

                    {/* Dim Overlay for Video */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[11px] text-slate-600">
                        <span>Dim Overlay (Text Contrast)</span>
                        <span className="font-mono">{Math.round((page.background?.overlayOpacity || 0) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.9"
                        step="0.05"
                        value={page.background?.overlayOpacity || 0}
                        onChange={(e) => onUpdatePage({
                          background: {
                            ...page.background,
                            overlayOpacity: Number(e.target.value),
                            overlayColor: page.background?.overlayColor || '#000000'
                          }
                        })}
                        className="w-full accent-slate-900 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. THEME COLORS (collapsed accordion) */}
              <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsThemeColorsOpen(!isThemeColorsOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                      Theme Colors
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Mini color swatches preview */}
                    <div className="flex items-center -space-x-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: theme?.primaryColor || '#0f172a' }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: theme?.secondaryColor || '#475569' }} />
                      {theme?.accentColor && (
                        <div className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: theme.accentColor }} />
                      )}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isThemeColorsOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isThemeColorsOpen && (
                  <div className="p-3.5 pt-2 space-y-4 border-t border-slate-100 text-xs">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Global color palette synchronized across your entire digital invitation.
                    </p>

                    {/* Primary, Secondary, Accent Swatches & Pickers */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Primary Color */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-200/60">
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-slate-800">Primary Color</span>
                          <div className="text-[10px] text-slate-400">Headings, titles, main accents</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme?.primaryColor || '#0f172a'}
                            onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <input
                            type="text"
                            value={theme?.primaryColor || '#0f172a'}
                            onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                            className="w-20 text-[11px] bg-white border border-slate-200 rounded px-1.5 py-1 font-mono text-center text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Secondary Color */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-200/60">
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-slate-800">Secondary Color</span>
                          <div className="text-[10px] text-slate-400">Body copy, subtitles, captions</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme?.secondaryColor || '#475569'}
                            onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <input
                            type="text"
                            value={theme?.secondaryColor || '#475569'}
                            onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                            className="w-20 text-[11px] bg-white border border-slate-200 rounded px-1.5 py-1 font-mono text-center text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-200/60">
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-slate-800">Accent Color</span>
                          <div className="text-[10px] text-slate-400">Buttons, highlights, badges</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme?.accentColor || '#c5a059'}
                            onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <input
                            type="text"
                            value={theme?.accentColor || '#c5a059'}
                            onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                            className="w-20 text-[11px] bg-white border border-slate-200 rounded px-1.5 py-1 font-mono text-center text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preset Luxury Palettes */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Palette Inspiration</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { name: 'Royal Gold', primary: '#d4af37', secondary: '#1e293b', accent: '#d4af37' },
                          { name: 'Rose Romance', primary: '#e11d48', secondary: '#4a044e', accent: '#f43f5e' },
                          { name: 'Emerald Luxe', primary: '#059669', secondary: '#064e3b', accent: '#10b981' },
                          { name: 'Midnight', primary: '#0f172a', secondary: '#334155', accent: '#64748b' }
                        ].map(pal => (
                          <button
                            key={pal.name}
                            type="button"
                            onClick={() => onUpdateTheme({ primaryColor: pal.primary, secondaryColor: pal.secondary, accentColor: pal.accent })}
                            className="flex items-center justify-between p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white cursor-pointer transition-colors"
                          >
                            <span className="text-[11px] font-medium text-slate-700">{pal.name}</span>
                            <div className="flex items-center -space-x-1">
                              <div className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: pal.primary }} />
                              <div className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: pal.secondary }} />
                              <div className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: pal.accent }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Apply to All Pages Button */}
                    {onApplyThemeToAllPages && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={onApplyThemeToAllPages}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Apply Palette to All Pages</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. PAGE ANIMATION (collapsed accordion) */}
              <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsPageAnimationOpen(!isPageAnimationOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                      Page Animation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500 capitalize">
                      {page.transition?.type || 'fade'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPageAnimationOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isPageAnimationOpen && (
                  <div className="p-3.5 pt-2 space-y-4 border-t border-slate-100 text-xs">
                    {/* Replay Page Action */}
                    {onPreviewPageAnimations && (
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[11px] text-slate-500">Preview page transition</span>
                        <button
                          type="button"
                          onClick={onPreviewPageAnimations}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Replay Page</span>
                        </button>
                      </div>
                    )}

                    {/* Visual Animation Presets Grid */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-500">Transition Style</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'none', label: 'None', desc: 'Instant switch', icon: '⛔' },
                          { id: 'fade', label: 'Fade', desc: 'Soft cross-fade', icon: '✨' },
                          { id: 'slide-vertical', label: 'Slide Up', desc: 'Vertical glide', icon: '⬆️' },
                          { id: 'slide-horizontal', label: 'Slide Right', desc: 'Side swipe', icon: '➡️' },
                          { id: 'zoom', label: 'Zoom Depth', desc: 'Scale in & out', icon: '🔍' },
                          { id: 'flip', label: '3D Card Flip', desc: 'Luxury card turn', icon: '🔄' },
                          { id: 'cube', label: '3D Cube', desc: '3D perspective', icon: '🎲' }
                        ].map((preset) => {
                          const isSelected = (page.transition?.type || 'fade') === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => onUpdatePage({
                                transition: {
                                  ...page.transition,
                                  type: preset.id as any,
                                  duration: page.transition?.duration || 0.6
                                }
                              })}
                              className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2 ${isSelected
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                }`}
                            >
                              <span className="text-base leading-none">{preset.icon}</span>
                              <div className="min-w-0">
                                <div className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                  {preset.label}
                                </div>
                                <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                  {preset.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration Control (shown when transition is not 'none') */}
                    {(page.transition?.type || 'fade') !== 'none' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-medium text-slate-500">Duration</span>
                          <span className="font-mono text-slate-800 font-semibold">{page.transition?.duration || 0.6}s</span>
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
                    )}

                    {/* Advanced Motion (collapsed accordion) */}
                    {(page.transition?.type || 'fade') !== 'none' && (
                      <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setIsAdvancedMotionOpen(!isAdvancedMotionOpen)}
                          className="w-full flex items-center justify-between p-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span>Advanced Motion</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAdvancedMotionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isAdvancedMotionOpen && (
                          <div className="p-2.5 pt-1 space-y-2 bg-slate-50/50 border-t border-slate-100 text-xs">
                            <label className="text-[11px] font-medium text-slate-500 block">Motion Easing Curve</label>
                            <select
                              value={page.transition?.easing || 'ease-out'}
                              onChange={(e) => onUpdatePage({
                                transition: {
                                  ...page.transition,
                                  type: page.transition?.type || 'fade',
                                  duration: page.transition?.duration || 0.6,
                                  easing: e.target.value as any
                                }
                              })}
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
                            >
                              <option value="ease-out">Natural Deceleration (Ease Out)</option>
                              <option value="ease-in-out">Smooth Start & End (Ease In-Out)</option>
                              <option value="spring">Physics Spring</option>
                              <option value="linear">Linear Constant</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Background Asset Picker Modal */}
        <BackgroundAssetPickerModal
          isOpen={isAssetPickerOpen}
          onClose={() => setIsAssetPickerOpen(false)}
          onSelect={(url, asset) => handleSelectBackground(url, asset)}
          mode={assetPickerMode}
          currentInvitationId={currentInvitationId}
          businessId={businessId}
          onAddElement={onAddElement}
        />
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
            title="Copy Style (Canva Style)"
            onClick={() => {
              copyElementStyle(selectedElement);
              setCopiedStyleSuccess(true);
              setTimeout(() => setCopiedStyleSuccess(false), 2000);
            }}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {copiedStyleSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Paintbrush className="w-3.5 h-3.5" />
            )}
          </button>
          {getCopiedStyle() && (
            <button
              type="button"
              title="Paste Style to Element"
              onClick={() => {
                const copied = getCopiedStyle();
                if (copied) {
                  onUpdateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      ...copied
                    }
                  });
                }
              }}
              className="p-1.5 rounded-md hover:bg-amber-50 text-amber-600 hover:text-amber-800 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
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

      {/* Opening Screen Notice */}
      {isOpeningScreen && (
        <div className="px-3 py-2 bg-amber-50/80 border-b border-amber-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 text-[11px] font-medium">
            <MailOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Opening Screen Element</span>
          </div>
          {onSelectElement && (
            <button
              type="button"
              onClick={() => onSelectElement(null as any)}
              className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              Cover Settings
            </button>
          )}
        </div>
      )}

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
      <div className={`grid ${selectedElement.type === 'container' ? 'grid-cols-4' : 'grid-cols-3'} border-b border-slate-200 bg-slate-50/80 text-[11px] font-medium text-center`}>
        {[
          ...(selectedElement.type === 'container' ? [{ id: 'container', label: 'Container' }] : []),
          { id: 'design', label: 'Design' },
          { id: 'responsive', label: 'Responsive' },
          { id: 'animation', label: 'Animation' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${activeTab === tab.id
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
        {/* DESIGN TAB */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            {['event-date', 'event-time', 'countdown', 'calendar', 'venue', 'google-maps', 'timeline', 'photo-gallery', 'whatsapp-button', 'qr-code', 'rsvp-form', 'guestbook', 'couple-names', 'dress-code', 'gift-registry', 'travel-accommodation', 'directions-button', 'contact-button'].includes(selectedElement.type) ? (
              <InvitationDesignInspector
                element={selectedElement}
                onUpdateElement={onUpdateElement}
                palette={page.theme?.palette}
                onBringForward={() => onBringForward && onBringForward(selectedElement.id)}
                onSendBackward={() => onSendBackward && onSendBackward(selectedElement.id)}
                onBringToFront={() => onBringToFront && onBringToFront(selectedElement.id)}
                onSendToBack={() => onSendToBack && onSendToBack(selectedElement.id)}
              />
            ) : (
              <>
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

                {['button', 'whatsapp-button'].includes(selectedElement.type) && (
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

                {/* Position, Size & Layer Ordering - Collapsible below Style */}
                <details className="group border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open={['image', 'video', 'container'].includes(selectedElement.type)}>
                  <summary className="px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-700 cursor-pointer select-none hover:bg-slate-100/80 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <span>Position, Bounds & Layers</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-3 pt-2 space-y-3 bg-white border-t border-slate-200">
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
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
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
                </details>

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
              </>
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
