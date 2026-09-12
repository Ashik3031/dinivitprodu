import React from 'react';
import { CanvasElement, ElementStyle } from '../../../types';
import { GOOGLE_FONTS_LIST } from '../../../data/stockAssets';
import {
  Palette,
  Type,
  Sparkles,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic,
  Square,
  Layers,
  Check
} from 'lucide-react';

interface InvitationStyleInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onSwitchTab?: (tab: 'style' | 'content') => void;
}

const LUXURY_THEME_PRESETS = [
  { name: 'Royal Gold', color: '#d4af37', bg: '#0f172a', border: '#d4af37', font: "'Cinzel', serif" },
  { name: 'Rose Romance', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', font: "'Great Vibes', cursive" },
  { name: 'Emerald Luxe', color: '#10b981', bg: '#022c22', border: '#059669', font: "'Cormorant Garamond', serif" },
  { name: 'Midnight', color: '#f8fafc', bg: '#090d16', border: '#334155', font: "'Playfair Display', serif" },
  { name: 'Champagne', color: '#b45309', bg: '#fefce8', border: '#fde68a', font: "'Playfair Display', serif" },
  { name: 'Modern Light', color: '#0f172a', bg: '#ffffff', border: '#e2e8f0', font: "'Montserrat', sans-serif" },
  { name: 'Lavender', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', font: "'Alex Brush', cursive" },
  { name: 'Glass Frost', color: '#ffffff', bg: 'rgba(15, 23, 42, 0.75)', border: 'rgba(255, 255, 255, 0.2)', font: "'Cinzel', serif" }
];

const QUICK_COLORS = [
  '#d4af37', // Gold
  '#e11d48', // Rose
  '#059669', // Emerald
  '#0f172a', // Navy
  '#334155', // Slate
  '#7c3aed', // Purple
  '#b45309', // Amber
  '#ffffff', // White
  '#000000'  // Black
];

const QUICK_BG_COLORS = [
  'transparent',
  '#0f172a',
  '#ffffff',
  '#f8fafc',
  '#022c22',
  '#fff1f2',
  '#fefce8',
  'rgba(15, 23, 42, 0.85)',
  'rgba(255, 255, 255, 0.85)'
];

const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 2px 8px rgba(0,0,0,0.08)' },
  { label: 'Medium', value: '0 8px 20px rgba(0,0,0,0.18)' },
  { label: 'Gold Glow', value: '0 0 20px rgba(212,175,55,0.35)' },
  { label: 'Dark Glow', value: '0 10px 25px -5px rgba(0,0,0,0.4)' }
];

export const InvitationStyleInspector: React.FC<InvitationStyleInspectorProps> = ({
  element,
  onUpdateElement,
  onSwitchTab
}) => {
  const { type, style, content } = element;

  const updateStyle = (updates: Partial<ElementStyle>) => {
    onUpdateElement(element.id, {
      style: { ...style, ...updates }
    });
  };

  const applyTheme = (preset: typeof LUXURY_THEME_PRESETS[0]) => {
    updateStyle({
      color: preset.color,
      backgroundColor: preset.bg,
      borderColor: preset.border,
      fontFamily: preset.font,
      borderWidth: style.borderWidth ? style.borderWidth : 1,
      borderStyle: 'solid'
    });
  };

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      {onSwitchTab && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/80 border border-indigo-200/80 text-indigo-950">
          <div className="text-[11px] font-medium text-slate-700">
            Need to edit text & dates?
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab('content')}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
          >
            Content Settings →
          </button>
        </div>
      )}

      {/* 1. LUXURY THEME PRESETS */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Style & Palette Presets
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {LUXURY_THEME_PRESETS.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => applyTheme(t)}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white text-center transition-all cursor-pointer shadow-xs hover:scale-102 flex flex-col items-center gap-1"
              title={`${t.name}: Color ${t.color}, BG ${t.bg}`}
            >
              <div className="flex items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: t.color }} />
                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: t.bg }} />
              </div>
              <span className="text-[9px] font-medium text-slate-700 leading-none truncate max-w-full">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. COLOR SETTINGS */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
          <Palette className="w-3 h-3 text-slate-700" />
          Color & Appearance
        </span>

        {/* Text / Primary Accent Color */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>Primary / Accent Color</span>
            <span className="font-mono">{style.color || '#d4af37'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.color || '#d4af37'}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.color || '#d4af37'}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          {/* Quick Swatches */}
          <div className="flex items-center gap-1 mt-1.5">
            {QUICK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateStyle({ color: c })}
                className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                  style.color === c ? 'ring-2 ring-slate-900 ring-offset-1 border-white' : 'border-slate-300'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Card Background Color */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>Card Background Color</span>
            <button
              type="button"
              onClick={() => updateStyle({ backgroundColor: 'transparent' })}
              className={`text-[9px] font-semibold px-1 rounded cursor-pointer ${
                style.backgroundColor === 'transparent' || !style.backgroundColor
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Transparent
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.backgroundColor && style.backgroundColor !== 'transparent' ? style.backgroundColor : '#0f172a'}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.backgroundColor || 'transparent'}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              placeholder="transparent"
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          {/* Quick BG Swatches */}
          <div className="flex items-center gap-1 mt-1.5">
            {QUICK_BG_COLORS.map((bg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateStyle({ backgroundColor: bg })}
                className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                  style.backgroundColor === bg ? 'ring-2 ring-slate-900 ring-offset-1 border-white' : 'border-slate-300'
                }`}
                style={{
                  backgroundColor: bg === 'transparent' ? 'transparent' : bg,
                  backgroundImage: bg === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                  backgroundSize: '4px 4px'
                }}
                title={bg}
              />
            ))}
          </div>
        </div>

        {/* Border Color & Width */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Border Width</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="12"
                value={style.borderWidth || 0}
                onChange={(e) => updateStyle({ borderWidth: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <span className="text-[10px] text-slate-400">px</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Border Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.borderColor || '#cbd5e1'}
                onChange={(e) => updateStyle({ borderColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={style.borderColor || '#cbd5e1'}
                onChange={(e) => updateStyle({ borderColor: e.target.value })}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TYPOGRAPHY & FONT SETTINGS */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
          <Type className="w-3 h-3 text-slate-700" />
          Typography & Font
        </span>

        {/* Font Family */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Font Family</label>
          <select
            value={style.fontFamily || "'Cinzel', serif"}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900"
          >
            {GOOGLE_FONTS_LIST.map((f) => (
              <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Font Size (px)</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateStyle({ fontSize: Math.max(10, (style.fontSize || 18) - 2) })}
                className="w-6 h-7 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={style.fontSize || 18}
                onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
                className="w-full text-center bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={() => updateStyle({ fontSize: (style.fontSize || 18) + 2 })}
                className="w-6 h-7 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Font Weight</label>
            <select
              value={style.fontWeight || 600}
              onChange={(e) => updateStyle({ fontWeight: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            >
              <option value={300}>Light (300)</option>
              <option value={400}>Regular (400)</option>
              <option value={500}>Medium (500)</option>
              <option value={600}>Semi-Bold (600)</option>
              <option value={700}>Bold (700)</option>
              <option value={800}>Extra Bold (800)</option>
            </select>
          </div>
        </div>

        {/* Letter Spacing & Style */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Letter Spacing (px)</label>
            <input
              type="number"
              step="0.5"
              min="-2"
              max="15"
              value={style.letterSpacing ?? 0}
              onChange={(e) => updateStyle({ letterSpacing: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Text Transform</label>
            <select
              value={style.textTransform || 'none'}
              onChange={(e) => updateStyle({ textTransform: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            >
              <option value="none">Normal</option>
              <option value="uppercase">UPPERCASE (AA)</option>
              <option value="lowercase">lowercase (aa)</option>
              <option value="capitalize">Capitalize (Aa)</option>
            </select>
          </div>
        </div>

        {/* Alignment & Italic */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Text Alignment & Style</label>
          <div className="flex items-center gap-1">
            {(['left', 'center', 'right', 'justify'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => updateStyle({ textAlign: align })}
                className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                  (style.textAlign || 'center') === align
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title={`Align ${align}`}
              >
                {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
              </button>
            ))}
            <button
              type="button"
              onClick={() => updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`w-9 py-1.5 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                style.fontStyle === 'italic'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Italic Toggle"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. CARD SHAPE & ELEVATION */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
          <Sliders className="w-3 h-3 text-slate-700" />
          Card Shape & Elevation
        </span>

        {/* Corner Radius */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Corner Rounding</span>
            <span className="font-mono">{style.borderRadius || 0}px</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="40"
              value={style.borderRadius || 0}
              onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
              className="flex-1 accent-slate-900"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={style.borderRadius || 0}
              onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
              className="w-14 bg-slate-50 border border-slate-200 rounded p-1 text-center text-xs font-mono"
            />
          </div>
          {/* Quick Corner Presets */}
          <div className="grid grid-cols-4 gap-1 mt-1.5 text-[10px]">
            {[
              { label: 'Sharp', val: 0 },
              { label: 'Rounded', val: 8 },
              { label: 'Smooth', val: 16 },
              { label: 'Pill', val: 999 }
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => updateStyle({ borderRadius: p.val })}
                className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                  (style.borderRadius ?? 0) === p.val
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Shadow */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Card Shadow / Glow</label>
          <select
            value={style.boxShadow || 'none'}
            onChange={(e) => updateStyle({ boxShadow: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          >
            {SHADOW_PRESETS.map((s) => (
              <option key={s.label} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Padding */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Inner Padding</span>
            <span className="font-mono">{style.padding || 8}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="32"
            value={style.padding || 8}
            onChange={(e) => updateStyle({ padding: Number(e.target.value) })}
            className="w-full accent-slate-900"
          />
        </div>
      </div>

      {/* 5. ELEMENT SPECIFIC STYLE VARIANTS */}
      {type === 'countdown' && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
            Countdown Style Mode
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'boxes', label: 'Frosted Boxes' },
              { id: 'circles', label: 'Badge Circles' },
              { id: 'minimal', label: 'Minimalist' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateElement(element.id, { content: { ...content, countdownStyle: st.id as any } })}
                className={`py-1.5 px-1 rounded border text-[10px] font-semibold text-center transition-colors cursor-pointer ${
                  (content.countdownStyle || 'boxes') === st.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'whatsapp-button' && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
            Button Corner Preset
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 4, label: 'Square' },
              { id: 12, label: 'Rounded' },
              { id: 999, label: 'Pill' }
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => updateStyle({ borderRadius: btn.id })}
                className={`py-1.5 rounded border text-[10px] font-semibold text-center transition-colors cursor-pointer ${
                  (style.borderRadius || 12) === btn.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
