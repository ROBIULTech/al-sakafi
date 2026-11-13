import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { DEFAULT_SITE_CONTENT, type InquiryItem, type SiteContent } from './src/data/siteContent.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');
const IS_PROD =
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV !== 'development' &&
    fs.existsSync(path.join(DIST_DIR, 'index.html')));

const DATA_DIR = path.resolve(__dirname, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-store.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const ADMIN_AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
const IMAGES_DIR = path.resolve(__dirname, 'public', 'assets', 'images');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const DEFAULT_ADMIN_PATH = '/sakaficontrol';
const RESERVED_PUBLIC_PATHS = new Set([
  '/',
  '/about',
  '/services',
  '/services-details',
  '/works',
  '/works-details',
  '/blog',
  '/blog-details',
  '/contact',
  '/admin',
]);

function normalizeRoutePath(raw: string): string {
  const cleaned = '/' + String(raw || '').trim().replace(/^\/+|\/+$/g, '');
  return cleaned === '/' ? '/' : cleaned.toLowerCase();
}

interface AdminAuthRecord {
  email: string;
  salt: string;
  passwordHash: string;
  adminPath: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function ensureAdminAuth(): AdminAuthRecord {
  const envAdminPath = normalizeRoutePath(process.env.ADMIN_PATH || DEFAULT_ADMIN_PATH);
  const fallbackAdminPath = RESERVED_PUBLIC_PATHS.has(envAdminPath)
    ? DEFAULT_ADMIN_PATH
    : envAdminPath;

  if (fs.existsSync(ADMIN_AUTH_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ADMIN_AUTH_FILE, 'utf8')) as Partial<AdminAuthRecord>;
      if (parsed.email && parsed.salt && parsed.passwordHash) {
        const storedPath = parsed.adminPath ? normalizeRoutePath(parsed.adminPath) : '';
        if (!storedPath || RESERVED_PUBLIC_PATHS.has(storedPath)) {
          const upgraded: AdminAuthRecord = {
            email: parsed.email,
            salt: parsed.salt,
            passwordHash: parsed.passwordHash,
            adminPath: fallbackAdminPath,
          };
          fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(upgraded, null, 2), 'utf8');
          return upgraded;
        }
        return {
          email: parsed.email,
          salt: parsed.salt,
          passwordHash: parsed.passwordHash,
          adminPath: storedPath,
        };
      }
    } catch {
      // Recreate below if corrupted
    }
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const initialPass = process.env.ADMIN_PASSWORD || 'ALSAKAFI200';
  const record: AdminAuthRecord = {
    email: 'robiultech2025@gamil.com',
    salt,
    passwordHash: hashPassword(initialPass, salt),
    adminPath: fallbackAdminPath,
  };
  fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), 'utf8');
  return record;
}

function readCmsContent(): SiteContent {
  if (fs.existsSync(CMS_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(CMS_FILE, 'utf8')) as Partial<SiteContent>;
      return {
        ...DEFAULT_SITE_CONTENT,
        ...raw,
        global: { ...DEFAULT_SITE_CONTENT.global, ...(raw.global || {}) },
        home: { ...DEFAULT_SITE_CONTENT.home, ...(raw.home || {}) },
        about: { ...DEFAULT_SITE_CONTENT.about, ...(raw.about || {}) },
        servicesPage: { ...DEFAULT_SITE_CONTENT.servicesPage, ...(raw.servicesPage || {}) },
        servicesDetails: { ...DEFAULT_SITE_CONTENT.servicesDetails, ...(raw.servicesDetails || {}) },
        worksDetails: { ...DEFAULT_SITE_CONTENT.worksDetails, ...(raw.worksDetails || {}) },
        blogPage: { ...DEFAULT_SITE_CONTENT.blogPage, ...(raw.blogPage || {}) },
        blogDetails: { ...DEFAULT_SITE_CONTENT.blogDetails, ...(raw.blogDetails || {}) },
        faq: { ...DEFAULT_SITE_CONTENT.faq, ...(raw.faq || {}) },
        contact: { ...DEFAULT_SITE_CONTENT.contact, ...(raw.contact || {}) },
      };
    } catch {
      // Fallback to default
    }
  }
  fs.writeFileSync(CMS_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), 'utf8');
  return DEFAULT_SITE_CONTENT;
}

function writeCmsContent(content: SiteContent): void {
  fs.writeFileSync(CMS_FILE, JSON.stringify(content, null, 2), 'utf8');
}

function readInquiries(): InquiryItem[] {
  if (fs.existsSync(INQUIRIES_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed as InquiryItem[];
    } catch {
      // Fallback
    }
  }
  return [];
}

