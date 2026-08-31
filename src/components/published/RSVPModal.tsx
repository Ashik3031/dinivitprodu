import React, { useState } from 'react';
import { api } from '../../services/api';
import { Check, X, Heart, Sparkles, User, Mail, Phone, Users, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVPModalProps {
  invitationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ invitationId, isOpen, onClose }) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'not_attending' | 'maybe'>('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitRSVP({
        invitationId,
        guestName,
        guestEmail,
        guestPhone,
        attendance,
        guestCount: attendance === 'attending' ? guestCount : 0,
        dietaryPreferences,
        message
      });

      setSubmittedSuccess(true);
      if (attendance === 'attending') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Thank You, {guestName}!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {attendance === 'attending'
                ? 'Your RSVP confirmation has been recorded. We eagerly await celebrating with you!'
                : 'Thank you for letting us know. Your heartfelt wishes are warmly appreciated.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Response Card
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Will You Attend?
              </h3>
            </div>

            {/* Attendance Switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAttendance('attending')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  attendance === 'attending'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setAttendance('not_attending')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  attendance === 'not_attending'
                    ? 'bg-white text-slate-700 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Regretfully Decline
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs text-slate-700 font-medium block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor & Marcus"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Guest Count if attending */}
            {attendance === 'attending' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Number of Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0199"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Dietary or Message */}
            {attendance === 'attending' && (
              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Dietary Restrictions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Nut Allergy"
                  value={dietaryPreferences}
                  onChange={(e) => setDietaryPreferences(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-slate-700 font-medium block mb-1">Message for the Host</label>
              <textarea
                rows={2}
                placeholder="Share your warm thoughts or blessings..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              {isSubmitting ? 'Submitting RSVP...' : 'Confirm RSVP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
