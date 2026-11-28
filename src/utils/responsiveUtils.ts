import { CanvasElement, ElementStyle, ViewportMode, ResponsiveStyleOverride, ResponsiveVisibility, InvitationPage } from '../types';

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
    width: 768,
    height: 900,
    label: 'Desktop',
    name: 'Desktop Display (768px)'
  }
};

/**
 * Resolves whether an element is hidden for a given viewport device mode.
 */
export function resolveElementVisibility(
  element: CanvasElement,
  mode: ViewportMode = 'mobile'
): boolean {
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

  return isHidden;
}

/**
 * Resolves the active style and visibility of a canvas element for a given viewport mode.
 * Coordinates remain relative to the logical canvas (no arbitrary horizontal viewport offset).
 */
export function resolveElementForViewport(
  element: CanvasElement,
  mode: ViewportMode = 'mobile'
): { style: ElementStyle; isHidden: boolean } {
  const baseStyle = element.style || { x: 0, y: 0, width: 200, height: 50 };
  const override = element.responsive?.[mode];
  const isHidden = resolveElementVisibility(element, mode);

  const rawX = baseStyle.x ?? 0;
  const rawY = baseStyle.y ?? 0;
  const rawWidth = baseStyle.width ?? 200;
  const rawHeight = baseStyle.height ?? 50;

  // Merge override properties into base style without shifting coordinates
  const mergedStyle: ElementStyle = {
    ...baseStyle,
    x: override?.x !== undefined ? override.x : rawX,
    y: override?.y !== undefined ? override.y : rawY,
    width: override?.width !== undefined ? override.width : rawWidth,
    height: override?.height !== undefined ? override.height : rawHeight,
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
 * Resolves an element for the unified mobile-first logical canvas.
 * Geometry always stays in the mobile-first authoring coordinate space so the entire
 * canvas scales proportionally across devices without shifting or clipping elements.
 * Visibility respects device-specific responsiveVisibility flags.
 */
export function resolveElementForCanvas(
  element: CanvasElement,
  deviceMode: ViewportMode = 'mobile'
): { style: ElementStyle; isHidden: boolean } {
  const { style } = resolveElementForViewport(element, 'mobile');
  const isHidden = resolveElementVisibility(element, deviceMode);
  return { style, isHidden };
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

/**
 * Returns framer-motion page transition variants for smooth vertical page transitions.
 */
export function getPageTransitionVariants(
  type: string = 'fade',
  duration: number = 0.6
) {
  switch (type) {
    case 'slide-vertical':
    case 'slide-up':
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } }
      };
    case 'slide-horizontal':
      return {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } }
      };
    case 'slide-down':
      return {
        initial: { opacity: 0, y: -60 },
        animate: { opacity: 1, y: 0, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } }
      };
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } }
      };
    case 'flip':
      return {
        initial: { opacity: 0, rotateY: 60, perspective: 1200 },
        animate: { opacity: 1, rotateY: 0, perspective: 1200, transition: { duration, ease: [0.22, 1, 0.36, 1] } }
      };
    case 'cube':
      return {
        initial: { opacity: 0, rotateX: 30, scale: 0.96 },
        animate: { opacity: 1, rotateX: 0, scale: 1, transition: { duration, ease: [0.22, 1, 0.36, 1] } }
      };
    case 'curtain':
      return {
        initial: { opacity: 0, scaleY: 0.95 },
        animate: { opacity: 1, scaleY: 1, transition: { duration, ease: 'easeInOut' } }
      };
    case 'none':
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 }
      };
    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration, ease: 'easeInOut' } }
      };
  }
}

/**
 * Unified calculation of logical page height across Editor Canvas and Published/Preview View.
 * Preserves the logical design aspect ratio regardless of the visitor's monitor height.
 */
export function getPageCalculatedHeight(
  page?: InvitationPage | null,
  mode: ViewportMode = 'mobile',
  _currentWindowHeight?: number,
  defaultHeight: number = 844
): number {
  if (!page) return defaultHeight;

  // Auto Height Mode (fits content bounds snugly with breathing room)
  if (page.heightMode === 'auto') {
    const maxBottom = (page.elements || []).reduce((max, el) => {
      if (el.parentContainerId || el.parentId || el.isHidden) return max;
      const { style: s, isHidden } = resolveElementForCanvas(el, mode);
      if (isHidden) return max;
      return Math.max(max, (s.y || 0) + (s.height || 40));
    }, 0);
    // Auto wraps with 60px bottom padding, minimum 480px
    return Math.max(480, maxBottom + 60);
  }

  // Viewport and Custom modes use the fixed logical design height so aspect ratio
  // and background image composition remain identical across all screen sizes.
  return page.height && page.height > 0 ? page.height : defaultHeight;
}

/**
 * Returns the canonical logical design dimensions (width x height) for an invitation page
 * or opening screen page.
 */
export function getPageLogicalDimensions(
  page?: InvitationPage | null,
  options?: { isOpeningScreen?: boolean; deviceMode?: ViewportMode }
): { width: number; height: number } {
  const isOpening = Boolean(options?.isOpeningScreen);
  const defaultWidth = isOpening ? 520 : CANVAS_BREAKPOINTS.mobile.width;
  const defaultHeight = isOpening ? 400 : CANVAS_BREAKPOINTS.mobile.height;

  const width = page?.width && page.width > 0 ? page.width : defaultWidth;
  const height = getPageCalculatedHeight(page, options?.deviceMode || 'mobile', undefined, defaultHeight);

  return { width, height };
}
