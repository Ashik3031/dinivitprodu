import express from 'express';
import { dbService } from '../db';
import { optionalAuthMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get templates (with category, search, superAdmin, and all/published filters)
router.get('/', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const { category, search, all, superAdmin, superAdminOnly, verificationStatus } = req.query;
    const isAll = all === 'true' || all === '1';
    const isSuperAdminOnly = superAdmin === 'true' || superAdminOnly === 'true';
    const userId = req.user?.id || (req.query.userId as string);
    const userRole = req.user?.role || (req.query.userRole as string);

    const templates = dbService.getTemplates({
      category: category as string,
      search: search as string,
      all: isAll,
      superAdminOnly: isSuperAdminOnly,
      userId,
      userRole,
      verificationStatus: verificationStatus as string
    });
    return res.json({ templates });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get template by ID
router.get('/:id', (req, res) => {
  try {
    const template = dbService.getTemplateById(req.params.id);
    return res.json({ template });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

// Create new template
router.post('/', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const { title, category, description, thumbnail, isPremium, isPublic, tags, theme, openingScreen, music, pages, verificationStatus } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const template = dbService.createTemplate({
      title,
      category,
      description,
      thumbnail,
      isPremium,
      isPublic,
      verificationStatus,
      tags,
      theme,
      openingScreen,
      music,
      pages
    }, req.user);

    return res.status(201).json({ template });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update template
router.put('/:id', (req, res) => {
  try {
    const updated = dbService.updateTemplate(req.params.id, req.body);
    return res.json({ template: updated });
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

// Admin verify template (Approve to make public or Reject)
router.patch('/:id/verify', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const { isApproved, reason } = req.body;
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ error: 'isApproved must be a boolean' });
    }
    const adminName = req.user?.businessName || req.user?.username || 'Super Admin';
    const template = dbService.verifyTemplate(req.params.id, isApproved, reason, adminName);
    return res.json({ template });
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

// Shop submit template for Admin verification
router.patch('/:id/submit-verification', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const template = dbService.submitTemplateForVerification(req.params.id, req.user?.id);
    return res.json({ template });
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

// Toggle publish status
router.patch('/:id/publish', (req, res) => {
  try {
    const { isPublic } = req.body;
    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ error: 'isPublic must be a boolean' });
    }
    const template = dbService.toggleTemplatePublish(req.params.id, isPublic);
    return res.json({ template });
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

// Duplicate template
router.post('/:id/duplicate', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const template = dbService.duplicateTemplate(req.params.id, req.user);
    return res.status(201).json({ template });
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

// Delete template
router.delete('/:id', (req, res) => {
  try {
    const result = dbService.deleteTemplate(req.params.id);
    return res.json(result);
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

export default router;
