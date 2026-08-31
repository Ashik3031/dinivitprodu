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

  // iCal (.ics) file download generator
  const handleDownloadICS = (e: React.MouseEvent) => {
    if (isEditor) return;
    e.stopPropagation();

    const title = content.calendarEventTitle || content.text || 'Celebration Invitation';
    const location = content.calendarEventLocation || content.venueAddress || 'Celebration Venue';
    const description = content.calendarEventDescription || 'Join us for this special celebration!';
    
    const startIso = isValidDate
      ? targetDate.toISOString().replace(/-|:|\.\d\d\d/g, '')
      : '20261024T160000Z';
    const endIso = isValidDate
      ? new Date(targetDate.getTime() + 6 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '')
      : '20261024T220000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Digital Invitation Studio//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invitation-event.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const primaryColor = style.color || '#d4af37';
  const bgColor = style.backgroundColor || 'rgba(15, 23, 42, 0.85)';

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-3.5 rounded-2xl select-none backdrop-blur-md border border-white/10 shadow-lg text-slate-100"
      style={{
        backgroundColor: bgColor,
        fontFamily: style.fontFamily || "'Playfair Display', serif",
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {/* Header Month / Year */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" style={{ color: primaryColor }} />
          <span className="font-bold text-sm tracking-wider uppercase font-serif">
            {currentMonthName} {year}
          </span>
        </div>
        <div
          className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-white/15 uppercase tracking-widest font-semibold"
          style={{ color: primaryColor }}
        >
          Save the Date
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center py-1 text-[10px] font-sans font-semibold opacity-60 tracking-wider">
        <span>SU</span>
        <span>MO</span>
        <span>TU</span>
        <span>WE</span>
        <span>TH</span>
        <span>FR</span>
        <span>SA</span>
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-sans">
        {daysArray.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-6 w-full" />;
          }

          const isTarget = day === highlightDay;

          return (
            <div
              key={`day-${day}`}
              className={`h-6 w-full flex items-center justify-center rounded-full text-[11px] font-medium transition-all relative ${
                isTarget
                  ? 'font-bold shadow-md ring-2 ring-white/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
              style={{
                backgroundColor: isTarget ? primaryColor : 'transparent',
                color: isTarget ? '#0f172a' : undefined
              }}
            >
              {day}
              {isTarget && (
                <Heart
                  className="w-2.5 h-2.5 absolute -top-1 -right-0.5 fill-rose-500 text-rose-500 animate-pulse"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {content.calendarShowAddToCal !== false && (
        <div className="mt-2 flex gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleAddToGoogleCalendar}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-sans font-semibold transition-all shadow-sm hover:brightness-110 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: primaryColor,
              color: '#0f172a'
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Google Calendar</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadICS}
            title="Download iCal (.ics) for Apple Calendar / Outlook"
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-[10px] font-sans font-semibold border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>.ICS</span>
          </button>
        </div>
      )}
    </div>
  );
};
