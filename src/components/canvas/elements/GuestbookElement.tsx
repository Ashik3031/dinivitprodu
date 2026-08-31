import React, { useState, useEffect } from 'react';
import { ElementStyle, ElementContent, GuestbookMessage } from '../../../types';
import { api } from '../../../services/api';
import { MessageSquare, Send, Heart, User, Check, Sparkles } from 'lucide-react';

interface GuestbookElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
  onOpenModal?: () => void;
}

export const GuestbookElement: React.FC<GuestbookElementProps> = ({
  style,
  content,
  isEditor = false,
  onOpenModal
}) => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([
    {
      id: 'demo-1',
      invitationId: 'demo',
      senderName: 'William & Victoria',
      relationship: 'Close Family',
      message: 'Wishing you both a lifetime of immense joy, love, and magical adventures!',
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'demo-2',
      invitationId: 'demo',
      senderName: 'Katherine Vance',
      relationship: 'Friend',
      message: 'So incredibly thrilled to celebrate your special day together. Congratulations!',
      isApproved: true,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ]);

  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const primaryColor = style.color || '#d4af37';
  const bgColor = style.backgroundColor || 'rgba(15, 23, 42, 0.9)';

  const handleSubmit = async (e: React.FormEvent) => {
    if (isEditor) return;
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const newMessage: GuestbookMessage = {
        id: `guest-${Date.now()}`,
        invitationId: 'current',
        senderName: senderName.trim(),
        relationship: 'Guest',
        message: message.trim(),
        isApproved: true,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [newMessage, ...prev]);
      setSenderName('');
      setMessage('');
      setHasSubmitted(true);
      setTimeout(() => setHasSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" style={{ color: primaryColor }} />
          <span className="font-bold text-sm tracking-wider uppercase font-serif">
            {content.text || 'Wishes & Guestbook'}
          </span>
        </div>
        <button
          type="button"
          onClick={isEditor ? undefined : onOpenModal}
          className="text-[10px] font-sans px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: primaryColor }}
        >
          View All ({messages.length})
        </button>
      </div>

      {/* Message Feed Preview */}
      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1">
        {messages.slice(0, 3).map((msg) => (
          <div
            key={msg.id}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950"
                  style={{ backgroundColor: primaryColor }}
                >
                  {msg.senderName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[130px]">
                  {msg.senderName}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed pl-6">
              "{msg.message}"
            </p>
          </div>
        ))}
      </div>

      {/* Inline Post Form */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 pt-2.5 space-y-2">
        {hasSubmitted ? (
          <div className="py-2 text-center text-emerald-400 text-xs font-sans font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Check className="w-4 h-4" />
            <span>Thank you for your heartfelt blessing!</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-1.5">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-400 font-sans focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Leave your warm wish..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-400 font-sans focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs font-sans text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-3 h-3" />
                  <span>Post</span>
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
