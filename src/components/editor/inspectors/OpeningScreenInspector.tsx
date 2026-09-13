import React, { useState } from 'react';
import {
  OpeningScreenConfig,
  VideoPlayMode,
  ImageTransitionEffect,
  ImageAdvanceTrigger,
  OpeningCoverType,
  OuterDropEffectType
} from '../../../types';
import { GOOGLE_FONTS_LIST } from '../../../data/stockAssets';
import {
  Video,
  Image as ImageIcon,
  Mail,
  Play,
  MousePointer,
  Sparkles,
  Volume2,
  VolumeX,
  FastForward,
  Clock,
  Layers,
  ChevronDown,
  Eye,
  Sliders,
  Type,
  Palette,
  ExternalLink,
  MoveUp,
  MousePointerClick,
  Edit3,
  PlusCircle,
  Trash2,
  Heart,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { InvitationPage, ElementType, CanvasElement } from '../../../types';
import {
  DEFAULT_COVER_WIDTH,
  DEFAULT_COVER_HEIGHT,
  createOpenInvitationButtonElement,
  buildMinimalEnvelopeElements
} from '../../../utils/openingScreenUtils';

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
  const openButtonElement = page?.elements?.find(
    (el) => el.id === 'open-elem-button' || el.content?.buttonAction === 'open-invitation' || el.type === 'button'
  );
  const hasButtonOnCanvas = Boolean(openButtonElement);

  // Determine active cover type: strictly respect coverType if present; otherwise deduce from background type or style
  const activeCoverType: OpeningCoverType =
    config.coverType ||
    (config.style === 'card-flip' || config.background?.type === 'image' || page?.background?.type === 'image'
      ? 'image'
      : config.style === 'video-cover' || config.background?.type === 'video' || page?.background?.type === 'video'
      ? 'video'
      : config.style === 'custom-page'
      ? 'custom-page'
      : config.imageUrl && !config.videoUrl
      ? 'image'
      : config.videoUrl
      ? 'video'
      : 'envelope');

  // Centralized updater that strictly guarantees activeCoverType is never lost
  const updateConfig = (updates: Partial<OpeningScreenConfig>) => {
    onUpdate({
      coverType: updates.coverType || activeCoverType,
      ...updates
    });
  };

  const videoPlayMode: VideoPlayMode = config.videoPlayMode || 'autoplay';
  const globalTransitionEffect: ImageTransitionEffect =
    config.coverTransitionEffect || config.imageTransitionEffect || 'zoom-fade';
  const imageTransitionEffect: ImageTransitionEffect = globalTransitionEffect;
  const imageAdvanceTrigger: ImageAdvanceTrigger = config.imageAdvanceTrigger || 'click-button';

  // Live mini preview state for testing transitions directly in inspector
  const [animatingPreview, setAnimatingPreview] = useState(false);
  const handleTriggerMiniPreview = (effect?: ImageTransitionEffect) => {
    if (effect && effect !== globalTransitionEffect) {
      updateConfig({
        coverType: activeCoverType,
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

  return (
    <div className="space-y-4 text-xs text-slate-700">
      {/* Test Opening Screen Banner Button */}
      {onTestOpeningScreen && (
        <button
          type="button"
          onClick={onTestOpeningScreen}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group"
        >
          <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
          <span>Test Opening Screen Experience</span>
        </button>
      )}

      {/* Cover Type Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Opening Cover Type
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              const vidUrl = config.videoUrl || STOCK_VIDEOS[0].url;
              updateConfig({
                coverType: 'video',
                style: 'video-cover',
                videoUrl: vidUrl,
                background: {
                  type: 'video',
                  videoUrl: vidUrl,
                  overlayColor: '#000000',
                  overlayOpacity: 0.35
                },
                coverTransitionEffect: globalTransitionEffect,
                imageTransitionEffect: globalTransitionEffect,
                videoPlayMode: config.videoPlayMode || 'autoplay',
                videoAutoAdvanceOnEnd: config.videoAutoAdvanceOnEnd !== false
              });
            }}
            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-lg text-center transition-all cursor-pointer ${
              activeCoverType === 'video'
                ? 'bg-white text-amber-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4 text-amber-600" />
            <span className="text-[10px]">Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const imgUrl = config.imageUrl || STOCK_IMAGES[0].url;
              updateConfig({
                coverType: 'image',
                style: 'card-flip',
                imageUrl: imgUrl,
                background: {
                  type: 'image',
                  imageUrl: imgUrl,
                  size: 'cover',
                  position: 'center',
                  overlayColor: '#000000',
                  overlayOpacity: config.imageOverlayOpacity ?? 0.4
                },
                coverTransitionEffect: globalTransitionEffect,
                imageTransitionEffect: globalTransitionEffect,
                imageAdvanceTrigger: config.imageAdvanceTrigger || 'click-button'
              });
            }}
            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-lg text-center transition-all cursor-pointer ${
              activeCoverType === 'image'
                ? 'bg-white text-amber-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-pink-600" />
            <span className="text-[10px]">Image</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateConfig({
                coverType: 'envelope',
                style: 'envelope',
                background: {
                  type: 'gradient',
                  gradient: { type: 'radial', colors: ['#172520', '#07120d'], angle: 180 },
                  overlayColor: config.sealColor || '#c5a059',
                  overlayOpacity: 0.05
                },
                coverTransitionEffect: globalTransitionEffect,
                imageTransitionEffect: globalTransitionEffect
              });
            }}
            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-lg text-center transition-all cursor-pointer ${
              activeCoverType === 'envelope'
                ? 'bg-white text-amber-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px]">Envelope</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateConfig({
                coverType: 'custom-page',
                style: 'custom-page',
                coverTransitionEffect: globalTransitionEffect,
                imageTransitionEffect: globalTransitionEffect
              });
            }}
            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-lg text-center transition-all cursor-pointer ${
              activeCoverType === 'custom-page'
                ? 'bg-white text-purple-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="text-[10px]">Blank / Custom</span>
          </button>
        </div>
      </div>

      {/* ======================= GLOBAL PAGE REVEAL TRANSITION ======================= */}
      <div className="space-y-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
        <div className="flex items-center justify-between pb-1.5 border-b border-indigo-200/60">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Page Reveal Transition (Global)</span>
          </div>
          <button
            type="button"
            onClick={() => handleTriggerMiniPreview()}
            className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-100/90 hover:bg-indigo-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            title="Preview reveal animation right now"
          >
            <Play className="w-2.5 h-2.5 fill-indigo-700" />
            <span>Preview Animation</span>
          </button>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
            How Cover Screen Transitions to First Page
          </label>
          <p className="text-[9.5px] text-slate-500 mb-2">
            Applied universally to {activeCoverType === 'image' ? 'Image' : activeCoverType === 'video' ? 'Video' : activeCoverType === 'envelope' ? 'Envelope' : 'Cover'} when opening the invitation.
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'zoom-fade', name: '🔍 Zoom & Fade', desc: 'Cinematic Ken Burns zoom dissolves into first page' },
              { id: 'curtain-split', name: '🚪 Curtain Split', desc: 'Split doors glide open outward to reveal first page' },
              { id: 'slide-up', name: '⬆️ Slide Up Pull', desc: 'Cover elevates smoothly like a sleeve pulling open' },
              { id: 'blur-dissolve', name: '✨ Soft Blur Dissolve', desc: 'Dreamy luxury blur crossfade into first page' },
              { id: 'book-flip', name: '📖 3D Book Flip', desc: 'Flips over horizontally in 3D perspective' },
              { id: 'envelope-unfold', name: '💌 Envelope Unfold', desc: 'Wax seal unfastens & letter unfolds into page 1' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  updateConfig({
                    coverType: activeCoverType,
                    coverTransitionEffect: t.id as any,
                    imageTransitionEffect: t.id as any
                  });
                  handleTriggerMiniPreview(t.id as any);
                }}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  globalTransitionEffect === t.id
                    ? 'border-indigo-500 bg-white ring-1 ring-indigo-500 text-slate-900 shadow-xs font-medium'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-indigo-950">{t.name}</span>
                <span className="text-[9px] text-slate-500 leading-tight block mt-0.5">
                  {t.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Mini Interactive Preview Box */}
          <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[10px] text-slate-300 mb-1.5 px-1">
              <span className="font-semibold text-amber-400">Live Transition Simulator</span>
              <button
                type="button"
                onClick={() => handleTriggerMiniPreview()}
                className="text-[9px] text-indigo-300 hover:text-indigo-100 flex items-center gap-1 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-600"
              >
                <Play className="w-2.5 h-2.5 fill-indigo-400" />
                <span>Replay</span>
              </button>
            </div>
            <div className="w-full h-24 rounded bg-slate-800 relative overflow-hidden flex items-center justify-center border border-slate-700 select-none">
              {/* Revealed Page 1 under cover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 flex flex-col items-center justify-center text-center p-2">
                <span className="text-[10px] font-bold text-amber-200">Page 1 (Wedding Details)</span>
                <span className="text-[8px] text-slate-300">You are cordially invited</span>
              </div>

              {/* Animating Cover Simulator */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-700 ${
                  activeCoverType === 'image'
                    ? 'bg-gradient-to-b from-rose-950/90 to-slate-950/90'
                    : activeCoverType === 'video'
                    ? 'bg-gradient-to-b from-amber-950/90 to-slate-950/90'
                    : 'bg-gradient-to-b from-emerald-950/95 to-slate-950/95'
                } ${
                  animatingPreview
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
                  {activeCoverType === 'image' ? '📸 Image Cover' : activeCoverType === 'video' ? '🎬 Video Cover' : '💌 Envelope Cover'}
                </span>
                <span className="text-[8px] text-slate-300 mt-0.5">
                  {animatingPreview ? 'Opening to Page 1...' : 'Click Replay to preview animation'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Advance Trigger (How Viewer Moves to First Page) */}
        <div className="pt-2 border-t border-indigo-200/60">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Advance Trigger (How Viewer Moves to First Page)
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onUpdate({ imageAdvanceTrigger: 'click-button' })}
              className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                imageAdvanceTrigger === 'click-button'
                  ? 'border-indigo-500 bg-white ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white/70 text-slate-700'
              }`}
            >
              <div className="text-[10.5px]">🔘 Click Button</div>
              <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">Taps 'Open'</div>
            </button>

            <button
              type="button"
              onClick={() => onUpdate({ imageAdvanceTrigger: 'click-anywhere' })}
              className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                imageAdvanceTrigger === 'click-anywhere'
                  ? 'border-indigo-500 bg-white ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white/70 text-slate-700'
              }`}
            >
              <div className="text-[10.5px]">👆 Tap Anywhere</div>
              <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">Taps anywhere</div>
            </button>

            <button
              type="button"
              onClick={() => onUpdate({ imageAdvanceTrigger: 'auto-timer', imageTimerSeconds: config.imageTimerSeconds || 3.5 })}
              className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                imageAdvanceTrigger === 'auto-timer'
                  ? 'border-indigo-500 bg-white ring-1 ring-indigo-500 text-slate-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white/70 text-slate-700'
              }`}
            >
              <div className="text-[10.5px]">⏱️ Auto-Timer</div>
              <div className="text-[8.5px] text-slate-500 font-normal mt-0.5">Auto delay</div>
            </button>
          </div>

          {imageAdvanceTrigger === 'auto-timer' && (
            <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600">Advance Delay:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1.5"
                  max="8"
                  step="0.5"
                  value={config.imageTimerSeconds || 3.5}
                  onChange={(e) => onUpdate({ imageTimerSeconds: parseFloat(e.target.value) })}
                  className="w-24 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-xs text-indigo-700 font-bold">
                  {config.imageTimerSeconds || 3.5}s
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================= VIDEO COVER CONTROLS ======================= */}
      {activeCoverType === 'video' && (
        <div className="space-y-3.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
          <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Video className="w-4 h-4 text-amber-600" />
              <span>Video Playback & Transition</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {videoPlayMode}
            </span>
          </div>

          {/* Video Play Mode Options */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              How Video Plays & Transitions to First Page
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {/* Mode 1: Autoplay to end -> First Page */}
              <button
                type="button"
                onClick={() => onUpdate({ videoPlayMode: 'autoplay', videoAutoAdvanceOnEnd: true })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  videoPlayMode === 'autoplay'
                    ? 'border-amber-500 bg-white ring-1 ring-amber-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                  <Play className="w-3 h-3 text-amber-600" />
                  <span>Auto-Play & Enter</span>
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1 leading-tight">
                  Plays from start, transitions automatically to first page on end
                </p>
              </button>

              {/* Mode 2: Click to play video -> First Page */}
              <button
                type="button"
                onClick={() => onUpdate({ videoPlayMode: 'click-to-play', videoAutoAdvanceOnEnd: true, videoMuted: false })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  videoPlayMode === 'click-to-play'
                    ? 'border-amber-500 bg-white ring-1 ring-amber-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                  <MousePointer className="w-3 h-3 text-amber-600" />
                  <span>Click to Play & Enter</span>
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1 leading-tight">
                  Tap to start video with sound, transitions to first page on finish
                </p>
              </button>
            </div>
          </div>

          {/* Video URL & Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-600 block">
              Video Source URL (MP4 / WebM)
            </label>
            <input
              type="text"
              value={config.videoUrl || ''}
              onChange={(e) => onUpdate({ videoUrl: e.target.value })}
              placeholder="https://.../video.mp4"
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-600 font-mono text-[11px]"
            />

            {/* Quick stock video presets */}
            <div>
              <span className="text-[9px] font-semibold text-slate-500 block mb-1">
                Luxury Stock Video Presets:
              </span>
              <div className="flex flex-wrap gap-1">
                {STOCK_VIDEOS.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() =>
                      onUpdate({
                        videoUrl: v.url,
                        videoPosterUrl: v.poster
                      })
                    }
                    className={`text-[10px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                      config.videoUrl === v.url
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Poster Image */}
          <div>
            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
              Poster / Placeholder Thumbnail (Optional)
            </label>
            <input
              type="text"
              value={config.videoPosterUrl || ''}
              onChange={(e) => onUpdate({ videoPosterUrl: e.target.value })}
              placeholder="https://.../poster.jpg"
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-600 text-[11px]"
            />
          </div>

          {/* Sound & Autoplay Settings */}
          <div className="space-y-2 pt-2 border-t border-amber-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {config.videoMuted !== false ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span className="text-[11px] font-medium text-slate-800">
                  {config.videoMuted !== false ? 'Video Muted by Default' : 'Enable Audio on User Tap'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.videoMuted !== false}
                onChange={(e) => onUpdate({ videoMuted: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-800">
                Auto-advance on Video Completion
              </span>
              <input
                type="checkbox"
                checked={config.videoAutoAdvanceOnEnd !== false}
                onChange={(e) => onUpdate({ videoAutoAdvanceOnEnd: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-800">
                Show 'Skip to Invitation' Button
              </span>
              <input
                type="checkbox"
                checked={config.showSkipButton !== false}
                onChange={(e) => onUpdate({ showSkipButton: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            {config.showSkipButton !== false && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-[10px] text-slate-500 flex-shrink-0">Skip Label:</label>
                <input
                  type="text"
                  value={config.skipButtonText || 'Skip to Invitation →'}
                  onChange={(e) => onUpdate({ skipButtonText: e.target.value })}
                  className="flex-1 p-1 text-xs bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-amber-600"
                />
              </div>
            )}

            {/* Optional Titles on Video */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
              <div>
                <span className="text-[11px] font-bold text-slate-800 block">Titles On Top Of Video</span>
                <span className="text-[9px] text-slate-500">Show overline, couple names & date overlay</span>
              </div>
              <input
                type="checkbox"
                checked={config.showTextOnCover !== false}
                onChange={(e) => onUpdate({ showTextOnCover: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================= IMAGE COVER CONTROLS ======================= */}
      {activeCoverType === 'image' && (
        <div className="space-y-3.5 p-3 rounded-xl bg-pink-50/40 border border-pink-200/80">
          <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ImageIcon className="w-4 h-4 text-pink-600" />
              <span>Image Cover Photo Settings</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-pink-800 bg-pink-100 px-2 py-0.5 rounded-full">
              Photo Cover
            </span>
          </div>

          {/* Image URL & Stock Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-600 block">
              Cover Photo Image URL
            </label>
            <input
              type="text"
              value={config.imageUrl || ''}
              onChange={(e) => {
                const url = e.target.value;
                updateConfig({
                  coverType: 'image',
                  imageUrl: url,
                  background: {
                    type: 'image',
                    imageUrl: url,
                    size: 'cover',
                    position: 'center',
                    overlayColor: '#000000',
                    overlayOpacity: config.imageOverlayOpacity ?? 0.4
                  }
                });
              }}
              placeholder="https://.../photo.jpg"
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-pink-600 text-[11px]"
            />

            <div>
              <span className="text-[9px] font-semibold text-slate-500 block mb-1">
                Luxury Stock Photo Presets:
              </span>
              <div className="flex flex-wrap gap-1">
                {STOCK_IMAGES.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => {
                      updateConfig({
                        coverType: 'image',
                        imageUrl: img.url,
                        background: {
                          type: 'image',
                          imageUrl: img.url,
                          size: 'cover',
                          position: 'center',
                          overlayColor: '#000000',
                          overlayOpacity: config.imageOverlayOpacity ?? 0.4
                        }
                      });
                    }}
                    className={`text-[10px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                      config.imageUrl === img.url
                        ? 'bg-pink-100 border-pink-400 text-pink-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dark Scrim / Overlay for readability */}
          <div className="space-y-1 pt-2 border-t border-pink-200/50">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-slate-600">Overlay Scrim Dimming</span>
              <span className="font-mono text-slate-800">
                {Math.round((config.imageOverlayOpacity ?? 0.45) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.85"
              step="0.05"
              value={config.imageOverlayOpacity ?? 0.45}
              onChange={(e) => {
                const opacity = parseFloat(e.target.value);
                updateConfig({
                  coverType: 'image',
                  imageOverlayOpacity: opacity
                });
              }}
              className="w-full accent-pink-600 cursor-pointer"
            />
          </div>

          {/* Optional Titles on Image */}
          <div className="flex items-center justify-between pt-2 border-t border-pink-200/60">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">Titles On Top Of Image</span>
              <span className="text-[9px] text-slate-500">Show overline, couple names & date overlay</span>
            </div>
            <input
              type="checkbox"
              checked={config.showTextOnCover !== false}
              onChange={(e) => updateConfig({ coverType: 'image', showTextOnCover: e.target.checked })}
              className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ======================= ENVELOPE CONTROLS ======================= */}
      {activeCoverType === 'envelope' && (
        <div className="space-y-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/80">
          <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Default Minimal Envelope Screen</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Default Minimal
            </span>
          </div>

          {/* Default Minimal Description & Reset */}
          <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-emerald-950">💌 Default Minimal Screen</span>
              <span className="text-[9.5px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Clean, elegant modern envelope layout featuring the two couple names, subtle date subtitle, and a centered interactive button.
            </p>
            <button
              type="button"
              onClick={() => {
                const minimalElems = buildMinimalEnvelopeElements({
                  ...config,
                  envelopeColor: config.envelopeColor || '#18181b',
                  sealColor: config.sealColor || '#c5a059',
                  openButtonText: config.openButtonText || 'Open Invitation'
                });
                if (onUpdatePage) {
                  onUpdatePage({ elements: minimalElems });
                }
                onUpdate({
                  envelopeTemplate: 'simple-modern',
                  page: {
                    ...(page || config.page),
                    elements: minimalElems
                  } as InvitationPage
                });
              }}
              className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Canvas to Default Minimal Screen</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Envelope Card Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={config.envelopeColor || '#18181b'}
                  onChange={(e) => onUpdate({ envelopeColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-700">{config.envelopeColor || '#18181b'}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Wax Seal / Button Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={config.sealColor || '#c5a059'}
                  onChange={(e) => onUpdate({ sealColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-700">{config.sealColor || '#c5a059'}</span>
              </div>
            </div>
          </div>

          {/* Wax Seal Emblem Dropdown & Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Wax Seal Emblem Icon
              </label>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded capitalize">
                Selected: {config.sealIcon || 'heart'}
              </span>
            </div>

            {/* Dropdown Select menu for Seal Emblem */}
            <select
              value={config.sealIcon || 'heart'}
              onChange={(e) => {
                const newIcon = e.target.value;
                updateConfig({
                  coverType: activeCoverType,
                  sealIcon: newIcon
                });
                if (onUpdatePage && page?.elements) {
                  const updatedElements = page.elements.map((el) => {
                    if (el.id === 'open-elem-icon' || el.name === 'Wax Seal Badge') {
                      return {
                        ...el,
                        content: {
                          ...el.content,
                          iconName: newIcon
                        }
                      };
                    }
                    return el;
                  });
                  onUpdatePage({ elements: updatedElements });
                }
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-600 font-medium cursor-pointer shadow-xs"
            >
              <optgroup label="Romance & Love">
                <option value="heart">❤️ Classic Heart</option>
                <option value="hearts">💕 Double Hearts</option>
                <option value="sparkle-heart">💖 Sparkling Heart</option>
                <option value="ring">💍 Wedding Rings</option>
                <option value="rose">🌹 Red Rose</option>
                <option value="dove">🕊️ Peace Dove</option>
                <option value="infinity">♾️ Endless Infinity</option>
              </optgroup>
              <optgroup label="Royal & Luxury">
                <option value="crown">👑 Imperial Crown</option>
                <option value="gem">💎 Diamond Gem</option>
                <option value="star">⭐ Golden Star</option>
                <option value="sparkles">✨ Celestial Sparkles</option>
                <option value="leaf">🌿 Botanical Laurel</option>
                <option value="sun">☀️ Radiant Sun</option>
                <option value="moon">🌙 Crescent Moon</option>
              </optgroup>
              <optgroup label="Celebration & Festivity">
                <option value="mail">✉️ Love Letter / Mail</option>
                <option value="gift">🎁 Present / Gift Box</option>
                <option value="champagne">🥂 Champagne Toast</option>
                <option value="butterfly">🦋 Monogram Butterfly</option>
                <option value="flower">🌸 Blossom Flower</option>
                <option value="bell">🔔 Wedding Bell</option>
                <option value="music">🎵 Harmonic Melody</option>
              </optgroup>
            </select>

            {/* Quick-Pick Visual Grid */}
            <div className="grid grid-cols-6 gap-1 pt-1">
              {[
                { id: 'heart', label: 'Heart', icon: '❤️' },
                { id: 'ring', label: 'Ring', icon: '💍' },
                { id: 'crown', label: 'Crown', icon: '👑' },
                { id: 'rose', label: 'Rose', icon: '🌹' },
                { id: 'sparkles', label: 'Sparkles', icon: '✨' },
                { id: 'dove', label: 'Dove', icon: '🕊️' },
                { id: 'gem', label: 'Gem', icon: '💎' },
                { id: 'star', label: 'Star', icon: '⭐' },
                { id: 'mail', label: 'Mail', icon: '✉️' },
                { id: 'leaf', label: 'Leaf', icon: '🌿' },
                { id: 'infinity', label: 'Infinity', icon: '♾️' },
                { id: 'champagne', label: 'Cheers', icon: '🥂' },
                { id: 'butterfly', label: 'Butterfly', icon: '🦋' },
                { id: 'gift', label: 'Gift', icon: '🎁' },
                { id: 'flower', label: 'Flower', icon: '🌸' },
                { id: 'bell', label: 'Bell', icon: '🔔' },
                { id: 'moon', label: 'Moon', icon: '🌙' },
                { id: 'sun', label: 'Sun', icon: '☀️' }
              ].map((emblem) => (
                <button
                  key={emblem.id}
                  type="button"
                  onClick={() => {
                    updateConfig({
                      coverType: activeCoverType,
                      sealIcon: emblem.id
                    });
                    if (onUpdatePage && page?.elements) {
                      const updatedElements = page.elements.map((el) => {
                        if (el.id === 'open-elem-icon' || el.name === 'Wax Seal Badge') {
                          return {
                            ...el,
                            content: {
                              ...el.content,
                              iconName: emblem.id
                            }
                          };
                        }
                        return el;
                      });
                      onUpdatePage({ elements: updatedElements });
                    }
                  }}
                  className={`py-1.5 px-0.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    (config.sealIcon || 'heart') === emblem.id
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-sm">{emblem.icon}</span>
                  <span className="text-[7.5px] leading-tight truncate w-full">{emblem.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-600 block mb-1">Interactive Style</label>
            <select
              value={config.style || 'envelope'}
              onChange={(e) => onUpdate({ style: e.target.value as any })}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-600 font-medium"
            >
              <option value="envelope">Classic Envelope Unfold</option>
              <option value="wax-seal">Wax Seal Monogram Break</option>
              <option value="curtain">Royal Curtain Reveal</option>
              <option value="card-flip">Modern 3D Card Flip</option>
              <option value="monogram-glow">Glow Monogram Portal</option>
              <option value="minimal-button">Minimalist Clean Button</option>
            </select>
          </div>
        </div>
      )}

      {/* ======================= CUSTOM / BLANK CANVAS CONTROLS ======================= */}
      {activeCoverType === 'custom-page' && (
        <div className="space-y-3 p-3 rounded-xl bg-purple-50/50 border border-purple-200/80">
          <div className="flex items-center justify-between pb-1.5 border-b border-purple-200/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Blank / Custom Cover Canvas</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
              Blank Slate
            </span>
          </div>

          <p className="text-[10px] text-slate-600 leading-relaxed">
            Custom mode gives you a pure blank canvas. Design your cover from scratch with drag-and-drop elements from the left palette, or use the quick actions below.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (onUpdatePage) onUpdatePage({ elements: [] });
                onUpdate({
                  page: {
                    ...(page || config.page),
                    elements: []
                  } as InvitationPage
                });
              }}
              className="py-2 px-3 bg-white border border-rose-200 hover:border-rose-400 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Elements (Pure Blank Canvas)</span>
            </button>

            {!hasButtonOnCanvas && (
              <button
                type="button"
                onClick={() => {
                  if (onAddElement) {
                    onAddElement('button', {
                      id: 'open-elem-button',
                      name: 'Open Invitation Button',
                      style: {
                        x: 140,
                        y: 245,
                        width: 240,
                        height: 52,
                        backgroundColor: config.sealColor || '#c5a059',
                        color: '#07120d',
                        borderRadius: 9999,
                        fontSize: 14,
                        fontWeight: 700,
                        textAlign: 'center',
                        zIndex: 20
                      },
                      content: {
                        buttonText: config.openButtonText || 'Open Invitation',
                        buttonAction: 'open-invitation'
                      }
                    });
                  }
                }}
                className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add 'Open Invitation' Button</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================= TYPOGRAPHY & TITLES ======================= */}
      <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
            <Type className="w-3.5 h-3.5 text-slate-700" />
            <span>Titles & Typography (Optional)</span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-[10px] text-slate-500">Show Titles</span>
            <input
              type="checkbox"
              checked={config.showTextOnCover !== false}
              onChange={(e) => onUpdate({ showTextOnCover: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
            />
          </label>
        </div>

        {config.showTextOnCover !== false && (
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-500">Greeting / Overline</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <span className="text-[9px] text-slate-400">Show</span>
                  <input
                    type="checkbox"
                    checked={config.showOverline !== false}
                    onChange={(e) => onUpdate({ showOverline: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-3 h-3 cursor-pointer"
                  />
                </label>
              </div>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                disabled={config.showOverline === false}
                placeholder="e.g. YOU ARE CORDIALLY INVITED"
                className={`w-full text-xs border rounded p-1.5 focus:outline-none focus:border-slate-900 ${
                  config.showOverline === false
                    ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-500">Couple / Main Headline</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <span className="text-[9px] text-slate-400">Show</span>
                  <input
                    type="checkbox"
                    checked={config.showCoupleNames !== false}
                    onChange={(e) => onUpdate({ showCoupleNames: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-3 h-3 cursor-pointer"
                  />
                </label>
              </div>
              <input
                type="text"
                value={config.coupleNames || ''}
                onChange={(e) => onUpdate({ coupleNames: e.target.value })}
                disabled={config.showCoupleNames === false}
                placeholder="e.g. Alexander & Sophia"
                className={`w-full text-xs border rounded p-1.5 focus:outline-none focus:border-slate-900 ${
                  config.showCoupleNames === false
                    ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-500">Date / Subtitle</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <span className="text-[9px] text-slate-400">Show</span>
                  <input
                    type="checkbox"
                    checked={config.showDateSubtitle !== false}
                    onChange={(e) => onUpdate({ showDateSubtitle: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-3 h-3 cursor-pointer"
                  />
                </label>
              </div>
              <input
                type="text"
                value={config.subtitle || ''}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                disabled={config.showDateSubtitle === false}
                placeholder="e.g. Saturday, October 24, 2026"
                className={`w-full text-xs border rounded p-1.5 focus:outline-none focus:border-slate-900 ${
                  config.showDateSubtitle === false
                    ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        )}

        {/* Action Button Option & Customizer */}
        <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-800">Open Invitation Button</span>
                {hasButtonOnCanvas ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    On Canvas
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                    Hidden / Optional
                  </span>
                )}
              </div>
              <span className="text-[9.5px] text-slate-500 block mt-0.5">
                Editable button element to unlock and open invitation
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.showOpenButton !== false && hasButtonOnCanvas}
              onChange={(e) => {
                const nextChecked = e.target.checked;
                onUpdate({ showOpenButton: nextChecked });
              }}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {(config.showOpenButton !== false || hasButtonOnCanvas) && (
            <div className="space-y-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/70">
              <div>
                <label className="text-[10px] font-semibold text-amber-950 block mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={config.openButtonText || openButtonElement?.content?.buttonText || 'Open Invitation'}
                  onChange={(e) => onUpdate({ openButtonText: e.target.value })}
                  placeholder="e.g. Open Invitation"
                  className="w-full text-xs bg-white border border-amber-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-amber-600 shadow-xs"
                />
              </div>

              {/* Action Buttons: Select & Edit on Canvas or Add/Remove */}
              <div className="flex items-center gap-1.5 pt-1">
                {hasButtonOnCanvas ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectElement && openButtonElement) {
                          onSelectElement(openButtonElement.id);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Style on Canvas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdate({ showOpenButton: false })}
                      title="Remove button element"
                      className="p-1.5 rounded-md border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdate({ showOpenButton: true })}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Open Button to Canvas</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {!hasButtonOnCanvas && config.showOpenButton === false && (
            <button
              type="button"
              onClick={() => onUpdate({ showOpenButton: true })}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-900 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Add 'Open Invitation' Button Element</span>
            </button>
          )}
        </div>

        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Heading Font Family</label>
          <select
            value={config.fontFamily || "'Playfair Display', serif"}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-slate-900"
          >
            {GOOGLE_FONTS_LIST.map((f) => (
              <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ======================= CELEBRATION FX ======================= */}
      <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs pb-1 border-b border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Celebration FX & Sound</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">Confetti Burst on Opening</span>
          <input
            type="checkbox"
            checked={config.showConfetti !== false}
            onChange={(e) => onUpdate({ showConfetti: e.target.checked })}
            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">Autoplay Music on Opening</span>
          <input
            type="checkbox"
            checked={config.musicAutoplayOnOpen !== false}
            onChange={(e) => onUpdate({ musicAutoplayOnOpen: e.target.checked })}
            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* ======================= CANVAS DIMENSIONS (WIDTH & HEIGHT) ======================= */}
      <div className="space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Canvas Dimensions (Adjustable)</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
            {page?.width || config.page?.width || DEFAULT_COVER_WIDTH}w × {page?.height || config.page?.height || DEFAULT_COVER_HEIGHT}h
          </span>
        </div>

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
              onChange={(e) => {
                const w = Number(e.target.value);
                handleDimensionUpdate({ width: w });
              }}
              className="flex-1 accent-blue-600 cursor-pointer"
            />
            <input
              type="number"
              min="300"
              max="950"
              value={page?.width || config.page?.width || DEFAULT_COVER_WIDTH}
              onChange={(e) => {
                const w = Number(e.target.value);
                handleDimensionUpdate({ width: w });
              }}
              className="w-14 text-xs bg-white border border-slate-200 rounded p-1 font-mono text-center"
            />
          </div>
          {/* Preset quick buttons */}
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
                onClick={() => {
                  handleDimensionUpdate({ width: preset.val });
                }}
                className={`py-1 px-1.5 rounded border transition-colors text-center cursor-pointer ${
                  (page?.width || config.page?.width || DEFAULT_COVER_WIDTH) === preset.val
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
              onClick={() => {
                handleDimensionUpdate({
                  heightMode: 'viewport',
                  isFullHeight: true,
                  height: typeof window !== 'undefined' ? window.innerHeight : 844
                });
              }}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                page?.heightMode === 'viewport' || (page?.isFullHeight && page?.heightMode !== 'custom' && page?.heightMode !== 'auto')
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Viewport
            </button>
            <button
              type="button"
              onClick={() => {
                handleDimensionUpdate({ heightMode: 'auto', isFullHeight: false });
              }}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                page?.heightMode === 'auto'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => {
                handleDimensionUpdate({
                  heightMode: 'custom',
                  isFullHeight: false,
                  height: page?.height || config.page?.height || DEFAULT_COVER_HEIGHT
                });
              }}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                page?.heightMode === 'custom' || (!page?.heightMode && page?.height)
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
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    handleDimensionUpdate({ height: h, heightMode: 'custom', isFullHeight: false });
                  }}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <input
                  type="number"
                  min="280"
                  max="2000"
                  value={page?.height || config.page?.height || DEFAULT_COVER_HEIGHT}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    handleDimensionUpdate({ height: h, heightMode: 'custom', isFullHeight: false });
                  }}
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
                    onClick={() => {
                      handleDimensionUpdate({ height: presetH.val, heightMode: 'custom', isFullHeight: false });
                    }}
                    className={`py-1 px-1.5 rounded border transition-colors text-center cursor-pointer ${
                      (page?.height || config.page?.height || DEFAULT_COVER_HEIGHT) === presetH.val
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
      </div>

      {/* ======================= OUTER BACKDROP & HEART DROPS ======================= */}
      <div className="space-y-3 p-3 rounded-xl bg-gradient-to-br from-rose-50/70 to-pink-50/40 border border-rose-200/80">
        <div className="flex items-center justify-between pb-1 border-b border-rose-200">
          <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span>Outer Backdrop & Heart Drops</span>
          </div>
          <span className="text-[9.5px] font-semibold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
            Outside Canvas
          </span>
        </div>

        {/* Outer Background Color */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-700">Outer Background Color:</span>
            <span className="font-mono text-xs font-semibold text-slate-800">
              {config.outerBackgroundColor || '#0a0a0a'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.outerBackgroundColor || '#0a0a0a'}
              onChange={(e) => onUpdate({ outerBackgroundColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white shadow-xs"
            />
            <input
              type="text"
              value={config.outerBackgroundColor || '#0a0a0a'}
              onChange={(e) => onUpdate({ outerBackgroundColor: e.target.value })}
              placeholder="#0a0a0a"
              className="flex-1 text-xs bg-white border border-slate-200 rounded px-2 py-1.5 font-mono text-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Quick Outer Color Presets */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
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
                onClick={() => onUpdate({ outerBackgroundColor: p.color })}
                title={p.name}
                className="w-5 h-5 rounded-full border border-slate-300 shadow-xs transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        </div>

        {/* Heart Drops Toggle */}
        <div className="pt-2 border-t border-rose-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span className="text-[11px] font-semibold text-rose-950">
                Floating Heart Drops Animation
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.showOuterDrops !== false && config.outerDropEffect !== 'none'}
              onChange={(e) => {
                const enable = e.target.checked;
                onUpdate({
                  showOuterDrops: enable,
                  outerDropEffect: enable ? (config.outerDropEffect === 'none' || !config.outerDropEffect ? 'hearts' : config.outerDropEffect) : 'none'
                });
              }}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {(config.showOuterDrops !== false && config.outerDropEffect !== 'none') && (
            <div className="space-y-2 bg-white/80 p-2.5 rounded-lg border border-rose-200/80">
              {/* Drop Symbol Style Dropdown & Quick Selector */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-700 block">Drop Symbol Style:</span>
                <select
                  value={config.outerDropEffect || 'hearts'}
                  onChange={(e) => onUpdate({ outerDropEffect: e.target.value as OuterDropEffectType, showOuterDrops: true })}
                  className="w-full text-xs bg-white border border-rose-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="hearts">❤️ Floating Hearts</option>
                  <option value="petals">🌸 Rose Petals</option>
                  <option value="sparkles">✨ Magical Sparkles</option>
                  <option value="stars">⭐ Shimmering Stars</option>
                  <option value="butterflies">🦋 Ethereal Butterflies</option>
                  <option value="leaves">🍃 Botanical Leaves</option>
                  <option value="snow">❄️ Winter Snowflakes</option>
                  <option value="confetti">🎉 Celebration Confetti</option>
                  <option value="bubbles">🫧 Golden Bubbles</option>
                  <option value="rings">💍 Wedding Rings</option>
                </select>

                <div className="grid grid-cols-5 gap-1 pt-1 text-[11px]">
                  {[
                    { id: 'hearts', icon: '❤️', label: 'Hearts' },
                    { id: 'petals', icon: '🌸', label: 'Petals' },
                    { id: 'sparkles', icon: '✨', label: 'Sparkles' },
                    { id: 'stars', icon: '⭐', label: 'Stars' },
                    { id: 'butterflies', icon: '🦋', label: 'Flutter' },
                    { id: 'leaves', icon: '🍃', label: 'Leaves' },
                    { id: 'snow', icon: '❄️', label: 'Snow' },
                    { id: 'confetti', icon: '🎉', label: 'Confetti' },
                    { id: 'bubbles', icon: '🫧', label: 'Bubbles' },
                    { id: 'rings', icon: '💍', label: 'Rings' }
                  ].map((eff) => (
                    <button
                      key={eff.id}
                      type="button"
                      onClick={() => onUpdate({ outerDropEffect: eff.id as OuterDropEffectType, showOuterDrops: true })}
                      title={eff.label}
                      className={`py-1 px-0.5 rounded border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        (config.outerDropEffect || 'hearts') === eff.id
                          ? 'border-rose-500 bg-rose-100 text-rose-900 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs">{eff.icon}</span>
                      <span className="text-[7.5px] leading-none truncate w-full">{eff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Heart Drop Color */}
              <div className="space-y-1 pt-1 border-t border-rose-100">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-700">Drop Element Color:</span>
                  <span className="font-mono text-slate-800 font-semibold">{config.outerDropColor || '#f43f5e'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.outerDropColor || '#f43f5e'}
                    onChange={(e) => onUpdate({ outerDropColor: e.target.value })}
                    className="w-7 h-7 rounded border border-rose-300 cursor-pointer p-0.5 bg-white shadow-xs"
                  />
                  <div className="flex items-center gap-1 flex-1">
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
                        onClick={() => onUpdate({ outerDropColor: c.color })}
                        title={c.name}
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-xs cursor-pointer hover:scale-110 transition-transform"
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
};
