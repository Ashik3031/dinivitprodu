import { Invitation, InvitationPage, OpeningScreenConfig, BackgroundConfig, CanvasElement } from '../types';

/**
 * Builds or retrieves an InvitationPage for visual canvas editing of the Opening / Cover Screen.
 */
export function getOrCreateOpeningScreenPage(invitation: Partial<Invitation>): InvitationPage {
  if (invitation.openingScreen?.page) {
    return invitation.openingScreen.page;
  }

  const opening = invitation.openingScreen;
  const theme = invitation.theme || {
    primaryColor: '#d4af37',
    secondaryColor: '#0a3d2c',
    backgroundColor: '#071912',
    fontHeading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif"
  };

  const coupleNames = opening?.coupleNames || invitation.title || 'Alexander & Sophia';
  const subtitle = opening?.subtitle || invitation.eventDate || 'Saturday, October 24, 2026';
  const title = opening?.title || 'YOU ARE CORDIALLY INVITED';
  const buttonText = opening?.openButtonText || 'Open Invitation';
  const envelopeColor = opening?.envelopeColor || '#0e261d';
  const sealColor = opening?.sealColor || theme.primaryColor || '#d4af37';

  // Default background (radial gradient / dark luxury) if not already set
  const defaultBg: BackgroundConfig = opening?.background || {
    type: 'gradient',
    gradient: {
      type: 'radial',
      colors: ['#172520', '#07120d'],
      angle: 180
    },
    overlayColor: sealColor,
    overlayOpacity: 0.05
  };

  const elements: CanvasElement[] = [
    {
      id: 'open-container-card',
      type: 'container',
      name: 'Envelope / Cover Card',
      style: {
        x: 25,
        y: 110,
        width: 340,
        height: 540,
        backgroundColor: envelopeColor,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 40px rgba(212,175,55,0.18)',
        zIndex: 10
      },
      content: {},
      animation: {
        type: 'zoomIn',
        duration: 0.8,
        delay: 0.1
      },
      children: [
        'open-elem-icon',
        'open-elem-title',
        'open-elem-couple',
        'open-elem-divider',
        'open-elem-date',
        'open-elem-button'
      ]
    },
    {
      id: 'open-elem-icon',
      type: 'icon',
      name: 'Heart / Seal Badge',
      parentContainerId: 'open-container-card',
      parentId: 'open-container-card',
      style: {
        x: 135,
        y: 32,
        width: 70,
        height: 70,
        color: sealColor,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.35)',
        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
        zIndex: 11
      },
      content: {
        iconName: 'heart',
        iconColor: sealColor
      },
      animation: {
        type: 'pulse',
        duration: 2.2,
        delay: 0.5,
        repeat: 'infinite'
      }
    },
    {
      id: 'open-elem-title',
      type: 'heading',
      name: 'Overline Title',
      parentContainerId: 'open-container-card',
      parentId: 'open-container-card',
      style: {
        x: 20,
        y: 118,
        width: 300,
        height: 28,
        fontSize: 11,
        fontWeight: 700,
        color: sealColor,
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 11
      },
      content: {
        text: title
      },
      animation: {
        type: 'fadeIn',
        duration: 0.6,
        delay: 0.3
      }
    },
    {
      id: 'open-elem-couple',
      type: 'heading',
      name: 'Couple / Event Names',
      parentContainerId: 'open-container-card',
      parentId: 'open-container-card',
      style: {
        x: 15,
        y: 156,
        width: 310,
        height: 90,
        fontSize: 34,
        fontFamily: theme.fontHeading || "'Cinzel', serif",
        fontWeight: 700,
        color: '#fbfaf5',
        textAlign: 'center',
        lineHeight: 1.2,
        zIndex: 11
      },
      content: {
        text: coupleNames
      },
      animation: {
        type: 'slideUp',
        duration: 0.7,
        delay: 0.4
      }
    },
    {
      id: 'open-elem-divider',
      type: 'divider',
      name: 'Gilded Divider',
      parentContainerId: 'open-container-card',
      parentId: 'open-container-card',
      style: {
        x: 85,
        y: 260,
        width: 170,
        height: 14,
        color: sealColor,
        opacity: 0.7,
        zIndex: 11
      },
      content: {},
      animation: {
        type: 'fadeIn',
        duration: 0.5,
        delay: 0.5
      }
    },
    {
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      parentContainerId: 'open-container-card',
      parentId: 'open-container-card',
      style: {
        x: 20,
        y: 288,
        width: 300,
        height: 34,
        fontSize: 13,
        fontWeight: 500,
        color: '#d1d5db',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 11
      },
      content: {
        text: subtitle
      },
      animation: {
        type: 'fadeIn',
        duration: 0.6,
        delay: 0.6
      }
    },
    {
      id: 'open-elem-button',
      type: 'button',
      name: 'Open Invitation Button',
      parentContainerId: 'open-container-card',
      parentId: 'open-container-card',
      style: {
        x: 30,
        y: 430,
        width: 280,
        height: 52,
        backgroundColor: sealColor,
        color: '#07120d',
        fontSize: 13,
        fontWeight: 800,
        borderRadius: 16,
        boxShadow: '0 10px 30px -5px rgba(212, 175, 55, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
        letterSpacing: 1.5,
        zIndex: 12
      },
      content: {
        buttonText: buttonText,
        buttonAction: 'open-invitation',
        buttonShape: 'rounded'
      },
      animation: {
        type: 'bounce',
        duration: 1.2,
        delay: 0.8,
        repeat: 'infinite'
      }
    }
  ];

  return {
    id: 'opening-screen-page',
    name: 'Opening Screen',
    order: -1,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: defaultBg,
    elements
  };
}

