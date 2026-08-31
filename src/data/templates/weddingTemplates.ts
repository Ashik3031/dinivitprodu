import { PageTemplate, PrebuiltBlock } from '../../types';

// 4. WEDDING - Couple details
export const coupleDetailsTemplate: PageTemplate = {
  id: 'tmpl-wedding-couple',
  name: 'Couple Details',
  category: 'wedding',
  subcategory: 'Couple',
  description: 'Bride and Groom portrait arches side by side, parentage lineage, and love quote.',
  thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Couple Details',
    order: 1,
    heightMode: 'custom',
    height: 980,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912',
      overlayColor: '#d4af37',
      overlayOpacity: 0.03
    },
    elements: [
      {
        id: 'cpl-heading',
        type: 'heading',
        name: 'The Happy Couple Heading',
        style: {
          x: 20,
          y: 40,
          width: 350,
          height: 40,
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#f9f6ee',
          textAlign: 'center'
        },
        content: { text: 'The Happy Couple' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'cpl-sub',
        type: 'text',
        name: 'Couple Subtitle',
        style: {
          x: 30,
          y: 85,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 3
        },
        content: { text: 'TWO SOULS • ONE HEART • ONE LOVE' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Bride Side Card
      {
        id: 'cpl-bride-card',
        type: 'container',
        name: 'Bride Profile Card',
        style: {
          x: 25,
          y: 125,
          width: 340,
          height: 350,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'cpl-bride-photo',
        type: 'container',
        name: 'Bride Portrait Frame',
        parentContainerId: 'cpl-bride-card',
        style: {
          x: 135,
          y: 145,
          width: 120,
          height: 140,
          shape: 'arch',
          borderRadius: 60,
          borderWidth: 2,
          borderColor: '#d4af37',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            size: 'cover'
          },
          clipMask: true
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'cpl-bride-name',
        type: 'heading',
        name: 'Bride Name',
        parentContainerId: 'cpl-bride-card',
        style: {
          x: 35,
          y: 295,
          width: 320,
          height: 35,
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Sophia Montgomery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'cpl-bride-parents',
        type: 'text',
        name: 'Bride Parents Line',
        parentContainerId: 'cpl-bride-card',
        style: {
          x: 45,
          y: 335,
          width: 300,
          height: 40,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center',
          lineHeight: 1.4
        },
        content: { text: 'Daughter of\nMr. Edward & Mrs. Eleanor Montgomery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'cpl-bride-insta',
        type: 'button',
        name: 'Bride Instagram Button',
        parentContainerId: 'cpl-bride-card',
        style: {
          x: 105,
          y: 385,
          width: 180,
          height: 34,
          backgroundColor: '#d4af371a',
          color: '#d4af37',
          borderWidth: 1,
          borderColor: '#d4af3788',
          borderRadius: 17,
          fontSize: 11,
          fontWeight: 600
        },
        content: {
          buttonText: '📷 @sophiamontgomery',
          buttonAction: 'link',
          buttonLink: 'https://instagram.com'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      // Groom Side Card
      {
        id: 'cpl-groom-card',
        type: 'container',
        name: 'Groom Profile Card',
        style: {
          x: 25,
          y: 495,
          width: 340,
          height: 350,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'cpl-groom-photo',
        type: 'container',
        name: 'Groom Portrait Frame',
        parentContainerId: 'cpl-groom-card',
        style: {
          x: 135,
          y: 515,
          width: 120,
          height: 140,
          shape: 'arch',
          borderRadius: 60,
          borderWidth: 2,
          borderColor: '#d4af37',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            size: 'cover'
          },
          clipMask: true
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'cpl-groom-name',
        type: 'heading',
        name: 'Groom Name',
        parentContainerId: 'cpl-groom-card',
        style: {
          x: 35,
          y: 665,
          width: 320,
          height: 35,
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Alexander Hayes' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'cpl-groom-parents',
        type: 'text',
        name: 'Groom Parents Line',
        parentContainerId: 'cpl-groom-card',
        style: {
          x: 45,
          y: 705,
          width: 300,
          height: 40,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center',
          lineHeight: 1.4
        },
        content: { text: 'Son of\nMr. Richard & Mrs. Victoria Hayes' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'cpl-groom-insta',
        type: 'button',
        name: 'Groom Instagram Button',
        parentContainerId: 'cpl-groom-card',
        style: {
          x: 105,
          y: 755,
          width: 180,
          height: 34,
          backgroundColor: '#d4af371a',
          color: '#d4af37',
          borderWidth: 1,
          borderColor: '#d4af3788',
          borderRadius: 17,
          fontSize: 11,
          fontWeight: 600
        },
        content: {
          buttonText: '📷 @alexanderhayes',
          buttonAction: 'link',
          buttonLink: 'https://instagram.com'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
      },
      // Romantic Quote
      {
        id: 'cpl-quote',
        type: 'text',
        name: 'Love Quote Footer',
        style: {
          x: 30,
          y: 865,
          width: 330,
          height: 60,
          fontFamily: "'Playfair Display', serif",
          fontSize: 13,
          fontStyle: 'italic',
          color: '#f9f6eecc',
          textAlign: 'center',
          lineHeight: 1.6
        },
        content: {
          text: '“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.”'
        },
        animation: { type: 'fadeIn', duration: 1, delay: 0.9 }
      }
    ]
  }
};

// 5. WEDDING - Bride details
export const brideDetailsTemplate: PageTemplate = {
  id: 'tmpl-wedding-bride',
  name: 'Bride Details',
  category: 'wedding',
  subcategory: 'Bride',
  description: 'Dedicated bridal spotlight with gold cathedral arch frame, title, parents, social links, and romantic vow.',
  thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'The Bride',
    order: 1,
    heightMode: 'custom',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'brd-sub',
        type: 'text',
        name: 'Bride Eyebrow Subtitle',
        style: {
          x: 30,
          y: 40,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 4
        },
        content: { text: 'MEET THE BRIDE' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'brd-heading',
        type: 'heading',
        name: 'Bride Display Title',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Sophia Montgomery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'brd-frame',
        type: 'container',
        name: 'Bridal Arch Frame',
        style: {
          x: 75,
          y: 125,
          width: 240,
          height: 330,
          shape: 'arch',
          borderRadius: 120,
          borderWidth: 2,
          borderColor: '#d4af37',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            size: 'cover'
          },
          clipMask: true
        },
        content: {},
        animation: { type: 'zoomIn', duration: 1, delay: 0.3 }
      },
      {
        id: 'brd-info-box',
        type: 'container',
        name: 'Bridal Info Card',
        style: {
          x: 30,
          y: 480,
          width: 330,
          height: 220,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'brd-parents',
        type: 'text',
        name: 'Parentage Note',
        parentContainerId: 'brd-info-box',
        style: {
          x: 45,
          y: 505,
          width: 300,
          height: 48,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: '#d4af37',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: {
          text: 'First daughter of\nMr. Edward Montgomery & Mrs. Eleanor Montgomery'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'brd-bio',
        type: 'text',
        name: 'Bridal Bio Excerpt',
        parentContainerId: 'brd-info-box',
        style: {
          x: 45,
          y: 565,
          width: 300,
          height: 60,
          fontFamily: "'Playfair Display', serif",
          fontSize: 13,
          fontStyle: 'italic',
          color: '#f9f6eecc',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: {
          text: '“Love is not about looking at each other, but looking in the same direction together.”'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'brd-btn',
        type: 'button',
        name: 'Bride Social Link',
        parentContainerId: 'brd-info-box',
        style: {
          x: 95,
          y: 635,
          width: 200,
          height: 38,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 19
        },
        content: {
          buttonText: '📷 @sophiamontgomery',
          buttonAction: 'link',
          buttonLink: 'https://instagram.com'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      }
    ]
  }
};

// 6. WEDDING - Groom details
export const groomDetailsTemplate: PageTemplate = {
  id: 'tmpl-wedding-groom',
  name: 'Groom Details',
  category: 'wedding',
  subcategory: 'Groom',
  description: 'Dedicated groom spotlight with gold cathedral arch frame, title, parents, social links, and devotion quote.',
  thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'The Groom',
    order: 1,
    heightMode: 'custom',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'grm-sub',
        type: 'text',
        name: 'Groom Eyebrow Subtitle',
        style: {
          x: 30,
          y: 40,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 4
        },
        content: { text: 'MEET THE GROOM' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'grm-heading',
        type: 'heading',
        name: 'Groom Display Title',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Alexander Hayes' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'grm-frame',
        type: 'container',
        name: 'Groom Arch Frame',
        style: {
          x: 75,
          y: 125,
          width: 240,
          height: 330,
          shape: 'arch',
          borderRadius: 120,
          borderWidth: 2,
          borderColor: '#d4af37',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
            size: 'cover'
          },
          clipMask: true
        },
        content: {},
        animation: { type: 'zoomIn', duration: 1, delay: 0.3 }
      },
      {
        id: 'grm-info-box',
        type: 'container',
        name: 'Groom Info Card',
        style: {
          x: 30,
          y: 480,
          width: 330,
          height: 220,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'grm-parents',
        type: 'text',
        name: 'Groom Parentage Note',
        parentContainerId: 'grm-info-box',
        style: {
          x: 45,
          y: 505,
          width: 300,
          height: 48,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: '#d4af37',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: {
          text: 'Second son of\nMr. Richard Hayes & Mrs. Victoria Hayes'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'grm-bio',
        type: 'text',
        name: 'Groom Bio Excerpt',
        parentContainerId: 'grm-info-box',
        style: {
          x: 45,
          y: 565,
          width: 300,
          height: 60,
          fontFamily: "'Playfair Display', serif",
          fontSize: 13,
          fontStyle: 'italic',
          color: '#f9f6eecc',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: {
          text: '“Whatever our souls are made of, hers and mine are the same.”'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'grm-btn',
        type: 'button',
        name: 'Groom Social Link',
        parentContainerId: 'grm-info-box',
        style: {
          x: 95,
          y: 635,
          width: 200,
          height: 38,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 19
        },
        content: {
          buttonText: '📷 @alexanderhayes',
          buttonAction: 'link',
          buttonLink: 'https://instagram.com'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      }
    ]
  }
};

// 7. WEDDING - Ceremony details
export const ceremonyDetailsTemplate: PageTemplate = {
  id: 'tmpl-wedding-ceremony',
  name: 'Ceremony Details',
  category: 'wedding',
  subcategory: 'Ceremony',
  description: 'Holy Matrimony announcement, church cathedral venue card, time schedule, and directions button.',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Ceremony Details',
    order: 2,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'crm-sub',
        type: 'text',
        name: 'Ceremony Subtitle',
        style: {
          x: 30,
          y: 40,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 4
        },
        content: { text: 'THE SACRED VOWS' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'crm-heading',
        type: 'heading',
        name: 'Ceremony Title',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Holy Matrimony' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'crm-card',
        type: 'container',
        name: 'Ceremony Information Box',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 520,
          shape: 'rounded-rectangle',
          borderRadius: 24,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 24,
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'crm-icon',
        type: 'icon',
        name: 'Church Emblem Icon',
        parentContainerId: 'crm-card',
        style: {
          x: 170,
          y: 160,
          width: 50,
          height: 50,
          color: '#d4af37'
        },
        content: {
          iconName: 'Church',
          iconSize: 44,
          iconColor: '#d4af37'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'crm-venue-name',
        type: 'heading',
        name: 'Cathedral Name',
        parentContainerId: 'crm-card',
        style: {
          x: 35,
          y: 220,
          width: 320,
          height: 35,
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: "St. Ignatius Cathedral" },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'crm-date-badge',
        type: 'text',
        name: 'Ceremony Date & Time',
        parentContainerId: 'crm-card',
        style: {
          x: 45,
          y: 265,
          width: 300,
          height: 48,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: 'Saturday, October 24, 2026\n10:00 AM - 12:30 PM PST' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'crm-address',
        type: 'text',
        name: 'Cathedral Street Address',
        parentContainerId: 'crm-card',
        style: {
          x: 45,
          y: 325,
          width: 300,
          height: 44,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: '#f9f6eeaa',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: '650 Fulton Street, San Francisco, CA 94117' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'crm-note',
        type: 'text',
        name: 'Ceremony Attire Note',
        parentContainerId: 'crm-card',
        style: {
          x: 45,
          y: 385,
          width: 300,
          height: 50,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center',
          lineHeight: 1.4
        },
        content: { text: 'Guests are kindly requested to be seated 15 minutes prior to the solemn procession.' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
      },
      {
        id: 'crm-map-btn',
        type: 'button',
        name: 'Get Directions Button',
        parentContainerId: 'crm-card',
        style: {
          x: 65,
          y: 455,
          width: 260,
          height: 48,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 24,
          letterSpacing: 1.5
        },
        content: {
          buttonText: '📍 GOOGLE MAPS DIRECTIONS',
          buttonAction: 'maps',
          buttonLink: 'https://maps.google.com'
        },
        animation: { type: 'pulse', duration: 2, delay: 0.9, repeat: true }
      }
    ]
  }
};

// 8. WEDDING - Reception details
export const receptionDetailsTemplate: PageTemplate = {
  id: 'tmpl-wedding-reception',
  name: 'Reception Details',
  category: 'wedding',
  subcategory: 'Reception',
  description: 'Evening gala celebration, cocktail hour, banquet dining, live music schedule, and RSVP prompt.',
  thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Evening Reception',
    order: 2,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'rcp-sub',
        type: 'text',
        name: 'Reception Subtitle',
        style: {
          x: 30,
          y: 40,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 4
        },
        content: { text: 'DINNER & CELEBRATION' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'rcp-heading',
        type: 'heading',
        name: 'Reception Heading',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Grand Wedding Gala' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'rcp-card',
        type: 'container',
        name: 'Gala Dinner Card',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 520,
          shape: 'rounded-rectangle',
          borderRadius: 24,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 24,
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'rcp-icon',
        type: 'icon',
        name: 'Champagne Flutes Icon',
        parentContainerId: 'rcp-card',
        style: {
          x: 170,
          y: 160,
          width: 50,
          height: 50,
          color: '#d4af37'
        },
        content: {
          iconName: 'Wine',
          iconSize: 44,
          iconColor: '#d4af37'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'rcp-venue-name',
        type: 'heading',
        name: 'Ballroom Name',
        parentContainerId: 'rcp-card',
        style: {
          x: 35,
          y: 220,
          width: 320,
          height: 35,
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'The St. Regis Grand Ballroom' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'rcp-date-badge',
        type: 'text',
        name: 'Reception Date & Time',
        parentContainerId: 'rcp-card',
        style: {
          x: 45,
          y: 265,
          width: 300,
          height: 48,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: 'Saturday, October 24, 2026\n06:30 PM - 11:00 PM PST' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'rcp-address',
        type: 'text',
        name: 'Resort Address',
        parentContainerId: 'rcp-card',
        style: {
          x: 45,
          y: 325,
          width: 300,
          height: 44,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: '#f9f6eeaa',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: '125 3rd Street, San Francisco, CA 94103' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'rcp-features',
        type: 'text',
        name: 'Reception Program Line',
        parentContainerId: 'rcp-card',
        style: {
          x: 45,
          y: 385,
          width: 300,
          height: 50,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: 'Cocktails • 5-Course Plated Dinner • First Dance • Live Jazz Orchestra' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
      },
      {
        id: 'rcp-cal-btn',
        type: 'button',
        name: 'Add to Calendar Button',
        parentContainerId: 'rcp-card',
        style: {
          x: 65,
          y: 455,
          width: 260,
          height: 48,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 24,
          letterSpacing: 1.5
        },
        content: {
          buttonText: '📅 ADD TO CALENDAR',
          buttonAction: 'calendar'
        },
        animation: { type: 'slideUp', duration: 0.8, delay: 0.9 }
      }
    ]
  }
};

// 9. WEDDING - Family details
export const familyDetailsTemplate: PageTemplate = {
  id: 'tmpl-wedding-family',
  name: 'Family Details',
  category: 'wedding',
  subcategory: 'Family',
  description: 'Honored parents of the bride & groom, maid of honor, best man, and heartfelt tribute.',
  thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Honored Families',
    order: 2,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'fam-sub',
        type: 'text',
        name: 'Family Subtitle',
        style: {
          x: 30,
          y: 40,
          width: 330,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 4
        },
        content: { text: 'WITH DEEP RESPECT' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'fam-heading',
        type: 'heading',
        name: 'Family Display Title',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Honored Families' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Bride Family Box
      {
        id: 'fam-bride-box',
        type: 'container',
        name: 'Family of the Bride Card',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 230,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'fam-bride-label',
        type: 'text',
        name: 'Bride Family Header',
        parentContainerId: 'fam-bride-box',
        style: {
          x: 45,
          y: 150,
          width: 300,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'FAMILY OF THE BRIDE' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'fam-bride-parents',
        type: 'text',
        name: 'Bride Parents Names',
        parentContainerId: 'fam-bride-box',
        style: {
          x: 45,
          y: 185,
          width: 300,
          height: 50,
          fontFamily: "'Playfair Display', serif",
          fontSize: 16,
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: 'Mr. Edward Montgomery\n& Mrs. Eleanor Montgomery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'fam-bride-party',
        type: 'text',
        name: 'Maid of Honor',
        parentContainerId: 'fam-bride-box',
        style: {
          x: 45,
          y: 250,
          width: 300,
          height: 30,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center'
        },
        content: { text: 'Maid of Honor: Charlotte Montgomery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      // Groom Family Box
      {
        id: 'fam-groom-box',
        type: 'container',
        name: 'Family of the Groom Card',
        style: {
          x: 25,
          y: 380,
          width: 340,
          height: 230,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'fam-groom-label',
        type: 'text',
        name: 'Groom Family Header',
        parentContainerId: 'fam-groom-box',
        style: {
          x: 45,
          y: 400,
          width: 300,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'FAMILY OF THE GROOM' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'fam-groom-parents',
        type: 'text',
        name: 'Groom Parents Names',
        parentContainerId: 'fam-groom-box',
        style: {
          x: 45,
          y: 435,
          width: 300,
          height: 50,
          fontFamily: "'Playfair Display', serif",
          fontSize: 16,
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: 'Mr. Richard Hayes\n& Mrs. Victoria Hayes' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'fam-groom-party',
        type: 'text',
        name: 'Best Man',
        parentContainerId: 'fam-groom-box',
        style: {
          x: 45,
          y: 500,
          width: 300,
          height: 30,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center'
        },
        content: { text: 'Best Man: Julian Hayes' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      // Bottom Gratitude Note
      {
        id: 'fam-note',
        type: 'text',
        name: 'Family Blessing Footer',
        style: {
          x: 30,
          y: 635,
          width: 330,
          height: 60,
          fontFamily: "'Playfair Display', serif",
          fontSize: 13,
          fontStyle: 'italic',
          color: '#f9f6eeaa',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: { text: '“May the love, grace, and wisdom of our ancestors guide our path for eternity.”' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
      }
    ]
  }
};

export const weddingTemplates: PageTemplate[] = [
  coupleDetailsTemplate,
  brideDetailsTemplate,
  groomDetailsTemplate,
  ceremonyDetailsTemplate,
  receptionDetailsTemplate,
  familyDetailsTemplate
];

export const weddingBlocks: PrebuiltBlock[] = [
  {
    id: 'block-wedding-couple',
    name: 'Couple Details Block',
    category: 'wedding',
    subcategory: 'Couple',
    description: 'Bride & Groom side-by-side portrait arches with lineages and love quote.',
    icon: 'Heart',
    thumbnail: coupleDetailsTemplate.thumbnail,
    suggestedHeight: 980,
    elements: coupleDetailsTemplate.page.elements
  },
  {
    id: 'block-wedding-bride',
    name: 'Bride Details Block',
    category: 'wedding',
    subcategory: 'Bride',
    description: 'Bridal portrait spotlight with lineage and social link.',
    icon: 'Sparkles',
    thumbnail: brideDetailsTemplate.thumbnail,
    suggestedHeight: 844,
    elements: brideDetailsTemplate.page.elements
  },
  {
    id: 'block-wedding-groom',
    name: 'Groom Details Block',
    category: 'wedding',
    subcategory: 'Groom',
    description: 'Groom portrait spotlight with lineage and social link.',
    icon: 'Sparkles',
    thumbnail: groomDetailsTemplate.thumbnail,
    suggestedHeight: 844,
    elements: groomDetailsTemplate.page.elements
  },
  {
    id: 'block-wedding-ceremony',
    name: 'Ceremony Details Block',
    category: 'wedding',
    subcategory: 'Ceremony',
    description: 'Holy Matrimony card with cathedral address, time, and maps button.',
    icon: 'Church',
    thumbnail: ceremonyDetailsTemplate.thumbnail,
    suggestedHeight: 844,
    elements: ceremonyDetailsTemplate.page.elements
  },
  {
    id: 'block-wedding-reception',
    name: 'Reception Details Block',
    category: 'wedding',
    subcategory: 'Reception',
    description: 'Grand Gala dinner card with ballroom address, cocktails, and calendar button.',
    icon: 'Wine',
    thumbnail: receptionDetailsTemplate.thumbnail,
    suggestedHeight: 844,
    elements: receptionDetailsTemplate.page.elements
  },
  {
    id: 'block-wedding-family',
    name: 'Family Details Block',
    category: 'wedding',
    subcategory: 'Family',
    description: 'Honored parents of the bride & groom and wedding party cards.',
    icon: 'Users',
    thumbnail: familyDetailsTemplate.thumbnail,
    suggestedHeight: 844,
    elements: familyDetailsTemplate.page.elements
  }
];
