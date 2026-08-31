import { PageTemplate, InvitationPage } from '../types';

export const PREBUILT_PAGE_TEMPLATES: PageTemplate[] = [
  // 1. OPENING / HERO COVER
  {
    id: 'pt-opening-hero',
    name: 'Opening & Hero Cover',
    category: 'cover',
    description: 'Luxury monogram emblem, couple names, and ornate frame for the main announcement.',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Opening',
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
        overlayOpacity: 0.06
      },
      elements: [
        {
          id: 'el-pt-border',
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
          id: 'el-pt-monogram-circle',
          type: 'container',
          name: 'Monogram Seal',
          style: {
            x: 155,
            y: 55,
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
          id: 'el-pt-monogram-txt',
          type: 'text',
          name: 'Monogram Letters',
          style: {
            x: 155,
            y: 73,
            width: 80,
            height: 44,
            fontFamily: "'Cinzel', serif",
            fontSize: 24,
            fontWeight: 700,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 3
          },
          content: { text: 'A & S' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-announcement',
          type: 'text',
          name: 'Announcement Subtitle',
          style: {
            x: 30,
            y: 160,
            width: 330,
            height: 24,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: '#d4af37',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 4
          },
          content: { text: 'THE WEDDING OF' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-couple-title',
          type: 'heading',
          name: 'Couple Names Display',
          style: {
            x: 20,
            y: 195,
            width: 350,
            height: 120,
            fontFamily: "'Playfair Display', serif",
            fontSize: 34,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center',
            lineHeight: 1.3
          },
          content: { text: 'Alexander\n&\nSophia' },
          animation: { type: 'fadeIn', duration: 1, delay: 0.4 }
        },
        {
          id: 'el-pt-hero-arch',
          type: 'container',
          name: 'Arched Portrait Frame',
          style: {
            x: 65,
            y: 330,
            width: 260,
            height: 340,
            shape: 'arch',
            borderRadius: 130,
            borderWidth: 2,
            borderColor: '#d4af37',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
          },
          content: {},
          animation: { type: 'zoomIn', duration: 1, delay: 0.5 }
        },
        {
          id: 'el-pt-hero-img',
          type: 'image',
          name: 'Hero Couple Photo',
          parentContainerId: 'el-pt-hero-arch',
          style: {
            x: 65,
            y: 330,
            width: 260,
            height: 340,
            objectFit: 'cover'
          },
          content: {
            src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            alt: 'Alexander and Sophia'
          },
          animation: { type: 'fadeIn', duration: 1.2, delay: 0.6 }
        },
        {
          id: 'el-pt-date-badge',
          type: 'container',
          name: 'Date Badge Container',
          style: {
            x: 55,
            y: 690,
            width: 280,
            height: 50,
            shape: 'rounded-rectangle',
            borderRadius: 25,
            backgroundColor: '#0d281eee',
            borderWidth: 1,
            borderColor: '#d4af3788',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          },
          content: {},
          animation: { type: 'slideUp', duration: 0.8, delay: 0.7 }
        },
        {
          id: 'el-pt-date-txt',
          type: 'text',
          name: 'Date Text',
          parentContainerId: 'el-pt-date-badge',
          style: {
            x: 55,
            y: 704,
            width: 280,
            height: 24,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: '#f9f6ee',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'SATURDAY, OCTOBER 24, 2026' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
        },
        {
          id: 'el-pt-scroll-hint',
          type: 'text',
          name: 'Scroll Indicator',
          style: {
            x: 45,
            y: 760,
            width: 300,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            color: '#d4af37aa',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: '↓ SCROLL TO EXPLORE ↓' },
          animation: { type: 'pulse', duration: 2, delay: 1, repeat: true }
        }
      ]
    }
  },

  // 2. WEDDING DETAILS & CEREMONY
  {
    id: 'pt-wedding-details',
    name: 'Wedding Details & Ceremony',
    category: 'details',
    description: 'Ceremony date, venue address card, Google Maps link, and event details.',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Wedding Details',
      order: 1,
      heightMode: 'custom',
      height: 844,
      isFullHeight: false,
      background: {
        type: 'color',
        color: '#071912',
        overlayColor: '#d4af37',
        overlayOpacity: 0.04
      },
      elements: [
        {
          id: 'el-pt-details-heading',
          type: 'heading',
          name: 'Holy Matrimony Heading',
          style: {
            x: 20,
            y: 40,
            width: 350,
            height: 45,
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center'
          },
          content: { text: 'Holy Matrimony' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-details-sub',
          type: 'text',
          name: 'Details Subtitle',
          style: {
            x: 30,
            y: 90,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'CEREMONY & BLESSING' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        {
          id: 'el-pt-venue-card',
          type: 'container',
          name: 'Venue Card Box',
          style: {
            x: 30,
            y: 130,
            width: 330,
            height: 280,
            shape: 'rounded-rectangle',
            borderRadius: 20,
            backgroundColor: '#0d281ecc',
            borderWidth: 1,
            borderColor: '#d4af3744',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
          },
          content: {},
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-church-title',
          type: 'heading',
          name: 'Cathedral Title',
          parentContainerId: 'el-pt-venue-card',
          style: {
            x: 45,
            y: 160,
            width: 300,
            height: 30,
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center'
          },
          content: { text: 'St. Regis Royal Chapel' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
        },
        {
          id: 'el-pt-church-time',
          type: 'text',
          name: 'Time Details',
          parentContainerId: 'el-pt-venue-card',
          style: {
            x: 45,
            y: 195,
            width: 300,
            height: 24,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#d4af37',
            textAlign: 'center'
          },
          content: { text: '10:00 AM – 12:30 PM' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
        },
        {
          id: 'el-pt-church-addr',
          type: 'paragraph',
          name: 'Address Text',
          parentContainerId: 'el-pt-venue-card',
          style: {
            x: 50,
            y: 230,
            width: 290,
            height: 60,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.6
          },
          content: { text: '400 Regal Crown Avenue, Beverly Hills, CA 90210' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
        },
        {
          id: 'el-pt-maps-btn',
          type: 'button',
          name: 'Maps Action Button',
          parentContainerId: 'el-pt-venue-card',
          style: {
            x: 75,
            y: 310,
            width: 240,
            height: 46,
            borderRadius: 23,
            backgroundColor: '#d4af37',
            color: '#071912',
            fontSize: 12,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: 1
          },
          content: {
            buttonText: 'Open Google Maps',
            buttonLink: 'https://maps.google.com/?q=St+Regis+Beverly+Hills'
          },
          animation: { type: 'slideUp', duration: 0.8, delay: 0.7 }
        },
        {
          id: 'el-pt-dress-card',
          type: 'container',
          name: 'Dress Code Container',
          style: {
            x: 30,
            y: 430,
            width: 330,
            height: 180,
            shape: 'rounded-rectangle',
            borderRadius: 20,
            backgroundColor: '#0d281e88',
            borderWidth: 1,
            borderColor: '#d4af3733'
          },
          content: {},
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
        },
        {
          id: 'el-pt-dress-title',
          type: 'text',
          name: 'Dress Code Title',
          parentContainerId: 'el-pt-dress-card',
          style: {
            x: 45,
            y: 450,
            width: 300,
            height: 24,
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            fontWeight: 700,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'DRESS CODE: BLACK TIE / ROYAL EMERALD' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.9 }
        },
        {
          id: 'el-pt-dress-desc',
          type: 'paragraph',
          name: 'Dress Code Desc',
          parentContainerId: 'el-pt-dress-card',
          style: {
            x: 45,
            y: 485,
            width: 300,
            height: 50,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.5
          },
          content: { text: 'Formal tuxedos and evening gowns in shades of Emerald Green, Champagne, and Gold.' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 1 }
        }
      ]
    }
  },

  // 3. RECEPTION & GALA
  {
    id: 'pt-reception-gala',
    name: 'Reception & Celebration Gala',
    category: 'reception',
    description: 'Evening gala, dinner feast, champagne toast, and dancing schedule.',
    thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Reception',
      order: 2,
      heightMode: 'custom',
      height: 844,
      isFullHeight: false,
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          angle: 180,
          colors: ['#071912', '#0f3326', '#071912']
        }
      },
      elements: [
        {
          id: 'el-pt-rec-title',
          type: 'heading',
          name: 'Reception Heading',
          style: {
            x: 20,
            y: 45,
            width: 350,
            height: 40,
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center'
          },
          content: { text: 'Wedding Reception' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-rec-sub',
          type: 'text',
          name: 'Reception Subtitle',
          style: {
            x: 30,
            y: 90,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'DINNER & CELEBRATION' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        {
          id: 'el-pt-rec-card',
          type: 'container',
          name: 'Grand Ballroom Card',
          style: {
            x: 30,
            y: 130,
            width: 330,
            height: 320,
            shape: 'rounded-rectangle',
            borderRadius: 20,
            backgroundColor: '#0d281ecc',
            borderWidth: 1,
            borderColor: '#d4af3744',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
          },
          content: {},
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-rec-ballroom',
          type: 'heading',
          name: 'Ballroom Title',
          parentContainerId: 'el-pt-rec-card',
          style: {
            x: 45,
            y: 160,
            width: 300,
            height: 30,
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center'
          },
          content: { text: 'The Grand Royale Ballroom' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
        },
        {
          id: 'el-pt-rec-time',
          type: 'text',
          name: 'Reception Time',
          parentContainerId: 'el-pt-rec-card',
          style: {
            x: 45,
            y: 195,
            width: 300,
            height: 24,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#d4af37',
            textAlign: 'center'
          },
          content: { text: '06:30 PM – Midnight' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
        },
        {
          id: 'el-pt-rec-desc',
          type: 'paragraph',
          name: 'Reception Description',
          parentContainerId: 'el-pt-rec-card',
          style: {
            x: 50,
            y: 230,
            width: 290,
            height: 60,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.6
          },
          content: { text: 'Join us for a five-course banquet, champagne toasts, cake cutting, and live orchestra dance.' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
        },
        {
          id: 'el-pt-rec-btn',
          type: 'button',
          name: 'RSVP Shortcut Button',
          parentContainerId: 'el-pt-rec-card',
          style: {
            x: 75,
            y: 310,
            width: 240,
            height: 46,
            borderRadius: 23,
            backgroundColor: '#d4af37',
            color: '#071912',
            fontSize: 12,
            fontWeight: 700,
            textAlign: 'center'
          },
          content: {
            buttonText: 'Confirm Your Seat (RSVP)',
            buttonAction: 'rsvp'
          },
          animation: { type: 'slideUp', duration: 0.8, delay: 0.7 }
        }
      ]
    }
  },

  // 4. LOVE STORY / TIMELINE
  {
    id: 'pt-love-story',
    name: 'Love Story & Timeline',
    category: 'timeline',
    description: 'Chronological timeline of milestone moments leading up to the celebration.',
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Our Story',
      order: 3,
      heightMode: 'custom',
      height: 960,
      isFullHeight: false,
      background: {
        type: 'color',
        color: '#071912'
      },
      elements: [
        {
          id: 'el-pt-story-heading',
          type: 'heading',
          name: 'Story Heading',
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
          content: { text: 'Our Love Story' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-story-sub',
          type: 'text',
          name: 'Story Subtitle',
          style: {
            x: 30,
            y: 85,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'HOW OUR JOURNEY BEGAN' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        // Step 1
        {
          id: 'el-pt-s1-box',
          type: 'container',
          name: 'Story Step 1 Box',
          style: {
            x: 30,
            y: 130,
            width: 330,
            height: 120,
            shape: 'rounded-rectangle',
            borderRadius: 16,
            backgroundColor: '#0d281ecc',
            borderWidth: 1,
            borderColor: '#d4af3733'
          },
          content: {},
          animation: { type: 'slideRight', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-s1-year',
          type: 'text',
          name: 'Step 1 Year',
          parentContainerId: 'el-pt-s1-box',
          style: {
            x: 45,
            y: 145,
            width: 300,
            height: 20,
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            fontWeight: 700,
            color: '#d4af37'
          },
          content: { text: 'OCTOBER 2020 • THE FIRST SIGHT' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
        },
        {
          id: 'el-pt-s1-desc',
          type: 'paragraph',
          name: 'Step 1 Desc',
          parentContainerId: 'el-pt-s1-box',
          style: {
            x: 45,
            y: 170,
            width: 300,
            height: 60,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#cbd5e1',
            lineHeight: 1.5
          },
          content: { text: 'We met over a shared cup of coffee in Florence, laughing until the cafe closed.' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
        },
        // Step 2
        {
          id: 'el-pt-s2-box',
          type: 'container',
          name: 'Story Step 2 Box',
          style: {
            x: 30,
            y: 270,
            width: 330,
            height: 120,
            shape: 'rounded-rectangle',
            borderRadius: 16,
            backgroundColor: '#0d281ecc',
            borderWidth: 1,
            borderColor: '#d4af3733'
          },
          content: {},
          animation: { type: 'slideLeft', duration: 0.8, delay: 0.5 }
        },
        {
          id: 'el-pt-s2-year',
          type: 'text',
          name: 'Step 2 Year',
          parentContainerId: 'el-pt-s2-box',
          style: {
            x: 45,
            y: 285,
            width: 300,
            height: 20,
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            fontWeight: 700,
            color: '#d4af37'
          },
          content: { text: 'DECEMBER 2023 • THE PROPOSAL' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
        },
        {
          id: 'el-pt-s2-desc',
          type: 'paragraph',
          name: 'Step 2 Desc',
          parentContainerId: 'el-pt-s2-box',
          style: {
            x: 45,
            y: 310,
            width: 300,
            height: 60,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#cbd5e1',
            lineHeight: 1.5
          },
          content: { text: 'Under the starlit sky of Positano, Alexander knelt down with the promise of forever.' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
        },
        // Step 3
        {
          id: 'el-pt-s3-box',
          type: 'container',
          name: 'Story Step 3 Box',
          style: {
            x: 30,
            y: 410,
            width: 330,
            height: 120,
            shape: 'rounded-rectangle',
            borderRadius: 16,
            backgroundColor: '#0d281ecc',
            borderWidth: 1,
            borderColor: '#d4af3733'
          },
          content: {},
          animation: { type: 'slideRight', duration: 0.8, delay: 0.7 }
        },
        {
          id: 'el-pt-s3-year',
          type: 'text',
          name: 'Step 3 Year',
          parentContainerId: 'el-pt-s3-box',
          style: {
            x: 45,
            y: 425,
            width: 300,
            height: 20,
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            fontWeight: 700,
            color: '#d4af37'
          },
          content: { text: 'OCTOBER 2026 • FOREVER TOGETHER' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
        },
        {
          id: 'el-pt-s3-desc',
          type: 'paragraph',
          name: 'Step 3 Desc',
          parentContainerId: 'el-pt-s3-box',
          style: {
            x: 45,
            y: 450,
            width: 300,
            height: 60,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#cbd5e1',
            lineHeight: 1.5
          },
          content: { text: 'Surrounded by our loved ones, we celebrate the beginning of our greatest adventure.' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.9 }
        }
      ]
    }
  },

  // 5. PHOTO GALLERY
  {
    id: 'pt-photo-gallery',
    name: 'Photo Gallery',
    category: 'gallery',
    description: 'Arched photo portrait and multi-image grid showcasing memorable moments.',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Gallery',
      order: 4,
      heightMode: 'custom',
      height: 844,
      isFullHeight: false,
      background: {
        type: 'color',
        color: '#071912'
      },
      elements: [
        {
          id: 'el-pt-gal-title',
          type: 'heading',
          name: 'Gallery Heading',
          style: {
            x: 20,
            y: 35,
            width: 350,
            height: 40,
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center'
          },
          content: { text: 'Moments of Love' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-gal-sub',
          type: 'text',
          name: 'Gallery Subtitle',
          style: {
            x: 30,
            y: 80,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'OUR PRE-WEDDING MEMORIES' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        {
          id: 'el-pt-gal-img1',
          type: 'image',
          name: 'Gallery Photo 1',
          style: {
            x: 30,
            y: 120,
            width: 160,
            height: 220,
            borderRadius: 16,
            objectFit: 'cover',
            borderWidth: 1,
            borderColor: '#d4af3766'
          },
          content: {
            src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            alt: 'Couple Portrait'
          },
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-gal-img2',
          type: 'image',
          name: 'Gallery Photo 2',
          style: {
            x: 200,
            y: 120,
            width: 160,
            height: 220,
            borderRadius: 16,
            objectFit: 'cover',
            borderWidth: 1,
            borderColor: '#d4af3766'
          },
          content: {
            src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
            alt: 'Walking on the Beach'
          },
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.4 }
        },
        {
          id: 'el-pt-gal-img3',
          type: 'image',
          name: 'Gallery Photo 3 Wide',
          style: {
            x: 30,
            y: 360,
            width: 330,
            height: 220,
            borderRadius: 20,
            objectFit: 'cover',
            borderWidth: 1,
            borderColor: '#d4af3766'
          },
          content: {
            src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            alt: 'Sunset Embraced'
          },
          animation: { type: 'fadeIn', duration: 1, delay: 0.5 }
        },
        {
          id: 'el-pt-gal-quote',
          type: 'paragraph',
          name: 'Romantic Quote',
          style: {
            x: 30,
            y: 610,
            width: 330,
            height: 60,
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 14,
            color: '#f9f6ee',
            textAlign: 'center',
            lineHeight: 1.6
          },
          content: { text: '“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.”' },
          animation: { type: 'fadeIn', duration: 1, delay: 0.6 }
        }
      ]
    }
  },

  // 6. RSVP & GUEST CONFIRMATION
  {
    id: 'pt-rsvp-form',
    name: 'RSVP & Guest Attendance',
    category: 'rsvp',
    description: 'Attendance confirmation, guest count selector, dietary preferences, and notes.',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'RSVP',
      order: 5,
      heightMode: 'custom',
      height: 844,
      isFullHeight: false,
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          angle: 180,
          colors: ['#071912', '#0a231b', '#071912']
        }
      },
      elements: [
        {
          id: 'el-pt-rsvp-title',
          type: 'heading',
          name: 'RSVP Heading',
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
          content: { text: 'RSVP Confirmation' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-rsvp-sub',
          type: 'text',
          name: 'RSVP Subtitle',
          style: {
            x: 30,
            y: 85,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'KINDLY RESPOND BY OCTOBER 1, 2026' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        {
          id: 'el-pt-rsvp-card',
          type: 'container',
          name: 'RSVP Container Box',
          style: {
            x: 30,
            y: 125,
            width: 330,
            height: 380,
            shape: 'rounded-rectangle',
            borderRadius: 24,
            backgroundColor: '#0d281edd',
            borderWidth: 1,
            borderColor: '#d4af3744',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          },
          content: {},
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-rsvp-form-el',
          type: 'rsvp-form',
          name: 'Interactive RSVP Component',
          parentContainerId: 'el-pt-rsvp-card',
          style: {
            x: 45,
            y: 145,
            width: 300,
            height: 340
          },
          content: {},
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
        }
      ]
    }
  },

  // 7. WISHES & DIGITAL GUESTBOOK
  {
    id: 'pt-guestbook-blessings',
    name: 'Wishes & Digital Guestbook',
    category: 'guestbook',
    description: 'Congratulatory prayer notes, wishes wall, and digital message sender.',
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Guestbook',
      order: 6,
      heightMode: 'custom',
      height: 844,
      isFullHeight: false,
      background: {
        type: 'color',
        color: '#071912'
      },
      elements: [
        {
          id: 'el-pt-gb-title',
          type: 'heading',
          name: 'Guestbook Heading',
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
          content: { text: 'Warm Wishes & Prayers' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-gb-sub',
          type: 'text',
          name: 'Guestbook Subtitle',
          style: {
            x: 30,
            y: 85,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'LEAVE A MESSAGE FOR THE COUPLE' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        {
          id: 'el-pt-gb-box',
          type: 'guestbook',
          name: 'Guestbook Component',
          style: {
            x: 30,
            y: 125,
            width: 330,
            height: 520
          },
          content: {},
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        }
      ]
    }
  },

  // 8. GIFT REGISTRY & BANK TRANSFER
  {
    id: 'pt-gift-registry',
    name: 'Gift Registry & Digital Angpao',
    category: 'gift',
    description: 'Bank transfer accounts, QR code for cashless envelopes, and gift registry note.',
    thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Gift Registry',
      order: 7,
      heightMode: 'custom',
      height: 844,
      isFullHeight: false,
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          angle: 180,
          colors: ['#071912', '#0d281e', '#071912']
        }
      },
      elements: [
        {
          id: 'el-pt-gift-title',
          type: 'heading',
          name: 'Wedding Gift Heading',
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
          content: { text: 'Wedding Gift & Blessings' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-gift-sub',
          type: 'paragraph',
          name: 'Gift Subtitle',
          style: {
            x: 30,
            y: 85,
            width: 330,
            height: 45,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.5
          },
          content: { text: 'Your presence and prayers at our wedding are the greatest gift of all. If you wish to send a token of love:' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        // Bank Card 1
        {
          id: 'el-pt-bank-card',
          type: 'container',
          name: 'Bank Transfer Card',
          style: {
            x: 30,
            y: 145,
            width: 330,
            height: 180,
            shape: 'rounded-rectangle',
            borderRadius: 20,
            backgroundColor: '#0d281ecc',
            borderWidth: 1,
            borderColor: '#d4af3744',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          },
          content: {},
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-bank-name',
          type: 'text',
          name: 'Bank Name',
          parentContainerId: 'el-pt-bank-card',
          style: {
            x: 50,
            y: 165,
            width: 290,
            height: 20,
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            fontWeight: 700,
            color: '#d4af37'
          },
          content: { text: 'BANK OF AMERICA / CHASE' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
        },
        {
          id: 'el-pt-bank-acc',
          type: 'text',
          name: 'Account Number',
          parentContainerId: 'el-pt-bank-card',
          style: {
            x: 50,
            y: 195,
            width: 290,
            height: 28,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#f9f6ee',
            letterSpacing: 2
          },
          content: { text: '8839 0124 9901' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
        },
        {
          id: 'el-pt-bank-holder',
          type: 'text',
          name: 'Account Holder',
          parentContainerId: 'el-pt-bank-card',
          style: {
            x: 50,
            y: 230,
            width: 290,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#94a3b8'
          },
          content: { text: 'a/n Alexander Vance & Sophia Lauren' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
        },
        {
          id: 'el-pt-bank-copy-btn',
          type: 'button',
          name: 'Copy Account Button',
          parentContainerId: 'el-pt-bank-card',
          style: {
            x: 50,
            y: 260,
            width: 150,
            height: 38,
            borderRadius: 19,
            backgroundColor: '#d4af37',
            color: '#071912',
            fontSize: 11,
            fontWeight: 700
          },
          content: { buttonText: 'Copy Account' },
          animation: { type: 'slideUp', duration: 0.8, delay: 0.7 }
        },
        // QR Code Container
        {
          id: 'el-pt-qr-card',
          type: 'container',
          name: 'QR Payment Card',
          style: {
            x: 75,
            y: 350,
            width: 240,
            height: 260,
            shape: 'rounded-rectangle',
            borderRadius: 20,
            backgroundColor: '#ffffff',
            borderWidth: 2,
            borderColor: '#d4af37'
          },
          content: {},
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.8 }
        },
        {
          id: 'el-pt-qr-img',
          type: 'image',
          name: 'QR Code Image',
          parentContainerId: 'el-pt-qr-card',
          style: {
            x: 95,
            y: 370,
            width: 200,
            height: 200,
            objectFit: 'contain'
          },
          content: {
            src: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://example.com/wedding-gift',
            alt: 'Digital Envelope QR Code'
          },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.9 }
        },
        {
          id: 'el-pt-qr-txt',
          type: 'text',
          name: 'QR Code Caption',
          parentContainerId: 'el-pt-qr-card',
          style: {
            x: 85,
            y: 575,
            width: 220,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            color: '#071912',
            textAlign: 'center'
          },
          content: { text: 'SCAN WITH ANY BANKING APP' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 1 }
        }
      ]
    }
  },

  // 9. SAVE THE DATE & LIVE COUNTDOWN
  {
    id: 'pt-countdown-save',
    name: 'Countdown & Save the Date',
    category: 'countdown',
    description: 'Live countdown timer boxes to the wedding date with calendar reminder trigger.',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    page: {
      name: 'Countdown',
      order: 8,
      heightMode: 'viewport',
      height: 844,
      isFullHeight: true,
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          angle: 180,
          colors: ['#071912', '#0f3125', '#071912']
        }
      },
      elements: [
        {
          id: 'el-pt-cd-title',
          type: 'heading',
          name: 'Countdown Heading',
          style: {
            x: 20,
            y: 60,
            width: 350,
            height: 40,
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#f9f6ee',
            textAlign: 'center'
          },
          content: { text: 'Counting Down' },
          animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
        },
        {
          id: 'el-pt-cd-sub',
          type: 'text',
          name: 'Countdown Subtitle',
          style: {
            x: 30,
            y: 105,
            width: 330,
            height: 20,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: '#d4af37',
            textAlign: 'center',
            letterSpacing: 2
          },
          content: { text: 'UNTIL WE SAY I DO' },
          animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
        },
        {
          id: 'el-pt-cd-timer',
          type: 'countdown',
          name: 'Live Countdown Timer',
          style: {
            x: 30,
            y: 160,
            width: 330,
            height: 120
          },
          content: {
            countdownTarget: '2026-10-24T10:00:00',
            countdownLabels: { days: 'DAYS', hours: 'HOURS', minutes: 'MINS', seconds: 'SECS' }
          },
          animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
        },
        {
          id: 'el-pt-cd-cal-btn',
          type: 'button',
          name: 'Save to Calendar Button',
          style: {
            x: 75,
            y: 320,
            width: 240,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#d4af37',
            color: '#071912',
            fontSize: 12,
            fontWeight: 700,
            textAlign: 'center'
          },
          content: {
            buttonText: 'Add to Google Calendar',
            buttonAction: 'calendar'
          },
          animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
        }
      ]
    }
  }
];

export function createBlankPage(orderIndex: number, themeBgColor?: string): InvitationPage {
  return {
    id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: `Section ${orderIndex + 1}`,
    order: orderIndex,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color',
      color: themeBgColor || '#071912'
    },
    elements: []
  };
}

export function createPageFromTemplate(template: PageTemplate, orderIndex: number): InvitationPage {
  const newId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const pageCopy: InvitationPage = JSON.parse(JSON.stringify(template.page));
  
  // Assign new unique IDs for elements
  const idMap = new Map<string, string>();
  const elementsWithNewIds = pageCopy.elements.map((el) => {
    const freshElId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    idMap.set(el.id, freshElId);
    return {
      ...el,
      id: freshElId
    };
  });

  // Remap parentContainerIds if any
  const finalElements = elementsWithNewIds.map((el) => {
    if (el.parentContainerId && idMap.has(el.parentContainerId)) {
      return {
        ...el,
        parentContainerId: idMap.get(el.parentContainerId)
      };
    }
    return el;
  });

  return {
    ...pageCopy,
    id: newId,
    order: orderIndex,
    elements: finalElements
  };
}
