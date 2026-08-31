import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import { ElementStyle, ElementContent } from '../../../types';

interface MapElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const MapElement: React.FC<MapElementProps> = ({
  style,
  content,
  isEditor = false
}) => {
  const [copied, setCopied] = useState(false);
  const venueName = content.venueName || 'The Grand Venue';
  const venueAddress = content.venueAddress || '123 Luxury Boulevard, New York, NY';
  const query = content.mapQuery || encodeURIComponent(`${venueName} ${venueAddress}`);
  const zoom = content.mapZoom || 14;

  const handleDirectionsClick = (e: React.MouseEvent) => {
    if (isEditor) return;
    e.stopPropagation();
    const destination = encodeURIComponent(venueAddress || venueName);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    if (isEditor) return;
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(venueAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const primaryColor = style.color || '#d4af37';

  return (
    <div
      className="w-full h-full relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-xl flex flex-col select-none group"
      style={{
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {/* Google Maps Iframe */}
      <div className="w-full flex-1 relative min-h-[120px] bg-slate-900">
        <iframe
          title="Venue Location Map"
          src={`https://maps.google.com/maps?q=${query}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full border-0 pointer-events-auto"
          loading="lazy"
        />

        {/* Floating Pin / Venue Badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-white shadow-lg flex items-center gap-1.5 max-w-[85%]">
          <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[11px] font-bold block truncate">{venueName}</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Directions Button */}
      <div className="p-3 bg-slate-950/95 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-[11px] text-slate-300 truncate font-medium">
            {venueAddress}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Copy Address */}
          <button
            type="button"
            title="Copy Address"
            onClick={handleCopyAddress}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Directions Button */}
          <button
            type="button"
            onClick={handleDirectionsClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer font-sans"
          >
            <Navigation className="w-3.5 h-3.5 fill-slate-950" />
            <span>Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
