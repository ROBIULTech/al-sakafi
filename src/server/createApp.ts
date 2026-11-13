import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_SITE_CONTENT, type InquiryItem, type SiteContent } from '../data/siteContent.ts';

const IS_VERCEL = Boolean(process.env.VERCEL);
const ROOT_DIR = process.cwd();
const DATA_DIR = IS_VERCEL
  ? path.join('/tmp', 'xfolio-data')
  : path.resolve(ROOT_DIR, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-store.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const ADMIN_AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
const UPLOADS_DIR = IS_VERCEL
  ? path.join('/tmp', 'xfolio-uploads')
  : path.resolve(ROOT_DIR, 'public', 'uploads');
const IMAGES_DIR = path.resolve(ROOT_DIR, 'public', 'assets', 'images');

const KV_URL = (
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  ''
).replace(/\/+$/, '');
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  '';
const HAS_KV = Boolean(KV_URL && KV_TOKEN);

const KV_KEYS = {
  auth: 'xfolio:admin_auth',
  cms: 'xfolio:cms_content',
  inquiries: 'xfolio:inquiries',
};

const DEFAULT_BUILTIN_IMAGES = [
  '/assets/images/about-portrait.png',
  '/assets/images/avatar-bessie.png',
  '/assets/images/avatar-brooklyn.png',
  '/assets/images/avatar-darrell.png',
  '/assets/images/avatar-dianne.png',
  '/assets/images/avatar-esther.png',
  '/assets/images/avatar-kathryn.png',
  '/assets/images/avatar-leslie.png',
  '/assets/images/avatar-ronald-bd.png',
  '/assets/images/avatar-ronald.png',
  '/assets/images/bd-hero.png',
  '/assets/images/bd-mid-1.png',
  '/assets/images/bd-mid-2.png',
  '/assets/images/bd-recent-1.png',
  '/assets/images/bd-recent-2.png',
  '/assets/images/bd-recent-3.png',
  '/assets/images/blog-1.png',
  '/assets/images/blog-2.png',
  '/assets/images/blog-3.png',
  '/assets/images/blog-card-1.png',
  '/assets/images/blog-card-2.png',
  '/assets/images/blog-card-3.png',
  '/assets/images/blog-card-4.png',
  '/assets/images/blog-card-5.png',
  '/assets/images/blog-card-6.png',
  '/assets/images/hero-avatars.png',
  '/assets/images/hero-portrait.png',
  '/assets/images/pd-bunny.png',
  '/assets/images/pd-hero.png',
  '/assets/images/pd-mist.png',
  '/assets/images/pd-pink.png',
  '/assets/images/portfolio-1.png',
  '/assets/images/portfolio-2.png',
  '/assets/images/portfolio-3.png',
  '/assets/images/portfolio-4.png',
  '/assets/images/sd-brochure.png',
  '/assets/images/sd-building.png',
  '/assets/images/sd-cube.png',
  '/assets/images/sd-hero.png',
  '/assets/images/service-03.png',
  '/assets/images/tool-figma.png',
  '/assets/images/tool-js.png',
  '/assets/images/tool-react.png',
  '/assets/images/tool-sketch.png',
  '/assets/images/tool-wordpress.png',
  '/assets/images/tool-xd.png',
];

function ensureDirs(): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch {
    // Ignore if environment prevents local dir creation
  }
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (!HAS_KV) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: string | null };
    if (!data.result) return null;
    return JSON.parse(data.result) as T;
  } catch {
    return null;
  }
}

async function kvSet<T>(key: string, value: T): Promise<boolean> {
  if (!HAS_KV) return false;
  try {
    const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(value)),
    });
    return res.ok;
  } catch {
    return false;
  }
}

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

function mergeCmsContent(raw: Partial<SiteContent>): SiteContent {
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
}

let memoryAuthCache: AdminAuthRecord | null = null;
let memoryCmsCache: SiteContent | null = null;
let memoryInquiriesCache: InquiryItem[] | null = null;

