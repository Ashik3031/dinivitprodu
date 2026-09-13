import React, { useState, useEffect, useRef } from 'react';
import { MusicConfig, InvitationTheme } from '../../types';
import { Music, Pause } from 'lucide-react';

interface FloatingMusicPlayerProps {
  config: MusicConfig;
  autoPlayTriggered?: boolean;
  theme?: Partial<InvitationTheme>;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  config,
  autoPlayTriggered = false,
  theme
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const primaryColor = theme?.primaryColor || theme?.accentColor || '#d4af37';

  useEffect(() => {
    if (!config.enabled || !config.audioUrl) return;

    const audio = new Audio(config.audioUrl);
    audio.loop = config.loop !== false;
    audioRef.current = audio;

    if (autoPlayTriggered) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay policy fallback: waiting for user click
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [config.enabled, config.audioUrl, autoPlayTriggered]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  if (!config.enabled || !config.audioUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      <button
        type="button"
        onClick={togglePlay}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        style={
          isPlaying
            ? {
                backgroundColor: primaryColor,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${primaryColor}80`
              }
            : {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderColor: primaryColor,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 12px ${primaryColor}40`
              }
        }
        className="relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 backdrop-blur-md z-50"
      >
        {isPlaying && (
          <span
            className="absolute -inset-1 rounded-full border-2 animate-ping pointer-events-none opacity-50"
            style={{ borderColor: primaryColor }}
          />
        )}

        {isPlaying ? (
          <Pause className="w-5 h-5 text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
        ) : (
          <Music className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
        )}
      </button>
    </div>
  );
};
