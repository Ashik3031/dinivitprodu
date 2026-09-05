export type UserRole = 'admin' | 'business' | 'business_owner';

export interface User {
  id: string;
  username: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  invitationCount?: number;
  publishedCount?: number;
  draftCount?: number;
  maxInvitations?: number;
  customDomain?: string;
  logoUrl?: string;
  brandColor?: string;
  secondaryColor?: string;
  defaultFontHeading?: string;
  defaultFontBody?: string;
  defaultFooterText?: string;
  defaultWatermark?: boolean;
  token?: string;
}

export interface AdminStats {
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses?: number;
  totalUsers?: number;
  activeUsers?: number;
  totalInvitations: number;
  publishedInvitations: number;
  draftInvitations?: number;
  totalRSVPs: number;
  totalGuestbookMessages: number;
  totalViews: number;
  totalMedia: number;
  storageUsedBytes?: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export type ContainerShape = 
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'square'
  | 'oval'
  | 'arch'
  | 'scallop'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'ticket'
  | 'shield'
  | 'wave'
  | 'ribbon'
  | 'svg-custom';

export type BackgroundType = 'color' | 'gradient' | 'image' | 'video' | 'pattern' | 'texture';

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  imageUrl?: string;
  videoUrl?: string;
  pattern?: string;
  texture?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  blur?: number;
  size?: 'cover' | 'contain' | 'auto';
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  position?: string;
}

export type AnimationType = 
  | 'none'
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'bounce'
  | 'rotate'
  | 'reveal'
  | 'flip'
  | 'float'
  | 'pulse';

export type AnimationTrigger = 'load' | 'scroll';
export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring' | 'bounce';
export type AnimationRepeat = 'none' | '1' | '2' | '3' | 'infinite' | 'reverse' | boolean | number;

export interface ParallaxConfig {
  enabled: boolean;
  speed: number; // -1.0 to 1.0 (negative for reverse/slower, positive for faster)
  direction?: 'vertical' | 'horizontal';
}

export interface AnimationConfig {
  type: AnimationType;
  duration: number; // seconds (0.1 - 5.0)
  delay: number; // seconds (0 - 5.0)
  speed?: AnimationEasing;
  repeat?: AnimationRepeat;
  trigger?: AnimationTrigger;
  parallax?: ParallaxConfig;
}

export type PageTransitionType = 
  | 'fade' 
  | 'slide-vertical' 
  | 'slide-horizontal' 
  | 'zoom' 
  | 'flip' 
  | 'cube' 
  | 'none';

export type ElementType = 
  // Basic
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'audio'
  | 'button'
  | 'icon'
  | 'shape'
  | 'divider'
  | 'container'
  // Invitation specific
  | 'event-date'
  | 'event-time'
  | 'couple-names'
  | 'countdown'
  | 'calendar'
  | 'timeline'
  | 'venue'
  | 'google-maps'
  | 'directions-button'
  | 'dress-code'
  | 'photo-gallery'
  | 'rsvp-form'
  | 'guestbook'
  | 'contact-button'
  | 'whatsapp-button'
  | 'qr-code';

export interface ElementStyle {
  // Positioning & Sizing
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
  
  // Typography
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  
  // Box / Container
  shape?: ContainerShape;
  backgroundColor?: string;
  background?: BackgroundConfig;
  borderRadius?: number | string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  boxShadow?: string;
  backdropBlur?: number;
  opacity?: number;
  padding?: number;
  margin?: number;
  overflow?: 'visible' | 'hidden';
  clipMask?: boolean;
  svgShapePath?: string;
  
  // Aspect Ratio & Object Fit
  objectFit?: 'cover' | 'contain' | 'fill';
  aspectRatioLock?: boolean;

  // Image Filters
  filterGrayscale?: number; // 0 to 100%
  filterSepia?: number; // 0 to 100%
  filterBrightness?: number; // 0 to 200%
  filterContrast?: number; // 0 to 200%
  filterBlur?: number; // 0 to 20px
  filterHueRotate?: number; // 0 to 360deg
  filterPreset?: 'none' | 'vintage' | 'warm' | 'cool' | 'dramatic' | 'bw' | 'faded';

