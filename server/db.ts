import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { MongoClient, Db } from 'mongodb';
import { User, Invitation, InvitationPage, RSVPResponse, GuestbookMessage, InvitationTemplate, MediaAsset, PrebuiltBlock, BackgroundCollection } from '../src/types';
import { DEFAULT_PUBLIC_ASSETS } from '../src/data/stockFramesAndStickers';
import { STOCK_ASSETS } from '../src/data/stockAssets';

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
  // Plaintext match for default credentials / demo accounts
  return cleanPass === storedHash;
}

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  invitations: Invitation[];
  templates: InvitationTemplate[];
  blocks: PrebuiltBlock[];
  rsvps: RSVPResponse[];
  guestbook: GuestbookMessage[];
  media: MediaAsset[];
  backgroundCollections: BackgroundCollection[];
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
  blocks: [],
  rsvps: [],
  guestbook: [],
  media: [],
  backgroundCollections: []
};

// Initial clean database state (no seeded invitations, blocks, templates, rsvps, or guestbook)
function createEmptyDatabase(): DatabaseSchema {
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

  return {
    users: initialUsers,
    invitations: [],
    templates: [],
    blocks: [],
    rsvps: [],
    guestbook: [],
    media: [],
    backgroundCollections: []
  };
}

let lastDbMtime = 0;