async function ensureAdminAuth(): Promise<AdminAuthRecord> {
  ensureDirs();
  const envAdminPath = normalizeRoutePath(process.env.ADMIN_PATH || DEFAULT_ADMIN_PATH);
  const fallbackAdminPath = RESERVED_PUBLIC_PATHS.has(envAdminPath)
    ? DEFAULT_ADMIN_PATH
    : envAdminPath;

  if (HAS_KV) {
    const kvAuth = await kvGet<Partial<AdminAuthRecord>>(KV_KEYS.auth);
    if (kvAuth?.email && kvAuth?.salt && kvAuth?.passwordHash) {
      const storedPath = kvAuth.adminPath ? normalizeRoutePath(kvAuth.adminPath) : '';
      const resolvedPath =
        !storedPath || RESERVED_PUBLIC_PATHS.has(storedPath)
          ? fallbackAdminPath
          : storedPath;
      const validRecord: AdminAuthRecord = {
        email: kvAuth.email,
        salt: kvAuth.salt,
        passwordHash: kvAuth.passwordHash,
        adminPath: resolvedPath,
      };
      if (resolvedPath !== storedPath) {
        await kvSet(KV_KEYS.auth, validRecord);
      }
      memoryAuthCache = validRecord;
      return validRecord;
    }
  }

  if (fs.existsSync(ADMIN_AUTH_FILE)) {
    try {
      const parsed = JSON.parse(
        fs.readFileSync(ADMIN_AUTH_FILE, 'utf8')
      ) as Partial<AdminAuthRecord>;
      if (parsed.email && parsed.salt && parsed.passwordHash) {
        const storedPath = parsed.adminPath ? normalizeRoutePath(parsed.adminPath) : '';
        const resolvedPath =
          !storedPath || RESERVED_PUBLIC_PATHS.has(storedPath)
            ? fallbackAdminPath
            : storedPath;
        const record: AdminAuthRecord = {
          email: parsed.email,
          salt: parsed.salt,
          passwordHash: parsed.passwordHash,
          adminPath: resolvedPath,
        };
        if (resolvedPath !== storedPath) {
          fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), 'utf8');
        }
        if (HAS_KV) await kvSet(KV_KEYS.auth, record);
        memoryAuthCache = record;
        return record;
      }
    } catch {
      // Recreate below if corrupted
    }
  }

  if (memoryAuthCache) return memoryAuthCache;

  const salt = crypto.randomBytes(16).toString('hex');
  const initialEmail = (process.env.ADMIN_EMAIL || 'robiultech2025@gamil.com').trim();
  const initialPass = process.env.ADMIN_PASSWORD || 'ALSAKAFI200';
  const record: AdminAuthRecord = {
    email: initialEmail,
    salt,
    passwordHash: hashPassword(initialPass, salt),
    adminPath: fallbackAdminPath,
  };
  memoryAuthCache = record;
  if (HAS_KV) await kvSet(KV_KEYS.auth, record);
  try {
    fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), 'utf8');
  } catch {
    // Ignore read-only errors
  }
  return record;
}

async function saveAdminAuth(record: AdminAuthRecord): Promise<void> {
  ensureDirs();
  memoryAuthCache = record;
  if (HAS_KV) await kvSet(KV_KEYS.auth, record);
  try {
    fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), 'utf8');
  } catch {
    // Ignore read-only errors
  }
}

async function readCmsContent(): Promise<SiteContent> {
  ensureDirs();
  if (HAS_KV) {
    const kvCms = await kvGet<Partial<SiteContent>>(KV_KEYS.cms);
    if (kvCms) {
      const merged = mergeCmsContent(kvCms);
      memoryCmsCache = merged;
      return merged;
    }
  }

  if (fs.existsSync(CMS_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(CMS_FILE, 'utf8')) as Partial<SiteContent>;
      const merged = mergeCmsContent(raw);
      memoryCmsCache = merged;
      return merged;
    } catch {
      // Fallback to default
    }
  }

  if (memoryCmsCache) return memoryCmsCache;

  memoryCmsCache = DEFAULT_SITE_CONTENT;
  if (HAS_KV) await kvSet(KV_KEYS.cms, DEFAULT_SITE_CONTENT);
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), 'utf8');
  } catch {
    // Ignore read-only errors
  }
  return DEFAULT_SITE_CONTENT;
}

