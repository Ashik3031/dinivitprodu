import React, { useState } from 'react';
import { Invitation } from '../../types';
import { api } from '../../services/api';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Globe,
  MessageCircle,
  ExternalLink,
  Download,
  Code
} from 'lucide-react';

interface ShareModalProps {
  invitation: Invitation;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSlug: (slug: string) => void;
  onUpdateStatus: (status: 'draft' | 'published') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  invitation,
  isOpen,
  onClose,
  onUpdateSlug,
  onUpdateStatus
}) => {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [customSlug, setCustomSlug] = useState(invitation.slug);
  const [isSavingSlug, setIsSavingSlug] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/#/i/${invitation.slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;
  const embedCode = `<iframe src="${publicUrl}" width="420" height="780" frameborder="0" allow="autoplay"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const handleSaveSlug = async () => {
    if (!customSlug.trim() || customSlug === invitation.slug) return;
    setIsSavingSlug(true);
    try {
      await api.updateInvitation(invitation.id, { slug: customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') });
      onUpdateSlug(customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingSlug(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `You are cordially invited to ${invitation.title}!\n\nView full digital invitation here:\n${publicUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Digital Distribution
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            Publish & Share Invitation
          </h3>
        </div>

        <div className="space-y-5">
          {/* Status Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">Publication Status</div>
              <div className="text-[11px] text-slate-500">
                {invitation.status === 'published'
                  ? 'Your invitation is live and accessible by anyone with the link'
                  : 'Invitation is in draft mode'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateStatus(invitation.status === 'published' ? 'draft' : 'published')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                invitation.status === 'published'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {invitation.status === 'published' ? 'Live (Published)' : 'Draft'}
            </button>
          </div>

          {/* Custom Link / Slug */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Custom Invitation URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 overflow-hidden">
                <span className="text-slate-400 select-none">.../i/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="bg-transparent text-slate-900 font-mono font-medium focus:outline-none flex-1 ml-1"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveSlug}
                disabled={isSavingSlug || customSlug === invitation.slug}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Direct Link Share & Copy */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Shareable Web Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp 1-Click Action & Live Card Preview */}
          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Message Preview</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Mobile-First
                </span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-2xs space-y-2">
                <div className="flex gap-2.5">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200">
                    <span className="text-lg">💌</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {invitation.title}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {invitation.theme?.primaryColor ? 'Interactive Digital Invitation' : 'You are cordially invited'}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">
                      {window.location.host}/#/i/{invitation.slug}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 italic border-t border-slate-100 pt-1.5 leading-relaxed">
                  "You are cordially invited to {invitation.title}! Tap the link to view the interactive invitation, countdown, venue map, and RSVP."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>

                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                  <span>Open Preview</span>
                </a>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
              <img src={qrCodeUrl} alt="Invitation QR Code" className="w-24 h-24" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">Scan & Print QR Code</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download and print this high-resolution QR code on your physical wedding cards, envelopes, or thank you tags.
              </p>
              <a
                href={qrCodeUrl}
                download="invitation-qr-code.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR Code Image</span>
              </a>
            </div>
          </div>

          {/* Iframe Embed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Embed on Website / Blog</label>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="text-[11px] text-slate-900 hover:underline font-semibold"
              >
                {embedCopied ? 'Copied Embed Code!' : 'Copy Embed Code'}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={embedCode}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-600 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
