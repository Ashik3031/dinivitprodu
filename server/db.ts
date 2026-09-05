import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Invitation, InvitationPage, RSVPResponse, GuestbookMessage, InvitationTemplate, MediaAsset } from '../src/types';
import { INITIAL_TEMPLATES, createInvitationFromTemplate, createBlankInvitation } from '../src/data/initialTemplates';
import { DEFAULT_PUBLIC_ASSETS } from '../src/data/stockFramesAndStickers';

export function hashPassword(plainText: string): string {
  if (!plainText) return '';
  return bcrypt.hashSync(plainText.trim(), 10);
}

export function comparePassword(plainText: string, storedHash: string): boolean {
  if (!plainText || !storedHash) return false;
  const cleanPass = plainText.trim();
  // If stored as bcrypt hash
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    try {
      return bcrypt.compareSync(cleanPass, storedHash);
    } catch (e) {
      return false;
    }
  }
  // Plaintext match for initial seeds / demo
  return cleanPass === storedHash;
}

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  invitations: Invitation[];
  templates: InvitationTemplate[];
  rsvps: RSVPResponse[];
  guestbook: GuestbookMessage[];
  media: MediaAsset[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db: DatabaseSchema = {
  users: [],
  invitations: [],
  templates: [],
  rsvps: [],
  guestbook: [],
  media: []
};

// Seed initial data
function seedInitialData(): DatabaseSchema {
  const initialUsers: (User & { passwordHash: string })[] = [
    {
      id: 'usr-admin-1',
      username: 'admin',
      passwordHash: 'admin123',
      businessName: 'Global Invitation Systems (HQ)',
      ownerName: 'System Administrator',
      email: 'admin@invitationstudio.com',
      phone: '+1 (555) 019-2834',
      role: 'admin',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr-biz-royal',
      username: 'royal_prints',
      passwordHash: 'royal123',
      businessName: 'Royal Vows Luxury Invitation Cards',
      ownerName: 'Arthur Pendelton',
      email: 'arthur@royalvows.com',
      phone: '+1 (555) 342-9988',
      role: 'business',
      isActive: true,
      createdAt: '2026-02-10T10:00:00.000Z',
      lastLogin: new Date().toISOString(),
      brandColor: '#d4af37'
    },
    {
      id: 'usr-biz-elegance',
      username: 'elegance_studio',
      passwordHash: 'elegance123',
      businessName: 'Elegance Digital Invitations',
      ownerName: 'Claire Montgomery',
      email: 'claire@elegancestudio.design',
      phone: '+1 (555) 887-4122',
      role: 'business',
      isActive: true,
      createdAt: '2026-03-01T14:30:00.000Z',
      lastLogin: new Date().toISOString(),
      brandColor: '#4a6741'
    }
  ];

  // Seed sample invitations
  const sampleInv1 = createInvitationFromTemplate(
    INITIAL_TEMPLATES[0],
    'usr-biz-royal',
    'Rahul & Priya Wedding Celebration'
  );
  sampleInv1.slug = 'rahul-priya-wedding';
  sampleInv1.status = 'published';
  sampleInv1.viewsCount = 384;
  sampleInv1.eventDate = 'December 2026';
  sampleInv1.customerName = 'Rahul & Priya';
  sampleInv1.openingScreen = {
    enabled: true,
    style: 'envelope',
    title: 'Wedding Invitation',
    coupleNames: 'Rahul & Priya',
    subtitle: 'December 2026',
    openButtonText: 'Open Invitation',
    sealText: 'R&P',
    envelopeColor: '#0e261d',
    sealColor: '#d4af37'
  };

  const sampleInv2 = createInvitationFromTemplate(
    INITIAL_TEMPLATES[1],
    'usr-biz-elegance',
    'Liam & Olivia Botanical Save the Date'
  );
  sampleInv2.slug = 'liam-olivia-save-the-date';
  sampleInv2.status = 'published';
  sampleInv2.viewsCount = 89;

  const sampleInv3 = createInvitationFromTemplate(
    INITIAL_TEMPLATES[2],
    'usr-biz-royal',
    'Victoria 30th Birthday Gala VIP'
  );
  sampleInv3.slug = 'victoria-30th-birthday-gala';
  sampleInv3.status = 'published';
  sampleInv3.viewsCount = 56;

  const sampleInv4 = createInvitationFromTemplate(
    INITIAL_TEMPLATES[0],
    'usr-biz-royal',
    'Alexander & Sophia Grand Wedding'
  );
  sampleInv4.slug = 'alexander-sophia-wedding';
  sampleInv4.status = 'published';
  sampleInv4.viewsCount = 142;

  // Sample RSVPs
  const sampleRsvps: RSVPResponse[] = [
    {
      id: 'rsvp-1',
      invitationId: sampleInv1.id,
      guestName: 'Eleanor Vance',
      guestEmail: 'eleanor.vance@example.com',
      guestPhone: '+1 555-432-1100',
      attendance: 'attending',
      guestCount: 2,
      dietaryPreferences: 'Vegetarian, Gluten-Free',
      message: 'So thrilled to celebrate with you both in North Carolina!',
      submittedAt: '2026-08-20T14:22:00.000Z'
    },
    {
      id: 'rsvp-2',
      invitationId: sampleInv1.id,
      guestName: 'Marcus Holloway',
      guestEmail: 'marcus.h@example.com',
      guestPhone: '+1 555-901-3322',
      attendance: 'attending',
      guestCount: 1,
      dietaryPreferences: 'None',
      message: 'Looking forward to the royal banquet and dancing!',
      submittedAt: '2026-08-22T09:15:00.000Z'
    },
    {
      id: 'rsvp-3',
      invitationId: sampleInv1.id,
      guestName: 'Gwendolyn Croft',
      guestEmail: 'gwen.c@example.com',
      guestPhone: '+1 555-882-7711',
      attendance: 'not_attending',
      guestCount: 0,
      message: 'Sending you all my love and blessings from London!',
      submittedAt: '2026-08-23T18:40:00.000Z'
    }
  ];

  // Sample Guestbook messages
  const sampleGuestbook: GuestbookMessage[] = [
    {
      id: 'gb-1',
      invitationId: sampleInv1.id,
      senderName: 'The Sterling Family',
      relationship: 'Family',
      message: 'Wishing Alexander and Sophia a lifetime of radiant joy, harmony, and cherished memories together!',
      isApproved: true,
      createdAt: '2026-08-21T11:00:00.000Z'
    },
    {
      id: 'gb-2',
      invitationId: sampleInv1.id,
      senderName: 'David & Catherine Ross',
      relationship: 'Close Friends',
      message: 'The digital invitation is absolutely breathtaking! Can\'t wait for the grand celebration in October.',
      isApproved: true,
      createdAt: '2026-08-24T16:30:00.000Z'
    }
  ];

  // Sample Initial Media Assets (Images, Videos, Audio)
  const sampleMedia: MediaAsset[] = [
    {
      id: 'med-img-1',
      businessId: 'usr-biz-royal',
      invitationId: sampleInv1.id,
      invitationIds: [sampleInv1.id],
      title: 'Romantic Couple Golden Hour',
      name: 'couple_golden_hour.jpg',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
      type: 'image',
      format: 'jpg',
      size: 428000,
      dimensions: { width: 1200, height: 800 },
      category: 'wedding',
      tags: ['couple', 'portrait', 'golden hour', 'wedding'],
      createdAt: '2026-08-15T10:00:00.000Z'
    },
    {
      id: 'med-img-2',
      businessId: 'usr-biz-royal',
      invitationId: sampleInv1.id,
      invitationIds: [sampleInv1.id, sampleInv2.id],
      title: 'Diamond Wedding Rings Velvet',
      name: 'rings_macro_velvet.png',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80',
      type: 'image',
      format: 'png',
      size: 612000,
      dimensions: { width: 1200, height: 800 },
      category: 'wedding',
      tags: ['rings', 'jewelry', 'velvet'],
      createdAt: '2026-08-16T11:20:00.000Z'
    },
    {
      id: 'med-img-3',
      businessId: 'usr-biz-elegance',
      invitationId: sampleInv2.id,
      invitationIds: [sampleInv2.id],
      title: 'Botanical Eucalyptus & White Roses',
      name: 'eucalyptus_bouquet.webp',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
      type: 'image',
      format: 'webp',
      size: 295000,
      dimensions: { width: 1200, height: 900 },
      category: 'floral',
      tags: ['botanical', 'roses', 'foliage'],
      createdAt: '2026-08-18T14:10:00.000Z'
    },
    {
      id: 'med-img-4',
      businessId: 'usr-biz-royal',
      invitationId: sampleInv3.id,
      invitationIds: [sampleInv3.id],
      title: 'Luxury Gold Ballroom Chandelier',
      name: 'ballroom_chandelier.jpg',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80',
      type: 'image',
      format: 'jpg',
      size: 512000,
      dimensions: { width: 1200, height: 800 },
      category: 'venue',
      tags: ['gala', 'ballroom', 'chandelier', 'gold'],
      createdAt: '2026-08-19T09:30:00.000Z'
    },
    {
      id: 'med-vid-1',
      businessId: 'usr-biz-royal',
      invitationId: sampleInv1.id,
      invitationIds: [sampleInv1.id, sampleInv3.id],
      title: 'Golden Particle Bokeh Lights',
      name: 'golden_bokeh_particles.mp4',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
      type: 'video',
      format: 'mp4',
      size: 3420000,
      dimensions: { width: 1920, height: 1080 },
      duration: 15,
      category: 'background',
      tags: ['video', 'bokeh', 'gold', 'sparkles'],
      createdAt: '2026-08-20T16:00:00.000Z'
    },
    {
      id: 'med-vid-2',
      businessId: 'usr-biz-elegance',
      invitationId: sampleInv2.id,
      invitationIds: [sampleInv2.id],
      title: 'Wedding Rings in Velvet Box Cinematic',
      name: 'wedding_rings_box.mp4',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-in-a-box-41589-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80',
      type: 'video',
      format: 'mp4',
      size: 4190000,
      dimensions: { width: 1920, height: 1080 },
      duration: 18,
      category: 'cinematic',
      tags: ['video', 'rings', 'cinematic'],
      createdAt: '2026-08-21T12:00:00.000Z'
    },
    {
      id: 'med-aud-1',
      businessId: 'usr-biz-royal',
      invitationId: sampleInv1.id,
      invitationIds: [sampleInv1.id, sampleInv2.id],
      title: 'Romantic Wedding Symphony (Acoustic Strings)',
      name: 'romantic_wedding_symphony.mp3',
      url: 'https://cdn.freesound.org/previews/467/467269_4939433-lq.mp3',
      type: 'audio',
      format: 'mp3',
      size: 1850000,
      duration: 124,
      category: 'classical',
      tags: ['audio', 'symphony', 'strings', 'wedding music'],
      createdAt: '2026-08-22T08:00:00.000Z'
    },
    {
      id: 'med-aud-2',
      businessId: 'usr-biz-elegance',
      invitationId: sampleInv2.id,
      invitationIds: [sampleInv2.id],
      title: 'Acoustic Guitar Love Ballad',
      name: 'acoustic_love_ballad.mp3',
      url: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3',
      type: 'audio',
      format: 'mp3',
      size: 1420000,
      duration: 98,
      category: 'acoustic',
      tags: ['audio', 'guitar', 'romantic', 'soft'],
      createdAt: '2026-08-23T11:00:00.000Z'
    }
  ];

  return {
    users: initialUsers,
    invitations: [sampleInv1, sampleInv2, sampleInv3, sampleInv4],
    templates: INITIAL_TEMPLATES,
    rsvps: sampleRsvps,
    guestbook: sampleGuestbook,
    media: sampleMedia
  };
}

export function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(data);
      // Ensure templates are present
      if (!db.templates || db.templates.length === 0) {
        db.templates = INITIAL_TEMPLATES.map(t => ({ ...t, isPublic: true }));
      } else {
        // Ensure every template has an explicit isPublic flag
        db.templates = db.templates.map(t => ({
          ...t,
          isPublic: t.isPublic !== false
        }));
      }

      // Ensure public assets (frames, stickers) exist in db.media
      if (!db.media) db.media = [];
      for (const asset of DEFAULT_PUBLIC_ASSETS) {
        if (!db.media.some(m => m.id === asset.id)) {
          db.media.push({
            id: asset.id,
            businessId: 'admin',
            title: asset.title,
            name: asset.name,
            url: asset.url,
            thumbnailUrl: asset.thumbnailUrl || asset.url,
            type: asset.type as any,
            format: 'svg',
            size: 15000,
            dimensions: asset.dimensions || { width: 400, height: 600 },
            category: asset.category,
            tags: asset.tags,
            isPublic: true,
            createdAt: new Date().toISOString()
          });
        }
      }

      // Ensure rahul-priya-wedding exists
      if (!db.invitations.some(i => i.slug === 'rahul-priya-wedding')) {
        const seeded = seedInitialData();
        const rahulPriya = seeded.invitations.find(i => i.slug === 'rahul-priya-wedding');
        if (rahulPriya) {
          db.invitations.unshift(rahulPriya);
          saveDatabase();
        }
      }
      return db;
    }
  } catch (err) {
    console.error('Error loading DB file, re-seeding:', err);
  }

  db = seedInitialData();
  saveDatabase();
  return db;
}

