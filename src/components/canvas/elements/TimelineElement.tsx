import React from 'react';
import { ElementStyle, ElementContent } from '../../../types';
import {
  Clock,
  Heart,
  Music,
  Wine,
  Utensils,
  Camera,
  Cake,
  Church,
  Sparkles,
  PartyPopper,
  Car,
  Award,
  Coffee,
  CheckCircle2
} from 'lucide-react';

interface TimelineElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const TimelineElement: React.FC<TimelineElementProps> = ({
  style,
  content,
  isEditor
}) => {
  const events = content.timelineEvents && content.timelineEvents.length > 0
    ? content.timelineEvents
    : [
        { time: '04:00 PM', title: 'Solemn Ceremony', description: 'Exchange of vows at the sacred chapel', icon: 'Church' },
        { time: '05:30 PM', title: 'Cocktail Hour', description: 'Champagne, canapés and acoustic serenade', icon: 'Wine' },
        { time: '07:00 PM', title: 'Grand Banquet', description: 'Five-course dinner, heartfelt toasts & first dance', icon: 'Utensils' },
        { time: '09:00 PM', title: 'After Party', description: 'Midnight dancing under the starlight', icon: 'Sparkles' }
      ];

  const primaryColor = style.color || '#d4af37';
  const bgColor = style.backgroundColor || 'rgba(15, 23, 42, 0.85)';

  const renderIcon = (iconName?: string) => {
    const iconProps = { className: 'w-3.5 h-3.5' };
    switch (iconName?.toLowerCase()) {
      case 'church':
      case 'chapel':
        return <Church {...iconProps} />;
      case 'wine':
      case 'cocktail':
      case 'drinks':
        return <Wine {...iconProps} />;
      case 'utensils':
      case 'dinner':
      case 'banquet':
        return <Utensils {...iconProps} />;
      case 'music':
      case 'dance':
        return <Music {...iconProps} />;
      case 'camera':
      case 'photo':
        return <Camera {...iconProps} />;
      case 'cake':
        return <Cake {...iconProps} />;
      case 'heart':
      case 'rings':
      case 'vows':
        return <Heart {...iconProps} />;
      case 'party':
      case 'partypopper':
        return <PartyPopper {...iconProps} />;
      case 'car':
        return <Car {...iconProps} />;
      case 'coffee':
        return <Coffee {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-start p-4 rounded-2xl select-none backdrop-blur-md border border-white/10 shadow-lg text-slate-100 overflow-y-auto"
      style={{
        backgroundColor: bgColor,
        fontFamily: style.fontFamily || "'Playfair Display', serif",
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {/* Optional Title */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: primaryColor }} />
          <span className="font-bold text-sm tracking-wider uppercase font-serif">
            {content.text || 'Order of Events'}
          </span>
        </div>
        <span
          className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-white/15 uppercase tracking-widest font-semibold"
          style={{ color: primaryColor }}
        >
          Timeline
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-3 relative pl-1">
        {events.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-3 group">
            {/* Connecting Line & Milestone Icon */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center border shadow-md transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: primaryColor,
                  color: primaryColor
                }}
              >
                {renderIcon(event.icon)}
              </div>
              {idx < events.length - 1 && (
                <div
                  className="w-0.5 min-h-[36px] my-1 rounded-full opacity-40"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1 pt-0.5 min-w-0">
              <div
                className="text-[11px] font-mono font-bold tracking-wider uppercase"
                style={{ color: primaryColor }}
              >
                {event.time}
              </div>
              <div className="text-xs font-bold text-slate-100 mt-0.5 font-serif">
                {event.title}
              </div>
              {event.description && (
                <div className="text-[11px] text-slate-300 font-sans mt-0.5 leading-relaxed opacity-85">
                  {event.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
