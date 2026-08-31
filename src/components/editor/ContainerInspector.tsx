import React from 'react';
import {
  CanvasElement,
  ContainerShape,
  BackgroundConfig,
  ElementStyle,
  ElementType
} from '../../types';
import {
  Shapes,
  Palette,
  Image as ImageIcon,
  Video,
  Sparkles,
  Layers,
  Square,
  Circle,
  Copy,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Sliders,
  Type,
  Calendar,
  Clock,
  Heart,
  Maximize2
} from 'lucide-react';

interface ContainerInspectorProps {
  element: CanvasElement;
  allElements: CanvasElement[];
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onAddChildElement?: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  onDetachFromContainer?: (id: string) => void;
  onSelectElement?: (id: string | null) => void;
}

export const ContainerInspector: React.FC<ContainerInspectorProps> = ({
  element,
  allElements,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onAddChildElement,
  onDetachFromContainer,
  onSelectElement
}) => {
  const { style } = element;
  const isContainer = element.type === 'container';
  const parentId = element.parentContainerId || element.parentId;
  const parentElement = parentId ? allElements.find(el => el.id === parentId) : null;

  // Direct children of this container
  const childElements = isContainer
    ? allElements.filter(el => (el.parentContainerId === element.id || el.parentId === element.id))
    : [];

  const currentBgType = style.background?.type || (style.backgroundColor ? 'color' : 'color');

  const updateBackground = (updates: Partial<BackgroundConfig>) => {
    const newBg: BackgroundConfig = {
      type: 'color',
      ...(style.background || {}),
      ...updates
    };
    onUpdateElement(element.id, {
      style: {
        ...style,
        background: newBg
      }
    });
  };

  const primaryShapes: Array<{ id: ContainerShape; label: string; icon: string }> = [
    { id: 'rectangle', label: 'Rectangle', icon: '⏹' },
    { id: 'rounded-rectangle', label: 'Rounded Rect', icon: '🔲' },
    { id: 'square', label: 'Square', icon: '⬛' },
    { id: 'circle', label: 'Circle', icon: '⭕' },
    { id: 'oval', label: 'Oval', icon: '🥚' },
    { id: 'arch', label: 'Arch Window', icon: '🏛' },
    { id: 'ticket', label: 'VIP Ticket', icon: '🎟' },
    { id: 'diamond', label: 'Diamond', icon: '💎' },
    { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
    { id: 'heart', label: 'Heart Frame', icon: '❤️' },
    { id: 'scallop', label: 'Scalloped', icon: '🌸' }
  ];

  const shadowPresets = [
    { name: 'None', value: 'none' },
    { name: 'Subtle', value: '0 2px 8px rgba(0, 0, 0, 0.06)' },
    { name: 'Elevated', value: '0 8px 24px -4px rgba(0, 0, 0, 0.12)' },
    { name: 'Deep Luxury', value: '0 16px 40px -8px rgba(0, 0, 0, 0.25)' },
    { name: 'Gold Glow', value: '0 0 25px rgba(212, 175, 55, 0.35)' },
    { name: 'Frosted Rim', value: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3), 0 8px 32px 0 rgba(0, 0, 0, 0.1)' }
  ];

  const gradientPresets = [
    { name: 'Emerald Night', colors: ['#071912', '#0b261b'] },
    { name: 'Royal Gold', colors: ['#1c160c', '#382e16'] },
    { name: 'Midnight Blue', colors: ['#090d16', '#1e293b'] },
    { name: 'Rose Romance', colors: ['#1e0f14', '#3b1d28'] },
    { name: 'Clean Glass', colors: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'] }
  ];

  const stockImages = [
    { label: 'Wedding Couple', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
    { label: 'Luxury Hall', url: 'https://images.unsplash.com/photo-1519225429780-e37d8001712a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Gold Texture', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Floral Motif', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80' }
  ];

  const stockVideos = [
    { label: '✨ Golden Bokeh', url: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4' },
    { label: '🌊 Waving Silk', url: 'https://assets.mixkit.co/videos/preview/mixkit-white-silk-fabric-waving-in-the-wind-41484-large.mp4' }
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Hierarchy / Parent Breadcrumb */}
      {parentElement && (
        <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between text-indigo-950">
          <div className="flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span className="text-[11px] font-medium truncate">
              Nested inside <strong className="font-semibold">{parentElement.name || 'Parent Container'}</strong>
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
                onClick={() => onDetachFromContainer(element.id)}
                title="Detach to Page Canvas"
                className="px-1.5 py-0.5 text-[10px] bg-white border border-indigo-200 hover:bg-indigo-100 rounded text-indigo-700 font-medium transition-colors cursor-pointer"
              >
                Detach
              </button>
            )}
          </div>
        </div>
      )}

      {/* SHAPE SILHOUETTE SELECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Container Shape
          </span>
          <span className="text-[10px] font-semibold text-slate-900 capitalize">
            {style.shape || 'rectangle'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {primaryShapes.map((s) => {
            const isSelected = (style.shape || 'rectangle') === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onUpdateElement(element.id, {
                  style: {
                    ...style,
                    shape: s.id,
                    clipMask: true,
                    // If switching to circle/oval/square, ensure appropriate aspect styling if preferred
                    borderRadius: s.id === 'rounded-rectangle' ? (style.borderRadius || 24) : style.borderRadius
                  }
                })}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-base leading-none">{s.icon}</span>
                <span className="text-[10px] truncate max-w-full">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Border Radius for Rectangle / Rounded */}
        {['rectangle', 'rounded-rectangle', 'square'].includes(style.shape || 'rectangle') && (
          <div className="pt-2">
            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
              <span>Corner Radius</span>
              <span className="font-mono text-slate-800 font-semibold">{style.borderRadius ?? (style.shape === 'rounded-rectangle' ? 24 : 0)}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={typeof style.borderRadius === 'number' ? style.borderRadius : (style.shape === 'rounded-rectangle' ? 24 : 0)}
              onChange={(e) => onUpdateElement(element.id, {
                style: { ...style, borderRadius: Number(e.target.value) }
              })}
              className="w-full accent-slate-900"
            />
          </div>
        )}
      </div>

      {/* BACKGROUND & MEDIA FILL */}
      <div className="space-y-2 pt-3 border-t border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Shape Fill & Background Media
        </span>

        {/* Media type switcher */}
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-medium">
          {(['color', 'gradient', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateBackground({ type: t })}
              className={`py-1 rounded capitalize transition-all cursor-pointer text-center ${
                currentBgType === t
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* COLOR FILL */}
        {currentBgType === 'color' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.background?.color || style.backgroundColor || '#f8fafc'}
                onChange={(e) => {
                  updateBackground({ type: 'color', color: e.target.value });
                  onUpdateElement(element.id, {
                    style: { ...style, backgroundColor: e.target.value }
                  });
                }}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={style.background?.color || style.backgroundColor || '#f8fafc'}
                onChange={(e) => {
                  updateBackground({ type: 'color', color: e.target.value });
                  onUpdateElement(element.id, {
                    style: { ...style, backgroundColor: e.target.value }
                  });
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={() => {
                  updateBackground({ type: 'color', color: 'transparent' });
                  onUpdateElement(element.id, {
                    style: { ...style, backgroundColor: 'transparent' }
                  });
                }}
                className="px-2 py-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] text-slate-600 font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* GRADIENT FILL */}
        {currentBgType === 'gradient' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Color 1:</span>
                <input
                  type="color"
                  value={style.background?.gradient?.colors?.[0] || '#1c160c'}
                  onChange={(e) => {
                    const colors = [...(style.background?.gradient?.colors || ['#1c160c', '#382e16'])];
                    colors[0] = e.target.value;
                    updateBackground({
                      type: 'gradient',
                      gradient: { type: style.background?.gradient?.type || 'linear', colors, angle: style.background?.gradient?.angle || 180 }
                    });
                  }}
                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Color 2:</span>
                <input
                  type="color"
                  value={style.background?.gradient?.colors?.[1] || '#382e16'}
                  onChange={(e) => {
                    const colors = [...(style.background?.gradient?.colors || ['#1c160c', '#382e16'])];
                    colors[1] = e.target.value;
                    updateBackground({
                      type: 'gradient',
                      gradient: { type: style.background?.gradient?.type || 'linear', colors, angle: style.background?.gradient?.angle || 180 }
                    });
                  }}
                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Gradient angle */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                <span>Angle</span>
                <span className="font-mono text-slate-800 font-medium">{style.background?.gradient?.angle ?? 180}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={style.background?.gradient?.angle ?? 180}
                onChange={(e) => {
                  const colors = style.background?.gradient?.colors || ['#1c160c', '#382e16'];
                  updateBackground({
                    type: 'gradient',
                    gradient: { type: 'linear', colors, angle: Number(e.target.value) }
                  });
                }}
                className="w-full accent-slate-900"
              />
            </div>

            {/* Gradient presets */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {gradientPresets.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => updateBackground({
                    type: 'gradient',
                    gradient: { type: 'linear', colors: preset.colors, angle: 180 }
                  })}
                  className="h-7 rounded border border-slate-300 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* IMAGE BACKGROUND */}
        {currentBgType === 'image' && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={style.background?.imageUrl || ''}
                onChange={(e) => updateBackground({
                  type: 'image',
                  imageUrl: e.target.value,
                  size: 'cover'
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Fit Mode</label>
                <select
                  value={style.objectFit || 'cover'}
                  onChange={(e) => onUpdateElement(element.id, {
                    style: { ...style, objectFit: e.target.value as any }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                >
                  <option value="cover">Cover (Fill Shape)</option>
                  <option value="contain">Contain (Full View)</option>
                  <option value="fill">Stretch</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Tint Overlay</label>
                <input
                  type="color"
                  value={style.background?.overlayColor || '#000000'}
                  onChange={(e) => updateBackground({
                    overlayColor: e.target.value,
                    overlayOpacity: style.background?.overlayOpacity ?? 0.3
                  })}
                  className="w-full h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Image presets */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {stockImages.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => updateBackground({
                    type: 'image',
                    imageUrl: img.url,
                    size: 'cover'
                  })}
                  className="p-1 text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 truncate cursor-pointer font-medium"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO BACKGROUND */}
        {currentBgType === 'video' && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Video URL (MP4 / WebM)</label>
              <input
                type="text"
                placeholder="https://assets.mixkit.co/..."
                value={style.background?.videoUrl || ''}
                onChange={(e) => updateBackground({
                  type: 'video',
                  videoUrl: e.target.value
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {stockVideos.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => updateBackground({
                    type: 'video',
                    videoUrl: v.url
                  })}
                  className="p-1.5 text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BORDER & SHADOW */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Border & Shadow
        </span>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Width (px)</label>
            <input
              type="number"
              min="0"
              max="20"
              value={style.borderWidth || 0}
              onChange={(e) => onUpdateElement(element.id, {
                style: { ...style, borderWidth: Number(e.target.value) }
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Color</label>
            <input
              type="color"
              value={style.borderColor || '#cbd5e1'}
              onChange={(e) => onUpdateElement(element.id, {
                style: { ...style, borderColor: e.target.value }
              })}
              className="w-full h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Style</label>
            <select
              value={style.borderStyle || 'solid'}
              onChange={(e) => onUpdateElement(element.id, {
                style: { ...style, borderStyle: e.target.value as any }
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        {/* Box Shadow */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Shadow Preset</label>
          <select
            value={style.boxShadow || 'none'}
            onChange={(e) => onUpdateElement(element.id, {
              style: { ...style, boxShadow: e.target.value }
            })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          >
            {shadowPresets.map(p => (
              <option key={p.name} value={p.value}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* BLUR, PADDING & OPACITY */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Effects & Spacing
        </span>

        {/* Backdrop Blur / Glassmorphism */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
            <span>Frosted Backdrop Blur</span>
            <span className="font-mono text-slate-800 font-semibold">{style.backdropBlur || 0}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={style.backdropBlur || 0}
            onChange={(e) => onUpdateElement(element.id, {
              style: { ...style, backdropBlur: Number(e.target.value) }
            })}
            className="w-full accent-slate-900"
          />
        </div>

        {/* Inner Padding */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
            <span>Inner Padding</span>
            <span className="font-mono text-slate-800 font-semibold">{style.padding || 0}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={style.padding || 0}
            onChange={(e) => onUpdateElement(element.id, {
              style: { ...style, padding: Number(e.target.value) }
            })}
            className="w-full accent-slate-900"
          />
        </div>
      </div>

      {/* CONTAINER CHILDREN MANAGEMENT */}
      {isContainer && (
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Child Elements ({childElements.length})
            </span>
          </div>

          {/* Quick Add Child Grid */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-semibold text-slate-700">
              + Add Element Inside Container
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement('text', {
                  content: { text: 'Rahul & Priya' },
                  style: { x: 20, y: 30, width: 200, height: 40, fontSize: 18, color: '#f8fafc', textAlign: 'center' }
                }, element.id)}
                className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800 flex items-center gap-1 justify-center transition-colors cursor-pointer"
              >
                <Type className="w-3 h-3 text-slate-600" />
                <span>Text</span>
              </button>

              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement('image', {
                  content: { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
                  style: { x: 20, y: 20, width: 140, height: 140, borderRadius: 12 }
                }, element.id)}
                className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800 flex items-center gap-1 justify-center transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3 h-3 text-slate-600" />
                <span>Image</span>
              </button>

              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement('event-date', {
                  content: { text: 'Wedding Date', eventDate: 'Saturday, Oct 24, 2026' },
                  style: { x: 20, y: 40, width: 220, height: 50, fontSize: 16 }
                }, element.id)}
                className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800 flex items-center gap-1 justify-center transition-colors cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-slate-600" />
                <span>Date</span>
              </button>

              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement('event-time', {
                  content: { text: 'Reception Time', eventTime: '04:00 PM – 10:00 PM' },
                  style: { x: 20, y: 100, width: 220, height: 50, fontSize: 15 }
                }, element.id)}
                className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800 flex items-center gap-1 justify-center transition-colors cursor-pointer"
              >
                <Clock className="w-3 h-3 text-slate-600" />
                <span>Time</span>
              </button>

              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement('couple-names', {
                  content: { coupleName1: 'Rahul', andConnector: '&', coupleName2: 'Priya' },
                  style: { x: 20, y: 30, width: 220, height: 90, fontSize: 24, color: '#f8fafc' }
                }, element.id)}
                className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800 flex items-center gap-1 justify-center transition-colors cursor-pointer"
              >
                <Heart className="w-3 h-3 text-rose-500" />
                <span>Couple</span>
              </button>

              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement('container', {
                  name: 'Nested Small Container',
                  style: {
                    x: 20,
                    y: 20,
                    width: 200,
                    height: 120,
                    shape: 'rounded-rectangle',
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                    backdropBlur: 8
                  }
                }, element.id)}
                className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[10px] font-semibold text-indigo-700 flex items-center gap-1 justify-center transition-colors cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>Nested Box</span>
              </button>
            </div>
          </div>

          {/* List of Existing Children */}
          {childElements.length > 0 && (
            <div className="space-y-1">
              {childElements.map(child => (
                <div
                  key={child.id}
                  onClick={() => onSelectElement && onSelectElement(child.id)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-400 font-mono text-[10px]">#{child.type}</span>
                    <span className="font-medium text-slate-800 truncate text-[11px]">{child.name || child.type}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement(child.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete Child"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTAINER ACTIONS */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onDuplicateElement(element.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate All</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateElement(element.id, { isLocked: !element.isLocked })}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
              element.isLocked
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{element.isLocked ? 'Locked' : 'Lock'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUpdateElement(element.id, { isHidden: !element.isHidden })}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            {element.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{element.isHidden ? 'Hidden' : 'Hide'}</span>
          </button>

          <button
            type="button"
            onClick={() => onDeleteElement(element.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors cursor-pointer border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Tree</span>
          </button>
        </div>
      </div>
    </div>
  );
};
