import React, { useState } from 'react';
import { CanvasElement, AnimationConfig, AnimationType, AnimationEasing, AnimationRepeat, AnimationTrigger } from '../../../types';
import {
  ANIMATION_TYPES,
  EASING_OPTIONS,
  REPEAT_OPTIONS
} from '../../../utils/animationUtils';
import {
  Play,
  Sparkles,
  RotateCw,
  Clock,
  Repeat,
  Compass,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Waves,
  Heart,
  Eye,
  Sliders,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface AnimationInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onPreviewAnimation?: (elementId: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Layers,
  Maximize2,
  Waves,
  Heart
};

export const AnimationInspector: React.FC<AnimationInspectorProps> = ({
  element,
  onUpdateElement,
  onPreviewAnimation
}) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const animation: AnimationConfig = element.animation || {
    type: 'none',
    duration: 0.8,
    delay: 0,
    speed: 'ease-out',
    repeat: 'none',
    trigger: 'load'
  };

  const handleUpdate = (updates: Partial<AnimationConfig>) => {
    const updated = {
      ...animation,
      ...updates
    };
    onUpdateElement(element.id, { animation: updated });
  };

  const handleTriggerTest = () => {
    setIsPlayingPreview(true);
    if (onPreviewAnimation) {
      onPreviewAnimation(element.id);
    }
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, (animation.duration || 0.8) * 1000 + 300);
  };

  const applyPreset = (preset: {
    type: AnimationType;
    duration: number;
    delay: number;
    speed: AnimationEasing;
    repeat?: AnimationRepeat;
    trigger: AnimationTrigger;
  }) => {
    onUpdateElement(element.id, {
      animation: {
        ...animation,
        ...preset
      }
    });
    if (onPreviewAnimation) {
      onPreviewAnimation(element.id);
    }
  };

  return (
    <div className="space-y-4 text-slate-800 text-xs select-none">
      {/* Header & Live Playback Trigger */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/10 via-slate-50 to-slate-100 rounded-xl border border-amber-300/40">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Motion & Animation</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Cinematic entrance & interactive scroll effects
          </p>
        </div>

        {animation.type !== 'none' && (
          <button
            type="button"
            onClick={handleTriggerTest}
            disabled={isPlayingPreview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isPlayingPreview
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
            }`}
          >
            <Play className={`w-3 h-3 text-amber-400 ${isPlayingPreview ? 'fill-white' : ''}`} />
            <span>{isPlayingPreview ? 'Playing...' : 'Test'}</span>
          </button>
        )}
      </div>

      {/* Quick Animation Presets */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          Quick Luxury Presets
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset({ type: 'fadeIn', duration: 1.0, delay: 0.2, speed: 'ease-out', trigger: 'load' })}
            className="p-2 text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="font-bold text-[11px] text-slate-800 group-hover:text-amber-900">✨ Soft Fade</div>
            <div className="text-[9px] text-slate-400">1.0s gentle opacity</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({ type: 'slideUp', duration: 0.8, delay: 0.15, speed: 'ease-out', trigger: 'scroll' })}
            className="p-2 text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="font-bold text-[11px] text-slate-800 group-hover:text-amber-900">🚀 Elegant Slide Up</div>
            <div className="text-[9px] text-slate-400">Scroll trigger entrance</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({ type: 'reveal', duration: 1.2, delay: 0.1, speed: 'ease-in-out', trigger: 'load' })}
            className="p-2 text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="font-bold text-[11px] text-slate-800 group-hover:text-amber-900">🎭 Dramatic Reveal</div>
            <div className="text-[9px] text-slate-400">Wipe mask reveal</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({ type: 'float', duration: 2.5, delay: 0, speed: 'ease-in-out', repeat: 'reverse', trigger: 'load' })}
            className="p-2 text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="font-bold text-[11px] text-slate-800 group-hover:text-amber-900">🌊 Ambient Hover</div>
            <div className="text-[9px] text-slate-400">Continuous floating loop</div>
          </button>
        </div>
      </div>

      {/* Animation Type Grid / Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Animation Effect
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
          {ANIMATION_TYPES.map((typeObj) => {
            const isSelected = (animation.type || 'none') === typeObj.id;
            const Icon = ICON_MAP[typeObj.iconName] || Sparkles;

            return (
              <button
                key={typeObj.id}
                type="button"
                onClick={() => handleUpdate({ type: typeObj.id })}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`p-1 rounded-md ${isSelected ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-200 text-slate-600'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate flex-1">
                  <div className="text-[11px] font-bold truncate">{typeObj.label}</div>
                  <div className={`text-[9px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {typeObj.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Sliders (When animation is not 'none') */}
      {animation.type && animation.type !== 'none' && (
        <div className="space-y-3.5 pt-2 border-t border-slate-200">
          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Duration</span>
              </span>
              <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {animation.duration || 0.8}s
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.05"
              value={animation.duration || 0.8}
              onChange={(e) => handleUpdate({ duration: Number(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
              <span>Fast (0.2s)</span>
              <span>Normal (0.8s)</span>
              <span>Cinematic (3.0s)</span>
            </div>
          </div>

          {/* Delay Slider */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
              <span>Delay Before Entrance</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {animation.delay || 0}s
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.05"
              value={animation.delay || 0}
              onChange={(e) => handleUpdate({ delay: Number(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Trigger Option: Load vs Scroll */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Trigger Event
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleUpdate({ trigger: 'load' })}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  (animation.trigger || 'load') === 'load'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                On Page Load
              </button>
              <button
                type="button"
                onClick={() => handleUpdate({ trigger: 'scroll' })}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  animation.trigger === 'scroll'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                On Scroll in View
              </button>
            </div>
          </div>

          {/* Repeat Option */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Playback Loop & Repeat
            </label>
            <select
              value={
                animation.repeat === 'infinite' || animation.repeat === Infinity
                  ? 'infinite'
                  : animation.repeat === 'reverse'
                  ? 'reverse'
                  : String(animation.repeat || 'none')
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'infinite' || val === 'reverse') {
                  handleUpdate({ repeat: val as any });
                } else if (val === 'none') {
                  handleUpdate({ repeat: 'none' });
                } else {
                  handleUpdate({ repeat: Number(val) });
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              {REPEAT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Easing Curve */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Timing Easing Curve
            </label>
            <select
              value={animation.speed || 'ease-out'}
              onChange={(e) => handleUpdate({ speed: e.target.value as AnimationEasing })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              {EASING_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PARALLAX SCROLL EFFECT SECTION */}
      <div className="pt-3 border-t border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold text-slate-900 text-xs">Parallax Scroll Depth</span>
          </div>
          <input
            type="checkbox"
            checked={animation.parallax?.enabled || false}
            onChange={(e) => {
              handleUpdate({
                parallax: {
                  enabled: e.target.checked,
                  speed: animation.parallax?.speed || 0.2,
                  direction: animation.parallax?.direction || 'vertical'
                }
              });
            }}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <p className="text-[10px] text-slate-500">
          Adds smooth multi-plane depth by moving this element at a differing speed when guests scroll the invitation.
        </p>

        {animation.parallax?.enabled && (
          <div className="space-y-2 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-indigo-950 mb-1">
                <span>Parallax Speed Factor</span>
                <span className="font-mono text-indigo-800 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                  {animation.parallax.speed > 0 ? `+${animation.parallax.speed}` : animation.parallax.speed}
                </span>
              </div>
              <input
                type="range"
                min="-0.8"
                max="0.8"
                step="0.05"
                value={animation.parallax.speed || 0.2}
                onChange={(e) => {
                  handleUpdate({
                    parallax: {
                      ...animation.parallax!,
                      speed: Number(e.target.value)
                    }
                  });
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-indigo-500 mt-0.5">
                <span>Slow / Deep (-0.5)</span>
                <span>Subtle (0.2)</span>
                <span>Fast / Float (+0.6)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-indigo-900 font-semibold">Motion Direction:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleUpdate({ parallax: { ...animation.parallax!, direction: 'vertical' } })}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                    (animation.parallax.direction || 'vertical') === 'vertical'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-700 border border-indigo-200'
                  }`}
                >
                  Vertical
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate({ parallax: { ...animation.parallax!, direction: 'horizontal' } })}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                    animation.parallax.direction === 'horizontal'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-700 border border-indigo-200'
                  }`}
                >
                  Horizontal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
