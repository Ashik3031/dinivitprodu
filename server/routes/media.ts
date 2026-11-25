import { Router, Request, Response } from 'express';
import { dbService } from '../db';
import { authMiddleware, optionalAuthMiddleware, AuthRequest } from '../middleware/auth';
import { BackgroundCollection } from '../../src/types';
import {
  isCloudinaryConfigured,
  getCloudinaryPublicConfig,
  generateUploadSignature,
  deleteCloudinaryAsset,
  getAssetFolder
} from '../config/cloudinary';

const router = Router();

const ALLOWED_TYPES = ['image', 'background', 'frame', 'gif', 'video', 'sticker', 'decoration', 'texture', 'pattern', 'audio'];
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'webm', 'mp3', 'wav', 'ogg', 'mov', 'm4a', 'aac'];

// GET /api/media/cloudinary-config - Return public Cloudinary credentials (cloudName, apiKey)
router.get('/cloudinary-config', (req: Request, res: Response) => {
  try {
    const config = getCloudinaryPublicConfig();
    res.json({ success: true, ...config });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to get Cloudinary config' });
  }
});

// POST /api/media/signature - Generate signed direct upload credentials
router.post('/signature', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        code: 'CLOUDINARY_NOT_CONFIGURED',
        error: 'Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server environment variables.'
      });
    }

    const { category, resourceType, isPublic, businessId } = req.body;
    const isPublicUpload = Boolean(isPublic || req.body.isSuperAdmin || businessId === 'admin');

    if (isPublicUpload) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Authentication required to generate public upload signature'
        });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Super Administrator privileges required to upload public assets'
        });
      }
    }

    const userId = isPublicUpload ? 'admin' : (req.user?.id || (typeof businessId === 'string' && businessId ? businessId : 'usr-biz-royal'));
    const folder = getAssetFolder(isPublicUpload, userId, category);

    let normResourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
    if (resourceType === 'image' || resourceType === 'video' || resourceType === 'raw') {
      normResourceType = resourceType;
    }

    const sigData = generateUploadSignature({
      folder,
      resourceType: normResourceType
    });

    res.json({
      success: true,
      ...sigData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate upload signature' });
  }
});

// ==========================================
// BACKGROUND COLLECTIONS API
// ==========================================

// GET /api/media/collections - List background collections
router.get('/collections', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { search, all } = req.query;
    // When all=true (admin management), return all collections including drafts; otherwise only published
    const isPublished = all === 'true' ? undefined : true;

    const collections = dbService.getBackgroundCollections({
      isPublished,
      search: search as string | undefined
    });

    res.json({ success: true, collections });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch background collections' });
  }
});

// GET /api/media/collections/:id - Get single collection with populated backgroundAssets
router.get('/collections/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = dbService.getBackgroundCollectionById(id, true);
    if (!collection) {
      return res.status(404).json({ success: false, error: 'Background collection not found' });
    }
    res.json({ success: true, collection });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch collection' });
  }
});

// POST /api/media/collections - Create collection (Admin only)
router.post('/collections', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    }

    const { name, slug, description, coverAssetId, coverAssetUrl, backgroundAssetIds, isPublished, displayOrder } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, error: 'Collection name is required' });
    }

    const created = dbService.createBackgroundCollection({
      name,
      slug,
      description,
      coverAssetId,
      coverAssetUrl,
      backgroundAssetIds,
      isPublished,
      displayOrder,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, collection: created, message: 'Collection created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create collection' });
  }
});

// PUT /api/media/collections/:id - Update collection (Admin only)
router.put('/collections/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    const updates: Partial<BackgroundCollection> = {};
    const { name, slug, description, coverAssetId, coverAssetUrl, backgroundAssetIds, isPublished, displayOrder } = req.body;

    if (name !== undefined) updates.name = String(name).trim();
    if (slug !== undefined) updates.slug = String(slug).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (coverAssetId !== undefined) updates.coverAssetId = coverAssetId;
    if (coverAssetUrl !== undefined) updates.coverAssetUrl = coverAssetUrl;
    if (backgroundAssetIds !== undefined) updates.backgroundAssetIds = Array.isArray(backgroundAssetIds) ? backgroundAssetIds : [];
    if (isPublished !== undefined) updates.isPublished = Boolean(isPublished);
    if (displayOrder !== undefined) updates.displayOrder = Number(displayOrder);

    const updated = dbService.updateBackgroundCollection(id, updates);
    res.json({ success: true, collection: updated, message: 'Collection updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update collection' });
  }
});

