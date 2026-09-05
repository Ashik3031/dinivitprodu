export interface StockFrameOrSticker {
  id: string;
  name: string;
  title: string;
  type: 'frame' | 'sticker' | 'decoration' | 'image';
  category: 'frames' | 'stickers' | 'luxury' | 'floral' | 'vintage' | 'minimal';
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  dimensions?: { width: number; height: number };
}

// Crisp inline SVGs encoded as reliable data URIs that work in <img>, background, and canvas overlay
const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

// 1. Royal Gold Arch Frame (transparent window inside)
const SVG_FRAME_ARCH = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600" fill="none">
  <!-- Outer Arch Border -->
  <path d="M 20 200 A 180 180 0 0 1 380 200 L 380 570 A 10 10 0 0 1 370 580 L 30 580 A 10 10 0 0 1 20 570 Z" 
        stroke="#d4af37" stroke-width="2.5" fill="none"/>
  <!-- Inner Arch Border -->
  <path d="M 32 204 A 168 168 0 0 1 368 204 L 368 558 A 6 6 0 0 1 362 568 L 38 568 A 6 6 0 0 1 32 558 Z" 
        stroke="#d4af37" stroke-width="1" stroke-dasharray="4 3" fill="none" opacity="0.85"/>
  <!-- Top Finial Ornament -->
  <circle cx="200" cy="16" r="5" fill="#d4af37"/>
  <path d="M 195 24 L 205 24 M 200 19 L 200 29" stroke="#d4af37" stroke-width="1.5"/>
  <!-- Corner Accents at Arch Spring -->
  <path d="M 16 195 L 35 195 M 20 180 L 20 210" stroke="#d4af37" stroke-width="1.5"/>
  <path d="M 365 195 L 384 195 M 380 180 L 380 210" stroke="#d4af37" stroke-width="1.5"/>
  <!-- Bottom Corner Flourishes -->
  <path d="M 20 560 L 20 580 L 40 580" stroke="#d4af37" stroke-width="2.5"/>
  <path d="M 380 560 L 380 580 L 360 580" stroke="#d4af37" stroke-width="2.5"/>
</svg>
`);

// 2. Baroque Filigree Vintage Frame
const SVG_FRAME_BAROQUE = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560" fill="none">
  <!-- Outer Rectangle -->
  <rect x="18" y="18" width="364" height="524" rx="4" stroke="#c59b27" stroke-width="2"/>
  <!-- Inner Fine Line -->
  <rect x="28" y="28" width="344" height="504" rx="2" stroke="#d4af37" stroke-width="1" stroke-opacity="0.8"/>
  
  <!-- Top-Left Corner Filigree -->
  <g transform="translate(18, 18)" stroke="#d4af37" stroke-width="1.5" fill="none">
    <path d="M 0 35 C 10 30, 25 25, 25 10 C 25 4, 18 0, 10 0 C 4 0, 0 8, 0 15"/>
    <path d="M 35 0 C 30 10, 25 25, 10 25 C 4 25, 0 18, 0 10"/>
    <circle cx="28" cy="28" r="3" fill="#d4af37"/>
  </g>
  <!-- Top-Right Corner Filigree -->
  <g transform="translate(382, 18) scale(-1, 1)" stroke="#d4af37" stroke-width="1.5" fill="none">
    <path d="M 0 35 C 10 30, 25 25, 25 10 C 25 4, 18 0, 10 0 C 4 0, 0 8, 0 15"/>
    <path d="M 35 0 C 30 10, 25 25, 10 25 C 4 25, 0 18, 0 10"/>
    <circle cx="28" cy="28" r="3" fill="#d4af37"/>
  </g>
  <!-- Bottom-Left Corner Filigree -->
  <g transform="translate(18, 542) scale(1, -1)" stroke="#d4af37" stroke-width="1.5" fill="none">
    <path d="M 0 35 C 10 30, 25 25, 25 10 C 25 4, 18 0, 10 0 C 4 0, 0 8, 0 15"/>
    <path d="M 35 0 C 30 10, 25 25, 10 25 C 4 25, 0 18, 0 10"/>
    <circle cx="28" cy="28" r="3" fill="#d4af37"/>
  </g>
  <!-- Bottom-Right Corner Filigree -->
  <g transform="translate(382, 542) scale(-1, -1)" stroke="#d4af37" stroke-width="1.5" fill="none">
    <path d="M 0 35 C 10 30, 25 25, 25 10 C 25 4, 18 0, 10 0 C 4 0, 0 8, 0 15"/>
    <path d="M 35 0 C 30 10, 25 25, 10 25 C 4 25, 0 18, 0 10"/>
    <circle cx="28" cy="28" r="3" fill="#d4af37"/>
  </g>
  <!-- Top Center Crest Accent -->
  <path d="M 180 18 C 190 28, 210 28, 220 18" stroke="#d4af37" stroke-width="1.5"/>
  <circle cx="200" cy="26" r="2.5" fill="#d4af37"/>
</svg>
`);

