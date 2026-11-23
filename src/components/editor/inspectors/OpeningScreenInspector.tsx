import React, { useState } from 'react';
import {
  OpeningScreenConfig,
  VideoPlayMode,
  ImageTransitionEffect,
  ImageAdvanceTrigger,
  InvitationPage,
  ElementType,
  CanvasElement,
  OuterDropEffectType
} from '../../../types';
import {
  Video,
  Image as ImageIcon,
  Mail,
  Play,
  Sparkles,
  Volume2,
  Clock,
  Layers,
  ChevronDown,
  Eye,
  Sliders,
  Type,
  Palette,
  MousePointerClick,
  PlusCircle,
  Trash2,
  Heart,
  Maximize2,
  RotateCcw,
  Check,
  FolderOpen,
  Film,
  Power
} from 'lucide-react';
import {
  DEFAULT_COVER_WIDTH,
  DEFAULT_COVER_HEIGHT,
  createOpenInvitationButtonElement,
  buildMinimalEnvelopeElements
} from '../../../utils/openingScreenUtils';
import { BackgroundAssetPickerModal } from '../../media/BackgroundAssetPickerModal';

interface OpeningScreenInspectorProps {
  config: OpeningScreenConfig;
  page?: InvitationPage;
  onUpdate: (updates: Partial<OpeningScreenConfig>) => void;
  onTestOpeningScreen?: () => void;
  onSelectElement?: (id: string | null) => void;
  onAddElement?: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  onUpdatePage?: (updates: Partial<InvitationPage>) => void;
}

export const STOCK_VIDEOS = [
  {
    name: '✨ Golden Bokeh',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '🌊 Waving Silk Fabric',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-white-silk-fabric-waving-in-the-wind-41484-large.mp4',
    poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '💍 Wedding Rings in Box',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-in-a-box-41589-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519225424982-f584e0374e2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '🎆 Sparkler Magic Night',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-sparkler-at-night-42263-large.mp4',
    poster: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '🥂 Champagne Toast',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-champagne-glasses-in-a-toast-41973-large.mp4',
    poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80'
  }
];

export const STOCK_IMAGES = [
  {
    name: '🏛️ Arch Floral Portal',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: '💑 Romantic Silhouette',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: '🌸 Golden Floral Bouquet',
    url: 'https://images.unsplash.com/photo-1519225424982-f584e0374e2d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: '🌹 Rose Garden Romance',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: '✨ Starlit Midnight Gala',
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80'
  }
];

