import React from 'react';
import { Sparkles } from 'lucide-react';
import { ElementStyle, ElementContent } from '../../../types';

interface DividerElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const DividerElement: React.FC<DividerElementProps> = ({
  style,
  content
}) => {
  const dividerStyle = style.dividerStyle || 'solid';
  const color = style.borderColor || style.color || '#d4af37';
  const thickness = style.dividerThickness || style.borderWidth || 1;

  if (dividerStyle === 'ornamental') {
    return (
      <div className="w-full h-full flex items-center justify-center select-none px-2">
        <svg
          viewBox="0 0 300 24"
          className="w-full h-full max-h-6 overflow-visible"
          fill="none"
        >
          {/* Left line */}
          <line x1="10" y1="12" x2="110" y2="12" stroke={color} strokeWidth={thickness} strokeOpacity="0.6" />
          {/* Center flourish diamond */}
          <path
            d="M150 2 L160 12 L150 22 L140 12 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.5"
          />
          <circle cx="125" cy="12" r="2.5" fill={color} />
          <circle cx="175" cy="12" r="2.5" fill={color} />
          {/* Right line */}
          <line x1="190" y1="12" x2="290" y2="12" stroke={color} strokeWidth={thickness} strokeOpacity="0.6" />
        </svg>
      </div>
    );
  }

  if (dividerStyle === 'floral') {
    return (
      <div className="w-full h-full flex items-center justify-center select-none px-2">
        <svg
          viewBox="0 0 300 24"
          className="w-full h-full max-h-6 overflow-visible"
          fill="none"
        >
          <line x1="15" y1="12" x2="115" y2="12" stroke={color} strokeWidth={thickness} strokeOpacity="0.5" />
          {/* Leaf pair center */}
          <path
            d="M150 12 C145 6 135 6 135 12 C135 18 145 18 150 12 Z M150 12 C155 6 165 6 165 12 C165 18 155 18 150 12 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.5"
          />
          <circle cx="150" cy="12" r="2" fill={color} />
          <line x1="185" y1="12" x2="285" y2="12" stroke={color} strokeWidth={thickness} strokeOpacity="0.5" />
        </svg>
      </div>
    );
  }

  if (dividerStyle === 'diamond') {
    return (
      <div className="w-full h-full flex items-center justify-center select-none px-2">
        <div className="w-full flex items-center justify-center gap-2">
          <div className="flex-1 h-[1px]" style={{ backgroundColor: color, opacity: 0.5 }} />
          <div
            className="w-2.5 h-2.5 rotate-45 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div
            className="w-1.5 h-1.5 rotate-45 flex-shrink-0 opacity-70"
            style={{ backgroundColor: color }}
          />
          <div
            className="w-2.5 h-2.5 rotate-45 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1 h-[1px]" style={{ backgroundColor: color, opacity: 0.5 }} />
        </div>
      </div>
    );
  }

  if (dividerStyle === 'stars') {
    return (
      <div className="w-full h-full flex items-center justify-center select-none px-2">
        <div className="w-full flex items-center justify-center gap-3">
          <div className="flex-1 h-[1px]" style={{ backgroundColor: color, opacity: 0.5 }} />
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
          <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color }} />
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
          <div className="flex-1 h-[1px]" style={{ backgroundColor: color, opacity: 0.5 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <div
        className="w-full"
        style={{
          borderTopWidth: `${thickness}px`,
          borderTopColor: color,
          borderTopStyle: (dividerStyle as any) || 'solid',
          opacity: style.opacity ?? 1
        }}
      />
    </div>
  );
};
