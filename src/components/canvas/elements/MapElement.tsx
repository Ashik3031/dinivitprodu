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

  const colors = style.colors || {};
  const primaryColor = colors.accent || style.color || '#d4af37';
  const cardBg = colors.cardBackground || (style.backgroundColor && style.backgroundColor !== 'transparent' ? style.backgroundColor : '#020617');
  const headingColor = colors.heading || '#ffffff';
  const bodyColor = colors.body || '#cbd5e1';
  const btnBg = colors.buttonBackground || primaryColor;
  const btnText = colors.buttonText || '#020617';
  const borderColor = colors.border || style.borderColor || 'rgba(255, 255, 255, 0.15)';

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col select-none group transition-all"
      style={{
        fontFamily: style.fontFamily || "'Playfair Display', serif",
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px',
        borderWidth: style.borderWidth ? `${style.borderWidth}px` : 1,
        borderColor: borderColor,
        borderStyle: style.borderStyle || 'solid',
        boxShadow: style.boxShadow || '0 10px 25px -5px rgba(0,0,0,0.3)',
        backgroundColor: cardBg
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
        <div
          className="absolute top-2.5 left-2.5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border text-white shadow-lg flex items-center gap-1.5 max-w-[85%]"
          style={{
            backgroundColor: `${cardBg}f0`,
            borderColor
          }}
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
          <div className="truncate">
            <span className="text-[11px] font-bold block truncate" style={{ color: headingColor }}>{venueName}</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Directions Button */}
      <div
        className="p-3 backdrop-blur-md border-t flex items-center justify-between gap-2"
        style={{
          backgroundColor: `${cardBg}fa`,
          borderColor
        }}
      >
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-[11px] truncate font-medium" style={{ color: bodyColor }}>
            {venueAddress}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Copy Address */}
          <button
            type="button"
            title="Copy Address"
            onClick={handleCopyAddress}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border"
            style={{ color: bodyColor, borderColor }}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Directions Button */}
          <button
            type="button"
            onClick={handleDirectionsClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer font-sans"
            style={{ backgroundColor: btnBg, color: btnText }}
          >
            <Navigation className="w-3.5 h-3.5" style={{ fill: btnText }} />
            <span>Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
