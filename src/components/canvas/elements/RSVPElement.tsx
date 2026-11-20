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

  const colors = style.colors || {};
  const primaryColor = colors.accent || style.color || '#d4af37';
  const bgColor = colors.cardBackground || style.backgroundColor || 'rgba(15, 23, 42, 0.9)';
  const headingColor = colors.heading || style.color || '#f8fafc';
  const bodyColor = colors.body || '#cbd5e1';
  const labelColor = colors.label || '#94a3b8';
  const borderColor = colors.border || style.borderColor || 'rgba(255, 255, 255, 0.1)';
  const inputBg = colors.inputBackground || 'rgba(2, 6, 23, 0.8)';
  const inputText = colors.inputText || '#f8fafc';
  const acceptBtnBg = colors.acceptButtonBackground || primaryColor;
  const acceptBtnText = colors.acceptButtonText || '#020617';
  const declineBtnBg = colors.declineButtonBackground || 'rgba(30, 41, 59, 0.8)';
  const declineBtnText = colors.declineButtonText || '#e2e8f0';
  const submitBtnBg = colors.buttonBackground || primaryColor;
  const submitBtnText = colors.buttonText || '#020617';

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
        } catch { }
      }
    }, 400);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between select-none backdrop-blur-md shadow-xl overflow-y-auto transition-all"
      style={{
        backgroundColor: bgColor,
        fontFamily: style.fontFamily || "'Playfair Display', serif",
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px',
        borderWidth: style.borderWidth ? `${style.borderWidth}px` : 1,
        borderColor: borderColor,
        borderStyle: style.borderStyle || 'solid',
        boxShadow: style.boxShadow,
        padding: style.padding ? `${style.padding}px` : '16px',
        color: bodyColor
      }}
    >
      {/* Header */}
      <div className="text-center pb-2 border-b mb-2" style={{ borderColor }}>
        <span
          className="text-[10px] font-sans px-2.5 py-0.5 rounded-full border uppercase tracking-widest font-semibold inline-block mb-1"
          style={{
            color: primaryColor,
            borderColor: `${primaryColor}40`,
            backgroundColor: colors.badgeBackground || 'transparent'
          }}
        >
          RSVP Card
        </span>
        <h3 className="text-sm font-bold font-serif" style={{ color: headingColor }}>
          {content.text || 'Will You Join Our Celebration?'}
        </h3>
      </div>

      {isSubmitted ? (
        <div className="py-4 text-center space-y-2">
          <div
            className="w-10 h-10 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            <Check className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold font-serif" style={{ color: headingColor }}>
            Thank You, {guestName}!
          </h4>
          <p className="text-[11px] font-sans leading-relaxed" style={{ color: bodyColor }}>
            {attendance === 'attending'
              ? `Your attendance (${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}) has been warmly confirmed!`
              : 'Thank you for letting us know. Your heartfelt wishes are appreciated!'}
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-[10px] font-sans underline underline-offset-2 cursor-pointer hover:opacity-80 pt-1"
            style={{ color: primaryColor }}
          >
            Edit response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Attending / Not Attending Switch */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border font-sans" style={{ backgroundColor: inputBg, borderColor }}>
            <button
              type="button"
              onClick={() => setAttendance('attending')}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: attendance === 'attending' ? acceptBtnBg : 'transparent',
                color: attendance === 'attending' ? acceptBtnText : bodyColor,
                opacity: attendance === 'attending' ? 1 : 0.65
              }}
            >
              Joyfully Accept
            </button>
            <button
              type="button"
              onClick={() => setAttendance('not_attending')}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: attendance === 'not_attending' ? declineBtnBg : 'transparent',
                color: attendance === 'not_attending' ? declineBtnText : bodyColor,
                opacity: attendance === 'not_attending' ? 1 : 0.65
              }}
            >
              Regretfully Decline
            </button>
          </div>

          {/* Guest Name */}
          <div className="font-sans">
            <label className="text-[10px] block mb-1" style={{ color: labelColor }}>Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
              style={{
                backgroundColor: inputBg,
                color: inputText,
                borderColor
              }}
            />
          </div>

          {/* Number of guests (if attending) */}
          {attendance === 'attending' && (
            <div className="font-sans">
              <label className="text-[10px] block mb-1" style={{ color: labelColor }}>Number of Guests</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className="flex-1 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer"
                    style={{
                      backgroundColor: guestCount === num ? `${primaryColor}25` : inputBg,
                      borderColor: guestCount === num ? primaryColor : borderColor,
                      color: guestCount === num ? primaryColor : bodyColor
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div className="font-sans">
            <label className="text-[10px] block mb-1" style={{ color: labelColor }}>Optional Message / Note</label>
            <input
              type="text"
              placeholder="Dietary notes or special wishes..."
              value={optionalMessage}
              onChange={(e) => setOptionalMessage(e.target.value)}
              className="w-full border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
              style={{
                backgroundColor: inputBg,
                color: inputText,
                borderColor
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs font-sans shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 mt-1"
            style={{ backgroundColor: submitBtnBg, color: submitBtnText }}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm RSVP Response</span>
          </button>
        </form>
      )}
    </div>
  );
};