/**
 * Keeps the high-level OpeningScreenConfig in sync when its visual page elements or background change.
 */
export function syncOpeningScreenWithPage(
  currentConfig: OpeningScreenConfig | undefined,
  page: InvitationPage
): OpeningScreenConfig {
  const nextConfig: OpeningScreenConfig = {
    enabled: currentConfig?.enabled !== undefined ? currentConfig.enabled : true,
    style: currentConfig?.style || 'envelope',
    musicAutoplayOnOpen: currentConfig?.musicAutoplayOnOpen !== undefined ? currentConfig.musicAutoplayOnOpen : true,
    envelopeColor: currentConfig?.envelopeColor || '#0e261d',
    sealColor: currentConfig?.sealColor || '#d4af37',
    ...currentConfig,
    background: page.background,
    page
  };

  // Inspect page elements to update high-level strings if present
  const coupleElem = page.elements.find(el => el.id === 'open-elem-couple' || el.name?.toLowerCase().includes('couple'));
  if (coupleElem?.content?.text) {
    nextConfig.coupleNames = coupleElem.content.text;
  }

  const titleElem = page.elements.find(el => el.id === 'open-elem-title' || el.name?.toLowerCase().includes('title'));
  if (titleElem?.content?.text) {
    nextConfig.title = titleElem.content.text;
  }

  const dateElem = page.elements.find(el => el.id === 'open-elem-date' || el.name?.toLowerCase().includes('date') || el.name?.toLowerCase().includes('subtitle'));
  if (dateElem?.content?.text) {
    nextConfig.subtitle = dateElem.content.text;
  }

  const buttonElem = page.elements.find(el => el.id === 'open-elem-button' || el.type === 'button');
  if (buttonElem?.content?.buttonText) {
    nextConfig.openButtonText = buttonElem.content.buttonText;
  }

  const cardContainer = page.elements.find(el => el.id === 'open-container-card' || el.type === 'container');
  if (cardContainer?.style?.backgroundColor) {
    nextConfig.envelopeColor = cardContainer.style.backgroundColor;
  }

  return nextConfig;
}
