export interface StockAssetItem {
  id: string;
  name: string;
  url: string;
  category: 'wedding' | 'floral' | 'luxury' | 'background' | 'texture' | 'pattern' | 'audio' | 'video' | 'monogram';
  type: 'image' | 'video' | 'audio' | 'pattern' | 'texture';
  thumbnail?: string;
  tags?: string[];
}

export const STOCK_ASSETS: StockAssetItem[] = [
  // Background Textures & Patterns
  {
    id: 'pat-gold-damask',
    name: 'Gold Royal Damask',
    category: 'pattern',
    type: 'pattern',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    tags: ['luxury', 'gold', 'royal']
  },
  {
    id: 'pat-marble-white',
    name: 'Carrara White Marble',
    category: 'texture',
    type: 'texture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    tags: ['marble', 'clean', 'minimal']
  },
  {
    id: 'pat-velvet-emerald',
    name: 'Emerald Velvet Texture',
    category: 'texture',
    type: 'texture',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    tags: ['emerald', 'velvet', 'dark']
  },
  {
    id: 'pat-handmade-paper',
    name: 'Deckled Edge Cotton Paper',
    category: 'texture',
    type: 'texture',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    tags: ['paper', 'organic', 'boho']
  },
  
  // Wedding Stock Photos
  {
    id: 'img-couple-arch',
    name: 'Couple under Floral Arch',
    category: 'wedding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    tags: ['couple', 'floral', 'arch']
  },
  {
    id: 'img-couple-sunset',
    name: 'Golden Hour Embrace',
    category: 'wedding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    tags: ['couple', 'sunset', 'romantic']
  },
  {
    id: 'img-rings-roses',
    name: 'Diamond Rings & White Roses',
    category: 'luxury',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
    tags: ['rings', 'roses', 'details']
  },
  {
    id: 'img-champagne-toast',
    name: 'Champagne Flutes Celebration',
    category: 'luxury',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    tags: ['toast', 'party', 'champagne']
  },
  {
    id: 'img-table-decor',
    name: 'Candlelit Banquet Table',
    category: 'luxury',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    tags: ['venue', 'dinner', 'decor']
  },
  {
    id: 'img-floral-botanical',
    name: 'White Eucalyptus & Peonies',
    category: 'floral',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80',
    tags: ['flowers', 'botanical', 'minimal']
  },

  // Ambient Audio Tracks (Web audio playable royalty-free MP3s)
  {
    id: 'audio-acoustic-vows',
    name: 'Acoustic Romance (Gentle Guitar)',
    category: 'audio',
    type: 'audio',
    url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    tags: ['gentle', 'guitar', 'romantic']
  },
  {
    id: 'audio-strings-waltz',
    name: 'Ethereal Bridal Strings',
    category: 'audio',
    type: 'audio',
    url: 'https://cdn.freesound.org/previews/467/467269_4939433-lq.mp3',
    tags: ['orchestral', 'strings', 'elegant']
  },
  {
    id: 'audio-piano-serenade',
    name: 'Piano Moonlight Serenade',
    category: 'audio',
    type: 'audio',
    url: 'https://cdn.freesound.org/previews/538/538848_10202167-lq.mp3',
    tags: ['piano', 'warm', 'emotional']
  }
];

export const STOCK_AUDIO = STOCK_ASSETS.filter(a => a.type === 'audio');

export const GOOGLE_FONTS_LIST = [
  { name: 'Playfair Display', category: 'serif', family: "'Playfair Display', serif" },
  { name: 'Cormorant Garamond', category: 'serif', family: "'Cormorant Garamond', serif" },
  { name: 'Cinzel', category: 'serif', family: "'Cinzel', serif" },
  { name: 'Great Vibes', category: 'script', family: "'Great Vibes', cursive" },
  { name: 'Alex Brush', category: 'script', family: "'Alex Brush', cursive" },
  { name: 'Dancing Script', category: 'script', family: "'Dancing Script', cursive" },
  { name: 'Parisienne', category: 'script', family: "'Parisienne', cursive" },
  { name: 'Pinyon Script', category: 'script', family: "'Pinyon Script', cursive" },
  { name: 'Marcellus', category: 'serif', family: "'Marcellus', serif" },
  { name: 'Prata', category: 'serif', family: "'Prata', serif" },
  { name: 'Montserrat', category: 'sans-serif', family: "'Montserrat', sans-serif" },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', family: "'Plus Jakarta Sans', sans-serif" }
];
