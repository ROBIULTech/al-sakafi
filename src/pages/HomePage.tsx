import React, { useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  ChevronsRight,
  User,
  Star,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { ActionPillButton } from '../components/ActionPillButton';
import { PageRoute } from '../components/Layout';
import {
  BlogPost,
  ProjectItem,
  ResumeTab,
  ServiceItem,
} from '../data/portfolioData';
import { useSiteContent } from '../context/SiteContentContext';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectProject: (project: ProjectItem) => void;
  onSelectBlog: (post: BlogPost) => void;
  onSelectService: (service: ServiceItem) => void;
  onOpenCv: () => void;
  onSelectPlan: (planLabel: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProject,
  onSelectBlog,
  onSelectService,
  onOpenCv,
  onSelectPlan,
}) => {
  const { content, submitInquiry } = useSiteContent();
  const h = content.home;

  const [activeServiceId, setActiveServiceId] = useState<string>('frontend-3');
  const [activeResumeTab, setActiveResumeTab] = useState<ResumeTab>('EDUCATION');
  const defaultTestimonialId =
    content.testimonials.find((t) => t.featured)?.id ||
    content.testimonials[0]?.id ||
    't-3';
  const [activeTestimonialId, setActiveTestimonialId] =
    useState<string>(defaultTestimonialId);
  const [directionToast, setDirectionToast] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitted'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInquiry({
      firstName: formData.firstName,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
      source: 'home',
    });
    setFormStatus('submitted');
    setFormData({
      firstName: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    });
  };

  const handleGetDirection = () => {
    setDirectionToast(true);
    setTimeout(() => setDirectionToast(false), 3800);
  };

  const timelineItems = content.resumeData[activeResumeTab] || [];
  const featuredBlog = content.homeBlogPosts[2];

  return (
    <>
      {/* ======================== HERO SECTION ======================== */}
      <div className="bg-[#000000]">
        <section className="mx-auto max-w-[1296px] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            {/* Left Column */}
            <div className="pb-14 lg:col-span-7 lg:pb-20">
              <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#00BC91]">
                {h.heroGreeting}
              </p>

              <h1 className="mt-4 text-[40px] font-extrabold uppercase leading-[1.08] tracking-[-0.02em] text-white sm:text-[54px] xl:text-[62px]">
                {h.heroHeadlineLine1}
                <br />
                {h.heroHeadlineLine2}
              </h1>

              <p className="mt-6 max-w-[420px] text-[15px] leading-[1.65] text-[#A1A1AA]">
                {h.heroDescription}
              </p>

              {/* Hero CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="rounded-full bg-[#F20101] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-[#dc0000] whitespace-nowrap cursor-pointer"
                >
                  {h.heroPrimaryCta}
                </button>
                <button
                  type="button"
                  onClick={onOpenCv}
                  className="rounded-full border border-[#00BC91]/55 bg-transparent px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-[#00BC91] hover:bg-[#00BC91]/10 whitespace-nowrap cursor-pointer"
                >
                  {h.heroSecondaryCta}
                </button>
              </div>

              {/* Bottom Hero Row: Stamp + Red Circle + 25k+ Social Proof */}
              <div className="mt-12 flex flex-wrap items-center gap-8 sm:gap-10">
                <div className="flex items-center">
                  {/* Rotating Visual Designer Circular Stamp */}
                  <div className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full border border-white/15 bg-[#050505]">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-[96px] w-[96px] animate-spin-slow"
                      aria-hidden="true"
                    >
                      <defs>
                        <path
                          id="visualDesignerCircleHome"
                          d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                        />
                      </defs>
                      <text
                        fill="#FFFFFF"
                        fontSize="8.3"
                        fontWeight="600"
                        letterSpacing="2.2"
                      >
                        <textPath href="#visualDesignerCircleHome">
                          {h.heroStampText}
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-white/25">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="white"
                        aria-hidden="true"
                      >
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Overlapping Red Circle "View Works" */}
                  <button
                    type="button"
                    onClick={() => onNavigate('/works')}
                    className="-ml-3 flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full bg-[#F20101] text-white transition-transform duration-200 hover:scale-105 cursor-pointer shadow-lg"
                  >
                    <ArrowUpRight className="h-5 w-5 stroke-[1.75]" />
                    <span className="mt-1 text-[12px] font-medium">{h.heroCircleText}</span>
                  </button>
                </div>

                {/* Client Avatars + 25k+ */}
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={h.heroAvatars}
                      alt="Supported clients"
                      referrerPolicy="no-referrer"
                      className="h-[46px] w-auto object-contain"
                    />
                    <span className="text-[28px] font-extrabold tracking-tight text-white tabular-nums">
                      {h.heroClientCount}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[185px] text-[13px] leading-[1.45] text-[#A1A1AA]">
                    {h.heroClientCaption}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Portrait */}
            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <img
                src={h.heroPortrait}
                alt="Subrata — Full Stack Web Developer"
                referrerPolicy="no-referrer"
                className="w-full max-w-[540px] object-contain object-bottom"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ======================== EMERALD MARQUEE RIBBON ======================== */}
      <div className="w-full overflow-hidden bg-[#00BC91] py-5">
        <div className="animate-marquee items-center">
          {[0, 1, 2, 3].map((loopIdx) => (
            <div key={loopIdx} className="flex items-center">
              {h.marqueeItems.map((item, idx) => (
                <React.Fragment key={`${loopIdx}-${idx}`}>
                  <span
                    className={`px-6 text-[26px] sm:text-[32px] font-extrabold uppercase tracking-[0.03em] whitespace-nowrap ${
                      item.outlined ? 'text-stroke-white' : 'text-white'
                    }`}
                  >
                    {item.text}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-[7px] w-[16px] border-[1.5px] border-white/85"
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======================== ABOUT ME ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {h.aboutTag}
            </p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.18] tracking-[-0.02em] text-white sm:text-[40px] lg:text-[44px]">
              {h.aboutHeadline}
            </h2>
          </div>

          <div className="flex flex-col items-start lg:col-span-5 lg:items-end">
            <div className="relative inline-block">
              <div className="text-[84px] font-extrabold leading-none tracking-[-0.03em] text-[#F20101] sm:text-[108px] lg:text-[118px] tabular-nums">
                {h.aboutCompletedCount}
              </div>
              <div className="-mt-3 ml-auto w-fit -rotate-[12deg] rounded-full border border-white/25 bg-[#060606] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-white/90">
                {h.aboutCompletedLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* 12+ AWARD Outline Graphic */}
          <div className="flex justify-center lg:col-span-6">
            <div className="-rotate-[18deg] select-none text-center">
              <div className="text-stroke-red text-[80px] font-extrabold leading-[0.9] sm:text-[104px] tabular-nums">
                {h.aboutAwardCount}
              </div>
              <div className="text-stroke-muted text-[60px] font-extrabold uppercase leading-[0.95] tracking-[0.04em] sm:text-[82px]">
                {h.aboutAwardLabel}
              </div>
            </div>
          </div>

          {/* About Prose & CTA */}
          <div className="lg:col-span-6">
            <p className="max-w-[560px] text-[15px] leading-[1.7] text-[#A1A1AA]">
              {h.aboutPara1}
            </p>
            <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-[#A1A1AA]">
              {h.aboutPara2}
            </p>
            <div className="mt-8">
              <ActionPillButton
                label="ABOUT ME"
                onClick={() => onNavigate('/about')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================== OUR SERVICES ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {h.servicesTag}
            </p>
            <h2 className="mt-3 max-w-[540px] text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[40px]">
              {h.servicesTitle}
            </h2>
          </div>

          <div className="max-w-[340px]">
            <p className="text-[14px] leading-[1.6] text-[#A1A1AA]">
              {h.servicesDesc}
            </p>
            <div className="mt-5">
              <ActionPillButton
                label="VIEW MORE"
                onClick={() => onNavigate('/services')}
              />
            </div>
          </div>
        </div>

        {/* 4-Column Service Cards */}
        <div className="mt-14 grid grid-cols-1 border border-[#1a1a1a] bg-[#060606] sm:grid-cols-2 lg:grid-cols-4 [&>*]:border-[#1a1a1a] sm:[&>*:nth-child(odd)]:border-r lg:[&>*]:border-r lg:[&>*:last-child]:border-r-0 [&>*:not(:first-child)]:border-t sm:[&>*:nth-child(2)]:border-t-0 lg:[&>*]:border-t-0">
          {content.homeServices.map((service) => {
            const isActive = activeServiceId === service.id;
            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveServiceId(service.id)}
                onClick={() => onSelectService(service)}
                className="group flex min-h-[370px] flex-col justify-between p-7 transition-colors duration-200 hover:bg-[#0b0b0b] cursor-pointer"
              >
                <div>
                  <span className="text-[15px] font-medium text-white/80 tabular-nums">
                    {service.number}
                  </span>

                  {isActive && service.image && (
                    <div className="mt-7 overflow-hidden rounded-xl bg-[#111111]">
                      <img
                        src={service.image}
                        alt={service.title.replace(/\n/g, ' ')}
                        referrerPolicy="no-referrer"
                        className="h-[145px] w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="whitespace-pre-line text-[21px] font-semibold leading-[1.3] text-white">
                    {service.title}
                  </h3>

                  {isActive && (
                    <div className="mt-5 flex items-center justify-between text-[13px] font-medium text-[#F20101]">
                      <span>View More</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================== RESUME TIMELINE ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {h.resumeTag}
          </p>
          <h2 className="mt-3 text-[32px] font-bold leading-[1.18] tracking-[-0.02em] text-white sm:text-[42px]">
            {h.resumeTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-[14px] leading-[1.6] text-[#A1A1AA]">
            {h.resumeDesc}
          </p>

          {/* Segmented Pill Switcher */}
          <div className="mt-8 inline-flex items-center rounded-full border border-[#1f1f1f] bg-[#111111] p-1.5">
            {(['SKILLS', 'EDUCATION', 'EXPERIENCE'] as ResumeTab[]).map((tab) => {
              const active = activeResumeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveResumeTab(tab)}
                  className={`rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#F20101] text-white'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2x2 Timeline Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {timelineItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-sm border border-[#1a1a1a] bg-[#0d0d0d]"
            >
              <div
                className={`flex items-center justify-between px-7 py-4 text-[14px] font-medium ${
                  item.highlighted
                    ? 'bg-[#F20101] text-white'
                    : 'bg-[#161616] text-white/80'
                }`}
              >
                <span>{item.org}</span>
                <span className="tabular-nums">{item.period}</span>
              </div>
              <div className="px-7 py-8">
                <h3 className="text-[20px] font-bold text-white">{item.title}</h3>
                <p className="mt-3 max-w-[460px] text-[14px] leading-[1.65] text-[#A1A1AA]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================== LATEST PORTFOLIO ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {h.portfolioTag}
            </p>
            <h2 className="mt-3 max-w-[440px] text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[40px]">
              {h.portfolioTitle}
            </h2>
          </div>

          <div className="max-w-[330px]">
            <p className="text-[14px] leading-[1.6] text-[#A1A1AA]">
              {h.portfolioDesc}
            </p>
            <div className="mt-5">
              <ActionPillButton
                label="VIEW MORE"
                onClick={() => onNavigate('/works')}
              />
            </div>
          </div>
        </div>

        {/* 2x2 Portfolio Grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
          {content.projects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#111111]">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="aspect-[636/580] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {!project.featured && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex h-[126px] w-[126px] items-center justify-center rounded-full bg-[#F20101] text-center text-[11px] font-bold uppercase tracking-wider text-white shadow-xl">
                      VIEW DETAILS
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <h3
                  className={`text-[24px] font-bold tracking-tight transition-colors ${
                    project.featured
                      ? 'text-[#F20101] underline decoration-[#F20101] decoration-2 underline-offset-[6px]'
                      : 'text-white group-hover:text-[#F20101]'
                  }`}
                >
                  {project.title}
                </h3>

                <span className="rounded-full border border-white/25 px-5 py-2 text-[12px] font-medium text-white/90 whitespace-nowrap shrink-0">
                  {project.category}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ======================== PRICING PLAN ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Sticky/Summary Column */}
          <div className="lg:col-span-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {h.pricingTag}
            </p>
            <h2 className="mt-3 max-w-[380px] text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[42px]">
              {h.pricingTitle}
            </h2>
            <p className="mt-4 max-w-[370px] text-[14px] leading-[1.65] text-[#A1A1AA]">
              {h.pricingDesc}
            </p>

            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="mt-10 flex h-[118px] w-[118px] flex-col items-center justify-center rounded-full bg-[#F20101] text-white transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <ArrowUpRight className="h-5 w-5 stroke-[1.75]" />
              <span className="mt-1 text-[13px] font-medium">Contact Us</span>
            </button>
          </div>

          {/* Right Horizontal Pricing Cards */}
          <div className="space-y-5 lg:col-span-7">
            {content.homePricingPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col justify-between gap-6 rounded-xl border border-[#1d1d1d] bg-[#0d0d0d] p-6 sm:flex-row sm:items-center sm:p-7"
              >
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-[18px] font-semibold text-white">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-[42px] font-extrabold leading-none tracking-tight text-white tabular-nums">
                        {plan.price}
                      </span>
                      <span className="text-[12px] text-[#A1A1AA]">{plan.unit}</span>
                    </div>
                  </div>

                  <div className="mt-7">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectPlan(`${plan.name} (${plan.price}${plan.unit})`)
                      }
                      className={`rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-white transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                        plan.featured
                          ? 'bg-[#F20101] hover:bg-[#d80000]'
                          : 'bg-[#222222] hover:bg-[#F20101]'
                      }`}
                    >
                      GET STARTED
                    </button>
                  </div>
                </div>

                {/* Right Inner Includes Box */}
                <div className="rounded-lg border border-[#1d1d1d] bg-[#121212] p-5 sm:w-[310px]">
                  <h4 className="text-[14px] font-semibold text-white">What&apos;s Include:</h4>
                  <ul className="mt-4 space-y-2.5">
                    {plan.includes.map((inc, idx) => (
                      <li
                        key={`${inc}-${idx}`}
                        className="flex items-center gap-2 text-[13px] text-[#A1A1AA]"
                      >
                        <ChevronsRight className="h-3.5 w-3.5 shrink-0 text-white/70" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CONTACT ME ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-b from-[#F20101]/55 via-[#241111] to-[#1a1a1a] p-[1px]">
          <div className="rounded-2xl bg-[#0c0c0c] p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
                    {h.contactTag}
                  </p>
                  <h2 className="mt-3 max-w-[320px] text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[42px]">
                    {h.contactTitle}
                  </h2>
                </div>

                <div className="mt-14 lg:mt-28">
                  <a
                    href={`tel:${h.contactPhone.replace(/[^+\d]/g, '')}`}
                    className="block text-[20px] font-bold text-white hover:text-[#00BC91] transition-colors tabular-nums"
                  >
                    {h.contactPhone}
                  </a>
                  <p className="mt-1 text-[12px] text-[#8C8C8C]">{h.contactPhoneLabel}</p>

                  <div className="mt-6">
                    <ActionPillButton
                      label="GET DIRECTION"
                      variant="outline"
                      onClick={handleGetDirection}
                    />
                  </div>

                  {directionToast && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#00BC91]/40 bg-[#00BC91]/10 px-4 py-2 text-xs text-[#00BC91]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{h.contactStudioAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7">
                <form onSubmit={handleContactSubmit} className="space-y-9">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="homeFirstName"
                        className="block text-[13px] font-medium text-white"
                      >
                        First Name <span className="text-[#F20101]">*</span>
                      </label>
                      <input
                        id="homeFirstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="Your full name"
                        className="mt-2.5 w-full border-b border-white/15 bg-transparent pb-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#F20101] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="homeEmail"
                        className="block text-[13px] font-medium text-white"
                      >
                        Email Address <span className="text-[#F20101]">*</span>
                      </label>
                      <input
                        id="homeEmail"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Your email Address"
                        className="mt-2.5 w-full border-b border-white/15 bg-transparent pb-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#F20101] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="homePhone"
                        className="block text-[13px] font-medium text-white"
                      >
                        Phone Number <span className="text-[#F20101]">*</span>
                      </label>
                      <input
                        id="homePhone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Your number"
                        className="mt-2.5 w-full border-b border-white/15 bg-transparent pb-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#F20101] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="homeService"
                        className="block text-[13px] font-medium text-white"
                      >
                        Choose Service <span className="text-[#F20101]">*</span>
                      </label>
                      <select
                        id="homeService"
                        required
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="mt-2.5 w-full border-b border-white/15 bg-[#0c0c0c] pb-3 text-[13px] text-white/80 focus:border-[#F20101] focus:outline-none"
                      >
                        <option value="" className="bg-[#0c0c0c] text-white/50">
                          Select a service
                        </option>
                        {content.homeServices.map((s) => {
                          const label = s.title.replace(/\n/g, ' ');
                          return (
                            <option key={s.id} value={label} className="bg-[#0c0c0c]">
                              {label}
                            </option>
                          );
                        })}
                        <option value="UI/UX Design" className="bg-[#0c0c0c]">
                          UI/UX Design
                        </option>
                        {content.homePricingPlans.map((p) => {
                          const label = `${p.name} (${p.price}${p.unit})`;
                          return (
                            <option key={p.id} value={label} className="bg-[#0c0c0c]">
                              {p.name} ({p.price} {p.unit})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="homeMessage"
                      className="block text-[13px] font-medium text-white"
                    >
                      Message <span className="text-[#F20101]">*</span>
                    </label>
                    <textarea
                      id="homeMessage"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Write your message here"
                      className="mt-2.5 w-full resize-none border-b border-white/15 bg-transparent pb-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#F20101] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <ActionPillButton label="SEND MESSAGE" type="submit" />

                    {formStatus === 'submitted' && (
                      <div className="inline-flex items-center gap-2 text-xs font-medium text-[#00BC91]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Message received! We will get back to you shortly.</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section className="overflow-hidden py-24">
        <div className="mx-auto max-w-[1296px] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {h.testimonialsTag}
          </p>
          <h2 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
            {h.testimonialsTitle}
          </h2>
          <p className="mt-2 text-[14px] text-[#A1A1AA]">
            {h.testimonialsDesc}
          </p>
        </div>

        <div className="mt-16 flex items-start gap-6 overflow-x-auto px-4 pt-5 pb-4 lg:overflow-visible lg:justify-center xl:-mx-32">
          {content.testimonials.map((t) => {
            const isActive = activeTestimonialId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTestimonialId(t.id)}
                className={`w-[320px] sm:w-[420px] lg:w-[450px] shrink-0 cursor-pointer transition-transform duration-200 ${
                  isActive ? '-translate-y-4' : 'hover:-translate-y-1'
                }`}
              >
                <div
                  className={`rounded-xl p-8 transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#F20101] text-white shadow-2xl'
                      : 'border border-[#1c1c1c] bg-[#0b0b0b] text-white/85'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-4 w-4 ${
                            isActive
                              ? 'fill-white text-white'
                              : 'fill-[#F59E0B] text-[#F59E0B]'
                          }`}
                        />
                      ))}
                    </div>

                    <svg
                      width="32"
                      height="26"
                      viewBox="0 0 32 26"
                      fill="currentColor"
                      aria-hidden="true"
                      className={isActive ? 'text-white' : 'text-white/15'}
                    >
                      <path d="M0 15.2C0 6.8 5.2 1.6 13.2 0l1.4 3.4C9.4 4.8 6.8 8 6.4 12.2H13V26H0V15.2zm18.4 0C18.4 6.8 23.6 1.6 31.6 0L33 3.4c-5.2 1.4-7.8 4.6-8.2 8.8h6.6V26H18.4V15.2z" />
                    </svg>
                  </div>

                  <p
                    className={`mt-6 text-[16px] leading-[1.65] ${
                      isActive ? 'text-white font-medium' : 'text-[#A1A1AA]'
                    }`}
                  >
                    {t.quote}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3.5 px-1">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="h-[48px] w-[48px] rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[15px] font-semibold text-white">{t.name}</div>
                    <div className="text-[12px] text-[#8C8C8C]">{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================== RECENT BLOG ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
              {h.blogTag}
            </p>
            <h2 className="mt-3 max-w-[470px] text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[42px]">
              {h.blogTitle}
            </h2>
          </div>

          <div className="max-w-[330px]">
            <p className="text-[14px] leading-[1.6] text-[#A1A1AA]">
              {h.blogDesc}
            </p>
            <div className="mt-5">
              <ActionPillButton
                label="VIEW MORE"
                onClick={() => onNavigate('/blog')}
              />
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-6">
            {content.homeBlogPosts.slice(0, 2).map((post) => {
              const imgFirst = post.layout === 'img-left';
              return (
                <article
                  key={post.id}
                  onClick={() => onSelectBlog(post)}
                  className="group grid grid-cols-1 items-center gap-6 sm:grid-cols-2 cursor-pointer"
                >
                  <div
                    className={`overflow-hidden rounded-xl bg-[#111111] ${
                      imgFirst ? 'sm:order-1' : 'sm:order-2'
                    }`}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div
                    className={`flex h-full flex-col justify-between py-2 ${
                      imgFirst ? 'sm:order-2' : 'sm:order-1'
                    }`}
                  >
                    <h3 className="text-[20px] font-semibold leading-[1.35] text-white group-hover:text-[#F20101] transition-colors">
                      {post.title}
                    </h3>

                    <div className="mt-6 flex items-center gap-6 border-t border-[#1b1b1b] pt-4 text-[12px] text-[#A1A1AA]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {featuredBlog && (
            <article
              onClick={() => onSelectBlog(featuredBlog)}
              className="group flex flex-col justify-between lg:col-span-6 cursor-pointer"
            >
              <div>
                <div className="overflow-hidden rounded-xl bg-[#111111]">
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    referrerPolicy="no-referrer"
                    className="h-[225px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-6 max-w-[460px] text-[26px] font-semibold leading-[1.28] text-white group-hover:text-[#F20101] transition-colors">
                  {featuredBlog.title}
                </h3>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#1b1b1b] pt-4 text-[12px] text-[#A1A1AA]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {featuredBlog.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {featuredBlog.author}
                </span>
              </div>
            </article>
          )}
        </div>
      </section>
    </>
  );
};