function writeInquiries(items: InquiryItem[]): void {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(items, null, 2), 'utf8');
}

// Revoked tokens set (logged out tokens) + stateless HMAC token helpers
const revokedTokens = new Set<string>();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function signAdminToken(email: string, authRecord: AdminAuthRecord): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS }),
    'utf8'
  ).toString('base64url');
  const secret = `${authRecord.passwordHash}:${authRecord.salt}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyAdminToken(
  token: string,
  authRecord: AdminAuthRecord
): { email: string; exp: number } | null {
  if (!token || revokedTokens.has(token)) return null;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (!/^[0-9a-f]+$/i.test(sig)) return null;

  const secret = `${authRecord.passwordHash}:${authRecord.salt}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as { email?: string; exp?: number };
    if (!parsed.email || !parsed.exp || parsed.exp < Date.now()) {
      return null;
    }
    return { email: parsed.email, exp: parsed.exp };
  } catch {
    return null;
  }
}

function getBearerToken(req: express.Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim();
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const session = verifyAdminToken(token, ensureAdminAuth());
  if (!session) {
    res.status(401).json({ error: 'Session expired' });
    return;
  }
  next();
}

async function startServer() {
  ensureAdminAuth();
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Serve public assets directly (including newly uploaded files in public/uploads)
  app.use('/assets', express.static(path.resolve(__dirname, 'public', 'assets')));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Public CMS Read
  app.get('/api/cms', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(readCmsContent());
  });

  // Public Inquiry Submission
  app.post('/api/inquiries', (req, res) => {
    const body = req.body as Partial<InquiryItem>;
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const service = String(body.service || '').trim();
    const message = String(body.message || '').trim();
    const source = body.source === 'contact' ? 'contact' : 'home';

    if (!firstName || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    const newItem: InquiryItem = {
      id: `inq-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      source,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const all = readInquiries();
    all.unshift(newItem);
    writeInquiries(all);
    res.status(201).json(newItem);
  });

  // Public Blog Review Submission
  app.post('/api/reviews', (req, res) => {
    const { name, text } = req.body as { name?: string; text?: string };
    const cleanName = String(name || '').trim();
    const cleanText = String(text || '').trim();
    if (!cleanName || !cleanText) {
      res.status(400).json({ error: 'Name and comment are required.' });
      return;
    }
    const content = readCmsContent();
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const newRev = {
      id: `rev-${Date.now()}`,
      name: cleanName,
      date: dateStr,
      avatar: '/assets/images/avatar-esther.png',
      text: cleanText.startsWith('“') ? cleanText : `“${cleanText}”`,
    };
    content.blogDetails.reviews = [...content.blogDetails.reviews, newRev];
    writeCmsContent(content);
    res.status(201).json(newRev);
  });

  // Check if a given pathname matches the private admin URL (returns only boolean)
  app.post('/api/auth/resolve-route', (req, res) => {
    const { pathname } = req.body as { pathname?: string };
    const authRecord = ensureAdminAuth();
    const candidate = normalizeRoutePath(String(pathname || ''));
    res.json({ isAdminRoute: candidate === authRecord.adminPath });
  });

  // Admin Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    const authRecord = ensureAdminAuth();
    const inputPass = String(password || '');
    const inputEmail = String(email || '').trim().toLowerCase();

    if (inputEmail && inputEmail !== authRecord.email.toLowerCase()) {
      res.status(401).json({ error: 'Invalid admin email or password.' });
      return;
    }

    const candidateHash = hashPassword(inputPass, authRecord.salt);
    const matches = crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(authRecord.passwordHash, 'hex')
    );

    if (!matches) {
      res.status(401).json({ error: 'Invalid admin email or password.' });
      return;
    }

    const token = signAdminToken(authRecord.email, authRecord);
    res.json({ token, email: authRecord.email, adminPath: authRecord.adminPath });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }
    const authRecord = ensureAdminAuth();
    const session = verifyAdminToken(token, authRecord);
    if (!session) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.json({ authenticated: true, email: session.email, adminPath: authRecord.adminPath });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = getBearerToken(req);
    if (token) revokedTokens.add(token);
    res.json({ ok: true });
  });

  app.post('/api/auth/password', requireAdmin, (req, res) => {
    const { currentPassword, newPassword, newEmail } = req.body as {
      currentPassword?: string;
      newPassword?: string;
      newEmail?: string;
    };
    const authRecord = ensureAdminAuth();
    const currHash = hashPassword(String(currentPassword || ''), authRecord.salt);
    const valid = crypto.timingSafeEqual(
      Buffer.from(currHash, 'hex'),
      Buffer.from(authRecord.passwordHash, 'hex')
    );
    if (!valid) {
      res.status(400).json({ error: 'Current password is incorrect.' });
      return;
    }
    const nextPass = String(newPassword || '').trim();
    if (nextPass.length < 4) {
      res.status(400).json({ error: 'New password must be at least 4 characters.' });
      return;
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const updated: AdminAuthRecord = {
      email: (newEmail || authRecord.email).trim(),
      salt,
      passwordHash: hashPassword(nextPass, salt),
      adminPath: authRecord.adminPath,
    };
    fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(updated, null, 2), 'utf8');
    res.json({ ok: true, email: updated.email });
  });

  app.post('/api/auth/admin-path', requireAdmin, (req, res) => {
    const { newPath } = req.body as { newPath?: string };
    const normalized = normalizeRoutePath(String(newPath || ''));
    if (!/^\/[a-z0-9][a-z0-9-_]{4,60}$/.test(normalized)) {
      res.status(400).json({
        error: 'URL path must be 5–60 characters using only letters, numbers, hyphens, or underscores (e.g. /my-secret-portal).',
      });
      return;
    }
    if (RESERVED_PUBLIC_PATHS.has(normalized) || normalized.startsWith('/api')) {
      res.status(400).json({
        error: 'Cannot use /admin or a reserved public page path.',
      });
      return;
    }
    const authRecord = ensureAdminAuth();
    const updated: AdminAuthRecord = {
      ...authRecord,
      adminPath: normalized,
    };
    fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(updated, null, 2), 'utf8');
    res.json({ ok: true, adminPath: updated.adminPath });
  });

  // Admin CMS Write & Reset
  app.put('/api/cms', requireAdmin, (req, res) => {
    const body = req.body as SiteContent;
    if (!body || typeof body !== 'object' || !body.home || !body.global) {
      res.status(400).json({ error: 'Invalid CMS payload.' });
      return;
    }
    writeCmsContent(body);
    res.json({ ok: true, content: body });
  });

  app.post('/api/cms/reset', requireAdmin, (_req, res) => {
    writeCmsContent(DEFAULT_SITE_CONTENT);
    res.json({ ok: true, content: DEFAULT_SITE_CONTENT });
  });

  // Admin Image Upload (base64 data URL)
  app.post('/api/upload', requireAdmin, (req, res) => {
    const { filename, dataUrl } = req.body as { filename?: string; dataUrl?: string };
    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Missing image data.' });
      return;
    }
    const match = /^data:(image\/(?:png|jpeg|jpg|webp|gif|svg\+xml));base64,(.+)$/i.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: 'Unsupported image format. Use PNG, JPG, WEBP, GIF, or SVG.' });
      return;
    }
    const mime = match[1].toLowerCase();
    const ext =
      mime === 'image/jpeg' || mime === 'image/jpg'
        ? '.jpg'
        : mime === 'image/webp'
        ? '.webp'
        : mime === 'image/gif'
        ? '.gif'
        : mime === 'image/svg+xml'
        ? '.svg'
        : '.png';
    const baseName = String(filename || 'image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 40) || 'image';
    const outName = `${Date.now()}-${baseName}${ext}`;
    const buffer = Buffer.from(match[2], 'base64');
    fs.writeFileSync(path.join(UPLOADS_DIR, outName), buffer);
    res.json({ url: `/uploads/${outName}` });
  });

  // List available local images for asset picker
  app.get('/api/assets', requireAdmin, (_req, res) => {
    const assets: string[] = [];
    if (fs.existsSync(IMAGES_DIR)) {
      for (const f of fs.readdirSync(IMAGES_DIR)) {
        if (/\.(png|jpe?g|webp|gif|svg)$/i.test(f)) {
          assets.push(`/assets/images/${f}`);
        }
      }
    }
    if (fs.existsSync(UPLOADS_DIR)) {
      for (const f of fs.readdirSync(UPLOADS_DIR)) {
        if (/\.(png|jpe?g|webp|gif|svg)$/i.test(f)) {
          assets.push(`/uploads/${f}`);
        }
      }
    }
    res.json({ assets });
  });

  // Admin Inquiries Management
  app.get('/api/inquiries', requireAdmin, (_req, res) => {
    res.json(readInquiries());
  });

  app.patch('/api/inquiries/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body as { status?: InquiryItem['status'] };
    if (status !== 'new' && status !== 'read' && status !== 'replied') {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }
    const items = readInquiries();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    items[idx] = { ...items[idx], status };
    writeInquiries(items);
    res.json(items[idx]);
  });

  app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const items = readInquiries().filter((i) => i.id !== id);
    writeInquiries(items);
    res.json({ ok: true });
  });

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
