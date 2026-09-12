import { Invitation, InvitationPage, OpeningScreenConfig, BackgroundConfig, CanvasElement, InvitationTheme } from '../types';

export const DEFAULT_STOCK_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4';
export const DEFAULT_STOCK_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

/**
 * Builds elements for a Video Cover opening screen.
 */
function buildVideoCoverElements(
  opening: OpeningScreenConfig | undefined,
  theme: InvitationTheme,
  coupleNames: string,
  subtitle: string,
  title: string,
  buttonText: string,
  sealColor: string
): CanvasElement[] {
  const elements: CanvasElement[] = [];
  const isClickToPlay = opening?.videoPlayMode === 'click-to-play';
  const showButton = opening?.showOpenButton !== false;

  // 1. Overline / Greeting
  elements.push({
    id: 'open-elem-title',
    type: 'heading',
    name: 'Overline Title',
    style: {
      x: 20,
      y: 75,
      width: 350,
      height: 28,
      fontSize: 11,
      fontWeight: 700,
      color: sealColor || '#f59e0b',
      textAlign: 'center',
      letterSpacing: 3,
      zIndex: 10
    },
    content: { text: title },
    animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
  });

  // 2. Couple / Event Names Headline
  elements.push({
    id: 'open-elem-couple',
    type: 'heading',
    name: 'Couple / Event Names',
    style: {
      x: 20,
      y: 115,
      width: 350,
      height: 90,
      fontSize: 34,
      fontFamily: theme.fontHeading || "'Cinzel', serif",
      fontWeight: 700,
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
      zIndex: 10
    },
    content: { text: coupleNames },
    animation: { type: 'slideUp', duration: 0.8, delay: 0.3 }
  });

  // 3. Date / Subtitle
  elements.push({
    id: 'open-elem-date',
    type: 'text',
    name: 'Date / Subtitle',
    style: {
      x: 20,
      y: 215,
      width: 350,
      height: 32,
      fontSize: 13,
      fontWeight: 500,
      color: '#e2e8f0',
      textAlign: 'center',
      letterSpacing: 2,
      zIndex: 10
    },
    content: { text: subtitle },
    animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
  });

  // 4. Center Play Button if click-to-play
  if (isClickToPlay) {
    elements.push({
      id: 'open-elem-play-btn',
      type: 'icon',
      name: 'Center Play Button',
      style: {
        x: 155,
        y: 350,
        width: 80,
        height: 80,
        color: '#07120d',
        backgroundColor: sealColor || '#d4af37',
        borderRadius: 9999,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 35px rgba(212, 175, 55, 0.5)',
        zIndex: 15
      },
      content: {
        iconName: 'play',
        iconColor: '#07120d',
        iconSize: 32
      },
      animation: { type: 'pulse', duration: 2, delay: 0.5, repeat: 'infinite' }
    });
  }

  // 5. Open Button at bottom (if enabled)
  if (showButton) {
    elements.push({
      id: 'open-elem-button',
      type: 'button',
      name: 'Open Invitation Button',
      style: {
        x: 45,
        y: 690,
        width: 300,
        height: 52,
        backgroundColor: sealColor || '#d4af37',
        color: '#07120d',
        fontSize: 13,
        fontWeight: 800,
        borderRadius: 9999,
        boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.4)',
        letterSpacing: 1.5,
        zIndex: 12
      },
      content: {
        buttonText: buttonText,
        buttonAction: 'open-invitation',
        buttonShape: 'pill'
      },
      animation: { type: 'bounce', duration: 1.5, delay: 0.6, repeat: 'infinite' }
    });
  }

  return elements;
}

/**
 * Builds elements for an Image Cover opening screen.
 */
