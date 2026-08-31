import { PageTemplate, PrebuiltBlock } from '../../types';

// 23. FINAL - Thank you
export const thankYouTemplate: PageTemplate = {
  id: 'tmpl-final-thankyou',
  name: 'Thank You',
  category: 'final',
  subcategory: 'Thank You',
  description: 'Heartfelt thank you note, couple signature monogram seal, and social share button.',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Thank You',
    order: 6,
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
      overlayOpacity: 0.04
    },
    elements: [
      {
        id: 'ty-seal',
        type: 'icon',
        name: 'Heart Seal Icon',
        style: {
          x: 170,
          y: 80,
          width: 50,
          height: 50,
          color: '#d4af37'
        },
        content: {
          iconName: 'Heart',
          iconSize: 44,
          iconColor: '#d4af37'
        },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'ty-sub',
        type: 'text',
        name: 'Gratitude Subtitle',
        style: {
          x: 30,
          y: 150,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 4
        },
        content: { text: 'WITH OUR DEEPEST GRATITUDE' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'ty-heading',
        type: 'heading',
        name: 'Thank You Heading',
        style: {
          x: 20,
          y: 180,
          width: 350,
          height: 60,
          fontFamily: "'Playfair Display', serif",
          fontSize: 36,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Thank You' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'ty-card',
        type: 'container',
        name: 'Appreciation Message Card',
        style: {
          x: 25,
          y: 260,
          width: 340,
          height: 240,
          shape: 'rounded-rectangle',
          borderRadius: 24,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 24,
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'ty-body-txt',
        type: 'text',
        name: 'Gratitude Message Text',
        parentContainerId: 'ty-card',
        style: {
          x: 45,
          y: 285,
          width: 300,
          height: 190,
          fontFamily: "'Playfair Display', serif",
          fontSize: 14,
          color: '#f9f6eeb8',
          textAlign: 'center',
          lineHeight: 1.8
        },
        content: {
          text: 'Thank you from the bottom of our hearts for your love, constant prayers, and warm presence on our special milestone. Your presence turns our happiness into everlasting memories.'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'ty-couple-sign',
        type: 'heading',
        name: 'Couple Sign-off',
        style: {
          x: 20,
          y: 530,
          width: 350,
          height: 40,
          fontFamily: "'Cinzel', serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'Sophia & Alexander' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'ty-share-btn',
        type: 'button',
        name: 'Share Invitation Button',
        style: {
          x: 75,
          y: 600,
          width: 240,
          height: 48,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 24,
          letterSpacing: 1.5
        },
        content: {
          buttonText: '🔗 SHARE INVITATION',
          buttonAction: 'link',
          buttonLink: ''
        },
        animation: { type: 'slideUp', duration: 0.8, delay: 0.8 }
      }
    ]
  }
};

// 24. FINAL - Closing message
export const closingMessageTemplate: PageTemplate = {
  id: 'tmpl-final-closing',
  name: 'Closing Message',
  category: 'final',
  subcategory: 'Closing',
  description: 'Grand final sign-off with couple hashtag, copyright imprint, audio repeat, and back to start action.',
  thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Farewell & Blessings',
    order: 6,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'cls-monogram',
        type: 'container',
        name: 'End Monogram Seal',
        style: {
          x: 155,
          y: 100,
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
        id: 'cls-monogram-txt',
        type: 'text',
        name: 'Monogram Letters',
        parentContainerId: 'cls-monogram',
        style: {
          x: 155,
          y: 122,
          width: 80,
          height: 40,
          fontFamily: "'Cinzel', serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'S & A' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'cls-heading',
        type: 'heading',
        name: 'See You Soon Title',
        style: {
          x: 20,
          y: 210,
          width: 350,
          height: 50,
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'See You in October!' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'cls-hashtag-box',
        type: 'container',
        name: 'Hashtag Badge',
        style: {
          x: 65,
          y: 280,
          width: 260,
          height: 44,
          shape: 'rounded-rectangle',
          borderRadius: 22,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af37',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'cls-hashtag-txt',
        type: 'text',
        name: 'Couple Official Hashtag',
        parentContainerId: 'cls-hashtag-box',
        style: {
          x: 65,
          y: 292,
          width: 260,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: '#SophiaAndAlexander2026' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'cls-quote',
        type: 'text',
        name: 'Farewell Blessing Quote',
        style: {
          x: 30,
          y: 360,
          width: 330,
          height: 80,
          fontFamily: "'Playfair Display', serif",
          fontSize: 14,
          fontStyle: 'italic',
          color: '#f9f6eeaa',
          textAlign: 'center',
          lineHeight: 1.7
        },
        content: {
          text: '“May peace, harmony, and joy accompany all who gather in the name of love.”'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'cls-restart-btn',
        type: 'button',
        name: 'Back to Start Button',
        style: {
          x: 85,
          y: 480,
          width: 220,
          height: 48,
          backgroundColor: '#d4af371a',
          color: '#d4af37',
          borderWidth: 1,
          borderColor: '#d4af37',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 24,
          letterSpacing: 1.5
        },
        content: {
          buttonText: '↺ BACK TO COVER',
          buttonAction: 'previous-page'
        },
        animation: { type: 'slideUp', duration: 0.8, delay: 0.8 }
      },
      {
        id: 'cls-footer-copy',
        type: 'text',
        name: 'Footer Made With Love',
        style: {
          x: 30,
          y: 720,
          width: 330,
          height: 30,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          color: '#d4af3766',
          textAlign: 'center',
          letterSpacing: 1.5
        },
        content: { text: 'DIGITAL WEDDING INVITATION • 2026' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.9 }
      }
    ]
  }
};

export const finalTemplates: PageTemplate[] = [
  thankYouTemplate,
  closingMessageTemplate
];

export const finalBlocks: PrebuiltBlock[] = [
  {
    id: 'block-final-thankyou',
    name: 'Thank You Block',
    category: 'final',
    subcategory: 'Thank You',
    description: 'Heartfelt gratitude card with couple signature and share button.',
    icon: 'HeartHandshake',
    thumbnail: thankYouTemplate.thumbnail,
    suggestedHeight: 844,
    elements: thankYouTemplate.page.elements
  },
  {
    id: 'block-final-closing',
    name: 'Closing Message Block',
    category: 'final',
    subcategory: 'Closing',
    description: 'Grand closing with hashtag badge and return to cover navigation.',
    icon: 'Sparkles',
    thumbnail: closingMessageTemplate.thumbnail,
    suggestedHeight: 844,
    elements: closingMessageTemplate.page.elements
  }
];
