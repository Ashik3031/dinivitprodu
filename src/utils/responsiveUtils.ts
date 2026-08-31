import { CanvasElement, ElementStyle, ViewportMode, ResponsiveStyleOverride, ResponsiveVisibility } from '../types';

export const CANVAS_BREAKPOINTS: Record<ViewportMode, { width: number; height: number; label: string; name: string }> = {
  mobile: {
    width: 390,
    height: 844,
    label: 'Mobile',
    name: 'iPhone 14 / Mobile (390px)'
  },
  tablet: {
    width: 768,
    height: 1024,
    label: 'Tablet',
    name: 'iPad / Tablet (768px)'
  },
  desktop: {
    width: 960,
    height: 900,
    label: 'Desktop',
    name: 'Desktop Display (960px)'
  }
};

/**
 * Resolves the active style and visibility of a canvas element for a given viewport mode.
 */
export function resolveElementForViewport(
  element: CanvasElement,
  mode: ViewportMode = 'mobile'
): { style: ElementStyle; isHidden: boolean } {
  const baseStyle = element.style || { x: 0, y: 0, width: 200, height: 50 };
  const override = element.responsive?.[mode];
  const vis = element.responsiveVisibility;

  let isHidden = !!element.isHidden;

  if (vis) {
    if (mode === 'mobile' && vis.hideOnMobile) isHidden = true;
    if (mode === 'tablet' && vis.hideOnTablet) isHidden = true;
    if (mode === 'desktop' && vis.hideOnDesktop) isHidden = true;
  }

  if (override?.isHidden !== undefined) {
    isHidden = override.isHidden;
  }

  // Merge override properties into base style
  const mergedStyle: ElementStyle = {
    ...baseStyle,
    x: override?.x !== undefined ? override.x : baseStyle.x,
    y: override?.y !== undefined ? override.y : baseStyle.y,
    width: override?.width !== undefined ? override.width : baseStyle.width,
    height: override?.height !== undefined ? override.height : baseStyle.height,
    fontSize: override?.fontSize !== undefined ? override.fontSize : baseStyle.fontSize,
    lineHeight: override?.lineHeight !== undefined ? override.lineHeight : baseStyle.lineHeight,
    textAlign: override?.textAlign !== undefined ? override.textAlign : baseStyle.textAlign,
    letterSpacing: override?.letterSpacing !== undefined ? override.letterSpacing : baseStyle.letterSpacing,
    padding: override?.padding !== undefined ? override.padding : baseStyle.padding
  };

  return {
    style: mergedStyle,
    isHidden
  };
}

/**
 * Updates a specific viewport override for an element while preserving base styles.
 */
export function setElementResponsiveOverride(
  element: CanvasElement,
  mode: ViewportMode,
  overrideUpdates: Partial<ResponsiveStyleOverride>
): CanvasElement {
  const currentResponsive = element.responsive || {};
  const currentModeOverride = currentResponsive[mode] || {};

  return {
    ...element,
    responsive: {
      ...currentResponsive,
      [mode]: {
        ...currentModeOverride,
        ...overrideUpdates
      }
    }
  };
}

/**
 * Toggles responsive device visibility flags.
 */
export function setResponsiveVisibility(
  element: CanvasElement,
  visibilityUpdates: Partial<ResponsiveVisibility>
): CanvasElement {
  return {
    ...element,
    responsiveVisibility: {
      ...(element.responsiveVisibility || {}),
      ...visibilityUpdates
    }
  };
}

/**
 * Auto-scales an element's position, size, and font size when adapting from one viewport to another.
 */
export function autoScaleElementForViewport(
  element: CanvasElement,
  targetMode: ViewportMode,
  sourceMode: ViewportMode = 'mobile'
): ResponsiveStyleOverride {
  const { style } = resolveElementForViewport(element, sourceMode);
  const srcWidth = CANVAS_BREAKPOINTS[sourceMode].width;
  const tgtWidth = CANVAS_BREAKPOINTS[targetMode].width;
  const ratio = tgtWidth / srcWidth;

  const newWidth = Math.round(style.width * Math.min(ratio, 1.8));
  const newHeight = Math.round(style.height * Math.min(ratio, 1.6));
  const newX = Math.round((tgtWidth - newWidth) / 2); // Center horizontally by default on scale
  const newY = Math.round(style.y * Math.min(ratio, 1.3));
  const newFontSize = style.fontSize ? Math.round(style.fontSize * Math.min(ratio, 1.5)) : undefined;

  return {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
    fontSize: newFontSize
  };
}
