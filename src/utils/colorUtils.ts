import { CanvasElement, ElementColorTokens, ElementStyle, InvitationTheme } from '../types';

/**
 * Standard Luxury Palette Swatches
 */
export const LUXURY_PALETTE_SWATCHES = [
  '#d4af37', // Gold
  '#c5a059', // Warm Champagne Gold
  '#b45309', // Amber Bronze
  '#e11d48', // Rose Romance
  '#059669', // Emerald
  '#0f172a', // Midnight Navy
  '#1e293b', // Slate Dark
  '#334155', // Slate Medium
  '#64748b', // Slate Soft
  '#94a3b8', // Muted Gray
  '#cbd5e1', // Light Gray
  '#f8fafc', // Soft White
  '#ffffff', // Pure White
  '#020617', // Deep Charcoal
  '#000000', // Black
  '#7c3aed'  // Royal Lavender
];

/**
 * Common color preset definitions
 */
export const DESIGN_STYLE_PRESETS = [
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    primary: '#d4af37',
    bg: '#0f172a',
    border: '#d4af37',
    font: "'Cinzel', serif",
    text: '#ffffff',
    description: 'Regal navy & metallic gold'
  },
  {
    id: 'rose-romance',
    name: 'Rose Romance',
    primary: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
    font: "'Great Vibes', cursive",
    text: '#881337',
    description: 'Romantic blush & rose'
  },
  {
    id: 'emerald-luxe',
    name: 'Emerald Luxe',
    primary: '#10b981',
    bg: '#022c22',
    border: '#059669',
    font: "'Cormorant Garamond', serif",
    text: '#ecfdf5',
    description: 'Deep forest & vibrant emerald'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#f8fafc',
    bg: '#090d16',
    border: '#334155',
    font: "'Playfair Display', serif",
    text: '#f8fafc',
    description: 'Stark black & platinum'
  },
  {
    id: 'champagne',
    name: 'Champagne',
    primary: '#b45309',
    bg: '#fefce8',
    border: '#fde68a',
    font: "'Playfair Display', serif",
    text: '#78350f',
    description: 'Warm cream & golden amber'
  },
  {
    id: 'modern-light',
    name: 'Modern Minimal',
    primary: '#0f172a',
    bg: '#ffffff',
    border: '#e2e8f0',
    font: "'Montserrat', sans-serif",
    text: '#0f172a',
    description: 'Clean monochrome & slate'
  },
  {
    id: 'lavender',
    name: 'Lavender Whisper',
    primary: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    font: "'Alex Brush', cursive",
    text: '#581c87',
    description: 'Soft violet & lilac'
  },
  {
    id: 'glass-frost',
    name: 'Glass Frost',
    primary: '#ffffff',
    bg: 'rgba(15, 23, 42, 0.75)',
    border: 'rgba(255, 255, 255, 0.25)',
    font: "'Cinzel', serif",
    text: '#ffffff',
    description: 'Translucent frosted glass'
  }
];

/**
 * Font Pairing Presets
 */
export const FONT_PAIRING_PRESETS = [
  {
    id: 'royal-editorial',
    name: 'Royal Editorial',
    headingFont: "'Cinzel', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    category: 'Formal / Royal'
  },
  {
    id: 'romantic-script',
    name: 'Romantic Script',
    headingFont: "'Great Vibes', cursive",
    bodyFont: "'Montserrat', sans-serif",
    category: 'Wedding Romance'
  },
  {
    id: 'classic-elegance',
    name: 'Classic Elegance',
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",
    category: 'Traditional'
  },
  {
    id: 'modern-clean',
    name: 'Modern Minimal',
    headingFont: "'Montserrat', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    category: 'Clean Contemporary'
  },
  {
    id: 'french-chateau',
    name: 'French Chateau',
    headingFont: "'Parisienne', cursive",
    bodyFont: "'Cinzel', serif",
    category: 'Whimsical'
  }
];

const RECENT_COLORS_KEY = 'dis_recent_colors';

export function getRecentColors(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_COLORS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    return [];
  }
}

export function saveRecentColor(color: string) {
  if (!color || color === 'transparent') return;
  try {
    const recents = getRecentColors().filter((c) => c.toLowerCase() !== color.toLowerCase());
    recents.unshift(color);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(recents.slice(0, 10)));
  } catch {
    // ignore
  }
}

/**
 * Copies visual style from an element (omitting content, IDs, positions, etc.)
 */
let copiedStyleBuffer: Partial<ElementStyle> | null = null;

export function copyElementStyle(element: CanvasElement): void {
  const { style } = element;
  copiedStyleBuffer = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    textTransform: style.textTransform,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
    borderWidth: style.borderWidth,
    borderColor: style.borderColor,
    borderStyle: style.borderStyle,
    boxShadow: style.boxShadow,
    opacity: style.opacity,
    padding: style.padding,
    colors: style.colors ? { ...style.colors } : undefined
  };
}

export function getCopiedStyle(): Partial<ElementStyle> | null {
  return copiedStyleBuffer;
}

/**
 * Resolves color with precedence:
 * 1. Specific token from `style.colors?.[role]`
 * 2. General element color / background / border
 * 3. Fallback
 */
export function resolveColorToken(
  style: ElementStyle | undefined,
  role: keyof ElementColorTokens,
  generalFallback?: string
): string {
  if (style?.colors && style.colors[role]) {
    return style.colors[role]!;
  }
  return generalFallback || '#d4af37';
}

/**
 * Checks whether a given color (HEX / RGB) is visually dark
 */
export function isDarkColor(color: string | undefined): boolean {
  if (!color || color === 'transparent') return false;
  let hex = color.trim().toLowerCase();
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) {
    const parts = hex.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = Number(parts[0]);
      const g = Number(parts[1]);
      const b = Number(parts[2]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
    return false;
  }
  if (hex.startsWith('#')) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
  }
  return false;
}

/**
 * Calculate WCAG contrast ratio between text and background color
 * Returns value between 1 and 21. Below 3.0 is poor contrast.
 */
export function getContrastRatio(fg: string, bg: string): number {
  if (!fg || !bg || bg === 'transparent') return 4.5;
  const getLum = (hexStr: string) => {
    let clean = hexStr.replace('#', '').trim();
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    if (clean.length < 6) return 0.5;
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  try {
    const l1 = getLum(fg);
    const l2 = getLum(bg);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5;
  }
}