async function writeCmsContent(content: SiteContent): Promise<void> {
  ensureDirs();
  memoryCmsCache = content;
  if (HAS_KV) await kvSet(KV_KEYS.cms, content);
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(content, null, 2), 'utf8');
  } catch {
    // Ignore read-only errors
  }
}

async function readInquiries(): Promise<InquiryItem[]> {
  ensureDirs();
  if (HAS_KV) {
    const kvItems = await kvGet<InquiryItem[]>(KV_KEYS.inquiries);
    if (Array.isArray(kvItems)) {
      memoryInquiriesCache = kvItems;
      return kvItems;
    }
  }
  if (fs.existsSync(INQUIRIES_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
      if (Array.isArray(parsed)) {
        memoryInquiriesCache = parsed as InquiryItem[];
        return memoryInquiriesCache;
      }
    } catch {
      // Fallback
    }
  }
  return memoryInquiriesCache || [];
}

async function writeInquiries(items: InquiryItem[]): Promise<void> {
  ensureDirs();
  memoryInquiriesCache = items;
  if (HAS_KV) await kvSet(KV_KEYS.inquiries, items);
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch {
    // Ignore read-only errors
  }
}

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

async function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const authRecord = await ensureAdminAuth();
  const session = verifyAdminToken(token, authRecord);
  if (!session) {
    res.status(401).json({ error: 'Session expired' });
    return;
  }
  next();
}

