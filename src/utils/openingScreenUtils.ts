import {
  Invitation,
  InvitationPage,
  OpeningScreenConfig,
  BackgroundConfig,
  CanvasElement,
  InvitationTheme,
  OpeningCoverType
} from '../types';

export const DEFAULT_STOCK_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4';
export const DEFAULT_STOCK_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
export const DEFAULT_COVER_WIDTH = 520;
export const DEFAULT_COVER_HEIGHT = 400;

/**
 * Creates an editable, selectable Open Invitation Button canvas element.
 */
export function createOpenInvitationButtonElement(
  theme?: Partial<InvitationTheme>,
  buttonText: string = 'Open Invitation',
  sealColor: string = '#c5a059',
  y: number = 245,
  x: number = 140,
  width: number = 240
): CanvasElement {
  return {
    id: 'open-elem-button',
    type: 'button',
    name: 'Open Invitation Button',
    style: {
      x,
      y,
      width,
      height: 44,
      backgroundColor: sealColor || theme?.primaryColor || '#c5a059',
      color: '#09090b',
      fontSize: 12,
      fontWeight: 800,
      borderRadius: 9999,
      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 20px rgba(197, 160, 89, 0.35)',
      letterSpacing: 1.5,
      zIndex: 20
    },
    content: {
      buttonText: buttonText || 'Open Invitation',
      buttonAction: 'open-invitation',
      buttonShape: 'pill'
    },
    animation: {
      type: 'bounce',
      duration: 1.5,
      delay: 0.6,
      repeat: 'infinite'
    }
  };
}

/**
 * Builds elements for a Video Cover opening screen.
 * Titles on top of video are optional and can be toggled by the user.
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

  const showText = opening?.showTextOnCover !== false;
  const showOverline = showText && opening?.showOverline !== false;
  const showCouple = showText && opening?.showCoupleNames !== false;
  const showDate = showText && opening?.showDateSubtitle !== false;
  const hasAnyText = showOverline || showCouple || showDate;

  // 1. Overline / Greeting (Optional)
  if (showOverline) {
    elements.push({
      id: 'open-elem-title',
      type: 'heading',
      name: 'Overline Title',
      style: {
        x: 30,
        y: 42,
        width: 460,
        height: 22,
        fontSize: 10,
        fontWeight: 700,
        color: sealColor || '#f59e0b',
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 10
      },
      content: { text: title },
      animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
    });
  }

  // 2. Couple / Event Names Headline (Optional)
  if (showCouple) {
    elements.push({
      id: 'open-elem-couple',
      type: 'heading',
      name: 'Couple / Event Names',
      style: {
        x: 30,
        y: showOverline ? 70 : 50,
        width: 460,
        height: 56,
        fontSize: 26,
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
  }

  // 3. Date / Subtitle (Optional)
  if (showDate) {
    elements.push({
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      style: {
        x: 30,
        y: showCouple ? 132 : 80,
        width: 460,
        height: 24,
        fontSize: 12,
        fontWeight: 500,
        color: '#e2e8f0',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 10
      },
      content: { text: subtitle },
      animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
    });
  }

  // 4. Center Play Button if click-to-play
  if (isClickToPlay) {
    elements.push({
      id: 'open-elem-play-btn',
      type: 'icon',
      name: 'Center Play Button',
      style: {
        x: 228,
        y: hasAnyText ? 172 : 140,
        width: 64,
        height: 64,
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
        iconSize: 28
      },
      animation: { type: 'pulse', duration: 2, delay: 0.5, repeat: 'infinite' }
    });
  }

  // 5. Open Button at bottom (if enabled)
  if (showButton) {
    const btnY = isClickToPlay ? 255 : (hasAnyText ? 245 : 200);
    elements.push(createOpenInvitationButtonElement(theme, buttonText, sealColor, btnY, 140, 240));
  }

  return elements;
}

/**
 * Builds elements for an Image Cover opening screen.
 * Titles on top of image are optional and can be toggled by the user.
 */
