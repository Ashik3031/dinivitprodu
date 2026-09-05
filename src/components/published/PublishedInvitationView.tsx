import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Invitation,
  InvitationPage,
  ElementStyle,
  ViewportMode
} from '../../types';
import { ElementRenderer } from '../canvas/ElementRenderer';
import { OpeningEnvelopeScreen } from './OpeningEnvelopeScreen';
import { FloatingMusicPlayer } from './FloatingMusicPlayer';
import { RSVPModal } from './RSVPModal';
import { GuestbookModal } from './GuestbookModal';
import {
  Smartphone,
  Tablet,
  Monitor,
  Heart,
  Calendar,
  Send,
  MessageSquare,
  Sparkles,
  Share2,
  Check,
  ChevronDown
} from 'lucide-react';
import { resolveElementForViewport, getPageTransitionVariants, CANVAS_BREAKPOINTS } from '../../utils/responsiveUtils';

interface PublishedInvitationViewProps {
  invitation: Invitation;
  isLiveViewer?: boolean;
  forcedViewportMode?: ViewportMode;
  showPreviewControls?: boolean;
}

export const PublishedInvitationView: React.FC<PublishedInvitationViewProps> = ({
  invitation,
  isLiveViewer = false,
  forcedViewportMode,
  showPreviewControls = false
}) => {
  const [showOpeningScreen, setShowOpeningScreen] = useState(
    !!invitation.openingScreen?.enabled
  );
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 390
  );

  // Viewport mode for interactive preview bar
  const [previewViewport, setPreviewViewport] = useState<ViewportMode>(
    forcedViewportMode || 'mobile'
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forcedViewportMode) {
      setPreviewViewport(forcedViewportMode);
    }
  }, [forcedViewportMode]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine active viewport mode: if in preview/forced mode use that, otherwise detect screen width
  const activeViewport: ViewportMode = forcedViewportMode
    ? previewViewport
    : !isLiveViewer || showPreviewControls
    ? previewViewport
    : windowWidth >= 1024
    ? 'desktop'
    : windowWidth >= 768
    ? 'tablet'
    : 'mobile';

  const pages = invitation.pages || [];
  const settings = invitation.settings || {};
  const theme = invitation.theme || {
    primaryColor: '#d4af37',
    secondaryColor: '#0a3d2c',
    backgroundColor: '#071912',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Montserrat', sans-serif"
  };

  // Scroll listener for active page index & parallax calculations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrollY(scrollPos);

      // Determine active page
      pages.forEach((page, idx) => {
        const el = document.getElementById(`page-${idx}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActivePageIndex(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pages]);

  const handleOpenInvitation = () => {
    setShowOpeningScreen(false);
    setHasStartedAudio(true);
  };

  const scrollToPage = (idx: number) => {
    const el = document.getElementById(`page-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPageBgStyle = (page: InvitationPage) => {
    const bg = page.background;
    if (!bg) return { backgroundColor: theme.backgroundColor || '#071912' };

    switch (bg.type) {
      case 'color':
        return { backgroundColor: bg.color || '#071912' };
      case 'gradient':
        if (bg.gradient) {
          const colors = bg.gradient.colors.join(', ');
          const angle = bg.gradient.angle ?? 180;
          return {
            background:
              bg.gradient.type === 'radial'
                ? `radial-gradient(circle, ${colors})`
                : `linear-gradient(${angle}deg, ${colors})`
          };
        }
        return { backgroundColor: bg.color || '#071912' };
      case 'image':
        return {
          backgroundImage: `url(${bg.imageUrl})`,
          backgroundSize: bg.size || 'cover',
          backgroundPosition: bg.position || 'center',
          backgroundRepeat: bg.repeat || 'no-repeat'
        };
      case 'video':
        return { backgroundColor: '#071912' };
      default:
        return { backgroundColor: '#071912' };
    }
  };

  // Container width based on viewport
  const targetCanvasWidth = CANVAS_BREAKPOINTS[activeViewport].width;

  // Compute mobile auto-fit scale if device is narrower than target canvas width
  const isMobileScreen = windowWidth < 440;
  const isPhoneWidth = windowWidth < targetCanvasWidth;

  const contentScale = (activeViewport === 'mobile' && isMobileScreen)
    ? windowWidth / 390
    : isPhoneWidth
    ? Math.min(1, (windowWidth - (isLiveViewer ? 0 : 24)) / targetCanvasWidth)
    : 1;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `✨ You're warmly invited to our celebration!\n\n${invitation.title}\n\nPlease click the link below to open our digital invitation and RSVP:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const getPageCalculatedHeight = (page: InvitationPage) => {
    if (page.heightMode === 'viewport' || page.isFullHeight) {
      return typeof window !== 'undefined' ? window.innerHeight : 844;
    }
    if (page.heightMode === 'auto') {
      const maxBottom = (page.elements || []).reduce((max, el) => {
        const { style: s } = resolveElementForViewport(el, activeViewport);
        return Math.max(max, (s.y || 0) + (s.height || 40));
      }, 0);
      return Math.max(page.height || 844, maxBottom + 60);
    }
    return page.height || 844;
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start select-none relative overflow-x-hidden font-sans scroll-smooth"
    >
      {/* Interactive Preview Bar for toggling [ Desktop ] [ Tablet ] [ Mobile ] in preview mode */}
      {(!isLiveViewer || showPreviewControls) && (
        <div className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 text-xs shadow-md">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-slate-400 text-xs hidden sm:inline">Preview Mode:</span>
            {/* [ Desktop ] [ Tablet ] [ Mobile ] preview controls */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewport === 'desktop'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (960px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewport === 'tablet'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet (768px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewport === 'mobile'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (390px)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              title="Test WhatsApp Invitation Share"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>Share WhatsApp</span>
            </button>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 hidden md:flex">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mobile-First Optimized</span>
            </div>
          </div>
        </div>
      )}

      {/* Opening Envelope Screen if enabled */}
      {showOpeningScreen && invitation.openingScreen && (
        <OpeningEnvelopeScreen
          config={invitation.openingScreen}
          theme={theme}
          defaultTitle={invitation.title}
          defaultDate={invitation.eventDate}
          onOpen={handleOpenInvitation}
        />
      )}

      {/* Floating Audio Soundtrack */}
      {invitation.music && (
        <FloatingMusicPlayer
          config={invitation.music}
          autoPlayTriggered={hasStartedAudio}
        />
      )}

      {/* Quick Action Floating Bar for RSVP & Guestbook (Mobile-First Touch Optimized) */}
      {((settings.enableRSVP !== false && settings.allowRSVP !== false) ||
        (settings.enableGuestbook !== false && settings.allowGuestComments !== false)) && (
        <div className="fixed bottom-5 left-4 sm:left-6 z-40 flex items-center gap-2">
          {settings.enableRSVP !== false && settings.allowRSVP !== false && (
            <button
              type="button"
              onClick={() => setIsRSVPOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xl transition-all active:scale-95 cursor-pointer border border-slate-700/60 hover:shadow-amber-500/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>RSVP</span>
            </button>
          )}

          {settings.enableGuestbook !== false && settings.allowGuestComments !== false && (
            <button
              type="button"
              onClick={() => setIsGuestbookOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-white/95 hover:bg-white text-slate-800 border border-slate-200 font-bold text-xs shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
              <span>Wishes</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Smooth Navigation Dots */}
      {pages.length > 1 && (
        <div className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-xl">
          {pages.map((page, idx) => (
            <button
              key={page.id}
              type="button"
              title={page.name || `Page ${idx + 1}`}
              onClick={() => scrollToPage(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                activePageIndex === idx
                  ? 'bg-amber-400 scale-125 shadow-sm shadow-amber-400'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Main Invitation Stream (Vertical Pages) */}
      <div
        className={`flex flex-col items-center justify-start transition-all duration-300 ${
          activeViewport === 'mobile' && !isMobileScreen
            ? 'w-[390px] my-6 shadow-2xl rounded-3xl border border-neutral-800 overflow-hidden'
            : activeViewport === 'tablet' && windowWidth >= 768
            ? 'w-[768px] my-6 shadow-2xl rounded-3xl border border-neutral-800 overflow-hidden'
            : activeViewport === 'desktop' && windowWidth >= 960
            ? 'w-[960px] my-6 shadow-2xl rounded-3xl border border-neutral-800 overflow-hidden'
            : 'w-full'
        }`}
      >
        {pages.map((page, index) => {
          const topLevelElements = (page.elements || []).filter((el) => {
            if (el.parentContainerId || el.isHidden) return false;
            // Check responsive visibility
            const { isHidden } = resolveElementForViewport(el, activeViewport);
            if (isHidden) return false;

            // Respect owner feature flags
            if (el.type === 'countdown' && settings.enableCountdown === false) return false;
            if (el.type === 'calendar' && settings.enableCalendar === false) return false;
            if ((el.type === 'google-maps' || el.type === 'venue') && settings.enableMap === false) return false;
            if (el.type === 'timeline' && settings.enableTimeline === false) return false;
            if (el.type === 'photo-gallery' && settings.enableGallery === false) return false;
            if (
              el.type === 'guestbook' &&
              (settings.enableGuestbook === false || settings.allowGuestComments === false)
            )
              return false;
            if (
              el.type === 'rsvp-form' &&
              (settings.enableRSVP === false || settings.allowRSVP === false)
            )
              return false;
            return true;
          });

          const canvasHeight = getPageCalculatedHeight(page);
          const scaledHeight = contentScale !== 1 ? Math.round(canvasHeight * contentScale) : canvasHeight;

          const transitionType = page.transition?.type || 'fade';
          const transitionDuration = page.transition?.duration || 0.6;
          const pageTransition = getPageTransitionVariants(transitionType, transitionDuration);

          return (
            <motion.section
              key={page.id}
              id={`page-${index}`}
              className="relative w-full overflow-hidden flex justify-center items-center flex-shrink-0"
              initial={pageTransition.initial}
              whileInView={pageTransition.animate}
              viewport={{ once: true, margin: '-50px' }}
              style={{
                height: `${scaledHeight}px`,
                minHeight: `${scaledHeight}px`
              }}
            >
              {/* Inner Exact-Dimension Design Canvas */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: `${targetCanvasWidth}px`,
                  height: `${canvasHeight}px`,
                  transform: contentScale !== 1 ? `scale(${contentScale})` : undefined,
                  transformOrigin: 'top center',
                  ...getPageBgStyle(page)
                }}
              >
                {/* Background Video if present */}
                {page.background?.type === 'video' && page.background.videoUrl && (
                  <video
                    src={page.background.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                  />
                )}

                {/* Elements */}
                {topLevelElements.map((element) => {
                  const { style: resolvedStyle } = resolveElementForViewport(element, activeViewport);

                  // Calculate Parallax Offset if enabled
                  let parallaxTransform = '';
                  if (element.animation?.parallax?.enabled) {
                    const pSpeed = element.animation.parallax.speed || 0.2;
                    const pOffset = (scrollY - index * 800) * pSpeed * 0.15;
                    if (element.animation.parallax.direction === 'horizontal') {
                      parallaxTransform = `translateX(${pOffset}px) `;
                    } else {
                      parallaxTransform = `translateY(${pOffset}px) `;
                    }
                  }

                  const rotationTransform = resolvedStyle.rotation
                    ? `rotate(${resolvedStyle.rotation}deg)`
                    : '';

                  return (
                    <div
                      key={element.id}
                      className="absolute"
                      style={{
                        left: `${resolvedStyle.x}px`,
                        top: `${resolvedStyle.y}px`,
                        width: `${resolvedStyle.width}px`,
                        height: `${resolvedStyle.height}px`,
                        transform: `${parallaxTransform}${rotationTransform}`.trim() || undefined,
                        zIndex: resolvedStyle.zIndex || 1,
                        willChange: element.animation?.parallax?.enabled ? 'transform' : undefined
                      }}
                    >
                      <ElementRenderer
                        element={element}
                        viewportMode={activeViewport}
                        isEditor={false}
                        onOpenRSVP={() => setIsRSVPOpen(true)}
                        onOpenGuestbook={() => setIsGuestbookOpen(true)}
                        allElements={page.elements}
                      />
                    </div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* RSVP Modal */}
      {isRSVPOpen && (
        <RSVPModal
          invitationId={invitation.id}
          isOpen={isRSVPOpen}
          onClose={() => setIsRSVPOpen(false)}
          theme={theme}
        />
      )}

      {/* Guestbook Wishes Modal */}
      {isGuestbookOpen && (
        <GuestbookModal
          invitationId={invitation.id}
          isOpen={isGuestbookOpen}
          onClose={() => setIsGuestbookOpen(false)}
          theme={theme}
        />
      )}
    </div>
  );
};