export const OpeningScreenInspector: React.FC<OpeningScreenInspectorProps> = ({
  config,
  page,
  onUpdate,
  onTestOpeningScreen,
  onSelectElement,
  onAddElement,
  onUpdatePage
}) => {
  // Collapsible section management (1. Screen, 2. Design, 3. Behavior, 4. Transition, 5. Extras, 6. Advanced)
  const [openSections, setOpenSections] = useState({
    screen: true,
    design: true,
    behavior: true,
    transition: true,
    extras: false,
    advanced: false
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Media Library modal picker state
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'image' | 'video'>('image');

  // Interactive Live Mini-Preview state
  const [animatingPreview, setAnimatingPreview] = useState(false);

  const openButtonElement = page?.elements?.find(
    (el) =>
      el.id === 'open-elem-button' ||
      el.content?.buttonAction === 'open-invitation' ||
      el.content?.buttonAction === 'open_invitation' ||
      el.type === 'button'
  );
  const hasButtonOnCanvas = Boolean(openButtonElement);

  // Centralized updater
  const updateConfig = (updates: Partial<OpeningScreenConfig>) => {
    onUpdate({
      ...updates
    });
  };

  const currentBgType = page?.background?.type || config.background?.type || (config.videoUrl ? 'video' : config.imageUrl ? 'image' : 'color');
  const isVideoBg = currentBgType === 'video';

  const videoPlayMode: VideoPlayMode = config.videoPlayMode || 'autoplay';
  const globalTransitionEffect: ImageTransitionEffect =
    config.coverTransitionEffect || config.imageTransitionEffect || 'zoom-fade';
  const transitionDuration: number = config.transitionDuration || config.imageTransitionDuration || 0.85;
  const imageAdvanceTrigger: ImageAdvanceTrigger = config.imageAdvanceTrigger || 'click-button';

  const handleTriggerMiniPreview = (effect?: ImageTransitionEffect) => {
    if (effect && effect !== globalTransitionEffect) {
      updateConfig({
        coverTransitionEffect: effect,
        imageTransitionEffect: effect
      });
    }
    setAnimatingPreview(false);
    setTimeout(() => setAnimatingPreview(true), 30);
    setTimeout(() => setAnimatingPreview(false), 1300);
  };

  const handleDimensionUpdate = (updates: Partial<InvitationPage>) => {
    if (onUpdatePage) onUpdatePage(updates);
    const currentPage = page || config.page;
    if (currentPage) {
      updateConfig({
        page: {
          ...currentPage,
          ...updates
        }
      });
    }
  };

  const handleSelectAssetFromPicker = (url: string) => {
    if (pickerTarget === 'image') {
      const updatedBg = {
        type: 'image' as const,
        imageUrl: url,
        size: 'cover' as const,
        position: 'center',
        overlayColor: config.imageOverlayColor || '#000000',
        overlayOpacity: config.imageOverlayOpacity ?? 0.4
      };
      updateConfig({
        imageUrl: url,
        background: updatedBg
      });
      if (onUpdatePage) {
        onUpdatePage({ background: updatedBg });
      }
    } else {
      const updatedBg = {
        type: 'video' as const,
        videoUrl: url,
        overlayColor: '#000000',
        overlayOpacity: 0.35
      };
      updateConfig({
        videoUrl: url,
        background: updatedBg
      });
      if (onUpdatePage) {
        onUpdatePage({ background: updatedBg });
      }
    }
    setIsAssetPickerOpen(false);
  };

  const handleUpdateBackground = (bgUpdates: Partial<NonNullable<OpeningScreenConfig['background']>>) => {
    const currentBg = page?.background || config.background || { type: 'color', color: '#172520' };
    const merged = { ...currentBg, ...bgUpdates };
    updateConfig({ background: merged as any });
    if (onUpdatePage) {
      onUpdatePage({ background: merged as any });
    }
  };

  // 1-Click Design Presets (Applies background and transition presets directly)
  const applyDesignPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'minimalist': {
        const bg = { type: 'color' as const, color: '#fcfbf9' };
        updateConfig({
          style: 'custom-page',
          background: bg,
          coverTransitionEffect: 'zoom-fade',
          imageTransitionEffect: 'zoom-fade',
          imageAdvanceTrigger: 'click-button',
          showConfetti: false
        });
        if (onUpdatePage) onUpdatePage({ background: bg });
        break;
      }
      case 'royal-gold': {
        const bg = {
          type: 'gradient' as const,
          gradient: { type: 'radial' as const, colors: ['#172520', '#07120d'], angle: 180 },
          overlayColor: '#c5a059',
          overlayOpacity: 0.08
        };
        updateConfig({
          style: 'custom-page',
          sealColor: '#c5a059',
          background: bg,
          coverTransitionEffect: 'curtain-split',
          imageTransitionEffect: 'curtain-split',
          imageAdvanceTrigger: 'click-button',
          showConfetti: true
        });
        if (onUpdatePage) onUpdatePage({ background: bg });
        break;
      }
      case 'botanical': {
        const bg = {
          type: 'gradient' as const,
          gradient: { type: 'linear' as const, colors: ['#eef4f0', '#d8e5dd'], angle: 135 }
        };
        updateConfig({
          style: 'custom-page',
          background: bg,
          coverTransitionEffect: 'slide-up',
          imageTransitionEffect: 'slide-up',
          imageAdvanceTrigger: 'click-button',
          showConfetti: true
        });
        if (onUpdatePage) onUpdatePage({ background: bg });
        break;
      }
      case 'midnight': {
        const bg = {
          type: 'gradient' as const,
          gradient: { type: 'radial' as const, colors: ['#0f172a', '#020617'], angle: 180 },
          overlayColor: '#d4af37',
          overlayOpacity: 0.05
        };
        updateConfig({
          style: 'custom-page',
          background: bg,
          coverTransitionEffect: 'blur-dissolve',
          imageTransitionEffect: 'blur-dissolve',
          imageAdvanceTrigger: 'click-button',
          showConfetti: true
        });
        if (onUpdatePage) onUpdatePage({ background: bg });
        break;
      }
      case 'bokeh-video': {
        const vidUrl = STOCK_VIDEOS[0].url;
        const bg = {
          type: 'video' as const,
          videoUrl: vidUrl,
          overlayColor: '#000000',
          overlayOpacity: 0.35
        };
        updateConfig({
          style: 'custom-page',
          videoUrl: vidUrl,
          videoPlayMode: 'autoplay',
          videoAutoAdvanceOnEnd: true,
          videoMuted: true,
          background: bg,
          coverTransitionEffect: 'zoom-fade',
          imageTransitionEffect: 'zoom-fade',
          showConfetti: true
        });
        if (onUpdatePage) onUpdatePage({ background: bg });
        break;
      }
    }
  };

  const isEnabled = config.enabled !== false;

  return (
    <div className="space-y-3.5 text-xs text-slate-700">
      {/* Test Opening Screen Banner Button */}
      {onTestOpeningScreen && isEnabled && (
        <button
          type="button"
          onClick={onTestOpeningScreen}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group"
        >
          <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
          <span>Test Opening Screen Experience</span>
        </button>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: OPENING SCREEN (Enable / Disable)                              */}
      {/* ========================================================================= */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection('screen')}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-xs">Opening Screen</span>
              <span className="text-[10px] text-slate-500">
                {isEnabled ? 'Enabled • Opening screen active' : 'Disabled • Viewers see Page 1 directly'}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${openSections.screen ? 'rotate-180' : ''}`}
          />
        </button>

        {openSections.screen && (
          <div className="p-3 pt-0 border-t border-slate-100 space-y-3">
            {/* Enable / Disable Switch */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-[11px] text-slate-900 block">Enable Opening Screen</span>
                <span className="text-[9.5px] text-slate-500">
                  {isEnabled
                    ? 'Screen displays before visitors view invitation pages'
                    : 'Disabled: visitors will go directly to Page 1'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => onUpdate({ enabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {isEnabled && (
              <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200/80 text-[10.5px] text-slate-600 space-y-1">
                <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive Opening Canvas</span>
                </div>
                <p className="leading-relaxed text-[10px] text-slate-600">
                  The Opening Screen acts as an editable canvas. Design it freely using background styles, text, photos, videos, and buttons.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Only show remaining customizer sections when opening screen is enabled */}
      {isEnabled && (
        <>
          {/* ========================================================================= */}
          {/* SECTION 2: DESIGN & BACKGROUND (Colors, Gradients, Images, Videos, Presets) */}
          {/* ========================================================================= */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('design')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Design & Background</span>
                  <span className="text-[10px] text-slate-500">
                    Colors, gradients, images, videos, presets & elements
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.design ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.design && (
              <div className="p-3 pt-0 border-t border-slate-100 space-y-3.5">
                {/* 1-Click Design Presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    1-Click Design Presets
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'minimalist', name: 'Minimalist Clean', color: '#fcfbf9', border: '#e2e8f0' },
                      { id: 'royal-gold', name: 'Royal Gold', color: '#172520', border: '#c5a059' },
                      { id: 'botanical', name: 'Botanical Sage', color: '#d8e5dd', border: '#2d5043' },
                      { id: 'midnight', name: 'Midnight Luxe', color: '#090d16', border: '#3b82f6' },
                      { id: 'bokeh-video', name: 'Bokeh Romance', color: '#311b0b', border: '#f59e0b' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyDesignPreset(p.id)}
                        className="p-1.5 rounded-lg border text-left transition-all hover:border-slate-400 hover:shadow-xs cursor-pointer flex items-center gap-1.5 bg-slate-50"
                        style={{ borderColor: p.border }}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 border border-black/20"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-[9.5px] font-medium text-slate-800 truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Type Selection */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                      Background Type
                    </label>
                    <span className="text-[9.5px] text-slate-400 capitalize">
                      {currentBgType}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['color', 'gradient', 'image', 'video'] as const).map((bgType) => (
                      <button
                        key={bgType}
                        type="button"
                        onClick={() => {
                          if (bgType === 'color') {
                            handleUpdateBackground({ type: 'color', color: page?.background?.color || '#172520' });
                          } else if (bgType === 'gradient') {
                            handleUpdateBackground({
                              type: 'gradient',
                              gradient: { type: 'radial', colors: ['#172520', '#07120d'], angle: 180 }
                            });
                          } else if (bgType === 'image') {
                            const url = config.imageUrl || page?.background?.imageUrl || STOCK_IMAGES[0].url;
                            handleUpdateBackground({
                              type: 'image',
                              imageUrl: url,
                              size: 'cover',
                              position: 'center',
                              overlayColor: '#000000',
                              overlayOpacity: 0.4
                            });
                          } else if (bgType === 'video') {
                            const url = config.videoUrl || page?.background?.videoUrl || STOCK_VIDEOS[0].url;
                            handleUpdateBackground({
                              type: 'video',
                              videoUrl: url,
                              overlayColor: '#000000',
                              overlayOpacity: 0.35
                            });
                          }
                        }}
                        className={`py-1.5 text-center rounded capitalize text-[10px] font-medium transition-colors cursor-pointer ${currentBgType === bgType
                            ? 'bg-white text-slate-900 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        {bgType}
                      </button>
                    ))}
                  </div>

                  {/* 1. Solid Color Background Options */}
                  {currentBgType === 'color' && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-600">Background Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={page?.background?.color || config.background?.color || '#172520'}
                            onChange={(e) => handleUpdateBackground({ type: 'color', color: e.target.value })}
                            className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                          />
                          <span className="text-[10px] font-mono text-slate-700">
                            {page?.background?.color || config.background?.color || '#172520'}
                          </span>
                        </div>
                      </div>
                      {/* Curated Swatches */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {['#172520', '#090d16', '#1e1b4b', '#fcfbf9', '#ffffff', '#2d5043', '#3b0764', '#18181b'].map(
                          (c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => handleUpdateBackground({ type: 'color', color: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: c }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. Gradient Background Options */}
                  {currentBgType === 'gradient' && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-600">Gradient Type</span>
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              const currentColors = page?.background?.gradient?.colors || ['#172520', '#07120d'];
                              handleUpdateBackground({
                                gradient: { type: 'radial', colors: currentColors, angle: 180 }
                              });
                            }}
                            className={`px-2 py-0.5 text-[9.5px] rounded cursor-pointer ${page?.background?.gradient?.type !== 'linear'
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            Radial
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentColors = page?.background?.gradient?.colors || ['#172520', '#07120d'];
                              handleUpdateBackground({
                                gradient: { type: 'linear', colors: currentColors, angle: 135 }
                              });
                            }}
                            className={`px-2 py-0.5 text-[9.5px] rounded cursor-pointer ${page?.background?.gradient?.type === 'linear'
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            Linear
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-600">Color Stops</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="color"
                              value={page?.background?.gradient?.colors[0] || '#172520'}
                              onChange={(e) => {
                                const c2 = page?.background?.gradient?.colors[1] || '#07120d';
                                handleUpdateBackground({
                                  gradient: {
                                    type: page?.background?.gradient?.type || 'radial',
                                    colors: [e.target.value, c2],
                                    angle: page?.background?.gradient?.angle || 180
                                  }
                                });
                              }}
                              className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                              title="Start Color"
                            />
                            <span className="text-[9.5px] text-slate-500">Start</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="color"
                              value={page?.background?.gradient?.colors[1] || '#07120d'}
                              onChange={(e) => {
                                const c1 = page?.background?.gradient?.colors[0] || '#172520';
                                handleUpdateBackground({
                                  gradient: {
                                    type: page?.background?.gradient?.type || 'radial',
                                    colors: [c1, e.target.value],
                                    angle: page?.background?.gradient?.angle || 180
                                  }
                                });
                              }}
                              className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                              title="End Color"
                            />
                            <span className="text-[9.5px] text-slate-500">End</span>
                          </div>
                        </div>
                      </div>

                      {/* Linear Angle */}
                      {page?.background?.gradient?.type === 'linear' && (
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className="text-slate-600">Linear Angle:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="360"
                              step="15"
                              value={page?.background?.gradient?.angle ?? 135}
                              onChange={(e) => {
                                const currentColors = page?.background?.gradient?.colors || ['#172520', '#07120d'];
                                handleUpdateBackground({
                                  gradient: {
                                    type: 'linear',
                                    colors: currentColors,
                                    angle: parseInt(e.target.value, 10)
                                  }
                                });
                              }}
                              className="w-20 accent-indigo-600 cursor-pointer"
                            />
                            <span className="font-mono text-[10px] text-slate-800">
                              {page?.background?.gradient?.angle ?? 135}°
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Background Image Options */}
                  {currentBgType === 'image' && (
                    <div className="p-2.5 rounded-lg bg-pink-50/40 border border-pink-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-semibold text-slate-700 block">Background Image</label>
                        <button
                          type="button"
                          onClick={() => {
                            setPickerTarget('image');
                            setIsAssetPickerOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-pink-100 hover:bg-pink-200 text-pink-800 font-semibold text-[9.5px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <FolderOpen className="w-3 h-3" />
                          <span>Media Library</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={page?.background?.imageUrl || config.imageUrl || ''}
                        onChange={(e) => {
                          const url = e.target.value;
                          updateConfig({ imageUrl: url });
                          handleUpdateBackground({ imageUrl: url });
                        }}
                        placeholder="https://.../photo.jpg"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-pink-600 text-[11px]"
                      />

                      {/* Image Fit & Position */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-pink-200/50">
                        <div>
                          <label className="text-[9.5px] text-slate-600 block mb-1">Image Fit</label>
                          <select
                            value={page?.background?.size || 'cover'}
                            onChange={(e) => handleUpdateBackground({ size: e.target.value as any })}
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1 text-slate-800 cursor-pointer"
                          >
                            <option value="cover">Cover (Fill Frame)</option>
                            <option value="contain">Contain (Fit In)</option>
                            <option value="auto">Auto / Tile</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9.5px] text-slate-600 block mb-1">Position</label>
                          <select
                            value={page?.background?.position || 'center'}
                            onChange={(e) => handleUpdateBackground({ position: e.target.value as any })}
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1 text-slate-800 cursor-pointer"
                          >
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                          </select>
                        </div>
                      </div>

                      {/* Stock Presets */}
                      <div>
                        <span className="text-[9px] font-semibold text-slate-500 block mb-1">Stock Presets:</span>
                        <div className="flex flex-wrap gap-1">
                          {STOCK_IMAGES.map((img) => (
                            <button
                              key={img.name}
                              type="button"
                              onClick={() => {
                                updateConfig({ imageUrl: img.url });
                                handleUpdateBackground({ imageUrl: img.url });
                              }}
                              className={`text-[9.5px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${(page?.background?.imageUrl || config.imageUrl) === img.url
                                  ? 'bg-pink-100 border-pink-400 text-pink-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {img.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dimming Overlay */}
                      <div className="space-y-1 pt-1.5 border-t border-pink-200/60">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-600">Overlay Dimming</span>
                          <span className="font-mono text-slate-800">
                            {Math.round((page?.background?.overlayOpacity ?? (config.imageOverlayOpacity ?? 0.4)) * 100)}
                            %
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.85"
                          step="0.05"
                          value={page?.background?.overlayOpacity ?? (config.imageOverlayOpacity ?? 0.4)}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            updateConfig({ imageOverlayOpacity: val });
                            handleUpdateBackground({ overlayOpacity: val });
                          }}
                          className="w-full accent-pink-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Background Video Options */}
                  {currentBgType === 'video' && (
                    <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-semibold text-slate-700 block">Video Source URL</label>
                        <button
                          type="button"
                          onClick={() => {
                            setPickerTarget('video');
                            setIsAssetPickerOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[9.5px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <FolderOpen className="w-3 h-3" />
                          <span>Media Library</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={page?.background?.videoUrl || config.videoUrl || ''}
                        onChange={(e) => {
                          const url = e.target.value;
                          updateConfig({ videoUrl: url });
                          handleUpdateBackground({ videoUrl: url });
                        }}
                        placeholder="https://.../video.mp4"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-600 font-mono text-[11px]"
                      />

                      {/* Stock Video Presets */}
                      <div>
                        <span className="text-[9px] font-semibold text-slate-500 block mb-1">
                          Stock Video Presets:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {STOCK_VIDEOS.map((v) => (
                            <button
                              key={v.name}
                              type="button"
                              onClick={() => {
                                updateConfig({ videoUrl: v.url, videoPosterUrl: v.poster });
                                handleUpdateBackground({ videoUrl: v.url });
                              }}
                              className={`text-[9.5px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${(page?.background?.videoUrl || config.videoUrl) === v.url
                                  ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {v.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Poster Image URL */}
                      <div>
                        <label className="text-[9.5px] text-slate-600 block mb-1">Poster Thumbnail (Optional)</label>
                        <input
                          type="text"
                          value={config.videoPosterUrl || ''}
                          onChange={(e) => updateConfig({ videoPosterUrl: e.target.value })}
                          placeholder="https://.../poster.jpg"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[10px]"
                        />
                      </div>

                      {/* Video Dimming Overlay */}
                      <div className="space-y-1 pt-1.5 border-t border-amber-200/60">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-600">Video Scrim Dimming</span>
                          <span className="font-mono text-slate-800">
                            {Math.round((page?.background?.overlayOpacity ?? 0.35) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.85"
                          step="0.05"
                          value={page?.background?.overlayOpacity ?? 0.35}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            handleUpdateBackground({ overlayOpacity: val });
                          }}
                          className="w-full accent-amber-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Action Canvas Elements */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                      Canvas Elements (Quick Add)
                    </label>
                    <span className="text-[9.5px] text-slate-400">Add to canvas</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Add Heading / Text */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddElement) {
                          const canvasW = page?.width || DEFAULT_COVER_WIDTH;
                          onAddElement('text', {
                            name: 'Heading Element',
                            style: {
                              x: Math.round(canvasW / 2 - 140),
                              y: 120,
                              width: 280,
                              height: 60,
                              fontSize: 24,
                              fontWeight: 700,
                              color: '#ffffff',
                              textAlign: 'center'
                            },
                            content: {
                              text: 'You Are Cordially Invited'
                            }
                          });
                        }
                      }}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-[10.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Type className="w-3.5 h-3.5 text-indigo-600" />
                      <span>+ Add Heading</span>
                    </button>

                    {/* Add Open Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddElement) {
                          const canvasW = page?.width || DEFAULT_COVER_WIDTH;
                          const canvasH = page?.height || DEFAULT_COVER_HEIGHT;
                          const btn = createOpenInvitationButtonElement(
                            undefined,
                            config.openButtonText || 'Open Invitation',
                            config.sealColor || '#c5a059',
                            undefined,
                            undefined,
                            240,
                            canvasW,
                            canvasH
                          );
                          onAddElement('button', btn);
                        }
                      }}
                      className="p-2 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 text-[10.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>+ Add Button</span>
                    </button>

                    {/* Add Photo */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddElement) {
                          const canvasW = page?.width || DEFAULT_COVER_WIDTH;
                          onAddElement('image', {
                            name: 'Photo Element',
                            style: {
                              x: Math.round(canvasW / 2 - 120),
                              y: 100,
                              width: 240,
                              height: 180,
                              borderRadius: 16
                            },
                            content: {
                              imageUrl: STOCK_IMAGES[0].url
                            }
                          });
                        }
                      }}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-[10.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
                      <span>+ Add Photo</span>
                    </button>

                    {/* Add Video */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddElement) {
                          const canvasW = page?.width || DEFAULT_COVER_WIDTH;
                          onAddElement('video', {
                            name: 'Video Element',
                            style: {
                              x: Math.round(canvasW / 2 - 140),
                              y: 80,
                              width: 280,
                              height: 200,
                              borderRadius: 16
                            },
                            content: {
                              videoUrl: STOCK_VIDEOS[0].url
                            }
                          });
                        }
                      }}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-[10.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5 text-blue-600" />
                      <span>+ Add Video Box</span>
                    </button>
                  </div>

                  {/* Add Optional Envelope Card element */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const envelopeElements = buildMinimalEnvelopeElements({
                          ...config,
                          envelopeColor: config.envelopeColor || '#18181b',
                          sealColor: config.sealColor || '#c5a059',
                          openButtonText: config.openButtonText || 'Open Invitation'
                        });
                        const currentElements = page?.elements || [];
                        const merged = [...currentElements, ...envelopeElements];
                        if (onUpdatePage) onUpdatePage({ elements: merged });
                        updateConfig({
                          page: {
                            ...(page || config.page),
                            elements: merged
                          } as InvitationPage
                        });
                      }}
                      className="w-full p-2 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-700" />
                      <span>+ Add Decorative Envelope Card</span>
                    </button>
                  </div>

                  <p className="text-[9.5px] text-slate-500 pt-1">
                    💡 <em>Click any element directly on the canvas to customize its typography, colors, borders, and animations in the dedicated inspector.</em>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: OPENING BEHAVIOR (Advance Triggers & Video Playback)           */}
          {/* ========================================================================= */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('behavior')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Opening Behavior</span>
                  <span className="text-[10px] text-slate-500">
                    Advance triggers (Button, Tap, Timer, Video end) & Playback
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.behavior ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.behavior && (
              <div className="p-3 pt-0 border-t border-slate-100 space-y-3.5">
                {/* Advance Trigger Selection */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    How Viewer Opens the Invitation
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateConfig({ imageAdvanceTrigger: 'click-button' })}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${imageAdvanceTrigger === 'click-button'
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className="text-[10.5px]">🔘 Click Button</div>
                      <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">
                        Taps 'Open Invitation' button
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateConfig({ imageAdvanceTrigger: 'click-anywhere' })}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${imageAdvanceTrigger === 'click-anywhere'
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className="text-[10.5px]">👆 Tap Anywhere</div>
                      <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">
                        Taps anywhere on opening screen
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({
                          imageAdvanceTrigger: 'auto-timer',
                          imageTimerSeconds: config.imageTimerSeconds || 3.5
                        })
                      }
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${imageAdvanceTrigger === 'auto-timer'
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className="text-[10.5px]">⏱️ Auto-Timer</div>
                      <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">
                        Advances automatically on delay
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({
                          videoAutoAdvanceOnEnd: true,
                          imageAdvanceTrigger: 'click-button'
                        })
                      }
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${config.videoAutoAdvanceOnEnd !== false && isVideoBg
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className="text-[10.5px]">🎬 Video End</div>
                      <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">
                        Advances on video completion
                      </div>
                    </button>
                  </div>

                  {/* Auto-timer delay slider */}
                  {imageAdvanceTrigger === 'auto-timer' && (
                    <div className="mt-2 p-2 bg-indigo-50/60 rounded-lg border border-indigo-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-700 font-medium">Auto-Advance Delay:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1.5"
                          max="10"
                          step="0.5"
                          value={config.imageTimerSeconds || 3.5}
                          onChange={(e) => updateConfig({ imageTimerSeconds: parseFloat(e.target.value) })}
                          className="w-24 accent-indigo-600 cursor-pointer"
                        />
                        <span className="font-mono text-xs text-indigo-700 font-bold">
                          {config.imageTimerSeconds || 3.5}s
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Playback Controls (if background is video, or videoUrl is present) */}
                {(isVideoBg || Boolean(config.videoUrl)) && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      Video Playback Mode
                    </label>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateConfig({ videoPlayMode: 'autoplay', videoAutoAdvanceOnEnd: true })}
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${videoPlayMode === 'autoplay'
                            ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-slate-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                          }`}
                      >
                        <div className="text-[10px]">▶️ Auto-Play & Enter</div>
                        <div className="text-[8px] text-slate-500 font-normal mt-0.5">Plays automatically</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({ videoPlayMode: 'scroll-based', videoAutoAdvanceOnEnd: true, videoMuted: true })
                        }
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${videoPlayMode === 'scroll-based'
                            ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-slate-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                          }`}
                      >
                        <div className="text-[10px]">📜 Scroll to Scrub</div>
                        <div className="text-[8px] text-slate-500 font-normal mt-0.5">Frame-by-frame scrub</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({ videoPlayMode: 'click-to-play', videoAutoAdvanceOnEnd: true, videoMuted: false })
                        }
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${videoPlayMode === 'click-to-play'
                            ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-slate-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                          }`}
                      >
                        <div className="text-[10px]">👆 Click to Play</div>
                        <div className="text-[8px] text-slate-500 font-normal mt-0.5">Tap to play with audio</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({ videoPlayMode: 'click-to-open', videoAutoAdvanceOnEnd: false, videoLoop: true })
                        }
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${videoPlayMode === 'click-to-open'
                            ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-slate-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                          }`}
                      >
                        <div className="text-[10px]">🔁 Ambient Loop</div>
                        <div className="text-[8px] text-slate-500 font-normal mt-0.5">Loops continuously</div>
                      </button>
                    </div>

                    {/* Sound & Autoplay settings */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-700">Muted by Default</span>
                        <input
                          type="checkbox"
                          checked={config.videoMuted !== false}
                          onChange={(e) => updateConfig({ videoMuted: e.target.checked })}
                          className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-700">Advance on Video End</span>
                        <input
                          type="checkbox"
                          checked={config.videoAutoAdvanceOnEnd !== false}
                          onChange={(e) => updateConfig({ videoAutoAdvanceOnEnd: e.target.checked })}
                          className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-700">Loop Video</span>
                        <input
                          type="checkbox"
                          checked={Boolean(config.videoLoop)}
                          onChange={(e) => updateConfig({ videoLoop: e.target.checked })}
                          className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: OPENING TRANSITION (Global reveal animation & Duration)        */}
          {/* ========================================================================= */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('transition')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Opening Transition</span>
                  <span className="text-[10px] text-slate-500">
                    Cover reveal effect, duration & live mini-preview
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.transition ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.transition && (
              <div className="p-3 pt-0 border-t border-slate-100 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                    Page Reveal Transition Effect
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTriggerMiniPreview()}
                    className="flex items-center gap-1 text-[10px] font-bold text-pink-700 hover:text-pink-900 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    <Play className="w-2.5 h-2.5 fill-pink-700" />
                    <span>Preview Effect</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'zoom-fade', name: '🔍 Zoom & Fade', desc: 'Cinematic Ken Burns dissolve into page 1' },
                    { id: 'curtain-split', name: '🚪 Curtain Split', desc: 'Split doors glide outward' },
                    { id: 'slide-up', name: '⬆️ Slide Up Pull', desc: 'Cover elevates smoothly like a sleeve' },
                    { id: 'blur-dissolve', name: '✨ Soft Blur Dissolve', desc: 'Dreamy luxury blur crossfade' },
                    { id: 'book-flip', name: '📖 3D Book Flip', desc: 'Flips over horizontally in 3D' },
                    { id: 'envelope-unfold', name: '💌 Envelope Unfold', desc: 'Flap unfastens and unfolds into page' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        updateConfig({
                          coverTransitionEffect: t.id as any,
                          imageTransitionEffect: t.id as any
                        });
                        handleTriggerMiniPreview(t.id as any);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${globalTransitionEffect === t.id
                          ? 'border-pink-500 bg-pink-50/40 ring-1 ring-pink-500 text-slate-900 shadow-xs font-medium'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <span className="font-bold text-[10.5px] block text-slate-900">{t.name}</span>
                      <span className="text-[8.5px] text-slate-500 leading-tight block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Transition Duration Slider */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-slate-700">Transition Duration</span>
                    <span className="font-mono text-pink-700 font-bold">{transitionDuration.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.05"
                    value={transitionDuration}
                    onChange={(e) => {
                      const dur = parseFloat(e.target.value);
                      updateConfig({
                        transitionDuration: dur,
                        imageTransitionDuration: dur
                      });
                    }}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>Fast (0.4s)</span>
                    <span>Smooth (0.85s)</span>
                    <span>Cinematic (2.5s)</span>
                  </div>
                </div>

                {/* Live Mini Preview Box */}
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-[10px] text-slate-300 mb-1.5 px-1">
                    <span className="font-semibold text-amber-400">Live Transition Simulator</span>
                    <button
                      type="button"
                      onClick={() => handleTriggerMiniPreview()}
                      className="text-[9px] text-pink-300 hover:text-pink-100 flex items-center gap-1 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-600"
                    >
                      <Play className="w-2.5 h-2.5 fill-pink-400" />
                      <span>Replay</span>
                    </button>
                  </div>
                  <div className="w-full h-24 rounded bg-slate-800 relative overflow-hidden flex items-center justify-center border border-slate-700 select-none">
                    {/* Revealed Page 1 under cover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 flex flex-col items-center justify-center text-center p-2">
                      <span className="text-[10px] font-bold text-amber-200">Page 1 (Invitation Content)</span>
                      <span className="text-[8px] text-slate-300">You are cordially invited</span>
                    </div>

                    {/* Animating Cover Simulator */}
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-700 ${currentBgType === 'image'
                          ? 'bg-gradient-to-b from-rose-950/90 to-slate-950/90'
                          : currentBgType === 'video'
                            ? 'bg-gradient-to-b from-amber-950/90 to-slate-950/90'
                            : 'bg-gradient-to-b from-emerald-950/95 to-slate-950/95'
                        } ${animatingPreview
                          ? globalTransitionEffect === 'slide-up'
                            ? '-translate-y-full opacity-0 duration-700 ease-out'
                            : globalTransitionEffect === 'curtain-split'
                              ? 'scale-110 opacity-0 blur-xs duration-700 [clip-path:inset(0%_50%_0%_50%)]'
                              : globalTransitionEffect === 'blur-dissolve'
                                ? 'blur-md opacity-0 scale-105 duration-700'
                                : globalTransitionEffect === 'book-flip'
                                  ? '-rotate-y-90 -translate-x-1/4 opacity-0 duration-700 origin-left'
                                  : globalTransitionEffect === 'envelope-unfold'
                                    ? '-translate-y-3/4 rotate-x-30 opacity-0 duration-700 origin-bottom'
                                    : 'scale-125 opacity-0 blur-xs duration-700'
                          : 'translate-y-0 scale-100 opacity-100 rotate-0 blur-none [clip-path:inset(0%_0%_0%_0%)]'
                        }`}
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300">
                        {currentBgType === 'image'
                          ? '📸 Photo Background'
                          : currentBgType === 'video'
                            ? '🎬 Video Background'
                            : '✨ Opening Screen'}
                      </span>
                      <span className="text-[8px] text-slate-300 mt-0.5">
                        {animatingPreview ? 'Opening to Page 1...' : 'Click Replay to preview transition'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5: EXTRAS (Skip Button, Confetti, Autoplay Music & Particles)      */}
          {/* ========================================================================= */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('extras')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  5
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Extras & Celebration</span>
                  <span className="text-[10px] text-slate-500">
                    Skip button, confetti burst, music autoplay & floating particles
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.extras ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.extras && (
              <div className="p-3 pt-0 border-t border-slate-100 space-y-3">
                {/* Skip to Invitation Button */}
                <div className="space-y-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-medium text-slate-800">Show 'Skip to Invitation' Button</span>
                    <input
                      type="checkbox"
                      checked={config.showSkipButton !== false}
                      onChange={(e) => updateConfig({ showSkipButton: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                  {config.showSkipButton !== false && (
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-[9.5px] text-slate-500 flex-shrink-0">Label:</label>
                      <input
                        type="text"
                        value={config.skipButtonText || 'Skip to Invitation →'}
                        onChange={(e) => updateConfig({ skipButtonText: e.target.value })}
                        className="flex-1 p-1 text-xs bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  )}
                </div>

                {/* Confetti Celebration */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-medium text-slate-800">Confetti Burst on Opening</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showConfetti !== false}
                    onChange={(e) => updateConfig({ showConfetti: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {/* Music Autoplay on Opening */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium text-slate-800">Autoplay Music on Opening</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.musicAutoplayOnOpen !== false}
                    onChange={(e) => updateConfig({ musicAutoplayOnOpen: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {/* Floating Outer Drops / Particles */}
                <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span className="font-medium text-slate-800">Floating Background Particles</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(config.showOuterDrops)}
                      onChange={(e) => updateConfig({ showOuterDrops: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </div>

                  {config.showOuterDrops && (
                    <div className="space-y-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <label className="text-[9.5px] text-slate-600 block mb-1">Particle Effect Type</label>
                        <select
                          value={config.outerDropEffect || 'hearts'}
                          onChange={(e) => updateConfig({ outerDropEffect: e.target.value as OuterDropEffectType })}
                          className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 font-medium"
                        >
                          <option value="hearts">❤️ Floating Hearts</option>
                          <option value="sparkles">✨ Shimmering Sparkles</option>
                          <option value="petals">🌸 Falling Rose Petals</option>
                          <option value="stars">⭐ Twinkling Stars</option>
                          <option value="butterflies">🦋 Fluttering Butterflies</option>
                          <option value="confetti">🎉 Confetti Rain</option>
                          <option value="bubbles">🫧 Gentle Bubbles</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[9.5px] text-slate-600">Particle Tint Color</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={config.outerDropColor || '#f43f5e'}
                            onChange={(e) => updateConfig({ outerDropColor: e.target.value })}
                            className="w-5 h-5 rounded border border-slate-300 cursor-pointer bg-transparent"
                          />
                          <span className="text-[9.5px] font-mono text-slate-700">
                            {config.outerDropColor || '#f43f5e'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 6: ADVANCED SETTINGS (Dimensions & Reset Blank)                   */}
          {/* ========================================================================= */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('advanced')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  6
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Advanced Settings</span>
                  <span className="text-[10px] text-slate-500">
                    Canvas dimensions, custom px & clear to blank
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openSections.advanced ? 'rotate-180' : ''}`}
              />
            </button>

            {openSections.advanced && (
              <div className="p-3 pt-0 border-t border-slate-100 space-y-3.5">
                {/* Canvas Width Control */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">Canvas Width</span>
                    <span className="font-mono text-blue-700 font-bold">
                      {page?.width || config.page?.width || DEFAULT_COVER_WIDTH}px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="300"
                      max="900"
                      step="10"
                      value={page?.width || config.page?.width || DEFAULT_COVER_WIDTH}
                      onChange={(e) => handleDimensionUpdate({ width: Number(e.target.value) })}
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min="300"
                      max="950"
                      value={page?.width || config.page?.width || DEFAULT_COVER_WIDTH}
                      onChange={(e) => handleDimensionUpdate({ width: Number(e.target.value) })}
                      className="w-14 text-xs bg-white border border-slate-200 rounded p-1 font-mono text-center"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[9.5px]">
                    {[
                      { label: '520 (Default)', val: DEFAULT_COVER_WIDTH },
                      { label: '390 (Mobile)', val: 390 },
                      { label: '420 (Pro Max)', val: 420 },
                      { label: '768 (Tablet)', val: 768 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleDimensionUpdate({ width: preset.val })}
                        className={`py-1 px-1.5 rounded border transition-colors text-center cursor-pointer ${(page?.width || config.page?.width || DEFAULT_COVER_WIDTH) === preset.val
                            ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas Height Control */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">Canvas Height</span>
                    <span className="font-mono text-blue-700 font-bold">
                      {page?.heightMode === 'viewport'
                        ? 'Viewport'
                        : page?.heightMode === 'auto'
                          ? 'Auto'
                          : `${page?.height || config.page?.height || DEFAULT_COVER_HEIGHT}px`}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        handleDimensionUpdate({
                          heightMode: 'viewport',
                          isFullHeight: true,
                          height: typeof window !== 'undefined' ? window.innerHeight : 844
                        })
                      }
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${page?.heightMode === 'viewport' ||
                          (page?.isFullHeight && page?.heightMode !== 'custom' && page?.heightMode !== 'auto')
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      Viewport
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDimensionUpdate({ heightMode: 'auto', isFullHeight: false })}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${page?.heightMode === 'auto'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDimensionUpdate({
                          heightMode: 'custom',
                          isFullHeight: false,
                          height: page?.height || config.page?.height || DEFAULT_COVER_HEIGHT
                        })
                      }
                      className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${page?.heightMode === 'custom' || (!page?.heightMode && page?.height)
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      Custom Px
                    </button>
                  </div>

                  {(page?.heightMode === 'custom' || !page?.heightMode) && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="280"
                          max="1600"
                          step="20"
                          value={page?.height || config.page?.height || DEFAULT_COVER_HEIGHT}
                          onChange={(e) =>
                            handleDimensionUpdate({
                              height: Number(e.target.value),
                              heightMode: 'custom',
                              isFullHeight: false
                            })
                          }
                          className="flex-1 accent-blue-600 cursor-pointer"
                        />
                        <input
                          type="number"
                          min="280"
                          max="2000"
                          value={page?.height || config.page?.height || DEFAULT_COVER_HEIGHT}
                          onChange={(e) =>
                            handleDimensionUpdate({
                              height: Number(e.target.value),
                              heightMode: 'custom',
                              isFullHeight: false
                            })
                          }
                          className="w-14 text-xs bg-white border border-slate-200 rounded p-1 font-mono text-center"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-[9.5px]">
                        {[
                          { label: '400px (Default)', val: DEFAULT_COVER_HEIGHT },
                          { label: '520px (Square)', val: 520 },
                          { label: '640px (Card)', val: 640 },
                          { label: '844px (Mobile)', val: 844 }
                        ].map((presetH) => (
                          <button
                            key={presetH.label}
                            type="button"
                            onClick={() =>
                              handleDimensionUpdate({
                                height: presetH.val,
                                heightMode: 'custom',
                                isFullHeight: false
                              })
                            }
                            className={`py-1 px-1.5 rounded border transition-colors text-center cursor-pointer ${(page?.height || config.page?.height || DEFAULT_COVER_HEIGHT) === presetH.val
                                ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                          >
                            {presetH.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Canvas Action */}
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <span className="text-[10px] font-semibold text-rose-700 block">Clear & Reset Canvas</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdatePage) onUpdatePage({ elements: [] });
                      updateConfig({
                        page: {
                          ...(page || config.page),
                          elements: []
                        } as InvitationPage
                      });
                    }}
                    className="w-full py-2 px-3 bg-white border border-rose-200 hover:border-rose-400 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Canvas Elements (Start Blank)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Background Asset Picker Modal */}
      <BackgroundAssetPickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        onSelect={handleSelectAssetFromPicker}
      />
    </div>
  );
};
