import React from 'react';
import { CanvasElement, ElementStyle } from '../../../types';
import { GOOGLE_FONTS_LIST } from '../../../data/stockAssets';
import { Plus, Trash2, Calendar, Clock, MapPin, MessageCircle, QrCode, Heart, Sparkles, Image as ImageIcon, Palette, Type } from 'lucide-react';

interface InvitationElementsInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onSwitchTab?: (tab: 'style' | 'content') => void;
}

export const InvitationElementsInspector: React.FC<InvitationElementsInspectorProps> = ({
  element,
  onUpdateElement,
  onSwitchTab
}) => {
  const { type, content, style } = element;

  const updateStyle = (updates: Partial<ElementStyle>) => {
    onUpdateElement(element.id, {
      style: { ...style, ...updates }
    });
  };

  const LUXURY_PRESETS = [
    { name: 'Royal Gold', color: '#d4af37', bg: '#0f172a', border: '#d4af37', font: "'Cinzel', serif" },
    { name: 'Rose Romance', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', font: "'Great Vibes', cursive" },
    { name: 'Emerald Luxe', color: '#10b981', bg: '#022c22', border: '#059669', font: "'Cormorant Garamond', serif" },
    { name: 'Midnight', color: '#f8fafc', bg: '#090d16', border: '#334155', font: "'Playfair Display', serif" },
    { name: 'Champagne', color: '#b45309', bg: '#fefce8', border: '#fde68a', font: "'Playfair Display', serif" },
    { name: 'Modern Light', color: '#0f172a', bg: '#ffffff', border: '#e2e8f0', font: "'Montserrat', sans-serif" }
  ];

  const SWATCH_COLORS = ['#d4af37', '#e11d48', '#059669', '#0f172a', '#334155', '#7c3aed', '#b45309', '#ffffff', '#000000'];

  const renderQuickStyleBanner = () => (
    <div className="mb-3 space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Color, Font & Style Presets</span>
        </div>
        {onSwitchTab && (
          <button
            type="button"
            onClick={() => onSwitchTab('style')}
            className="text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
          >
            All Styles →
          </button>
        )}
      </div>

      {/* 1-Click Luxury Theme Presets */}
      <div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
          1-Click Luxury Presets
        </span>
        <div className="grid grid-cols-3 gap-1">
          {LUXURY_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => updateStyle({
                color: p.color,
                backgroundColor: p.bg,
                borderColor: p.border,
                fontFamily: p.font,
                borderWidth: style.borderWidth || 1,
                borderStyle: 'solid'
              })}
              className="py-1 px-1.5 rounded border border-slate-200 hover:border-amber-400 bg-white text-slate-800 text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer truncate shadow-xs"
              title={`${p.name} preset`}
            >
              <span className="w-2 h-2 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: p.color }} />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-slate-200">
        {/* Font Family */}
        <div>
          <label className="text-[10px] font-semibold text-slate-600 block mb-1">Font Family</label>
          <select
            value={style.fontFamily || "'Playfair Display', serif"}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-medium focus:outline-none focus:border-slate-900"
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
            <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Font Size (px)</label>
            <input
              type="number"
              value={style.fontSize || 16}
              onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 font-medium focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Font Weight</label>
            <select
              value={style.fontWeight || 400}
              onChange={(e) => updateStyle({ fontWeight: Number(e.target.value) })}
              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-800 font-medium focus:outline-none focus:border-slate-900"
            >
              <option value={300}>300 Light</option>
              <option value={400}>400 Regular</option>
              <option value={500}>500 Medium</option>
              <option value={600}>600 SemiBold</option>
              <option value={700}>700 Bold</option>
              <option value={800}>800 ExtraBold</option>
            </select>
          </div>
        </div>

        {/* Accent / Text Color & Swatches */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
            <span>Text / Accent Color</span>
            <span className="font-mono text-[9px] text-slate-400">{style.color || '#d4af37'}</span>
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
              className="flex-1 text-[11px] bg-white border border-slate-200 rounded p-1 font-mono text-slate-800"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            {SWATCH_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateStyle({ color: c })}
                className={`w-4 h-4 rounded-full border cursor-pointer hover:scale-110 transition-transform ${
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
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
            <span>Card Background Color</span>
            <button
              type="button"
              onClick={() => updateStyle({ backgroundColor: 'transparent' })}
              className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer font-bold ${
                !style.backgroundColor || style.backgroundColor === 'transparent'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
              className="flex-1 text-[11px] bg-white border border-slate-200 rounded p-1 font-mono text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    // 1. EVENT DATE
    if (type === 'event-date') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Event Date Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Header Label</label>
          <input
            type="text"
            value={content.text || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, text: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Celebration Date"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Formatted Date Text</label>
          <input
            type="text"
            value={content.eventDate || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, eventDate: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Saturday, October 24, 2026"
          />
        </div>
      </div>
    );
  }

  // 2. EVENT TIME
  if (type === 'event-time') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Event Time Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Header Label</label>
          <input
            type="text"
            value={content.text || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, text: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Reception Time"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Formatted Time Text</label>
          <input
            type="text"
            value={content.eventTime || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, eventTime: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. 04:00 PM – 10:00 PM"
          />
        </div>
      </div>
    );
  }

  // 3. COUNTDOWN
  if (type === 'countdown') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Countdown Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Target Date & Time</label>
          <input
            type="datetime-local"
            value={content.countdownTarget ? content.countdownTarget.substring(0, 16) : ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, countdownTarget: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Visual Style</label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'boxes', label: 'Cards' },
              { id: 'minimal', label: 'Minimal' },
              { id: 'circles', label: 'Badges' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateElement(element.id, { content: { ...content, countdownStyle: st.id as any } })}
                className={`py-1.5 rounded border text-[11px] font-medium transition-colors cursor-pointer text-center ${
                  (content.countdownStyle || 'boxes') === st.id
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
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
  }

  // 4. CALENDAR
  if (type === 'calendar') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Calendar Sync Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Target Event Date</label>
          <input
            type="date"
            value={content.eventDate || '2026-10-24'}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, eventDate: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Calendar Event Title</label>
          <input
            type="text"
            value={content.calendarEventTitle || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, calendarEventTitle: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Alexander & Sophia Wedding"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Calendar Location</label>
          <input
            type="text"
            value={content.calendarEventLocation || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, calendarEventLocation: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. The Grand Biltmore Estate"
          />
        </div>
        <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
          <span className="text-xs font-medium text-slate-800">Show 'Add to Calendar' Button</span>
          <input
            type="checkbox"
            checked={content.calendarShowAddToCal !== false}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, calendarShowAddToCal: e.target.checked } })}
            className="w-4 h-4 accent-slate-900"
          />
        </label>
      </div>
    );
  }

  // 5. VENUE
  if (type === 'venue') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Venue Details
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Venue Name</label>
          <input
            type="text"
            value={content.venueName || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, venueName: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. The Grand Ballroom"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Full Physical Address</label>
          <textarea
            rows={2}
            value={content.venueAddress || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, venueAddress: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. 1 Lodge St, Asheville, NC 28803"
          />
        </div>
      </div>
    );
  }

  // 6. MAP
  if (type === 'google-maps') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Map Embed Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Venue / Pin Label</label>
          <input
            type="text"
            value={content.venueName || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, venueName: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Biltmore Estate"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Location / Search Query</label>
          <input
            type="text"
            value={content.venueAddress || ''}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: {
                  ...content,
                  venueAddress: e.target.value,
                  mapQuery: encodeURIComponent(e.target.value)
                }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. 1 Lodge St, Asheville, NC"
          />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Zoom Level</span>
            <span className="font-mono">{content.mapZoom || 14}</span>
          </div>
          <input
            type="range"
            min="10"
            max="18"
            value={content.mapZoom || 14}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, mapZoom: Number(e.target.value) } })}
            className="w-full accent-slate-900"
          />
        </div>
      </div>
    );
  }

  // 7. TIMELINE
  if (type === 'timeline') {
    const events = content.timelineEvents || [];

    const handleAddEvent = () => {
      const updated = [...events, { time: '08:00 PM', title: 'Celebration Event', description: 'Description of event' }];
      onUpdateElement(element.id, { content: { ...content, timelineEvents: updated } });
    };

    const handleUpdateEvent = (index: number, key: string, val: string) => {
      const updated = events.map((ev, i) => (i === index ? { ...ev, [key]: val } : ev));
      onUpdateElement(element.id, { content: { ...content, timelineEvents: updated } });
    };

    const handleDeleteEvent = (index: number) => {
      const updated = events.filter((_, i) => i !== index);
      onUpdateElement(element.id, { content: { ...content, timelineEvents: updated } });
    };

    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
            Timeline Itinerary
          </span>
          <button
            type="button"
            onClick={handleAddEvent}
            className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Step</span>
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {events.map((ev, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 relative group">
              <div className="flex items-center justify-between gap-1.5">
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
                  className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                value={ev.title}
                onChange={(e) => handleUpdateEvent(idx, 'title', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-semibold text-slate-900"
                placeholder="Ceremony Title"
              />
              <input
                type="text"
                value={ev.description}
                onChange={(e) => handleUpdateEvent(idx, 'description', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] text-slate-600"
                placeholder="Brief description"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. PHOTO GALLERY
  if (type === 'photo-gallery') {
    const images = content.galleryImages || [];
    const layouts = [
      { id: 'coverflow', label: '3D Coverflow ✨' },
      { id: 'stack', label: '3D Stack Deck ✨' },
      { id: 'cylinder', label: '3D Rotary Reel' },
      { id: 'carousel', label: 'Carousel Slider' },
      { id: 'grid', label: 'Photo Grid' },
      { id: 'masonry', label: 'Masonry Wall' },
      { id: 'polaroid', label: 'Polaroid Frame' }
    ];

    const handleAddPhoto = () => {
      const samplePhotos = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
      ];
      const updated = [...images, { url: samplePhotos[images.length % samplePhotos.length], caption: 'Precious Memory' }];
      onUpdateElement(element.id, { content: { ...content, galleryImages: updated } });
    };

    const handleUpdatePhoto = (index: number, key: string, val: string) => {
      const updated = images.map((img, i) => (i === index ? { ...img, [key]: val } : img));
      onUpdateElement(element.id, { content: { ...content, galleryImages: updated } });
    };

    const handleDeletePhoto = (index: number) => {
      const updated = images.filter((_, i) => i !== index);
      onUpdateElement(element.id, { content: { ...content, galleryImages: updated } });
    };

    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Gallery Layout & Photos
        </span>

        {/* Layout selector */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Layout Mode</label>
          <div className="grid grid-cols-2 gap-1.5">
            {layouts.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onUpdateElement(element.id, { content: { ...content, galleryLayout: l.id as any } })}
                className={`py-1.5 px-2 rounded border text-[11px] font-medium transition-colors cursor-pointer text-center ${
                  (content.galleryLayout || 'carousel') === l.id
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos List */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Photos ({images.length})
            </span>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {images.map((img, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex gap-2 items-center">
                <img src={img.url} alt="Thumbnail" className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => handleUpdatePhoto(idx, 'url', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1 text-[10px] font-mono text-slate-700"
                    placeholder="https://..."
                  />
                  <input
                    type="text"
                    value={img.caption || ''}
                    onChange={(e) => handleUpdatePhoto(idx, 'caption', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1 text-[10px] text-slate-800"
                    placeholder="Caption"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
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

  // 9. WHATSAPP BUTTON
  if (type === 'whatsapp-button') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          WhatsApp RSVP Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Button Label</label>
          <input
            type="text"
            value={content.buttonText || 'RSVP via WhatsApp'}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, buttonText: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Phone Number (with Country Code)</label>
          <input
            type="text"
            value={content.whatsappPhone || '+1234567890'}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, whatsappPhone: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="+1234567890"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Pre-filled Message</label>
          <textarea
            rows={3}
            value={content.whatsappMessage || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, whatsappMessage: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="Hi! I am delighted to accept your invitation..."
          />
        </div>
      </div>
    );
  }

  // 10. QR CODE
  if (type === 'qr-code') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          QR Code Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Encoded Value / Link</label>
          <input
            type="text"
            value={content.qrCodeValue || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, qrCodeValue: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Label below QR (Optional)</label>
          <input
            type="text"
            value={content.qrLabel || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, qrLabel: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Scan to Check-In"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Pattern Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={content.qrFgColor || style.color || '#000000'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    content: { ...content, qrFgColor: e.target.value },
                    style: { ...style, color: e.target.value }
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={content.qrFgColor || style.color || '#000000'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    content: { ...content, qrFgColor: e.target.value },
                    style: { ...style, color: e.target.value }
                  })
                }
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Background</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={content.qrBgColor || '#ffffff'}
                onChange={(e) => onUpdateElement(element.id, { content: { ...content, qrBgColor: e.target.value } })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={content.qrBgColor || '#ffffff'}
                onChange={(e) => onUpdateElement(element.id, { content: { ...content, qrBgColor: e.target.value } })}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 11. RSVP FORM / GUESTBOOK
  if (type === 'rsvp-form' || type === 'guestbook') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          {type === 'rsvp-form' ? 'RSVP Form Card' : 'Guestbook Widget'}
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Instruction Text</label>
          <textarea
            rows={3}
            value={content.text || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, text: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="Prompt message for guests..."
          />
        </div>
      </div>
    );
  }

  // 12. COUPLE NAMES
  if (type === 'couple-names') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Couple Names
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">First Person / Groom</label>
          <input
            type="text"
            value={content.coupleName1 || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, coupleName1: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Connector</label>
          <input
            type="text"
            value={content.andConnector || '&'}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, andConnector: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Second Person / Bride</label>
          <input
            type="text"
            value={content.coupleName2 || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, coupleName2: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>
    );
  }

  // 13. DRESS CODE
  if (type === 'dress-code') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Dress Code Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Dress Code Title</label>
          <input
            type="text"
            value={content.dressCodeTitle || content.text || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, dressCodeTitle: e.target.value, text: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Formal Black Tie"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Description / Guidelines</label>
          <textarea
            rows={2}
            value={content.dressCodeDescription || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, dressCodeDescription: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Tuxedos and evening gowns are kindly requested."
          />
        </div>
      </div>
    );
  }

  // 14. DIRECTIONS BUTTON
  if (type === 'directions-button') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Directions Button Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Button Label</label>
          <input
            type="text"
            value={content.text || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, text: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Get Driving Directions"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Maps URL / Query</label>
          <input
            type="text"
            value={content.mapQuery || content.url || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, mapQuery: e.target.value, url: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. https://maps.google.com/?q=..."
          />
        </div>
      </div>
    );
  }

  // 15. CONTACT BUTTON
  if (type === 'contact-button') {
    return (
      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
          Contact Button Settings
        </span>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Button Label</label>
          <input
            type="text"
            value={content.text || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, text: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Contact Organizer"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Phone / WhatsApp / Email</label>
          <input
            type="text"
            value={content.contactInfo || content.phoneNumber || ''}
            onChange={(e) => onUpdateElement(element.id, { content: { ...content, contactInfo: e.target.value, phoneNumber: e.target.value } })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. +1 555-0199 or name@example.com"
          />
        </div>
      </div>
    );
  }

    return null;
  };

  const contentJsx = renderContent();
  if (!contentJsx) return null;

  return (
    <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
      {renderQuickStyleBanner()}
      {contentJsx}
    </div>
  );
};