export function saveDatabase(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

// Initial load
loadDatabase();

export const dbService = {
  // Users
  getUsers: () => {
    loadDatabase();
    return db.users.map(({ passwordHash, ...user }) => user);
  },
  getUserById: (id: string) => {
    loadDatabase();
    const user = db.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },
  getUserWithAuth: (username: string) => {
    loadDatabase();
    if (!username) return null;
    const clean = username.trim().toLowerCase();
    const stripped = clean.replace(/[-_\s]/g, '');

    return db.users.find(u => {
      const uClean = u.username.toLowerCase();
      const uStripped = uClean.replace(/[-_\s]/g, '');
      const emailClean = (u.email || '').toLowerCase();

      if (uClean === clean || uStripped === stripped || emailClean === clean) {
        return true;
      }
      if ((clean === 'admin' || clean === 'administrator') && u.role === 'admin') {
        return true;
      }
      if (
        (clean === 'royalprints' || clean === 'royal_prints' || clean === 'royal' || clean === 'business' || clean === 'business_owner') &&
        (u.id === 'usr-biz-royal' || u.username.includes('royal'))
      ) {
        return true;
      }
      return false;
    }) || null;
  },
  createUser: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    loadDatabase();
    const existing = db.users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
    if (existing) {
      throw new Error('Username already exists. Please choose a different username.');
    }
    const newUser: User & { passwordHash: string } = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: userData.username.trim(),
      passwordHash: hashPassword(userData.password),
      businessName: userData.businessName,
      ownerName: userData.ownerName,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'business',
      isActive: userData.isActive !== false,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDatabase();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  },
  updateUser: (id: string, updates: Partial<User & { password?: string }>) => {
    loadDatabase();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    const currentUser = db.users[index];
    if (updates.username && updates.username !== currentUser.username) {
      const duplicate = db.users.find(u => u.id !== id && u.username.toLowerCase() === updates.username!.toLowerCase());
      if (duplicate) throw new Error('Username already taken by another account');
    }

    const { password, ...otherUpdates } = updates;
    const updatedUser = {
      ...currentUser,
      ...otherUpdates,
      ...(password ? { passwordHash: hashPassword(password) } : {})
    };

    db.users[index] = updatedUser;
    saveDatabase();
    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
  },
  deleteUser: (id: string) => {
    loadDatabase();
    const user = db.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Cannot delete super administrator account');

    db.users = db.users.filter(u => u.id !== id);
    // Also remove invitations owned by this user
    db.invitations = db.invitations.filter(i => i.businessId !== id);
    saveDatabase();
    return { success: true };
  },

  // Invitations
  getInvitations: (businessId?: string, role?: string) => {
    loadDatabase();
    if (role === 'admin' && !businessId) {
      return db.invitations;
    }
    return db.invitations.filter(i => i.businessId === businessId);
  },
  getInvitationById: (id: string) => {
    loadDatabase();
    return db.invitations.find(i => i.id === id) || null;
  },
  getInvitationBySlug: (slug: string) => {
    loadDatabase();
    const invitation = db.invitations.find(i => i.slug.toLowerCase() === slug.toLowerCase());
    if (invitation) {
      // Increment views count
      invitation.viewsCount = (invitation.viewsCount || 0) + 1;
      saveDatabase();
    }
    return invitation || null;
  },
  createInvitation: (invitationData: Partial<Invitation> & { businessId: string; title: string }) => {
    loadDatabase();
    const timestamp = new Date().toISOString();
    const baseSlug = (invitationData.slug || invitationData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let uniqueSlug = baseSlug || 'invitation';
    let counter = 1;
    while (db.invitations.some(i => i.slug.toLowerCase() === uniqueSlug.toLowerCase())) {
      uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      counter++;
      if (counter > 10) break;
    }

    const defaultBlankPage: InvitationPage = {
      id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: 'Section 1',
      order: 0,
      heightMode: 'viewport',
      height: 844,
      isFullHeight: true,
      background: {
        type: 'color',
        color: '#071912'
      },
      elements: []
    };

    const newInv: Invitation = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      businessId: invitationData.businessId,
      title: invitationData.title,
      customerName: invitationData.customerName || '',
      eventDate: invitationData.eventDate || '',
      eventType: (invitationData.eventType || invitationData.category || 'wedding') as any,
      slug: uniqueSlug,
      category: (invitationData.category || invitationData.eventType || 'wedding') as any,
      status: invitationData.status || 'draft',
      thumbnail: invitationData.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      theme: invitationData.theme || {
        primaryColor: '#d4af37',
        secondaryColor: '#0a3d2c',
        accentColor: '#f9f6ee',
        fontHeading: "'Cinzel', serif",
        fontBody: "'Montserrat', sans-serif",
        fontScript: "'Great Vibes', cursive",
        backgroundColor: '#0c1b15'
      },
      openingScreen: invitationData.openingScreen || {
        enabled: false,
        style: 'envelope',
        title: invitationData.title || 'Wedding Invitation',
        openButtonText: 'Open Invitation',
        envelopeColor: '#071811',
        sealColor: '#d4af37',
        musicAutoplayOnOpen: false
      },
      music: invitationData.music || {
        enabled: false,
        audioUrl: '',
        title: 'No Music Selected',
        artist: '',
        autoPlay: false,
        loop: true,
        floatingBadge: false
      },
      pages: invitationData.pages && invitationData.pages.length > 0 ? invitationData.pages : [defaultBlankPage],
      settings: invitationData.settings || {
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

    db.invitations.push(newInv);
    saveDatabase();
    return newInv;
  },
  updateInvitation: (id: string, updates: Partial<Invitation>) => {
    loadDatabase();
    const index = db.invitations.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Invitation not found');

    if (updates.slug && updates.slug !== db.invitations[index].slug) {
      const formattedSlug = updates.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
      const conflict = db.invitations.find(i => i.id !== id && i.slug.toLowerCase() === formattedSlug);
      if (conflict) throw new Error('This URL slug is already taken. Please choose another.');
      updates.slug = formattedSlug;
    }

    const updated = {
      ...db.invitations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.invitations[index] = updated;
    saveDatabase();
    return updated;
  },
  deleteInvitation: (id: string) => {
    loadDatabase();
    db.invitations = db.invitations.filter(i => i.id !== id);
    db.rsvps = db.rsvps.filter(r => r.invitationId !== id);
    db.guestbook = db.guestbook.filter(g => g.invitationId !== id);
    saveDatabase();
    return { success: true };
  },
  duplicateInvitation: (id: string, businessId: string) => {
    loadDatabase();
    const original = db.invitations.find(i => i.id === id);
    if (!original) throw new Error('Invitation not found');

    const copy = JSON.parse(JSON.stringify(original)) as Invitation;
    copy.id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    copy.businessId = businessId;
    copy.title = `${original.title} (Copy)`;
    copy.slug = `${original.slug}-copy-${Math.random().toString(36).substring(2, 5)}`;
    copy.status = 'draft';
    copy.viewsCount = 0;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();

    db.invitations.push(copy);
    saveDatabase();
    return copy;
  },

  // Templates Management
  getTemplates: (params: { category?: string; search?: string; all?: boolean } = {}) => {
    loadDatabase();
    let list = db.templates || [];

    // Filter by publish status: if not requesting all (admin view), show only published templates
    if (!params.all) {
      list = list.filter(t => t.isPublic !== false);
    }

    // Filter by category
    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase().trim();
      list = list.filter(t => (t.category || '').toLowerCase() === cat);
    }

    // Search query
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    return list;
  },

  getTemplateById: (id: string) => {
    loadDatabase();
    const template = (db.templates || []).find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    return template;
  },

  createTemplate: (templateData: Partial<InvitationTemplate>) => {
    loadDatabase();
    if (!db.templates) db.templates = [];

    const now = new Date().toISOString();
    const newTemplate: InvitationTemplate = {
      id: templateData.id || `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: templateData.title || 'Untitled Template',
      category: templateData.category || 'wedding',
      description: templateData.description || 'Custom crafted invitation template.',
      thumbnail: templateData.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      isPremium: Boolean(templateData.isPremium),
      isPublic: templateData.isPublic !== false, // default to published
      tags: templateData.tags || [templateData.category || 'wedding', 'custom'],
      theme: templateData.theme || {
        primaryColor: '#d4af37',
        secondaryColor: '#1a3628',
        accentColor: '#f3e5ab',
        fontHeading: "'Cinzel', serif",
        fontBody: "'Montserrat', sans-serif",
        fontScript: "'Great Vibes', cursive",
        backgroundColor: '#071912'
      },
      openingScreen: templateData.openingScreen || {
        enabled: true,
        style: 'envelope',
        title: 'Save the Date',
        subtitle: 'Formal Invitation to Follow',
        coupleNames: 'Sarah & William',
        openButtonText: 'Open Invitation',
        sealColor: '#d4af37',
        envelopeColor: '#122e23',
        musicAutoplayOnOpen: true
      },
      music: templateData.music || {
        enabled: true,
        audioUrl: 'https://cdn.freesound.org/previews/467/467269_4939433-lq.mp3',
        title: 'Romantic Strings Prelude',
        artist: 'Studio Symphony',
        autoPlay: true,
        loop: true,
        floatingBadge: true
      },
      pages: templateData.pages && templateData.pages.length > 0 ? templateData.pages : [
        {
          id: `page-${Date.now()}-1`,
          name: 'Front Cover & Details',
          order: 0,
          height: 844,
          isFullHeight: true,
          background: {
            type: 'color',
            color: templateData.theme?.backgroundColor || '#071912'
          },
          elements: [
            {
              id: `el-hdr-${Date.now()}`,
              type: 'heading',
              name: 'Template Title',
              style: {
                x: 20,
                y: 140,
                width: 350,
                height: 60,
                fontFamily: templateData.theme?.fontHeading || "'Cinzel', serif",
                fontSize: 28,
                fontWeight: 700,
                color: templateData.theme?.primaryColor || '#d4af37',
                textAlign: 'center'
              },
              content: { text: templateData.title || 'Together With Our Families' }
            },
            {
              id: `el-sub-${Date.now()}`,
              type: 'text',
              name: 'Subtitle',
              style: {
                x: 30,
                y: 220,
                width: 330,
                height: 40,
                fontFamily: templateData.theme?.fontBody || "'Montserrat', sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: '#ffffffcc',
                textAlign: 'center'
              },
              content: { text: 'Request the pleasure of your company at the celebration of their love' }
            }
          ]
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    db.templates.push(newTemplate);
    saveDatabase();
    return newTemplate;
  },

  updateTemplate: (id: string, updates: Partial<InvitationTemplate>) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const index = db.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');

    const updated: InvitationTemplate = {
      ...db.templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    db.templates[index] = updated;
    saveDatabase();
    return updated;
  },

  deleteTemplate: (id: string) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const index = db.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');

    db.templates.splice(index, 1);
    saveDatabase();
    return { success: true, id };
  },

  toggleTemplatePublish: (id: string, isPublic: boolean) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const index = db.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');

    db.templates[index].isPublic = isPublic;
    db.templates[index].updatedAt = new Date().toISOString();
    saveDatabase();
    return db.templates[index];
  },

  duplicateTemplate: (id: string) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const original = db.templates.find(t => t.id === id);
    if (!original) throw new Error('Template not found');

    const now = new Date().toISOString();
    const copy: InvitationTemplate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${original.title} (Copy)`,
      isPublic: false, // Default copy to draft
      createdAt: now,
      updatedAt: now
    };

    db.templates.push(copy);
    saveDatabase();
    return copy;
  },

  saveAsTemplate: (invitationId: string, templateData: { title: string; category: string; description: string; isPublic?: boolean }) => {
    loadDatabase();
    const inv = db.invitations.find(i => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    const now = new Date().toISOString();
    const newTemplate: InvitationTemplate = {
      id: `tmpl-${Date.now()}`,
      title: templateData.title,
      category: templateData.category || inv.category,
      description: templateData.description,
      thumbnail: inv.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      isPublic: templateData.isPublic !== false,
      theme: JSON.parse(JSON.stringify(inv.theme)),
      openingScreen: JSON.parse(JSON.stringify(inv.openingScreen)),
      music: JSON.parse(JSON.stringify(inv.music)),
      pages: JSON.parse(JSON.stringify(inv.pages)),
      createdAt: now,
      updatedAt: now
    };

    db.templates.push(newTemplate);
    saveDatabase();
    return newTemplate;
  },

  // RSVPs
  getRSVPsByInvitation: (invitationId: string) => {
    loadDatabase();
    return db.rsvps.filter(r => r.invitationId === invitationId);
  },
  submitRSVP: (rsvpData: Omit<RSVPResponse, 'id' | 'submittedAt'>) => {
    loadDatabase();
    const newRSVP: RSVPResponse = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...rsvpData,
      submittedAt: new Date().toISOString()
    };
    db.rsvps.push(newRSVP);
    saveDatabase();
    return newRSVP;
  },
  deleteRSVP: (id: string) => {
    loadDatabase();
    db.rsvps = db.rsvps.filter(r => r.id !== id);
    saveDatabase();
    return { success: true };
  },

  // Guestbook
  getGuestbookByInvitation: (invitationId: string) => {
    loadDatabase();
    return db.guestbook.filter(g => g.invitationId === invitationId);
  },
  addGuestbookMessage: (messageData: Omit<GuestbookMessage, 'id' | 'createdAt'>) => {
    loadDatabase();
    const newMsg: GuestbookMessage = {
      id: `gb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...messageData,
      createdAt: new Date().toISOString()
    };
    db.guestbook.push(newMsg);
    saveDatabase();
    return newMsg;
  },
  deleteGuestbookMessage: (id: string) => {
    loadDatabase();
    db.guestbook = db.guestbook.filter(g => g.id !== id);
    saveDatabase();
    return { success: true };
  },

  // Stats
  getSystemStats: () => {
    loadDatabase();
    const businesses = db.users.filter(u => u.role !== 'admin');
    const totalBusinesses = businesses.length;
    const activeBusinesses = businesses.filter(u => u.isActive).length;
    const inactiveBusinesses = totalBusinesses - activeBusinesses;
    const totalInvitations = db.invitations.length;
    const publishedInvitations = db.invitations.filter(i => i.status === 'published').length;
    const draftInvitations = db.invitations.filter(i => i.status === 'draft').length;
    const totalRSVPs = db.rsvps.length;
    const totalGuestbookMessages = db.guestbook.length;
    const totalViews = db.invitations.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
    const totalMedia = db.media ? db.media.length : 0;
    const storageUsedBytes = (db.media || []).reduce((acc, curr) => acc + (curr.size || 0), 0);

    return {
      totalBusinesses,
      activeBusinesses,
      inactiveBusinesses,
      totalUsers: db.users.length,
      activeUsers: db.users.filter(u => u.isActive).length,
      totalInvitations,
      publishedInvitations,
      draftInvitations,
      totalRSVPs,
      totalGuestbookMessages,
      totalViews,
      totalMedia,
      storageUsedBytes
    };
  },

  // Media Library
  getMedia: (params: {
    businessId?: string;
    invitationId?: string;
    type?: string;
    search?: string;
    category?: string;
    isPublic?: boolean | string;
    scope?: string;
  } = {}) => {
    loadDatabase();
    let list = db.media || [];

    // Filter by public or business
    if (params.isPublic === true || params.isPublic === 'true' || params.scope === 'public') {
      list = list.filter(m => m.isPublic);
    } else if (params.businessId && params.businessId !== 'all') {
      if (params.scope === 'all') {
        list = list.filter(m => m.businessId === params.businessId || m.isPublic);
      } else {
        list = list.filter(m => m.businessId === params.businessId);
      }
    }

    // Filter by invitation if provided and not requested 'all'
    if (params.invitationId && params.invitationId !== 'all' && params.scope !== 'public') {
      list = list.filter(m => 
        m.invitationId === params.invitationId || 
        (m.invitationIds && m.invitationIds.includes(params.invitationId!)) ||
        m.isPublic
      );
    }

    // Filter by media type
    if (params.type && params.type !== 'all') {
      list = list.filter(m => m.type === params.type);
    }

    // Filter by category
    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase().trim();
      list = list.filter(m => (m.category || '').toLowerCase() === cat);
    }

    // Search query by title, name, or tags
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(m => 
        m.title.toLowerCase().includes(q) ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q))) ||
        (m.category && m.category.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createMedia: (mediaData: Omit<MediaAsset, 'id' | 'createdAt'>) => {
    loadDatabase();
    if (!db.media) db.media = [];

    const newMedia: MediaAsset = {
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...mediaData,
      invitationIds: mediaData.invitationIds || (mediaData.invitationId ? [mediaData.invitationId] : []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.media.push(newMedia);
    saveDatabase();
    return newMedia;
  },

  updateMedia: (id: string, updates: Partial<MediaAsset>) => {
    loadDatabase();
    if (!db.media) db.media = [];
    const index = db.media.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Media asset not found');

    const updated: MediaAsset = {
      ...db.media[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    db.media[index] = updated;
    saveDatabase();
    return updated;
  },

  deleteMedia: (id: string) => {
    loadDatabase();
    if (!db.media) db.media = [];
    db.media = db.media.filter(m => m.id !== id);
    saveDatabase();
    return { success: true };
  },

  linkMediaToInvitation: (mediaId: string, invitationId: string) => {
    loadDatabase();
    if (!db.media) db.media = [];
    const item = db.media.find(m => m.id === mediaId);
    if (!item) throw new Error('Media asset not found');

    const currentIds = item.invitationIds || (item.invitationId ? [item.invitationId] : []);
    if (!currentIds.includes(invitationId)) {
      currentIds.push(invitationId);
    }
    item.invitationIds = currentIds;
    item.updatedAt = new Date().toISOString();

    saveDatabase();
    return item;
  },

  getMediaStats: (businessId?: string) => {
    loadDatabase();
    let list = db.media || [];
    if (businessId) {
      list = list.filter(m => m.businessId === businessId);
    }

    const totalCount = list.length;
    const imagesCount = list.filter(m => m.type === 'image').length;
    const videosCount = list.filter(m => m.type === 'video').length;
    const audioCount = list.filter(m => m.type === 'audio').length;
    const totalBytes = list.reduce((acc, curr) => acc + (curr.size || 0), 0);

    return {
      totalCount,
      imagesCount,
      videosCount,
      audioCount,
      totalBytes
    };
  }
};
