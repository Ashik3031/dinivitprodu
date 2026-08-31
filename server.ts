import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth';
import adminRoutes from './server/routes/admin';
import invitationRoutes from './server/routes/invitations';
import rsvpRoutes from './server/routes/rsvp';
import guestbookRoutes from './server/routes/guestbook';
import templateRoutes from './server/routes/templates';
import aiRoutes from './server/routes/ai';
import mediaRoutes from './server/routes/media';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with reasonable payload limit for canvas designs
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/invitations', invitationRoutes);
  app.use('/api/rsvp', rsvpRoutes);
  app.use('/api/guestbook', guestbookRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/media', mediaRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Invitation Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
