import React from 'react';
import { ElementStyle, ElementContent } from '../../../types';

interface ShapeElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const ShapeElement: React.FC<ShapeElementProps> = ({ style, content }) => {
  const shapeType = style.shapeType || style.shape || 'rectangle';
  const fill = style.fillColor || style.backgroundColor || '#d4af37';
  const stroke = style.strokeColor || style.borderColor || 'none';
  const strokeWidth = style.strokeWidth ?? (style.borderWidth || 0);
  const strokeDash = style.strokeDashArray;

  const renderShapeSvg = () => {
    switch (shapeType) {
      case 'circle':
        return (
          <circle
            cx="50"
            cy="50"
            r="48"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'oval':
        return (
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="38"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'heart':
        return (
          <path
            d="M50,88 C50,88 10,60 10,34 C10,18 24,10 36,10 C44,10 48,16 50,22 C52,16 56,10 64,10 C76,10 90,18 90,34 C90,60 50,88 50,88 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'star':
        return (
          <polygon
            points="50,5 64,36 98,36 70,57 81,90 50,70 19,90 30,57 2,36 36,36"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'diamond':
        return (
          <polygon
            points="50,5 95,50 50,95 5,50"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'hexagon':
        return (
          <polygon
            points="50,5 92,27 92,73 50,95 8,73 8,27"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'triangle':
        return (
          <polygon
            points="50,8 94,90 6,90"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'arrow':
        return (
          <polygon
            points="10,35 60,35 60,15 95,50 60,85 60,65 10,65"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'badge':
        return (
          <path
            d="M50 0 L61 11 L77 7 L83 22 L98 26 L96 42 L107 53 L96 64 L98 80 L83 84 L77 99 L61 95 L50 106 L39 95 L23 99 L17 84 L2 80 L4 64 L-7 53 L4 42 L2 26 L17 22 L23 7 L39 11 Z"
            transform="scale(0.85) translate(8, 0)"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'ribbon':
        return (
          <path
            d="M10,20 L90,20 L80,50 L90,80 L10,80 L20,50 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'rounded-rectangle':
      default:
        return (
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx={typeof style.borderRadius === 'number' ? Math.min(48, style.borderRadius / 2) : 12}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      style={{
        opacity: style.opacity ?? 1,
        filter: style.boxShadow ? `drop-shadow(${style.boxShadow})` : undefined
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        {renderShapeSvg()}
      </svg>
    </div>
  );
};
