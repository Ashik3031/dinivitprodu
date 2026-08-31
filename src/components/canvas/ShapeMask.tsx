import React from 'react';
import { ContainerShape, BackgroundConfig, ElementStyle } from '../../types';

interface ShapeMaskProps {
  shape?: ContainerShape;
  style: ElementStyle;
  children?: React.ReactNode;
  className?: string;
  isEditor?: boolean;
}

export const ShapeMask: React.FC<ShapeMaskProps> = ({
  shape = 'rectangle',
  style,
  children,
  className = '',
  isEditor = false
}) => {
  const getClipPath = (shapeType: ContainerShape, svgPath?: string): string | undefined => {
    switch (shapeType) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'oval':
        return 'ellipse(50% 50% at 50% 50%)';
      case 'arch':
        // Modern architectural arch: flat bottom, fully rounded top dome
        return 'polygon(0% 100%, 0% 35%, 3% 25%, 8% 17%, 16% 10%, 26% 5%, 38% 1.5%, 50% 0%, 62% 1.5%, 74% 5%, 84% 10%, 92% 17%, 97% 25%, 100% 35%, 100% 100%)';
      case 'heart':
        return 'path("M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 Z")';
      case 'diamond':
        return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      case 'hexagon':
        return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'ticket':
        return 'polygon(0% 0%, 100% 0%, 100% 38%, 92% 50%, 100% 62%, 100% 100%, 0% 100%, 0% 62%, 8% 50%, 0% 38%)';
      case 'shield':
        return 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)';
      case 'scallop':
        return 'polygon(0% 10%, 10% 0%, 20% 10%, 30% 0%, 40% 10%, 50% 0%, 60% 10%, 70% 0%, 80% 10%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 80% 90%, 70% 100%, 60% 90%, 50% 100%, 40% 90%, 30% 100%, 20% 90%, 10% 100%, 0% 90%)';
      case 'wave':
        return 'polygon(0% 0%, 100% 0%, 100% 85%, 75% 100%, 50% 85%, 25% 100%, 0% 85%)';
      case 'ribbon':
        return 'polygon(0% 0%, 100% 0%, 90% 50%, 100% 100%, 0% 100%, 10% 50%)';
      case 'svg-custom':
        return svgPath ? `path("${svgPath}")` : undefined;
      default:
        return undefined;
    }
  };

  const getBorderRadius = (): string | number | undefined => {
    if (shape === 'circle') return '9999px';
    if (shape === 'oval') return '50%';
    if (shape === 'arch') return '160px 160px 0 0';
    if (shape === 'rounded-rectangle') {
      const r = style.borderRadius !== undefined ? style.borderRadius : 20;
      return typeof r === 'number' ? `${r}px` : r;
    }
    if (shape === 'square' || shape === 'rectangle') {
      const r = style.borderRadius !== undefined ? style.borderRadius : 0;
      return typeof r === 'number' ? `${r}px` : r;
    }
    return style.borderRadius ? `${style.borderRadius}px` : undefined;
  };

  const computeBackgroundStyle = (bg?: BackgroundConfig) => {
    if (!bg) {
      return {
        backgroundColor: style.backgroundColor || 'transparent'
      };
    }

    switch (bg.type) {
      case 'color':
        return { backgroundColor: bg.color || style.backgroundColor || 'transparent' };
      case 'gradient':
        if (bg.gradient) {
          const colors = bg.gradient.colors && bg.gradient.colors.length > 0 
            ? bg.gradient.colors.join(', ') 
            : '#ffffff, #000000';
          const angle = bg.gradient.angle ?? 180;
          return {
            background: bg.gradient.type === 'radial'
              ? `radial-gradient(circle at center, ${colors})`
              : `linear-gradient(${angle}deg, ${colors})`
          };
        }
        return { backgroundColor: style.backgroundColor || 'transparent' };
      case 'image':
      case 'pattern':
      case 'texture': {
        const url = bg.imageUrl || bg.pattern || bg.texture;
        return {
          backgroundImage: url ? `url("${url}")` : undefined,
          backgroundSize: bg.size || (bg.type === 'pattern' ? 'auto' : (style.objectFit || 'cover')),
          backgroundRepeat: bg.repeat || (bg.type === 'pattern' ? 'repeat' : 'no-repeat'),
          backgroundPosition: bg.position || 'center',
          backgroundColor: style.backgroundColor || 'transparent'
        };
      }
      case 'video':
        return { backgroundColor: style.backgroundColor || '#000000' };
      default:
        return { backgroundColor: style.backgroundColor || 'transparent' };
    }
  };

  const currentShape = (shape || 'rectangle') as ContainerShape;
  const isPolygonClipped = ['circle', 'oval', 'arch', 'diamond', 'hexagon', 'ticket', 'shield', 'scallop', 'wave', 'ribbon', 'svg-custom'].includes(currentShape);
  const clipPathStyle = style.clipMask || isPolygonClipped ? getClipPath(currentShape, style.svgShapePath) : undefined;
  const borderRadius = getBorderRadius();
  const bgStyles = computeBackgroundStyle(style.background);

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: borderRadius,
        clipPath: clipPathStyle,
        WebkitClipPath: clipPathStyle,
        borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
        borderColor: style.borderColor,
        borderStyle: style.borderStyle || (style.borderWidth ? 'solid' : undefined),
        boxShadow: style.boxShadow,
        backdropFilter: style.backdropBlur ? `blur(${style.backdropBlur}px)` : undefined,
        WebkitBackdropFilter: style.backdropBlur ? `blur(${style.backdropBlur}px)` : undefined,
        opacity: style.opacity ?? 1,
        overflow: 'hidden', // Always mask media and child overflow inside container bounds
        padding: style.padding ? `${style.padding}px` : undefined,
        ...bgStyles
      }}
    >
      {/* Background Image if background.type === 'image' and has url */}
      {style.background?.type === 'image' && style.background.imageUrl && (
        <img
          src={style.background.imageUrl}
          alt="Container Background"
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          style={{ objectFit: style.objectFit || (style.background.size === 'contain' ? 'contain' : 'cover') }}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Video Background if type is video */}
      {style.background?.type === 'video' && style.background.videoUrl && (
        <video
          src={style.background.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />
      )}

      {/* Color Overlay for image/video readability */}
      {style.background?.overlayColor && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundColor: style.background.overlayColor,
            opacity: style.background.overlayOpacity ?? 0.3
          }}
        />
      )}

      {/* Container Content & Children Slot */}
      <div className="relative w-full h-full z-10">{children}</div>
    </div>
  );
};
