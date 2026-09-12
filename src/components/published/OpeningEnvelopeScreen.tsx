import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  OpeningScreenConfig,
  InvitationTheme,
  OpeningCoverType,
  VideoPlayMode,
  ImageTransitionEffect,
  ImageAdvanceTrigger
} from '../../types';
import { Play, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { ElementRenderer } from '../canvas/ElementRenderer';
import { resolveElementForViewport } from '../../utils/responsiveUtils';
import { getOrCreateOpeningScreenPage } from '../../utils/openingScreenUtils';

interface OpeningEnvelopeScreenProps {
  config?: OpeningScreenConfig;
  openingScreen?: OpeningScreenConfig;
  theme?: Partial<InvitationTheme>;
  defaultTitle?: string;
  defaultDate?: string;
  onOpen?: () => void;
  onOpenComplete?: () => void;
  isContained?: boolean;
}

export const OpeningEnvelopeScreen: React.FC<OpeningEnvelopeScreenProps> = ({
  config: propConfig,
  openingScreen,
  theme,
  defaultTitle,
  defaultDate,
  onOpen,
  onOpenComplete,
  isContained = false
}) => {
  const config = propConfig || openingScreen || {
    enabled: true,
    style: 'envelope',
    title: 'Wedding Invitation',
    subtitle: 'December 2026',
    coupleNames: 'Alexander & Sophia',
    envelopeColor: '#0e261d',
    sealColor: '#d4af37',
    openButtonText: 'Open Invitation'
  };

  const handleOpenCallback = onOpen || onOpenComplete || (() => {});
  const [isOpening, setIsOpening] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [, setTimerProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(config.videoMuted !== false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Obtain effective canvas page (WYSIWYG: what's on the canvas is what's in preview)
  const effectiveTheme = (theme || {}) as InvitationTheme;
  const page = config.page || getOrCreateOpeningScreenPage({
    openingScreen: config,
    theme: effectiveTheme,
    title: defaultTitle,
    eventDate: defaultDate
  });

  const pageBg = page.background || config.background;
  const elements = page.elements || [];
  const topLevelElements = elements.filter((el) => !el.parentContainerId && !el.parentId && !el.isHidden);
  const hasButtonOnCanvas = elements.some(
    (el) => el.id === 'open-elem-button' || el.type === 'button'
  );

  // Determine cover type
  const coverType: OpeningCoverType =
    config.coverType ||
    (config.videoUrl || config.style === 'video-cover' || pageBg?.type === 'video'
      ? 'video'
      : config.imageUrl || config.style === 'card-flip' || pageBg?.type === 'image'
      ? 'image'
      : config.style === 'custom-page'
      ? 'custom-page'
      : 'envelope');

  const videoPlayMode: VideoPlayMode = config.videoPlayMode || 'autoplay';
  const imageTransition: ImageTransitionEffect = config.imageTransitionEffect || 'zoom-fade';
  const imageTrigger: ImageAdvanceTrigger = config.imageAdvanceTrigger || 'click-button';

  const triggerOpen = (immediate = false) => {
    if (isOpening) return;
    setIsOpening(true);

    if (config.showConfetti !== false) {
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: [theme?.primaryColor || config.sealColor || '#d4af37', '#ffffff', '#fbbf24', '#f43f5e', '#38bdf8']
        });
      } catch (e) {}
    }

    const delay = immediate ? 350 : 850;
    setTimeout(() => {
      handleOpenCallback();
    }, delay);
  };

  // ========================== VIDEO PLAYBACK LOGIC ==========================
  useEffect(() => {
    if (coverType !== 'video' && pageBg?.type !== 'video') return;

    if (videoPlayMode === 'autoplay' && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        // Autoplay policy might require mute
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
        }
      });
    }
  }, [coverType, videoPlayMode, pageBg?.type]);

  // Video time update & auto-advance
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setVideoProgress((current / duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    if (config.videoAutoAdvanceOnEnd !== false) {
      triggerOpen();
    }
  };

  const handleManualVideoPlay = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.play().then(() => {
      setIsVideoPlaying(true);
    }).catch((err) => {
      console.warn('Video play error:', err);
    });
  };

  // Fallback timer for autoplay if video doesn't end or loops
  useEffect(() => {
    if (coverType === 'video' && videoPlayMode === 'autoplay' && config.videoAutoAdvanceOnEnd !== false) {
      const fallbackDuration = (config.videoDurationSeconds || 8) * 1000;
      const timer = setTimeout(() => {
        if (!isOpening) {
          triggerOpen();
        }
      }, fallbackDuration);
      return () => clearTimeout(timer);
    }
  }, [coverType, videoPlayMode, config.videoAutoAdvanceOnEnd, isOpening, config.videoDurationSeconds]);

  // ========================== IMAGE AUTO-TIMER LOGIC ==========================
  useEffect(() => {
    if (coverType === 'image' && imageTrigger === 'auto-timer') {
      const totalSeconds = config.imageTimerSeconds || 3.5;
      const intervalMs = 50;
      const step = (intervalMs / (totalSeconds * 1000)) * 100;

      const interval = setInterval(() => {
        setTimerProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerOpen();
            return 100;
          }
          return prev + step;
        });
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [coverType, imageTrigger, config.imageTimerSeconds]);

  // ========================== SCROLL & TOUCH GESTURE LOGIC ==========================
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    // Swipe up detected (> 50px)
    if (deltaY > 50) {
      if (
        (coverType === 'video' && videoPlayMode === 'scroll-based') ||
        (coverType === 'image' && imageTrigger === 'scroll-swipe') ||
        coverType === 'envelope'
      ) {
        triggerOpen();
      }
    }
    touchStartY.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30) {
      if (
        (coverType === 'video' && videoPlayMode === 'scroll-based') ||
        (coverType === 'image' && imageTrigger === 'scroll-swipe') ||
        coverType === 'envelope'
      ) {
        triggerOpen();
      }
    }
  };

  // Check if click anywhere trigger is active (or if there is no explicit button on canvas)
  const handleContainerClick = () => {
    if (
      !hasButtonOnCanvas ||
      (coverType === 'image' && imageTrigger === 'click-anywhere') ||
      coverType === 'envelope'
    ) {
      triggerOpen();
    }
  };

  // Determine transition variants based on selected effect
  const getExitAnimation = () => {
    if (coverType === 'image') {
      switch (imageTransition) {
        case 'slide-up':
          return { y: '-100%', opacity: 0.9, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } };
        case 'curtain-split':
          return { opacity: 0, scale: 1.05, transition: { duration: 0.7 } };
        case 'blur-dissolve':
          return { filter: 'blur(25px)', opacity: 0, scale: 1.04, transition: { duration: 0.9 } };
        case 'book-flip':
          return { rotateY: -90, opacity: 0, transformOrigin: 'left center', transition: { duration: 0.85 } };
        case 'envelope-unfold':
          return { y: '-80%', opacity: 0, scale: 0.95, transition: { duration: 0.8 } };
        case 'zoom-fade':
        default:
          return { scale: 1.25, opacity: 0, filter: 'blur(10px)', transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } };
      }
    }

    // Default for video and envelopes
    return { opacity: 0, scale: 1.08, filter: 'blur(8px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } };
  };

  const isVideoBg = coverType === 'video' || pageBg?.type === 'video' || Boolean(config.videoUrl);
  const isImageBg = coverType === 'image' || pageBg?.type === 'image' || Boolean(config.imageUrl);
  const videoSrc = config.videoUrl || pageBg?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4';
  const imageSrc = config.imageUrl || pageBg?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

  return (
    <AnimatePresence>
      <motion.div
        key="opening-screen-overlay"
        initial={{ opacity: 1 }}
        exit={getExitAnimation() as any}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={handleContainerClick}
        className={`${
          isContained ? 'absolute' : 'fixed'
        } inset-0 z-40 flex flex-col items-center justify-center select-none overflow-hidden ${
          !hasButtonOnCanvas || (coverType === 'image' && imageTrigger === 'click-anywhere') ? 'cursor-pointer' : ''
        }`}
        style={{
          perspective: 1200,
          backgroundColor: !isVideoBg && !isImageBg && pageBg?.type === 'color' ? pageBg.color : '#07120d'
        }}
      >
        {/* Skip to Invitation Button (Top-Right) */}
        {config.showSkipButton !== false && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerOpen(true);
            }}
            className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-[11px] font-semibold flex items-center gap-1.5 shadow-xl transition-all cursor-pointer group"
          >
            <span>{config.skipButtonText || 'Skip'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        )}

        {/* ========================================================================= */}
        {/* 1. BACKGROUND LAYER (Video, Image, or Gradient/Color)                    */}
        {/* ========================================================================= */}
        {isVideoBg ? (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              poster={config.videoPosterUrl}
              playsInline
              autoPlay
              muted={isMuted}
              loop={videoPlayMode === 'click-to-open' || config.videoLoop}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Scrim Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: pageBg?.overlayColor || '#000000',
                opacity: pageBg?.overlayOpacity ?? 0.35
              }}
            />

            {/* Video Audio Control (Top-Left) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="absolute top-4 left-4 z-40 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer shadow-lg"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Video Progress Bar for Autoplay & Click-to-Play */}
            {(videoPlayMode === 'autoplay' || videoPlayMode === 'click-to-play') && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-40">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-200"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            )}

            {/* Mode: Click to Play - Center Play Button */}
            {videoPlayMode === 'click-to-play' && !isVideoPlaying && (
              <div
                className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualVideoPlay();
                }}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualVideoPlay();
                  }}
                  className="w-20 h-20 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-2xl border-2 border-white/40 cursor-pointer group ring-8 ring-amber-500/25 transition-all"
                >
                  <Play className="w-8 h-8 fill-neutral-950 ml-1 group-hover:scale-110 transition-transform" />
                </motion.button>
              </div>
            )}
          </>
        ) : isImageBg ? (
          <>
            <img
              src={imageSrc}
              alt="Invitation Cover"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: pageBg?.overlayColor || '#000000',
                opacity: pageBg?.overlayOpacity ?? (config.imageOverlayOpacity ?? 0.4)
              }}
            />
          </>
        ) : (
          /* Gradient / Radial Envelope Background */
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                pageBg?.type === 'gradient' && pageBg.gradient
                  ? `radial-gradient(circle at 50% 40%, ${pageBg.gradient.colors[0] || '#172520'}, ${pageBg.gradient.colors[1] || '#07120d'})`
                  : 'radial-gradient(circle at 50% 40%, #172520 0%, #07120d 100%)'
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* 2. WYSIWYG CANVAS ELEMENTS (100% Matching Editor Canvas)                   */}
        {/* ========================================================================= */}
        <div className="relative w-full h-full inset-0 overflow-hidden flex items-center justify-center pointer-events-auto">
          <div
            className="relative w-full h-full max-w-[430px] mx-auto overflow-hidden"
            style={{ minHeight: '844px' }}
          >
            {topLevelElements.map((el) => {
              const { style: resolvedStyle } = resolveElementForViewport(el, 'mobile');
              const rotationTransform = resolvedStyle.rotation ? `rotate(${resolvedStyle.rotation}deg)` : '';

              const isButtonOrAction =
                el.id === 'open-elem-button' ||
                el.id === 'open-elem-icon' ||
                el.id === 'open-elem-seal-hint' ||
                el.type === 'button';

              return (
                <div
                  key={el.id}
                  className={`absolute ${isButtonOrAction ? 'cursor-pointer' : ''}`}
                  style={{
                    left: `${resolvedStyle.x}px`,
                    top: `${resolvedStyle.y}px`,
                    width: `${resolvedStyle.width}px`,
                    height: `${resolvedStyle.height}px`,
                    transform: rotationTransform || undefined,
                    zIndex: resolvedStyle.zIndex || 1
                  }}
                  onClick={(e) => {
                    if (isButtonOrAction) {
                      e.stopPropagation();
                      triggerOpen();
                    }
                  }}
                >
                  <ElementRenderer
                    element={el}
                    isEditor={false}
                    viewportMode="mobile"
                    allElements={elements}
                    onActionClick={() => {
                      triggerOpen();
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