// 3. Art Deco Gatsby Stepped Border
const SVG_FRAME_ART_DECO = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560" fill="none">
  <!-- Outer line -->
  <rect x="20" y="20" width="360" height="520" stroke="#d4af37" stroke-width="2"/>
  <!-- Stepped Corners -->
  <path d="M 20 60 L 60 60 L 60 20" stroke="#d4af37" stroke-width="2"/>
  <path d="M 380 60 L 340 60 L 340 20" stroke="#d4af37" stroke-width="2"/>
  <path d="M 20 500 L 60 500 L 60 540" stroke="#d4af37" stroke-width="2"/>
  <path d="M 380 500 L 340 500 L 340 540" stroke="#d4af37" stroke-width="2"/>
  
  <!-- Diamond Insets -->
  <polygon points="40,40 45,35 40,30 35,35" fill="#d4af37"/>
  <polygon points="360,40 365,35 360,30 355,35" fill="#d4af37"/>
  <polygon points="40,520 45,515 40,510 35,515" fill="#d4af37"/>
  <polygon points="360,520 365,515 360,510 355,515" fill="#d4af37"/>

  <!-- Inner delicate line -->
  <rect x="70" y="70" width="260" height="420" stroke="#d4af37" stroke-width="1" stroke-dasharray="6 4" opacity="0.8"/>
</svg>
`);

// 4. Botanical Laurel Wreath Oval Frame
const SVG_FRAME_BOTANICAL = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" fill="none">
  <!-- Central Oval Guide -->
  <ellipse cx="200" cy="250" rx="160" ry="210" stroke="#4a6741" stroke-width="1.5" stroke-dasharray="5 3"/>
  <ellipse cx="200" cy="250" rx="172" ry="222" stroke="#d4af37" stroke-width="1" opacity="0.7"/>

  <!-- Left Wreath Leaf Sprigs -->
  <g stroke="#4a6741" fill="#4a6741" fill-opacity="0.3" stroke-width="1.5">
    <path d="M 70 200 C 60 210, 50 205, 55 190 C 60 180, 70 190, 70 200 Z"/>
    <path d="M 60 240 C 48 248, 42 238, 48 226 C 54 218, 62 230, 60 240 Z"/>
    <path d="M 65 285 C 50 295, 45 282, 54 270 C 62 262, 68 275, 65 285 Z"/>
    <path d="M 85 340 C 72 352, 64 340, 74 326 C 82 318, 88 330, 85 340 Z"/>
    <path d="M 120 400 C 105 412, 98 398, 110 384 C 120 376, 126 390, 120 400 Z"/>
  </g>
  <!-- Right Wreath Leaf Sprigs -->
  <g stroke="#4a6741" fill="#4a6741" fill-opacity="0.3" stroke-width="1.5" transform="translate(400, 0) scale(-1, 1)">
    <path d="M 70 200 C 60 210, 50 205, 55 190 C 60 180, 70 190, 70 200 Z"/>
    <path d="M 60 240 C 48 248, 42 238, 48 226 C 54 218, 62 230, 60 240 Z"/>
    <path d="M 65 285 C 50 295, 45 282, 54 270 C 62 262, 68 275, 65 285 Z"/>
    <path d="M 85 340 C 72 352, 64 340, 74 326 C 82 318, 88 330, 85 340 Z"/>
    <path d="M 120 400 C 105 412, 98 398, 110 384 C 120 376, 126 390, 120 400 Z"/>
  </g>
  <!-- Bottom Ribbon Tie -->
  <path d="M 190 460 C 200 455, 200 465, 210 460 M 190 460 L 180 485 M 210 460 L 220 485" stroke="#d4af37" stroke-width="2"/>
  <circle cx="200" cy="460" r="4" fill="#d4af37"/>
</svg>
`);

