import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ServiceGridCard, SiteContent } from '../../data/siteContent';
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

export const AdminServicesFaqSection: React.FC<EditorProps> = ({
  draft,
  onChange,
  token,
}) => {
  const sp = draft.servicesPage;
  const sd = draft.servicesDetails;
  const fq = draft.faq;

  const setServicesPage = <K extends keyof SiteContent['servicesPage']>(
    key: K,
    val: SiteContent['servicesPage'][K]
  ) => onChange({ ...draft, servicesPage: { ...sp, [key]: val } });

  const setServicesDetails = <K extends keyof SiteContent['servicesDetails']>(
    key: K,
    val: SiteContent['servicesDetails'][K]
  ) => onChange({ ...draft, servicesDetails: { ...sd, [key]: val } });

  const setFaq = <K extends keyof SiteContent['faq']>(
    key: K,
    val: SiteContent['faq'][K]
  ) => onChange({ ...draft, faq: { ...fq, [key]: val } });

  return (
    <div className="space-y-6">
      <SectionCard
        title="Home Page 4 Service Columns"
        description="Edit the 4 interactive service columns displayed on the Home page."
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
                ...draft,
                homeServices: [
                  ...draft.homeServices,
                  {
                    id: `svc-${Date.now()}`,
                    number: `0${draft.homeServices.length + 1}.`,
                    title: 'New\nService',
                    image: '/assets/images/service-03.png',
                    description: 'Service overview.',
                    deliverables: ['Design & Build'],
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Service
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {draft.homeServices.map((svc, idx) => (
            <div
              key={svc.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#00BC91]">
                  Service {svc.number}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...draft,
                      homeServices: draft.homeServices.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <TextField
                  label="Number"
                  value={svc.number}
                  onChange={(v) => {
                    const next = [...draft.homeServices];
                    next[idx] = { ...next[idx], number: v };
                    onChange({ ...draft, homeServices: next });
                  }}
                />
                <div className="col-span-2">
                  <TextField
                    label="Title (use \n for line break)"
                    value={svc.title}
                    onChange={(v) => {
                      const next = [...draft.homeServices];
                      next[idx] = { ...next[idx], title: v };
                      onChange({ ...draft, homeServices: next });
                    }}
                  />
                </div>
              </div>
              <TextAreaField
                label="Description"
                value={svc.description}
                onChange={(v) => {
                  const next = [...draft.homeServices];
                  next[idx] = { ...next[idx], description: v };
                  onChange({ ...draft, homeServices: next });
                }}
                rows={2}
              />
              <ImageField
                label="Hover Preview Image"
                value={svc.image || ''}
                onChange={(v) => {
                  const next = [...draft.homeServices];
                  next[idx] = { ...next[idx], image: v };
                  onChange({ ...draft, homeServices: next });
                }}
                token={token}
              />
              <StringListEditor
                label="Deliverables"
                items={svc.deliverables}
                onChange={(list) => {
                  const next = [...draft.homeServices];
                  next[idx] = { ...next[idx], deliverables: list };
                  onChange({ ...draft, homeServices: next });
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Services Page Grid Cards"
        description="Edit the 6 numbered service cards on /services."
        action={
          <button
            type="button"
            onClick={() =>
              setServicesPage('cards', [
                ...sp.cards,
                {
                  id: `sp-${Date.now()}`,
                  num: `0${sp.cards.length + 1}`,
                  title: 'NEW SERVICE',
                  desc: 'Description of your service offering.',
                  iconKey: 'box',
                  featured: false,
                },
              ])
            }
            className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Card
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sp.cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <CheckboxField
                  label="Red Highlight CTA"
                  checked={Boolean(card.featured)}
                  onChange={(checked) => {
                    const next = [...sp.cards];
                    next[idx] = { ...next[idx], featured: checked };
                    setServicesPage('cards', next);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setServicesPage(
                      'cards',
                      sp.cards.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Number"
                  value={card.num}
                  onChange={(v) => {
                    const next = [...sp.cards];
                    next[idx] = { ...next[idx], num: v };
                    setServicesPage('cards', next);
                  }}
                />
                <label className="block space-y-1.5">
                  <span className="block text-[12px] font-medium text-white/85">
                    Icon
                  </span>
                  <select
                    value={card.iconKey}
                    onChange={(e) => {
                      const next = [...sp.cards];
                      next[idx] = {
                        ...next[idx],
                        iconKey: e.target.value as ServiceGridCard['iconKey'],
                      };
                      setServicesPage('cards', next);
                    }}
                    className="w-full rounded-lg border border-[#1f1f1f] bg-[#080808] px-3 py-2.5 text-[13px] text-white"
                  >
                    <option value="box">Box</option>
                    <option value="circle-dot">Circle Dot</option>
                    <option value="shield">Shield</option>
                    <option value="grid">Grid</option>
                    <option value="pen">Pen Tool</option>
                    <option value="megaphone">Megaphone</option>
                  </select>
                </label>
              </div>
              <TextField
                label="Title"
                value={card.title}
                onChange={(v) => {
                  const next = [...sp.cards];
                  next[idx] = { ...next[idx], title: v };
                  setServicesPage('cards', next);
                }}
              />
              <TextAreaField
                label="Description"
                value={card.desc}
                onChange={(v) => {
                  const next = [...sp.cards];
                  next[idx] = { ...next[idx], desc: v };
                  setServicesPage('cards', next);
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Home & Services Pricing Plans"
        description="Edit both the Home horizontal pricing cards and the Services page interactive pricing panel."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {draft.homePricingPlans.map((plan, idx) => (
            <div
              key={plan.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#00BC91]">
                  Home Plan {idx + 1}
                </span>
                <CheckboxField
                  label="Featured Red"
                  checked={Boolean(plan.featured)}
                  onChange={(checked) => {
                    const next = [...draft.homePricingPlans];
                    next[idx] = { ...next[idx], featured: checked };
                    onChange({ ...draft, homePricingPlans: next });
                  }}
                />
              </div>
              <TextField
                label="Plan Name"
                value={plan.name}
                onChange={(v) => {
                  const next = [...draft.homePricingPlans];
                  next[idx] = { ...next[idx], name: v };
                  onChange({ ...draft, homePricingPlans: next });
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Price"
                  value={plan.price}
                  onChange={(v) => {
                    const next = [...draft.homePricingPlans];
                    next[idx] = { ...next[idx], price: v };
                    onChange({ ...draft, homePricingPlans: next });
                  }}
                />
                <TextField
                  label="Unit"
                  value={plan.unit}
                  onChange={(v) => {
                    const next = [...draft.homePricingPlans];
                    next[idx] = { ...next[idx], unit: v };
                    onChange({ ...draft, homePricingPlans: next });
                  }}
                />
              </div>
              <StringListEditor
                label="Included Features"
                items={plan.includes}
                onChange={(list) => {
                  const next = [...draft.homePricingPlans];
                  next[idx] = { ...next[idx], includes: list };
                  onChange({ ...draft, homePricingPlans: next });
                }}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-[#181818] pt-4 space-y-4">
          <h4 className="text-[13px] font-semibold text-white">
            Services Page Pricing Selector
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {sp.pricingList.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3.5 space-y-2.5"
              >
                <TextField
                  label="Name"
                  value={item.name}
                  onChange={(v) => {
                    const next = [...sp.pricingList];
                    next[idx] = { ...next[idx], name: v };
                    setServicesPage('pricingList', next);
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Price"
                    value={item.price}
                    onChange={(v) => {
                      const next = [...sp.pricingList];
                      next[idx] = { ...next[idx], price: v };
                      setServicesPage('pricingList', next);
                    }}
                  />
                  <TextField
                    label="Unit"
                    value={item.unit}
                    onChange={(v) => {
                      const next = [...sp.pricingList];
                      next[idx] = { ...next[idx], unit: v };
                      setServicesPage('pricingList', next);
                    }}
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={item.desc}
                  onChange={(v) => {
                    const next = [...sp.pricingList];
                    next[idx] = { ...next[idx], desc: v };
                    setServicesPage('pricingList', next);
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StringListEditor
              label="01 Monthly Features"
              items={sp.monthlyFeatures01}
              onChange={(list) => setServicesPage('monthlyFeatures01', list)}
            />
            <StringListEditor
              label="03 Monthly Features"
              items={sp.monthlyFeatures03}
              onChange={(list) => setServicesPage('monthlyFeatures03', list)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Services Details Page (/services-details)"
        description="Edit case-study images, overview text, stats, and checklist."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ImageField
            label="Hero Banner Image"
            value={sd.heroImage}
            onChange={(v) => setServicesDetails('heroImage', v)}
            token={token}
          />
          <ImageField
            label="Overview Mockup Image"
            value={sd.brochureImage}
            onChange={(v) => setServicesDetails('brochureImage', v)}
            token={token}
          />
          <ImageField
            label="Wide Studio Image"
            value={sd.buildingImage}
            onChange={(v) => setServicesDetails('buildingImage', v)}
            token={token}
          />
          <ImageField
            label="Right Cube Sign Image"
            value={sd.cubeImage}
            onChange={(v) => setServicesDetails('cubeImage', v)}
            token={token}
          />
        </div>

        <TextField
          label="Service Details Title"
          value={sd.title}
          onChange={(v) => setServicesDetails('title', v)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextAreaField
            label="Intro Paragraph 1"
            value={sd.intro1}
            onChange={(v) => setServicesDetails('intro1', v)}
            rows={3}
          />
          <TextAreaField
            label="Intro Paragraph 2"
            value={sd.intro2}
            onChange={(v) => setServicesDetails('intro2', v)}
            rows={3}
          />
        </div>

        <TextField
          label="Overview Heading"
          value={sd.overviewTitle}
          onChange={(v) => setServicesDetails('overviewTitle', v)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextAreaField
            label="Overview Paragraph 1"
            value={sd.overviewPara1}
            onChange={(v) => setServicesDetails('overviewPara1', v)}
            rows={3}
          />
          <TextAreaField
            label="Overview Paragraph 2"
            value={sd.overviewPara2}
            onChange={(v) => setServicesDetails('overviewPara2', v)}
            rows={3}
          />
        </div>

        <TextField
          label="Key Features Heading"
          value={sd.keyFeaturesTitle}
          onChange={(v) => setServicesDetails('keyFeaturesTitle', v)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextAreaField
            label="Feature Paragraph 1"
            value={sd.featurePara1}
            onChange={(v) => setServicesDetails('featurePara1', v)}
            rows={3}
          />
          <TextAreaField
            label="Feature Paragraph 2"
            value={sd.featurePara2}
            onChange={(v) => setServicesDetails('featurePara2', v)}
            rows={3}
          />
          <TextAreaField
            label="Feature Paragraph 3"
            value={sd.featurePara3}
            onChange={(v) => setServicesDetails('featurePara3', v)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {sd.stats.map((st, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-3 space-y-2"
            >
              <CheckboxField
                label="Red Stat Color"
                checked={Boolean(st.red)}
                onChange={(checked) => {
                  const next = [...sd.stats];
                  next[idx] = { ...next[idx], red: checked };
                  setServicesDetails('stats', next);
                }}
              />
              <TextField
                label="Value"
                value={st.value}
                onChange={(v) => {
                  const next = [...sd.stats];
                  next[idx] = { ...next[idx], value: v };
                  setServicesDetails('stats', next);
                }}
              />
              <TextField
                label="Label"
                value={st.label}
                onChange={(v) => {
                  const next = [...sd.stats];
                  next[idx] = { ...next[idx], label: v };
                  setServicesDetails('stats', next);
                }}
              />
            </div>
          ))}
        </div>

        <StringListEditor
          label="Key Features Checklist"
          items={sd.checklist}
          onChange={(list) => setServicesDetails('checklist', list)}
        />
      </SectionCard>

      <SectionCard
        title="FAQ Accordion & Featured Quote"
        description="Shared across Services and Services Details pages."
        action={
          <button
            type="button"
            onClick={() =>
              setFaq('items', [
                ...fq.items,
                {
                  id: `faq-${Date.now()}`,
                  q: 'New question?',
                  a: 'Clear and helpful answer.',
                },
              ])
            }
            className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField label="FAQ Tag" value={fq.tag} onChange={(v) => setFaq('tag', v)} />
          <TextField label="FAQ Title" value={fq.title} onChange={(v) => setFaq('title', v)} />
          <TextField label="FAQ Subtitle" value={fq.desc} onChange={(v) => setFaq('desc', v)} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Featured Reviewer Name"
            value={fq.featuredName}
            onChange={(v) => setFaq('featuredName', v)}
          />
          <TextField
            label="Featured Reviewer Role"
            value={fq.featuredRole}
            onChange={(v) => setFaq('featuredRole', v)}
          />
        </div>
        <TextAreaField
          label="Featured Reviewer Quote"
          value={fq.featuredQuote}
          onChange={(v) => setFaq('featuredQuote', v)}
          rows={2}
        />
        <ImageField
          label="Featured Reviewer Avatar"
          value={fq.featuredAvatar}
          onChange={(v) => setFaq('featuredAvatar', v)}
          token={token}
        />

        <div className="space-y-3 pt-2">
          {fq.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#00BC91]">
                  Question #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFaq(
                      'items',
                      fq.items.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <TextField
                label="Question"
                value={item.q}
                onChange={(v) => {
                  const next = [...fq.items];
                  next[idx] = { ...next[idx], q: v };
                  setFaq('items', next);
                }}
              />
              <TextAreaField
                label="Answer"
                value={item.a}
                onChange={(v) => {
                  const next = [...fq.items];
                  next[idx] = { ...next[idx], a: v };
                  setFaq('items', next);
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

export const AdminWorksSection: React.FC<EditorProps> = ({
  draft,
  onChange,
  token,
}) => {
  const wd = draft.worksDetails;

  const setWorksDetails = <K extends keyof SiteContent['worksDetails']>(
    key: K,
    val: SiteContent['worksDetails'][K]
  ) => onChange({ ...draft, worksDetails: { ...wd, [key]: val } });

  return (
    <div className="space-y-6">
      <SectionCard
        title="Portfolio Projects Grid"
        description="Projects displayed on Home and /works. Toggle Featured for the signature red underline."
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
                ...draft,
                projects: [
                  ...draft.projects,
                  {
                    id: `project-${Date.now()}`,
                    title: 'New Case Study',
                    category: 'Full Stack App',
                    image: '/assets/images/portfolio-1.png',
                    featured: false,
                    client: 'Client Name',
                    year: '2025',
                    summary: 'Project overview and impact.',
                    stack: ['React', 'TypeScript'],
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 rounded-md border border-[#242424] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-[#00BC91] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Project
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {draft.projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="rounded-lg border border-[#1d1d1d] bg-[#080808] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <CheckboxField
                  label="Featured Red Underline"
                  checked={Boolean(proj.featured)}
                  onChange={(checked) => {
                    const next = [...draft.projects];
                    next[idx] = { ...next[idx], featured: checked };
                    onChange({ ...draft, projects: next });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...draft,
                      projects: draft.projects.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-white/50 hover:text-[#F20101] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Title"
                  value={proj.title}
                  onChange={(v) => {
                    const next = [...draft.projects];
                    next[idx] = { ...next[idx], title: v };
                    onChange({ ...draft, projects: next });
                  }}
                />
                <TextField
                  label="Category Pill"
                  value={proj.category}
                  onChange={(v) => {
                    const next = [...draft.projects];
                    next[idx] = { ...next[idx], category: v };
                    onChange({ ...draft, projects: next });
                  }}
                />
                <TextField
                  label="Client"
                  value={proj.client}
                  onChange={(v) => {
                    const next = [...draft.projects];
                    next[idx] = { ...next[idx], client: v };
                    onChange({ ...draft, projects: next });
                  }}
                />
                <TextField
                  label="Year"
                  value={proj.year}
                  onChange={(v) => {
                    const next = [...draft.projects];
                    next[idx] = { ...next[idx], year: v };
                    onChange({ ...draft, projects: next });
                  }}
                />
              </div>
              <TextAreaField
                label="Summary"
                value={proj.summary}
                onChange={(v) => {
                  const next = [...draft.projects];
                  next[idx] = { ...next[idx], summary: v };
                  onChange({ ...draft, projects: next });
                }}
                rows={2}
              />
              <ImageField
                label="Thumbnail Image"
                value={proj.image}
                onChange={(v) => {
                  const next = [...draft.projects];
                  next[idx] = { ...next[idx], image: v };
                  onChange({ ...draft, projects: next });
                }}
                token={token}
              />
              <StringListEditor
                label="Tech Stack"
                items={proj.stack}
                onChange={(list) => {
                  const next = [...draft.projects];
                  next[idx] = { ...next[idx], stack: list };
                  onChange({ ...draft, projects: next });
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Portfolios Details Page (/works-details)"
        description="Edit the full case-study breakdown, images, success rate, and next/prev links."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ImageField
            label="Hero Project Image"
            value={wd.heroImage}
            onChange={(v) => setWorksDetails('heroImage', v)}
            token={token}
          />
          <ImageField
            label="Branding Visual (Pink)"
            value={wd.pinkImage}
            onChange={(v) => setWorksDetails('pinkImage', v)}
            token={token}
          />
          <ImageField
            label="SaaS Visual (Bunny)"
            value={wd.bunnyImage}
            onChange={(v) => setWorksDetails('bunnyImage', v)}
            token={token}
          />
          <ImageField
            label="Mobile App Showcase (Mist)"
            value={wd.mistImage}
            onChange={(v) => setWorksDetails('mistImage', v)}
            token={token}
          />
        </div>

        <TextField
          label="Default Project Title"
          value={wd.defaultTitle}
          onChange={(v) => setWorksDetails('defaultTitle', v)}
        />
        <TextAreaField
          label="Intro Overview"
          value={wd.intro}
          onChange={(v) => setWorksDetails('intro', v)}
          rows={3}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Section 1 Title"
            value={wd.section1Title}
            onChange={(v) => setWorksDetails('section1Title', v)}
          />
          <TextField
            label="Challenges Title"
            value={wd.challengesTitle}
            onChange={(v) => setWorksDetails('challengesTitle', v)}
          />
          <TextAreaField
            label="Section 1 Text"
            value={wd.section1Text}
            onChange={(v) => setWorksDetails('section1Text', v)}
            rows={2}
          />
          <TextAreaField
            label="Challenges Text"
            value={wd.challengesText}
            onChange={(v) => setWorksDetails('challengesText', v)}
            rows={2}
          />
        </div>

        <StringListEditor
          label="Challenges Bullets"
          items={wd.challengesBullets}
          onChange={(list) => setWorksDetails('challengesBullets', list)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="SaaS Section Title"
            value={wd.saasTitle}
            onChange={(v) => setWorksDetails('saasTitle', v)}
          />
          <TextField
            label="Mobile Section Title"
            value={wd.mobileTitle}
            onChange={(v) => setWorksDetails('mobileTitle', v)}
          />
          <TextAreaField
            label="SaaS Description"
            value={wd.saasText}
            onChange={(v) => setWorksDetails('saasText', v)}
            rows={2}
          />
          <TextAreaField
            label="Mobile Description"
            value={wd.mobileText}
            onChange={(v) => setWorksDetails('mobileText', v)}
            rows={2}
          />
        </div>

        <StringListEditor
          label="SaaS Bullets"
          items={wd.saasBullets}
          onChange={(list) => setWorksDetails('saasBullets', list)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-[#181818] pt-4">
          <TextField
            label="Solution Heading"
            value={wd.solutionTitle}
            onChange={(v) => setWorksDetails('solutionTitle', v)}
          />
          <TextField
            label="Success Rate Stat"
            value={wd.solutionRate}
            onChange={(v) => setWorksDetails('solutionRate', v)}
          />
          <TextField
            label="Rate Sub-label"
            value={wd.solutionRateLabel}
            onChange={(v) => setWorksDetails('solutionRateLabel', v)}
          />
        </div>
        <TextAreaField
          label="Solution Description"
          value={wd.solutionText}
          onChange={(v) => setWorksDetails('solutionText', v)}
          rows={2}
        />
        <StringListEditor
          label="Solution Tech Tags"
          items={wd.solutionStack}
          onChange={(list) => setWorksDetails('solutionStack', list)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Prev Post Title"
            value={wd.prevTitle}
            onChange={(v) => setWorksDetails('prevTitle', v)}
          />
          <TextField
            label="Next Post Title"
            value={wd.nextTitle}
            onChange={(v) => setWorksDetails('nextTitle', v)}
          />
        </div>
      </SectionCard>
    </div>
  );
};