function buildImageCoverElements(
  theme: InvitationTheme,
  coupleNames: string,
  subtitle: string,
  title: string,
  buttonText: string,
  sealColor: string,
  showButton: boolean
): CanvasElement[] {
  const elements: CanvasElement[] = [];

  // 1. Overline / Greeting
  elements.push({
    id: 'open-elem-title',
    type: 'heading',
    name: 'Overline Title',
    style: {
      x: 20,
      y: 90,
      width: 350,
      height: 28,
      fontSize: 11,
      fontWeight: 700,
      color: sealColor || '#f59e0b',
      textAlign: 'center',
      letterSpacing: 3,
      zIndex: 10
    },
    content: { text: title },
    animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
  });

  // 2. Couple / Event Names Headline
  elements.push({
    id: 'open-elem-couple',
    type: 'heading',
    name: 'Couple / Event Names',
    style: {
      x: 20,
      y: 130,
      width: 350,
      height: 90,
      fontSize: 34,
      fontFamily: theme.fontHeading || "'Cinzel', serif",
      fontWeight: 700,
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
      zIndex: 10
    },
    content: { text: coupleNames },
    animation: { type: 'slideUp', duration: 0.8, delay: 0.3 }
  });

  // 3. Date / Subtitle
  elements.push({
    id: 'open-elem-date',
    type: 'text',
    name: 'Date / Subtitle',
    style: {
      x: 20,
      y: 230,
      width: 350,
      height: 32,
      fontSize: 13,
      fontWeight: 500,
      color: '#e2e8f0',
      textAlign: 'center',
      letterSpacing: 2,
      zIndex: 10
    },
    content: { text: subtitle },
    animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
  });

  // 4. Open Button at bottom (if enabled)
  if (showButton) {
    elements.push({
      id: 'open-elem-button',
      type: 'button',
      name: 'Open Invitation Button',
      style: {
        x: 45,
        y: 690,
        width: 300,
        height: 52,
        backgroundColor: sealColor || '#d4af37',
        color: '#07120d',
        fontSize: 13,
        fontWeight: 800,
        borderRadius: 9999,
        boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.4)',
        letterSpacing: 1.5,
        zIndex: 12
      },
      content: {
        buttonText: buttonText,
        buttonAction: 'open-invitation',
        buttonShape: 'pill'
      },
      animation: { type: 'bounce', duration: 1.5, delay: 0.6, repeat: 'infinite' }
    });
  }

  return elements;
}

/**
 * Builds elements for a classic editable Envelope template.
 * All elements are top-level so they can be freely moved, edited, resized, or deleted on the canvas.
 */
