import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { OpeningScreenConfig, InvitationTheme, CanvasElement, InvitationPage } from '../../types';
import { Heart, MailOpen, Sparkles } from 'lucide-react';
import { ElementRenderer } from '../canvas/ElementRenderer';
import { CANVAS_BREAKPOINTS, resolveElementForViewport } from '../../utils/responsiveUtils';

interface OpeningEnvelopeScreenProps {
  config?: OpeningScreenConfig;
  openingScreen?: OpeningScreenConfig;
  theme?: Partial<InvitationTheme>;
  defaultTitle?: string;
  defaultDate?: string;
  onOpen?: () => void;
  onOpenComplete?: () => void;
}

export const OpeningEnvelopeScreen: React.FC<OpeningEnvelopeScreenProps> = ({
  config: propConfig,
  openingScreen,
  theme,
  defaultTitle,
  defaultDate,
  onOpen,
  onOpenComplete
}) => {
  const config = propConfig || openingScreen || {
    enabled: true,
    style: 'envelope-wax-seal',
    title: 'Wedding Invitation',
    subtitle: 'December 2026',
    coupleNames: 'Rahul & Priya',
    envelopeColor: '#0e261d',
    sealColor: '#d4af37',
    openButtonText: 'Open Invitation'
  };

  const handleOpenCallback = onOpen || onOpenComplete || (() => {});
  const [isOpening, setIsOpening] = useState(false);

  const coupleOrEvent = config.coupleNames || defaultTitle || 'Rahul & Priya';
  const displayDate = config.subtitle || defaultDate || 'December 2026';
  const buttonLabel = config.openButtonText || 'Open Invitation';

  const handleOpenClick = () => {
    setIsOpening(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: [theme?.primaryColor || '#d4af37', '#ffffff', '#fbbf24', '#f43f5e', '#38bdf8']
      });
    } catch (e) {}

    setTimeout(() => {
      handleOpenCallback();
    }, 900);
  };

  const page = config.page;
  const pageBg = page?.background || config.background;
  const hasCustomElements = page?.elements && page.elements.length > 0;
  const topLevelElements = (page?.elements || []).filter(el => !el.parentContainerId && !el.isHidden);

  // Background rendering
  const renderBackgroundMedia = () => {
    if (!pageBg) return null;
    if (pageBg.type === 'video' && pageBg.videoUrl) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={pageBg.videoUrl}
        />
      );
    }
    return null;
  };

  const getContainerBgStyle = (): React.CSSProperties => {
    if (!pageBg) {
      return {
        background: 'radial-gradient(circle at center, #172520 0%, #07120d 100%)'
      };
    }
    if (pageBg.type === 'color') {
      return { backgroundColor: pageBg.color || '#071912' };
    }
    if (pageBg.type === 'gradient' && pageBg.gradient) {
      const colors = pageBg.gradient.colors.join(', ');
      const angle = pageBg.gradient.angle ?? 180;
      return {
        background:
          pageBg.gradient.type === 'radial'
            ? `radial-gradient(circle, ${colors})`
            : `linear-gradient(${angle}deg, ${colors})`
      };
    }
    if (pageBg.type === 'image' && pageBg.imageUrl) {
      return {
        backgroundImage: `url(${pageBg.imageUrl})`,
        backgroundSize: pageBg.size || 'cover',
        backgroundPosition: pageBg.position || 'center',
        backgroundRepeat: pageBg.repeat || 'no-repeat'
      };
    }
    return { backgroundColor: '#071912' };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-neutral-950 select-none overflow-hidden"
        style={getContainerBgStyle()}
      >
        {renderBackgroundMedia()}

        {/* Subtle decorative background light & particles overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#d4af37_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

        {/* Ambient Glow */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme?.primaryColor || '#d4af37' }}
        />

        {/* If user designed custom page elements, render them directly in mobile-centered container */}
        {hasCustomElements ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[390px] h-[844px] max-w-full max-h-[94vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center justify-between p-0 backdrop-blur-xs"
            style={{
              backgroundColor: pageBg?.type === 'color' ? pageBg.color : 'rgba(10, 25, 20, 0.75)'
            }}
          >
            {/* Visual Canvas Elements Stack */}
            <div className="relative w-[390px] h-[844px] shrink-0 overflow-hidden">
              {topLevelElements.map(el => {
                const { style: resolvedStyle } = resolveElementForViewport(el, 'mobile');
                const rotationTransform = resolvedStyle.rotation
                  ? `rotate(${resolvedStyle.rotation}deg)`
                  : '';

                return (
                  <div
                    key={el.id}
                    className="absolute"
                    style={{
                      left: `${resolvedStyle.x}px`,
                      top: `${resolvedStyle.y}px`,
                      width: `${resolvedStyle.width}px`,
                      height: `${resolvedStyle.height}px`,
                      transform: rotationTransform || undefined,
                      zIndex: resolvedStyle.zIndex || 1
                    }}
                  >
                    <ElementRenderer
                      element={el}
                      isEditor={false}
                      viewportMode="mobile"
                      allElements={page?.elements}
                      onActionClick={(action) => {
                        if (action === 'open' || action === 'link' || action === 'rsvp') {
                          handleOpenClick();
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Floating Open Invitation Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpenClick}
              disabled={isOpening}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[220px] py-3.5 px-8 rounded-full font-bold text-sm text-neutral-950 flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer"
              style={{
                backgroundColor: config?.sealColor || theme?.primaryColor || '#d4af37',
                boxShadow: '0 10px 30px -5px rgba(212, 175, 55, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.6)'
              }}
            >
              <MailOpen className="w-5 h-5 text-neutral-950" />
              <span className="tracking-wide uppercase text-xs font-extrabold">
                {isOpening ? 'Unfolding Invitation...' : buttonLabel}
              </span>
            </motion.button>
          </motion.div>
        ) : (
          /* Classic Envelope Card */
          <motion.div
            initial={{ scale: 0.92, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm sm:max-w-md rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center border shadow-2xl backdrop-blur-xl"
            style={{
              backgroundColor: config?.envelopeColor || '#0e261d',
              borderColor: 'rgba(212, 175, 55, 0.35)',
              boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 50px rgba(212,175,55,0.18)'
            }}
          >
            {/* Top Heart Icon Badge */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-amber-400/40 bg-amber-500/15 flex items-center justify-center text-amber-400 mb-5 shadow-inner"
            >
              <Heart className="w-8 h-8 fill-amber-400 text-amber-300 drop-shadow-sm" />
            </motion.div>

            {/* Top Overline Header */}
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-400/90 mb-2">
              {config?.title || 'Wedding Invitation'}
            </span>

            {/* Couple Names / Main Headline */}
            <h1
              className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-2.5 tracking-wide"
              style={{
                fontFamily: theme?.fontHeading || theme?.fontScript || "'Playfair Display', serif",
                color: '#fbfaf5',
                textShadow: '0 2px 14px rgba(212,175,55,0.35)'
              }}
            >
              {coupleOrEvent}
            </h1>

            {/* Event Date / Subtitle */}
            <p className="text-sm text-neutral-300 font-light tracking-widest uppercase mb-8">
              {displayDate}
            </p>

            {/* Open Invitation Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenClick}
              disabled={isOpening}
              className="w-full max-w-xs py-3.5 px-6 rounded-2xl font-bold text-sm text-neutral-950 flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group"
              style={{
                backgroundColor: config?.sealColor || theme?.primaryColor || '#d4af37',
                boxShadow: '0 10px 30px -5px rgba(212, 175, 55, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.6)'
              }}
            >
              <MailOpen className="w-5 h-5 text-neutral-950 transition-transform group-hover:scale-110" />
              <span className="tracking-wide uppercase text-xs font-extrabold">
                {isOpening ? 'Unfolding Invitation...' : buttonLabel}
              </span>
            </motion.button>

            {/* Interactive notice */}
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-amber-300/70 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Interactive sound and animations enabled</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
