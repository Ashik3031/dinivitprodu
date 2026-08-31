import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GuestbookMessage } from '../../types';
import { MessageSquare, X, Send, Heart, User, Clock } from 'lucide-react';

interface GuestbookModalProps {
  invitationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const GuestbookModal: React.FC<GuestbookModalProps> = ({ invitationId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getGuestbook(invitationId).then(res => {
        setMessages(res.messages || []);
      }).catch(() => {});
    }
  }, [isOpen, invitationId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitGuestbook({
        invitationId,
        senderName,
        relationship,
        message
      });

      if (res.message) {
        setMessages(prev => [res.message, ...prev]);
        setMessage('');
        setSenderName('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Wishes & Blessings
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Guestbook Board
          </h3>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No messages posted yet. Be the first to leave warm blessings!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                      {msg.relationship}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  "{msg.message}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="border-t border-slate-200 pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 placeholder-slate-400"
            />
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800"
            >
              <option value="Family">Family Member</option>
              <option value="Close Friend">Close Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Write your blessing or message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
