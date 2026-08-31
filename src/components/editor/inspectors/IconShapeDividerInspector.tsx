import React from 'react';
import { CanvasElement } from '../../../types';
import { Heart, Sparkles, Music, MapPin, Calendar, Clock, Phone, Mail, Gift, Camera, Star, Wine, Check, Sliders, Shapes } from 'lucide-react';

interface IconShapeDividerInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export const IconShapeDividerInspector: React.FC<IconShapeDividerInspectorProps> = ({
  element,
  onUpdateElement
}) => {
  const { type, style, content } = element;

  // 1. ICON INSPECTOR
  if (type === 'icon') {
    const popularIcons = [
      'Heart', 'Sparkles', 'Music', 'MapPin', 'Calendar', 'Clock',
      'Mail', 'Phone', 'Gift', 'Camera', 'Star', 'Wine', 'Check',
      'Send', 'MessageCircle', 'Compass', 'Compass', 'Users'
    ];

    return (
      <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Vector Icon Properties
        </span>

        {/* Quick Icon Selector */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Select Icon</label>
          <div className="grid grid-cols-6 gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
            {popularIcons.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() =>
                  onUpdateElement(element.id, {
                    content: { ...content, iconName: ic }
                  })
                }
                className={`p-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                  (content.iconName || 'Heart') === ic
                    ? 'bg-slate-900 text-white shadow'
                    : 'hover:bg-slate-200 text-slate-700'
                }`}
                title={ic}
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Icon Name Text Input */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Lucide Icon Name</label>
          <input
            type="text"
            value={content.iconName || 'Heart'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, iconName: e.target.value }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Heart, Sparkles, Music"
          />
        </div>

        {/* Size & Color */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block">Icon Size (px)</label>
            <input
              type="number"
              value={content.iconSize || 32}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  content: { ...content, iconSize: Number(e.target.value) }
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block">Icon Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={content.iconColor || style.color || '#d4af37'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    content: { ...content, iconColor: e.target.value },
                    style: { ...style, color: e.target.value }
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={content.iconColor || style.color || '#d4af37'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    content: { ...content, iconColor: e.target.value },
                    style: { ...style, color: e.target.value }
                  })
                }
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Background Badge */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
            Badge Background
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">BG Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={content.iconBgColor || style.backgroundColor || '#f1f5f9'}
                  onChange={(e) =>
                    onUpdateElement(element.id, {
                      content: { ...content, iconBgColor: e.target.value },
                      style: { ...style, backgroundColor: e.target.value }
                    })
                  }
                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={content.iconBgColor || ''}
                  onChange={(e) =>
                    onUpdateElement(element.id, {
                      content: { ...content, iconBgColor: e.target.value }
                    })
                  }
                  placeholder="None"
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Radius (px)</label>
              <input
                type="number"
                value={content.iconBorderRadius ?? (typeof style.borderRadius === 'number' ? style.borderRadius : 0)}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    content: { ...content, iconBorderRadius: Number(e.target.value) },
                    style: { ...style, borderRadius: Number(e.target.value) }
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. SHAPE INSPECTOR
  if (type === 'shape') {
    const shapes = [
      { id: 'rectangle', label: 'Rectangle' },
      { id: 'rounded-rectangle', label: 'Rounded' },
      { id: 'circle', label: 'Circle' },
      { id: 'star', label: 'Star' },
      { id: 'heart', label: 'Heart' },
      { id: 'diamond', label: 'Diamond' },
      { id: 'hexagon', label: 'Hexagon' },
      { id: 'triangle', label: 'Triangle' },
      { id: 'arrow', label: 'Arrow' },
      { id: 'badge', label: 'VIP Badge' },
      { id: 'ribbon', label: 'Ribbon' }
    ];

    return (
      <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Shape Geometry & Fill
        </span>

        {/* Shape Type */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Vector Shape</label>
          <select
            value={style.shapeType || style.shape || 'star'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, shapeType: e.target.value as any, shape: e.target.value as any }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900"
          >
            {shapes.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Fill Color */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Fill Color</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.fillColor || style.backgroundColor || '#d4af37'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, fillColor: e.target.value, backgroundColor: e.target.value }
                })
              }
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.fillColor || style.backgroundColor || '#d4af37'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, fillColor: e.target.value, backgroundColor: e.target.value }
                })
              }
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* Stroke / Outline */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Stroke Width (px)</label>
            <input
              type="number"
              min="0"
              max="20"
              value={style.strokeWidth ?? (style.borderWidth || 0)}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, strokeWidth: Number(e.target.value), borderWidth: Number(e.target.value) }
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Stroke Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.strokeColor || style.borderColor || '#000000'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    style: { ...style, strokeColor: e.target.value, borderColor: e.target.value }
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={style.strokeColor || ''}
                placeholder="None"
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    style: { ...style, strokeColor: e.target.value }
                  })
                }
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. DIVIDER INSPECTOR
  if (type === 'divider') {
    const dividerStyles = [
      { id: 'solid', label: 'Solid Line' },
      { id: 'dashed', label: 'Dashed Line' },
      { id: 'dotted', label: 'Dotted Line' },
      { id: 'ornamental', label: 'Ornamental Flourish' },
      { id: 'floral', label: 'Botanical Floral' },
      { id: 'diamond', label: 'Diamond Crest' },
      { id: 'stars', label: 'Triple Stars' }
    ];

    return (
      <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Divider Style
        </span>

        {/* Divider Preset */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Divider Pattern</label>
          <select
            value={style.dividerStyle || 'ornamental'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, dividerStyle: e.target.value as any }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900"
          >
            {dividerStyles.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Divider Color</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.borderColor || style.color || '#d4af37'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, borderColor: e.target.value, color: e.target.value }
                })
              }
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.borderColor || style.color || '#d4af37'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, borderColor: e.target.value, color: e.target.value }
                })
              }
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* Thickness */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Line Thickness (px)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={style.dividerThickness || style.borderWidth || 1}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, dividerThickness: Number(e.target.value), borderWidth: Number(e.target.value) }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>
    );
  }

  return null;
};
