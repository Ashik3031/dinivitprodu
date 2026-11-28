import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Invitation,
  ViewportMode
} from '../../types';
import { InvitationPageRenderer } from '../canvas/InvitationPageRenderer';
import { OpeningEnvelopeScreen } from './OpeningEnvelopeScreen';
import { FloatingMusicPlayer } from './FloatingMusicPlayer';
import { RSVPModal } from './RSVPModal';
import { GuestbookModal } from './GuestbookModal';
import {
  Smartphone,
  Tablet,
  Monitor,
  Share2,
  Play,
  Pause,
  Maximize2
} from 'lucide-react';
import {
  getPageTransitionVariants,
  getPageLogicalDimensions
} from '../../utils/responsiveUtils';
import {
  getDeviceViewportMode,
  calculatePageScale
} from '../../utils/canvasScaleUtils';
import { OuterDropParticles } from '../canvas/OuterDropParticles';
import { useAutoScroll } from '../../hooks/useAutoScroll';

interface PublishedInvitationViewProps {
  invitation: Invitation;
  isLiveViewer?: boolean;
  forcedViewportMode?: ViewportMode;
  showPreviewControls?: boolean;
}

type PreviewSimulationWidth = 'auto' | 390 | 768 | 1280;

export const PublishedInvitationView: React.FC<PublishedInvitationViewProps> = ({
  invitation,
  isLiveViewer = false,
  showPreviewControls = false
}) => {
  const [showOpeningScreen, setShowOpeningScreen] = useState(
    !!invitation.openingScreen?.enabled
  );
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [, setActivePageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 390
  );
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 844
  );

  // Preview width simulator for Editor Preview only (never alters logical canvas coordinates)
  const [previewWidth, setPreviewWidth] = useState<PreviewSimulationWidth>('auto');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showPreviewBar = !isLiveViewer || showPreviewControls;
  const effectiveContainerWidth =
    showPreviewBar && previewWidth !== 'auto'
      ? Math.min(windowWidth, previewWidth)
      : windowWidth;

  const effectiveContainerHeight = showPreviewBar
    ? Math.max(360, windowHeight - 108)
    : windowHeight;

  const deviceMode: ViewportMode = getDeviceViewportMode(effectiveContainerWidth);

  const pages = invitation.pages || [];
  const settings = invitation.settings || {};
  const theme = invitation.theme || {
    primaryColor: '#d4af37',
    secondaryColor: '#0a3d2c',
    backgroundColor: '#f8fafc',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Montserrat', sans-serif"
  };

  // Track active page index & scroll offset for parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrollY(scrollPos);

      pages.forEach((_page, idx) => {
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
    const clamped = Math.max(0, Math.min(pages.length - 1, idx));
    const el = document.getElementById(`page-${clamped}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `✨ You're warmly invited to our celebration!\n\n${invitation.title}\n\nPlease click the link below to open our digital invitation and RSVP:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const outerBg =
    invitation.openingScreen?.outerBackgroundColor ||
    theme?.outerBackgroundColor ||
    '#0a0a0a';
  const showOuterDrops =
    (invitation.openingScreen?.showOuterDrops || theme?.showOuterDrops) &&
    invitation.openingScreen?.outerDropEffect !== 'none' &&
    theme?.outerDropEffect !== 'none';
  const outerDropEffect =
    invitation.openingScreen?.outerDropEffect || theme?.outerDropEffect || 'hearts';
  const outerDropColor =
    invitation.openingScreen?.outerDropColor || theme?.outerDropColor || '#f43f5e';

  const isCoverActive =
    showOpeningScreen &&
    !!invitation.openingScreen &&
    invitation.openingScreen.enabled !== false;

  // Auto-Scroll integration (smooth vertical scrolling through multi-page invitations)
  const autoScrollEnabled = Boolean(settings.enableAutoScroll) && pages.length > 0;
  const {
    isAutoScrolling,
    hasReachedEnd,
    toggle: toggleAutoScroll
  } = useAutoScroll({
    enabled: autoScrollEnabled,
    speedPxPerSec: settings.autoScrollSpeed || 30,
    initialDelaySeconds: settings.autoScrollDelay ?? 2,
    isBlocked: isCoverActive || isRSVPOpen || isGuestbookOpen,
    containerRef
  });

  const isWideFrame = effectiveContainerWidth >= 640;

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-neutral-100 flex flex-col items-center justify-start select-none relative overflow-x-hidden font-sans transition-colors duration-300"
      style={{ backgroundColor: outerBg }}
    >
      {/* Outer Floating Drops / Heart particles (outside invitation frame) */}
      {showOuterDrops && (
        <OuterDropParticles
          active={true}
          color={outerDropColor}
          effect={outerDropEffect}
        />
      )}

      {/* Preview Bar (Editor Preview only — hidden on public URLs) */}
      {showPreviewBar && (
        <div className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 text-xs shadow-md">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-slate-400 text-xs hidden sm:inline">Preview:</span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {[
                { id: 'auto' as PreviewSimulationWidth, label: 'Auto Fit', icon: Maximize2 },
                { id: 1280 as PreviewSimulationWidth, label: 'Desktop', icon: Monitor },
                { id: 768 as PreviewSimulationWidth, label: 'Tablet', icon: Tablet },
                { id: 390 as PreviewSimulationWidth, label: 'Mobile', icon: Smartphone }
              ].map((opt) => {
                const Icon = opt.icon;
                const active = previewWidth === opt.id;
                return (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setPreviewWidth(opt.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
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
            <div className="text-[11px] text-emerald-400 font-medium items-center gap-1 hidden md:flex">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Responsive Auto-Scaled</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Audio Soundtrack - Shown & played after opening */}
      {invitation.music && invitation.music.enabled !== false && !showOpeningScreen && (
        <FloatingMusicPlayer
          config={invitation.music}
          autoPlayTriggered={hasStartedAudio}
          theme={theme}
        />
      )}

      {/* Minimal Auto-Scroll Pause/Resume Control (only when Auto Scroll is enabled) */}
      {!isCoverActive && autoScrollEnabled && (
        <button
          type="button"
          data-autoscroll-control="true"
          onClick={toggleAutoScroll}
          title={
            isAutoScrolling
              ? 'Pause automatic scrolling'
              : hasReachedEnd
                ? 'Replay automatic scrolling from top'
                : 'Resume automatic scrolling'
          }
          className={`fixed bottom-7 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/70 hover:bg-black/85 text-white/95 border border-white/20 backdrop-blur-md text-[11px] font-semibold shadow-xl transition-all cursor-pointer active:scale-95 ${
            invitation.music && invitation.music.enabled !== false
              ? 'right-22'
              : 'right-6'
          }`}
        >
          {isAutoScrolling ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{hasReachedEnd ? 'Replay' : 'Auto Scroll'}</span>
            </>
          )}
        </button>
      )}

      {/* Opening Screen Stage */}
      {isCoverActive ? (
        <div
          className={`w-full ${
            showPreviewBar ? 'min-h-[calc(100vh-52px)] flex-1' : 'min-h-screen h-screen'
          } flex items-center justify-center relative overflow-hidden select-none`}
        >
          <AnimatePresence>
            <OpeningEnvelopeScreen
              config={invitation.openingScreen}
              theme={theme}
              defaultTitle={invitation.title}
              defaultDate={invitation.eventDate}
              onOpen={handleOpenInvitation}
              isContained={true}
              activeViewport={deviceMode}
              availableWidth={effectiveContainerWidth}
              availableHeight={effectiveContainerHeight}
            />
          </AnimatePresence>
        </div>
      ) : (
        /* Main Invitation Stream (Centered Portrait / Aspect-Preserved Pages) */
        <div
          className={`relative flex flex-col items-center justify-start transition-all duration-300 max-w-full ${
            isWideFrame
              ? 'my-6 shadow-2xl rounded-3xl border border-neutral-800/80 overflow-hidden'
              : 'w-full'
          }`}
        >
          {pages.map((page, index) => {
            const { width: designWidth, height: designHeight } = getPageLogicalDimensions(page, {
              isOpeningScreen: false,
              deviceMode
            });

            const pageScaleMetrics = calculatePageScale({
              designWidth,
              designHeight,
              containerWidth: effectiveContainerWidth
            });

            const transitionType = page.transition?.type || 'fade';
            const transitionDuration = page.transition?.duration || 0.6;
            const pageTransition = getPageTransitionVariants(transitionType, transitionDuration);

            const filterElement = (el: any) => {
              if (el.type === 'countdown' && settings.enableCountdown === false) return false;
              if (el.type === 'calendar' && settings.enableCalendar === false) return false;
              if ((el.type === 'google-maps' || el.type === 'venue') && settings.enableMap === false) return false;
              if (el.type === 'timeline' && settings.enableTimeline === false) return false;
              if (el.type === 'photo-gallery' && settings.enableGallery === false) return false;
              if (
                el.type === 'guestbook' &&
                (settings.enableGuestbook === false || settings.allowGuestComments === false)
              ) {
                return false;
              }
              if (
                el.type === 'rsvp-form' &&
                (settings.enableRSVP === false || settings.allowRSVP === false)
              ) {
                return false;
              }
              return true;
            };

            return (
              <motion.section
                key={page.id}
                id={`page-${index}`}
                className="relative overflow-hidden flex justify-center items-start shrink-0"
                initial={pageTransition.initial}
                whileInView={pageTransition.animate}
                viewport={{ once: true, amount: 0.1 }}
                style={{
                  width: `${pageScaleMetrics.scaledWidth}px`,
                  height: `${pageScaleMetrics.scaledHeight}px`
                }}
              >
                <InvitationPageRenderer
                  page={page}
                  scale={pageScaleMetrics.scale}
                  deviceMode={deviceMode}
                  fallbackBgColor={theme.backgroundColor || '#f8fafc'}
                  scrollY={scrollY}
                  pageIndex={index}
                  filterElement={filterElement}
                  onOpenRSVP={() => setIsRSVPOpen(true)}
                  onOpenGuestbook={() => setIsGuestbookOpen(true)}
                  onActionClick={(actionType) => {
                    if (actionType === 'next-page') scrollToPage(index + 1);
                    if (actionType === 'previous-page') scrollToPage(index - 1);
                    if (actionType === 'open-invitation') setShowOpeningScreen(false);
                  }}
                />
              </motion.section>
            );
          })}
        </div>
      )}

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
