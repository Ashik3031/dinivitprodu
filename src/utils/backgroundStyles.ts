import React from 'react';
import { BackgroundConfig } from '../types';

/**
 * Shared Background Style Resolver
 * Ensures VisualCanvas in the editor and PublishedInvitationView in public view render identically.
 */
export function getPageBgStyle(
  bg?: BackgroundConfig,
  fallbackBgColor = '#f8fafc'
): React.CSSProperties {
  if (!bg) return { backgroundColor: fallbackBgColor };

  switch (bg.type) {
    case 'color':
      return { backgroundColor: bg.color || fallbackBgColor };

    case 'gradient': {
      if (bg.gradient && Array.isArray(bg.gradient.colors) && bg.gradient.colors.length > 0) {
        const colors = bg.gradient.colors.join(', ');
        const angle = bg.gradient.angle ?? 180;
        return {
          background:
            bg.gradient.type === 'radial'
              ? `radial-gradient(circle, ${colors})`
              : `linear-gradient(${angle}deg, ${colors})`
        };
      }
      return { backgroundColor: bg.color || fallbackBgColor };
    }

    case 'image':
    case 'pattern':
    case 'texture': {
      const url = bg.imageUrl || bg.pattern || bg.texture;
      if (!url) {
        return { backgroundColor: bg.color || fallbackBgColor };
      }

      // Sizing calculation: if custom zoom is specified and not 100%, represent via background-size percentage
      let backgroundSize: any = bg.size || (bg.type === 'pattern' ? 'auto' : 'cover');
      if (bg.zoom && bg.zoom !== 100) {
        backgroundSize = `${bg.zoom}% auto`;
      }

      // Positioning calculation: if custom precise coordinates are provided, use them; otherwise use position keyword
      let backgroundPosition = bg.position || 'center';
      if (
        bg.customPosition &&
        typeof bg.customPosition.x === 'number' &&
        typeof bg.customPosition.y === 'number'
      ) {
        backgroundPosition = `${bg.customPosition.x}% ${bg.customPosition.y}%`;
      }

      return {
        backgroundImage: `url("${url}")`,
        backgroundSize,
        backgroundRepeat: bg.repeat || (bg.type === 'pattern' ? 'repeat' : 'no-repeat'),
        backgroundPosition,
        backgroundColor: bg.color || fallbackBgColor
      };
    }

    case 'video':
      return { backgroundColor: bg.color || fallbackBgColor };

    default:
      return { backgroundColor: fallbackBgColor };
  }
}

/**
 * Returns overlay styling for text contrast dimming.
 * Applies only when overlayEnabled is not explicitly false and opacity is greater than 0.
 */
export function getBackgroundOverlayStyle(
  bg?: BackgroundConfig
): React.CSSProperties | null {
  if (!bg) return null;
  if (bg.overlayEnabled === false) return null;
  if (bg.overlayOpacity === undefined || bg.overlayOpacity <= 0) return null;

  return {
    backgroundColor: bg.overlayColor || '#000000',
    opacity: bg.overlayOpacity
  };
}

/**
 * Shared Video Background Style Resolver
 * Keeps objectFit, objectPosition, and zoom consistent across Editor and Public View.
 */
export function getVideoBackgroundStyle(bg?: BackgroundConfig): React.CSSProperties {
  if (!bg) return { objectFit: 'cover', objectPosition: 'center' };

  const objectFit: React.CSSProperties['objectFit'] =
    bg.size === 'contain' ? 'contain' : bg.size === 'auto' ? 'none' : 'cover';

  let objectPosition = bg.position || 'center';
  if (
    bg.customPosition &&
    typeof bg.customPosition.x === 'number' &&
    typeof bg.customPosition.y === 'number'
  ) {
    objectPosition = `${bg.customPosition.x}% ${bg.customPosition.y}%`;
  }

  const zoom = bg.zoom && bg.zoom !== 100 ? bg.zoom / 100 : 1;

  return {
    objectFit,
    objectPosition,
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    transformOrigin: objectPosition
  };
}

/**
 * Default clean adjustments to apply or restore when resetting image adjustments
 */
export const DEFAULT_BACKGROUND_ADJUSTMENTS: Partial<BackgroundConfig> = {
  size: 'cover',
  position: 'center',
  repeat: 'no-repeat',
  zoom: 100,
  customPosition: { x: 50, y: 50 },
  overlayEnabled: false,
  overlayColor: '#000000',
  overlayOpacity: 0
};