export function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const stats = fs.statSync(DATA_FILE);
      if (stats.mtimeMs === lastDbMtime && db && db.users && db.users.length > 0) {
        return db;
      }
      lastDbMtime = stats.mtimeMs;
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(data);
      if (!db.templates) db.templates = [];
      if (!db.blocks) db.blocks = [];

      // Ensure public assets (frames, stickers, gifs, videos) exist in db.media
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
            format: asset.type === 'gif' ? 'gif' : asset.type === 'video' ? 'mp4' : 'svg',
            size: asset.type === 'video' ? 3500000 : (asset.type === 'gif' ? 1200000 : 15000),
            dimensions: asset.dimensions || { width: 400, height: 600 },
            duration: (asset as any).duration,
            category: asset.category,
            tags: asset.tags,
            isPublic: true,
            isSuperAdmin: true,
            authorRole: 'superadmin',
            createdAt: new Date().toISOString()
          });
        }
      }

      // Ensure stock library assets (backgrounds, photos, patterns, textures) exist in db.media
      for (const asset of STOCK_ASSETS) {
        const existing = db.media.find(m => m.id === asset.id);
        if (!existing) {
          db.media.push({
            id: asset.id,
            businessId: 'admin',
            title: asset.name,
            name: asset.name,
            url: asset.url,
            thumbnailUrl: asset.thumbnail || asset.url,
            type: asset.type as any,
            format: 'jpg',
            size: 450000,
            dimensions: { width: 1200, height: 800 },
            category: asset.category,
            tags: asset.tags,
            isPublic: true,
            isSuperAdmin: true,
            authorRole: 'superadmin',
            createdAt: new Date().toISOString()
          });
        } else {
          existing.category = asset.category;
          existing.tags = asset.tags;
        }
      }

      // Ensure Background Collections list exists and sanitize each entry
      if (!db.backgroundCollections) {
        db.backgroundCollections = [];
      }

      // Filter out any completely corrupt entries that have no id or name
      db.backgroundCollections = db.backgroundCollections.filter(c => c && c.id);
      for (const col of db.backgroundCollections) {
        if (!col.name) col.name = 'Custom Collection';
        if (!col.slug) col.slug = col.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!Array.isArray(col.backgroundAssetIds)) col.backgroundAssetIds = [];
        if (typeof col.isPublished !== 'boolean') col.isPublished = true;
      }

      if (db.backgroundCollections.length === 0) {
        const bgAssets = db.media.filter(m =>
          m.type === 'background' ||
          (m.category || '').toLowerCase().includes('background') ||
          (m.tags || []).some(t => t.toLowerCase().includes('background'))
        );

        const findAssetIds = (keywords: string[]) => {
          return bgAssets
            .filter(a => {
              const text = `${a.title} ${a.name} ${a.category} ${(a.tags || []).join(' ')}`.toLowerCase();
              return keywords.some(k => text.includes(k.toLowerCase()));
            })
            .map(a => a.id);
        };

        const royalIds = findAssetIds(['gold', 'silk', 'luxury', 'bokeh', 'navy']);
        const pastelIds = findAssetIds(['pastel', 'rose', 'blush', 'pink']);
        const floralIds = findAssetIds(['botanical', 'sage', 'floral', 'watercolor']);
        const minimalIds = findAssetIds(['stone', 'arch', 'minimalist', 'silk', 'ivory']);

        const now = new Date().toISOString();
        const initialCollections: BackgroundCollection[] = [
          {
            id: 'bgc-royal-luxury',
            name: 'Royal Luxury',
            slug: 'royal-luxury',
            description: 'Opulent gold foil, silk drapes, warm bokeh, and imperial textures for majestic wedding stationery.',
            coverAssetId: royalIds[0] || bgAssets[0]?.id,
            coverAssetUrl: bgAssets.find(a => a.id === (royalIds[0] || bgAssets[0]?.id))?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
            backgroundAssetIds: royalIds.length > 0 ? royalIds : bgAssets.slice(0, 4).map(a => a.id),
            isPublished: true,
            displayOrder: 1,
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          },
          {
            id: 'bgc-pastel-romance',
            name: 'Pastel Romance',
            slug: 'pastel-romance',
            description: 'Delicate blush pinks, gentle rose gold shimmers, and dreamy ethereal washes for romantic celebrations.',
            coverAssetId: pastelIds[0] || bgAssets[1]?.id,
            coverAssetUrl: bgAssets.find(a => a.id === (pastelIds[0] || bgAssets[1]?.id))?.url || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
            backgroundAssetIds: pastelIds.length > 0 ? pastelIds : bgAssets.slice(1, 5).map(a => a.id),
            isPublished: true,
            displayOrder: 2,
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          },
          {
            id: 'bgc-floral-elegance',
            name: 'Floral Elegance',
            slug: 'floral-elegance',
            description: 'Hand-painted watercolor greenery, sage botanical motifs, and organic garden warmth.',
            coverAssetId: floralIds[0] || bgAssets[2]?.id,
            coverAssetUrl: bgAssets.find(a => a.id === (floralIds[0] || bgAssets[2]?.id))?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
            backgroundAssetIds: floralIds.length > 0 ? floralIds : bgAssets.slice(2, 6).map(a => a.id),
            isPublished: true,
            displayOrder: 3,
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          },
          {
            id: 'bgc-minimal-luxury',
            name: 'Minimal Luxury',
            slug: 'minimal-luxury',
            description: 'Understated sandstone arches, architectural backdrops, and modern organic aesthetics.',
            coverAssetId: minimalIds[0] || bgAssets[3]?.id,
            coverAssetUrl: bgAssets.find(a => a.id === (minimalIds[0] || bgAssets[3]?.id))?.url || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
            backgroundAssetIds: minimalIds.length > 0 ? minimalIds : bgAssets.slice(0, 3).map(a => a.id),
            isPublished: true,
            displayOrder: 4,
            createdBy: 'admin',
            createdAt: now,
            updatedAt: now
          }
        ];

        db.backgroundCollections = initialCollections;
      }

      return db;
    }
  } catch (err) {
    console.error('Error loading DB file, resetting to empty database:', err);
  }

  db = createEmptyDatabase();
  saveDatabase();
  return db;
}

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoConnected = false;

