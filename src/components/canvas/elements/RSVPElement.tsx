import React, { useState } from 'react';
import { ElementStyle, ElementContent } from '../../../types';
import { Heart, Check, Users, User, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVPElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
  onOpenModal?: () => void;
}

export const RSVPElement: React.FC<RSVPElementProps> = ({
  style,
  content,
  isEditor = false,
  onOpenModal
}) => {
  const [guestName, setGuestName] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'not_attending'>('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [optionalMessage, setOptionalMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryColor = style.color || '#d4af37';
  const bgColor = style.backgroundColor || 'rgba(15, 23, 42, 0.9)';

  const handleSubmit = (e: React.FormEvent) => {
    if (isEditor) return;
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      if (attendance === 'attending') {
        try {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    }, 400);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-4 rounded-2xl select-none backdrop-blur-md border border-white/10 shadow-xl text-slate-100 overflow-y-auto"
      style={{
        backgroundColor: bgColor,
        fontFamily: style.fontFamily || "'Playfair Display', serif",
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {/* Header */}
      <div className="text-center pb-2 border-b border-white/10 mb-2">
        <span
          className="text-[10px] font-sans px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-widest font-semibold inline-block mb-1"
          style={{ color: primaryColor }}
        >
          RSVP Card
        </span>
        <h3 className="text-sm font-bold text-slate-100 font-serif">
          {content.text || 'Will You Join Our Celebration?'}
        </h3>
      </div>

      {isSubmitted ? (
        <div className="py-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 mx-auto flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 font-serif">
            Thank You, {guestName}!
          </h4>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {attendance === 'attending'
              ? `Your attendance (${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}) has been warmly confirmed!`
              : 'Thank you for letting us know. Your heartfelt wishes are appreciated!'}
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-[10px] font-sans text-amber-400 underline underline-offset-2 cursor-pointer hover:opacity-80 pt-1"
          >
            Edit response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Attending / Not Attending Switch */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-white/10 font-sans">
            <button
              type="button"
              onClick={() => setAttendance('attending')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                attendance === 'attending'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Joyfully Accept
            </button>
            <button
              type="button"
              onClick={() => setAttendance('not_attending')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                attendance === 'not_attending'
                  ? 'bg-slate-800 text-slate-200 border border-white/20 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Regretfully Decline
            </button>
          </div>

          {/* Guest Name */}
          <div className="font-sans">
            <label className="text-[10px] text-slate-300 block mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Number of guests (if attending) */}
          {attendance === 'attending' && (
            <div className="font-sans">
              <label className="text-[10px] text-slate-300 block mb-1">Number of Guests</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      guestCount === num
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div className="font-sans">
            <label className="text-[10px] text-slate-300 block mb-1">Optional Message / Note</label>
            <input
              type="text"
              placeholder="Dietary notes or special wishes..."
              value={optionalMessage}
              onChange={(e) => setOptionalMessage(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs font-sans text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 mt-1"
            style={{ backgroundColor: primaryColor }}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm RSVP Response</span>
          </button>
        </form>
      )}
    </div>
  );
};
