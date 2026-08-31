import express from 'express';
import { dbService } from '../db';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const templates = dbService.getTemplates();
    return res.json({ templates });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
