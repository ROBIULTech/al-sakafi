import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent } from '../../data/siteContent';
import type { ResumeTab } from '../../data/portfolioData';
import {
  CheckboxField,
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

export const AdminGlobalHomeSection: React.FC<EditorProps> = ({
  draft,
  onChange,
  token,
}) => {
  const g = draft.global;
  const h = draft.home;

  const setGlobal = <K extends keyof SiteContent['global']>(
    key: K,
    val: SiteContent['global'][K]
  ) => onChange({ ...draft, global: { ...g, [key]: val } });

  const setHome = <K extends keyof SiteContent['home']>(
    key: K,
    val: SiteContent['home'][K]
  ) => onChange({ ...draft, home: { ...h, [key]: val } });

  return (
    <div className="space-y-6">
      <SectionCard
        title="Global Brand, Logo, Footer & CV Modal"
        description="Controls the top & footer logo image, brand wordmark, copyright, and downloadable CV modal."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
          <div className="space-y-2">
            <ImageField
              label="Custom Logo Image / Icon (empty = default X icon)"
              value={g.logoImage || ''}
              onChange={(v) => setGlobal('logoImage', v)}
              token={token}
            />
            {g.logoImage && (
              <button
                type="button"
                onClick={() => setGlobal('logoImage', '')}
                className="text-[11px] font-medium text-[#F20101] hover:underline cursor-pointer"
              >
                Reset to Default X Icon
              </button>
            )}
          </div>
          <div className="space-y-4">
            <TextField
              label="Brand Wordmark Text"
              value={g.brandName}
              onChange={(v) => setGlobal('brandName', v)}
            />
            <CheckboxField
              label="Show Brand Wordmark Text Next to Logo"
              checked={g.logoShowText !== false}
              onChange={(checked) => setGlobal('logoShowText', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Footer Big CTA Text"
            value={g.footerCtaText}
            onChange={(v) => setGlobal('footerCtaText', v)}
          />
          <TextField
            label="Copyright Text"
            value={g.copyrightText}
            onChange={(v) => setGlobal('copyrightText', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Designer Credit Label"
            value={g.designerLabel}
            onChange={(v) => setGlobal('designerLabel', v)}
          />
          <TextField
            label="Designer Name"
            value={g.designerName}
            onChange={(v) => setGlobal('designerName', v)}
          />
        </div>

        <TextAreaField
          label="Footer Summary Paragraph"
          value={g.footerDescription}
          onChange={(v) => setGlobal('footerDescription', v)}
          rows={2}
        />

        <div className="border-t border-[#181818] pt-4 space-y-4">
          <h4 className="text-[13px] font-semibold text-[#00BC91]">
            Download CV Modal Content
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="CV Full Name & Role"
              value={g.cvName}
              onChange={(v) => setGlobal('cvName', v)}
            />
            <TextField
              label="CV Location & Phone"
              value={g.cvSubtitle}
              onChange={(v) => setGlobal('cvSubtitle', v)}
            />
          </div>
          <TextAreaField
            label="CV Experience Highlights"
            value={g.cvExperienceHighlights}
            onChange={(v) => setGlobal('cvExperienceHighlights', v)}
            rows={2}
          />
          <TextField
            label="CV Technical Stack"
            value={g.cvTechnicalStack}
            onChange={(v) => setGlobal('cvTechnicalStack', v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Home Hero Section"
        description="Edit the primary banner text, CTA buttons, client proof counter, and portrait image."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Greeting Tag"
            value={h.heroGreeting}
            onChange={(v) => setHome('heroGreeting', v)}
          />
          <TextField
            label="Circular Stamp Text"
            value={h.heroStampText}
            onChange={(v) => setHome('heroStampText', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Hero Headline Line 1"
            value={h.heroHeadlineLine1}
            onChange={(v) => setHome('heroHeadlineLine1', v)}
          />
          <TextField
            label="Hero Headline Line 2"
            value={h.heroHeadlineLine2}
            onChange={(v) => setHome('heroHeadlineLine2', v)}
          />
        </div>

        <TextAreaField
          label="Hero Description"
          value={h.heroDescription}
          onChange={(v) => setHome('heroDescription', v)}
          rows={2}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="Primary Button"
            value={h.heroPrimaryCta}
            onChange={(v) => setHome('heroPrimaryCta', v)}
          />
          <TextField
            label="Secondary Button"
            value={h.heroSecondaryCta}
            onChange={(v) => setHome('heroSecondaryCta', v)}
          />
          <TextField
            label="Circle Button Label"
            value={h.heroCircleText}
            onChange={(v) => setHome('heroCircleText', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Client Stat Count"
            value={h.heroClientCount}
            onChange={(v) => setHome('heroClientCount', v)}
          />
          <TextField
            label="Client Stat Caption"
            value={h.heroClientCaption}
            onChange={(v) => setHome('heroClientCaption', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ImageField
            label="Hero Portrait Image"
            value={h.heroPortrait}
            onChange={(v) => setHome('heroPortrait', v)}
            token={token}
          />
          <ImageField
            label="Supported Clients Avatar Strip"
            value={h.heroAvatars}
            onChange={(v) => setHome('heroAvatars', v)}
            token={token}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Emerald Marquee Ribbon"
        description="Scrolling keywords banner directly below the Home hero."
        action={
          <button
            type="button"
            onClick={() =>
              setHome('marqueeItems', [
                ...h.marqueeItems,
                { text: 'NEW SKILL', outlined: false },
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-semibold text-[#00BC91] hover:border-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Keyword
          </button>
        }
      >
        <div className="space-y-3">
          {h.marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-[#1a1a1a] bg-[#080808] p-3"
            >
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const next = [...h.marqueeItems];
                  next[idx] = { ...next[idx], text: e.target.value };
                  setHome('marqueeItems', next);
                }}
                className="flex-1 min-w-[180px] rounded-md border border-[#202020] bg-[#0e0e0e] px-3 py-2 text-[13px] text-white focus:border-[#00BC91] focus:outline-none"
              />
              <CheckboxField
                label="Outlined Stroke"
                checked={item.outlined}
                onChange={(checked) => {
                  const next = [...h.marqueeItems];
                  next[idx] = { ...next[idx], outlined: checked };
                  setHome('marqueeItems', next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setHome(
                    'marqueeItems',
                    h.marqueeItems.filter((_, i) => i !== idx)
                  )
                }
                aria-label="Remove marquee item"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#222222] bg-[#121212] text-white/60 hover:border-[#F20101] hover:text-[#F20101] cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Home About & Section Headings"
        description="Edit the Home page About Me stats and titles for Services, Resume, Portfolio, Pricing, Contact, and Blog."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="About Tag"
            value={h.aboutTag}
            onChange={(v) => setHome('aboutTag', v)}
          />
          <TextField
            label="Completed Projects Stat"
            value={h.aboutCompletedCount}
            onChange={(v) => setHome('aboutCompletedCount', v)}
          />
          <TextField
            label="Completed Stamp Label"
            value={h.aboutCompletedLabel}
            onChange={(v) => setHome('aboutCompletedLabel', v)}
          />
        </div>

        <TextAreaField
          label="About Headline"
          value={h.aboutHeadline}
          onChange={(v) => setHome('aboutHeadline', v)}
          rows={2}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Award Number"
            value={h.aboutAwardCount}
            onChange={(v) => setHome('aboutAwardCount', v)}
          />
          <TextField
            label="Award Label"
            value={h.aboutAwardLabel}
            onChange={(v) => setHome('aboutAwardLabel', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextAreaField
            label="About Paragraph 1"
            value={h.aboutPara1}
            onChange={(v) => setHome('aboutPara1', v)}
            rows={3}
          />
          <TextAreaField
            label="About Paragraph 2"
            value={h.aboutPara2}
            onChange={(v) => setHome('aboutPara2', v)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-[#181818] pt-4 sm:grid-cols-3">
          <TextField
            label="Services Section Tag"
            value={h.servicesTag}
            onChange={(v) => setHome('servicesTag', v)}
          />
          <TextField
            label="Services Title"
            value={h.servicesTitle}
            onChange={(v) => setHome('servicesTitle', v)}
          />
          <TextField
            label="Services Subtitle"
            value={h.servicesDesc}
            onChange={(v) => setHome('servicesDesc', v)}
          />
          <TextField
            label="Resume Tag"
            value={h.resumeTag}
            onChange={(v) => setHome('resumeTag', v)}
          />
          <TextField
            label="Resume Title"
            value={h.resumeTitle}
            onChange={(v) => setHome('resumeTitle', v)}
          />
          <TextField
            label="Resume Subtitle"
            value={h.resumeDesc}
            onChange={(v) => setHome('resumeDesc', v)}
          />
          <TextField
            label="Portfolio Tag"
            value={h.portfolioTag}
            onChange={(v) => setHome('portfolioTag', v)}
          />
          <TextField
            label="Portfolio Title"
            value={h.portfolioTitle}
            onChange={(v) => setHome('portfolioTitle', v)}
          />
          <TextField
            label="Portfolio Subtitle"
            value={h.portfolioDesc}
            onChange={(v) => setHome('portfolioDesc', v)}
          />
          <TextField
            label="Pricing Tag"
            value={h.pricingTag}
            onChange={(v) => setHome('pricingTag', v)}
          />
          <TextField
            label="Pricing Title"
            value={h.pricingTitle}
            onChange={(v) => setHome('pricingTitle', v)}
          />
          <TextField
            label="Pricing Subtitle"
            value={h.pricingDesc}
            onChange={(v) => setHome('pricingDesc', v)}
          />
          <TextField
            label="Blog Tag"
            value={h.blogTag}
            onChange={(v) => setHome('blogTag', v)}
          />
          <TextField
            label="Blog Title"
            value={h.blogTitle}
            onChange={(v) => setHome('blogTitle', v)}
          />
          <TextField
            label="Blog Subtitle"
            value={h.blogDesc}
            onChange={(v) => setHome('blogDesc', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-[#181818] pt-4 sm:grid-cols-2">
          <TextField
            label="Home Contact Tag"
            value={h.contactTag}
            onChange={(v) => setHome('contactTag', v)}
          />
          <TextField
            label="Home Contact Title"
            value={h.contactTitle}
            onChange={(v) => setHome('contactTitle', v)}
          />
          <TextField
            label="Home Phone Number"
            value={h.contactPhone}
            onChange={(v) => setHome('contactPhone', v)}
          />
          <TextField
            label="Home Phone Label"
            value={h.contactPhoneLabel}
            onChange={(v) => setHome('contactPhoneLabel', v)}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Studio Address (Get Direction Toast)"
              value={h.contactStudioAddress}
              onChange={(v) => setHome('contactStudioAddress', v)}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export const AdminAboutResumeSection: React.FC<EditorProps> = ({
  draft,
  onChange,
  token,
}) => {
  const ab = draft.about;
  const [activeResumeTab, setActiveResumeTab] = useState<ResumeTab>('EDUCATION');
  const [activeToolTab, setActiveToolTab] = useState<'designTools' | 'devTools'>(
    'designTools'
  );

  const setAbout = <K extends keyof SiteContent['about']>(
    key: K,
    val: SiteContent['about'][K]
  ) => onChange({ ...draft, about: { ...ab, [key]: val } });

  const resumeList = draft.resumeData[activeResumeTab] || [];
  const activeTools = ab[activeToolTab];

  return (
    <div className="space-y-6">
      <SectionCard
        title="About Page Profile & Details"
        description="Edit portrait, name, bio, and personal info table on the About Us page."
      >
        <ImageField
          label="About Page Portrait"
          value={ab.portrait}
          onChange={(v) => setAbout('portrait', v)}
          token={token}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="Eyebrow Tag"
            value={ab.tag}
            onChange={(v) => setAbout('tag', v)}
          />
          <TextField
            label="Name Prefix"
            value={ab.namePrefix}
            onChange={(v) => setAbout('namePrefix', v)}
          />
          <TextField
            label="Highlighted Name"
            value={ab.nameHighlight}
            onChange={(v) => setAbout('nameHighlight', v)}
          />
        </div>

        <TextField
          label="Role Subtitle"
          value={ab.role}
          onChange={(v) => setAbout('role', v)}
        />
        <TextAreaField
          label="About Bio"
          value={ab.bio}
          onChange={(v) => setAbout('bio', v)}
          rows={2}
        />

        <div className="space-y-2 border-t border-[#181818] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-white/85">
              Personal Info Rows
            </span>
            <button
              type="button"
              onClick={() =>
                setAbout('details', [...ab.details, { label: 'Location', value: 'Berlin' }])
              }
              className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-2.5 py-1 text-[11px] text-[#00BC91] cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Add Row
            </button>
          </div>
          {ab.details.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={row.label}
                onChange={(e) => {
                  const next = [...ab.details];
                  next[idx] = { ...next[idx], label: e.target.value };
                  setAbout('details', next);
                }}
                placeholder="Label"
                className="w-1/3 rounded-lg border border-[#1f1f1f] bg-[#080808] px-3 py-2 text-[12px] text-white"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => {
                  const next = [...ab.details];
                  next[idx] = { ...next[idx], value: e.target.value };
                  setAbout('details', next);
                }}
                placeholder="Value"
                className="flex-1 rounded-lg border border-[#1f1f1f] bg-[#080808] px-3 py-2 text-[12px] text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setAbout(
                    'details',
                    ab.details.filter((_, i) => i !== idx)
                  )
                }
                aria-label="Remove detail row"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#222222] bg-[#111111] text-white/60 hover:text-[#F20101] cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Home Resume Milestones Tabs"
        description="Manage the Skills, Education, and Experience cards shown on the Home page."
        action={
          <div className="flex items-center gap-2">
            {(['SKILLS', 'EDUCATION', 'EXPERIENCE'] as ResumeTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveResumeTab(tab)}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase cursor-pointer ${
                  activeResumeTab === tab
                    ? 'bg-[#F20101] text-white'
                    : 'border border-[#222222] bg-[#121212] text-white/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-4">
          {resumeList.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CheckboxField
                  label="Red Highlight Header"
                  checked={Boolean(item.highlighted)}
                  onChange={(checked) => {
                    const next = [...resumeList];
                    next[idx] = { ...next[idx], highlighted: checked };
                    onChange({
                      ...draft,
                      resumeData: { ...draft.resumeData, [activeResumeTab]: next },
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...draft,
                      resumeData: {
                        ...draft.resumeData,
                        [activeResumeTab]: resumeList.filter((_, i) => i !== idx),
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-white/60 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <TextField
                  label="Organization / Category"
                  value={item.org}
                  onChange={(v) => {
                    const next = [...resumeList];
                    next[idx] = { ...next[idx], org: v };
                    onChange({
                      ...draft,
                      resumeData: { ...draft.resumeData, [activeResumeTab]: next },
                    });
                  }}
                />
                <TextField
                  label="Period / Proficiency"
                  value={item.period}
                  onChange={(v) => {
                    const next = [...resumeList];
                    next[idx] = { ...next[idx], period: v };
                    onChange({
                      ...draft,
                      resumeData: { ...draft.resumeData, [activeResumeTab]: next },
                    });
                  }}
                />
                <TextField
                  label="Title"
                  value={item.title}
                  onChange={(v) => {
                    const next = [...resumeList];
                    next[idx] = { ...next[idx], title: v };
                    onChange({
                      ...draft,
                      resumeData: { ...draft.resumeData, [activeResumeTab]: next },
                    });
                  }}
                />
              </div>
              <TextAreaField
                label="Description"
                value={item.description}
                onChange={(v) => {
                  const next = [...resumeList];
                  next[idx] = { ...next[idx], description: v };
                  onChange({
                    ...draft,
                    resumeData: { ...draft.resumeData, [activeResumeTab]: next },
                  });
                }}
                rows={2}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = [
                ...resumeList,
                {
                  id: `${activeResumeTab.toLowerCase()}-${Date.now()}`,
                  org: 'Studio / Institute',
                  period: '2025',
                  title: 'New Milestone',
                  description: 'Describe your milestone or expertise.',
                  highlighted: false,
                },
              ];
              onChange({
                ...draft,
                resumeData: { ...draft.resumeData, [activeResumeTab]: next },
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#242424] bg-[#141414] px-3.5 py-2 text-[12px] font-medium text-[#00BC91] hover:border-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {activeResumeTab} Card
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="About Page Experience & Education Timelines"
        description="Edit the dual-column timeline displayed on the About Us page."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="Section Tag"
            value={ab.timelineTag}
            onChange={(v) => setAbout('timelineTag', v)}
          />
          <TextField
            label="Section Title"
            value={ab.timelineTitle}
            onChange={(v) => setAbout('timelineTitle', v)}
          />
          <TextField
            label="Section Subtitle"
            value={ab.timelineDesc}
            onChange={(v) => setAbout('timelineDesc', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pt-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-white">My Experience</h4>
              <button
                type="button"
                onClick={() =>
                  setAbout('experienceItems', [
                    ...ab.experienceItems,
                    {
                      id: `exp-about-${Date.now()}`,
                      period: '2025',
                      org: 'Company',
                      orgColor: 'text-[#00BC91]',
                      title: 'Role Title',
                      desc: 'Summary of responsibilities.',
                      redCorner: false,
                    },
                  ])
                }
                className="text-[11px] font-medium text-[#00BC91] cursor-pointer"
              >
                + Add
              </button>
            </div>
            {ab.experienceItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <CheckboxField
                    label="Red Corner Accent"
                    checked={Boolean(item.redCorner)}
                    onChange={(checked) => {
                      const next = [...ab.experienceItems];
                      next[idx] = { ...next[idx], redCorner: checked };
                      setAbout('experienceItems', next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAbout(
                        'experienceItems',
                        ab.experienceItems.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-white/50 hover:text-[#F20101] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Period"
                    value={item.period}
                    onChange={(v) => {
                      const next = [...ab.experienceItems];
                      next[idx] = { ...next[idx], period: v };
                      setAbout('experienceItems', next);
                    }}
                  />
                  <TextField
                    label="Organization"
                    value={item.org}
                    onChange={(v) => {
                      const next = [...ab.experienceItems];
                      next[idx] = { ...next[idx], org: v };
                      setAbout('experienceItems', next);
                    }}
                  />
                </div>
                <TextField
                  label="Role Title"
                  value={item.title}
                  onChange={(v) => {
                    const next = [...ab.experienceItems];
                    next[idx] = { ...next[idx], title: v };
                    setAbout('experienceItems', next);
                  }}
                />
                <TextAreaField
                  label="Description"
                  value={item.desc}
                  onChange={(v) => {
                    const next = [...ab.experienceItems];
                    next[idx] = { ...next[idx], desc: v };
                    setAbout('experienceItems', next);
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-white">My Education</h4>
              <button
                type="button"
                onClick={() =>
                  setAbout('educationItems', [
                    ...ab.educationItems,
                    {
                      id: `edu-about-${Date.now()}`,
                      period: '2025',
                      org: 'University',
                      orgColor: 'text-[#F20101]',
                      title: 'Degree Title',
                      desc: 'Summary of studies.',
                      redCorner: false,
                    },
                  ])
                }
                className="text-[11px] font-medium text-[#00BC91] cursor-pointer"
              >
                + Add
              </button>
            </div>
            {ab.educationItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <CheckboxField
                    label="Red Corner Accent"
                    checked={Boolean(item.redCorner)}
                    onChange={(checked) => {
                      const next = [...ab.educationItems];
                      next[idx] = { ...next[idx], redCorner: checked };
                      setAbout('educationItems', next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAbout(
                        'educationItems',
                        ab.educationItems.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-white/50 hover:text-[#F20101] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Period"
                    value={item.period}
                    onChange={(v) => {
                      const next = [...ab.educationItems];
                      next[idx] = { ...next[idx], period: v };
                      setAbout('educationItems', next);
                    }}
                  />
                  <TextField
                    label="Institution"
                    value={item.org}
                    onChange={(v) => {
                      const next = [...ab.educationItems];
                      next[idx] = { ...next[idx], org: v };
                      setAbout('educationItems', next);
                    }}
                  />
                </div>
                <TextField
                  label="Degree / Course"
                  value={item.title}
                  onChange={(v) => {
                    const next = [...ab.educationItems];
                    next[idx] = { ...next[idx], title: v };
                    setAbout('educationItems', next);
                  }}
                />
                <TextAreaField
                  label="Description"
                  value={item.desc}
                  onChange={(v) => {
                    const next = [...ab.educationItems];
                    next[idx] = { ...next[idx], desc: v };
                    setAbout('educationItems', next);
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Favorite Tools (Design & Development)"
        description="Edit percentage skill badges and tool icons on the About page."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveToolTab('designTools')}
              className={`rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase cursor-pointer ${
                activeToolTab === 'designTools'
                  ? 'bg-[#F20101] text-white'
                  : 'border border-[#222222] bg-[#121212] text-white/70'
              }`}
            >
              Design
            </button>
            <button
              type="button"
              onClick={() => setActiveToolTab('devTools')}
              className={`rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase cursor-pointer ${
                activeToolTab === 'devTools'
                  ? 'bg-[#F20101] text-white'
                  : 'border border-[#222222] bg-[#121212] text-white/70'
              }`}
            >
              Development
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="Skills Tag"
            value={ab.skillsTag}
            onChange={(v) => setAbout('skillsTag', v)}
          />
          <TextField
            label="Skills Title"
            value={ab.skillsTitle}
            onChange={(v) => setAbout('skillsTitle', v)}
          />
          <TextField
            label="Skills Subtitle"
            value={ab.skillsDesc}
            onChange={(v) => setAbout('skillsDesc', v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {activeTools.map((tool, idx) => (
            <div
              key={tool.id || idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#00BC91]">
                  {activeToolTab === 'designTools' ? 'Design Tab' : 'Development Tab'} · {tool.name}
                </span>
                <CheckboxField
                  label="Bottom Red Highlight"
                  checked={Boolean(tool.highlighted)}
                  onChange={(checked) => {
                    const next = [...activeTools];
                    next[idx] = { ...next[idx], highlighted: checked };
                    setAbout(activeToolTab, next);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Tool Name"
                  value={tool.name}
                  onChange={(v) => {
                    const next = [...activeTools];
                    next[idx] = { ...next[idx], name: v };
                    setAbout(activeToolTab, next);
                  }}
                />
                <TextField
                  label="Percentage"
                  value={tool.pct}
                  onChange={(v) => {
                    const next = [...activeTools];
                    next[idx] = { ...next[idx], pct: v };
                    setAbout(activeToolTab, next);
                  }}
                />
              </div>
              <ImageField
                label="Tool Icon"
                value={tool.icon}
                onChange={(v) => {
                  const next = [...activeTools];
                  next[idx] = { ...next[idx], icon: v };
                  setAbout(activeToolTab, next);
                }}
                token={token}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="About Page Pricing & Happy Clients"
        description="Edit hourly/project tiers and staggered happy client quote cards."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ab.pricingHourly.map((tier, idx) => (
            <div
              key={tier.id || idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <CheckboxField
                label="Featured Red CTA"
                checked={Boolean(tier.featured)}
                onChange={(checked) => {
                  const next = [...ab.pricingHourly];
                  next[idx] = { ...next[idx], featured: checked };
                  setAbout('pricingHourly', next);
                }}
              />
              <TextField
                label="Hourly Plan Name"
                value={tier.name}
                onChange={(v) => {
                  const next = [...ab.pricingHourly];
                  next[idx] = { ...next[idx], name: v };
                  setAbout('pricingHourly', next);
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Price"
                  value={tier.price}
                  onChange={(v) => {
                    const next = [...ab.pricingHourly];
                    next[idx] = { ...next[idx], price: v };
                    setAbout('pricingHourly', next);
                  }}
                />
                <TextField
                  label="Unit"
                  value={tier.unit}
                  onChange={(v) => {
                    const next = [...ab.pricingHourly];
                    next[idx] = { ...next[idx], unit: v };
                    setAbout('pricingHourly', next);
                  }}
                />
              </div>
              <StringListEditor
                label="Features"
                items={tier.features}
                onChange={(nextFeats) => {
                  const next = [...ab.pricingHourly];
                  next[idx] = { ...next[idx], features: nextFeats };
                  setAbout('pricingHourly', next);
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
          {ab.pricingProject.map((tier, idx) => (
            <div
              key={tier.id || idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <CheckboxField
                label="Featured Red CTA"
                checked={Boolean(tier.featured)}
                onChange={(checked) => {
                  const next = [...ab.pricingProject];
                  next[idx] = { ...next[idx], featured: checked };
                  setAbout('pricingProject', next);
                }}
              />
              <TextField
                label="Project Plan Name"
                value={tier.name}
                onChange={(v) => {
                  const next = [...ab.pricingProject];
                  next[idx] = { ...next[idx], name: v };
                  setAbout('pricingProject', next);
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Price"
                  value={tier.price}
                  onChange={(v) => {
                    const next = [...ab.pricingProject];
                    next[idx] = { ...next[idx], price: v };
                    setAbout('pricingProject', next);
                  }}
                />
                <TextField
                  label="Unit"
                  value={tier.unit}
                  onChange={(v) => {
                    const next = [...ab.pricingProject];
                    next[idx] = { ...next[idx], unit: v };
                    setAbout('pricingProject', next);
                  }}
                />
              </div>
              <StringListEditor
                label="Features"
                items={tier.features}
                onChange={(nextFeats) => {
                  const next = [...ab.pricingProject];
                  next[idx] = { ...next[idx], features: nextFeats };
                  setAbout('pricingProject', next);
                }}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-[#181818] pt-4 space-y-3">
          <h4 className="text-[13px] font-semibold text-white">
            Happy Clients Row 1 &amp; Row 2
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {ab.happyClientsRow1.map((card, idx) => (
              <div
                key={card.id || idx}
                className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#00BC91]">
                    Row 1 · Card {idx + 1}
                  </span>
                  <CheckboxField
                    label="Dimmed Edge Style"
                    checked={Boolean(card.dimmed)}
                    onChange={(checked) => {
                      const next = [...ab.happyClientsRow1];
                      next[idx] = { ...next[idx], dimmed: checked };
                      setAbout('happyClientsRow1', next);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Name"
                    value={card.name}
                    onChange={(v) => {
                      const next = [...ab.happyClientsRow1];
                      next[idx] = { ...next[idx], name: v };
                      setAbout('happyClientsRow1', next);
                    }}
                  />
                  <TextField
                    label="Role"
                    value={card.role}
                    onChange={(v) => {
                      const next = [...ab.happyClientsRow1];
                      next[idx] = { ...next[idx], role: v };
                      setAbout('happyClientsRow1', next);
                    }}
                  />
                </div>
                <TextAreaField
                  label="Quote"
                  value={card.quote}
                  onChange={(v) => {
                    const next = [...ab.happyClientsRow1];
                    next[idx] = { ...next[idx], quote: v };
                    setAbout('happyClientsRow1', next);
                  }}
                  rows={2}
                />
                <ImageField
                  label="Client Avatar"
                  value={card.avatar}
                  onChange={(v) => {
                    const next = [...ab.happyClientsRow1];
                    next[idx] = { ...next[idx], avatar: v };
                    setAbout('happyClientsRow1', next);
                  }}
                  token={token}
                />
              </div>
            ))}
            {ab.happyClientsRow2.map((card, idx) => (
              <div
                key={card.id || idx}
                className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#00BC91]">
                    Row 2 · Card {idx + 1}
                  </span>
                  <CheckboxField
                    label="Dimmed Edge Style"
                    checked={Boolean(card.dimmed)}
                    onChange={(checked) => {
                      const next = [...ab.happyClientsRow2];
                      next[idx] = { ...next[idx], dimmed: checked };
                      setAbout('happyClientsRow2', next);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Name"
                    value={card.name}
                    onChange={(v) => {
                      const next = [...ab.happyClientsRow2];
                      next[idx] = { ...next[idx], name: v };
                      setAbout('happyClientsRow2', next);
                    }}
                  />
                  <TextField
                    label="Role"
                    value={card.role}
                    onChange={(v) => {
                      const next = [...ab.happyClientsRow2];
                      next[idx] = { ...next[idx], role: v };
                      setAbout('happyClientsRow2', next);
                    }}
                  />
                </div>
                <TextAreaField
                  label="Quote"
                  value={card.quote}
                  onChange={(v) => {
                    const next = [...ab.happyClientsRow2];
                    next[idx] = { ...next[idx], quote: v };
                    setAbout('happyClientsRow2', next);
                  }}
                  rows={2}
                />
                <ImageField
                  label="Client Avatar"
                  value={card.avatar}
                  onChange={(v) => {
                    const next = [...ab.happyClientsRow2];
                    next[idx] = { ...next[idx], avatar: v };
                    setAbout('happyClientsRow2', next);
                  }}
                  token={token}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