// 5. Polaroid Vintage Card Frame
const SVG_FRAME_POLAROID = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 440" width="360" height="440" fill="none">
  <!-- Polaroid Paper Backing -->
  <rect x="15" y="15" width="330" height="410" rx="6" fill="#fefefc" stroke="#e2e8f0" stroke-width="1.5"/>
  <!-- Photo Cutout Area (Transparent) -->
  <rect x="35" y="35" width="290" height="290" rx="2" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3"/>
  <!-- Subdued tape pin accent at top center -->
  <rect x="150" y="8" width="60" height="18" fill="#e2d9c2" opacity="0.8" rx="2" transform="rotate(-2 180 17)"/>
</svg>
`);

// 6. Minimalist Luxury Double Gold Frame
const SVG_FRAME_MINIMAL = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560" fill="none">
  <rect x="24" y="24" width="352" height="512" rx="16" stroke="#d4af37" stroke-width="1.5"/>
  <rect x="34" y="34" width="332" height="492" rx="10" stroke="#d4af37" stroke-width="0.75" opacity="0.6"/>
  <!-- Corner crosses -->
  <path d="M 24 48 L 48 24 M 376 48 L 352 24 M 24 512 L 48 536 M 376 512 L 352 536" stroke="#d4af37" stroke-width="1"/>
</svg>
`);

// 7. Royal Wax Seal Stamp Sticker (Gold)
const SVG_STICKER_WAX_SEAL = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" fill="none">
  <defs>
    <radialGradient id="waxGold" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fdf2b8"/>
      <stop offset="35%" stop-color="#d4af37"/>
      <stop offset="85%" stop-color="#997312"/>
      <stop offset="100%" stop-color="#664d08"/>
    </radialGradient>
    <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Organic Wax Edge -->
  <path d="M 80 12 C 105 10, 125 22, 138 38 C 152 56, 150 82, 142 104 C 134 126, 116 144, 94 148 C 70 152, 44 146, 28 132 C 12 116, 8 90, 14 68 C 20 44, 48 14, 80 12 Z" 
        fill="url(#waxGold)" filter="url(#sealShadow)"/>
  <!-- Inner Ring Impression -->
  <circle cx="80" cy="80" r="50" stroke="#b08d23" stroke-width="2.5" fill="none" opacity="0.7"/>
  <circle cx="80" cy="80" r="46" stroke="#fdf2b8" stroke-width="1" fill="none" opacity="0.8"/>
  <!-- Crown Icon in Center -->
  <path d="M 58 92 L 102 92 L 98 70 L 88 80 L 80 64 L 72 80 L 62 70 Z" fill="#fdf2b8" stroke="#664d08" stroke-width="1"/>
  <circle cx="80" cy="62" r="2.5" fill="#fdf2b8"/>
  <circle cx="60" cy="68" r="2.5" fill="#fdf2b8"/>
  <circle cx="100" cy="68" r="2.5" fill="#fdf2b8"/>
</svg>
`);

// 8. Olive Branch Peace Sprig Sticker
const SVG_STICKER_OLIVE = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" fill="none">
  <!-- Central Stem -->
  <path d="M 25 135 C 55 105, 95 65, 135 25" stroke="#4a6741" stroke-width="3" stroke-linecap="round"/>
  <!-- Leaves -->
  <g fill="#5e8353" stroke="#374f30" stroke-width="1.5">
    <path d="M 60 100 C 50 88, 45 70, 62 65 C 75 75, 70 95, 60 100 Z"/>
    <path d="M 85 75 C 98 62, 116 65, 112 82 C 98 90, 85 85, 85 75 Z"/>
    <path d="M 100 60 C 90 48, 85 30, 102 25 C 115 35, 110 55, 100 60 Z"/>
    <path d="M 120 40 C 132 28, 150 32, 146 48 C 132 55, 120 50, 120 40 Z"/>
  </g>
  <!-- Olive berries -->
  <circle cx="78" cy="85" r="4.5" fill="#2d3d27"/>
  <circle cx="114" cy="50" r="4.5" fill="#2d3d27"/>
</svg>
`);

