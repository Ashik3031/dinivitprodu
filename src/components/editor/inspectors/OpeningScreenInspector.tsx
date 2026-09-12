import React, { useState } from 'react';
import { OpeningScreenConfig, VideoPlayMode, ImageTransitionEffect, ImageAdvanceTrigger, OpeningCoverType } from '../../../types';
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
  MoveUp
} from 'lucide-react';

interface OpeningScreenInspectorProps {
  config: OpeningScreenConfig;
  onUpdate: (updates: Partial<OpeningScreenConfig>) => void;
  onTestOpeningScreen?: () => void;
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
  onUpdate,
  onTestOpeningScreen
}) => {
  // Determine active cover type
  const activeCoverType: OpeningCoverType =
    config.coverType ||
    (config.videoUrl || config.style === 'video-cover'
      ? 'video'
      : config.imageUrl || config.background?.type === 'image'
      ? 'image'
      : config.style === 'custom-page'
      ? 'custom-page'
      : 'envelope');

  const videoPlayMode: VideoPlayMode = config.videoPlayMode || 'autoplay';
  const imageTransitionEffect: ImageTransitionEffect = config.imageTransitionEffect || 'zoom-fade';
  const imageAdvanceTrigger: ImageAdvanceTrigger = config.imageAdvanceTrigger || 'click-button';

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
            onClick={() =>
              onUpdate({
                coverType: 'video',
                style: 'video-cover',
                videoUrl: config.videoUrl || STOCK_VIDEOS[0].url,
                videoPlayMode: config.videoPlayMode || 'autoplay',
                videoAutoAdvanceOnEnd: config.videoAutoAdvanceOnEnd !== false
              })
            }
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
            onClick={() =>
              onUpdate({
                coverType: 'image',
                style: 'card-flip',
                imageUrl: config.imageUrl || STOCK_IMAGES[0].url,
                imageTransitionEffect: config.imageTransitionEffect || 'zoom-fade',
                imageAdvanceTrigger: config.imageAdvanceTrigger || 'click-button'
              })
            }
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
            onClick={() =>
              onUpdate({
                coverType: 'envelope',
                style: 'envelope'
              })
            }
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
            onClick={() =>
              onUpdate({
                coverType: 'custom-page',
                style: 'custom-page'
              })
            }
            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-lg text-center transition-all cursor-pointer ${
              activeCoverType === 'custom-page'
                ? 'bg-white text-amber-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="text-[10px]">Custom</span>
          </button>
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

              {/* Mode 3: Scroll-based transition */}
              <button
                type="button"
                onClick={() => onUpdate({ videoPlayMode: 'scroll-based' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  videoPlayMode === 'scroll-based'
                    ? 'border-amber-500 bg-white ring-1 ring-amber-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                  <MoveUp className="w-3 h-3 text-amber-600" />
                  <span>Scroll / Swipe Based</span>
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1 leading-tight">
                  User scrolls or swipes up to transition video into first page
                </p>
              </button>

              {/* Mode 4: Ambient Loop with Open Button */}
              <button
                type="button"
                onClick={() => onUpdate({ videoPlayMode: 'click-to-open', videoLoop: true })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  videoPlayMode === 'click-to-open'
                    ? 'border-amber-500 bg-white ring-1 ring-amber-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                  <FastForward className="w-3 h-3 text-amber-600" />
                  <span>Ambient Loop</span>
                </div>
                <p className="text-[9.5px] text-slate-500 mt-1 leading-tight">
                  Video loops ambiently; viewer taps 'Open Invitation' button
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
          </div>
        </div>
      )}

      {/* ======================= IMAGE COVER CONTROLS ======================= */}
      {activeCoverType === 'image' && (
        <div className="space-y-3.5 p-3 rounded-xl bg-pink-50/40 border border-pink-200/80">
          <div className="flex items-center justify-between pb-1.5 border-b border-pink-200/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ImageIcon className="w-4 h-4 text-pink-600" />
              <span>Image Cover & Page 1 Transition</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-pink-800 bg-pink-100 px-2 py-0.5 rounded-full capitalize">
              {imageTransitionEffect.replace('-', ' ')}
            </span>
          </div>

          {/* 1. HOW IMAGE GOES TO FIRST PAGE (Transition Effect) */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              How Image Goes to First Page (Transition Effect)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ imageTransitionEffect: 'zoom-fade' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageTransitionEffect === 'zoom-fade'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-pink-950">🔍 Zoom & Fade</span>
                <span className="text-[9.5px] text-slate-500 leading-tight block mt-0.5">
                  Cinematic Ken Burns zoom dissolves into first page
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageTransitionEffect: 'curtain-split' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageTransitionEffect === 'curtain-split'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-pink-950">🚪 Curtain Split</span>
                <span className="text-[9.5px] text-slate-500 leading-tight block mt-0.5">
                  Split doors glide open outward to reveal first page
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageTransitionEffect: 'slide-up' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageTransitionEffect === 'slide-up'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-pink-950">⬆️ Slide Up Pull</span>
                <span className="text-[9.5px] text-slate-500 leading-tight block mt-0.5">
                  Cover elevates smoothly like a sleeve pulling open
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageTransitionEffect: 'blur-dissolve' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageTransitionEffect === 'blur-dissolve'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-pink-950">✨ Soft Blur Dissolve</span>
                <span className="text-[9.5px] text-slate-500 leading-tight block mt-0.5">
                  Dreamy luxury blur crossfade into first page
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageTransitionEffect: 'book-flip' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageTransitionEffect === 'book-flip'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-pink-950">📖 3D Book Flip</span>
                <span className="text-[9.5px] text-slate-500 leading-tight block mt-0.5">
                  Flips over horizontally in 3D perspective
                </span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageTransitionEffect: 'envelope-unfold' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageTransitionEffect === 'envelope-unfold'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block text-pink-950">💌 Envelope Unfold</span>
                <span className="text-[9.5px] text-slate-500 leading-tight block mt-0.5">
                  Wax seal unfastens & letter unfolds into page 1
                </span>
              </button>
            </div>
          </div>

          {/* 2. ADVANCE TRIGGER (How viewer triggers it) */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Advance Trigger (How Viewer Moves to First Page)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ imageAdvanceTrigger: 'click-button' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageAdvanceTrigger === 'click-button'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white/70 text-slate-700'
                }`}
              >
                <div className="text-[11px]">🔘 Click Button</div>
                <div className="text-[9px] text-slate-500 font-normal">Taps 'Open Invitation'</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageAdvanceTrigger: 'click-anywhere' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageAdvanceTrigger === 'click-anywhere'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white/70 text-slate-700'
                }`}
              >
                <div className="text-[11px]">👆 Tap Anywhere</div>
                <div className="text-[9px] text-slate-500 font-normal">Taps screen anywhere</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageAdvanceTrigger: 'scroll-swipe' })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageAdvanceTrigger === 'scroll-swipe'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white/70 text-slate-700'
                }`}
              >
                <div className="text-[11px]">📜 Scroll / Swipe Up</div>
                <div className="text-[9px] text-slate-500 font-normal">Swipes up on screen</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ imageAdvanceTrigger: 'auto-timer', imageTimerSeconds: config.imageTimerSeconds || 3.5 })}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  imageAdvanceTrigger === 'auto-timer'
                    ? 'border-pink-500 bg-white ring-1 ring-pink-500 text-slate-900 font-bold'
                    : 'border-slate-200 bg-white/70 text-slate-700'
                }`}
              >
                <div className="text-[11px]">⏱️ Auto-Timer</div>
                <div className="text-[9px] text-slate-500 font-normal">Advances after X secs</div>
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
                    className="w-24 accent-pink-600 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-pink-700 font-bold">
                    {config.imageTimerSeconds || 3.5}s
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Image URL & Stock Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-600 block">
              Cover Photo Image URL
            </label>
            <input
              type="text"
              value={config.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
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
                    onClick={() => onUpdate({ imageUrl: img.url })}
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
              onChange={(e) => onUpdate({ imageOverlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-pink-600 cursor-pointer"
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
              <span>Envelope & Wax Seal Styling</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Envelope Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={config.envelopeColor || '#0e261d'}
                  onChange={(e) => onUpdate({ envelopeColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-700">{config.envelopeColor || '#0e261d'}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Wax Seal Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={config.sealColor || '#d4af37'}
                  onChange={(e) => onUpdate({ sealColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-700">{config.sealColor || '#d4af37'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-600 block mb-1">Wax Seal Emblem Icon</label>
            <div className="grid grid-cols-6 gap-1">
              {[
                { id: 'heart', label: 'Heart', icon: '❤️' },
                { id: 'crown', label: 'Crown', icon: '👑' },
                { id: 'star', label: 'Star', icon: '⭐' },
                { id: 'sparkles', label: 'Sparkles', icon: '✨' },
                { id: 'gift', label: 'Gift', icon: '🎁' },
                { id: 'mail', label: 'Mail', icon: '✉️' }
              ].map((emblem) => (
                <button
                  key={emblem.id}
                  type="button"
                  onClick={() => onUpdate({ sealIcon: emblem.id })}
                  className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    (config.sealIcon || 'heart') === emblem.id
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-sm">{emblem.icon}</span>
                  <span className="text-[9px]">{emblem.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-600 block mb-1">Interactive Style</label>
            <select
              value={config.style || 'envelope'}
              onChange={(e) => onUpdate({ style: e.target.value as any })}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-600"
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

      {/* ======================= TYPOGRAPHY & TITLES ======================= */}
      <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs pb-1 border-b border-slate-200">
          <Type className="w-3.5 h-3.5 text-slate-700" />
          <span>Titles & Button Typography</span>
        </div>

        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Greeting / Overline</label>
          <input
            type="text"
            value={config.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g. YOU ARE CORDIALLY INVITED"
            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Couple / Main Headline</label>
          <input
            type="text"
            value={config.coupleNames || ''}
            onChange={(e) => onUpdate({ coupleNames: e.target.value })}
            placeholder="e.g. Alexander & Sophia"
            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Date / Subtitle</label>
          <input
            type="text"
            value={config.subtitle || ''}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="e.g. Saturday, October 24, 2026"
            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* Action Button Option */}
        <div className="pt-2 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <span className="text-[11px] font-semibold text-slate-700 block">Show Action Button</span>
              <span className="text-[9.5px] text-slate-500">Enable an 'Open Invitation' button on the cover</span>
            </div>
            <input
              type="checkbox"
              checked={config.showOpenButton !== false}
              onChange={(e) => onUpdate({ showOpenButton: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {config.showOpenButton !== false && (
            <div className="mt-2">
              <label className="text-[10px] text-slate-500 block mb-1">Open Button Label</label>
              <input
                type="text"
                value={config.openButtonText || ''}
                onChange={(e) => onUpdate({ openButtonText: e.target.value })}
                placeholder="e.g. Open Invitation"
                className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-slate-900"
              />
            </div>
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
    </div>
  );
};
