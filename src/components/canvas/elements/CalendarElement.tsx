import React from 'react';
import { Calendar as CalendarIcon, Download, Sparkles, Heart } from 'lucide-react';
import { ElementStyle, ElementContent } from '../../../types';

interface CalendarElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const CalendarElement: React.FC<CalendarElementProps> = ({
  style,
  content,
  isEditor
}) => {
  // Parse or default event date
  const targetDateStr = content.eventDate || content.countdownTarget || '2026-10-24';
  const targetDate = new Date(targetDateStr);
  const isValidDate = !isNaN(targetDate.getTime());

  const year = isValidDate ? targetDate.getFullYear() : (content.calendarYear || 2026);
  const monthIdx = isValidDate ? targetDate.getMonth() : 9; // October = 9
  const highlightDay = isValidDate ? targetDate.getDate() : (content.calendarDay || 24);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = content.calendarMonth || monthNames[monthIdx];

  // Calculate days in month and starting day of week
  const firstDayOfWeek = new Date(year, monthIdx, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Google Calendar URL Generator
  const handleAddToGoogleCalendar = (e: React.MouseEvent) => {
    if (isEditor) return;
    e.stopPropagation();

    const title = encodeURIComponent(content.calendarEventTitle || content.text || 'Celebration Invitation');
    const location = encodeURIComponent(content.calendarEventLocation || content.venueAddress || 'Celebration Venue');
    const details = encodeURIComponent(content.calendarEventDescription || 'Join us for this unforgettable celebration!');

    // Format YYYYMMDDTHHMMSSZ
    const startIso = isValidDate
      ? targetDate.toISOString().replace(/-|:|\.\d\d\d/g, '')
      : '20261024T160000Z';
    const endIso = isValidDate
      ? new Date(targetDate.getTime() + 6 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '')
      : '20261024T220000Z';

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  const colors = style.colors || {};
  const primaryColor = colors.accent || style.color || '#d4af37';
  const bgColor = colors.cardBackground || style.backgroundColor || 'rgba(15, 23, 42, 0.85)';
  const headingColor = colors.heading || primaryColor;
  const labelColor = colors.label || '#94a3b8';
  const numberColor = colors.numberColor || '#e2e8f0';
  const buttonBg = colors.buttonBackground || primaryColor;
  const buttonText = colors.buttonText || (['#ffffff', '#f8fafc', '#fff1f2', '#fefce8', '#fde68a', '#d4af37'].includes(buttonBg.toLowerCase()) ? '#0f172a' : '#ffffff');
  const badgeBg = colors.badgeBackground || 'rgba(255, 255, 255, 0.05)';
  const badgeText = colors.badgeText || primaryColor;
  const borderColor = colors.border || style.borderColor || 'rgba(255, 255, 255, 0.15)';

  return (
    <div
      className="w-full h-full flex flex-col justify-between select-none backdrop-blur-xl shadow-2xl transition-all overflow-hidden relative"
      style={{
        backgroundColor: bgColor,
        fontFamily: style.fontFamily || "'Playfair Display', serif",
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px',
        borderWidth: style.borderWidth ? `${style.borderWidth}px` : 1,
        borderColor: borderColor,
        borderStyle: style.borderStyle || 'solid',
        boxShadow: style.boxShadow || '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        padding: style.padding ? `${style.padding}px` : '14px',
        color: numberColor
      }}
    >
      {/* Decorative background glow based on primary color */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Header Month / Year */}
      <div className="flex items-center justify-between pb-2 border-b relative z-10" style={{ borderColor }}>
        <div className="flex items-center gap-1.5">
          <span
            className="font-bold tracking-widest uppercase transition-colors"
            style={{
              fontFamily: style.fontFamily || "'Playfair Display', serif",
              color: headingColor,
              fontSize: style.fontSize ? `${style.fontSize}px` : '14px',
              fontWeight: style.fontWeight || '700',
              letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : '1px',
              textTransform: style.textTransform || 'uppercase',
              fontStyle: style.fontStyle
            }}
          >
            {currentMonthName}
          </span>
          <span className="text-[10px] tracking-widest opacity-80 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            {year}
          </span>
        </div>
        <div
          className="text-[8px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-semibold transition-colors backdrop-blur-sm shadow-sm"
          style={{
            color: badgeText,
            borderColor: `${badgeText}40`,
            backgroundColor: badgeBg,
            fontFamily: style.fontFamily
          }}
        >
          {content.calendarBadgeText || 'Save the Date'}
        </div>
      </div>

      {/* Weekday Labels */}
      <div
        className="grid grid-cols-7 gap-1 text-center py-1 text-[8px] font-bold tracking-widest relative z-10"
        style={{ fontFamily: "'Inter', sans-serif", color: labelColor }}
      >
        <span style={{ color: primaryColor }}>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span style={{ color: primaryColor }}>S</span>
      </div>

      {/* Day Grid */}
      <div
        className="grid grid-cols-7 auto-rows-fr gap-1 text-center text-[11px] relative z-10 flex-1"
        style={{ fontFamily: style.fontFamily }}
      >
        {daysArray.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="w-full h-full" />;
          }

          const isTarget = day === highlightDay;
          const isWeekend = (idx % 7 === 0) || (idx % 7 === 6);

          return (
            <div
              key={`day-${day}`}
              className={`w-full h-full flex items-center justify-center transition-all relative ${isTarget
                ? 'font-bold scale-125 z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                : 'hover:bg-white/10 rounded-lg cursor-default'
                }`}
              style={{
                color: isTarget ? '#ffffff' : (isWeekend ? labelColor : numberColor)
              }}
            >
              {isTarget && (
                <Heart
                  className="absolute w-6 h-6 z-0 fill-current animate-[pulse_3s_ease-in-out_infinite]"
                  style={{ color: primaryColor }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-300 ${isTarget ? '-mt-[1px] text-[10px]' : ''}`}
                style={
                  isTarget
                    ? { color: ['#ffffff', '#f8fafc', '#fff1f2', '#fefce8', '#fde68a'].includes(primaryColor.toLowerCase()) ? '#0f172a' : '#ffffff' }
                    : {}
                }
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {content.calendarShowAddToCal !== false && (
        <div className="mt-2 flex pt-1 relative z-10">
          <button
            type="button"
            onClick={handleAddToGoogleCalendar}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[10px] font-bold tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer uppercase"
            style={{
              backgroundColor: buttonBg,
              color: buttonText,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <CalendarIcon className="w-3 h-3" />
            <span>Add to Calendar</span>
          </button>
        </div>
      )}
    </div>
  );
};
