import React from 'react';
import { CanvasElement } from '../../../types';
import { Send, Link2, Sparkles, Sliders, MailOpen } from 'lucide-react';

interface ButtonInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export const ButtonInspector: React.FC<ButtonInspectorProps> = ({
  element,
  onUpdateElement
}) => {
  const { style, content } = element;
  const isOpenInvitation = content.buttonAction === 'open-invitation' || element.id === 'open-elem-button';

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
        Button Configuration
      </span>

      {/* Button Text */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Button Label</label>
        <input
          type="text"
          value={content.buttonText || ''}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, buttonText: e.target.value }
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          placeholder="e.g. Open Invitation"
        />
      </div>

      {/* Button Action */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Click Action</label>
        <select
          value={content.buttonAction || (isOpenInvitation ? 'open-invitation' : 'rsvp')}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, buttonAction: e.target.value as any }
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900"
        >
          <option value="open-invitation">✨ Open Invitation (Cover Opening Action)</option>
          <option value="rsvp">Open RSVP Response Card</option>
          <option value="guestbook">Open Guestbook & Wishes</option>
          <option value="maps">Open Google Maps Location</option>
          <option value="whatsapp">Open WhatsApp Messenger</option>
          <option value="link">Custom Web URL</option>
          <option value="next-page">Scroll / Navigate to Next Page</option>
        </select>
      </div>

      {/* Open Invitation info banner */}
      {isOpenInvitation && (
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-950 flex items-start gap-2">
          <MailOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[10.5px] leading-relaxed">
            <span className="font-semibold block">Cover Opening Action:</span>
            When tapped by guests, this button unfastens the wax seal, initiates the envelope opening transition, begins background music, and smoothly reveals the first page.
          </div>
        </div>
      )}

      {/* Custom Link input if link */}
      {content.buttonAction === 'link' && (
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Target Web URL</label>
          <input
            type="text"
            value={content.buttonLink || ''}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, buttonLink: e.target.value }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="https://..."
          />
        </div>
      )}

      {/* Button Shape */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Button Shape</label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'pill', label: 'Pill' },
            { id: 'rounded', label: 'Rounded' },
            { id: 'soft', label: 'Soft' },
            { id: 'square', label: 'Square' }
          ].map((sh) => (
            <button
              key={sh.id}
              type="button"
              onClick={() =>
                onUpdateElement(element.id, {
                  content: { ...content, buttonShape: sh.id as any }
                })
              }
              className={`py-1.5 rounded border text-[11px] font-medium transition-colors cursor-pointer text-center ${
                (content.buttonShape || 'pill') === sh.id
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {sh.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors (Default State) */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Background</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.backgroundColor || '#0f172a'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, backgroundColor: e.target.value }
                })
              }
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.backgroundColor || '#0f172a'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, backgroundColor: e.target.value }
                })
              }
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Text Color</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.color || '#ffffff'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, color: e.target.value }
                })
              }
              className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.color || '#ffffff'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  style: { ...style, color: e.target.value }
                })
              }
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Hover State Controls */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
            Hover & Interaction State
          </label>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Hover BG Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.hoverBackgroundColor || style.backgroundColor || '#1e293b'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    style: { ...style, hoverBackgroundColor: e.target.value }
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={style.hoverBackgroundColor || ''}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    style: { ...style, hoverBackgroundColor: e.target.value }
                  })
                }
                placeholder="Auto"
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Hover Text Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={style.hoverColor || style.color || '#ffffff'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    style: { ...style, hoverColor: e.target.value }
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={style.hoverColor || ''}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    style: { ...style, hoverColor: e.target.value }
                  })
                }
                placeholder="Auto"
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Hover Scale */}
        <div className="pt-1">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Hover Scale Factor</span>
            <span className="font-mono">{style.hoverScale || 1.03}x</span>
          </div>
          <input
            type="range"
            min="0.95"
            max="1.15"
            step="0.01"
            value={style.hoverScale || 1.03}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, hoverScale: Number(e.target.value) }
              })
            }
            className="w-full accent-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
