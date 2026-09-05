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
  Code,
  Printer,
  Send,
  Sparkles,
  Radio,
  EyeOff,
  Eye,
  Mail,
  Smartphone
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
  const [slugError, setSlugError] = useState('');
  const [slugSuccess, setSlugSuccess] = useState(false);
  const [statusToggling, setStatusToggling] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/#/i/${invitation.slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(publicUrl)}`;
  const embedCode = `<iframe src="${publicUrl}" width="420" height="780" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;

  const isPublished = invitation.status === 'published';

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2500);
  };

  const handleSaveSlug = async () => {
    const formatted = customSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!formatted) {
      setSlugError('Please enter a valid URL slug.');
      return;
    }

    if (formatted === invitation.slug) {
      setSlugError('');
      return;
    }

    setIsSavingSlug(true);
    setSlugError('');
    setSlugSuccess(false);

    try {
      await api.updateInvitation(invitation.id, { slug: formatted });
      onUpdateSlug(formatted);
      setCustomSlug(formatted);
      setSlugSuccess(true);
      setTimeout(() => setSlugSuccess(false), 3000);
    } catch (e: any) {
      setSlugError(e?.message || 'Failed to update URL slug. It may already be in use.');
    } finally {
      setIsSavingSlug(false);
    }
  };

  const handleTogglePublication = async (newStatus: 'draft' | 'published') => {
    setStatusToggling(true);
    try {
      await api.updateInvitation(invitation.id, { status: newStatus });
      onUpdateStatus(newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setStatusToggling(false);
    }
  };

  const coupleOrEvent = invitation?.openingScreen?.coupleNames || invitation?.title || 'Our Celebration';
  const eventDate = invitation?.eventDate || invitation?.openingScreen?.subtitle || 'Upcoming Date';

  // 1. WhatsApp share
  const handleWhatsAppShare = () => {
    const text = `✨ *You're warmly invited!* ✨\n\n💍 *${coupleOrEvent}*\n📅 ${eventDate}\n\nPlease click the link below to open our interactive digital invitation, view the countdown, venue map, and RSVP:\n\n${publicUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 2. Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: invitation.title,
          text: `You're invited to ${coupleOrEvent}! Open the digital invitation:`,
          url: publicUrl
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopy();
    }
  };

  // 3. Social Media Sharing Links
  const shareTwitter = () => {
    const text = `You're invited to ${coupleOrEvent}! View the digital invitation:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(publicUrl)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, '_blank');
  };

  const shareTelegram = () => {
    const text = `You're invited to ${coupleOrEvent}!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = `Invitation: ${coupleOrEvent}`;
    const body = `Hi,\n\nYou are cordially invited to celebrate ${coupleOrEvent} on ${eventDate}.\n\nPlease view the full interactive digital invitation and submit your RSVP here:\n${publicUrl}\n\nWarm regards!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${invitation.title}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90vh; text-align: center; margin: 0; }
            h1 { font-size: 24px; margin-bottom: 8px; color: #111; }
            p { font-size: 14px; color: #555; margin-bottom: 24px; max-width: 400px; }
            img { width: 280px; height: 280px; border: 1px solid #ddd; padding: 12px; border-radius: 12px; }
            .url { font-family: monospace; font-size: 12px; color: #333; margin-top: 16px; word-break: break-all; }
          </style>
        </head>
        <body>
          <h1>${coupleOrEvent}</h1>
          <p>Scan the QR code with your smartphone camera to view the interactive invitation.</p>
          <img src="${qrCodeUrl}" alt="Invitation QR Code" />
          <div class="url">${publicUrl}</div>
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Digital Publishing & Distribution
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            Publish & Share Invitation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate custom links, QR codes, and 1-click WhatsApp messages for your guests
          </p>
        </div>

        <div className="space-y-5">
          {/* 1. Publication Status Switch */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isPublished
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${
                  isPublished
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-amber-500 text-white border-amber-600 shadow-sm'
                }`}>
                  {isPublished ? <Globe className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {isPublished ? 'Invitation is Live (Published)' : 'Invitation is in Draft Mode'}
                    </span>
                    <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      isPublished
                        ? 'bg-emerald-200/80 text-emerald-900'
                        : 'bg-amber-200/80 text-amber-900'
                    }`}>
                      {invitation.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {isPublished
                      ? 'Accessible worldwide via your custom share link. Guests can open, view animations, and submit RSVPs.'
                      : 'Only visible inside your studio editor and private previews. Public viewers will see a draft notice.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {isPublished ? (
                  <button
                    type="button"
                    disabled={statusToggling}
                    onClick={() => handleTogglePublication('draft')}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    Unpublish to Draft
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={statusToggling}
                    onClick={() => handleTogglePublication('published')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Publish Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Custom Link / URL Slug Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Custom Invitation URL Slug</span>
              </label>
              <span className="text-[10px] text-slate-400">e.g. rahul-priya-wedding</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 focus-within:border-slate-800 focus-within:bg-white transition-colors">
                <span className="text-slate-400 font-mono select-none">.../#/i/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => {
                    setCustomSlug(e.target.value);
                    setSlugError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveSlug();
                  }}
                  className="bg-transparent text-slate-900 font-mono font-semibold focus:outline-none flex-1 ml-1"
                  placeholder="custom-event-slug"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSlug}
                disabled={isSavingSlug || !customSlug.trim() || customSlug.trim().toLowerCase() === invitation.slug}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer flex-shrink-0"
              >
                {isSavingSlug ? 'Saving...' : 'Update Slug'}
              </button>
            </div>

            {slugError && (
              <p className="text-[11px] text-rose-600 font-medium">{slugError}</p>
            )}
            {slugSuccess && (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>URL slug successfully updated and ready to share!</span>
              </p>
            )}
          </div>

          {/* 3. Direct Link Share & Copy */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Shareable Invitation Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                title="Open live invitation in new tab"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 4. WhatsApp 1-Click Action & Message Card Preview */}
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp 1-Click Instant Share</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Instant Preview
                </span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-2xs space-y-2 text-left">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex-shrink-0 flex items-center justify-center border border-slate-200 text-xl shadow-xs">
                    💌
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {coupleOrEvent}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {eventDate} • Digital Invitation
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono truncate">
                      {window.location.host}/#/i/{invitation.slug}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic border-t border-slate-100 pt-2 leading-relaxed">
                  "You're warmly invited to {coupleOrEvent}! Tap the link to view the interactive invitation, countdown, venue map, and RSVP."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-all border border-slate-200 shadow-2xs cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Native Share Menu</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 5. Social Media Sharing Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">Share on Social Channels</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={shareTwitter}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                <span>X / Twitter</span>
              </button>
              <button
                type="button"
                onClick={shareFacebook}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                <span>Facebook</span>
              </button>
              <button
                type="button"
                onClick={shareTelegram}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                <span>Telegram</span>
              </button>
              <button
                type="button"
                onClick={shareEmail}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* 6. QR Code Section with Print and Download */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-200 shrink-0">
              <img src={qrCodeUrl} alt="Invitation QR Code" className="w-28 h-28 object-contain" />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode className="w-4 h-4 text-slate-700" />
                <span>Physical Print & Scan QR Code</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download and print this high-resolution QR code on wedding cards, save-the-date cards, banquet tables, or entrance signage.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <a
                  href={qrCodeUrl}
                  download={`qr-${invitation.slug}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download PNG</span>
                </a>
                <button
                  type="button"
                  onClick={handlePrintQR}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print QR Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* 7. Iframe Embed Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-slate-600" />
                <span>Embed on Website or Blog</span>
              </label>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="text-[11px] text-slate-900 hover:underline font-bold cursor-pointer"
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
