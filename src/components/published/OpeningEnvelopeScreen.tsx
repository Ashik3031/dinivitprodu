import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  OpeningScreenConfig,
  InvitationTheme,
  OpeningCoverType,
  VideoPlayMode,
  ImageTransitionEffect,
  ImageAdvanceTrigger,
  ViewportMode
} from '../../types';
import { Play, Volume2, VolumeX, ArrowRight, MoveUp, Sliders } from 'lucide-react';
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
  activeViewport?: ViewportMode;
}

export const OpeningEnvelopeScreen: React.FC<OpeningEnvelopeScreenProps> = ({
  config: propConfig,
  openingScreen,
  theme,
  defaultTitle,
  defaultDate,
  onOpen,
  onOpenComplete,
  isContained = false,
  activeViewport = 'mobile'
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

  const hasCalledOpenRef = useRef(false);
  const handleOpenCallback = () => {
    if (hasCalledOpenRef.current) return;
    hasCalledOpenRef.current = true;
    if (onOpen) onOpen();
    if (onOpenComplete) onOpenComplete();
  };
  const [isOpening, setIsOpening] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [, setTimerProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(config.videoMuted !== false);

  const videoRef = useRef<HTMLVideoElement>(null);

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
    (el) =>
      el.id === 'open-elem-button' ||
      el.content?.buttonAction === 'open-invitation' ||
      el.content?.buttonAction === 'open_invitation'
  );

  // Determine cover type: if explicitly selected, respect it strictly!
  const coverType: OpeningCoverType =
    config.coverType ||
    (config.style === 'video-cover' || pageBg?.type === 'video'
      ? 'video'
      : config.style === 'card-flip' || pageBg?.type === 'image'
        ? 'image'
        : config.style === 'custom-page'
          ? 'custom-page'
          : config.videoUrl
            ? 'video'
            : config.imageUrl
              ? 'image'
              : 'envelope');

  const videoPlayMode: VideoPlayMode = config.videoPlayMode || 'autoplay';
  // Global transition effect for all cover types (video, image, envelope, custom)
  const transitionEffect: ImageTransitionEffect =
    config.coverTransitionEffect || config.imageTransitionEffect || 'zoom-fade';
  const imageTrigger: ImageAdvanceTrigger = config.imageAdvanceTrigger || 'click-button';

  const hasTriggeredRef = useRef(false);
  const triggerOpen = (immediate = false) => {
    if (isOpening || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsOpening(true);

    if (config.showConfetti !== false) {
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: [theme?.primaryColor || config.sealColor || '#d4af37', '#ffffff', '#fbbf24', '#f43f5e', '#38bdf8']
        });
      } catch (e) { }
    }

    const delay = immediate ? 200 : 900;
    setTimeout(() => {
      handleOpenCallback();
    }, delay);
  };

  // ========================== VIDEO PLAYBACK LOGIC ==========================
  useEffect(() => {
    if (coverType !== 'video' && pageBg?.type !== 'video') return;

    if (videoPlayMode === 'autoplay' && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        // Autoplay policy might require mute
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => { });
        }
      });
    } else if (videoPlayMode === 'scroll-based' && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
      setVideoProgress(0);
    } else if (videoPlayMode === 'click-to-open' && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => { });
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
    if (config.videoAutoAdvanceOnEnd !== false && videoPlayMode !== 'click-to-open') {
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

  // ========================== GESTURE & SCROLL LOGIC ==========================
  const touchStartYRef = useRef<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (isOpening) return;

    if (coverType === 'video' && videoPlayMode === 'scroll-based') {
      e.stopPropagation();
      const v = videoRef.current;
      if (!v) return;

      const duration = v.duration || (config.videoDurationSeconds || 6);
      if (duration <= 0 || isNaN(duration)) return;

      // Wheel scrub: scrolling down advances video, scrolling up rewinds
      const scrubStep = (e.deltaY / 280) * (duration / 4);
      const targetTime = Math.max(0, Math.min(duration, (v.currentTime || 0) + scrubStep));
      v.currentTime = targetTime;
      const progress = (targetTime / duration) * 100;
      setVideoProgress(progress);

      // If user reaches end of video (or >97%), trigger opening
      if (targetTime >= duration - 0.12 || progress >= 97) {
        triggerOpen();
      }
    } else if (imageTrigger === 'scroll-swipe') {
      if (e.deltaY > 25) {
        e.stopPropagation();
        triggerOpen();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isOpening || touchStartYRef.current === null || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartYRef.current - currentY; // positive = swiping up

    if (coverType === 'video' && videoPlayMode === 'scroll-based') {
      const v = videoRef.current;
      if (!v) return;
      const duration = v.duration || (config.videoDurationSeconds || 6);
      if (duration <= 0 || isNaN(duration)) return;

      const scrubStep = (deltaY / 200) * (duration / 3);
      const targetTime = Math.max(0, Math.min(duration, (v.currentTime || 0) + scrubStep));
      v.currentTime = targetTime;
      const progress = (targetTime / duration) * 100;
      setVideoProgress(progress);
      touchStartYRef.current = currentY; // update for continuous smooth scrubbing

      if (targetTime >= duration - 0.12 || progress >= 97) {
        triggerOpen();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || isOpening) {
      touchStartYRef.current = null;
      return;
    }
    const currentY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - currentY; // positive = swipe up
    touchStartYRef.current = null;

    if (imageTrigger === 'scroll-swipe') {
      if (deltaY > 35) {
        triggerOpen();
      }
    }
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

  // Check if click anywhere trigger is active (or if there is no explicit open button on canvas)
  const handleContainerClick = () => {
    if (
      imageTrigger === 'click-anywhere' ||
      !hasButtonOnCanvas
    ) {
      triggerOpen();
    }
  };

  const transitionDuration = config.transitionDuration || config.imageTransitionDuration || 0.85;

  // Determine transition variants based on selected effect (Global for all cover types)
  const getExitAnimation = () => {
    switch (transitionEffect) {
      case 'slide-up':
        return {
          y: '-105%',
          opacity: 0.8,
          transition: { duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }
        };
      case 'curtain-split':
        return {
          clipPath: 'inset(0% 50% 0% 50%)',
          scale: 1.05,
          opacity: 0,
          transition: { duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'blur-dissolve':
        return {
          filter: 'blur(35px)',
          opacity: 0,
          scale: 1.08,
          transition: { duration: transitionDuration, ease: 'easeInOut' }
        };
      case 'book-flip':
        return {
          rotateY: -95,
          opacity: 0,
          x: '-20%',
          transformOrigin: 'left center',
          transition: { duration: transitionDuration, ease: [0.4, 0, 0.2, 1] }
        };
      case 'envelope-unfold':
        return {
          y: '-90%',
          rotateX: 25,
          opacity: 0,
          scale: 0.92,
          transformOrigin: 'bottom center',
          transition: { duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }
        };
      case 'zoom-fade':
      default:
        return {
          scale: 1.35,
          opacity: 0,
          filter: 'blur(16px)',
          transition: { duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }
        };
    }
  };

  // Strictly respect the active coverType: if image is selected, NEVER fall back to video!
  const isVideoBg = coverType === 'video';
  const isImageBg = coverType === 'image';
  const videoSrc = config.videoUrl || pageBg?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4';
  const imageSrc = config.imageUrl || pageBg?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

  return (
    <motion.div
      key="opening-screen-overlay"
      initial={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotateY: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        clipPath: 'inset(0% 0% 0% 0%)'
      }}
      animate={
        isOpening
          ? (getExitAnimation() as any)
          : {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            clipPath: 'inset(0% 0% 0% 0%)'
          }
      }
      exit={getExitAnimation() as any}
      onAnimationComplete={() => {
        if (isOpening) {
          handleOpenCallback();
        }
      }}
      onClick={handleContainerClick}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`${isContained ? 'absolute' : 'fixed'
        } inset-0 z-40 flex flex-col items-center justify-center select-none overflow-hidden ${videoPlayMode === 'scroll-based' || imageTrigger === 'scroll-swipe' ? 'touch-none' : ''
        } ${!hasButtonOnCanvas || imageTrigger === 'click-anywhere' ? 'cursor-pointer' : ''
        }`}
      style={{
        perspective: 1400,
        transformStyle: 'preserve-3d',
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
            preload="auto"
            autoPlay={videoPlayMode === 'autoplay' || videoPlayMode === 'click-to-open'}
            muted={videoPlayMode === 'scroll-based' ? true : isMuted}
            loop={videoPlayMode === 'click-to-open' || (config.videoLoop && videoPlayMode !== 'scroll-based')}
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnded}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              v.defaultMuted = true;
              if (videoPlayMode === 'autoplay' || videoPlayMode === 'click-to-open') {
                v.muted = isMuted;
                v.play().then(() => setIsVideoPlaying(true)).catch(() => {
                  v.muted = true;
                  setIsMuted(true);
                  v.play().then(() => setIsVideoPlaying(true)).catch(() => { });
                });
              } else if (videoPlayMode === 'scroll-based') {
                v.pause();
                v.currentTime = 0;
              }
            }}
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
          {videoPlayMode !== 'scroll-based' && (
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
          )}

          {/* Video Progress Bar for Autoplay, Click-to-Play, and Scroll-Based */}
          {(videoPlayMode === 'autoplay' || videoPlayMode === 'click-to-play' || videoPlayMode === 'scroll-based') && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-40">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-150"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          )}

          {/* Scroll-to-Scrub Floating Cue & Progress */}
          {videoPlayMode === 'scroll-based' && !isOpening && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-none"
            >
              <div className="px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                >
                  <MoveUp className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                </motion.div>
                <span>Scroll or swipe up to scrub video</span>
                <span className="font-mono text-[10.5px] text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {Math.round(videoProgress)}%
                </span>
              </div>
            </motion.div>
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
      ) : pageBg?.type === 'gradient' && pageBg.gradient ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              pageBg.gradient.type === 'linear'
                ? `linear-gradient(${pageBg.gradient.angle ?? 135}deg, ${pageBg.gradient.colors[0] || '#172520'}, ${pageBg.gradient.colors[1] || '#07120d'})`
                : `radial-gradient(circle at 50% 40%, ${pageBg.gradient.colors[0] || '#172520'}, ${pageBg.gradient.colors[1] || '#07120d'})`
          }}
        />
      ) : (
        /* Solid Color Background */
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: pageBg?.color || '#172520'
          }}
        />
      )}

      {/* Scroll/Swipe-to-Open Floating Cue for Non-Video Cover */}
      {imageTrigger === 'scroll-swipe' && !isVideoBg && !isOpening && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <div className="px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <MoveUp className="w-3.5 h-3.5 text-amber-400" />
            </motion.div>
            <span>Scroll or swipe up to open invitation</span>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 2. WYSIWYG CANVAS ELEMENTS (100% Matching Editor Canvas Dimensions)        */}
      {/* ========================================================================= */}
      <div className="relative w-full h-full inset-0 overflow-hidden flex items-center justify-center pointer-events-auto">
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: `${page?.width || 520}px`,
            height: page?.heightMode === 'viewport' ? '100%' : `${page?.height || 400}px`,
            maxWidth: '100%',
            maxHeight: page?.heightMode === 'viewport' ? '100%' : undefined
          }}
        >
          {topLevelElements.map((el) => {
            const { style: resolvedStyle } = resolveElementForViewport(el, (activeViewport as any) || 'mobile');
            const rotationTransform = resolvedStyle.rotation ? `rotate(${resolvedStyle.rotation}deg)` : '';

            const isOpenInvitationButton =
              el.id === 'open-elem-button' ||
              el.content?.buttonAction === 'open-invitation' ||
              el.content?.buttonAction === 'open_invitation';

            const isWaxSealAction =
              el.id === 'open-elem-icon' ||
              el.id === 'open-elem-seal-hint' ||
              el.name === 'Wax Seal Badge' ||
              el.name === 'Wax Seal Hint';

            const isOpeningTrigger = isOpenInvitationButton || isWaxSealAction;

            return (
              <div
                key={el.id}
                className={`absolute ${isOpeningTrigger ? 'cursor-pointer' : ''}`}
                style={{
                  left: `${resolvedStyle.x}px`,
                  top: `${resolvedStyle.y}px`,
                  width: `${resolvedStyle.width}px`,
                  height: `${resolvedStyle.height}px`,
                  transform: rotationTransform || undefined,
                  zIndex: resolvedStyle.zIndex || 1
                }}
                onClick={(e) => {
                  if (isOpeningTrigger) {
                    e.stopPropagation();
                    triggerOpen();
                  }
                }}
              >
                <ElementRenderer
                  element={el}
                  isEditor={false}
                  viewportMode={activeViewport}
                  allElements={elements}
                  onActionClick={() => {
                    if (isOpeningTrigger) {
                      triggerOpen();
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