export async function createApiApp(): Promise<{
  app: express.Express;
  uploadsDir: string;
}> {
  ensureDirs();
  await ensureAdminAuth();

  const app = express();
  const jsonParser = express.json({ limit: '15mb' });
  app.use((req, res, next) => {
    if (req.body !== undefined && typeof req.body === 'object') {
      next();
      return;
    }
    jsonParser(req, res, next);
  });

  // Public CMS Read
  app.get('/api/cms', async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(await readCmsContent());
  });

  // Public Inquiry Submission
  app.post('/api/inquiries', async (req, res) => {
    const body = (req.body || {}) as Partial<InquiryItem>;
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
    const all = await readInquiries();
    all.unshift(newItem);
    await writeInquiries(all);
    res.status(201).json(newItem);
  });

  // Public Blog Review Submission
  app.post('/api/reviews', async (req, res) => {
    const { name, text } = (req.body || {}) as { name?: string; text?: string };
    const cleanName = String(name || '').trim();
    const cleanText = String(text || '').trim();
    if (!cleanName || !cleanText) {
      res.status(400).json({ error: 'Name and comment are required.' });
      return;
    }
    const content = await readCmsContent();
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
    await writeCmsContent(content);
    res.status(201).json(newRev);
  });

  // Check if a given pathname matches the private admin URL (returns only boolean)
  app.post('/api/auth/resolve-route', async (req, res) => {
    const { pathname } = (req.body || {}) as { pathname?: string };
    const authRecord = await ensureAdminAuth();
    const candidate = normalizeRoutePath(String(pathname || ''));
    res.json({ isAdminRoute: candidate === authRecord.adminPath });
  });

  // Admin Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = (req.body || {}) as {
      email?: string;
      password?: string;
    };
    const authRecord = await ensureAdminAuth();
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

  app.get('/api/auth/me', async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }
    const authRecord = await ensureAdminAuth();
    const session = verifyAdminToken(token, authRecord);
    if (!session) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.json({
      authenticated: true,
      email: session.email,
      adminPath: authRecord.adminPath,
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = getBearerToken(req);
    if (token) revokedTokens.add(token);
    res.json({ ok: true });
  });

  app.post('/api/auth/password', requireAdmin, async (req, res) => {
    const { currentPassword, newPassword, newEmail } = (req.body || {}) as {
      currentPassword?: string;
      newPassword?: string;
      newEmail?: string;
    };
    const authRecord = await ensureAdminAuth();
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
    await saveAdminAuth(updated);
    res.json({ ok: true, email: updated.email });
  });

  app.post('/api/auth/admin-path', requireAdmin, async (req, res) => {
    const { newPath } = (req.body || {}) as { newPath?: string };
    const normalized = normalizeRoutePath(String(newPath || ''));
    if (!/^\/[a-z0-9][a-z0-9-_]{4,60}$/.test(normalized)) {
      res.status(400).json({
        error:
          'URL path must be 5–60 characters using only letters, numbers, hyphens, or underscores (e.g. /my-secret-portal).',
      });
      return;
    }
    if (RESERVED_PUBLIC_PATHS.has(normalized) || normalized.startsWith('/api')) {
      res.status(400).json({
        error: 'Cannot use /admin or a reserved public page path.',
      });
      return;
    }
    const authRecord = await ensureAdminAuth();
    const updated: AdminAuthRecord = {
      ...authRecord,
      adminPath: normalized,
    };
    await saveAdminAuth(updated);
    res.json({ ok: true, adminPath: updated.adminPath });
  });

  // Admin CMS Write & Reset
  app.put('/api/cms', requireAdmin, async (req, res) => {
    const body = req.body as SiteContent;
    if (!body || typeof body !== 'object' || !body.home || !body.global) {
      res.status(400).json({ error: 'Invalid CMS payload.' });
      return;
    }
    await writeCmsContent(body);
    res.json({ ok: true, content: body });
  });

  app.post('/api/cms/reset', requireAdmin, async (_req, res) => {
    await writeCmsContent(DEFAULT_SITE_CONTENT);
    res.json({ ok: true, content: DEFAULT_SITE_CONTENT });
  });

  // Admin Image Upload (base64 data URL)
  app.post('/api/upload', requireAdmin, (req, res) => {
    const { filename, dataUrl } = (req.body || {}) as {
      filename?: string;
      dataUrl?: string;
    };
    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Missing image data.' });
      return;
    }
    const match =
      /^data:(image\/(?:png|jpeg|jpg|webp|gif|svg\+xml));base64,(.+)$/i.exec(dataUrl);
    if (!match) {
      res.status(400).json({
        error: 'Unsupported image format. Use PNG, JPG, WEBP, GIF, or SVG.',
      });
      return;
    }

    // On Vercel serverless functions, local /tmp files don't persist across requests;
    // return the validated dataUrl so uploaded logos/images always load everywhere.
    if (IS_VERCEL) {
      res.json({ url: dataUrl });
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
    const baseName =
      String(filename || 'image')
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
    } else {
      assets.push(...DEFAULT_BUILTIN_IMAGES);
    }
    if (!IS_VERCEL && fs.existsSync(UPLOADS_DIR)) {
      for (const f of fs.readdirSync(UPLOADS_DIR)) {
        if (/\.(png|jpe?g|webp|gif|svg)$/i.test(f)) {
          assets.push(`/uploads/${f}`);
        }
      }
    }
    res.json({ assets });
  });

  // Admin Inquiries Management
  app.get('/api/inquiries', requireAdmin, async (_req, res) => {
    res.json(await readInquiries());
  });

  app.patch('/api/inquiries/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = (req.body || {}) as { status?: InquiryItem['status'] };
    if (status !== 'new' && status !== 'read' && status !== 'replied') {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }
    const items = await readInquiries();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    items[idx] = { ...items[idx], status };
    await writeInquiries(items);
    res.json(items[idx]);
  });

  app.delete('/api/inquiries/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const items = (await readInquiries()).filter((i) => i.id !== id);
    await writeInquiries(items);
    res.json({ ok: true });
  });

  return { app, uploadsDir: UPLOADS_DIR };
}
