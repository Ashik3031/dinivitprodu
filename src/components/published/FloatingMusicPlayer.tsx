import React, { useState, useEffect, useRef } from 'react';
import { MusicConfig } from '../../types';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

interface FloatingMusicPlayerProps {
  config: MusicConfig;
  autoPlayTriggered?: boolean;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  config,
  autoPlayTriggered = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-lg backdrop-blur-md border transition-all cursor-pointer ${
          isPlaying
            ? 'bg-slate-900 text-white border-slate-800'
            : 'bg-white/90 text-slate-700 border-slate-200 hover:border-slate-400'
        }`}
      >
        {/* Animated Sound Bars or Icon */}
        <div className="flex items-center gap-0.5 h-4">
          {isPlaying ? (
            <>
              <span className="w-1 bg-white rounded-full h-3 animate-pulse" />
              <span className="w-1 bg-white rounded-full h-4 animate-bounce" />
              <span className="w-1 bg-white rounded-full h-2 animate-pulse" />
            </>
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <span className="text-xs font-semibold max-w-[120px] truncate">
          {config.title || 'Music'}
        </span>
      </button>
    </div>
  );
};
