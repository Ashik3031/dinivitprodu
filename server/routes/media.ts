import { Router, Request, Response } from 'express';
import { dbService } from '../db';
import { authMiddleware, optionalAuthMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const ALLOWED_TYPES = ['image', 'background', 'frame', 'gif', 'video', 'sticker', 'decoration', 'texture', 'pattern', 'audio'];
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'webm', 'mp3', 'wav', 'ogg'];

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
      isPublic
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

    // Size limit check (15MB maximum)
    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    const computedSize = Number(size) || (isDataUri ? Math.round((url.length * 3) / 4) : 0);
    if (computedSize > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds maximum allowable limit of 15MB'
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
      thumbnailUrl: thumbnailUrl || url,
      type: normalizedType as any,
      format: detectedFormat,
      size: computedSize,
      dimensions: dimensions || undefined,
      duration: duration ? Number(duration) : undefined,
      category: sanitizedCategory,
      tags: sanitizedTags,
      isPublic: isPublicUpload,
      isSuperAdmin: isPublicUpload,
      authorRole: isPublicUpload ? 'superadmin' : (req.user?.role || undefined)
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

// DELETE /api/media/:id - Delete media asset
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
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

    dbService.deleteMedia(id);
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete media' });
  }
});

export default router;
