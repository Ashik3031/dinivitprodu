import { InvitationTemplate, Invitation } from '../types';

export const INITIAL_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'template-royal-gold',
    title: 'Imperial Royale Gold & Emerald',
    category: 'wedding',
    description: 'Opulent gold foil accents, emerald textures, arched photo container, and gilded calligraphy.',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37',
      secondaryColor: '#0a3d2c',
      accentColor: '#f9f6ee',
      fontHeading: "'Cinzel', serif",
      fontBody: "'Montserrat', sans-serif",
      fontScript: "'Great Vibes', cursive",
      backgroundColor: '#0c1b15'
    },
    openingScreen: {
      enabled: true,
      style: 'wax-seal',
      title: 'You Are Cordially Invited',
      subtitle: 'To the sacred union of',
      coupleNames: 'Alexander & Sophia',
      openButtonText: 'Open Royal Invitation',
      sealColor: '#d4af37',
      envelopeColor: '#071811',
      musicAutoplayOnOpen: true
    },
    music: {
      enabled: true,
      audioUrl: 'https://cdn.freesound.org/previews/467/467269_4939433-lq.mp3',
      title: 'Ethereal Bridal Strings',
      artist: 'Symphony Ensemble',
      autoPlay: true,
      loop: true,
      floatingBadge: true
    },
    pages: [
      {
        id: 'p-1-cover',
        name: 'Cover & Announcement',
        order: 0,
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
            id: 'el-frame-border',
            type: 'container',
            name: 'Gold Ornamental Border',
            style: {
              x: 16,
              y: 16,
              width: 358,
              height: 812,
              shape: 'rounded-rectangle',
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#d4af3766',
              backgroundColor: '#0d281e33',
              boxShadow: 'inset 0 0 30px rgba(212,175,55,0.1)'
            },
            content: {},
            animation: { type: 'fadeIn', duration: 1.2, delay: 0.2 }
          },
          {
            id: 'el-monogram-circle',
            type: 'container',
            name: 'Monogram Emblem Seal',
            style: {
              x: 155,
              y: 60,
              width: 80,
              height: 80,
              shape: 'circle',
              backgroundColor: '#d4af371a',
              borderWidth: 1.5,
              borderColor: '#d4af37',
              boxShadow: '0 8px 24px rgba(212,175,55,0.2)'
            },
            content: {},
            animation: { type: 'zoomIn', duration: 1, delay: 0.3 }
          },
          {
            id: 'el-monogram-text',
            type: 'text',
            name: 'Monogram Letters',
            style: {
              x: 155,
              y: 78,
              width: 80,
              height: 44,
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 700,
              color: '#d4af37',
              textAlign: 'center',
              letterSpacing: 2
            },
            content: { text: 'A & S' },
            animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
          },
          {
            id: 'el-pre-heading',
            type: 'text',
            name: 'Invitation Prefix',
            style: {
              x: 30,
              y: 160,
              width: 330,
              height: 28,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: '#d4af37cc',
              textAlign: 'center',
              letterSpacing: 4,
              textTransform: 'uppercase'
            },
            content: { text: 'Together with their families' },
            animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
          },
          {
            id: 'el-couple-name1',
            type: 'heading',
            name: 'Groom Name',
            style: {
              x: 20,
              y: 200,
              width: 350,
              height: 60,
              fontFamily: "'Great Vibes', cursive",
              fontSize: 48,
              color: '#f9f6ee',
              textAlign: 'center',
              textShadow: '0 2px 12px rgba(212,175,55,0.4)'
            },
            content: { text: 'Alexander Sterling' },
            animation: { type: 'slideUp', duration: 0.9, delay: 0.6 }
          },
          {
            id: 'el-and-symbol',
            type: 'text',
            name: 'And Connector',
            style: {
              x: 170,
              y: 265,
              width: 50,
              height: 32,
              fontFamily: "'Cinzel', serif",
              fontSize: 18,
              fontWeight: 400,
              color: '#d4af37',
              textAlign: 'center',
              letterSpacing: 3
            },
            content: { text: '— & —' },
            animation: { type: 'fadeIn', duration: 0.6, delay: 0.7 }
          },
          {
            id: 'el-couple-name2',
            type: 'heading',
            name: 'Bride Name',
            style: {
              x: 20,
              y: 300,
              width: 350,
              height: 60,
              fontFamily: "'Great Vibes', cursive",
              fontSize: 48,
              color: '#f9f6ee',
              textAlign: 'center',
              textShadow: '0 2px 12px rgba(212,175,55,0.4)'
            },
            content: { text: 'Sophia Montgomery' },
            animation: { type: 'slideUp', duration: 0.9, delay: 0.8 }
          },
          {
            id: 'el-arch-container',
            type: 'container',
            name: 'Arch Portrait Container',
            style: {
              x: 55,
              y: 380,
              width: 280,
              height: 290,
              shape: 'arch',
              backgroundColor: '#071912',
              borderWidth: 2,
              borderColor: '#d4af37',
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              clipMask: true
            },
            content: {},
            animation: { type: 'zoomIn', duration: 1, delay: 1 }
          },
          {
            id: 'el-arch-image',
            type: 'image',
            name: 'Couple Photo Inside Arch',
            parentContainerId: 'el-arch-container',
            style: {
              x: 0,
              y: 0,
              width: 280,
              height: 290,
              objectFit: 'cover'
            },
            content: {
              src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
              alt: 'Alexander & Sophia'
            }
          },
          {
            id: 'el-date-time-box',
            type: 'text',
            name: 'Date Banner',
            style: {
              x: 40,
              y: 690,
              width: 310,
              height: 30,
              fontFamily: "'Cinzel', serif",
              fontSize: 16,
              fontWeight: 600,
              color: '#d4af37',
              textAlign: 'center',
              letterSpacing: 3
            },
            content: { text: 'SATURDAY, OCTOBER 24, 2026' },
            animation: { type: 'fadeIn', duration: 0.8, delay: 1.2 }
          },
          {
            id: 'el-venue-city',
            type: 'text',
            name: 'Venue City Line',
            style: {
              x: 40,
              y: 725,
              width: 310,
              height: 24,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              color: '#e5e7eb',
              textAlign: 'center',
              letterSpacing: 2
            },
            content: { text: 'THE BILTMORE ESTATE • ASHEVILLE, NC' },
            animation: { type: 'fadeIn', duration: 0.8, delay: 1.3 }
          },
          {
            id: 'el-scroll-indicator',
            type: 'button',
            name: 'Scroll Down Button',
            style: {
              x: 135,
              y: 765,
              width: 120,
              height: 36,
              shape: 'rounded-rectangle',
              borderRadius: 18,
              backgroundColor: '#d4af3726',
              borderWidth: 1,
              borderColor: '#d4af3788',
              color: '#f9f6ee',
              fontSize: 12,
              fontFamily: "'Montserrat', sans-serif"
            },
            content: {
              buttonText: 'View Details ↓',
              buttonAction: 'next-page'
            },
            animation: { type: 'pulse', duration: 2, delay: 1.5, repeat: true }
          }
        ]
      },
      {
        id: 'p-2-event-details',
        name: 'Event Details & Countdown',
        order: 1,
        height: 844,
        isFullHeight: true,
        background: {
          type: 'color',
          color: '#071912'
        },
        elements: [
          {
            id: 'el-countdown-box',
            type: 'container',
            name: 'Countdown Card Box',
            style: {
              x: 24,
              y: 40,
              width: 342,
              height: 170,
              shape: 'rounded-rectangle',
              borderRadius: 16,
              backgroundColor: '#0e261d',
              borderWidth: 1,
              borderColor: '#d4af3744',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              padding: 16
            },
            content: {},
            animation: { type: 'slideUp', duration: 0.8, delay: 0.2 }
          },
          {
            id: 'el-countdown-label',
            type: 'text',
            name: 'Countdown Label',
            parentContainerId: 'el-countdown-box',
            style: {
              x: 40,
              y: 55,
              width: 310,
              height: 24,
              fontFamily: "'Cinzel', serif",
              fontSize: 13,
              fontWeight: 600,
              color: '#d4af37',
              textAlign: 'center',
              letterSpacing: 3
            },
            content: { text: 'COUNTING DOWN TO THE CELEBRATION' }
          },
          {
            id: 'el-countdown-widget',
            type: 'countdown',
            name: 'Live Countdown Timer',
            parentContainerId: 'el-countdown-box',
            style: {
              x: 40,
              y: 90,
              width: 310,
              height: 90,
              fontFamily: "'Montserrat', sans-serif"
            },
            content: {
              countdownTarget: '2026-10-24T16:00:00',
              countdownLabels: { days: 'DAYS', hours: 'HOURS', minutes: 'MINS', seconds: 'SECS' }
            }
          },
          {
            id: 'el-venue-card',
            type: 'container',
            name: 'Ceremony & Reception Card',
            style: {
              x: 24,
              y: 230,
              width: 342,
              height: 380,
              shape: 'rounded-rectangle',
              borderRadius: 16,
              backgroundColor: '#0e261d',
              borderWidth: 1,
              borderColor: '#d4af3744',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              padding: 20
            },
            content: {},
            animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
          },
          {
            id: 'el-venue-heading',
            type: 'heading',
            name: 'Venue Title',
            parentContainerId: 'el-venue-card',
            style: {
              x: 44,
              y: 250,
              width: 302,
              height: 36,
              fontFamily: "'Cinzel', serif",
              fontSize: 20,
              fontWeight: 700,
              color: '#d4af37',
              textAlign: 'center'
            },
            content: { text: 'The Wedding Ceremony' }
          },
          {
            id: 'el-venue-time',
            type: 'text',
            name: 'Ceremony Time',
            parentContainerId: 'el-venue-card',
            style: {
              x: 44,
              y: 290,
              width: 302,
              height: 24,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#f9f6ee',
              textAlign: 'center'
            },
            content: { text: 'Four O\'Clock in the Afternoon' }
          },
          {
            id: 'el-venue-location',
            type: 'text',
            name: 'Venue Name & Address',
            parentContainerId: 'el-venue-card',
            style: {
              x: 44,
              y: 320,
              width: 302,
              height: 48,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              color: '#d1d5db',
              textAlign: 'center',
              lineHeight: 1.5
            },
            content: { text: 'Lioncrest at Biltmore Estate\n1 Lodge St, Asheville, North Carolina 28803' }
          },
          {
            id: 'el-google-maps',
            type: 'google-maps',
            name: 'Maps Embed Preview',
            parentContainerId: 'el-venue-card',
            style: {
              x: 44,
              y: 380,
              width: 302,
              height: 150,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#d4af3733'
            },
            content: {
              venueName: 'The Biltmore Estate',
              venueAddress: '1 Lodge St, Asheville, NC 28803',
              mapQuery: 'Biltmore+Estate+Asheville+NC'
            }
          },
          {
            id: 'el-directions-btn',
            type: 'directions-button',
            name: 'Get Directions Button',
            parentContainerId: 'el-venue-card',
            style: {
              x: 95,
              y: 545,
              width: 200,
              height: 42,
              shape: 'rounded-rectangle',
              borderRadius: 21,
              backgroundColor: '#d4af37',
              color: '#071912',
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "'Montserrat', sans-serif"
            },
            content: {
              buttonText: 'Open in Google Maps',
              venueAddress: '1 Lodge St, Asheville, NC 28803'
            }
          },
          {
            id: 'el-dress-code-box',
            type: 'dress-code',
            name: 'Black Tie Dress Code',
            style: {
              x: 24,
              y: 630,
              width: 342,
              height: 160,
              shape: 'rounded-rectangle',
              borderRadius: 16,
              backgroundColor: '#0e261d',
              borderWidth: 1,
              borderColor: '#d4af3744',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              padding: 16
            },
            content: {
              dressCodeTitle: 'Attire: Black Tie Preferred',
              dressCodeColors: ['#0c1b15', '#1a3628', '#d4af37', '#f9f6ee', '#2c2c2c'],
              dressCodeDescription: 'Gentlemen: Dark tuxedos or formal suits. Ladies: Floor-length evening gowns or elegant cocktail dresses.'
            },
            animation: { type: 'slideUp', duration: 0.8, delay: 0.6 }
          }
        ]
      },
      {
        id: 'p-3-timeline',
        name: 'Itinerary & Timeline',
        order: 2,
        height: 844,
        isFullHeight: true,
        background: {
          type: 'color',
          color: '#071912'
        },
        elements: [
          {
            id: 'el-timeline-title',
            type: 'heading',
            name: 'Timeline Header',
            style: {
              x: 20,
              y: 40,
              width: 350,
              height: 40,
              fontFamily: "'Cinzel', serif",
              fontSize: 24,
              fontWeight: 700,
              color: '#d4af37',
              textAlign: 'center'
            },
            content: { text: 'Wedding Day Timeline' },
            animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
          },
          {
            id: 'el-timeline-widget',
            type: 'timeline',
            name: 'Schedule of Events',
            style: {
              x: 24,
              y: 100,
              width: 342,
              height: 680,
              backgroundColor: '#0e261d',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#d4af3744',
              padding: 20
            },
            content: {
              timelineEvents: [
                { time: '04:00 PM', title: 'Guest Arrival & Welcome Drinks', description: 'Champagne and live harp prelude on the terrace.' },
                { time: '04:30 PM', title: 'Solemn Wedding Ceremony', description: 'Exchange of sacred vows at the Sunken Garden.' },
                { time: '05:30 PM', title: 'Cocktail Hour & Hors d\'œuvres', description: 'Signature cocktails, artisanal charcuterie, and photo sessions.' },
                { time: '07:00 PM', title: 'Grand Dinner & Toasts', description: 'Four-course plated banquet with wine pairings.' },
                { time: '08:30 PM', title: 'First Dance & Celebration', description: 'Live jazz orchestra and dancing beneath the stars.' },
                { time: '11:30 PM', title: 'Sparkler Send-Off', description: 'Farewell gathering along the main courtyard.' }
              ]
            },
            animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
          }
        ]
      },
      {
        id: 'p-4-rsvp',
        name: 'RSVP & Guestbook',
        order: 3,
        height: 960,
        isFullHeight: false,
        background: {
          type: 'gradient',
          gradient: {
            type: 'linear',
            angle: 180,
            colors: ['#071912', '#0c231a', '#05120d']
          }
        },
        elements: [
          {
            id: 'el-rsvp-form-block',
            type: 'rsvp-form',
            name: 'Interactive RSVP Form',
            style: {
              x: 20,
              y: 40,
              width: 350,
              height: 420,
              shape: 'rounded-rectangle',
              borderRadius: 16,
              backgroundColor: '#0e261d',
              borderWidth: 1,
              borderColor: '#d4af37',
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
              padding: 20
            },
            content: {
              text: 'Kindly RSVP by September 15, 2026'
            },
            animation: { type: 'slideUp', duration: 0.8, delay: 0.2 }
          },
          {
            id: 'el-guestbook-block',
            type: 'guestbook',
            name: 'Live Guestbook & Wishes Board',
            style: {
              x: 20,
              y: 490,
              width: 350,
              height: 420,
              shape: 'rounded-rectangle',
              borderRadius: 16,
              backgroundColor: '#0e261d',
              borderWidth: 1,
              borderColor: '#d4af3744',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              padding: 20
            },
            content: {
              text: 'Leave your blessings and congratulations for the happy couple.'
            },
            animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
          }
        ]
      }
    ]
  },
  {
    id: 'template-minimal-botanical',
    title: 'Botanical Eucalyptus & Linen',
    category: 'wedding',
    description: 'Clean modern typography, organic sage & ivory tones, oval couple framing, and minimalist layout.',
    thumbnail: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    isPremium: false,
    theme: {
      primaryColor: '#4a6741',
      secondaryColor: '#2d3b2a',
      accentColor: '#c5a059',
      fontHeading: "'Cormorant Garamond', serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      fontScript: "'Alex Brush', cursive",
      backgroundColor: '#f8f9f6'
    },
    openingScreen: {
      enabled: true,
      style: 'envelope',
      title: 'Save the Date',
      subtitle: 'For the wedding celebration of',
      coupleNames: 'Liam & Olivia',
      openButtonText: 'Open Invitation',
      sealColor: '#4a6741',
      envelopeColor: '#e9ece4',
      musicAutoplayOnOpen: true
    },
    music: {
      enabled: true,
      audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
      title: 'Acoustic Romance',
      artist: 'Gentle Strings',
      autoPlay: true,
      loop: true,
      floatingBadge: true
    },
    pages: [
      {
        id: 'p-bot-1',
        name: 'Welcome',
        order: 0,
        height: 844,
        isFullHeight: true,
        background: {
          type: 'color',
          color: '#f8f9f6'
        },
        elements: [
          {
            id: 'bot-oval-container',
            type: 'container',
            name: 'Oval Couple Photo Holder',
            style: {
              x: 65,
              y: 60,
              width: 260,
              height: 320,
              shape: 'oval',
              backgroundColor: '#e6ebe2',
              borderWidth: 2,
              borderColor: '#4a6741',
              boxShadow: '0 10px 25px rgba(74,103,65,0.15)',
              overflow: 'hidden',
              clipMask: true
            },
            content: {},
            animation: { type: 'zoomIn', duration: 1, delay: 0.2 }
          },
          {
            id: 'bot-oval-img',
            type: 'image',
            name: 'Liam & Olivia Portrait',
            parentContainerId: 'bot-oval-container',
            style: {
              x: 0,
              y: 0,
              width: 260,
              height: 320,
              objectFit: 'cover'
            },
            content: {
              src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
              alt: 'Liam & Olivia'
            }
          },
          {
            id: 'bot-heading',
            type: 'heading',
            name: 'Couple Names',
            style: {
              x: 20,
              y: 410,
              width: 350,
              height: 50,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 38,
              fontWeight: 600,
              color: '#2d3b2a',
              textAlign: 'center'
            },
            content: { text: 'Liam & Olivia' },
            animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
          },
          {
            id: 'bot-subtext',
            type: 'text',
            name: 'Invite Subtext',
            style: {
              x: 30,
              y: 470,
              width: 330,
              height: 40,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 1.6
            },
            content: { text: 'Invite you to join them as they exchange marriage vows and begin their new life together' },
            animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
          },
          {
            id: 'bot-date-pill',
            type: 'container',
            name: 'Date Banner Pill',
            style: {
              x: 45,
              y: 540,
              width: 300,
              height: 80,
              shape: 'rounded-rectangle',
              borderRadius: 40,
              backgroundColor: '#edf2ea',
              borderWidth: 1,
              borderColor: '#4a674144'
            },
            content: {},
            animation: { type: 'slideUp', duration: 0.8, delay: 0.8 }
          },
          {
            id: 'bot-date-text',
            type: 'text',
            name: 'Date Text',
            parentContainerId: 'bot-date-pill',
            style: {
              x: 55,
              y: 555,
              width: 280,
              height: 24,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              fontWeight: 700,
              color: '#4a6741',
              textAlign: 'center',
              letterSpacing: 2
            },
            content: { text: 'AUGUST 18, 2026' }
          },
          {
            id: 'bot-time-text',
            type: 'text',
            name: 'Time Text',
            parentContainerId: 'bot-date-pill',
            style: {
              x: 55,
              y: 580,
              width: 280,
              height: 20,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              color: '#4b5563',
              textAlign: 'center'
            },
            content: { text: '5:00 PM • Sonoma Valley Vineyards, California' }
          },
          {
            id: 'bot-rsvp-btn',
            type: 'button',
            name: 'RSVP Action Button',
            style: {
              x: 95,
              y: 660,
              width: 200,
              height: 48,
              shape: 'rounded-rectangle',
              borderRadius: 24,
              backgroundColor: '#4a6741',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 4px 14px rgba(74,103,65,0.3)'
            },
            content: {
              buttonText: 'RSVP Online',
              buttonAction: 'next-page'
            },
            animation: { type: 'bounce', duration: 1, delay: 1 }
          }
        ]
      }
    ]
  },
  {
    id: 'template-modern-birthday',
    title: 'Midnight Glamour Party & Gala',
    category: 'party',
    description: 'Neon gold and deep black aesthetic, party countdown, dress code cards, and quick WhatsApp RSVP.',
    thumbnail: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    isPremium: false,
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#18181b',
      accentColor: '#fbbf24',
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Montserrat', sans-serif",
      fontScript: "'Parisienne', cursive",
      backgroundColor: '#09090b'
    },
    openingScreen: {
      enabled: true,
      style: 'card-flip',
      title: 'You\'re Invited to Celebrate',
      subtitle: 'An Unforgettable 30th Birthday Gala',
      coupleNames: 'Victoria Sterling',
      openButtonText: 'View VIP Invitation',
      sealColor: '#f59e0b',
      envelopeColor: '#18181b',
      musicAutoplayOnOpen: true
    },
    music: {
      enabled: true,
      audioUrl: 'https://cdn.freesound.org/previews/538/538848_10202167-lq.mp3',
      title: 'Midnight Celebration Piano',
      artist: 'Studio Nights',
      autoPlay: true,
      loop: true,
      floatingBadge: true
    },
    pages: [
      {
        id: 'p-bday-1',
        name: 'VIP Invitation',
        order: 0,
        height: 844,
        isFullHeight: true,
        background: {
          type: 'gradient',
          gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#09090b', '#18181b', '#000000']
          }
        },
        elements: [
          {
            id: 'bday-ticket-box',
            type: 'container',
            name: 'VIP Pass Ticket Shape',
            style: {
              x: 20,
              y: 40,
              width: 350,
              height: 740,
              shape: 'ticket',
              backgroundColor: '#121215',
              borderWidth: 1,
              borderColor: '#f59e0b66',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              padding: 20
            },
            content: {},
            animation: { type: 'zoomIn', duration: 0.9, delay: 0.2 }
          },
          {
            id: 'bday-vip-badge',
            type: 'text',
            name: 'VIP Badge',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 40,
              y: 70,
              width: 310,
              height: 24,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: '#f59e0b',
              textAlign: 'center',
              letterSpacing: 4
            },
            content: { text: '★ EXCLUSIVE VIP INVITATION ★' }
          },
          {
            id: 'bday-title',
            type: 'heading',
            name: 'Birthday Title',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 30,
              y: 110,
              width: 330,
              height: 60,
              fontFamily: "'Playfair Display', serif",
              fontSize: 36,
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center'
            },
            content: { text: 'Victoria\'s 30th' }
          },
          {
            id: 'bday-subtitle',
            type: 'text',
            name: 'Party Theme',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 30,
              y: 170,
              width: 330,
              height: 30,
              fontFamily: "'Parisienne', cursive",
              fontSize: 26,
              color: '#fbbf24',
              textAlign: 'center'
            },
            content: { text: 'A Night of Champagne & Gold' }
          },
          {
            id: 'bday-date-time',
            type: 'text',
            name: 'Party Date Time',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 30,
              y: 230,
              width: 330,
              height: 40,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#e4e4e7',
              textAlign: 'center',
              lineHeight: 1.6
            },
            content: { text: 'SATURDAY, NOVEMBER 14, 2026\n8:00 PM ONWARDS' }
          },
          {
            id: 'bday-countdown',
            type: 'countdown',
            name: 'Countdown to Party',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 35,
              y: 290,
              width: 320,
              height: 80,
              fontFamily: "'Montserrat', sans-serif"
            },
            content: {
              countdownTarget: '2026-11-14T20:00:00',
              countdownLabels: { days: 'DAYS', hours: 'HRS', minutes: 'MINS', seconds: 'SECS' }
            }
          },
          {
            id: 'bday-venue-box',
            type: 'venue',
            name: 'Venue Info',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 35,
              y: 390,
              width: 320,
              height: 100,
              backgroundColor: '#1f1f23',
              borderRadius: 12,
              padding: 12
            },
            content: {
              venueName: 'The Penthouse Rooftop Lounge',
              venueAddress: '450 West 33rd St, Manhattan, New York',
              mapQuery: 'Manhattan+New+York'
            }
          },
          {
            id: 'bday-whatsapp-btn',
            type: 'whatsapp-button',
            name: 'WhatsApp RSVP Button',
            parentContainerId: 'bday-ticket-box',
            style: {
              x: 60,
              y: 520,
              width: 270,
              height: 46,
              shape: 'rounded-rectangle',
              borderRadius: 23,
              backgroundColor: '#25D366',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600
            },
            content: {
              buttonText: 'RSVP via WhatsApp',
              whatsappPhone: '+1234567890',
              whatsappMessage: 'Hi Victoria! I would love to attend your 30th Birthday Gala!'
            }
          }
        ]
      }
    ]
  }
];

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
      color: '#071912'
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
      backgroundColor: '#0c1b15'
    },
    openingScreen: {
      enabled: false,
      style: 'envelope',
      title: customTitle || 'Wedding Invitation',
      openButtonText: 'Open Invitation',
      envelopeColor: '#071811',
      sealColor: '#d4af37',
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

export function createInvitationFromTemplate(template: InvitationTemplate, businessId: string, customTitle?: string): Invitation {
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


