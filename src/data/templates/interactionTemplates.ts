import { PageTemplate, PrebuiltBlock } from '../../types';

// 19. INTERACTION - RSVP
export const rsvpTemplate: PageTemplate = {
  id: 'tmpl-interaction-rsvp',
  name: 'RSVP Form',
  category: 'interaction',
  subcategory: 'RSVP',
  description: 'Interactive RSVP form with guest name, attendance radio, guest count, dietary preferences, and submission confirmation.',
  thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'RSVP Confirmation',
    order: 5,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'rsv-sub',
        type: 'text',
        name: 'RSVP Subtitle',
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
        content: { text: 'ATTENDANCE CONFIRMATION' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'rsv-heading',
        type: 'heading',
        name: 'RSVP Heading',
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
        content: { text: 'Kindly Respond' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // RSVP Form Element
      {
        id: 'rsv-form-el',
        type: 'rsvp-form',
        name: 'Interactive RSVP Form',
        style: {
          x: 25,
          y: 125,
          width: 340,
          height: 520
        },
        content: {
          buttonText: 'CONFIRM ATTENDANCE',
          eventDate: 'October 1, 2026'
        },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'rsv-deadline-note',
        type: 'text',
        name: 'RSVP Deadline Note',
        style: {
          x: 30,
          y: 670,
          width: 330,
          height: 30,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37aa',
          textAlign: 'center',
          letterSpacing: 1
        },
        content: { text: 'Please respond on or before October 1, 2026' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      }
    ]
  }
};

// 20. INTERACTION - Guestbook
export const guestbookTemplate: PageTemplate = {
  id: 'tmpl-interaction-guestbook',
  name: 'Guestbook',
  category: 'interaction',
  subcategory: 'Guestbook',
  description: 'Digital guestbook message board with virtual greetings input and live community feed.',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Digital Guestbook',
    order: 5,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'gb-sub',
        type: 'text',
        name: 'Guestbook Subtitle',
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
        content: { text: 'WARM BLESSINGS' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'gb-heading',
        type: 'heading',
        name: 'Guestbook Heading',
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
        content: { text: 'Wedding Guestbook' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Guestbook Interactive Element
      {
        id: 'gb-book-el',
        type: 'guestbook',
        name: 'Live Guestbook Board',
        style: {
          x: 25,
          y: 125,
          width: 340,
          height: 620
        },
        content: {
          buttonText: 'POST BLESSING'
        },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      }
    ]
  }
};

// 21. INTERACTION - Wishes
export const wishesTemplate: PageTemplate = {
  id: 'tmpl-interaction-wishes',
  name: 'Wishes & Prayers',
  category: 'interaction',
  subcategory: 'Wishes',
  description: 'Virtual prayer cards, one-tap love reaction counter, and celebratory message blessings for the couple.',
  thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Wishes & Love',
    order: 5,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'wsh-sub',
        type: 'text',
        name: 'Wishes Subtitle',
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
        content: { text: 'CELEBRATE WITH LOVE' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'wsh-heading',
        type: 'heading',
        name: 'Wishes Heading',
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
        content: { text: 'Send Your Blessings' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Heart Reaction Box
      {
        id: 'wsh-heart-card',
        type: 'container',
        name: 'Love Counter Card',
        style: {
          x: 25,
          y: 125,
          width: 340,
          height: 140,
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
        id: 'wsh-heart-btn',
        type: 'button',
        name: 'Heart Reaction Button',
        parentContainerId: 'wsh-heart-card',
        style: {
          x: 65,
          y: 155,
          width: 260,
          height: 52,
          backgroundColor: '#e11d48',
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 700,
          borderRadius: 26,
          boxShadow: '0 4px 20px rgba(225,29,72,0.4)'
        },
        content: {
          buttonText: '❤️ TAP TO SEND LOVE (248)',
          buttonAction: 'guestbook'
        },
        animation: { type: 'pulse', duration: 1.5, delay: 0.4, repeat: true }
      },
      {
        id: 'wsh-chips-box',
        type: 'container',
        name: 'Quick Wishes Chips Card',
        style: {
          x: 25,
          y: 285,
          width: 340,
          height: 380,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'wsh-chip-title',
        type: 'text',
        name: 'Quick Messages Header',
        parentContainerId: 'wsh-chips-box',
        style: {
          x: 45,
          y: 305,
          width: 300,
          height: 22,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'COMMUNITY BLESSINGS' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'wsh-chip-1',
        type: 'text',
        name: 'Blessing Message 1',
        parentContainerId: 'wsh-chips-box',
        style: {
          x: 45,
          y: 340,
          width: 300,
          height: 55,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#ffffff',
          backgroundColor: '#07191288',
          borderRadius: 12,
          padding: 10,
          lineHeight: 1.4
        },
        content: { text: '“Wishing you both a lifetime of eternal love, joy, and laughter! 🥂” — Evelyn & James' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      },
      {
        id: 'wsh-chip-2',
        type: 'text',
        name: 'Blessing Message 2',
        parentContainerId: 'wsh-chips-box',
        style: {
          x: 45,
          y: 410,
          width: 300,
          height: 55,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#ffffff',
          backgroundColor: '#07191288',
          borderRadius: 12,
          padding: 10,
          lineHeight: 1.4
        },
        content: { text: '“Congratulations Alexander & Sophia! Can’t wait to celebrate with you! 🎉” — Marcus' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.8 }
      },
      {
        id: 'wsh-chip-3',
        type: 'text',
        name: 'Blessing Message 3',
        parentContainerId: 'wsh-chips-box',
        style: {
          x: 45,
          y: 480,
          width: 300,
          height: 55,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#ffffff',
          backgroundColor: '#07191288',
          borderRadius: 12,
          padding: 10,
          lineHeight: 1.4
        },
        content: { text: '“May your bond grow stronger with every sunrise. Much love!” — Uncle Arthur & Family' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.9 }
      },
      {
        id: 'wsh-write-btn',
        type: 'button',
        name: 'Write Blessing Button',
        parentContainerId: 'wsh-chips-box',
        style: {
          x: 65,
          y: 565,
          width: 260,
          height: 44,
          backgroundColor: '#d4af37',
          color: '#071912',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 22
        },
        content: {
          buttonText: '✍️ WRITE A BLESSING',
          buttonAction: 'guestbook'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 1 }
      }
    ]
  }
};

// 22. INTERACTION - Contact
export const contactTemplate: PageTemplate = {
  id: 'tmpl-interaction-contact',
  name: 'Contact & Organizers',
  category: 'interaction',
  subcategory: 'Contact',
  description: 'Event organizers contact cards with direct WhatsApp chat and phone call actions.',
  thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Event Contact',
    order: 5,
    heightMode: 'custom',
    height: 844,
    isFullHeight: false,
    background: {
      type: 'color',
      color: '#071912'
    },
    elements: [
      {
        id: 'cnt-sub',
        type: 'text',
        name: 'Contact Subtitle',
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
        content: { text: 'NEED ASSISTANCE?' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'cnt-heading',
        type: 'heading',
        name: 'Contact Heading',
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
        content: { text: 'Event Organizers' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Contact Card 1: Maid of Honor / Planner
      {
        id: 'cnt-card-1',
        type: 'container',
        name: 'Organizer Card 1',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 220,
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
        id: 'cnt-role-1',
        type: 'text',
        name: 'Organizer Role 1',
        parentContainerId: 'cnt-card-1',
        style: {
          x: 45,
          y: 150,
          width: 300,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'WEDDING PLANNER & MAID OF HONOR' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'cnt-name-1',
        type: 'heading',
        name: 'Organizer Name 1',
        parentContainerId: 'cnt-card-1',
        style: {
          x: 45,
          y: 175,
          width: 300,
          height: 30,
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Charlotte Montgomery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'cnt-btn-wa-1',
        type: 'button',
        name: 'WhatsApp Button 1',
        parentContainerId: 'cnt-card-1',
        style: {
          x: 65,
          y: 235,
          width: 260,
          height: 44,
          backgroundColor: '#25D366',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 22,
          boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
        },
        content: {
          buttonText: '💬 CHAT ON WHATSAPP',
          buttonAction: 'whatsapp',
          whatsappPhone: '+14155552671',
          whatsappMessage: 'Hi Charlotte, I have a question regarding Sophia & Alexander\'s wedding!'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      // Contact Card 2: Best Man / Logistics
      {
        id: 'cnt-card-2',
        type: 'container',
        name: 'Organizer Card 2',
        style: {
          x: 25,
          y: 375,
          width: 340,
          height: 220,
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
        id: 'cnt-role-2',
        type: 'text',
        name: 'Organizer Role 2',
        parentContainerId: 'cnt-card-2',
        style: {
          x: 45,
          y: 395,
          width: 300,
          height: 20,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: '#d4af37',
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'LOGISTICS & BEST MAN' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'cnt-name-2',
        type: 'heading',
        name: 'Organizer Name 2',
        parentContainerId: 'cnt-card-2',
        style: {
          x: 45,
          y: 420,
          width: 300,
          height: 30,
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: 'Julian Hayes' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'cnt-btn-wa-2',
        type: 'button',
        name: 'WhatsApp Button 2',
        parentContainerId: 'cnt-card-2',
        style: {
          x: 65,
          y: 480,
          width: 260,
          height: 44,
          backgroundColor: '#25D366',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          borderRadius: 22,
          boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
        },
        content: {
          buttonText: '💬 CHAT ON WHATSAPP',
          buttonAction: 'whatsapp',
          whatsappPhone: '+14155559812',
          whatsappMessage: 'Hi Julian, I have a question regarding transportation / logistics!'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      }
    ]
  }
};

export const interactionTemplates: PageTemplate[] = [
  rsvpTemplate,
  guestbookTemplate,
  wishesTemplate,
  contactTemplate
];

export const interactionBlocks: PrebuiltBlock[] = [
  {
    id: 'block-interaction-rsvp',
    name: 'RSVP Form Block',
    category: 'interaction',
    subcategory: 'RSVP',
    description: 'Interactive RSVP form with guest attendance, counter, and confirmation.',
    icon: 'FileText',
    thumbnail: rsvpTemplate.thumbnail,
    suggestedHeight: 844,
    elements: rsvpTemplate.page.elements
  },
  {
    id: 'block-interaction-guestbook',
    name: 'Guestbook Block',
    category: 'interaction',
    subcategory: 'Guestbook',
    description: 'Digital guestbook message board and community blessing feed.',
    icon: 'MessageSquare',
    thumbnail: guestbookTemplate.thumbnail,
    suggestedHeight: 844,
    elements: guestbookTemplate.page.elements
  },
  {
    id: 'block-interaction-wishes',
    name: 'Wishes & Blessings Block',
    category: 'interaction',
    subcategory: 'Wishes',
    description: 'Tap-to-react heart love counter with community blessings.',
    icon: 'Heart',
    thumbnail: wishesTemplate.thumbnail,
    suggestedHeight: 844,
    elements: wishesTemplate.page.elements
  },
  {
    id: 'block-interaction-contact',
    name: 'Contact & Organizers Block',
    category: 'interaction',
    subcategory: 'Contact',
    description: 'Event organizers contact cards with direct WhatsApp chat links.',
    icon: 'Phone',
    thumbnail: contactTemplate.thumbnail,
    suggestedHeight: 844,
    elements: contactTemplate.page.elements
  }
];