async function persistToMongo(): Promise<void> {
  if (!mongoDb || !isMongoConnected) return;
  try {
    const collections: (keyof DatabaseSchema)[] = ['users', 'invitations', 'templates', 'blocks', 'rsvps', 'guestbook', 'media', 'backgroundCollections'];
    for (const name of collections) {
      const col = mongoDb.collection(name);
      const items = db[name];
      if (items) {
        await col.deleteMany({});
        if (items.length > 0) {
          await col.insertMany(items.map(({ _id, ...it }: any) => ({ ...it })));
        }
      }
    }
  } catch (err: any) {
    console.error('[MongoDB] Sync error to Atlas:', err.message);
  }
}

export async function initMongo(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'onlineinvite';

  if (!uri) {
    console.log('[MongoDB] No MONGODB_URI provided in .env. Using local storage (.data/db.json).');
    return false;
  }

  try {
    console.log(`[MongoDB] Connecting to MongoDB Atlas (${dbName})...`);
    mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
    isMongoConnected = true;
    console.log(`[MongoDB] Successfully connected to MongoDB Atlas database "${dbName}"!`);

    // Check existing collections
    const collections = await mongoDb.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (names.includes('users') && names.includes('invitations')) {
      const users = await mongoDb.collection('users').find({}).toArray();
      const invitations = await mongoDb.collection('invitations').find({}).toArray();
      const templates = await mongoDb.collection('templates').find({}).toArray();
      const blocks = await mongoDb.collection('blocks').find({}).toArray();
      const rsvps = await mongoDb.collection('rsvps').find({}).toArray();
      const guestbook = await mongoDb.collection('guestbook').find({}).toArray();
      const media = await mongoDb.collection('media').find({}).toArray();

      if (users.length > 0) db.users = users.map(({ _id, ...u }) => u as any);
      if (invitations.length > 0) db.invitations = invitations.map(({ _id, ...i }) => i as any);
      if (templates.length > 0) db.templates = templates.map(({ _id, ...t }) => t as any);
      if (blocks.length > 0) db.blocks = blocks.map(({ _id, ...b }) => b as any);
      if (rsvps.length > 0) db.rsvps = rsvps.map(({ _id, ...r }) => r as any);
      if (guestbook.length > 0) db.guestbook = guestbook.map(({ _id, ...g }) => g as any);
      if (media.length > 0) db.media = media.map(({ _id, ...m }) => m as any);

      if (names.includes('backgroundCollections')) {
        const backgroundCollections = await mongoDb.collection('backgroundCollections').find({}).toArray();
        if (backgroundCollections.length > 0) db.backgroundCollections = backgroundCollections.map(({ _id, ...c }) => c as any);
      }

      saveDatabase();
      console.log(`[MongoDB] Loaded data from Atlas: ${db.users.length} users, ${db.invitations.length} invitations.`);
    } else {
      console.log('[MongoDB] Initializing Atlas database schema...');
      await persistToMongo();
      console.log('[MongoDB] Database synchronized to MongoDB Atlas successfully.');
    }
    return true;
  } catch (err: any) {
    console.warn(`[MongoDB] Could not establish connection to MongoDB Atlas: ${err.message}`);
    console.warn('[MongoDB] Continuing with local storage database (.data/db.json).');
    return false;
  }
}

