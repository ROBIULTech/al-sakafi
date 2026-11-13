import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createApiApp } from './src/server/createApp.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');
const IS_PROD =
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV !== 'development' &&
    fs.existsSync(path.join(DIST_DIR, 'index.html')));

async function startServer() {
  const { app, uploadsDir } = await createApiApp();

  // Serve public assets directly (including newly uploaded files in public/uploads)
  app.use('/assets', express.static(path.resolve(__dirname, 'public', 'assets')));
  app.use('/uploads', express.static(uploadsDir));

  // Frontend Serving (Vite dev middleware vs production dist/)
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`XFOLIO server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