// POST /api/media/collections/:id/reorder - Reorder background assets inside a collection (Admin only)
router.post('/collections/:id/reorder', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    const { assetIds } = req.body;
    if (!Array.isArray(assetIds)) {
      return res.status(400).json({ success: false, error: 'assetIds must be an array of asset IDs' });
    }

    const updated = dbService.reorderBackgroundCollectionAssets(id, assetIds);
    res.json({ success: true, collection: updated, message: 'Backgrounds reordered successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to reorder backgrounds' });
  }
});

// DELETE /api/media/collections/:id - Delete collection (Admin only - preserves media assets)
router.delete('/collections/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    dbService.deleteBackgroundCollection(id);
    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete collection' });
  }
});

// GET /api/media - Get media list with filtering and search (public read access preserved for canvas & preview)
router.get('/', (req: Request, res: Response) => {
  try {
    const { businessId, invitationId, type, search, category, isPublic, scope } = req.query;
    const media = dbService.getMedia({
      businessId: businessId as string | undefined,
      invitationId: invitationId as string | undefined,
      type: type as string | undefined,
      search: search as string | undefined,
      category: category as string | undefined,
      isPublic: isPublic === 'true' ? true : (isPublic === 'false' ? false : undefined),
      scope: scope as string | undefined
    });
    res.json({ success: true, media });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch media' });
  }
});

// GET /api/media/stats - Get storage breakdown stats
router.get('/stats', (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    const stats = dbService.getMediaStats(businessId as string | undefined);
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch media stats' });
  }
});

// POST /api/media - Upload/create new media asset with validation
router.post('/', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      name,
      url,
      thumbnailUrl,
      type,
      format,
      size,
      dimensions,
      duration,
      businessId,
      invitationId,
      invitationIds,
      category,
      tags,
      isPublic,
      publicId,
      resourceType,
      mimeType
    } = req.body;

    if (!url || !type) {
      return res.status(400).json({ success: false, error: 'Asset URL and type are required' });
    }

    const normalizedType = String(type).toLowerCase();
    if (!ALLOWED_TYPES.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid media type "${type}". Allowed types: ${ALLOWED_TYPES.join(', ')}`
      });
    }

    // Security validation: URL / Base64 format check
    const isDataUri = typeof url === 'string' && url.startsWith('data:');
    const isHttpUrl = typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'));

    if (!isDataUri && !isHttpUrl) {
      return res.status(400).json({ success: false, error: 'Invalid media URL or payload format' });
    }

    // Size limit check for local/data-uri uploads (15MB maximum)
    // Cloudinary direct uploads can be larger
    const MAX_DATA_URI_SIZE = 15 * 1024 * 1024;
    const computedSize = Number(size) || (isDataUri ? Math.round((url.length * 3) / 4) : 0);
    if (isDataUri && computedSize > MAX_DATA_URI_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'Data URI size exceeds maximum allowable limit of 15MB'
      });
    }

    // Format validation
    const rawFormat = (format || (normalizedType === 'image' ? 'jpg' : normalizedType === 'video' ? 'mp4' : normalizedType === 'audio' ? 'mp3' : 'png')).toLowerCase();
    const detectedFormat = rawFormat === 'jpeg' ? 'jpg' : rawFormat;

    if (!ALLOWED_FORMATS.includes(detectedFormat)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported format "${detectedFormat}". Allowed formats: ${ALLOWED_FORMATS.join(', ')}`
      });
    }

    const isPublicUpload = Boolean(isPublic || req.body.isSuperAdmin || businessId === 'admin');

    // Admin authorization check for public/superadmin assets
    if (isPublicUpload) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Authentication required to upload public assets'
        });
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Super Administrator privileges required to publish public assets'
        });
      }
    }

    // Generate intelligent Cloudinary thumbnail if not provided
    let finalThumbnailUrl = thumbnailUrl || url;
    if (!thumbnailUrl && typeof url === 'string' && url.includes('res.cloudinary.com')) {
      if (normalizedType === 'video' || resourceType === 'video') {
        finalThumbnailUrl = url.replace(/\.[^/.]+$/, '.jpg').replace('/upload/', '/upload/f_auto,q_auto,w_400,c_limit,so_0/');
      } else if (normalizedType !== 'audio') {
        finalThumbnailUrl = url.replace('/upload/', '/upload/f_auto,q_auto,w_400,c_limit/');
      }
    }

    // Preserve valid provided category without forcing frame
    const sanitizedCategory = category && typeof category === 'string' && category.trim()
      ? category.trim()
      : (isPublicUpload ? 'Photos & Graphics' : 'user-upload');

    const sanitizedTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    const newMedia = dbService.createMedia({
      businessId: isPublicUpload ? 'admin' : (businessId || req.user?.id || 'usr-biz-royal'),
      invitationId: invitationId || undefined,
      invitationIds: invitationIds || (invitationId ? [invitationId] : []),
      title: title || name || 'Uploaded Asset',
      name: name || title || 'asset',
      url,
      thumbnailUrl: finalThumbnailUrl,
      type: normalizedType as any,
      format: detectedFormat,
      size: computedSize,
      dimensions: dimensions || undefined,
      duration: duration ? Number(duration) : undefined,
      category: sanitizedCategory,
      tags: sanitizedTags,
      isPublic: isPublicUpload,
      isSuperAdmin: isPublicUpload,
      authorRole: isPublicUpload ? 'superadmin' : (req.user?.role || undefined),
      publicId: publicId || undefined,
      resourceType: resourceType || undefined,
      mimeType: mimeType || undefined
    });

    res.status(201).json({
      success: true,
      media: newMedia,
      message: 'Media asset uploaded and validated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create media asset' });
  }
});

