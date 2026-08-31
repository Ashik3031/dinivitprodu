import { PageTemplate, PrebuiltBlock } from '../../types';

// 1. OPENING - Cover page
export const coverPageTemplate: PageTemplate = {
  id: 'tmpl-opening-cover',
  name: 'Cover Page',
  category: 'opening',
  subcategory: 'Opening',
  description: 'Classic luxury monogram seal, couple typography display, arch portrait, and date badge.',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Cover Page',
    order: 0,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 180,
        colors: ['#071912', '#0d281e', '#071912']
      },
      overlayColor: '#d4af37',
      overlayOpacity: 0.05
    },
    elements: [
      {
        id: 'cov-border',
        type: 'container',
        name: 'Gilded Border Frame',
        style: {
          x: 16,
          y: 16,
          width: 358,
          height: 812,
          shape: 'rounded-rectangle',
          borderRadius: 24,
          borderWidth: 1,
          borderColor: '#d4af3766',
          backgroundColor: '#0d281e22'
        },
        content: {},
        animation: { type: 'fadeIn', duration: 1, delay: 0.1 }
      },
      {
        id: 'cov-monogram-circle',
        type: 'container',
        name: 'Monogram Seal Circle',
        style: {
          x: 155,
          y: 50,
          width: 80,
          height: 80,
          shape: 'circle',
          backgroundColor: '#d4af371a',
          borderWidth: 1.5,
          borderColor: '#d4af37',
          boxShadow: '0 4px 20px rgba(212,175,55,0.2)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'cov-monogram-txt',
        type: 'text',
        name: 'Monogram Initials',
        style: {
          x: 155,
          y: 68,
          width: 80,
          height: 44,
          fontFamily: "'Cinzel', serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 3
        },
        content: { text: 'A & S' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'cov-sub',
        type: 'text',
        name: 'Announcement Subtitle',
        style: {
          x: 30,
          y: 150,
          width: 330,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 4
        },
        content: { text: 'THE WEDDING CELEBRATION OF' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'cov-names',
        type: 'heading',
        name: 'Couple Names',
        style: {
          x: 20,
          y: 180,
          width: 350,
          height: 110,
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#f9f6ee',
          textAlign: 'center',
          lineHeight: 1.25
        },
        content: { text: 'Alexander\n&\nSophia' },
        animation: { type: 'fadeIn', duration: 1, delay: 0.4 }
      },
      {
        id: 'cov-arch',
        type: 'container',
        name: 'Arch Portrait Window',
        style: {
          x: 75,
          y: 310,
          width: 240,
          height: 330,
          shape: 'arch',
          borderRadius: 120,
          borderWidth: 2,
          borderColor: '#d4af37',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            size: 'cover'
          },
          clipMask: true
        },
        content: {},
        animation: { type: 'zoomIn', duration: 1, delay: 0.5 }
      },
      {
        id: 'cov-date-badge',
        type: 'container',
        name: 'Date Badge Container',
        style: {
          x: 55,
          y: 665,
          width: 280,
          height: 48,
          shape: 'rounded-rectangle',
          borderRadius: 24,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3788',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'cov-date-txt',
        type: 'text',
        name: 'Date Announcement',
        parentContainerId: 'cov-date-badge',
        style: {
          x: 55,
          y: 678,
          width: 280,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#f9f6ee',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'SATURDAY, OCTOBER 24, 2026' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'cov-open-btn',
        type: 'button',
        name: 'Open Invitation Button',
        style: {
          x: 95,
          y: 735,
          width: 200,
          height: 46,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 23,
          boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          letterSpacing: 2
        },
        content: {
          buttonText: 'OPEN INVITATION ✉️',
          buttonAction: 'next-page'
        },
        animation: { type: 'pulse', duration: 2, delay: 0.9, repeat: true }
      }
    ]
  }
};

// 2. OPENING - Image opening
export const imageOpeningTemplate: PageTemplate = {
  id: 'tmpl-opening-image',
  name: 'Image Opening',
  category: 'opening',
  subcategory: 'Opening',
  description: 'Full-bleed romantic photo atmosphere with frosted glass typography card and elegant invitation seal.',
  thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Image Opening',
    order: 0,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      size: 'cover',
      overlayColor: '#000000',
      overlayOpacity: 0.45
    },
    elements: [
      {
        id: 'img-open-glass',
        type: 'container',
        name: 'Frosted Invitation Card',
        style: {
          x: 25,
          y: 140,
          width: 340,
          height: 560,
          shape: 'rounded-rectangle',
          borderRadius: 24,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          backgroundColor: 'rgba(7, 25, 18, 0.65)',
          backdropBlur: 16,
          padding: 24,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 1, delay: 0.2 }
      },
      {
        id: 'img-open-seal',
        type: 'icon',
        name: 'Crown Monogram Icon',
        parentContainerId: 'img-open-glass',
        style: {
          x: 170,
          y: 170,
          width: 50,
          height: 50,
          color: '#d4af37'
        },
        content: {
          iconName: 'Crown',
          iconSize: 42,
          iconColor: '#d4af37'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'img-open-sub',
        type: 'text',
        name: 'Welcome Subtitle',
        parentContainerId: 'img-open-glass',
        style: {
          x: 45,
          y: 235,
          width: 300,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 3
        },
        content: { text: 'TOGETHER WITH OUR FAMILIES' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'img-open-title',
        type: 'heading',
        name: 'Couple Names',
        parentContainerId: 'img-open-glass',
        style: {
          x: 35,
          y: 270,
          width: 320,
          height: 120,
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3
        },
        content: { text: 'Alexander Hayes\n&\nSophia Montgomery' },
        animation: { type: 'fadeIn', duration: 1, delay: 0.5 }
      },
      {
        id: 'img-open-div',
        type: 'divider',
        name: 'Ornate Floral Divider',
        parentContainerId: 'img-open-glass',
        style: {
          x: 85,
          y: 405,
          width: 220,
          height: 20,
          color: '#d4af37',
          dividerStyle: 'ornamental'
        },
        content: {},
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'img-open-desc',
        type: 'text',
        name: 'Invitation Notice',
        parentContainerId: 'img-open-glass',
        style: {
          x: 45,
          y: 440,
          width: 300,
          height: 60,
          fontFamily: "'Cinzel', serif",
          fontSize: 12,
          color: '#f3e8cb',
          textAlign: 'center',
          lineHeight: 1.6
        },
        content: {
          text: 'Request the honor of your presence\nat the celebration of their marriage\nOctober 24, 2026'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'img-open-btn',
        type: 'button',
        name: 'View Details Button',
        parentContainerId: 'img-open-glass',
        style: {
          x: 80,
          y: 535,
          width: 230,
          height: 48,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 24,
          letterSpacing: 2
        },
        content: {
          buttonText: 'ENTER CELEBRATION',
          buttonAction: 'next-page'
        },
        animation: { type: 'pulse', duration: 2, delay: 0.8, repeat: true }
      }
    ]
  }
};

// 3. OPENING - Video opening
export const videoOpeningTemplate: PageTemplate = {
  id: 'tmpl-opening-video',
  name: 'Video Opening',
  category: 'opening',
  subcategory: 'Opening',
  description: 'Cinematic video container, motion golden typography, play teaser badge, and immersive ambient entrance.',
  thumbnail: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Video Opening',
    order: 0,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color',
      color: '#050c09'
    },
    elements: [
      {
        id: 'vid-open-card',
        type: 'container',
        name: 'Ambient Video Window',
        style: {
          x: 25,
          y: 80,
          width: 340,
          height: 460,
          shape: 'arch',
          borderRadius: 170,
          borderWidth: 2,
          borderColor: '#d4af37',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          background: {
            type: 'video',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4',
            overlayColor: '#071912',
            overlayOpacity: 0.35
          },
          clipMask: true
        },
        content: {},
        animation: { type: 'zoomIn', duration: 1, delay: 0.2 }
      },
      {
        id: 'vid-open-badge',
        type: 'container',
        name: 'Cinema Teaser Badge',
        parentContainerId: 'vid-open-card',
        style: {
          x: 120,
          y: 200,
          width: 150,
          height: 42,
          shape: 'rounded-rectangle',
          borderRadius: 21,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          borderWidth: 1,
          borderColor: '#d4af37',
          backdropBlur: 8
        },
        content: {},
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'vid-open-badge-txt',
        type: 'text',
        name: 'Teaser Text',
        parentContainerId: 'vid-open-card',
        style: {
          x: 120,
          y: 212,
          width: 150,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: '▶ CINEMATIC TEASER' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'vid-open-sub',
        type: 'text',
        name: 'Motion Subtitle',
        style: {
          x: 30,
          y: 570,
          width: 330,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 3
        },
        content: { text: 'A CINEMATIC LOVE STORY' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'vid-open-names',
        type: 'heading',
        name: 'Couple Heading',
        style: {
          x: 20,
          y: 600,
          width: 350,
          height: 65,
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#f9f6ee',
          textAlign: 'center'
        },
        content: { text: 'Alexander & Sophia' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'vid-open-btn',
        type: 'button',
        name: 'Explore Story Button',
        style: {
          x: 85,
          y: 685,
          width: 220,
          height: 48,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 24,
          letterSpacing: 2
        },
        content: {
          buttonText: 'BEGIN EXPERIENCE',
          buttonAction: 'next-page'
        },
        animation: { type: 'slideUp', duration: 0.8, delay: 0.8 }
      }
    ]
  }
};

export const openingTemplates: PageTemplate[] = [
  coverPageTemplate,
  imageOpeningTemplate,
  videoOpeningTemplate
];

export const openingBlocks: PrebuiltBlock[] = [
  {
    id: 'block-opening-cover',
    name: 'Cover Page Block',
    category: 'opening',
    subcategory: 'Cover',
    description: 'Luxury monogram seal with arch portrait and couple typography.',
    icon: 'Sparkles',
    thumbnail: coverPageTemplate.thumbnail,
    suggestedHeight: 844,
    elements: coverPageTemplate.page.elements
  },
  {
    id: 'block-opening-image',
    name: 'Image Opening Block',
    category: 'opening',
    subcategory: 'Image Opening',
    description: 'Frosted glass invitation card with royal gold emblem.',
    icon: 'ImageIcon',
    thumbnail: imageOpeningTemplate.thumbnail,
    suggestedHeight: 844,
    elements: imageOpeningTemplate.page.elements
  },
  {
    id: 'block-opening-video',
    name: 'Video Opening Block',
    category: 'opening',
    subcategory: 'Video Opening',
    description: 'Cathedral arch ambient video window with glowing cinema badge.',
    icon: 'Video',
    thumbnail: videoOpeningTemplate.thumbnail,
    suggestedHeight: 844,
    elements: videoOpeningTemplate.page.elements
  }
];
