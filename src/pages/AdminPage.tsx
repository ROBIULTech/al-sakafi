import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Home,
  LayoutDashboard,
  Layers,
  Loader2,
  Lock,
  LogOut,
  Menu,
  MessageSquareQuote,
  RotateCcw,
  Save,
  Settings,
  UserCheck,
  X,
} from 'lucide-react';
import { XfolioLogo } from '../components/ActionPillButton';
import type { PageRoute } from '../components/Layout';
import { useSiteContent } from '../context/SiteContentContext';
import type { InquiryItem, SiteContent } from '../data/siteContent';
import { AdminOverviewSection } from '../components/admin/AdminOverviewSection';
import {
  AdminAboutResumeSection,
  AdminGlobalHomeSection,
} from '../components/admin/AdminCoreSections';
import {
  AdminServicesFaqSection,
  AdminWorksSection,
} from '../components/admin/AdminCatalogSections';
import {
  AdminBlogSection,
  AdminSettingsSection,
  AdminTestimonialsContactSection,
} from '../components/admin/AdminEditorialSections';

const TOKEN_STORAGE_KEY = 'xfolio_admin_token';

type AdminTab =
  | 'overview'
  | 'home'
  | 'about'
  | 'services'
  | 'works'
  | 'blog'
  | 'testimonials'
  | 'settings';

const NAV_ITEMS: {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview & Inbox', icon: LayoutDashboard },
  { id: 'home', label: 'Global & Home Hero', icon: Home },
  { id: 'about', label: 'About & Resume', icon: UserCheck },
  { id: 'services', label: 'Services, Pricing & FAQ', icon: Layers },
  { id: 'works', label: 'Portfolios & Details', icon: Briefcase },
  { id: 'blog', label: 'Blog & Reviews', icon: FileText },
  { id: 'testimonials', label: 'Testimonials & Contact', icon: MessageSquareQuote },
  { id: 'settings', label: 'Settings & Backup', icon: Settings },
];

