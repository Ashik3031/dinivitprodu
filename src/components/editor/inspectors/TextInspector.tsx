import React from 'react';
import { CanvasElement } from '../../../types';
import { GOOGLE_FONTS_LIST } from '../../../data/stockAssets';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface TextInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export const TextInspector: React.FC<TextInspectorProps> = ({
  element,
  onUpdateElement
}) => {
  const { style, content } = element;

  return (
    <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
        Text & Typography
      </span>

      {/* Text content */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Text Content</label>
        <textarea
          rows={3}
          value={content.text || ''}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, text: e.target.value }
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-slate-900"
          placeholder="Enter your invitation text..."
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Font Family</label>
        <select
          value={style.fontFamily || "'Playfair Display', serif"}
          onChange={(e) =>
            onUpdateElement(element.id, {
              style: { ...style, fontFamily: e.target.value }
            })
          }
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900"
        >
          {GOOGLE_FONTS_LIST.map((f) => (
            <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
              {f.name} ({f.category})
            </option>
          ))}
        </select>
      </div>

      {/* Size & Weight */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-500 block">Font Size (px)</label>
          <input
            type="number"
            value={style.fontSize || 16}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, fontSize: Number(e.target.value) }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block">Font Weight</label>
          <select
            value={style.fontWeight || 400}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, fontWeight: Number(e.target.value) }
              })
            }
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

      {/* Text Color */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Color</label>
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={style.color || '#0f172a'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, color: e.target.value }
              })
            }
            className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={style.color || '#0f172a'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, color: e.target.value }
              })
            }
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Alignment</label>
        <div className="grid grid-cols-4 gap-1">
          {(['left', 'center', 'right', 'justify'] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() =>
                onUpdateElement(element.id, {
                  style: { ...style, textAlign: align }
                })
              }
              className={`py-1.5 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                style.textAlign === align
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
              {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
              {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
              {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-500 block">Line Height</label>
          <input
            type="number"
            step="0.1"
            min="0.8"
            max="3"
            value={style.lineHeight || 1.5}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, lineHeight: Number(e.target.value) }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block">Letter Spacing (px)</label>
          <input
            type="number"
            step="0.5"
            value={style.letterSpacing || 0}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, letterSpacing: Number(e.target.value) }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Text Shadow */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[10px] text-slate-500 block">Text Shadow (Blur & Color)</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="20"
            value={style.shadowBlur || 0}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, shadowBlur: Number(e.target.value) }
              })
            }
            className="flex-1 accent-slate-900"
          />
          <input
            type="color"
            value={style.shadowColor || '#000000'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, shadowColor: e.target.value }
              })
            }
            className="w-6 h-6 rounded border border-slate-200 cursor-pointer bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
