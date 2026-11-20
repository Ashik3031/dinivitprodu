import React, { useState } from 'react';
import { CanvasElement, ElementStyle, ElementContent, ElementColorTokens } from '../../../types';
import { GOOGLE_FONTS_LIST } from '../../../data/stockAssets';
import {
  DESIGN_STYLE_PRESETS,
  FONT_PAIRING_PRESETS,
  copyElementStyle,
  getCopiedStyle
} from '../../../utils/colorUtils';
import { UnifiedColorPicker } from './UnifiedColorPicker';
import { InspectorSection } from './InspectorSection';
import {
  Palette,
  Type,
  Sparkles,
  Sliders,
  Square,
  Layers,
  ChevronDown,
  RotateCcw,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic,
  Underline,
  Strikethrough,
  Copy,
  ArrowUp,
  ArrowDown,
  Shirt,
  Gift,
  Plane,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  MessageCircle,
  QrCode
} from 'lucide-react';

interface InvitationDesignInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  palette?: string[];
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
}

export const InvitationDesignInspector: React.FC<InvitationDesignInspectorProps> = ({
  element,
  onUpdateElement,
  palette = [],
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack
}) => {
  const { type, content = {}, style = {} } = element;
  const colors = style.colors || {};

  // Collapsible sub-sections
  const [isIndividualColorsOpen, setIsIndividualColorsOpen] = useState(false);
  const [isAdvancedTypographyOpen, setIsAdvancedTypographyOpen] = useState(false);

  // Helper to update style
  const updateStyle = (updates: Partial<ElementStyle>) => {
    onUpdateElement(element.id, {
      style: { ...style, ...updates }
    });
  };

  // Helper to update specific color token
  const updateColorToken = (token: keyof ElementColorTokens, colorVal: string) => {
    const updatedTokens: ElementColorTokens = {
      ...colors,
      [token]: colorVal
    };
    onUpdateElement(element.id, {
      style: {
        ...style,
        colors: updatedTokens
      }
    });
  };

  // Helper to update content
  const updateContent = (updates: Partial<ElementContent>) => {
    onUpdateElement(element.id, {
      content: { ...content, ...updates }
    });
  };

  // Apply visual style preset
  const handleApplyPreset = (preset: typeof DESIGN_STYLE_PRESETS[0]) => {
    const primaryColor = preset.primary || (preset as any).color || '#d4af37';
    onUpdateElement(element.id, {
      style: {
        ...style,
        color: primaryColor,
        backgroundColor: preset.bg,
        borderColor: preset.border,
        fontFamily: preset.font,
        borderWidth: style.borderWidth || 1,
        borderStyle: 'solid',
        // Clear conflicting granular color tokens so preset takes effect cleanly
        colors: undefined
      }
    });
  };

  // Apply font pairing preset
  const handleApplyFontPairing = (headingFont: string, bodyFont: string) => {
    updateStyle({
      fontFamily: headingFont
    });
  };

  // Reset all granular color tokens
  const handleResetColorTokens = () => {
    onUpdateElement(element.id, {
      style: {
        ...style,
        colors: undefined
      }
    });
  };

  /* -------------------------------------------------------------------------- */
  /* 1. CONTENT RENDERING BY ELEMENT TYPE                                       */
  /* -------------------------------------------------------------------------- */
  const renderContentControls = () => {
    switch (type) {
      // 1. EVENT DATE
      case 'event-date':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Header Label</label>
              <input
                type="text"
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Celebration Date"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Formatted Date</label>
              <input
                type="text"
                value={content.eventDate || ''}
                onChange={(e) => updateContent({ eventDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Saturday, October 24, 2026"
              />
            </div>
          </div>
        );

      // 2. EVENT TIME
      case 'event-time':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Header Label</label>
              <input
                type="text"
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Reception Time"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Formatted Time</label>
              <input
                type="text"
                value={content.eventTime || ''}
                onChange={(e) => updateContent({ eventTime: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. 04:00 PM – 10:00 PM"
              />
            </div>
          </div>
        );

      // 3. COUNTDOWN
      case 'countdown':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Target Date & Time</label>
              <input
                type="datetime-local"
                value={content.countdownTarget ? content.countdownTarget.substring(0, 16) : ''}
                onChange={(e) => updateContent({ countdownTarget: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1.5">Visual Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'boxes', label: 'Cards' },
                  { id: 'minimal', label: 'Minimal' },
                  { id: 'circles', label: 'Badges' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => updateContent({ countdownStyle: st.id as any })}
                    className={`py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${(content.countdownStyle || 'boxes') === st.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // 4. CALENDAR
      case 'calendar':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Target Event Date</label>
              <input
                type="date"
                value={content.eventDate || '2026-10-24'}
                onChange={(e) => updateContent({ eventDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Calendar Event Title</label>
              <input
                type="text"
                value={content.calendarEventTitle || ''}
                onChange={(e) => updateContent({ calendarEventTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Wedding Celebration"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Calendar Location</label>
              <input
                type="text"
                value={content.calendarEventLocation || ''}
                onChange={(e) => updateContent({ calendarEventLocation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Grand Ballroom"
              />
            </div>
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-xs font-medium text-slate-800">Show 'Add to Calendar' Button</span>
              <input
                type="checkbox"
                checked={content.calendarShowAddToCal !== false}
                onChange={(e) => updateContent({ calendarShowAddToCal: e.target.checked })}
                className="w-4 h-4 accent-slate-900"
              />
            </label>
          </div>
        );

      // 5. VENUE & GOOGLE MAPS
      case 'venue':
      case 'google-maps':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Venue Name / Label</label>
              <input
                type="text"
                value={content.venueName || ''}
                onChange={(e) => updateContent({ venueName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. The Grand Biltmore"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Physical Address / Map Query</label>
              <textarea
                rows={2}
                value={content.venueAddress || ''}
                onChange={(e) =>
                  updateContent({
                    venueAddress: e.target.value,
                    mapQuery: encodeURIComponent(e.target.value)
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. 1 Lodge St, Asheville, NC 28803"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                <span>Map Zoom</span>
                <span className="font-mono text-slate-500">{content.mapZoom || 14}</span>
              </div>
              <input
                type="range"
                min="10"
                max="18"
                value={content.mapZoom || 14}
                onChange={(e) => updateContent({ mapZoom: Number(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>
          </div>
        );

      // 6. TIMELINE
      case 'timeline': {
        const events = content.timelineEvents || [];
        const handleAddEvent = () => {
          const updated = [...events, { time: '08:00 PM', title: 'New Event', description: 'Description', icon: 'Clock' }];
          updateContent({ timelineEvents: updated });
        };
        const handleUpdateEvent = (index: number, key: string, val: string) => {
          const updated = events.map((ev, i) => (i === index ? { ...ev, [key]: val } : ev));
          updateContent({ timelineEvents: updated });
        };
        const handleDeleteEvent = (index: number) => {
          const updated = events.filter((_, i) => i !== index);
          updateContent({ timelineEvents: updated });
        };

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700">Events Itinerary ({events.length})</span>
              <button
                type="button"
                onClick={handleAddEvent}
                className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {events.map((ev, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={ev.time}
                      onChange={(e) => handleUpdateEvent(idx, 'time', e.target.value)}
                      className="w-24 bg-white border border-slate-200 rounded p-1 text-[11px] font-mono font-semibold text-slate-900"
                      placeholder="04:00 PM"
                    />
                    <select
                      value={ev.icon || 'Clock'}
                      onChange={(e) => handleUpdateEvent(idx, 'icon', e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded p-1 text-[11px] text-slate-800"
                    >
                      <option value="Clock">Clock</option>
                      <option value="Church">Ceremony / Church</option>
                      <option value="Heart">Vows / Rings</option>
                      <option value="Wine">Cocktail / Wine</option>
                      <option value="Utensils">Banquet / Dinner</option>
                      <option value="Cake">Cake Cutting</option>
                      <option value="Music">Dance / Music</option>
                      <option value="Camera">Photo Session</option>
                      <option value="Sparkles">Party / Sparkles</option>
                      <option value="Car">Departure / Car</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={ev.title}
                    onChange={(e) => handleUpdateEvent(idx, 'title', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-semibold text-slate-900"
                    placeholder="Event Title"
                  />
                  <input
                    type="text"
                    value={ev.description || ''}
                    onChange={(e) => handleUpdateEvent(idx, 'description', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] text-slate-600"
                    placeholder="Short description"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }

      // 7. PHOTO GALLERY
      case 'photo-gallery': {
        const images = content.galleryImages || [];
        const layouts = [
          { id: 'coverflow', label: '3D Coverflow' },
          { id: 'stack', label: '3D Deck' },
          { id: 'carousel', label: 'Carousel' },
          { id: 'grid', label: 'Grid' },
          { id: 'masonry', label: 'Masonry' },
          { id: 'polaroid', label: 'Polaroid' }
        ];

        const handleAddPhoto = () => {
          const sample = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
          updateContent({ galleryImages: [...images, { url: sample, caption: 'Special Memory' }] });
        };
        const handleUpdatePhoto = (idx: number, key: string, val: string) => {
          const updated = images.map((img, i) => (i === idx ? { ...img, [key]: val } : img));
          updateContent({ galleryImages: updated });
        };
        const handleDeletePhoto = (idx: number) => {
          updateContent({ galleryImages: images.filter((_, i) => i !== idx) });
        };

        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1.5">Gallery Layout</label>
              <div className="grid grid-cols-3 gap-1.5">
                {layouts.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => updateContent({ galleryLayout: l.id as any })}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${(content.galleryLayout || 'carousel') === l.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">Photos ({images.length})</span>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {images.map((img, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex gap-2 items-center">
                    <img src={img.url} alt="Thumbnail" className="w-10 h-10 object-cover rounded-md" referrerPolicy="no-referrer" />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={img.url}
                        onChange={(e) => handleUpdatePhoto(idx, 'url', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1 text-[10px] font-mono text-slate-700"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={img.caption || ''}
                        onChange={(e) => handleUpdatePhoto(idx, 'caption', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] text-slate-800"
                        placeholder="Caption"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 8. RSVP FORM & GUESTBOOK
      case 'rsvp-form':
      case 'guestbook':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Headline Text</label>
              <input
                type="text"
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder={type === 'rsvp-form' ? 'Will You Join Our Celebration?' : 'Wishes & Guestbook'}
              />
            </div>
          </div>
        );

      // 9. WHATSAPP BUTTON
      case 'whatsapp-button':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Button Label</label>
              <input
                type="text"
                value={content.buttonText || 'RSVP via WhatsApp'}
                onChange={(e) => updateContent({ buttonText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Phone Number (with Country Code)</label>
              <input
                type="text"
                value={content.whatsappPhone || '+1234567890'}
                onChange={(e) => updateContent({ whatsappPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Pre-filled Message</label>
              <textarea
                rows={2}
                value={content.whatsappMessage || ''}
                onChange={(e) => updateContent({ whatsappMessage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="Hi! Delighted to confirm my attendance..."
              />
            </div>
          </div>
        );

      // 10. QR CODE
      case 'qr-code':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Encoded Value / Link</label>
              <input
                type="text"
                value={content.qrCodeValue || ''}
                onChange={(e) => updateContent({ qrCodeValue: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Label Below QR (Optional)</label>
              <input
                type="text"
                value={content.qrLabel || ''}
                onChange={(e) => updateContent({ qrLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="Scan to Check In"
              />
            </div>
          </div>
        );

      // 11. COUPLE NAMES
      case 'couple-names':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">First Person / Groom</label>
              <input
                type="text"
                value={content.coupleName1 || ''}
                onChange={(e) => updateContent({ coupleName1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Connector</label>
              <input
                type="text"
                value={content.andConnector || '&'}
                onChange={(e) => updateContent({ andConnector: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Second Person / Bride</label>
              <input
                type="text"
                value={content.coupleName2 || ''}
                onChange={(e) => updateContent({ coupleName2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        );

      // 12. DRESS CODE
      case 'dress-code': {
        const dressColors = content.dressCodeColors || ['#000000', '#ffffff', '#d4af37'];
        const DRESS_TYPES = ['Black Tie', 'Formal', 'Semi-Formal', 'Cocktail', 'Smart Casual', 'Beach Chic', 'Traditional'];

        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={content.dressCodeTitle || content.text || ''}
                onChange={(e) => updateContent({ dressCodeTitle: e.target.value, text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Attire & Dress Code"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Attire Style</label>
              <select
                value={content.dressCodeType || 'Black Tie'}
                onChange={(e) => updateContent({ dressCodeType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {DRESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Description / Guidelines</label>
              <textarea
                rows={2}
                value={content.dressCodeDescription || ''}
                onChange={(e) => updateContent({ dressCodeDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Tuxedos and evening gowns are kindly requested."
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Footnote / Note</label>
              <input
                type="text"
                value={content.dressCodeNote || ''}
                onChange={(e) => updateContent({ dressCodeNote: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Please avoid white, ivory, and cream shades."
              />
            </div>
          </div>
        );
      }

      // 13. GIFT REGISTRY
      case 'gift-registry': {
        const registries = content.giftRegistries || [
          { name: 'Amazon Registry', url: 'https://amazon.com' }
        ];

        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={content.giftRegistryTitle || ''}
                onChange={(e) => updateContent({ giftRegistryTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Gift Registry / Wishing Well"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Message to Guests</label>
              <textarea
                rows={2}
                value={content.giftRegistryDescription || ''}
                onChange={(e) => updateContent({ giftRegistryDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Your presence is the greatest gift of all..."
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Cash / Bank / UPI Details</label>
              <textarea
                rows={2}
                value={content.giftRegistryCashInfo || ''}
                onChange={(e) => updateContent({ giftRegistryCashInfo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Bank Account or Venmo details"
              />
            </div>
          </div>
        );
      }

      // 14. TRAVEL & ACCOMMODATION
      case 'travel-accommodation': {
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Section Title</label>
              <input
                type="text"
                value={content.travelTitle || ''}
                onChange={(e) => updateContent({ travelTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Travel & Accommodations"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">General Description</label>
              <textarea
                rows={2}
                value={content.travelDescription || ''}
                onChange={(e) => updateContent({ travelDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Room blocks reserved under Sterling-Montgomery."
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Flights & Shuttle Info</label>
              <textarea
                rows={2}
                value={content.travelFlightsInfo || ''}
                onChange={(e) => updateContent({ travelFlightsInfo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                placeholder="e.g. Complimentary airport shuttle provided."
              />
            </div>
          </div>
        );
      }

      default:
        return (
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Text Content</label>
            <input
              type="text"
              value={content.text || ''}
              onChange={(e) => updateContent({ text: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              placeholder="Element text..."
            />
          </div>
        );
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 2. GRANULAR INDIVIDUAL COLOR TOKENS PER ELEMENT TYPE                       */
  /* -------------------------------------------------------------------------- */
  const renderIndividualColorPickers = () => {
    switch (type) {
      case 'rsvp-form':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Heading Text"
              value={colors.heading || style.color || '#f8fafc'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Body Text"
              value={colors.body || '#cbd5e1'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Field Labels"
              value={colors.label || '#94a3b8'}
              onChange={(val) => updateColorToken('label', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Accept Button BG"
                value={colors.acceptButtonBackground || style.color || '#f59e0b'}
                onChange={(val) => updateColorToken('acceptButtonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Accept Button Text"
                value={colors.acceptButtonText || '#020617'}
                onChange={(val) => updateColorToken('acceptButtonText', val)}
                themeColors={palette}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Decline Button BG"
                value={colors.declineButtonBackground || '#1e293b'}
                onChange={(val) => updateColorToken('declineButtonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Decline Button Text"
                value={colors.declineButtonText || '#e2e8f0'}
                onChange={(val) => updateColorToken('declineButtonText', val)}
                themeColors={palette}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Input Field BG"
                value={colors.inputBackground || '#020617'}
                onChange={(val) => updateColorToken('inputBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Input Text Color"
                value={colors.inputText || '#f8fafc'}
                onChange={(val) => updateColorToken('inputText', val)}
                themeColors={palette}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Submit Button BG"
                value={colors.buttonBackground || style.color || '#d4af37'}
                onChange={(val) => updateColorToken('buttonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Submit Button Text"
                value={colors.buttonText || '#020617'}
                onChange={(val) => updateColorToken('buttonText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'countdown':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Number Digits"
              value={colors.numberColor || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('numberColor', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Unit Labels (Days, Hrs)"
              value={colors.label || '#94a3b8'}
              onChange={(val) => updateColorToken('label', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Inner Box Background"
              value={colors.cardBackground || '#020617'}
              onChange={(val) => updateColorToken('cardBackground', val)}
              allowTransparent
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Box Border Color"
              value={colors.border || style.borderColor || 'rgba(255, 255, 255, 0.12)'}
              onChange={(val) => updateColorToken('border', val)}
              themeColors={palette}
            />
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Timeline Header"
              value={colors.heading || style.color || '#f8fafc'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Connecting Line"
              value={colors.timelineLine || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('timelineLine', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Milestone Marker BG"
              value={colors.timelineMarker || style.backgroundColor || '#0f172a'}
              onChange={(val) => updateColorToken('timelineMarker', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Milestone Icon Color"
              value={colors.icon || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('icon', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Event Description"
              value={colors.body || '#cbd5e1'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Badge Background"
                value={colors.badgeBackground || 'transparent'}
                onChange={(val) => updateColorToken('badgeBackground', val)}
                allowTransparent
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Badge Text"
                value={colors.badgeText || style.color || '#d4af37'}
                onChange={(val) => updateColorToken('badgeText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'guestbook':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Header Title"
              value={colors.heading || style.color || '#f8fafc'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Feed Card Background"
              value={colors.cardBackground || '#0f172a'}
              onChange={(val) => updateColorToken('cardBackground', val)}
              allowTransparent
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Message Body Text"
              value={colors.body || '#cbd5e1'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Input Background"
                value={colors.inputBackground || '#020617'}
                onChange={(val) => updateColorToken('inputBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Input Text"
                value={colors.inputText || '#f8fafc'}
                onChange={(val) => updateColorToken('inputText', val)}
                themeColors={palette}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Post Button BG"
                value={colors.buttonBackground || style.color || '#d4af37'}
                onChange={(val) => updateColorToken('buttonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Post Button Text"
                value={colors.buttonText || '#020617'}
                onChange={(val) => updateColorToken('buttonText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Month / Year Title"
              value={colors.heading || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Weekday Labels (S M T)"
              value={colors.label || '#94a3b8'}
              onChange={(val) => updateColorToken('label', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Day Numbers"
              value={colors.numberColor || '#e2e8f0'}
              onChange={(val) => updateColorToken('numberColor', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Highlight Heart Accent"
              value={colors.accent || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('accent', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Button Background"
                value={colors.buttonBackground || style.color || '#d4af37'}
                onChange={(val) => updateColorToken('buttonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Button Text"
                value={colors.buttonText || '#020617'}
                onChange={(val) => updateColorToken('buttonText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'venue':
      case 'google-maps':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Map Pin / Accent"
              value={colors.accent || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('accent', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Venue Heading"
              value={colors.heading || '#ffffff'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Address Text"
              value={colors.body || '#cbd5e1'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Directions Button BG"
                value={colors.buttonBackground || style.color || '#d4af37'}
                onChange={(val) => updateColorToken('buttonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Directions Button Text"
                value={colors.buttonText || '#020617'}
                onChange={(val) => updateColorToken('buttonText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'dress-code':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Section Title"
              value={colors.heading || style.color || '#fbbf24'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Badge Background"
              value={colors.badgeBackground || 'rgba(212, 175, 55, 0.2)'}
              onChange={(val) => updateColorToken('badgeBackground', val)}
              allowTransparent
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Badge Text"
              value={colors.badgeText || style.color || '#fbbf24'}
              onChange={(val) => updateColorToken('badgeText', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Description Text"
              value={colors.body || '#d4d4d4'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
          </div>
        );

      case 'gift-registry':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Section Title"
              value={colors.heading || style.color || '#fbbf24'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Description Text"
              value={colors.body || '#d4d4d4'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Registry Button BG"
                value={colors.buttonBackground || 'rgba(212, 175, 55, 0.15)'}
                onChange={(val) => updateColorToken('buttonBackground', val)}
                allowTransparent
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Registry Button Text"
                value={colors.buttonText || style.color || '#fbbf24'}
                onChange={(val) => updateColorToken('buttonText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'travel-accommodation':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Section Title"
              value={colors.heading || style.color || '#fbbf24'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Description Text"
              value={colors.body || '#d4d4d4'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <div className="grid grid-cols-2 gap-2">
              <UnifiedColorPicker
                label="Book Button BG"
                value={colors.buttonBackground || style.color || '#d4af37'}
                onChange={(val) => updateColorToken('buttonBackground', val)}
                themeColors={palette}
              />
              <UnifiedColorPicker
                label="Book Button Text"
                value={colors.buttonText || '#020617'}
                onChange={(val) => updateColorToken('buttonText', val)}
                themeColors={palette}
              />
            </div>
          </div>
        );

      case 'couple-names':
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Couple Names Color"
              value={colors.heading || style.color || '#0f172a'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Connector (&) Color"
              value={colors.accent || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('accent', val)}
              themeColors={palette}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <UnifiedColorPicker
              label="Heading Text"
              value={colors.heading || style.color || '#0f172a'}
              onChange={(val) => updateColorToken('heading', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Body Text"
              value={colors.body || '#475569'}
              onChange={(val) => updateColorToken('body', val)}
              themeColors={palette}
            />
            <UnifiedColorPicker
              label="Accent Elements"
              value={colors.accent || style.color || '#d4af37'}
              onChange={(val) => updateColorToken('accent', val)}
              themeColors={palette}
            />
          </div>
        );
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SHADOW PRESETS                                                             */
  /* -------------------------------------------------------------------------- */
  const SHADOW_PRESETS = [
    { label: 'None', value: 'none' },
    { label: 'Subtle', value: '0 2px 8px rgba(0,0,0,0.08)' },
    { label: 'Medium', value: '0 8px 20px rgba(0,0,0,0.18)' },
    { label: 'Gold Glow', value: '0 0 20px rgba(212,175,55,0.35)' },
    { label: 'Dark Elevation', value: '0 10px 25px -5px rgba(0,0,0,0.4)' }
  ];

  const CORNER_PRESETS = [0, 8, 12, 16, 24];

  return (
    <div className="space-y-3 text-xs">
      {/* ==================================================================== */}
      {/* SECTION 1: CONTENT                                                   */}
      {/* ==================================================================== */}
      <InspectorSection title="Content" icon={Sliders} defaultOpen={true}>
        {renderContentControls()}
      </InspectorSection>

      {/* ==================================================================== */}
      {/* SECTION 2: QUICK STYLES (1-CLICK LUXURY PRESETS)                     */}
      {/* ==================================================================== */}
      <InspectorSection title="Quick Styles" icon={Sparkles} badge="1-Click" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {DESIGN_STYLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-2 rounded-xl border border-slate-200 hover:border-amber-400 bg-white text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-2 group"
            >
              {/* Swatch Pill */}
              <div className="flex -space-x-1 shrink-0">
                <span
                  className="w-4 h-4 rounded-full border border-white shadow-2xs"
                  style={{ backgroundColor: preset.primary || (preset as any).color }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-white shadow-2xs"
                  style={{ backgroundColor: preset.bg }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-slate-800 truncate group-hover:text-amber-800 transition-colors">
                  {preset.name}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {preset.font ? preset.font.replace(/['",]/g, '').split(' ')[0] : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </InspectorSection>

      {/* ==================================================================== */}
      {/* SECTION 3: COLORS & THEME                                            */}
      {/* ==================================================================== */}
      <InspectorSection title="Colors & Theme" icon={Palette} defaultOpen={true}>
        {/* Simple Top-Level Colors */}
        <div className="space-y-3">
          <UnifiedColorPicker
            label="Primary / Accent Color"
            value={style.color || '#d4af37'}
            onChange={(color) => updateStyle({ color })}
            themeColors={palette}
          />

          <UnifiedColorPicker
            label="Card Background Color"
            value={style.backgroundColor || 'transparent'}
            onChange={(backgroundColor) => updateStyle({ backgroundColor })}
            allowTransparent
            themeColors={palette}
          />

          <UnifiedColorPicker
            label="Text / Body Color"
            value={colors.body || '#cbd5e1'}
            onChange={(val) => updateColorToken('body', val)}
            themeColors={palette}
          />
        </div>

        {/* Collapsible Sub-Section: Customize Individual Colors */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsIndividualColorsOpen(!isIndividualColorsOpen)}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-bold">Customize Individual Colors</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isIndividualColorsOpen ? 'rotate-180 text-slate-700' : ''
                }`}
            />
          </button>

          {isIndividualColorsOpen && (
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Detailed Color Roles
                </span>
                <button
                  type="button"
                  onClick={handleResetColorTokens}
                  className="text-[10px] text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset to Global</span>
                </button>
              </div>

              {renderIndividualColorPickers()}
            </div>
          )}
        </div>
      </InspectorSection>

      {/* ==================================================================== */}
      {/* SECTION 4: TYPOGRAPHY                                                */}
      {/* ==================================================================== */}
      <InspectorSection title="Typography" icon={Type} defaultOpen={false}>
        {/* Font Family */}
        <div>
          <label className="text-[11px] font-medium text-slate-700 block mb-1">Font Family</label>
          <select
            value={style.fontFamily || "'Playfair Display', serif"}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            {GOOGLE_FONTS_LIST.map((f) => (
              <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>

        {/* Font Size & Stepper */}
        <div>
          <label className="text-[11px] font-medium text-slate-700 block mb-1">Font Size</label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateStyle({ fontSize: Math.max(8, (Number(style.fontSize) || 16) - 1) })}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              value={style.fontSize || 16}
              onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
            <button
              type="button"
              onClick={() => updateStyle({ fontSize: Math.min(120, (Number(style.fontSize) || 16) + 1) })}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Font Weight & Text Alignment */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Weight</label>
            <select
              value={style.fontWeight || 400}
              onChange={(e) => updateStyle({ fontWeight: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value={300}>300 Light</option>
              <option value={400}>400 Regular</option>
              <option value={500}>500 Medium</option>
              <option value={600}>600 SemiBold</option>
              <option value={700}>700 Bold</option>
              <option value={800}>800 ExtraBold</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Alignment</label>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              {[
                { id: 'left', icon: AlignLeft },
                { id: 'center', icon: AlignCenter },
                { id: 'right', icon: AlignRight }
              ].map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateStyle({ textAlign: id as any })}
                  className={`flex-1 py-2 flex items-center justify-center cursor-pointer transition-colors ${(style.textAlign || 'center') === id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Font Pairing Presets Shortcut */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Luxury Font Pairings
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {FONT_PAIRING_PRESETS.map((pair) => (
              <button
                key={pair.name}
                type="button"
                onClick={() => handleApplyFontPairing(pair.headingFont, pair.bodyFont)}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-[10.5px] font-bold text-slate-800 truncate">{pair.name}</div>
                <div className="text-[9px] text-slate-400 truncate">
                  {pair.headingFont ? pair.headingFont.replace(/['",]/g, '').split(' ')[0] : ''}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Advanced Typography */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsAdvancedTypographyOpen(!isAdvancedTypographyOpen)}
            className="w-full flex items-center justify-between py-1 px-1.5 text-slate-600 hover:text-slate-900 text-[11px] font-semibold cursor-pointer"
          >
            <span>Advanced Typography (Spacing, Transform)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdvancedTypographyOpen ? 'rotate-180' : ''}`} />
          </button>

          {isAdvancedTypographyOpen && (
            <div className="mt-2 space-y-2.5 pt-2 border-t border-slate-100">
              {/* Letter Spacing */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Letter Spacing</span>
                  <span className="font-mono">{style.letterSpacing || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="12"
                  step="0.5"
                  value={style.letterSpacing || 0}
                  onChange={(e) => updateStyle({ letterSpacing: Number(e.target.value) })}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Line Height */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Line Height</span>
                  <span className="font-mono">{style.lineHeight || 1.3}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={style.lineHeight || 1.3}
                  onChange={(e) => updateStyle({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Text Transform */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Text Transform</label>
                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'uppercase', label: 'UPPER' },
                    { id: 'lowercase', label: 'lower' },
                    { id: 'capitalize', label: 'Caps' }
                  ].map((tt) => (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() => updateStyle({ textTransform: tt.id as any })}
                      className={`py-1 rounded border transition-colors cursor-pointer text-center ${(style.textTransform || 'none') === tt.id
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      {tt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </InspectorSection>

      {/* ==================================================================== */}
      {/* SECTION 5: APPEARANCE (Borders, Corner Radius, Shadow, Padding)     */}
      {/* ==================================================================== */}
      <InspectorSection title="Appearance" icon={Square} defaultOpen={false}>
        {/* Corner Radius */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
            <span>Corner Radius</span>
            <span className="font-mono">{style.borderRadius || 0}px</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1.5">
            {CORNER_PRESETS.map((rad) => (
              <button
                key={rad}
                type="button"
                onClick={() => updateStyle({ borderRadius: rad })}
                className={`flex-1 py-1 rounded text-[10px] font-semibold border cursor-pointer ${style.borderRadius === rad
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {rad}px
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={style.borderRadius || 0}
            onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
            className="w-full accent-slate-900"
          />
        </div>

        {/* Border Width & Style */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Border Width</label>
            <input
              type="number"
              min="0"
              max="20"
              value={style.borderWidth || 0}
              onChange={(e) => updateStyle({ borderWidth: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Border Style</label>
            <select
              value={style.borderStyle || 'solid'}
              onChange={(e) => updateStyle({ borderStyle: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        {/* Border Color */}
        <UnifiedColorPicker
          label="Border Color"
          value={style.borderColor || 'rgba(255, 255, 255, 0.15)'}
          onChange={(borderColor) => updateStyle({ borderColor })}
          allowTransparent
          themeColors={palette}
        />

        {/* Shadows */}
        <div>
          <label className="text-[11px] font-medium text-slate-700 block mb-1.5">Shadow Preset</label>
          <div className="grid grid-cols-3 gap-1.5">
            {SHADOW_PRESETS.map((sh) => (
              <button
                key={sh.label}
                type="button"
                onClick={() => updateStyle({ boxShadow: sh.value === 'none' ? undefined : sh.value })}
                className={`py-1.5 px-2 rounded-lg border text-[10.5px] font-medium transition-all cursor-pointer text-center ${(style.boxShadow || 'none') === sh.value || (!style.boxShadow && sh.value === 'none')
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        </div>

        {/* Padding */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
            <span>Inner Padding</span>
            <span className="font-mono">{style.padding || 0}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="64"
            value={style.padding || 0}
            onChange={(e) => updateStyle({ padding: Number(e.target.value) })}
            className="w-full accent-slate-900"
          />
        </div>
      </InspectorSection>

      {/* ==================================================================== */}
      {/* SECTION 6: LAYOUT & SPACING (Dimensions, Position, Rotation)         */}
      {/* ==================================================================== */}
      <InspectorSection title="Layout & Spacing" icon={Sliders} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Width (px)</label>
            <input
              type="number"
              value={element.width || 0}
              onChange={(e) => onUpdateElement(element.id, { width: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Height (px)</label>
            <input
              type="number"
              value={element.height || 0}
              onChange={(e) => onUpdateElement(element.id, { height: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">X Position</label>
            <input
              type="number"
              value={element.x || 0}
              onChange={(e) => onUpdateElement(element.id, { x: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Y Position</label>
            <input
              type="number"
              value={element.y || 0}
              onChange={(e) => onUpdateElement(element.id, { y: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
            <span>Rotation Angle</span>
            <span className="font-mono">{style.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={style.rotation || 0}
            onChange={(e) => updateStyle({ rotation: Number(e.target.value) })}
            className="w-full accent-slate-900"
          />
        </div>
      </InspectorSection>

      {/* ==================================================================== */}
      {/* SECTION 7: ADVANCED (Opacity, Layer Ordering)                         */}
      {/* ==================================================================== */}
      <InspectorSection title="Advanced" icon={Layers} defaultOpen={false}>
        {/* Opacity */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
            <span>Opacity</span>
            <span className="font-mono">{Math.round((style.opacity !== undefined ? style.opacity : 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={style.opacity !== undefined ? style.opacity : 1}
            onChange={(e) => updateStyle({ opacity: Number(e.target.value) })}
            className="w-full accent-slate-900"
          />
        </div>

        {/* Layer Ordering */}
        <div className="pt-2 border-t border-slate-100">
          <label className="text-[11px] font-medium text-slate-700 block mb-1.5">Layer Arrangement</label>
          <div className="grid grid-cols-2 gap-1.5">
            {onBringToFront && (
              <button
                type="button"
                onClick={onBringToFront}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Bring to Front</span>
              </button>
            )}
            {onBringForward && (
              <button
                type="button"
                onClick={onBringForward}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Forward</span>
              </button>
            )}
            {onSendBackward && (
              <button
                type="button"
                onClick={onSendBackward}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Backward</span>
              </button>
            )}
            {onSendToBack && (
              <button
                type="button"
                onClick={onSendToBack}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Send to Back</span>
              </button>
            )}
          </div>
        </div>
      </InspectorSection>
    </div>
  );
};