// 9. Starlight Sparkle Burst Sticker
const SVG_STICKER_SPARKLES = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" fill="none">
  <!-- Main 4-point Star -->
  <g transform="translate(80, 80)">
    <path d="M 0 -55 Q 0 0, 55 0 Q 0 0, 0 55 Q 0 0, -55 0 Q 0 0, 0 -55 Z" fill="#f59e0b"/>
    <path d="M 0 -35 Q 0 0, 35 0 Q 0 0, 0 35 Q 0 0, -35 0 Q 0 0, 0 -35 Z" fill="#fef08a"/>
    <circle cx="0" cy="0" r="6" fill="#ffffff"/>
  </g>
  <!-- Small secondary stars -->
  <g transform="translate(32, 40) scale(0.4)">
    <path d="M 0 -45 Q 0 0, 45 0 Q 0 0, 0 45 Q 0 0, -45 0 Q 0 0, 0 -45 Z" fill="#fbbf24"/>
  </g>
  <g transform="translate(125, 120) scale(0.45)">
    <path d="M 0 -45 Q 0 0, 45 0 Q 0 0, 0 45 Q 0 0, -45 0 Q 0 0, 0 -45 Z" fill="#fbbf24"/>
  </g>
  <circle cx="120" cy="45" r="3" fill="#fbbf24"/>
  <circle cx="45" cy="115" r="3" fill="#fbbf24"/>
</svg>
`);

// 10. Golden Silk Ribbon Bow Sticker
const SVG_STICKER_RIBBON = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="180" height="150" fill="none">
  <defs>
    <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>
  </defs>
  <!-- Left Loop -->
  <path d="M 90 60 C 60 15, 15 30, 20 60 C 25 85, 75 75, 90 65 Z" fill="url(#goldRibbon)" stroke="#78350f" stroke-width="1.5"/>
  <!-- Right Loop -->
  <path d="M 90 60 C 120 15, 165 30, 160 60 C 155 85, 105 75, 90 65 Z" fill="url(#goldRibbon)" stroke="#78350f" stroke-width="1.5"/>
  <!-- Left Tail -->
  <path d="M 85 70 C 65 95, 45 125, 30 140 L 45 130 L 55 145 C 68 120, 80 95, 88 72 Z" fill="url(#goldRibbon)" stroke="#78350f" stroke-width="1.5"/>
  <!-- Right Tail -->
  <path d="M 95 70 C 115 95, 135 125, 150 140 L 135 130 L 125 145 C 112 120, 100 95, 92 72 Z" fill="url(#goldRibbon)" stroke="#78350f" stroke-width="1.5"/>
  <!-- Center Knot -->
  <circle cx="90" cy="62" r="14" fill="#facc15" stroke="#78350f" stroke-width="2"/>
</svg>
`);

