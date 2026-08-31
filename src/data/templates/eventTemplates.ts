import { PageTemplate, PrebuiltBlock } from '../../types';

// 10. EVENT - Date/time
export const dateTimeTemplate: PageTemplate = {
  id: 'tmpl-event-datetime',
  name: 'Date & Time',
  category: 'event',
  subcategory: 'Date/Time',
  description: 'Calendar save the date card with live countdown clock boxes and calendar synchronization button.',
  thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Date & Countdown',
    order: 3,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'dt-sub',
        type: 'text',
        name: 'Date Subtitle',
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
        content: { text: 'SAVE OUR SPECIAL DATE' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'dt-heading',
        type: 'heading',
        name: 'Save The Date Heading',
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
        content: { text: 'October 24, 2026' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Calendar Box
      {
        id: 'dt-calendar-box',
        type: 'container',
        name: 'Calendar Date Card',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 200,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'dt-cal-month',
        type: 'text',
        name: 'Calendar Month & Year',
        parentContainerId: 'dt-calendar-box',
        style: {
          x: 45,
          y: 150,
          width: 300,
          height: 24,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 3
        },
        content: { text: 'OCTOBER 2026' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'dt-cal-day-num',
        type: 'heading',
        name: 'Calendar Day Number',
        parentContainerId: 'dt-calendar-box',
        style: {
          x: 45,
          y: 175,
          width: 300,
          height: 80,
          fontFamily: "'Playfair Display', serif",
          fontSize: 64,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: '24' },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'dt-cal-day-name',
        type: 'text',
        name: 'Calendar Day Name',
        parentContainerId: 'dt-calendar-box',
        style: {
          x: 45,
          y: 260,
          width: 300,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: '#d4af37cc',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'SATURDAY • SAN FRANCISCO, CA' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      // Countdown Element
      {
        id: 'dt-countdown-el',
        type: 'countdown',
        name: 'Live Countdown Element',
        style: {
          x: 25,
          y: 355,
          width: 340,
          height: 120
        },
        content: {
          countdownTarget: '2026-10-24T10:00:00',
          countdownStyle: 'boxes'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      // Add to Calendar Button
      {
        id: 'dt-cal-sync-btn',
        type: 'button',
        name: 'Add to Calendar Button',
        style: {
          x: 65,
          y: 505,
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
          buttonText: '📅 REMIND ME ON CALENDAR',
          buttonAction: 'calendar'
        },
        animation: { type: 'pulse', duration: 2, delay: 0.8, repeat: true }
      }
    ]
  }
};

// 11. EVENT - Venue
export const venueTemplate: PageTemplate = {
  id: 'tmpl-event-venue',
  name: 'Venue',
  category: 'event',
  subcategory: 'Venue',
  description: 'Full venue showcase with landscape photography, hall amenities, parking notes, and map button.',
  thumbnail: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'The Venue',
    order: 3,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'vn-sub',
        type: 'text',
        name: 'Venue Subtitle',
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
        content: { text: 'CELEBRATION VENUE' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'vn-heading',
        type: 'heading',
        name: 'Venue Heading',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'The St. Regis Resort' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'vn-photo',
        type: 'container',
        name: 'Venue Landscape Photo Frame',
        style: {
          x: 25,
          y: 125,
          width: 340,
          height: 220,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: '#d4af37',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            size: 'cover'
          },
          clipMask: true,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'vn-info-box',
        type: 'container',
        name: 'Venue Amenities Box',
        style: {
          x: 25,
          y: 365,
          width: 340,
          height: 260,
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
        id: 'vn-hall-title',
        type: 'heading',
        name: 'Grand Ballroom Title',
        parentContainerId: 'vn-info-box',
        style: {
          x: 45,
          y: 385,
          width: 300,
          height: 30,
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Grand Crystal Ballroom & Garden' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'vn-amenities',
        type: 'text',
        name: 'Amenities Bullet List',
        parentContainerId: 'vn-info-box',
        style: {
          x: 45,
          y: 425,
          width: 300,
          height: 100,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#f9f6eecc',
          textAlign: 'left',
          lineHeight: 1.6
        },
        content: {
          text: '✓ Complimentary Valet Parking at Gate 1\n✓ Fully Air-Conditioned Indoor Pavilion\n✓ Dedicated Children’s Hospitality Lounge\n✓ Shuttle Service from Hotel InterContinental'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'vn-map-btn',
        type: 'button',
        name: 'Venue Navigation Button',
        parentContainerId: 'vn-info-box',
        style: {
          x: 65,
          y: 545,
          width: 260,
          height: 44,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 22
        },
        content: {
          buttonText: '📍 OPEN IN NAVIGATION APP',
          buttonAction: 'maps',
          buttonLink: 'https://maps.google.com'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      }
    ]
  }
};

// 12. EVENT - Map
export const mapTemplate: PageTemplate = {
  id: 'tmpl-event-map',
  name: 'Map & Location',
  category: 'event',
  subcategory: 'Map',
  description: 'Interactive map container with pin preview, address information badge, and directions action.',
  thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Map & Directions',
    order: 3,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'mp-sub',
        type: 'text',
        name: 'Map Subtitle',
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
        content: { text: 'EVENT LOCATION' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'mp-heading',
        type: 'heading',
        name: 'Map Display Title',
        style: {
          x: 20,
          y: 65,
          width: 350,
          height: 45,
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Find Your Way' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Map Canvas Element
      {
        id: 'mp-map-el',
        type: 'google-maps',
        name: 'Interactive Location Map',
        style: {
          x: 25,
          y: 125,
          width: 340,
          height: 340,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: '#d4af37'
        },
        content: {
          venueName: 'The St. Regis Grand Ballroom',
          venueAddress: '125 3rd St, San Francisco, CA 94103',
          mapQuery: 'The St. Regis San Francisco',
          mapZoom: 15
        },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      // Address Badge Box
      {
        id: 'mp-address-box',
        type: 'container',
        name: 'Address Details Box',
        style: {
          x: 25,
          y: 485,
          width: 340,
          height: 180,
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
        id: 'mp-addr-txt',
        type: 'text',
        name: 'Full Address Info',
        parentContainerId: 'mp-address-box',
        style: {
          x: 45,
          y: 505,
          width: 300,
          height: 48,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: {
          text: 'The St. Regis Resort & Ballroom\n125 3rd Street, San Francisco, California'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'mp-btn',
        type: 'button',
        name: 'Direct Maps Launcher',
        parentContainerId: 'mp-address-box',
        style: {
          x: 65,
          y: 575,
          width: 260,
          height: 46,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 23
        },
        content: {
          buttonText: '🚀 OPEN IN GOOGLE MAPS / WAZE',
          buttonAction: 'maps',
          buttonLink: 'https://maps.google.com'
        },
        animation: { type: 'pulse', duration: 2, delay: 0.6, repeat: true }
      }
    ]
  }
};

// 13. EVENT - Dress code
export const dressCodeTemplate: PageTemplate = {
  id: 'tmpl-event-dresscode',
  name: 'Dress Code',
  category: 'event',
  subcategory: 'Dress Code',
  description: 'Color palette swatches with hex chips, attire guidelines (Formal/Black Tie), and styling suggestions.',
  thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Dress Code',
    order: 3,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'dc-sub',
        type: 'text',
        name: 'Dress Code Subtitle',
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
        content: { text: 'ATTIRE & COLOR GUIDE' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'dc-heading',
        type: 'heading',
        name: 'Dress Code Title',
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
        content: { text: 'Formal & Black Tie' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'dc-card',
        type: 'container',
        name: 'Dress Code Card',
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
        id: 'dc-palette-title',
        type: 'text',
        name: 'Recommended Palette Label',
        parentContainerId: 'dc-card',
        style: {
          x: 45,
          y: 160,
          width: 300,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'PREFERRED COLOR PALETTE' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      // Dress code color swatches element
      {
        id: 'dc-swatch-el',
        type: 'dress-code',
        name: 'Dress Code Palette Swatches',
        parentContainerId: 'dc-card',
        style: {
          x: 35,
          y: 195,
          width: 320,
          height: 140
        },
        content: {
          dressCodeTitle: 'Emerald & Gold Formal',
          dressCodeColors: ['#071912', '#0d281e', '#d4af37', '#f9f6ee', '#b76e79'],
          dressCodeDescription: 'Gentlemen: Black Tie or Dark Emerald Tuxedo / Formal Suit.\nLadies: Evening Gown or Cocktail Dress in palette tones.'
        },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'dc-notes',
        type: 'text',
        name: 'Etiquette Note',
        parentContainerId: 'dc-card',
        style: {
          x: 45,
          y: 380,
          width: 300,
          height: 70,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center',
          lineHeight: 1.5
        },
        content: {
          text: '✨ Kindly refrain from wearing all-white or ivory attire, which is traditionally reserved for the bride.'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      }
    ]
  }
};

// 14. EVENT - Schedule
export const scheduleTemplate: PageTemplate = {
  id: 'tmpl-event-schedule',
  name: 'Schedule',
  category: 'event',
  subcategory: 'Schedule',
  description: 'Detailed wedding day itinerary with time slots, event titles, and venue locations.',
  thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Event Schedule',
    order: 3,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'sch-sub',
        type: 'text',
        name: 'Schedule Subtitle',
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
        content: { text: 'WEDDING DAY ITINERARY' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'sch-heading',
        type: 'heading',
        name: 'Schedule Heading',
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
        content: { text: 'Day of Celebration' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'sch-timeline-el',
        type: 'timeline',
        name: 'Schedule Itinerary Tracker',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 580
        },
        content: {
          timelineEvents: [
            { time: '09:30 AM', title: 'Guest Arrival', description: 'Welcome beverages & acoustic harp music in the garden' },
            { time: '10:30 AM', title: 'Sacred Ceremony', description: 'Exchange of vows, rings, and matrimonial blessing' },
            { time: '12:00 PM', title: 'Confetti & Photos', description: 'Celebratory toast and formal family portraits' },
            { time: '06:00 PM', title: 'Cocktail Reception', description: 'Artisan hors d’oeuvres and live string quartet' },
            { time: '07:00 PM', title: 'Grand Gala Dinner', description: '5-Course plated gourmet dinner & speeches' },
            { time: '09:30 PM', title: 'First Dance & Party', description: 'Cake cutting and midnight dancing celebration' }
          ]
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
      }
    ]
  }
};

// 15. EVENT - Timeline
export const timelineTemplate: PageTemplate = {
  id: 'tmpl-event-timeline',
  name: 'Timeline & Love Story',
  category: 'event',
  subcategory: 'Timeline',
  description: 'Romantic love story milestones from first meeting, first adventure, proposal, to the wedding day.',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Our Story Timeline',
    order: 3,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'tml-sub',
        type: 'text',
        name: 'Timeline Subtitle',
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
        content: { text: 'OUR JOURNEY TOGETHER' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'tml-heading',
        type: 'heading',
        name: 'Love Story Title',
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
        content: { text: 'How We Fell In Love' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      {
        id: 'tml-story-el',
        type: 'timeline',
        name: 'Love Story Milestones',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 560
        },
        content: {
          timelineEvents: [
            { time: '2020', title: 'First Met in Paris', description: 'A serendipitous encounter at a quaint bookstore near the Seine.' },
            { time: '2022', title: 'First Big Adventure', description: 'Exploring Kyoto’s cherry blossoms and adopting our puppy, Mochi.' },
            { time: '2025', title: 'The Amalfi Proposal', description: 'A sunset boat ride in Positano under a sky full of fireworks.' },
            { time: '2026', title: 'Forever Begins', description: 'Saying "I Do" surrounded by all our dearest family and friends.' }
          ]
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
      }
    ]
  }
};

export const eventTemplates: PageTemplate[] = [
  dateTimeTemplate,
  venueTemplate,
  mapTemplate,
  dressCodeTemplate,
  scheduleTemplate,
  timelineTemplate
];

export const eventBlocks: PrebuiltBlock[] = [
  {
    id: 'block-event-datetime',
    name: 'Date & Time Block',
    category: 'event',
    subcategory: 'Date/Time',
    description: 'Calendar date card with live countdown timer and calendar sync button.',
    icon: 'Calendar',
    thumbnail: dateTimeTemplate.thumbnail,
    suggestedHeight: 844,
    elements: dateTimeTemplate.page.elements
  },
  {
    id: 'block-event-venue',
    name: 'Venue Block',
    category: 'event',
    subcategory: 'Venue',
    description: 'Venue photo showcase with hall amenities list and navigation button.',
    icon: 'Building2',
    thumbnail: venueTemplate.thumbnail,
    suggestedHeight: 844,
    elements: venueTemplate.page.elements
  },
  {
    id: 'block-event-map',
    name: 'Map & Location Block',
    category: 'event',
    subcategory: 'Map',
    description: 'Interactive map container with address details card and navigation action.',
    icon: 'MapPin',
    thumbnail: mapTemplate.thumbnail,
    suggestedHeight: 844,
    elements: mapTemplate.page.elements
  },
  {
    id: 'block-event-dresscode',
    name: 'Dress Code Block',
    category: 'event',
    subcategory: 'Dress Code',
    description: 'Color palette swatches with attire guidelines and formal styling note.',
    icon: 'Palette',
    thumbnail: dressCodeTemplate.thumbnail,
    suggestedHeight: 844,
    elements: dressCodeTemplate.page.elements
  },
  {
    id: 'block-event-schedule',
    name: 'Schedule Block',
    category: 'event',
    subcategory: 'Schedule',
    description: 'Wedding day itinerary schedule breakdown with time slots.',
    icon: 'Clock',
    thumbnail: scheduleTemplate.thumbnail,
    suggestedHeight: 844,
    elements: scheduleTemplate.page.elements
  },
  {
    id: 'block-event-timeline',
    name: 'Timeline Block',
    category: 'event',
    subcategory: 'Timeline',
    description: 'Love story journey milestones from meeting to wedding day.',
    icon: 'Layers',
    thumbnail: timelineTemplate.thumbnail,
    suggestedHeight: 844,
    elements: timelineTemplate.page.elements
  }
];
