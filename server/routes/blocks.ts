import express from 'express';
import { dbService } from '../db';
import { optionalAuthMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// List blocks
router.get('/', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const { category, search, all } = req.query;
    const isAll = all === 'true' || all === '1';
    const userId = req.user?.id || (req.query.userId as string);
    const userRole = req.user?.role || (req.query.userRole as string);

    const blocks = dbService.getBlocks({
      category: category as string,
      search: search as string,
      all: isAll,
      userId,
      userRole
    });

    return res.json({ blocks });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get block by ID
router.get('/:id', (req, res) => {
  try {
    const block = dbService.getBlockById(req.params.id);
    return res.json({ block });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

// Create new block
router.post('/', optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const { name, category, subcategory, description, icon, thumbnail, suggestedHeight, elements, isPublic } = req.body;
    if (!name || !elements || !Array.isArray(elements)) {
      return res.status(400).json({ error: 'Block name and elements array are required' });
    }

    const block = dbService.createBlock({
      name,
      category: category || 'event',
      subcategory: subcategory || 'section',
      description: description || '',
      icon,
      thumbnail,
      suggestedHeight,
      elements,
      isPublic: isPublic !== false
    }, req.user);

    return res.status(201).json({ block });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete block
router.delete('/:id', (req, res) => {
  try {
    const result = dbService.deleteBlock(req.params.id);
    return res.json(result);
  } catch (error: any) {
    return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
});

export default router;
