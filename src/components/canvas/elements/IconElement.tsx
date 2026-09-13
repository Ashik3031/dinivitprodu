import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ElementStyle, ElementContent } from '../../../types';

interface IconElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const IconElement: React.FC<IconElementProps> = ({ style, content }) => {
  const iconName = content.iconName || 'Heart';
  const size = content.iconSize || Math.min(style.width, style.height) * 0.6 || 32;
  const color = content.iconColor || style.color || '#d4af37';
  const strokeWidth = content.iconStrokeWidth || 1.75;
  const bgColor = content.iconBgColor || style.backgroundColor || 'transparent';
  const borderRadius = content.iconBorderRadius ?? (style.borderRadius ? Number(style.borderRadius) : 0);

  // Safely find the icon component in LucideIcons with case-insensitivity and friendly aliases
  const rawName = (content.iconName || 'Heart').trim();
  const pascalName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  
  const ICON_ALIASES: Record<string, string> = {
    ring: 'Gem',
    rings: 'Gem',
    rose: 'Flower2',
    flower: 'Flower2',
    dove: 'Bird',
    bird: 'Bird',
    butterfly: 'Sparkles',
    cheers: 'Wine',
    champagne: 'Wine',
    gift: 'Gift',
    sparkle: 'Sparkles',
    sparkles: 'Sparkles',
    mail: 'Mail',
    envelope: 'Mail',
    letter: 'Mail',
    star: 'Star',
    crown: 'Crown',
    heart: 'Heart',
    hearts: 'Heart',
    gem: 'Gem',
    leaf: 'Leaf',
    moon: 'Moon',
    sun: 'Sun',
    bell: 'Bell',
    music: 'Music',
    infinity: 'Infinity',
    flame: 'Flame'
  };

  const resolvedName =
    ICON_ALIASES[rawName.toLowerCase()] ||
    pascalName;

  const IconComponent =
    (LucideIcons as any)[resolvedName] ||
    (LucideIcons as any)[rawName] ||
    (LucideIcons as any)[pascalName] ||
    (LucideIcons as any)[
      Object.keys(LucideIcons).find((k) => k.toLowerCase() === rawName.toLowerCase()) || ''
    ] ||
    LucideIcons.Heart;

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none transition-all"
      style={{
        backgroundColor: bgColor,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
        borderColor: style.borderColor,
        borderStyle: style.borderStyle || 'solid',
        boxShadow: style.boxShadow,
        opacity: style.opacity ?? 1
      }}
    >
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className="transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};