function buildEnvelopeElements(
  theme: InvitationTheme,
  coupleNames: string,
  subtitle: string,
  title: string,
  buttonText: string,
  envelopeColor: string,
  sealColor: string,
  sealIcon: string,
  showButton: boolean
): CanvasElement[] {
  const elements: CanvasElement[] = [
    {
      id: 'open-container-card',
      type: 'shape',
      name: 'Envelope Card Frame',
      style: {
        x: 20,
        y: 80,
        width: 350,
        height: 600,
        backgroundColor: envelopeColor,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 40px rgba(212, 175, 55, 0.18)',
        zIndex: 1,
        shapeType: 'rectangle'
      },
      content: {},
      animation: {
        type: 'zoomIn',
        duration: 0.8,
        delay: 0.1
      }
    },
    {
      id: 'open-elem-icon',
      type: 'icon',
      name: 'Wax Seal Badge',
      style: {
        x: 160,
        y: 115,
        width: 70,
        height: 70,
        color: sealColor,
        backgroundColor: 'rgba(212, 175, 55, 0.18)',
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: sealColor,
        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
        zIndex: 10
      },
      content: {
        iconName: sealIcon || 'heart',
        iconColor: sealColor,
        iconSize: 32
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
      style: {
        x: 20,
        y: 200,
        width: 350,
        height: 28,
        fontSize: 11,
        fontWeight: 700,
        color: sealColor,
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 10
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
      style: {
        x: 20,
        y: 240,
        width: 350,
        height: 90,
        fontSize: 34,
        fontFamily: theme.fontHeading || "'Cinzel', serif",
        fontWeight: 700,
        color: '#fbfaf5',
        textAlign: 'center',
        lineHeight: 1.2,
        zIndex: 10
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
      style: {
        x: 95,
        y: 345,
        width: 200,
        height: 14,
        color: sealColor,
        opacity: 0.7,
        zIndex: 10
      },
      content: {},
      animation: {
        type: 'fadeIn',
        duration: 0.8,
        delay: 0.5
      }
    },
    {
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      style: {
        x: 20,
        y: 380,
        width: 350,
        height: 32,
        fontSize: 13,
        fontWeight: 500,
        color: '#e2e8f0',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 10
      },
      content: {
        text: subtitle
      },
      animation: {
        type: 'fadeIn',
        duration: 0.6,
        delay: 0.6
      }
    }
  ];

  if (showButton) {
    elements.push({
      id: 'open-elem-button',
      type: 'button',
      name: 'Open Invitation Button',
      style: {
        x: 45,
        y: 560,
        width: 300,
        height: 52,
        backgroundColor: sealColor,
        color: '#07120d',
        fontSize: 13,
        fontWeight: 800,
        borderRadius: 9999,
        boxShadow: '0 10px 30px -5px rgba(212, 175, 55, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
        letterSpacing: 1.5,
        zIndex: 15
      },
      content: {
        buttonText: buttonText,
        buttonAction: 'open-invitation',
        buttonShape: 'pill'
      },
      animation: {
        type: 'bounce',
        duration: 1.2,
        delay: 0.8,
        repeat: 'infinite'
      }
    });
  } else {
    elements.push({
      id: 'open-elem-seal-hint',
      type: 'text',
      name: 'Seal Tap Hint',
      style: {
        x: 20,
        y: 570,
        width: 350,
        height: 30,
        fontSize: 11,
        fontWeight: 700,
        color: sealColor,
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 15
      },
      content: {
        text: '✦ TAP WAX SEAL TO OPEN ✦'
      },
      animation: {
        type: 'pulse',
        duration: 2,
        delay: 0.8,
        repeat: 'infinite'
      }
    });
  }

  return elements;
}

/**
 * Builds or retrieves an InvitationPage for visual canvas editing of the Opening / Cover Screen.
 */
export function getOrCreateOpeningScreenPage(invitation: Partial<Invitation>): InvitationPage {
  const opening = invitation.openingScreen;
  const theme: InvitationTheme = invitation.theme || {
    primaryColor: '#d4af37',
    secondaryColor: '#0a3d2c',
    accentColor: '#d4af37',
    backgroundColor: '#071912',
    fontHeading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif",
    fontScript: "'Great Vibes', cursive"
  };

  const coupleNames = opening?.coupleNames || invitation.title || 'Alexander & Sophia';
  const subtitle = opening?.subtitle || invitation.eventDate || 'Saturday, October 24, 2026';
  const title = opening?.title || 'YOU ARE CORDIALLY INVITED';
  const buttonText = opening?.openButtonText || 'Open Invitation';
  const envelopeColor = opening?.envelopeColor || '#0e261d';
  const sealColor = opening?.sealColor || theme.primaryColor || '#d4af37';
  const sealIcon = opening?.sealIcon || 'heart';
  const coverType = opening?.coverType || (opening?.videoUrl ? 'video' : opening?.imageUrl ? 'image' : 'envelope');
  const showButton = opening?.showOpenButton !== false;

  // Determine Background Config based on Cover Type
  let background: BackgroundConfig;

  if (coverType === 'video') {
    background = {
      type: 'video',
      videoUrl: opening?.videoUrl || DEFAULT_STOCK_VIDEO,
      overlayColor: '#000000',
      overlayOpacity: 0.35
    };
  } else if (coverType === 'image') {
    background = {
      type: 'image',
      imageUrl: opening?.imageUrl || DEFAULT_STOCK_IMAGE,
      size: 'cover',
      position: 'center',
      overlayColor: '#000000',
      overlayOpacity: opening?.imageOverlayOpacity ?? 0.4
    };
  } else {
    // Envelope or Custom default background
    background = opening?.background || {
      type: 'gradient',
      gradient: {
        type: 'radial',
        colors: ['#172520', '#07120d'],
        angle: 180
      },
      overlayColor: sealColor,
      overlayOpacity: 0.05
    };
  }

  // If page already exists and has elements, preserve user's customizations!
  if (opening?.page?.elements && opening.page.elements.length > 0) {
    // Normalize any legacy elements that were trapped in container
    const normalizedElements = opening.page.elements.map(el => {
      if (el.parentContainerId === 'open-container-card' || el.parentId === 'open-container-card') {
        const { parentContainerId, parentId, ...rest } = el;
        return {
          ...rest,
          style: {
            ...el.style,
            zIndex: el.id === 'open-elem-button' ? 15 : (el.style?.zIndex || 10)
          }
        };
      }
      return el;
    });

    return {
      ...opening.page,
      background: opening.page.background || background,
      elements: normalizedElements
    };
  }

  // Generate fresh template elements for the chosen coverType
  let elements: CanvasElement[];
  if (coverType === 'video') {
    elements = buildVideoCoverElements(opening || { enabled: true, style: 'envelope' }, theme, coupleNames, subtitle, title, buttonText, sealColor);
  } else if (coverType === 'image') {
    elements = buildImageCoverElements(theme, coupleNames, subtitle, title, buttonText, sealColor, showButton);
  } else {
    elements = buildEnvelopeElements(theme, coupleNames, subtitle, title, buttonText, envelopeColor, sealColor, sealIcon, showButton);
  }

  return {
    id: 'opening-screen-page',
    name: 'Opening Screen',
    order: -1,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background,
    elements
  };
}

/**
 * Synchronizes an existing page when the user changes high-level opening screen settings.
 */
export function syncPageWithOpeningConfig(
  opening: OpeningScreenConfig,
  theme: InvitationTheme,
  prevPage?: InvitationPage,
  invitationTitle?: string,
  invitationDate?: string
): InvitationPage {
  const coupleNames = opening.coupleNames || invitationTitle || 'Alexander & Sophia';
  const subtitle = opening.subtitle || invitationDate || 'Saturday, October 24, 2026';
  const title = opening.title || 'YOU ARE CORDIALLY INVITED';
  const buttonText = opening.openButtonText || 'Open Invitation';
  const envelopeColor = opening.envelopeColor || '#0e261d';
  const sealColor = opening.sealColor || theme.primaryColor || '#d4af37';
  const sealIcon = opening.sealIcon || 'heart';
  const coverType = opening.coverType || (opening.videoUrl ? 'video' : opening.imageUrl ? 'image' : 'envelope');
  const showButton = opening.showOpenButton !== false;

  // 1. Establish the appropriate background
  let background: BackgroundConfig;
  if (coverType === 'video') {
    background = {
      type: 'video',
      videoUrl: opening.videoUrl || DEFAULT_STOCK_VIDEO,
      overlayColor: '#000000',
      overlayOpacity: 0.35
    };
  } else if (coverType === 'image') {
    background = {
      type: 'image',
      imageUrl: opening.imageUrl || DEFAULT_STOCK_IMAGE,
      size: 'cover',
      position: 'center',
      overlayColor: '#000000',
      overlayOpacity: opening.imageOverlayOpacity ?? 0.4
    };
  } else if (coverType === 'custom-page') {
    background = prevPage?.background || opening.background || {
      type: 'gradient',
      gradient: { type: 'radial', colors: ['#172520', '#07120d'], angle: 180 },
      overlayColor: sealColor,
      overlayOpacity: 0.05
    };
  } else {
    // Envelope
    background = {
      type: 'gradient',
      gradient: { type: 'radial', colors: ['#172520', '#07120d'], angle: 180 },
      overlayColor: sealColor,
      overlayOpacity: 0.05
    };
  }

  // If custom-page, preserve user's elements
  if (coverType === 'custom-page' && prevPage?.elements) {
    return {
      ...prevPage,
      background
    };
  }

  // Check if we need to regenerate elements due to coverType change
  const hadEnvelopeCard = prevPage?.elements?.some(el => el.id === 'open-container-card');
  const needsElementsRegen = (coverType === 'envelope' && !hadEnvelopeCard) ||
    ((coverType === 'video' || coverType === 'image') && hadEnvelopeCard);

  if (needsElementsRegen || !prevPage?.elements || prevPage.elements.length === 0) {
    let elements: CanvasElement[];
    if (coverType === 'video') {
      elements = buildVideoCoverElements(opening, theme, coupleNames, subtitle, title, buttonText, sealColor);
    } else if (coverType === 'image') {
      elements = buildImageCoverElements(theme, coupleNames, subtitle, title, buttonText, sealColor, showButton);
    } else {
      elements = buildEnvelopeElements(theme, coupleNames, subtitle, title, buttonText, envelopeColor, sealColor, sealIcon, showButton);
    }

    return {
      id: 'opening-screen-page',
      name: 'Opening Screen',
      order: -1,
      heightMode: 'viewport',
      height: 844,
      isFullHeight: true,
      background,
      elements
    };
  }

  // Otherwise, incrementally update elements
  let updatedElements = prevPage.elements.map(el => {
    if (el.id === 'open-elem-button') {
      return {
        ...el,
        content: { ...el.content, buttonText: buttonText },
        style: { ...el.style, backgroundColor: sealColor }
      };
    }
    if (el.id === 'open-elem-couple') {
      return { ...el, content: { ...el.content, text: coupleNames } };
    }
    if (el.id === 'open-elem-date') {
      return { ...el, content: { ...el.content, text: subtitle } };
    }
    if (el.id === 'open-elem-title') {
      return { ...el, content: { ...el.content, text: title }, style: { ...el.style, color: sealColor } };
    }
    if (el.id === 'open-container-card') {
      return { ...el, style: { ...el.style, backgroundColor: envelopeColor } };
    }
    if (el.id === 'open-elem-icon') {
      return {
        ...el,
        content: { ...el.content, iconName: sealIcon, iconColor: sealColor },
        style: { ...el.style, color: sealColor, borderColor: sealColor }
      };
    }
    return el;
  });

  // Handle center play button for video mode
  if (coverType === 'video') {
    const isClickToPlay = opening.videoPlayMode === 'click-to-play';
    const hasPlayBtn = updatedElements.some(el => el.id === 'open-elem-play-btn');
    if (isClickToPlay && !hasPlayBtn) {
      updatedElements.push({
        id: 'open-elem-play-btn',
        type: 'icon',
        name: 'Center Play Button',
        style: {
          x: 155,
          y: 350,
          width: 80,
          height: 80,
          color: '#07120d',
          backgroundColor: sealColor || '#d4af37',
          borderRadius: 9999,
          borderWidth: 3,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 35px rgba(212, 175, 55, 0.5)',
          zIndex: 15
        },
        content: {
          iconName: 'play',
          iconColor: '#07120d',
          iconSize: 32
        },
        animation: { type: 'pulse', duration: 2, delay: 0.5, repeat: 'infinite' }
      });
    } else if (!isClickToPlay && hasPlayBtn) {
      updatedElements = updatedElements.filter(el => el.id !== 'open-elem-play-btn');
    }
  }

  // Handle open button visibility toggle
  const hasButton = updatedElements.some(el => el.id === 'open-elem-button');
  if (!showButton && hasButton) {
    updatedElements = updatedElements.filter(el => el.id !== 'open-elem-button');
    if (coverType === 'envelope' && !updatedElements.some(el => el.id === 'open-elem-seal-hint')) {
      const hint = buildEnvelopeElements(theme, coupleNames, subtitle, title, buttonText, envelopeColor, sealColor, sealIcon, false).find(el => el.id === 'open-elem-seal-hint');
      if (hint) updatedElements.push(hint);
    }
  } else if (showButton && !hasButton) {
    updatedElements = updatedElements.filter(el => el.id !== 'open-elem-seal-hint');
    const newBtn = coverType === 'envelope'
      ? buildEnvelopeElements(theme, coupleNames, subtitle, title, buttonText, envelopeColor, sealColor, sealIcon, true).find(el => el.id === 'open-elem-button')
      : coverType === 'image'
      ? buildImageCoverElements(theme, coupleNames, subtitle, title, buttonText, sealColor, true).find(el => el.id === 'open-elem-button')
      : buildVideoCoverElements(opening, theme, coupleNames, subtitle, title, buttonText, sealColor).find(el => el.id === 'open-elem-button');
    if (newBtn) updatedElements.push(newBtn);
  }

  return {
    ...prevPage,
    background,
    elements: updatedElements
  };
}

/**
 * Keeps the high-level OpeningScreenConfig in sync when visual page elements or background change.
 */
export function syncOpeningScreenWithPage(
  currentConfig: OpeningScreenConfig | undefined,
  page: InvitationPage
): OpeningScreenConfig {
  const nextConfig: OpeningScreenConfig = {
    enabled: currentConfig?.enabled !== undefined ? currentConfig.enabled : true,
    coverType: currentConfig?.coverType || 'envelope',
    style: currentConfig?.style || 'envelope',
    musicAutoplayOnOpen: currentConfig?.musicAutoplayOnOpen !== undefined ? currentConfig.musicAutoplayOnOpen : true,
    envelopeColor: currentConfig?.envelopeColor || '#0e261d',
    sealColor: currentConfig?.sealColor || '#d4af37',
    showOpenButton: currentConfig?.showOpenButton !== false,
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

  const sealElem = page.elements.find(el => el.id === 'open-elem-icon');
  if (sealElem?.content?.iconName) {
    nextConfig.sealIcon = sealElem.content.iconName;
  }
  if (sealElem?.style?.color) {
    nextConfig.sealColor = sealElem.style.color;
  }

  // If page background is video or image, sync coverType
  if (page.background?.type === 'video' && page.background.videoUrl) {
    nextConfig.videoUrl = page.background.videoUrl;
  } else if (page.background?.type === 'image' && page.background.imageUrl) {
    nextConfig.imageUrl = page.background.imageUrl;
  }

  return nextConfig;
}
