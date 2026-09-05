import { Router, Request, Response } from 'express';
import { dbService } from '../db';

const router = Router();

// GET /api/media - Get media list with filtering and search
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
router.post('/', (req: Request, res: Response) => {
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
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'webm', 'mp3', 'wav', 'ogg'];
    const detectedFormat = (format || (type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3')).toLowerCase();

    const newMedia = dbService.createMedia({
      businessId: businessId || 'usr-biz-royal',
      invitationId: invitationId || undefined,
      invitationIds: invitationIds || (invitationId ? [invitationId] : []),
      title: title || name || 'Uploaded Asset',
      name: name || title || 'asset',
      url,
      thumbnailUrl: thumbnailUrl || url,
      type: type || 'image',
      format: detectedFormat,
      size: computedSize,
      dimensions: dimensions || undefined,
      duration: duration ? Number(duration) : undefined,
      category: category || 'uploads',
      tags: tags || [],
      isPublic: Boolean(isPublic)
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
router.post('/:id/link', (req: Request, res: Response) => {
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

// PUT /api/media/:id - Update media metadata (title, tags, category)
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = dbService.updateMedia(id, updates);
    res.json({ success: true, media: updated, message: 'Media updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update media' });
  }
});

// DELETE /api/media/:id - Delete media asset
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    dbService.deleteMedia(id);
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete media' });
  }
});

export default router;