  // Button Hover States
  hoverBackgroundColor?: string;
  hoverColor?: string;
  hoverScale?: number;
  hoverBoxShadow?: string;
  hoverBorderColor?: string;

  // Shape specific
  shapeType?: 'rectangle' | 'circle' | 'square' | 'oval' | 'star' | 'heart' | 'diamond' | 'hexagon' | 'triangle' | 'arrow' | 'badge' | 'ribbon';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDashArray?: string;

  // Divider specific
  dividerStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'ornamental' | 'floral' | 'diamond' | 'stars' | 'laurel';
  dividerThickness?: number;
}

export interface ElementContent {
  text?: string;
  html?: string;
  src?: string;
  alt?: string;
  caption?: string;
  videoUrl?: string;
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoControls?: boolean;
  videoIsBackground?: boolean;
  videoPoster?: string;
  audioUrl?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioAutoplay?: boolean;
  audioLoop?: boolean;
  audioVolume?: number;
  
  // Invitation fields
  coupleName1?: string;
  coupleName2?: string;
  andConnector?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  mapQuery?: string;
  mapEmbedUrl?: string;
  mapZoom?: number;
  mapInteractive?: boolean;
  
  // Calendar specific
  calendarMonth?: string;
  calendarYear?: number;
  calendarDay?: number;
  calendarTitle?: string;
  calendarShowAddToCal?: boolean;
  calendarEventTitle?: string;
  calendarEventLocation?: string;
  calendarEventDescription?: string;

  countdownTarget?: string;
  countdownLabels?: { days: string; hours: string; minutes: string; seconds: string };
  countdownStyle?: 'boxes' | 'minimal' | 'glass' | 'circles';
  
  dressCodeTitle?: string;
  dressCodeColors?: string[];
  dressCodeDescription?: string;
  
  timelineEvents?: Array<{ time: string; title: string; description: string; icon?: string }>;
  timelineLayout?: 'vertical' | 'split' | 'cards';
  
  galleryImages?: Array<{ url: string; caption?: string }>;
  galleryLayout?: 'grid' | 'carousel' | 'masonry' | 'polaroid';
  galleryColumns?: number;
  
  buttonText?: string;
  buttonLink?: string;
  buttonAction?: 'link' | 'rsvp' | 'guestbook' | 'maps' | 'whatsapp' | 'calendar' | 'music-toggle' | 'next-page' | 'previous-page' | 'open-invitation';
  buttonShape?: 'pill' | 'rounded' | 'square' | 'soft';
  
  whatsappPhone?: string;
  whatsappMessage?: string;
  
  qrCodeValue?: string;
  qrFgColor?: string;
  qrBgColor?: string;
  qrLabel?: string;
  
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  iconStrokeWidth?: number;
  iconBgColor?: string;
  iconBorderRadius?: number;
  
  rsvpFields?: Array<{ name: string; label: string; type: 'text' | 'select' | 'radio' | 'number'; options?: string[]; required?: boolean }>;
}

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveStyleOverride {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number;
  padding?: number;
  isHidden?: boolean;
}

export interface ResponsiveVisibility {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  parentContainerId?: string | null;
  parentId?: string | null; // Alias for parentContainerId
  style: ElementStyle;
  content: ElementContent;
  animation?: AnimationConfig;
  isLocked?: boolean;
  isHidden?: boolean;
  groupId?: string | null;
  children?: string[]; // IDs of child elements when element is a container
  responsive?: {
    mobile?: ResponsiveStyleOverride;
    tablet?: ResponsiveStyleOverride;
    desktop?: ResponsiveStyleOverride;
  };
  responsiveVisibility?: ResponsiveVisibility;
}

export type PageHeightMode = 'viewport' | 'auto' | 'custom';

export interface InvitationPage {
  id: string;
  name: string;
  order?: number;
  heightMode?: PageHeightMode;
  height?: number; // default e.g. 844 or custom pixel height
  isFullHeight?: boolean;
  background: BackgroundConfig;
  elements: CanvasElement[];
  animation?: AnimationConfig;
  transition?: {
    type?: PageTransitionType;
    duration?: number;
  };
}