export function saveDatabase(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
    try {
      lastDbMtime = fs.statSync(DATA_FILE).mtimeMs;
    } catch { }
  } catch (err) {
    console.error('Error saving DB file:', err);
  }

  if (isMongoConnected) {
    persistToMongo().catch(err => {
      console.error('[MongoDB] Persistence error:', err.message);
    });
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
        color: '#f8fafc'
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
        backgroundColor: '#f8fafc'
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
  getTemplates: (params: {
    category?: string;
    search?: string;
    all?: boolean;
    superAdminOnly?: boolean;
    userId?: string;
    userRole?: string;
    verificationStatus?: string;
  } = {}) => {
    loadDatabase();
    let list = db.templates || [];

    // Authorization & Visibility Filter
    // If not admin and not requesting all (e.g. shop owner browsing available templates):
    if (!params.all && params.userRole !== 'admin') {
      list = list.filter(t => {
        const isAdminCreated = t.isSuperAdmin || t.authorRole === 'admin' || t.authorRole === 'superadmin';
        const isApprovedPublic = t.isPublic === true && t.verificationStatus === 'approved';
        const isOwnTemplate = Boolean(params.userId && t.createdBy === params.userId);
        // Show if created by admin & public, or if verified & made public by admin, or if own template
        return (isAdminCreated && t.isPublic !== false) || isApprovedPublic || isOwnTemplate;
      });
    }

    // Filter by verification status if specified (e.g. for Admin reviewing pending templates)
    if (params.verificationStatus && params.verificationStatus !== 'all') {
      list = list.filter(t => t.verificationStatus === params.verificationStatus);
    }

    // Filter by super admin creation
    if (params.superAdminOnly) {
      list = list.filter(t => t.isSuperAdmin !== false || t.authorRole === 'admin' || t.authorRole === 'superadmin');
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
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (t.authorName && t.authorName.toLowerCase().includes(q))
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

  createTemplate: (templateData: Partial<InvitationTemplate>, user?: { id?: string; role?: string; name?: string; businessName?: string }) => {
    loadDatabase();
    if (!db.templates) db.templates = [];

    const now = new Date().toISOString();
    const isAdmin = user?.role === 'admin' || templateData.isSuperAdmin;
    const verificationStatus = isAdmin ? 'approved' : (templateData.verificationStatus || 'pending');
    const isPublic = isAdmin ? (templateData.isPublic !== false) : (verificationStatus === 'approved');

    const newTemplate: InvitationTemplate = {
      id: templateData.id || `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: templateData.title || 'Untitled Template',
      category: templateData.category || 'wedding',
      description: templateData.description || 'Custom crafted invitation template.',
      thumbnail: templateData.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      isPremium: Boolean(templateData.isPremium),
      isPublic,
      verificationStatus,
      rejectionReason: '',
      authorRole: isAdmin ? 'admin' : (user?.role as any || 'business'),
      authorName: user?.businessName || user?.name || templateData.authorName || (isAdmin ? 'Super Admin' : 'Shop Owner'),
      createdBy: user?.id || templateData.createdBy || (isAdmin ? 'usr-admin-1' : ''),
      isSuperAdmin: Boolean(isAdmin),
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
          id: `p-${Date.now()}-1`,
          name: 'Section 1',
          order: 0,
          height: 844,
          isFullHeight: true,
          background: { type: 'color', color: '#f8fafc' },
          elements: []
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

  verifyTemplate: (id: string, isApproved: boolean, reason?: string, adminName?: string) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const index = db.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');

    db.templates[index].verificationStatus = isApproved ? 'approved' : 'rejected';
    db.templates[index].isPublic = isApproved;
    db.templates[index].rejectionReason = isApproved ? '' : (reason || 'Admin requested modifications before public listing.');
    db.templates[index].verifiedAt = new Date().toISOString();
    db.templates[index].verifiedBy = adminName || 'System Administrator';
    db.templates[index].updatedAt = new Date().toISOString();

    saveDatabase();
    return db.templates[index];
  },

  submitTemplateForVerification: (id: string, userId?: string) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const index = db.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');

    if (userId && db.templates[index].createdBy && db.templates[index].createdBy !== userId) {
      throw new Error('Not authorized to submit this template');
    }

    db.templates[index].verificationStatus = 'pending';
    db.templates[index].isPublic = false;
    db.templates[index].rejectionReason = '';
    db.templates[index].submittedAt = new Date().toISOString();
    db.templates[index].updatedAt = new Date().toISOString();

    saveDatabase();
    return db.templates[index];
  },

  toggleTemplatePublish: (id: string, isPublic: boolean) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const index = db.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');

    db.templates[index].isPublic = isPublic;
    if (isPublic && db.templates[index].verificationStatus !== 'approved') {
      db.templates[index].verificationStatus = 'approved';
    }
    db.templates[index].updatedAt = new Date().toISOString();
    saveDatabase();
    return db.templates[index];
  },

  duplicateTemplate: (id: string, user?: { id?: string; role?: string; name?: string }) => {
    loadDatabase();
    if (!db.templates) db.templates = [];
    const original = db.templates.find(t => t.id === id);
    if (!original) throw new Error('Template not found');

    const now = new Date().toISOString();
    const isAdmin = user?.role === 'admin';
    const copy: InvitationTemplate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${original.title} (Copy)`,
      isPublic: false, // Default copy to draft
      verificationStatus: 'draft',
      createdBy: user?.id || original.createdBy,
      authorRole: isAdmin ? 'admin' : 'business',
      authorName: user?.name || original.authorName,
      isSuperAdmin: Boolean(isAdmin),
      createdAt: now,
      updatedAt: now
    };

    db.templates.push(copy);
    saveDatabase();
    return copy;
  },

  saveAsTemplate: (
    invitationId: string,
    templateData: { title: string; category: string; description: string; isPublic?: boolean; requestPublic?: boolean },
    user?: { id?: string; role?: string; name?: string; businessName?: string }
  ) => {
    loadDatabase();
    const inv = db.invitations.find(i => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    const now = new Date().toISOString();
    const isAdmin = user?.role === 'admin';
    const wantsPublic = templateData.requestPublic === true || templateData.isPublic === true;
    const verificationStatus = isAdmin ? 'approved' : (wantsPublic ? 'pending' : 'draft');
    const isPublic = isAdmin ? true : false;

    const newTemplate: InvitationTemplate = {
      id: `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: templateData.title,
      category: templateData.category || inv.category,
      description: templateData.description || 'Custom crafted invitation template.',
      thumbnail: inv.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      isPublic,
      verificationStatus,
      rejectionReason: '',
      authorBusinessId: inv.businessId,
      createdBy: user?.id || inv.businessId,
      authorRole: isAdmin ? 'admin' : 'business',
      authorName: user?.businessName || user?.name || (isAdmin ? 'Super Admin' : 'Shop Owner'),
      isSuperAdmin: Boolean(isAdmin),
      submittedAt: wantsPublic ? now : undefined,
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

  // Blocks Management
  getBlocks: (params: { category?: string; search?: string; all?: boolean; userId?: string; userRole?: string } = {}) => {
    loadDatabase();
    let list = db.blocks || [];

    if (!params.all && params.userRole !== 'admin') {
      list = list.filter(b => {
        const isAdminCreated = b.isSuperAdmin || b.authorRole === 'admin' || b.authorRole === 'superadmin';
        const isApproved = b.isPublic !== false && b.verificationStatus === 'approved';
        const isOwn = Boolean(params.userId && b.createdBy === params.userId);
        return (isAdminCreated && b.isPublic !== false) || isApproved || isOwn;
      });
    }

    if (params.category && params.category !== 'all') {
      list = list.filter(b => b.category === params.category);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.subcategory && b.subcategory.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getBlockById: (id: string) => {
    loadDatabase();
    const block = (db.blocks || []).find(b => b.id === id);
    if (!block) throw new Error('Block not found');
    return block;
  },

  createBlock: (blockData: Partial<PrebuiltBlock>, user?: { id?: string; role?: string; name?: string }) => {
    loadDatabase();
    if (!db.blocks) db.blocks = [];

    const now = new Date().toISOString();
    const isAdmin = user?.role === 'admin' || blockData.isSuperAdmin;

    const newBlock: PrebuiltBlock = {
      id: blockData.id || `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: blockData.name || 'Untitled Section Block',
      category: (blockData.category || 'event') as any,
      subcategory: blockData.subcategory || 'custom',
      description: blockData.description || 'Custom prebuilt section block.',
      icon: blockData.icon,
      thumbnail: blockData.thumbnail,
      suggestedHeight: blockData.suggestedHeight || 300,
      elements: blockData.elements || [],
      createdBy: user?.id || (isAdmin ? 'usr-admin-1' : ''),
      authorRole: isAdmin ? 'admin' : (user?.role as any || 'business'),
      authorName: user?.name || (isAdmin ? 'Super Admin' : 'Shop Owner'),
      isSuperAdmin: Boolean(isAdmin),
      isPublic: isAdmin ? true : (blockData.isPublic !== false),
      verificationStatus: isAdmin ? 'approved' : 'draft',
      createdAt: now,
      updatedAt: now
    };

    db.blocks.push(newBlock);
    saveDatabase();
    return newBlock;
  },

  deleteBlock: (id: string) => {
    loadDatabase();
    if (!db.blocks) db.blocks = [];
    const index = db.blocks.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Block not found');

    db.blocks.splice(index, 1);
    saveDatabase();
    return { success: true, id };
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

    // Filter by public, scope, or business
    if (params.scope === 'public' || params.scope === 'stock' || params.scope === 'admin') {
      list = list.filter(m => m.isPublic || m.isSuperAdmin || m.businessId === 'admin');
    } else if (params.scope === 'uploads' || params.scope === 'my_uploads') {
      if (params.invitationId && params.invitationId !== 'all') {
        list = list.filter(m =>
          !m.isSuperAdmin && (
            m.invitationId === params.invitationId ||
            (m.invitationIds && m.invitationIds.includes(params.invitationId!)) ||
            (params.businessId && m.businessId === params.businessId && !m.isPublic)
          )
        );
      } else if (params.businessId && params.businessId !== 'all') {
        list = list.filter(m => m.businessId === params.businessId && !m.isSuperAdmin);
      }
    } else if (params.isPublic === true || params.isPublic === 'true') {
      list = list.filter(m => m.isPublic || m.isSuperAdmin || m.businessId === 'admin');
    } else if (params.scope === 'all') {
      // Return everything: user's uploads + all public/admin created assets
      if (params.businessId && params.businessId !== 'all') {
        list = list.filter(m => m.businessId === params.businessId || m.isPublic || m.isSuperAdmin || m.businessId === 'admin');
      }
    } else {
      // Default: show invitation items AND public/admin assets so users can select and use them
      if (params.invitationId && params.invitationId !== 'all') {
        list = list.filter(m =>
          m.invitationId === params.invitationId ||
          (m.invitationIds && m.invitationIds.includes(params.invitationId!)) ||
          m.isPublic ||
          m.isSuperAdmin ||
          m.businessId === 'admin'
        );
      } else if (params.businessId && params.businessId !== 'all') {
        list = list.filter(m => m.businessId === params.businessId || m.isPublic || m.isSuperAdmin || m.businessId === 'admin');
      }
    }

    // Filter by media type
    if (params.type && params.type !== 'all') {
      const t = params.type.toLowerCase().trim();
      list = list.filter(m => {
        if (t === 'image') return m.type === 'image' || m.type === 'frame' || m.type === 'sticker' || m.type === 'decoration' || m.type === 'pattern' || m.type === 'texture';
        if (t === 'frame') return m.type === 'frame' || (m.category || '').toLowerCase().includes('frame');
        if (t === 'gif') return m.type === 'gif' || m.format === 'gif';
        if (t === 'video') return m.type === 'video';
        if (t === 'audio') return m.type === 'audio';
        return m.type === t;
      });
    }

    // Filter by category with flexible semantic matching
    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase().trim();
      list = list.filter(m => {
        const mCat = (m.category || '').toLowerCase();
        const mType = (m.type || '').toLowerCase();
        const mTags = (m.tags || []).map(t => t.toLowerCase());

        if (cat === 'frames' || cat === 'frame') {
          return mType === 'frame' || mCat.includes('frame') || mTags.includes('frame') || mCat.includes('arch');
        }
        if (cat === 'backgrounds' || cat === 'background' || cat === 'background-images' || cat === 'background_images') {
          return mCat.includes('background') || mTags.includes('background') || mTags.includes('wallpaper') || mTags.includes('backdrop') || mCat.includes('texture') || mCat.includes('pattern') || mType === 'pattern' || mType === 'texture';
        }
        if (cat === 'borders' || cat === 'border') {
          return mCat.includes('border') || mTags.includes('border') || mCat.includes('frame') || mType === 'frame';
        }
        if (cat === 'gif' || cat === 'gifs') {
          return mType === 'gif' || mCat.includes('gif') || m.format === 'gif';
        }
        if (cat === 'video' || cat === 'videos') {
          return mType === 'video' || mCat.includes('video') || m.format === 'mp4' || m.format === 'webm';
        }
        if (cat === 'stickers' || cat === 'sticker' || cat === 'badges' || cat === 'badge' || cat === 'seals') {
          return mType === 'sticker' || mType === 'decoration' || mCat.includes('sticker') || mCat.includes('seal') || mCat.includes('badge') || mTags.includes('sticker');
        }
        if (cat === 'photos' || cat === 'stock' || cat === 'images') {
          return mType === 'image' && !mCat.includes('frame') && !mCat.includes('sticker');
        }
        if (cat === 'floral' || cat === 'botanical') {
          return mCat.includes('floral') || mCat.includes('botanical') || mTags.includes('floral') || mTags.includes('botanical');
        }
        if (cat === 'music' || cat === 'audio') {
          return mType === 'audio' || mCat.includes('audio') || mCat.includes('music');
        }
        if (cat === 'monograms' || cat === 'monogram') {
          return mCat.includes('monogram') || mTags.includes('monogram');
        }
        return mCat === cat || mCat.includes(cat) || mTags.some(t => t.includes(cat));
      });
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

  getMediaById: (id: string) => {
    loadDatabase();
    if (!db.media) db.media = [];
    return db.media.find(m => m.id === id);
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
  },

  // Background Collections
  getBackgroundCollections: (params: { isPublished?: boolean; search?: string } = {}) => {
    loadDatabase();
    let list = db.backgroundCollections || [];

    if (params.isPublished !== undefined) {
      list = list.filter(c => c.isPublished === params.isPublished);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Sort by displayOrder ascending, then updatedAt descending
    const sorted = [...list].sort((a, b) => {
      const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

    // Populate assetsCount and ensure coverAssetUrl is present
    return sorted.map(col => {
      let coverUrl = col.coverAssetUrl;
      if (!coverUrl && col.coverAssetId) {
        const coverMedia = db.media?.find(m => m.id === col.coverAssetId);
        if (coverMedia) coverUrl = coverMedia.thumbnailUrl || coverMedia.url;
      }
      if (!coverUrl && col.backgroundAssetIds && col.backgroundAssetIds.length > 0) {
        const firstMedia = db.media?.find(m => m.id === col.backgroundAssetIds[0]);
        if (firstMedia) coverUrl = firstMedia.thumbnailUrl || firstMedia.url;
      }

      return {
        ...col,
        coverAssetUrl: coverUrl,
        assetsCount: col.backgroundAssetIds?.length || 0
      };
    });
  },

  getBackgroundCollectionById: (idOrSlug: string, populateAssets: boolean = true) => {
    loadDatabase();
    const col = (db.backgroundCollections || []).find(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (!col) return null;

    let coverUrl = col.coverAssetUrl;
    let backgroundAssets: MediaAsset[] = [];

    if (col.backgroundAssetIds && col.backgroundAssetIds.length > 0) {
      const mediaMap = new Map((db.media || []).map(m => [m.id, m]));
      backgroundAssets = col.backgroundAssetIds
        .map(id => mediaMap.get(id))
        .filter((m): m is MediaAsset => Boolean(m));
    }

    if (!coverUrl && col.coverAssetId) {
      const coverMedia = db.media?.find(m => m.id === col.coverAssetId);
      if (coverMedia) coverUrl = coverMedia.thumbnailUrl || coverMedia.url;
    }
    if (!coverUrl && backgroundAssets.length > 0) {
      coverUrl = backgroundAssets[0].thumbnailUrl || backgroundAssets[0].url;
    }

    return {
      ...col,
      coverAssetUrl: coverUrl,
      assetsCount: col.backgroundAssetIds?.length || 0,
      backgroundAssets: populateAssets ? backgroundAssets : undefined
    };
  },

  createBackgroundCollection: (data: {
    name: string;
    slug?: string;
    description?: string;
    coverAssetId?: string;
    coverAssetUrl?: string;
    backgroundAssetIds?: string[];
    isPublished?: boolean;
    displayOrder?: number;
    createdBy?: string;
  }) => {
    loadDatabase();
    if (!db.backgroundCollections) db.backgroundCollections = [];

    const now = new Date().toISOString();
    const baseSlug = (data.slug || data.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `collection-${Date.now()}`;

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (db.backgroundCollections.some(c => c.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newCollection: BackgroundCollection = {
      id: `bgc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      slug,
      description: data.description ? data.description.trim() : '',
      coverAssetId: data.coverAssetId || undefined,
      coverAssetUrl: data.coverAssetUrl || undefined,
      backgroundAssetIds: Array.isArray(data.backgroundAssetIds) ? data.backgroundAssetIds : [],
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : db.backgroundCollections.length + 1,
      createdBy: data.createdBy || 'admin',
      createdAt: now,
      updatedAt: now
    };

    db.backgroundCollections.push(newCollection);
    saveDatabase();
    return newCollection;
  },

  updateBackgroundCollection: (id: string, updates: Partial<BackgroundCollection>) => {
    loadDatabase();
    if (!db.backgroundCollections) db.backgroundCollections = [];
    const index = db.backgroundCollections.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Background collection not found');

    const current = db.backgroundCollections[index];

    // Filter out undefined values to prevent wiping existing data
    const cleanUpdates: Partial<BackgroundCollection> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        (cleanUpdates as any)[key] = value;
      }
    }

    const updated: BackgroundCollection = {
      ...current,
      ...cleanUpdates,
      updatedAt: new Date().toISOString()
    };

    // Ensure backgroundAssetIds is preserved as an array
    if (!Array.isArray(updated.backgroundAssetIds)) {
      updated.backgroundAssetIds = Array.isArray(current.backgroundAssetIds) ? current.backgroundAssetIds : [];
    }

    // Ensure isPublished is preserved as boolean
    if (typeof updated.isPublished !== 'boolean') {
      updated.isPublished = typeof current.isPublished === 'boolean' ? current.isPublished : false;
    }

    // Ensure name is preserved
    if (!updated.name) {
      updated.name = current.name || 'Untitled Collection';
    }

    if (cleanUpdates.name && !cleanUpdates.slug) {
      updated.slug = cleanUpdates.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    db.backgroundCollections[index] = updated;
    saveDatabase();
    return updated;
  },

  deleteBackgroundCollection: (id: string) => {
    loadDatabase();
    if (!db.backgroundCollections) db.backgroundCollections = [];
    const beforeCount = db.backgroundCollections.length;
    db.backgroundCollections = db.backgroundCollections.filter(c => c.id !== id);
    if (db.backgroundCollections.length === beforeCount) {
      throw new Error('Background collection not found');
    }
    saveDatabase();
    return { success: true };
  },

  reorderBackgroundCollectionAssets: (id: string, assetIds: string[]) => {
    loadDatabase();
    if (!db.backgroundCollections) db.backgroundCollections = [];
    const index = db.backgroundCollections.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Background collection not found');

    db.backgroundCollections[index].backgroundAssetIds = assetIds;
    db.backgroundCollections[index].updatedAt = new Date().toISOString();
    saveDatabase();
    return db.backgroundCollections[index];
  }
};
