import { ViewportMode } from '../types';

export const MOBILE_BASE_WIDTH = 390;
export const MOBILE_BASE_HEIGHT = 844;

/**
 * Resolves the real device category from a viewport width.
 */
export function getDeviceViewportMode(viewportWidth: number): ViewportMode {
  if (viewportWidth >= 1024) return 'desktop';
  if (viewportWidth >= 768) return 'tablet';
  return 'mobile';
}

export interface CanvasScaleMetrics {
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
  designWidth: number;
  designHeight: number;
}

/**
 * Calculates the proportional scale for a scrollable invitation page so that:
 * - On mobile (< 640px), the page fills the available mobile width cleanly with zero horizontal overflow.
 * - On tablet & desktop (>= 640px), the invitation remains centered with its original aspect ratio
 *   preserved (never stretched across the entire desktop monitor).
 */
export function calculatePageScale(params: {
  designWidth: number;
  designHeight: number;
  containerWidth: number;
}): CanvasScaleMetrics {
  const designWidth = Math.max(1, params.designWidth || MOBILE_BASE_WIDTH);
  const designHeight = Math.max(1, params.designHeight || MOBILE_BASE_HEIGHT);
  const containerWidth = Math.max(240, params.containerWidth || MOBILE_BASE_WIDTH);

  let targetWidth: number;

  if (containerWidth < 640) {
    // Mobile: fill available width cleanly without horizontal overflow
    targetWidth = containerWidth;
  } else {
    // Tablet / Desktop: keep invitation centered in a comfortable viewing column
    // without stretching portrait designs to fill the full monitor width.
    const maxSafeWidth = Math.max(240, containerWidth - 48);
    if (designWidth <= 480) {
      const desktopTarget = Math.round(Math.min(470, 410 + (containerWidth - 640) * 0.047));
      targetWidth = Math.min(maxSafeWidth, Math.max(designWidth, desktopTarget));
    } else {
      targetWidth = Math.min(maxSafeWidth, designWidth);
    }
  }

  const scale = targetWidth / designWidth;
  return {
    scale,
    scaledWidth: Math.round(designWidth * scale),
    scaledHeight: Math.round(designHeight * scale),
    designWidth,
    designHeight
  };
}

/**
 * Calculates the proportional scale for an opening / cover screen so the entire cover
 * (including text and Open Invitation button) fits cleanly inside the available viewport
 * while strictly preserving its design aspect ratio.
 */
export function calculateOpeningCoverScale(params: {
  designWidth: number;
  designHeight: number;
  containerWidth: number;
  containerHeight: number;
}): CanvasScaleMetrics {
  const designWidth = Math.max(1, params.designWidth || 520);
  const designHeight = Math.max(1, params.designHeight || 400);
  const containerWidth = Math.max(240, params.containerWidth || MOBILE_BASE_WIDTH);
  const containerHeight = Math.max(240, params.containerHeight || MOBILE_BASE_HEIGHT);

  const isWideScreen = containerWidth >= 640;
  const isLandscapeCover = designWidth >= designHeight;

  const padX = isWideScreen ? 40 : (isLandscapeCover ? 16 : 0);
  const padY = isWideScreen ? 48 : (isLandscapeCover ? 24 : 0);

  const availW = Math.max(200, containerWidth - padX);
  const availH = Math.max(200, containerHeight - padY);

  const fitScale = Math.min(availW / designWidth, availH / designHeight);

  // Prevent portrait covers from expanding excessively on ultra-wide monitors,
  // while allowing comfortable upscale for compact cover cards (e.g. 520x400).
  const maxScale = designHeight > designWidth
    ? Math.min(1.22, 470 / designWidth)
    : 1.25;

  const scale = Math.min(fitScale, maxScale);

  return {
    scale,
    scaledWidth: Math.round(designWidth * scale),
    scaledHeight: Math.round(designHeight * scale),
    designWidth,
    designHeight
  };
}