function buildImageCoverElements(
  opening: OpeningScreenConfig | undefined,
  theme: InvitationTheme,
  coupleNames: string,
  subtitle: string,
  title: string,
  buttonText: string,
  sealColor: string,
  showButton: boolean
): CanvasElement[] {
  const elements: CanvasElement[] = [];

  const showText = opening?.showTextOnCover !== false;
  const showOverline = showText && opening?.showOverline !== false;
  const showCouple = showText && opening?.showCoupleNames !== false;
  const showDate = showText && opening?.showDateSubtitle !== false;
  const hasAnyText = showOverline || showCouple || showDate;

  // 1. Overline / Greeting (Optional)
  if (showOverline) {
    elements.push({
      id: 'open-elem-title',
      type: 'heading',
      name: 'Overline Title',
      style: {
        x: 30,
        y: 45,
        width: 460,
        height: 22,
        fontSize: 10,
        fontWeight: 700,
        color: sealColor || '#f59e0b',
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 10
      },
      content: { text: title },
      animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
    });
  }

  // 2. Couple / Event Names Headline (Optional)
  if (showCouple) {
    elements.push({
      id: 'open-elem-couple',
      type: 'heading',
      name: 'Couple / Event Names',
      style: {
        x: 30,
        y: showOverline ? 72 : 50,
        width: 460,
        height: 56,
        fontSize: 26,
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
  }

  // 3. Date / Subtitle (Optional)
  if (showDate) {
    elements.push({
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      style: {
        x: 30,
        y: showCouple ? 134 : 85,
        width: 460,
        height: 24,
        fontSize: 12,
        fontWeight: 500,
        color: '#e2e8f0',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 10
      },
      content: { text: subtitle },
      animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
    });
  }

  // 4. Open Button at bottom (if enabled)
  if (showButton) {
    const btnY = hasAnyText ? 245 : 180;
    elements.push(createOpenInvitationButtonElement(theme, buttonText, sealColor, btnY, 140, 240));
  }

  return elements;
}

/**
 * Builds elements for the default "Simple Modern" Envelope template (520w x 400h).
 */
export function buildSimpleModernEnvelopeElements(
  theme: InvitationTheme,
  coupleNames: string,
  subtitle: string,
  title: string,
  buttonText: string,
  envelopeColor: string,
  sealColor: string,
  sealIcon: string,
  showButton: boolean,
  options?: {
    showTextOnCover?: boolean;
    showOverline?: boolean;
    showCoupleNames?: boolean;
    showDateSubtitle?: boolean;
  }
): CanvasElement[] {
  const showText = options?.showTextOnCover !== false;
  const showOverline = showText && options?.showOverline !== false;
  const showCouple = showText && options?.showCoupleNames !== false;
  const showDate = showText && options?.showDateSubtitle !== false;

  const elements: CanvasElement[] = [
    {
      id: 'open-container-card',
      type: 'shape',
      name: 'Envelope Card Frame',
      style: {
        x: 20,
        y: 20,
        width: 480,
        height: 360,
        backgroundColor: envelopeColor || '#18181b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
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
        x: 233,
        y: 38,
        width: 54,
        height: 54,
        color: sealColor || '#c5a059',
        backgroundColor: 'rgba(197, 160, 89, 0.15)',
        borderRadius: 9999,
        borderWidth: 1.5,
        borderColor: sealColor || '#c5a059',
        boxShadow: '0 4px 16px rgba(197, 160, 89, 0.25)',
        zIndex: 10
      },
      content: {
        iconName: sealIcon || 'heart',
        iconColor: sealColor || '#c5a059',
        iconSize: 26
      },
      animation: {
        type: 'pulse',
        duration: 2.2,
        delay: 0.5,
        repeat: 'infinite'
      }
    }
  ];

  if (showOverline) {
    elements.push({
      id: 'open-elem-title',
      type: 'heading',
      name: 'Overline Title',
      style: {
        x: 30,
        y: 104,
        width: 460,
        height: 20,
        fontSize: 10,
        fontWeight: 700,
        color: sealColor || '#c5a059',
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 10
      },
      content: { text: title },
      animation: { type: 'fadeIn', duration: 0.6, delay: 0.3 }
    });
  }

  if (showCouple) {
    elements.push({
      id: 'open-elem-couple',
      type: 'heading',
      name: 'Couple / Event Names',
      style: {
        x: 30,
        y: showOverline ? 128 : 108,
        width: 460,
        height: 54,
        fontSize: 26,
        fontFamily: theme.fontHeading || "'Cinzel', serif",
        fontWeight: 700,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 1.2,
        zIndex: 10
      },
      content: { text: coupleNames },
      animation: { type: 'slideUp', duration: 0.7, delay: 0.4 }
    });
  }

  elements.push({
    id: 'open-elem-divider',
    type: 'divider',
    name: 'Modern Accent Divider',
    style: {
      x: 185,
      y: 188,
      width: 150,
      height: 8,
      color: sealColor || '#c5a059',
      opacity: 0.5,
      zIndex: 10
    },
    content: {},
    animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
  });

  if (showDate) {
    elements.push({
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      style: {
        x: 30,
        y: 202,
        width: 460,
        height: 24,
        fontSize: 12,
        fontWeight: 500,
        color: '#94a3b8',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 10
      },
      content: { text: subtitle },
      animation: { type: 'fadeIn', duration: 0.6, delay: 0.6 }
    });
  }

  if (showButton) {
    elements.push(createOpenInvitationButtonElement(theme, buttonText, sealColor, 245, 140, 240));
  } else {
    elements.push({
      id: 'open-elem-seal-hint',
      type: 'text',
      name: 'Seal Tap Hint',
      style: {
        x: 30,
        y: 248,
        width: 460,
        height: 24,
        fontSize: 11,
        fontWeight: 700,
        color: sealColor || '#c5a059',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 15
      },
      content: { text: '✦ TAP WAX SEAL TO OPEN ✦' },
      animation: { type: 'pulse', duration: 2, delay: 0.8, repeat: 'infinite' }
    });
  }

  return elements;
}

/**
 * Builds the default minimal cover screen layout:
 * Minimal elegant card with two names prominently centered and an open button.
 * Accepts either an OpeningScreenConfig object or individual parameters.
 */
export function buildMinimalEnvelopeElements(
  configOrTheme?: OpeningScreenConfig | InvitationTheme,
  coupleNamesArg?: string,
  subtitleArg?: string,
  titleArg?: string,
  buttonTextArg?: string,
  envelopeColorArg?: string,
  sealColorArg?: string,
  showButtonArg?: boolean,
  optionsArg?: {
    showTextOnCover?: boolean;
    showOverline?: boolean;
    showCoupleNames?: boolean;
    showDateSubtitle?: boolean;
  }
): CanvasElement[] {
  // Check if first argument is an OpeningScreenConfig object
  const isConfigObj = configOrTheme && ('coverType' in configOrTheme || 'openButtonText' in configOrTheme || 'envelopeColor' in configOrTheme);
  const cfg = isConfigObj ? (configOrTheme as OpeningScreenConfig) : undefined;
  const theme: Partial<InvitationTheme> = (!isConfigObj && configOrTheme) ? (configOrTheme as InvitationTheme) : {};

  const coupleNames = cfg?.coupleNames || coupleNamesArg || 'Alexander & Sophia';
  const subtitle = cfg?.subtitle || subtitleArg || 'Saturday, October 24, 2026';
  const title = cfg?.title || titleArg || 'YOU ARE CORDIALLY INVITED';
  const buttonText = cfg?.openButtonText || buttonTextArg || 'Open Invitation';
  const envelopeColor = cfg?.envelopeColor || envelopeColorArg || '#18181b';
  const sealColor = cfg?.sealColor || sealColorArg || theme.primaryColor || '#c5a059';
  const showButton = cfg?.showOpenButton !== undefined ? cfg.showOpenButton : (showButtonArg !== undefined ? showButtonArg : true);

  const showText = cfg?.showTextOnCover !== undefined ? cfg.showTextOnCover : (optionsArg?.showTextOnCover !== false);
  const showOverline = cfg?.showOverline !== undefined ? cfg.showOverline : Boolean(optionsArg?.showOverline);
  const showCouple = cfg?.showCoupleNames !== undefined ? cfg.showCoupleNames : (optionsArg?.showCoupleNames !== false);
  const showDate = cfg?.showDateSubtitle !== undefined ? cfg.showDateSubtitle : Boolean(optionsArg?.showDateSubtitle);

  const elements: CanvasElement[] = [
    {
      id: 'open-container-card',
      type: 'shape',
      name: 'Minimal Cover Frame',
      style: {
        x: 20,
        y: 20,
        width: 480,
        height: 360,
        backgroundColor: envelopeColor || '#18181b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        zIndex: 1,
        shapeType: 'rectangle'
      },
      content: {},
      animation: {
        type: 'zoomIn',
        duration: 0.8,
        delay: 0.1
      }
    }
  ];

  if (showOverline) {
    elements.push({
      id: 'open-elem-title',
      type: 'heading',
      name: 'Overline Title',
      style: {
        x: 30,
        y: 75,
        width: 460,
        height: 20,
        fontSize: 10,
        fontWeight: 700,
        color: sealColor || '#c5a059',
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 10
      },
      content: { text: title },
      animation: { type: 'fadeIn', duration: 0.6, delay: 0.2 }
    });
  }

  // Two Names (Prominently & beautifully centered)
  if (showCouple) {
    elements.push({
      id: 'open-elem-couple',
      type: 'heading',
      name: 'Two Names',
      style: {
        x: 30,
        y: showOverline ? 108 : 124,
        width: 460,
        height: 68,
        fontSize: 32,
        fontFamily: theme.fontHeading || "'Cinzel', serif",
        fontWeight: 700,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 1.25,
        letterSpacing: 1,
        zIndex: 10
      },
      content: { text: coupleNames },
      animation: { type: 'slideUp', duration: 0.8, delay: 0.25 }
    });
  }

  if (showDate) {
    elements.push({
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      style: {
        x: 30,
        y: 195,
        width: 460,
        height: 24,
        fontSize: 12,
        fontWeight: 500,
        color: '#94a3b8',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 10
      },
      content: { text: subtitle },
      animation: { type: 'fadeIn', duration: 0.6, delay: 0.35 }
    });
  }

  // Open Button: clean, centered
  if (showButton) {
    const btnY = showDate ? 232 : (showOverline ? 212 : 218);
    elements.push(createOpenInvitationButtonElement(theme, buttonText, sealColor, btnY, 135, 250));
  }

  return elements;
}

/**
 * Builds elements for the Envelope cover. Defaults to minimal one with two names and button.
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
  showButton: boolean,
  template: string = 'minimal-default',
  options?: {
    showTextOnCover?: boolean;
    showOverline?: boolean;
    showCoupleNames?: boolean;
    showDateSubtitle?: boolean;
  }
): CanvasElement[] {
  // Default to minimal one with two names and button
  return buildMinimalEnvelopeElements(
    theme,
    coupleNames,
    subtitle,
    title,
    buttonText,
    envelopeColor,
    sealColor,
    showButton,
    options
  );
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
  const coverType: OpeningCoverType =
    opening?.coverType ||
    (opening?.style === 'video-cover'
      ? 'video'
      : opening?.style === 'card-flip'
      ? 'image'
      : opening?.style === 'custom-page'
      ? 'custom-page'
      : opening?.imageUrl
      ? 'image'
      : opening?.videoUrl
      ? 'video'
      : 'envelope');
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

  // If custom-page, return blank canvas or preserved elements
  if (coverType === 'custom-page') {
    return {
      id: opening?.page?.id || 'opening-screen-page',
      name: 'Opening Screen',
      order: -1,
      width: opening?.page?.width || DEFAULT_COVER_WIDTH,
      height: opening?.page?.height || DEFAULT_COVER_HEIGHT,
      heightMode: opening?.page?.heightMode || 'custom',
      isFullHeight: opening?.page?.isFullHeight || false,
      background,
      elements: opening?.page?.elements || []
    };
  }

  // If page already exists and has elements, preserve user's customizations!
  if (opening?.page?.elements && opening.page.elements.length > 0) {
    // Normalize any legacy elements that were trapped in container
    let normalizedElements = opening.page.elements.map(el => {
      if (el.parentContainerId === 'open-container-card' || el.parentId === 'open-container-card') {
        const { parentContainerId, parentId, ...rest } = el;
        return {
          ...rest,
          style: {
            ...el.style,
            zIndex: el.id === 'open-elem-button' ? 20 : (el.style?.zIndex || 10)
          }
        };
      }
      return el;
    });

    const hasButton = normalizedElements.some(
      el => el.id === 'open-elem-button' || el.content?.buttonAction === 'open-invitation' || el.type === 'button'
    );

    if (showButton && !hasButton) {
      // User has button enabled, add the editable button
      normalizedElements.push(
        createOpenInvitationButtonElement(
          theme,
          buttonText,
          sealColor,
          245,
          140,
          240
        )
      );
    } else if (showButton && hasButton) {
      // Ensure button isn't placed off-canvas (e.g. legacy y: 560 or y: 690)
      normalizedElements = normalizedElements.map(el => {
        if ((el.id === 'open-elem-button' || el.content?.buttonAction === 'open-invitation') && el.style?.y && el.style.y > 340) {
          return {
            ...el,
            style: {
              ...el.style,
              y: 245,
              x: el.style.x !== undefined ? el.style.x : 140,
              width: el.style.width || 240,
              zIndex: Math.max(el.style?.zIndex || 0, 20)
            }
          };
        }
        return el;
      });
    } else if (!showButton && hasButton) {
      // User disabled button
      normalizedElements = normalizedElements.filter(
        el => el.id !== 'open-elem-button' && el.content?.buttonAction !== 'open-invitation'
      );
    }

    return {
      ...opening.page,
      width: opening.page.width || DEFAULT_COVER_WIDTH,
      height: opening.page.height || DEFAULT_COVER_HEIGHT,
      heightMode: opening.page.heightMode || 'custom',
      isFullHeight: opening.page.isFullHeight || false,
      background: opening.page.background || background,
      elements: normalizedElements
    };
  }

  // Generate fresh template elements for the chosen coverType
  let elements: CanvasElement[];
  const titleOptions = {
    showTextOnCover: opening?.showTextOnCover,
    showOverline: opening?.showOverline,
    showCoupleNames: opening?.showCoupleNames,
    showDateSubtitle: opening?.showDateSubtitle
  };

  if (coverType === 'video') {
    elements = buildVideoCoverElements(opening || { enabled: true, style: 'envelope' }, theme, coupleNames, subtitle, title, buttonText, sealColor);
  } else if (coverType === 'image') {
    elements = buildImageCoverElements(opening, theme, coupleNames, subtitle, title, buttonText, sealColor, showButton);
  } else {
    elements = buildEnvelopeElements(
      theme,
      coupleNames,
      subtitle,
      title,
      buttonText,
      envelopeColor,
      sealColor,
      sealIcon,
      showButton,
      opening?.envelopeTemplate || 'simple-modern',
      titleOptions
    );
  }

  return {
    id: 'opening-screen-page',
    name: 'Opening Screen',
    order: -1,
    width: opening?.page?.width || DEFAULT_COVER_WIDTH,
    height: opening?.page?.height || DEFAULT_COVER_HEIGHT,
    heightMode: opening?.page?.heightMode || 'custom',
    isFullHeight: opening?.page?.isFullHeight || false,
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
  const envelopeColor = opening.envelopeColor || '#18181b';
  const sealColor = opening.sealColor || theme.primaryColor || '#c5a059';
  const sealIcon = opening.sealIcon || 'heart';
  const coverType: OpeningCoverType =
    opening.coverType ||
    (opening.style === 'card-flip' || prevPage?.background?.type === 'image' || opening.background?.type === 'image'
      ? 'image'
      : opening.style === 'video-cover' || prevPage?.background?.type === 'video' || opening.background?.type === 'video'
      ? 'video'
      : opening.style === 'custom-page'
      ? 'custom-page'
      : 'envelope');
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

  // If custom-page, provide a clean blank canvas if switching from a template
  if (coverType === 'custom-page') {
    const isFromTemplate = prevPage?.elements?.some(el => el.id === 'open-container-card');
    return {
      id: prevPage?.id || 'opening-screen-page',
      name: 'Opening Screen',
      order: -1,
      width: prevPage?.width || DEFAULT_COVER_WIDTH,
      height: prevPage?.height || DEFAULT_COVER_HEIGHT,
      heightMode: prevPage?.heightMode || 'custom',
      isFullHeight: prevPage?.isFullHeight || false,
      background,
      elements: isFromTemplate ? [] : (prevPage?.elements || [])
    };
  }

  // Check if we need to regenerate elements due to coverType change
  const hadEnvelopeCard = prevPage?.elements?.some(el => el.id === 'open-container-card');
  const needsElementsRegen = (coverType === 'envelope' && !hadEnvelopeCard) ||
    ((coverType === 'video' || coverType === 'image') && hadEnvelopeCard);

  const titleOptions = {
    showTextOnCover: opening.showTextOnCover,
    showOverline: opening.showOverline,
    showCoupleNames: opening.showCoupleNames,
    showDateSubtitle: opening.showDateSubtitle
  };

  if (needsElementsRegen || !prevPage?.elements || prevPage.elements.length === 0) {
    let elements: CanvasElement[];
    if (coverType === 'video') {
      elements = buildVideoCoverElements(opening, theme, coupleNames, subtitle, title, buttonText, sealColor);
    } else if (coverType === 'image') {
      elements = buildImageCoverElements(opening, theme, coupleNames, subtitle, title, buttonText, sealColor, showButton);
    } else {
      elements = buildEnvelopeElements(
        theme,
        coupleNames,
        subtitle,
        title,
        buttonText,
        envelopeColor,
        sealColor,
        sealIcon,
        showButton,
        opening.envelopeTemplate || 'simple-modern',
        titleOptions
      );
    }

    return {
      id: 'opening-screen-page',
      name: 'Opening Screen',
      order: -1,
      width: prevPage?.width || DEFAULT_COVER_WIDTH,
      height: prevPage?.height || DEFAULT_COVER_HEIGHT,
      heightMode: prevPage?.heightMode || 'custom',
      isFullHeight: prevPage?.isFullHeight || false,
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

  // Handle optional titles visibility
  const showText = opening.showTextOnCover !== false;
  const showOverline = showText && opening.showOverline !== false;
  const showCouple = showText && opening.showCoupleNames !== false;
  const showDate = showText && opening.showDateSubtitle !== false;

  // Filter out any titles that are now disabled
  updatedElements = updatedElements.filter(el => {
    if (el.id === 'open-elem-title' && !showOverline) return false;
    if (el.id === 'open-elem-couple' && !showCouple) return false;
    if (el.id === 'open-elem-date' && !showDate) return false;
    return true;
  });

  // If a title was re-enabled and missing, re-add it
  if (showOverline && !updatedElements.some(el => el.id === 'open-elem-title')) {
    updatedElements.push({
      id: 'open-elem-title',
      type: 'heading',
      name: 'Overline Title',
      style: {
        x: 30,
        y: coverType === 'envelope' ? 104 : 45,
        width: 460,
        height: 20,
        fontSize: 10,
        fontWeight: 700,
        color: sealColor,
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 10
      },
      content: { text: title },
      animation: { type: 'fadeIn', duration: 0.6, delay: 0.3 }
    });
  }

  if (showCouple && !updatedElements.some(el => el.id === 'open-elem-couple')) {
    updatedElements.push({
      id: 'open-elem-couple',
      type: 'heading',
      name: 'Couple / Event Names',
      style: {
        x: 30,
        y: coverType === 'envelope' ? 128 : 72,
        width: 460,
        height: 54,
        fontSize: 26,
        fontFamily: theme.fontHeading || "'Cinzel', serif",
        fontWeight: 700,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 1.2,
        zIndex: 10
      },
      content: { text: coupleNames },
      animation: { type: 'slideUp', duration: 0.7, delay: 0.4 }
    });
  }

  if (showDate && !updatedElements.some(el => el.id === 'open-elem-date')) {
    updatedElements.push({
      id: 'open-elem-date',
      type: 'text',
      name: 'Date / Subtitle',
      style: {
        x: 30,
        y: coverType === 'envelope' ? 202 : 132,
        width: 460,
        height: 24,
        fontSize: 12,
        fontWeight: 500,
        color: '#94a3b8',
        textAlign: 'center',
        letterSpacing: 2,
        zIndex: 10
      },
      content: { text: subtitle },
      animation: { type: 'fadeIn', duration: 0.6, delay: 0.6 }
    });
  }

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
          x: 228,
          y: 172,
          width: 64,
          height: 64,
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
          iconSize: 28
        },
        animation: { type: 'pulse', duration: 2, delay: 0.5, repeat: 'infinite' }
      });
    } else if (!isClickToPlay && hasPlayBtn) {
      updatedElements = updatedElements.filter(el => el.id !== 'open-elem-play-btn');
    }
  }

  // Handle open button visibility toggle
  const hasButton = updatedElements.some(
    el => el.id === 'open-elem-button' || el.content?.buttonAction === 'open-invitation' || el.type === 'button'
  );
  if (!showButton && hasButton) {
    updatedElements = updatedElements.filter(
      el => el.id !== 'open-elem-button' && el.content?.buttonAction !== 'open-invitation'
    );
    if (coverType === 'envelope' && !updatedElements.some(el => el.id === 'open-elem-seal-hint')) {
      const hint = buildEnvelopeElements(theme, coupleNames, subtitle, title, buttonText, envelopeColor, sealColor, sealIcon, false, opening.envelopeTemplate || 'simple-modern', titleOptions).find(el => el.id === 'open-elem-seal-hint');
      if (hint) updatedElements.push(hint);
    }
  } else if (showButton && !hasButton) {
    updatedElements = updatedElements.filter(el => el.id !== 'open-elem-seal-hint');
    const newBtn = createOpenInvitationButtonElement(
      theme,
      buttonText,
      sealColor,
      245,
      140,
      240
    );
    updatedElements.push(newBtn);
  }

  return {
    ...prevPage,
    width: prevPage?.width || DEFAULT_COVER_WIDTH,
    height: prevPage?.height || DEFAULT_COVER_HEIGHT,
    heightMode: prevPage?.heightMode || 'custom',
    isFullHeight: prevPage?.isFullHeight || false,
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
  const buttonElem = page.elements.find(
    el => el.id === 'open-elem-button' || el.content?.buttonAction === 'open-invitation' || el.type === 'button'
  );
  const hasButton = Boolean(buttonElem);

  // Derive cover type from page background if available
  let resolvedCoverType: OpeningCoverType = currentConfig?.coverType || 'envelope';
  if (page.background?.type === 'image') {
    resolvedCoverType = 'image';
  } else if (page.background?.type === 'video') {
    resolvedCoverType = 'video';
  } else if (currentConfig?.coverType === 'custom-page') {
    resolvedCoverType = 'custom-page';
  }

  const nextConfig: OpeningScreenConfig = {
    enabled: currentConfig?.enabled !== undefined ? currentConfig.enabled : true,
    style:
      resolvedCoverType === 'video'
        ? 'video-cover'
        : resolvedCoverType === 'image'
        ? 'card-flip'
        : resolvedCoverType === 'custom-page'
        ? 'custom-page'
        : 'envelope',
    musicAutoplayOnOpen: currentConfig?.musicAutoplayOnOpen !== undefined ? currentConfig.musicAutoplayOnOpen : true,
    envelopeColor: currentConfig?.envelopeColor || '#0e261d',
    sealColor: currentConfig?.sealColor || '#d4af37',
    showOpenButton: hasButton,
    ...currentConfig,
    coverType: resolvedCoverType,
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
    nextConfig.coverType = 'video';
    nextConfig.style = 'video-cover';
  } else if (page.background?.type === 'image' && page.background.imageUrl) {
    nextConfig.imageUrl = page.background.imageUrl;
    nextConfig.coverType = 'image';
    nextConfig.style = 'card-flip';
  }

  return nextConfig;
}
