import React from 'react';
import {
  BackgroundConfig,
  CanvasElement,
  InvitationPage,
  ViewportMode
} from '../../types';
import { ElementRenderer } from './ElementRenderer';
import {
  getPageLogicalDimensions,
  resolveElementForCanvas
} from '../../utils/responsiveUtils';
import {
  getPageBgStyle,
  getBackgroundOverlayStyle,
  getVideoBackgroundStyle
} from '../../utils/backgroundStyles';

interface PageBackgroundLayerProps {
  background?: BackgroundConfig;
  fallbackBgColor?: string;
}

/**
 * Shared background & overlay layer used by both the Editor Canvas and Public Renderer.
 * Guarantees 100% parity for solid colors, gradients, images (fit, alignment, X/Y, zoom),
 * video backgrounds, and contrast dim overlays.
 */
export const PageBackgroundLayer: React.FC<PageBackgroundLayerProps> = ({
  background,
  fallbackBgColor = '#f8fafc'
}) => {
  const bgStyle = getPageBgStyle(background, fallbackBgColor);
  const overlayStyle = getBackgroundOverlayStyle(background);
  const videoStyle = getVideoBackgroundStyle(background);

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={bgStyle}
      />

      {background?.type === 'video' && background.videoUrl && (
        <video
          key={background.videoUrl}
          src={background.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          ref={(el) => {
            if (el) {
              el.defaultMuted = true;
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            v.defaultMuted = true;
            v.muted = true;
            v.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={videoStyle}
        />
      )}

      {overlayStyle && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={overlayStyle}
        />
      )}
    </>
  );
};

interface InvitationPageRendererProps {
  page: InvitationPage;
  scale?: number;
  deviceMode?: ViewportMode;
  isOpeningScreen?: boolean;
  fallbackBgColor?: string;
  scrollY?: number;
  pageIndex?: number;
  filterElement?: (el: CanvasElement) => boolean;
  onActionClick?: (actionType: string, payload?: any, element?: CanvasElement) => void;
  onOpenRSVP?: () => void;
  onOpenGuestbook?: () => void;
  forceAnimate?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Unified single-source-of-truth page renderer.
 * Renders the logical design canvas (width x height) and scales it proportionally
 * via CSS transform (origin top-left) inside an outer wrapper sized to the exact
 * scaled dimensions so layout, aspect ratio, backgrounds, and pointer hitboxes match everywhere.
 */
export const InvitationPageRenderer: React.FC<InvitationPageRendererProps> = ({
  page,
  scale = 1,
  deviceMode = 'mobile' as ViewportMode,
  isOpeningScreen = false,
  fallbackBgColor = '#f8fafc',
  scrollY = 0,
  pageIndex = 0,
  filterElement,
  onActionClick,
  onOpenRSVP,
  onOpenGuestbook,
  forceAnimate = false,
  className = '',
  children
}) => {
  const resolvedDeviceMode: ViewportMode = deviceMode;
  const { width: designWidth, height: designHeight } = getPageLogicalDimensions(page, {
    isOpeningScreen,
    deviceMode: resolvedDeviceMode
  });

  const safeScale = scale > 0 ? scale : 1;
  const scaledWidth = Math.round(designWidth * safeScale);
  const scaledHeight = Math.round(designHeight * safeScale);

  const elements = page?.elements || [];
  const topLevelElements = elements.filter((el) => {
    if (el.parentContainerId || el.parentId || el.isHidden) return false;
    const { isHidden } = resolveElementForCanvas(el, resolvedDeviceMode);
    if (isHidden) return false;
    if (filterElement && !filterElement(el)) return false;
    return true;
  });

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${className}`}
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: safeScale !== 1 ? `scale(${safeScale})` : undefined,
          transformOrigin: 'top left'
        }}
      >
        <PageBackgroundLayer
          background={page.background}
          fallbackBgColor={fallbackBgColor}
        />

        {topLevelElements.map((element) => {
          const { style: resolvedStyle } = resolveElementForCanvas(element, resolvedDeviceMode);

          let parallaxTransform = '';
          if (element.animation?.parallax?.enabled) {
            const pSpeed = element.animation.parallax.speed || 0.2;
            const pOffset = (scrollY - pageIndex * designHeight) * pSpeed * 0.15;
            if (element.animation.parallax.direction === 'horizontal') {
              parallaxTransform = `translateX(${pOffset}px) `;
            } else {
              parallaxTransform = `translateY(${pOffset}px) `;
            }
          }

          const rotationTransform = resolvedStyle.rotation
            ? `rotate(${resolvedStyle.rotation}deg)`
            : '';

          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${resolvedStyle.x}px`,
                top: `${resolvedStyle.y}px`,
                width: `${resolvedStyle.width}px`,
                height: `${resolvedStyle.height}px`,
                transform: `${parallaxTransform}${rotationTransform}`.trim() || undefined,
                zIndex: resolvedStyle.zIndex || 1,
                willChange: element.animation?.parallax?.enabled ? 'transform' : undefined
              }}
            >
              <ElementRenderer
                element={element}
                viewportMode={resolvedDeviceMode}
                isEditor={false}
                forceAnimate={forceAnimate}
                onActionClick={(actionType, payload) =>
                  onActionClick?.(actionType, payload, element)
                }
                onOpenRSVP={onOpenRSVP}
                onOpenGuestbook={onOpenGuestbook}
                allElements={elements}
              />
            </div>
          );
        })}

        {children}
      </div>
    </div>
  );
};
