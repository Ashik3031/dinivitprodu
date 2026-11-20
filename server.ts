import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { initMongo } from './server/db';
import authRoutes from './server/routes/auth';
import adminRoutes from './server/routes/admin';
import invitationRoutes from './server/routes/invitations';
import rsvpRoutes from './server/routes/rsvp';
import guestbookRoutes from './server/routes/guestbook';
import templateRoutes from './server/routes/templates';
import blockRoutes from './server/routes/blocks';
import aiRoutes from './server/routes/ai';
import mediaRoutes from './server/routes/media';

dotenv.config();

async function startServer() {
  // Initialize MongoDB connection if configured
  await initMongo();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

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
  app.use('/api/blocks', blockRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/media', mediaRoutes);

  // Catch-all 404 handler for /api routes to prevent falling through to HTML index
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: path.resolve(process.cwd(), 'vite.config.ts')
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Invitation Studio Server running at http://0.0.0.0:${PORT}`);
  });
  // Keep-alive timeouts aligned with proxy keep-alive to prevent premature connection resets
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
