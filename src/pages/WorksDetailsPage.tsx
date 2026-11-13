import React, { useEffect, useState } from 'react';
import { PageRoute } from '../components/Layout';
import { SubpageBanner } from '../components/SubpageBanner';
import { ProjectItem } from '../data/portfolioData';
import { useSiteContent } from '../context/SiteContentContext';

interface WorksDetailsPageProps {
  project: ProjectItem | null;
  onNavigate: (route: PageRoute) => void;
}

export const WorksDetailsPage: React.FC<WorksDetailsPageProps> = ({
  project,
  onNavigate,
}) => {
  const { content } = useSiteContent();
  const wd = content.worksDetails;

  const [title, setTitle] = useState<string>(project?.title || wd.defaultTitle);

  useEffect(() => {
    setTitle(project?.title || wd.defaultTitle);
  }, [project, wd.defaultTitle]);

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Portfolios Details"
        breadcrumbLabel="Portfolios Details"
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Project Visual */}
        <div className="overflow-hidden rounded-2xl bg-[#111111]">
          <img
            src={wd.heroImage}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full max-h-[500px] object-cover"
          />
        </div>

        {/* Project Title */}
        <h2 className="mt-10 text-[34px] font-bold tracking-tight text-white sm:text-[42px]">
          {title}
        </h2>
        <p className="mt-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
          {wd.intro}
        </p>

        {/* Branding Meets Functionality */}
        <div className="mt-14">
          <h3 className="text-[28px] font-bold text-white sm:text-[32px]">
            {wd.section1Title}
          </h3>
          <p className="mt-3.5 text-[14px] leading-[1.75] text-[#A1A1AA]">
            {wd.section1Text}
          </p>

          <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="overflow-hidden rounded-2xl bg-[#111111] lg:col-span-6">
              <img
                src={wd.pinkImage}
                alt={wd.section1Title}
                referrerPolicy="no-referrer"
                className="w-full object-cover"
              />
            </div>

            <div className="lg:col-span-6">
              <h4 className="text-[26px] font-bold text-white">
                {wd.challengesTitle}
              </h4>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#A1A1AA]">
                {wd.challengesText}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-y-3 gap-x-8 text-[14px] text-white sm:grid-cols-2">
                {wd.challengesBullets.map((item, idx) => (
                  <div key={idx}>+ {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SaaS Dashboard UI */}
        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="text-[28px] font-bold leading-[1.25] text-white sm:text-[32px]">
              {wd.saasTitle}
            </h3>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#A1A1AA]">
              {wd.saasText}
            </p>

            <ul className="mt-6 space-y-3 text-[14px] text-white">
              {wd.saasBullets.map((item, idx) => (
                <li key={idx}>+ {item}</li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#111111] lg:col-span-6">
            <img
              src={wd.bunnyImage}
              alt={wd.saasTitle}
              referrerPolicy="no-referrer"
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Mobile App for Fitness Tracking */}
        <div className="mt-16">
          <h3 className="text-[28px] font-bold text-white sm:text-[32px]">
            {wd.mobileTitle}
          </h3>
          <p className="mt-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
            {wd.mobileText}
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-[#111111]">
            <img
              src={wd.mistImage}
              alt={wd.mobileTitle}
              referrerPolicy="no-referrer"
              className="w-full max-h-[430px] object-cover"
            />
          </div>
        </div>

        {/* Projects Solution + 95% Success Rate */}
        <div className="mt-14 grid grid-cols-1 gap-10 border-b border-[#1c1c1c] pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="text-[24px] font-bold text-white">{wd.solutionTitle}</h3>
            <div className="mt-8 text-[46px] font-extrabold leading-none text-white tabular-nums">
              {wd.solutionRate}
            </div>
            <p className="mt-2 text-[12px] text-[#8C8C8C]">{wd.solutionRateLabel}</p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[14px] leading-[1.75] text-[#A1A1AA]">
              {wd.solutionText}
            </p>

            <div className="mt-7 grid grid-cols-1 gap-y-3 gap-x-8 border-t border-[#1c1c1c] pt-7 text-[14px] text-white sm:grid-cols-2">
              {wd.solutionStack.map((item, idx) => (
                <div key={idx}>+ {item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next Project Footer Switcher */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => setTitle(wd.prevTitle)}
            className="text-left group cursor-pointer"
          >
            <span className="inline-block rounded-full bg-[#F20101] px-5 py-1.5 text-[11px] font-bold text-white">
              Prev Post
            </span>
            <div className="mt-2.5 text-[16px] font-semibold text-white group-hover:text-[#F20101] transition-colors">
              {wd.prevTitle}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTitle(wd.nextTitle)}
            className="text-right group cursor-pointer"
          >
            <span className="inline-block rounded-full border border-white/15 bg-[#121212] px-5 py-1.5 text-[11px] font-semibold text-white/80 group-hover:bg-[#F20101] group-hover:border-[#F20101] group-hover:text-white transition-colors">
              Next Post
            </span>
            <div className="mt-2.5 text-[16px] font-semibold text-white group-hover:text-[#F20101] transition-colors">
              {wd.nextTitle}
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
