import { PageTemplate, PrebuiltBlock } from '../../types';

// 16. MEDIA - Photo gallery
export const photoGalleryTemplate: PageTemplate = {
  id: 'tmpl-media-gallery',
  name: 'Photo Gallery',
  category: 'media',
  subcategory: 'Gallery',
  description: 'Multi-photo grid with captions, lightbox viewing capability, and romantic memories.',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Photo Gallery',
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
        id: 'gal-sub',
        type: 'text',
        name: 'Gallery Subtitle',
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
        content: { text: 'CHERISHED MOMENTS' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'gal-heading',
        type: 'heading',
        name: 'Gallery Heading',
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
        content: { text: 'Pre-Wedding Gallery' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Gallery Component
      {
        id: 'gal-grid-el',
        type: 'photo-gallery',
        name: 'Photo Gallery Grid',
        style: {
          x: 20,
          y: 125,
          width: 350,
          height: 620
        },
        content: {
          galleryLayout: 'grid',
          galleryColumns: 2,
          galleryImages: [
            { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', caption: 'The Engagement' },
            { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', caption: 'Sunset in Amalfi' },
            { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', caption: 'Our First Dance' },
            { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', caption: 'Sophia' },
            { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', caption: 'Alexander' },
            { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80', caption: 'The Venue' }
          ]
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.3 }
      }
    ]
  }
};

// 17. MEDIA - Image collage
export const imageCollageTemplate: PageTemplate = {
  id: 'tmpl-media-collage',
  name: 'Image Collage',
  category: 'media',
  subcategory: 'Collage',
  description: 'Artistic editorial collage with tilted polaroid frames, drop shadows, and delicate captions.',
  thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Memory Collage',
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
        id: 'col-sub',
        type: 'text',
        name: 'Collage Subtitle',
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
        content: { text: 'EDITORIAL MEMORIES' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'col-heading',
        type: 'heading',
        name: 'Collage Heading',
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
        content: { text: 'Snapshots of Us' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Collage Frame 1: Big Hero (Left tilted)
      {
        id: 'col-frame-1',
        type: 'container',
        name: 'Polaroid Card 1',
        style: {
          x: 25,
          y: 125,
          width: 200,
          height: 250,
          shape: 'rounded-rectangle',
          borderRadius: 16,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#d4af3788',
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
          rotation: -3
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'col-img-1',
        type: 'image',
        name: 'Collage Photo 1',
        parentContainerId: 'col-frame-1',
        style: {
          x: 35,
          y: 135,
          width: 180,
          height: 190,
          borderRadius: 10,
          objectFit: 'cover'
        },
        content: {
          src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
          caption: 'Amalfi Sunset'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'col-cap-1',
        type: 'text',
        name: 'Polaroid Caption 1',
        parentContainerId: 'col-frame-1',
        style: {
          x: 35,
          y: 335,
          width: 180,
          height: 25,
          fontFamily: "'Playfair Display', serif",
          fontSize: 12,
          fontStyle: 'italic',
          color: '#1a1a1a',
          textAlign: 'center'
        },
        content: { text: 'Paris, Autumn ’24' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      // Collage Frame 2: Top Right (Right tilted)
      {
        id: 'col-frame-2',
        type: 'container',
        name: 'Polaroid Card 2',
        style: {
          x: 215,
          y: 180,
          width: 155,
          height: 200,
          shape: 'rounded-rectangle',
          borderRadius: 14,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#d4af3788',
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
          rotation: 4
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'col-img-2',
        type: 'image',
        name: 'Collage Photo 2',
        parentContainerId: 'col-frame-2',
        style: {
          x: 223,
          y: 188,
          width: 139,
          height: 145,
          borderRadius: 8,
          objectFit: 'cover'
        },
        content: {
          src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
          caption: 'Our Best Day'
        },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'col-cap-2',
        type: 'text',
        name: 'Polaroid Caption 2',
        parentContainerId: 'col-frame-2',
        style: {
          x: 223,
          y: 342,
          width: 139,
          height: 20,
          fontFamily: "'Playfair Display', serif",
          fontSize: 11,
          fontStyle: 'italic',
          color: '#1a1a1a',
          textAlign: 'center'
        },
        content: { text: 'The Proposal ✨' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      },
      // Collage Frame 3: Wide Bottom Card
      {
        id: 'col-frame-3',
        type: 'container',
        name: 'Wide Landscape Frame',
        style: {
          x: 35,
          y: 415,
          width: 320,
          height: 280,
          shape: 'rounded-rectangle',
          borderRadius: 20,
          borderWidth: 2,
          borderColor: '#d4af37',
          background: {
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            size: 'cover'
          },
          clipMask: true,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
        },
        content: {},
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.6 }
      },
      {
        id: 'col-badge-3',
        type: 'text',
        name: 'Bottom Frame Tag',
        parentContainerId: 'col-frame-3',
        style: {
          x: 55,
          y: 650,
          width: 280,
          height: 25,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 12,
          textAlign: 'center',
          letterSpacing: 2
        },
        content: { text: 'TOGETHER IS OUR FAVORITE PLACE' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.7 }
      }
    ]
  }
};

// 18. MEDIA - Video section
export const videoSectionTemplate: PageTemplate = {
  id: 'tmpl-media-video',
  name: 'Video Section',
  category: 'media',
  subcategory: 'Video',
  description: 'Dedicated cinematic wedding film player with custom poster thumbnail, credits, and play action.',
  thumbnail: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
  page: {
    name: 'Wedding Cinema',
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
        id: 'vs-sub',
        type: 'text',
        name: 'Video Subtitle',
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
        content: { text: 'OUR LOVE STORY FILM' },
        animation: { type: 'slideDown', duration: 0.8, delay: 0.1 }
      },
      {
        id: 'vs-heading',
        type: 'heading',
        name: 'Video Section Heading',
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
        content: { text: 'Watch The Teaser' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.2 }
      },
      // Video Player Element
      {
        id: 'vs-player-el',
        type: 'video',
        name: 'Cinematic Video Player',
        style: {
          x: 25,
          y: 130,
          width: 340,
          height: 440,
          borderRadius: 24,
          borderWidth: 2,
          borderColor: '#d4af37',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)'
        },
        content: {
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-in-a-box-41589-large.mp4',
          videoPoster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          videoControls: true,
          videoLoop: true
        },
        animation: { type: 'zoomIn', duration: 0.8, delay: 0.3 }
      },
      {
        id: 'vs-credits-box',
        type: 'container',
        name: 'Film Credits Card',
        style: {
          x: 25,
          y: 595,
          width: 340,
          height: 120,
          shape: 'rounded-rectangle',
          borderRadius: 18,
          backgroundColor: '#0d281eee',
          borderWidth: 1,
          borderColor: '#d4af3744',
          padding: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        },
        content: {},
        animation: { type: 'slideUp', duration: 0.8, delay: 0.4 }
      },
      {
        id: 'vs-film-title',
        type: 'heading',
        name: 'Film Title',
        parentContainerId: 'vs-credits-box',
        style: {
          x: 45,
          y: 610,
          width: 300,
          height: 25,
          fontFamily: "'Playfair Display', serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center'
        },
        content: { text: '“Forever in Positano”' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 }
      },
      {
        id: 'vs-credits-txt',
        type: 'text',
        name: 'Cinematography Credits',
        parentContainerId: 'vs-credits-box',
        style: {
          x: 45,
          y: 640,
          width: 300,
          height: 40,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: '#d4af37cc',
          textAlign: 'center',
          lineHeight: 1.4
        },
        content: { text: 'Directed by Golden Hour Cinema\nSoundtrack: “Bloom” by The Paper Kites' },
        animation: { type: 'fadeIn', duration: 0.8, delay: 0.6 }
      }
    ]
  }
};

export const mediaTemplates: PageTemplate[] = [
  photoGalleryTemplate,
  imageCollageTemplate,
  videoSectionTemplate
];

export const mediaBlocks: PrebuiltBlock[] = [
  {
    id: 'block-media-gallery',
    name: 'Photo Gallery Block',
    category: 'media',
    subcategory: 'Gallery',
    description: 'Multi-photo 2-column grid with lightbox photo viewer capability.',
    icon: 'ImageIcon',
    thumbnail: photoGalleryTemplate.thumbnail,
    suggestedHeight: 844,
    elements: photoGalleryTemplate.page.elements
  },
  {
    id: 'block-media-collage',
    name: 'Image Collage Block',
    category: 'media',
    subcategory: 'Collage',
    description: 'Artistic editorial polaroid collage with tilted photo frames.',
    icon: 'Layers',
    thumbnail: imageCollageTemplate.thumbnail,
    suggestedHeight: 844,
    elements: imageCollageTemplate.page.elements
  },
  {
    id: 'block-media-video',
    name: 'Video Section Block',
    category: 'media',
    subcategory: 'Video',
    description: 'Cinematic video player with custom poster thumbnail and credits.',
    icon: 'Video',
    thumbnail: videoSectionTemplate.thumbnail,
    suggestedHeight: 844,
    elements: videoSectionTemplate.page.elements
  }
];
