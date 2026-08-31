import React, { useState, useEffect } from 'react';
import { ElementStyle, ElementContent } from '../../../types';
import { Clock, Sparkles, Calendar, Heart } from 'lucide-react';

interface CountdownElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const CountdownElement: React.FC<CountdownElementProps> = ({
  style,
  content,
  isEditor = false
}) => {
  // Target date & time (defaulting to 2026-10-24 16:00:00 or content.eventDate)
  const targetDateStr = content.countdownTarget || content.eventDate || '2026-10-24T16:00:00';
  
  const calculateTimeLeft = () => {
    try {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (isNaN(distance) || distance <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isPast: false
      };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Initial compute
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  const labels = content.countdownLabels || {
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS'
  };

  const cdStyle = content.countdownStyle || 'boxes';
  const primaryColor = style.color || '#d4af37';
  const fontFamily = style.fontFamily || "'Cinzel', serif";
  const numFontSize = style.fontSize ? `${style.fontSize}px` : '22px';

  const units = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.minutes },
    { value: timeLeft.seconds, label: labels.seconds }
  ];

  // 1. MINIMAL STYLE
  if (cdStyle === 'minimal') {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-2 select-none"
        style={{
          fontFamily,
          borderRadius: style.borderRadius ? `${style.borderRadius}px` : '12px',
          backgroundColor: style.backgroundColor || 'transparent'
        }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {units.map((unit, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <span
                  className="font-bold tabular-nums tracking-wider leading-none"
                  style={{ color: primaryColor, fontSize: numFontSize }}
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-sans mt-1">
                  {unit.label}
                </span>
              </div>
              {idx < 3 && (
                <span
                  className="font-bold -mt-3 text-sm opacity-50"
                  style={{ color: primaryColor }}
                >
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
        {timeLeft.isPast && (
          <div className="mt-1.5 text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>The Special Day is Here!</span>
          </div>
        )}
      </div>
    );
  }

  // 2. CIRCULAR / BADGE STYLE
  if (cdStyle === 'circles') {
    return (
      <div
        className="w-full h-full flex items-center justify-around gap-1.5 p-2 select-none"
        style={{
          fontFamily,
          borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
        }}
      >
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="flex-1 aspect-square max-w-[72px] flex flex-col items-center justify-center rounded-full border border-white/20 bg-slate-950/60 backdrop-blur-md shadow-md p-1"
            style={{
              borderColor: `${primaryColor}40`
            }}
          >
            <span
              className="font-bold tabular-nums leading-none"
              style={{ color: primaryColor, fontSize: numFontSize }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-slate-300 font-sans mt-0.5">
              {unit.label.substring(0, 4)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 3. FROSTED GLASS / BOXES STYLE (DEFAULT)
  return (
    <div
      className="w-full h-full flex items-center justify-around gap-2 p-2 select-none"
      style={{
        fontFamily,
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {units.map((unit, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl border border-white/10 bg-slate-950/50 backdrop-blur-md shadow-md hover:border-amber-400/40 transition-colors"
          style={{
            borderRadius: style.borderRadius ? `${Math.max(6, Number(style.borderRadius) - 4)}px` : '12px'
          }}
        >
          <span
            className="font-bold tabular-nums tracking-wider leading-none"
            style={{ color: primaryColor, fontSize: numFontSize }}
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-slate-300 font-sans font-semibold mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};