// POST /api/media/:id/link - Link/reuse media in another invitation
router.post('/:id/link', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { invitationId } = req.body;
    if (!invitationId) {
      return res.status(400).json({ success: false, error: 'invitationId is required' });
    }

    const updated = dbService.linkMediaToInvitation(id, invitationId);
    res.json({ success: true, media: updated, message: 'Media linked to invitation' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to link media' });
  }
});

// PUT /api/media/:id - Update media metadata (title, tags, category, type, isPublic)
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbService.getMediaById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Media asset not found' });
    }

    const isPublicAsset = Boolean(existing.isPublic || existing.isSuperAdmin || existing.businessId === 'admin');

    if (isPublicAsset) {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Super Administrator privileges required to edit public assets'
        });
      }
    } else {
      const isOwner = req.user?.role === 'admin' || existing.businessId === req.user?.id || existing.businessId === req.user?.businessName;
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You do not have permission to modify this asset'
        });
      }
    }

    const updates: any = {};
    if (req.body.title !== undefined) updates.title = String(req.body.title).trim();
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.type !== undefined) {
      const normType = String(req.body.type).toLowerCase();
      if (!ALLOWED_TYPES.includes(normType)) {
        return res.status(400).json({ success: false, error: `Invalid media type "${req.body.type}"` });
      }
      updates.type = normType;
    }
    if (req.body.format !== undefined) {
      const rawFmt = String(req.body.format).toLowerCase();
      const normFmt = rawFmt === 'jpeg' ? 'jpg' : rawFmt;
      if (!ALLOWED_FORMATS.includes(normFmt)) {
        return res.status(400).json({ success: false, error: `Invalid format "${req.body.format}"` });
      }
      updates.format = normFmt;
    }
    if (req.body.category !== undefined) {
      updates.category = String(req.body.category).trim() || 'Photos & Graphics';
    }
    if (req.body.tags !== undefined) {
      updates.tags = Array.isArray(req.body.tags)
        ? req.body.tags.map((t: any) => String(t).trim()).filter(Boolean)
        : typeof req.body.tags === 'string'
          ? req.body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [];
    }
    if (req.body.isPublic !== undefined && req.user?.role === 'admin') {
      updates.isPublic = Boolean(req.body.isPublic);
      if (updates.isPublic) {
        updates.isSuperAdmin = true;
      }
    }
    if (req.body.dimensions !== undefined) {
      updates.dimensions = req.body.dimensions;
    }

    const updated = dbService.updateMedia(id, updates);
    res.json({ success: true, media: updated, message: 'Media updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update media' });
  }
});

// DELETE /api/media/:id - Delete media asset (from Cloudinary and database)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbService.getMediaById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Media asset not found' });
    }

    const isPublicAsset = Boolean(existing.isPublic || existing.isSuperAdmin || existing.businessId === 'admin');

    if (isPublicAsset) {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Super Administrator privileges required to delete public assets'
        });
      }
    } else {
      const isOwner = req.user?.role === 'admin' || existing.businessId === req.user?.id || existing.businessId === req.user?.businessName;
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You do not have permission to delete this asset'
        });
      }
    }

    // Safely delete from Cloudinary if publicId exists
    if (existing.publicId) {
      try {
        await deleteCloudinaryAsset(existing.publicId, existing.resourceType || existing.type);
      } catch (cloudErr: any) {
        console.warn(`[Cloudinary] Asset deletion warning for ${existing.publicId}:`, cloudErr?.message || cloudErr);
      }
    }

    dbService.deleteMedia(id);
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete media' });
  }
});

export default router;
