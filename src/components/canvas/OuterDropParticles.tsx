import React, { useMemo } from 'react';
import {
  Heart,
  Sparkles,
  Star,
  Leaf,
  Snowflake,
  Gem,
  Circle,
  Flower2
} from 'lucide-react';
import { OuterDropEffectType } from '../../types';

export interface OuterDropParticlesProps {
  active?: boolean;
  color?: string;
  effect?: OuterDropEffectType;
  density?: 'subtle' | 'moderate' | 'romantic';
  className?: string;
}

interface Particle {
  id: number;
  left: number; // percentage 0-100
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  rotation: number;
  swayDuration: number;
  variant: number; // 0, 1, 2 for variety
}

export const OuterDropParticles: React.FC<OuterDropParticlesProps> = ({
  active = true,
  color = '#f43f5e',
  effect = 'hearts',
  density = 'moderate',
  className = ''
}) => {
  if (!active || effect === 'none') {
    return null;
  }

  const particleCount = density === 'subtle' ? 14 : density === 'romantic' ? 36 : 22;

  // Generate stable particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const left = Math.round((i / particleCount) * 100 + (Math.random() * 8 - 4));
      const size = Math.floor(Math.random() * 14) + 14; // 14px to 28px
      const duration = parseFloat((Math.random() * 4 + 5).toFixed(1)); // 5s to 9s
      const delay = parseFloat((Math.random() * 6).toFixed(1)); // 0s to 6s
      const opacity = parseFloat((Math.random() * 0.45 + 0.4).toFixed(2)); // 0.4 to 0.85
      const rotation = Math.floor(Math.random() * 60) - 30; // -30deg to 30deg
      const swayDuration = parseFloat((Math.random() * 2 + 2.5).toFixed(1)); // 2.5s to 4.5s
      const variant = i % 3;

      return {
        id: i,
        left: Math.max(2, Math.min(98, left)),
        size,
        duration,
        delay,
        opacity,
        rotation,
        swayDuration,
        variant
      };
    });
  }, [particleCount, effect]);

  const renderIcon = (p: Particle) => {
    const iconStyle = {
      width: `${p.size}px`,
      height: `${p.size}px`,
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))'
    };

    switch (effect) {
      case 'sparkles':
        return <Sparkles style={iconStyle} />;

      case 'stars':
        return p.variant === 0 ? (
          <Star className="fill-current" style={iconStyle} />
        ) : (
          <Star style={{ ...iconStyle, strokeWidth: 2 }} />
        );

      case 'petals':
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={iconStyle}
            className="transform rotate-12"
          >
            <path d="M12 2C8 6 4 11 6 16C8 21 14 22 17 18C20 14 19 8 12 2Z" />
          </svg>
        );

      case 'butterflies':
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={iconStyle}
            className="transform transition-transform"
          >
            <path d="M12 12C9 5 2 4 3 10C4 14 8 15 12 13C16 15 20 14 21 10C22 4 15 5 12 12Z" />
            <path d="M12 13C10 16 6 20 5 18C4 16 7 14 12 13C17 14 20 16 19 18C18 20 14 16 12 13Z" opacity="0.8" />
          </svg>
        );

      case 'leaves':
        return p.variant === 0 ? (
          <Leaf className="fill-current" style={iconStyle} />
        ) : (
          <Leaf style={{ ...iconStyle, strokeWidth: 1.8 }} />
        );

      case 'snow':
        return <Snowflake style={iconStyle} />;

      case 'confetti':
        return p.variant === 0 ? (
          <div
            style={{
              width: `${p.size * 0.7}px`,
              height: `${p.size * 1.3}px`,
              backgroundColor: 'currentColor',
              borderRadius: '2px',
              transform: 'rotate(25deg)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          />
        ) : (
          <div
            style={{
              width: `${p.size * 0.8}px`,
              height: `${p.size * 0.8}px`,
              border: '2px solid currentColor',
              borderRadius: p.variant === 1 ? '50%' : '2px',
              transform: 'rotate(45deg)'
            }}
          />
        );

      case 'bubbles':
        return (
          <div
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '9999px',
              border: '1.5px solid currentColor',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0,0,0,0.15)'
            }}
          />
        );

      case 'rings':
        return <Gem className="fill-current" style={iconStyle} />;

      case 'hearts':
      default:
        return p.variant === 0 ? (
          <Heart className="fill-current" style={iconStyle} />
        ) : (
          <Heart style={{ ...iconStyle, strokeWidth: 2 }} />
        );
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes dropHeartFall {
          0% {
            transform: translateY(-40px) scale(0.85);
            opacity: 0;
          }
          10% {
            opacity: var(--p-opacity);
          }
          90% {
            opacity: var(--p-opacity);
          }
          100% {
            transform: translateY(calc(100vh + 80px)) scale(1.05);
            opacity: 0;
          }
        }
        @keyframes dropHeartSway {
          0%, 100% {
            transform: translateX(0px) rotate(var(--p-rot));
          }
          50% {
            transform: translateX(22px) rotate(calc(var(--p-rot) + 18deg));
          }
        }
        .outer-drop-item {
          will-change: transform, opacity;
          animation-name: dropHeartFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .outer-drop-sway {
          animation-name: dropHeartSway;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 outer-drop-item"
          style={
            {
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              ['--p-opacity' as any]: p.opacity,
              ['--p-rot' as any]: `${p.rotation}deg`
            } as React.CSSProperties
          }
        >
          <div
            className="outer-drop-sway"
            style={{
              animationDuration: `${p.swayDuration}s`,
              color
            }}
          >
            {renderIcon(p)}
          </div>
        </div>
      ))}
    </div>
  );
};
