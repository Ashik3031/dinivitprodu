import express from 'express';
import { dbService } from '../db';

const router = express.Router();

// Get templates (with category, search, and all/published filters)
router.get('/', (req, res) => {
  try {
    const { category, search, all } = req.query;
    const isAll = all === 'true' || all === '1';
    const templates = dbService.getTemplates({
      category: category as string,
      search: search as string,
      all: isAll
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

// Create new template category-wise
router.post('/', (req, res) => {
  try {
    const { title, category, description, thumbnail, isPremium, isPublic, tags, theme, openingScreen, music, pages } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const template = dbService.createTemplate({
      title,
      category,
      description,
      thumbnail,
      isPremium,
      isPublic: isPublic !== false,
      tags,
      theme,
      openingScreen,
      music,
      pages
    });

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
router.post('/:id/duplicate', (req, res) => {
  try {
    const template = dbService.duplicateTemplate(req.params.id);
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