export const AdminPage: React.FC<{
  onNavigate: (route: PageRoute) => void;
  onAdminPathUpdated?: (nextPath: string) => void;
}> = ({ onNavigate, onAdminPathUpdated }) => {
  const { content, saveContent, resetContent } = useSiteContent();

  const [token, setToken] = useState<string>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || ''
  );
  const [checkingAuth, setCheckingAuth] = useState<boolean>(Boolean(token));
  const [adminEmail, setAdminEmail] = useState<string>('robiultech2025@gamil.com');
  const [adminPath, setAdminPath] = useState<string>(() => window.location.pathname);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Workspace state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  // Inquiries inbox state
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const prevContentJsonRef = useRef<string>(JSON.stringify(content));

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content),
    [draft, content]
  );

  // Sync draft only when server content refreshes and user has not made local edits
  useEffect(() => {
    const nextJson = JSON.stringify(content);
    setDraft((prev) => {
      const prevJson = JSON.stringify(prev);
      const wasClean = prevJson === prevContentJsonRef.current;
      return wasClean ? content : prev;
    });
    prevContentJsonRef.current = nextJson;
  }, [content]);

  const fetchInquiries = useCallback(async (authToken: string) => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = (await res.json()) as InquiryItem[];
        setInquiries(data);
      }
    } catch {
      // Ignore fetch errors
    } finally {
      setLoadingInquiries(false);
    }
  }, []);

  // Validate stored token on mount
  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Expired');
        const data = (await res.json()) as {
          authenticated: boolean;
          email?: string;
          adminPath?: string;
        };
        if (!cancelled && data.authenticated) {
          if (data.email) setAdminEmail(data.email);
          if (data.adminPath) setAdminPath(data.adminPath);
          await fetchInquiries(token);
        } else if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken('');
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken('');
        }
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, fetchInquiries]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = (await res.json()) as {
        token?: string;
        email?: string;
        adminPath?: string;
        error?: string;
      };
      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Invalid credentials.');
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      if (data.email) setAdminEmail(data.email);
      if (data.adminPath) setAdminPath(data.adminPath);
      setLoginPassword('');
      await fetchInquiries(data.token);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const activeToken = token;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setMobileNavOpen(false);
    if (activeToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${activeToken}` },
      }).catch(() => {});
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveToast(null);
    try {
      await saveContent(draft, token);
      setSaveToast({ type: 'ok', text: 'All changes published to live site.' });
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes.';
      if (/unauthorized|expired/i.test(msg)) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken('');
      }
      setSaveToast({
        type: 'err',
        text: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setSaving(true);
    setSaveToast(null);
    try {
      const restored = await resetContent(token);
      setDraft(restored);
      setSaveToast({ type: 'ok', text: 'Restored original site defaults.' });
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reset.';
      if (/unauthorized|expired/i.test(msg)) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken('');
      }
      setSaveToast({
        type: 'err',
        text: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateInquiryStatus = async (
    id: string,
    status: InquiryItem['status']
  ) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = (await res.json()) as InquiryItem;
      setInquiries((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#060606] text-white flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-[13px] text-[#A1A1AA]">
          <Loader2 className="h-4 w-4 animate-spin text-[#00BC91]" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  // ======================== LOGIN GATE ========================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#060606] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#1d1d1d] bg-[#0b0b0b] p-7 sm:p-9 shadow-2xl">
          <div className="flex items-center justify-between">
            <XfolioLogo
              brandName={content.global.brandName}
              logoImage={content.global.logoImage}
              showText={content.global.logoShowText}
            />
            <span className="rounded-md border border-[#242424] bg-[#141414] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#00BC91]">
              CMS Admin
            </span>
          </div>

          <h1 className="mt-7 text-[24px] font-bold tracking-tight text-white">
            Sign in to Admin Panel
          </h1>
          <p className="mt-1.5 text-[13px] text-[#8C8C8C]">
            Manage pages, portfolio items, blog articles, pricing, images, and client inquiries.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <label className="block space-y-1.5">
              <span className="block text-[12px] font-medium text-white/85">
                Admin Email
              </span>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full rounded-lg border border-[#222222] bg-[#080808] px-3.5 py-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#00BC91] focus:outline-none"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="block text-[12px] font-medium text-white/85">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-lg border border-[#222222] bg-[#080808] px-3.5 py-3 pr-10 text-[13px] text-white placeholder:text-white/30 focus:border-[#00BC91] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {loginError && (
              <div className="rounded-lg border border-[#F20101]/40 bg-[#F20101]/10 px-3.5 py-2.5 text-[12px] text-[#F20101]">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F20101] py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-white hover:bg-[#d80000] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loginLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>{loginLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-[#1a1a1a] bg-[#080808] p-3.5 text-[11px] leading-relaxed text-[#8C8C8C]">
            Authorized administrator access only. You can update your email, password, and secret URL anytime under <strong className="text-white">Settings &amp; Backup</strong>.
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-[12px] text-white/70 hover:text-[#00BC91] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================== ADMIN WORKSPACE ========================
  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];
  const unreadInquiries = inquiries.filter((i) => i.status === 'new').length;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#080808] p-4">
      <div>
        <div className="flex items-center justify-between px-2 py-2">
          <div
            onClick={() => onNavigate('/')}
            className="cursor-pointer"
            title="Return to Public Site"
          >
            <XfolioLogo
              brandName={draft.global.brandName}
              logoImage={draft.global.logoImage}
              showText={draft.global.logoShowText}
            />
          </div>
          <span className="rounded border border-[#222222] bg-[#121212] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00BC91]">
            Admin
          </span>
        </div>

        <nav className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileNavOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#F20101] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#121212] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.id === 'overview' && unreadInquiries > 0 && (
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                      active
                        ? 'bg-white text-[#F20101]'
                        : 'bg-[#00BC91] text-black'
                    }`}
                  >
                    {unreadInquiries}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#181818] pt-4 space-y-3">
        <div className="px-2">
          <div className="text-[11px] text-[#71717A]">Signed in as</div>
          <div className="truncate text-[12px] font-medium text-white">
            {adminEmail}
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg border border-[#F20101]/35 bg-[#120b0b] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#F20101] hover:border-[#F20101] transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060606] text-white flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 border-r border-[#181818] sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/75 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
        >
          <aside
            className="flex w-[260px] h-full flex-col border-r border-[#181818] bg-[#080808]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 justify-end bg-[#080808] p-2 border-b border-[#181818]">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close sidebar"
                className="p-2 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </aside>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Top Utility Bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[#181818] bg-[#060606]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222222] bg-[#0f0f0f] text-white lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[#71717A]">Admin</span>
              <span className="text-[#71717A]">/</span>
              <span className="font-semibold text-white">{activeNavItem.label}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {saveToast && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium ${
                  saveToast.type === 'ok'
                    ? 'border border-[#00BC91]/40 bg-[#00BC91]/10 text-[#00BC91]'
                    : 'border border-[#F20101]/40 bg-[#F20101]/10 text-[#F20101]'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                {saveToast.text}
              </span>
            )}

            {isDirty && (
              <button
                type="button"
                onClick={() => setDraft(content)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#242424] bg-[#121212] px-3 py-2 text-[12px] font-medium text-white/80 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isDirty}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                isDirty
                  ? 'bg-[#F20101] text-white hover:bg-[#d80000]'
                  : 'border border-[#222222] bg-[#111111] text-white/45 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#242424] bg-[#121212] px-3.5 py-2 text-[12px] font-medium text-white hover:border-[#00BC91] transition-colors cursor-pointer"
            >
              <span>View Live Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#00BC91]" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#F20101]/45 bg-[#160b0b] px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#F20101] hover:border-[#F20101] transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Scrollable Section Body */}
        <main className="mx-auto w-full max-w-[1200px] flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <AdminOverviewSection
              draft={draft}
              inquiries={inquiries}
              loadingInquiries={loadingInquiries}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
              onJumpSection={(sec) => setActiveTab(sec as AdminTab)}
            />
          )}

          {activeTab === 'home' && (
            <AdminGlobalHomeSection
              draft={draft}
              onChange={setDraft}
              token={token}
            />
          )}

          {activeTab === 'about' && (
            <AdminAboutResumeSection
              draft={draft}
              onChange={setDraft}
              token={token}
            />
          )}

          {activeTab === 'services' && (
            <AdminServicesFaqSection
              draft={draft}
              onChange={setDraft}
              token={token}
            />
          )}

          {activeTab === 'works' && (
            <AdminWorksSection
              draft={draft}
              onChange={setDraft}
              token={token}
            />
          )}

          {activeTab === 'blog' && (
            <AdminBlogSection
              draft={draft}
              onChange={setDraft}
              token={token}
            />
          )}

          {activeTab === 'testimonials' && (
            <AdminTestimonialsContactSection
              draft={draft}
              onChange={setDraft}
              token={token}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsSection
              draft={draft}
              adminEmail={adminEmail}
              adminPath={adminPath}
              token={token}
              onEmailChanged={setAdminEmail}
              onAdminPathUpdated={(nextPath) => {
                setAdminPath(nextPath);
                onAdminPathUpdated?.(nextPath);
              }}
              onImportDraft={setDraft}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>
    </div>
  );
};
