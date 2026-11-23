import { InvitationTemplate, Invitation } from '../types';

export const INITIAL_TEMPLATES: InvitationTemplate[] = [];

export function createBlankInvitation(businessId: string, customTitle?: string, category: string = 'wedding'): Invitation {
  const timestamp = new Date().toISOString();
  const slugBase = (customTitle || 'Blank Invitation')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${slugBase || 'invitation'}-${Math.random().toString(36).substring(2, 7)}`;

  const blankPage = {
    id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: 'Section 1',
    order: 0,
    heightMode: 'viewport' as const,
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color' as const,
      color: '#f8fafc'
    },
    elements: []
  };

  return {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    businessId,
    title: customTitle || 'New Blank Invitation',
    slug,
    category: category as any,
    status: 'draft',
    theme: {
      primaryColor: '#d4af37',
      secondaryColor: '#0a3d2c',
      accentColor: '#f9f6ee',
      fontHeading: "'Cinzel', serif",
      fontBody: "'Montserrat', sans-serif",
      fontScript: "'Great Vibes', cursive",
      backgroundColor: '#f8fafc'
    },
    openingScreen: {
      enabled: false,
      coverType: 'custom-page',
      style: 'custom-page',
      coverTransitionEffect: 'zoom-fade',
      musicAutoplayOnOpen: false
    },
    music: {
      enabled: false,
      audioUrl: '',
      title: 'No Music Selected',
      artist: '',
      autoPlay: false,
      loop: true,
      floatingBadge: false
    },
    pages: [blankPage],
    settings: {
      enableAutoScroll: false,
      autoScrollSpeed: 30,
      showPageNavDots: true,
      allowGuestComments: true,
      allowRSVP: true,
      enableConfettiOnOpen: true
    },
    viewsCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function createInvitationFromTemplate(template?: InvitationTemplate | null, businessId: string = 'usr-biz-royal', customTitle?: string): Invitation {
  if (!template) {
    return createBlankInvitation(businessId, customTitle || 'New Invitation');
  }
  const timestamp = new Date().toISOString();
  const slugBase = (customTitle || template.title || 'invitation')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;

  const defaultOpeningScreen = {
    enabled: true,
    style: 'envelope-wax-seal',
    title: template.title || 'Wedding Invitation',
    subtitle: 'You are cordially invited',
    coupleNames: template.title || 'Couple Names',
    openButtonText: 'Open Invitation'
  };

  const defaultTheme = {
    primaryColor: '#c5a059',
    secondaryColor: '#1e293b',
    backgroundColor: '#ffffff',
    fontHeading: "'Cinzel', serif",
    fontBody: "'Plus Jakarta Sans', sans-serif"
  };

  const defaultMusic = {
    enabled: false,
    autoPlay: false,
    loop: true,
    volume: 0.5
  };

  return {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    businessId,
    title: customTitle || template.title,
    slug,
    category: (template.category as any) || 'wedding',
    status: 'draft',
    theme: template.theme ? JSON.parse(JSON.stringify(template.theme)) : defaultTheme,
    openingScreen: template.openingScreen ? { ...defaultOpeningScreen, ...JSON.parse(JSON.stringify(template.openingScreen)) } : defaultOpeningScreen,
    music: template.music ? JSON.parse(JSON.stringify(template.music)) : defaultMusic,
    pages: template.pages ? JSON.parse(JSON.stringify(template.pages)) : [],
    settings: {
      enableAutoScroll: false,
      autoScrollSpeed: 30,
      showPageNavDots: true,
      allowGuestComments: true,
      allowRSVP: true,
      enableConfettiOnOpen: true
    },
    viewsCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
