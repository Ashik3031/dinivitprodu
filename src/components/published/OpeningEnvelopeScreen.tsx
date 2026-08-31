import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { OpeningScreenConfig, InvitationTheme } from '../../types';
import { Sparkles, Heart, MailOpen, Lock } from 'lucide-react';

interface OpeningEnvelopeScreenProps {
  config: OpeningScreenConfig;
  theme: InvitationTheme;
  onOpen: () => void;
}

export const OpeningEnvelopeScreen: React.FC<OpeningEnvelopeScreenProps> = ({
  config,
  theme,
  onOpen
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [theme.primaryColor || '#d4af37', '#ffffff', '#fbbf24', '#f43f5e']
      });
    } catch (e) {}

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-neutral-950 select-none overflow-hidden"
        style={{
          background: 'radial-gradient(circle at center, #172520 0%, #07120d 100%)'
        }}
      >
        {/* Subtle decorative background light */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Envelope & Wax Seal Card */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm rounded-3xl p-8 text-center flex flex-col items-center border border-amber-400/30 shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: config.envelopeColor || '#0e261d',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212,175,55,0.15)'
          }}
        >
          {/* Ornamental Monogram Top */}
          <div className="w-16 h-16 rounded-full border border-amber-400/40 bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
            <Heart className="w-7 h-7 fill-amber-400/20" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-400 mb-2">
            {config.title || 'You Are Cordially Invited'}
          </span>

          <p className="text-xs text-neutral-300 font-light italic mb-2">
            {config.subtitle || 'To celebrate the wedding of'}
          </p>

          <h1
            className="text-3xl font-bold text-neutral-100 mb-6"
            style={{
              fontFamily: theme.fontScript || "'Great Vibes', cursive",
              color: '#f9f6ee',
              textShadow: '0 2px 10px rgba(212,175,55,0.3)'
            }}
          >
            {config.coupleNames || 'Alexander & Sophia'}
          </h1>

          {/* Interactive Wax Seal / Open Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenClick}
            disabled={isOpening}
            className="relative group cursor-pointer flex flex-col items-center justify-center"
          >
            {/* Wax Seal Emblem */}
            <div
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-neutral-950 font-bold shadow-xl transition-transform ${
                isOpening ? 'scale-125 rotate-180 opacity-0' : 'group-hover:shadow-amber-500/50'
              }`}
              style={{
                backgroundColor: config.sealColor || theme.primaryColor || '#d4af37',
                border: '3px solid rgba(255,255,255,0.4)',
                boxShadow: '0 10px 25px rgba(212,175,55,0.4), inset 0 2px 4px rgba(255,255,255,0.5)'
              }}
            >
              <MailOpen className="w-7 h-7 text-neutral-950 mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-900">
                OPEN
              </span>
            </div>

            <span className="text-xs font-semibold text-amber-400 mt-4 tracking-wider uppercase group-hover:text-amber-300 transition-colors">
              {config.openButtonText || 'Tap to Open Invitation'}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
