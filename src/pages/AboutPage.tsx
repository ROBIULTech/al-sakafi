import React, { useState } from 'react';
import { ChevronsRight, Star } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { ProjectContactCard } from '../components/SharedSections';
import { SubpageBanner } from '../components/SubpageBanner';
import { useSiteContent } from '../context/SiteContentContext';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectPlan: (planLabel: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onSelectPlan,
}) => {
  const { content } = useSiteContent();
  const ab = content.about;

  const [skillTab, setSkillTab] = useState<'DESIGN' | 'DEVELOPMENT'>('DESIGN');
  const [billingMode, setBillingMode] = useState<'hourly' | 'project'>('hourly');

  const tools = skillTab === 'DESIGN' ? ab.designTools : ab.devTools;
  const pricingCards =
    billingMode === 'hourly' ? ab.pricingHourly : ab.pricingProject;

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="About Us"
        breadcrumbLabel="About Us"
        onNavigate={onNavigate}
      />

      {/* ======================== ABOUT BIO SPLIT ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="flex justify-center lg:col-span-6 lg:justify-start">
            <img
              src={ab.portrait}
              alt={ab.nameHighlight}
              referrerPolicy="no-referrer"
              className="w-full max-w-[490px] object-contain"
            />
          </div>

          <div className="lg:col-span-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {ab.tag}
            </p>
            <h2 className="mt-3 text-[34px] font-bold tracking-tight text-white sm:text-[42px]">
              {ab.namePrefix}{' '}
              <span className="text-[#F20101] underline decoration-[#F20101] decoration-2 underline-offset-[6px]">
                {ab.nameHighlight}
              </span>
            </h2>
            <p className="mt-3 text-[14px] font-medium text-white">{ab.role}</p>
            <p className="mt-3 max-w-[490px] text-[14px] leading-[1.7] text-[#A1A1AA]">
              {ab.bio}
            </p>

            <div className="mt-8 space-y-3.5 text-[14px]">
              {ab.details.map((row, idx) => (
                <div
                  key={`${row.label}-${idx}`}
                  className="grid grid-cols-[110px_24px_1fr] items-center"
                >
                  <span className="text-[#A1A1AA]">{row.label}</span>
                  <span className="text-[#A1A1AA]">:</span>
                  <span className="font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== EDUCATION & EXPERIENCE ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {ab.timelineTag}
          </p>
          <h2 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
            {ab.timelineTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-[14px] leading-[1.6] text-[#A1A1AA]">
            {ab.timelineDesc}
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Center vertical timeline divider */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-16 bottom-6 hidden w-px -translate-x-1/2 bg-[#222222] lg:block"
          >
            <span className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#333333]" />
            <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#333333]" />
            <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#333333]" />
          </div>

          {/* Left Column: My Experience */}
          <div>
            <h3 className="mb-8 text-center text-[22px] font-semibold text-white">
              My Experience
            </h3>
            <div className="space-y-6">
              {ab.experienceItems.map((item) => (
                <div
                  key={item.id || item.title}
                  className={`rounded-md border bg-[#0c0c0c] p-7 ${
                    item.redCorner
                      ? 'border-[#1d1d1d] border-r-[#F20101]/65 border-b-[#F20101]/65'
                      : 'border-[#181818]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A1A1AA]">{item.period}</span>
                    <span className={`font-medium ${item.orgColor}`}>{item.org}</span>
                  </div>
                  <h4 className="mt-4 text-[19px] font-bold text-white">{item.title}</h4>
                  <p className="mt-2.5 text-[13px] leading-[1.65] text-[#A1A1AA]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: My Education */}
          <div>
            <h3 className="mb-8 text-center text-[22px] font-semibold text-white">
              My Education
            </h3>
            <div className="space-y-6">
              {ab.educationItems.map((item) => (
                <div
                  key={item.id || item.title}
                  className={`rounded-md border bg-[#0c0c0c] p-7 ${
                    item.redCorner
                      ? 'border-[#1d1d1d] border-r-[#F20101]/65 border-b-[#F20101]/65'
                      : 'border-[#181818]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#A1A1AA]">{item.period}</span>
                    <span className={`font-medium ${item.orgColor}`}>{item.org}</span>
                  </div>
                  <h4 className="mt-4 text-[19px] font-bold text-white">{item.title}</h4>
                  <p className="mt-2.5 text-[13px] leading-[1.65] text-[#A1A1AA]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SKILLS & FAVORITE TOOLS ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {ab.skillsTag}
          </p>
          <h2 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
            {ab.skillsTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[430px] text-[14px] leading-[1.6] text-[#A1A1AA]">
            {ab.skillsDesc}
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-[#1f1f1f] bg-[#111111] p-1.5">
            {(['DESIGN', 'DEVELOPMENT'] as const).map((tab) => {
              const active = skillTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSkillTab(tab)}
                  className={`rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors whitespace-nowrap cursor-pointer ${
                    active ? 'bg-[#F20101] text-white' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Pill-Oval Tool Cards */}
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {tools.map((tool) => (
            <div
              key={tool.id || tool.name}
              className={`flex flex-col items-center justify-between rounded-full border bg-[#0c0c0c] px-5 py-9 text-center transition-colors ${
                tool.highlighted
                  ? 'border-[#1d1d1d] border-b-[#F20101] border-b-2'
                  : 'border-[#1c1c1c] hover:border-[#F20101]/60'
              }`}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#17161A]">
                <img
                  src={tool.icon}
                  alt={tool.name}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 object-contain"
                />
              </div>
              <div className="mt-8">
                <div className="text-[15px] font-semibold text-white">{tool.name}</div>
                <div className="mt-1.5 text-[24px] font-bold text-[#A1A1AA] tabular-nums">
                  {tool.pct}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================== PRICING PLAN (3 VERTICAL CARDS) ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {ab.pricingTag}
            </p>
            <h2 className="mt-3 max-w-[420px] text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[42px]">
              {ab.pricingTitle}
            </h2>
          </div>

          <div>
            <p className="max-w-[300px] text-[14px] leading-[1.6] text-[#A1A1AA]">
              {ab.pricingDesc}
            </p>
            <div className="mt-5 inline-flex items-center rounded-full border border-[#1f1f1f] bg-[#111111] p-1">
              <button
                type="button"
                onClick={() => setBillingMode('hourly')}
                className={`rounded-full px-5 py-2 text-[12px] font-medium transition-colors cursor-pointer ${
                  billingMode === 'hourly'
                    ? 'bg-[#F20101] text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => setBillingMode('project')}
                className={`rounded-full px-5 py-2 text-[12px] font-medium transition-colors cursor-pointer ${
                  billingMode === 'project'
                    ? 'bg-[#F20101] text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Project Based
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
          {pricingCards.map((plan) => (
            <div
              key={plan.id || plan.name}
              className="relative rounded-md border border-[#1b1b1b] bg-[#090909] p-8 sm:p-10"
            >
              {/* Geometric Corner Brackets */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 h-16 w-16 border-t border-l border-white/40"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 h-16 w-16 border-r border-b border-white/40"
              />

              <h3 className="text-[18px] font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[48px] font-extrabold leading-none text-white tabular-nums">
                  {plan.price}
                </span>
                <span className="text-[13px] text-[#A1A1AA]">{plan.unit}</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlan(`${plan.name} (${plan.price}${plan.unit})`)}
                className={`mt-7 w-full rounded-sm py-3.5 text-[13px] font-semibold transition-colors cursor-pointer ${
                  plan.featured
                    ? 'bg-[#F20101] text-white hover:bg-[#d80000]'
                    : 'bg-[#1a1a1a] text-white hover:bg-[#F20101]'
                }`}
              >
                Get Started Now
              </button>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feat, fIdx) => (
                  <li
                    key={`${feat}-${fIdx}`}
                    className="flex items-center gap-2.5 text-[13px] text-[#A1A1AA]"
                  >
                    <ChevronsRight className="h-3.5 w-3.5 shrink-0 text-white/65" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ======================== WORDS FROM HAPPY CLIENTS ======================== */}
      <section className="overflow-hidden py-20">
        <div className="mx-auto max-w-[1296px] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {ab.testimonialsTag}
          </p>
          <h2 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
            {ab.testimonialsTitle}
          </h2>
          <p className="mx-auto mt-2.5 max-w-[440px] text-[14px] leading-[1.6] text-[#A1A1AA]">
            {ab.testimonialsDesc}
          </p>
        </div>

        {/* Staggered 2-Row Testimonial Cards */}
        <div className="mt-14 space-y-6 px-4">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:flex-nowrap lg:justify-center">
            {ab.happyClientsRow1.map((card) => (
              <div
                key={card.id || card.name}
                className={`w-full max-w-[430px] lg:w-[390px] xl:w-[430px] shrink-0 rounded-xl border border-[#191919] bg-[#0b0b0b] p-7 ${
                  card.dimmed ? 'opacity-45' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                      />
                    ))}
                  </div>
                  <svg
                    width="24"
                    height="20"
                    viewBox="0 0 32 26"
                    fill="currentColor"
                    className="text-white/15"
                  >
                    <path d="M0 15.2C0 6.8 5.2 1.6 13.2 0l1.4 3.4C9.4 4.8 6.8 8 6.4 12.2H13V26H0V15.2zm18.4 0C18.4 6.8 23.6 1.6 31.6 0L33 3.4c-5.2 1.4-7.8 4.6-8.2 8.8h6.6V26H18.4V15.2z" />
                  </svg>
                </div>

                <p className="mt-5 text-[14px] leading-[1.65] text-white/90">
                  {card.quote}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={card.avatar}
                    alt={card.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[14px] font-semibold text-white">{card.name}</div>
                    <div className="text-[11px] text-[#8C8C8C]">{card.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 lg:flex-row lg:flex-nowrap lg:justify-center">
            {ab.happyClientsRow2.map((card) => (
              <div
                key={card.id || card.name}
                className={`w-full max-w-[460px] lg:w-[440px] xl:w-[460px] shrink-0 rounded-xl border border-[#191919] bg-[#0b0b0b] p-7 ${
                  card.dimmed ? 'opacity-45' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                      />
                    ))}
                  </div>
                  <svg
                    width="24"
                    height="20"
                    viewBox="0 0 32 26"
                    fill="currentColor"
                    className="text-white/15"
                  >
                    <path d="M0 15.2C0 6.8 5.2 1.6 13.2 0l1.4 3.4C9.4 4.8 6.8 8 6.4 12.2H13V26H0V15.2zm18.4 0C18.4 6.8 23.6 1.6 31.6 0L33 3.4c-5.2 1.4-7.8 4.6-8.2 8.8h6.6V26H18.4V15.2z" />
                  </svg>
                </div>

                <p className="mt-5 text-[14px] leading-[1.65] text-white/90">
                  {card.quote}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={card.avatar}
                    alt={card.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[14px] font-semibold text-white">{card.name}</div>
                    <div className="text-[11px] text-[#8C8C8C]">{card.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== LET'S START A NEW PROJECT ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <ProjectContactCard />
      </section>
    </div>
  );
};