export type TemplateCategory = 'opening' | 'wedding' | 'event' | 'media' | 'interaction' | 'final' | 'cover' | 'details' | 'timeline' | 'gallery' | 'reception' | 'rsvp' | 'guestbook' | 'gift' | 'countdown' | 'custom' | 'all';

export interface PrebuiltBlock {
  id: string;
  name: string;
  category: 'opening' | 'wedding' | 'event' | 'media' | 'interaction' | 'final';
  subcategory: string;
  description: string;
  icon?: string;
  thumbnail?: string;
  suggestedHeight?: number;
  elements: CanvasElement[];
}

export interface PageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  subcategory?: string;
  description: string;
  thumbnail?: string;
  page: Omit<InvitationPage, 'id'>;
}

export interface InvitationTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  fontScript: string;
  backgroundColor: string;
}

export interface OpeningScreenConfig {
  enabled: boolean;
  style: 'envelope' | 'wax-seal' | 'curtain' | 'card-flip' | 'monogram-glow' | 'minimal-button' | 'video-cover' | 'custom-page';
  title?: string;
  subtitle?: string;
  coupleNames?: string;
  openButtonText?: string;
  sealColor?: string;
  sealText?: string;
  envelopeColor?: string;
  background?: BackgroundConfig;
  musicAutoplayOnOpen?: boolean;
  page?: InvitationPage;
}

export interface MusicConfig {
  enabled: boolean;
  audioUrl: string;
  title: string;
  artist?: string;
  autoPlay: boolean;
  loop: boolean;
  floatingBadge: boolean;
}

export type EventType = 
  | 'wedding' 
  | 'birthday' 
  | 'engagement' 
  | 'anniversary' 
  | 'baby-shower' 
  | 'business-event' 
  | 'other'
  | 'gala'
  | 'save-the-date'
  | 'party'
  | 'corporate';

export interface Invitation {
  id: string;
  businessId: string;
  title: string;
  customerName?: string;
  eventDate?: string;
  eventType?: EventType;
  slug: string;
  category: EventType;
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  theme: InvitationTheme;
  openingScreen: OpeningScreenConfig;
  music: MusicConfig;
  pages: InvitationPage[];
  customMeta?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    favicon?: string;
  };
  settings: {
    enableAutoScroll?: boolean;
    autoScrollSpeed?: number;
    showPageNavDots?: boolean;
    allowGuestComments?: boolean;
    allowRSVP?: boolean;
    enableCountdown?: boolean;
    enableCalendar?: boolean;
    enableMap?: boolean;
    enableTimeline?: boolean;
    enableGallery?: boolean;
    enableGuestbook?: boolean;
    enableRSVP?: boolean;
    enableConfettiOnOpen?: boolean;
    pageTransition?: PageTransitionType;
    pageTransitionDuration?: number;
    smoothScroll?: boolean;
    parallaxEnabled?: boolean;
    presentationMode?: 'scroll' | 'paginated';
  };
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPResponse {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  attendance: 'attending' | 'not_attending' | 'maybe';
  guestCount: number;
  dietaryPreferences?: string;
  message?: string;
  submittedAt: string;
}

export interface GuestbookMessage {
  id: string;
  invitationId: string;
  senderName: string;
  relationship?: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export interface InvitationTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  theme: InvitationTheme;
  openingScreen: OpeningScreenConfig;
  music: MusicConfig;
  pages: InvitationPage[];
  isPremium?: boolean;
  isPublic?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type MediaAssetType = 'image' | 'video' | 'audio' | 'pattern' | 'texture' | 'frame' | 'sticker' | 'decoration';

export interface MediaAsset {
  id: string;
  businessId: string;
  invitationId?: string;
  invitationIds?: string[];
  title: string;
  name?: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaAssetType;
  format?: 'jpg' | 'png' | 'webp' | 'mp4' | 'mp3' | 'wav' | 'svg' | string;
  size?: number; // In bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // In seconds for video/audio
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
}
