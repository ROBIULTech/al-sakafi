import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  KeyRound,
  Link2,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import type { SiteContent } from '../../data/siteContent';
import {
  CheckboxField,
  ConfirmModal,
  SectionCard,
  StringListEditor,
  TextAreaField,
  TextField,
} from './AdminFormControls';
import { ImageField } from './AdminMediaPicker';

interface EditorProps {
  draft: SiteContent;
  onChange: (next: SiteContent) => void;
  token: string;
}

export const AdminBlogSection: React.FC<EditorProps> = ({
  draft,
  onChange,
  token,
}) => {
  const bp = draft.blogPage;
  const bd = draft.blogDetails;

  const setBlogDetails = <K extends keyof SiteContent['blogDetails']>(
    key: K,
    val: SiteContent['blogDetails'][K]
  ) => onChange({ ...draft, blogDetails: { ...bd, [key]: val } });

  return (
    <div className="space-y-6">
      <SectionCard
        title="Home Page Recent Blog Posts (3 Featured)"
        description="Controls the 3 posts shown on the Home page Recent Blog grid."
      >
        <div className="space-y-4">
          {draft.homeBlogPosts.map((post, idx) => (
            <div
              key={post.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <TextField
                  label="Post Title"
                  value={post.title}
                  onChange={(v) => {
                    const next = [...draft.homeBlogPosts];
                    next[idx] = { ...next[idx], title: v };
                    onChange({ ...draft, homeBlogPosts: next });
                  }}
                />
                <TextField
                  label="Date"
                  value={post.date}
                  onChange={(v) => {
                    const next = [...draft.homeBlogPosts];
                    next[idx] = { ...next[idx], date: v };
                    onChange({ ...draft, homeBlogPosts: next });
                  }}
                />
                <TextField
                  label="Author"
                  value={post.author}
                  onChange={(v) => {
                    const next = [...draft.homeBlogPosts];
                    next[idx] = { ...next[idx], author: v };
                    onChange({ ...draft, homeBlogPosts: next });
                  }}
                />
              </div>
              <ImageField
                label="Post Cover Image"
                value={post.image}
                onChange={(v) => {
                  const next = [...draft.homeBlogPosts];
                  next[idx] = { ...next[idx], image: v };
                  onChange({ ...draft, homeBlogPosts: next });
                }}
                token={token}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Blog Archive Grid Cards (/blog)"
        description="Add, update, or remove article cards shown on the /blog page."
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
                ...draft,
                blogPage: {
                  cards: [
                    ...bp.cards,
                    {
                      id: `bc-${Date.now()}`,
                      date: 'December 12, 2025',
                      title: 'New Design & Engineering Article',
                      image: '/assets/images/blog-card-1.png',
                      featuredLink: false,
                    },
                  ],
                },
              })
            }
            className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Article Card
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {bp.cards.map((card, idx) => (
            <div
              key={card.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <CheckboxField
                  label="Blue Highlight Arrow"
                  checked={Boolean(card.featuredLink)}
                  onChange={(checked) => {
                    const next = [...bp.cards];
                    next[idx] = { ...next[idx], featuredLink: checked };
                    onChange({ ...draft, blogPage: { cards: next } });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...draft,
                      blogPage: {
                        cards: bp.cards.filter((_, i) => i !== idx),
                      },
                    })
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField
                  label="Date"
                  value={card.date}
                  onChange={(v) => {
                    const next = [...bp.cards];
                    next[idx] = { ...next[idx], date: v };
                    onChange({ ...draft, blogPage: { cards: next } });
                  }}
                />
                <TextField
                  label="Article Title"
                  value={card.title}
                  onChange={(v) => {
                    const next = [...bp.cards];
                    next[idx] = { ...next[idx], title: v };
                    onChange({ ...draft, blogPage: { cards: next } });
                  }}
                />
              </div>
              <ImageField
                label="Card Thumbnail"
                value={card.image}
                onChange={(v) => {
                  const next = [...bp.cards];
                  next[idx] = { ...next[idx], image: v };
                  onChange({ ...draft, blogPage: { cards: next } });
                }}
                token={token}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Blog Details Article & Visitor Reviews (/blog-details)"
        description="Edit the full article content, images, sidebar tags, and moderate reader comments."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ImageField
            label="Hero Image"
            value={bd.heroImage}
            onChange={(v) => setBlogDetails('heroImage', v)}
            token={token}
          />
          <ImageField
            label="Middle Photo Left"
            value={bd.midImage1}
            onChange={(v) => setBlogDetails('midImage1', v)}
            token={token}
          />
          <ImageField
            label="Middle Photo Right"
            value={bd.midImage2}
            onChange={(v) => setBlogDetails('midImage2', v)}
            token={token}
          />
        </div>

        <TextField
          label="Default Article Title"
          value={bd.defaultTitle}
          onChange={(v) => setBlogDetails('defaultTitle', v)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextAreaField
            label="Intro Paragraph 1"
            value={bd.intro1}
            onChange={(v) => setBlogDetails('intro1', v)}
            rows={3}
          />
          <TextAreaField
            label="Intro Paragraph 2"
            value={bd.intro2}
            onChange={(v) => setBlogDetails('intro2', v)}
            rows={3}
          />
        </div>
        <TextField
          label="Section Subheading"
          value={bd.subheading}
          onChange={(v) => setBlogDetails('subheading', v)}
        />
        <TextAreaField
          label="Subheading Body"
          value={bd.subheadingText}
          onChange={(v) => setBlogDetails('subheadingText', v)}
          rows={3}
        />
        <TextAreaField
          label="Red Callout Quote"
          value={bd.calloutQuote}
          onChange={(v) => setBlogDetails('calloutQuote', v)}
          rows={2}
        />
        <TextAreaField
          label="Closing Paragraph"
          value={bd.closingText}
          onChange={(v) => setBlogDetails('closingText', v)}
          rows={2}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StringListEditor
            label="Article Tags"
            items={bd.tags}
            onChange={(list) => setBlogDetails('tags', list)}
          />
          <StringListEditor
            label="Sidebar Popular Tags"
            items={bd.popularTags}
            onChange={(list) => setBlogDetails('popularTags', list)}
          />
        </div>

        <div className="border-t border-[#181818] pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-semibold text-white">
              Visitor Reviews ({bd.reviews.length})
            </h4>
            <button
              type="button"
              onClick={() =>
                setBlogDetails('reviews', [
                  ...bd.reviews,
                  {
                    id: `rev-${Date.now()}`,
                    name: 'Client Name',
                    date: 'March 24, 2025',
                    avatar: '/assets/images/avatar-esther.png',
                    text: '“Great design and reliable delivery!”',
                  },
                ])
              }
              className="text-[11px] font-medium text-[#00BC91] cursor-pointer"
            >
              + Add Review
            </button>
          </div>
          {bd.reviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#00BC91]">
                  {rev.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setBlogDetails(
                      'reviews',
                      bd.reviews.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <TextField
                  label="Reviewer Name"
                  value={rev.name}
                  onChange={(v) => {
                    const next = [...bd.reviews];
                    next[idx] = { ...next[idx], name: v };
                    setBlogDetails('reviews', next);
                  }}
                />
                <TextField
                  label="Date"
                  value={rev.date}
                  onChange={(v) => {
                    const next = [...bd.reviews];
                    next[idx] = { ...next[idx], date: v };
                    setBlogDetails('reviews', next);
                  }}
                />
              </div>
              <TextAreaField
                label="Comment"
                value={rev.text}
                onChange={(v) => {
                  const next = [...bd.reviews];
                  next[idx] = { ...next[idx], text: v };
                  setBlogDetails('reviews', next);
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export const AdminTestimonialsContactSection: React.FC<EditorProps> = ({
  draft,
  onChange,
  token,
}) => {
  const c = draft.contact;
  const h = draft.home;

  const setContact = <K extends keyof SiteContent['contact']>(
    key: K,
    val: SiteContent['contact'][K]
  ) => onChange({ ...draft, contact: { ...c, [key]: val } });

  return (
    <div className="space-y-6">
      <SectionCard
        title="Contact Us Page Info (/contact)"
        description="Edit phone, email, and office address displayed on the Contact Us card."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Section Tag"
            value={c.tag}
            onChange={(v) => setContact('tag', v)}
          />
          <TextField
            label="Section Headline"
            value={c.title}
            onChange={(v) => setContact('title', v)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="Phone Number"
            value={c.phone}
            onChange={(v) => setContact('phone', v)}
          />
          <TextField
            label="Email Address"
            value={c.email}
            onChange={(v) => setContact('email', v)}
          />
          <TextField
            label="Office Address"
            value={c.address}
            onChange={(v) => setContact('address', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Testimonials Carousel"
        description="Manage client testimonials on Home and Services Details."
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
                ...draft,
                testimonials: [
                  ...draft.testimonials,
                  {
                    id: `t-${Date.now()}`,
                    name: 'New Client',
                    role: 'Founder',
                    avatar: '/assets/images/avatar-ronald.png',
                    quote: '“Outstanding delivery and engineering craft.”',
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Testimonial
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="Eyebrow Tag"
            value={h.testimonialsTag}
            onChange={(v) =>
              onChange({ ...draft, home: { ...h, testimonialsTag: v } })
            }
          />
          <TextField
            label="Section Title"
            value={h.testimonialsTitle}
            onChange={(v) =>
              onChange({ ...draft, home: { ...h, testimonialsTitle: v } })
            }
          />
          <TextField
            label="Subtitle"
            value={h.testimonialsDesc}
            onChange={(v) =>
              onChange({ ...draft, home: { ...h, testimonialsDesc: v } })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pt-2">
          {draft.testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <CheckboxField
                  label="Default Active Red Card"
                  checked={Boolean(t.featured)}
                  onChange={(checked) => {
                    const next = draft.testimonials.map((item, i) => ({
                      ...item,
                      featured: i === idx ? checked : false,
                    }));
                    onChange({ ...draft, testimonials: next });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...draft,
                      testimonials: draft.testimonials.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Client Name"
                  value={t.name}
                  onChange={(v) => {
                    const next = [...draft.testimonials];
                    next[idx] = { ...next[idx], name: v };
                    onChange({ ...draft, testimonials: next });
                  }}
                />
                <TextField
                  label="Role / Title"
                  value={t.role}
                  onChange={(v) => {
                    const next = [...draft.testimonials];
                    next[idx] = { ...next[idx], role: v };
                    onChange({ ...draft, testimonials: next });
                  }}
                />
              </div>
              <TextAreaField
                label="Quote"
                value={t.quote}
                onChange={(v) => {
                  const next = [...draft.testimonials];
                  next[idx] = { ...next[idx], quote: v };
                  onChange({ ...draft, testimonials: next });
                }}
                rows={2}
              />
              <ImageField
                label="Client Avatar"
                value={t.avatar}
                onChange={(v) => {
                  const next = [...draft.testimonials];
                  next[idx] = { ...next[idx], avatar: v };
                  onChange({ ...draft, testimonials: next });
                }}
                token={token}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

interface SettingsSectionProps {
  draft: SiteContent;
  adminEmail: string;
  adminPath: string;
  token: string;
  onEmailChanged: (nextEmail: string) => void;
  onAdminPathUpdated: (nextPath: string) => void;
  onImportDraft: (next: SiteContent) => void;
  onResetDefaults: () => Promise<void>;
}

export const AdminSettingsSection: React.FC<SettingsSectionProps> = ({
  draft,
  adminEmail,
  adminPath,
  token,
  onEmailChanged,
  onAdminPathUpdated,
  onImportDraft,
  onResetDefaults,
}) => {
  const [newEmail, setNewEmail] = useState(adminEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [pathInput, setPathInput] = useState(adminPath);
  const [pathMsg, setPathMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [importError, setImportError] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    setPathInput(adminPath);
  }, [adminPath]);

  const fullAdminUrl = `${window.location.origin}${adminPath}`;

  const handleCopyAdminUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullAdminUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleAdminPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPathMsg(null);
    try {
      const res = await fetch('/api/auth/admin-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPath: pathInput }),
      });
      const data = (await res.json()) as { adminPath?: string; error?: string };
      if (!res.ok || !data.adminPath) {
        throw new Error(data.error || 'Failed to update admin URL.');
      }
      onAdminPathUpdated(data.adminPath);
      setPathInput(data.adminPath);
      setPathMsg({
        type: 'ok',
        text: `Private admin URL updated to ${data.adminPath}`,
      });
    } catch (err) {
      setPathMsg({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to update admin URL.',
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newEmail,
        }),
      });
      const data = (await res.json()) as { email?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update credentials.');
      }
      if (data.email) onEmailChanged(data.email);
      setCurrentPassword('');
      setNewPassword('');
      setPassMsg({ type: 'ok', text: 'Admin credentials updated successfully.' });
    } catch (err) {
      setPassMsg({
        type: 'err',
        text: err instanceof Error ? err.message : 'Update failed.',
      });
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xfolio-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '')) as SiteContent;
        if (!parsed.global || !parsed.home || !parsed.projects) {
          throw new Error('Invalid backup structure.');
        }
        onImportDraft(parsed);
      } catch {
        setImportError('Selected file is not a valid XFOLIO CMS JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Private Admin Access URL"
        description="This secret URL is hidden from the public website and footer. Bookmark it or customize the path below."
      >
        <div className="space-y-4 max-w-2xl">
          <div>
            <span className="mb-1.5 block text-[12px] font-medium text-white/80">
              Current Private Admin URL
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={fullAdminUrl}
                className="flex-1 rounded-lg border border-[#222222] bg-[#080808] px-3.5 py-2.5 font-mono text-[12px] text-[#00BC91] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyAdminUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#242424] bg-[#141414] px-4 py-2.5 text-[12px] font-medium text-white hover:border-[#00BC91] transition-colors cursor-pointer shrink-0"
              >
                {copiedUrl ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#00BC91]" />
                    <span className="text-[#00BC91]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#00BC91]" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleAdminPathSubmit} className="space-y-3 pt-2 border-t border-[#181818]">
            <TextField
              label="Change Secret URL Path (e.g. /my-private-studio-99)"
              value={pathInput}
              onChange={setPathInput}
              placeholder="/my-private-portal"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-[#242424] bg-[#141414] px-4 py-2.5 text-[12px] font-semibold text-white hover:border-[#00BC91] transition-colors cursor-pointer"
            >
              <Link2 className="h-4 w-4 text-[#00BC91]" />
              Update Private URL
            </button>

            {pathMsg && (
              <p
                className={`text-[12px] font-medium ${
                  pathMsg.type === 'ok' ? 'text-[#00BC91]' : 'text-[#F20101]'
                }`}
              >
                {pathMsg.text}
              </p>
            )}
          </form>
        </div>
      </SectionCard>

      <SectionCard
        title="Admin Credentials & Security"
        description="Update your admin login email or change the default password."
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <TextField
            label="Admin Login Email"
            type="email"
            value={newEmail}
            onChange={setNewEmail}
          />
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
          />
          <TextField
            label="New Password (min 4 characters)"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#F20101] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-[#d80000] cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            Update Credentials
          </button>

          {passMsg && (
            <p
              className={`text-[12px] font-medium ${
                passMsg.type === 'ok' ? 'text-[#00BC91]' : 'text-[#F20101]'
              }`}
            >
              {passMsg.text}
            </p>
          )}
        </form>
      </SectionCard>

      <SectionCard
        title="Backup, Restore & Default Reset"
        description="Download a full JSON snapshot of all pages or restore the original XFOLIO template."
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 rounded-lg border border-[#242424] bg-[#141414] px-4 py-2.5 text-[12px] font-medium text-white hover:border-[#00BC91] cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#00BC91]" />
            Export JSON Backup
          </button>

          <label className="inline-flex items-center gap-2 rounded-lg border border-[#242424] bg-[#141414] px-4 py-2.5 text-[12px] font-medium text-white hover:border-[#00BC91] cursor-pointer">
            <Upload className="h-4 w-4 text-[#00BC91]" />
            Import JSON into Draft
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#F20101]/40 bg-[#F20101]/10 px-4 py-2.5 text-[12px] font-medium text-[#F20101] hover:bg-[#F20101] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All Content to Default
          </button>
        </div>

        {importError && (
          <p className="text-[12px] text-[#F20101]">{importError}</p>
        )}

        <div className="flex items-center gap-2 pt-2 text-[12px] text-[#8C8C8C]">
          <CheckCircle2 className="h-4 w-4 text-[#00BC91]" />
          <span>
            Imported drafts can be reviewed across tabs before clicking &ldquo;Save Changes&rdquo;.
          </span>
        </div>
      </SectionCard>

      <ConfirmModal
        open={resetConfirmOpen}
        title="Reset All Site Content?"
        description="This will immediately overwrite all edited text, images, projects, blogs, and settings with the original XFOLIO template defaults."
        confirmLabel="Yes, Reset to Default"
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          setResetConfirmOpen(false);
          void onResetDefaults();
        }}
      />
    </div>
  );
};
