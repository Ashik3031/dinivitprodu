import { Router, Request, Response } from 'express';
import { dbService } from '../db';

const router = Router();

// GET /api/media - Get media list with filtering and search
router.get('/', (req: Request, res: Response) => {
  try {
    const { businessId, invitationId, type, search } = req.query;
    const media = dbService.getMedia({
      businessId: businessId as string | undefined,
      invitationId: invitationId as string | undefined,
      type: type as string | undefined,
      search: search as string | undefined
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

// POST /api/media - Upload/create new media asset
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
      tags
    } = req.body;

    if (!url || !type) {
      return res.status(400).json({ success: false, error: 'URL and type are required' });
    }

    const newMedia = dbService.createMedia({
      businessId: businessId || 'usr-biz-royal',
      invitationId: invitationId || undefined,
      invitationIds: invitationIds || (invitationId ? [invitationId] : []),
      title: title || name || 'Uploaded Asset',
      name: name || title || 'asset',
      url,
      thumbnailUrl: thumbnailUrl || url,
      type: type || 'image',
      format: format || (type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3'),
      size: Number(size) || 0,
      dimensions: dimensions || undefined,
      duration: duration ? Number(duration) : undefined,
      category: category || 'uploads',
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      media: newMedia,
      message: 'Media asset uploaded successfully'
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