export const DEFAULT_PUBLIC_ASSETS: StockFrameOrSticker[] = [
  // Frames
  {
    id: 'pub-frame-gold-arch',
    name: 'Royal Gold Cathedral Arch Frame',
    title: 'Royal Gold Cathedral Arch Frame',
    type: 'frame',
    category: 'frames',
    url: SVG_FRAME_ARCH,
    thumbnailUrl: SVG_FRAME_ARCH,
    tags: ['frame', 'arch', 'gold', 'luxury', 'border', 'cathedral'],
    dimensions: { width: 400, height: 600 }
  },
  {
    id: 'pub-frame-baroque',
    name: 'Baroque Filigree Antique Border',
    title: 'Baroque Filigree Antique Border',
    type: 'frame',
    category: 'frames',
    url: SVG_FRAME_BAROQUE,
    thumbnailUrl: SVG_FRAME_BAROQUE,
    tags: ['frame', 'vintage', 'filigree', 'gold', 'baroque'],
    dimensions: { width: 400, height: 560 }
  },
  {
    id: 'pub-frame-art-deco',
    name: 'Art Deco Gatsby Geometric Frame',
    title: 'Art Deco Gatsby Geometric Frame',
    type: 'frame',
    category: 'frames',
    url: SVG_FRAME_ART_DECO,
    thumbnailUrl: SVG_FRAME_ART_DECO,
    tags: ['frame', 'art deco', 'geometric', 'gatsby', 'stepped'],
    dimensions: { width: 400, height: 560 }
  },
  {
    id: 'pub-frame-botanical',
    name: 'Botanical Laurel Wreath Oval Frame',
    title: 'Botanical Laurel Wreath Oval Frame',
    type: 'frame',
    category: 'floral',
    url: SVG_FRAME_BOTANICAL,
    thumbnailUrl: SVG_FRAME_BOTANICAL,
    tags: ['frame', 'floral', 'botanical', 'wreath', 'oval', 'greenery'],
    dimensions: { width: 400, height: 500 }
  },
  {
    id: 'pub-frame-polaroid',
    name: 'Vintage Polaroid Photo Card Frame',
    title: 'Vintage Polaroid Photo Card Frame',
    type: 'frame',
    category: 'vintage',
    url: SVG_FRAME_POLAROID,
    thumbnailUrl: SVG_FRAME_POLAROID,
    tags: ['frame', 'polaroid', 'photo', 'vintage', 'clean'],
    dimensions: { width: 360, height: 440 }
  },
  {
    id: 'pub-frame-minimal',
    name: 'Minimalist Double Gold Border',
    title: 'Minimalist Double Gold Border',
    type: 'frame',
    category: 'minimal',
    url: SVG_FRAME_MINIMAL,
    thumbnailUrl: SVG_FRAME_MINIMAL,
    tags: ['frame', 'minimal', 'double border', 'gold', 'modern'],
    dimensions: { width: 400, height: 560 }
  },

  // Stickers / Emblems / Decorations
  {
    id: 'pub-sticker-wax-seal',
    name: 'Royal Crown Wax Seal Stamp',
    title: 'Royal Crown Wax Seal Stamp',
    type: 'sticker',
    category: 'stickers',
    url: SVG_STICKER_WAX_SEAL,
    thumbnailUrl: SVG_STICKER_WAX_SEAL,
    tags: ['sticker', 'wax seal', 'crown', 'stamp', 'gold', 'royal'],
    dimensions: { width: 160, height: 160 }
  },
  {
    id: 'pub-sticker-olive',
    name: 'Olive Branch Botanical Sprig',
    title: 'Olive Branch Botanical Sprig',
    type: 'sticker',
    category: 'floral',
    url: SVG_STICKER_OLIVE,
    thumbnailUrl: SVG_STICKER_OLIVE,
    tags: ['sticker', 'olive', 'botanical', 'foliage', 'branch', 'greenery'],
    dimensions: { width: 160, height: 160 }
  },
  {
    id: 'pub-sticker-sparkles',
    name: 'Golden Starlight Sparkle Burst',
    title: 'Golden Starlight Sparkle Burst',
    type: 'sticker',
    category: 'stickers',
    url: SVG_STICKER_SPARKLES,
    thumbnailUrl: SVG_STICKER_SPARKLES,
    tags: ['sticker', 'sparkle', 'stars', 'gold', 'magic', 'celebration'],
    dimensions: { width: 160, height: 160 }
  },
  {
    id: 'pub-sticker-ribbon',
    name: 'Golden Silk Ribbon Bow',
    title: 'Golden Silk Ribbon Bow',
    type: 'sticker',
    category: 'luxury',
    url: SVG_STICKER_RIBBON,
    thumbnailUrl: SVG_STICKER_RIBBON,
    tags: ['sticker', 'ribbon', 'bow', 'gold', 'luxury', 'gift'],
    dimensions: { width: 180, height: 150 }
  }
];
