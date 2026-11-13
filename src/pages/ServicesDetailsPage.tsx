import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { FaqSection, TestimonialsTrack } from '../components/SharedSections';
import { SubpageBanner } from '../components/SubpageBanner';
import { useSiteContent } from '../context/SiteContentContext';

interface ServicesDetailsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ServicesDetailsPage: React.FC<ServicesDetailsPageProps> = ({
  onNavigate,
}) => {
  const { content } = useSiteContent();
  const sd = content.servicesDetails;

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Services Details"
        breadcrumbLabel="Services Details"
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1296px] px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="overflow-hidden rounded-2xl bg-[#111111]">
          <img
            src={sd.heroImage}
            alt={sd.title}
            referrerPolicy="no-referrer"
            className="w-full object-cover max-h-[520px]"
          />
        </div>

        {/* Title & Intro */}
        <h2 className="mt-10 text-[32px] font-bold tracking-tight text-white sm:text-[40px]">
          {sd.title}
        </h2>
        <div className="mt-4 space-y-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
          <p>{sd.intro1}</p>
          <p>{sd.intro2}</p>
        </div>

        {/* Service Overview + Stats Card */}
        <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-[28px] font-bold text-white sm:text-[34px]">
              {sd.overviewTitle}
            </h3>
            <div className="mt-4 space-y-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
              <p>{sd.overviewPara1}</p>
              <p>{sd.overviewPara2}</p>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl bg-[#111111]">
              <img
                src={sd.brochureImage}
                alt="Brochure & Brand Identity Mockup"
                referrerPolicy="no-referrer"
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-8 sm:p-10 lg:col-span-4 space-y-9">
            {sd.stats.map((stat, idx) => (
              <div key={idx}>
                <div
                  className={`text-[44px] font-extrabold leading-none tabular-nums ${
                    stat.red ? 'text-[#F20101]' : 'text-white'
                  }`}
                >
                  {stat.value}
                </div>
                <p className="mt-2.5 text-[14px] leading-snug text-[#A1A1AA]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Image Architectural & Cube Mockup Row */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl bg-[#111111] lg:col-span-8">
            <img
              src={sd.buildingImage}
              alt="Architectural Studio Signage"
              referrerPolicy="no-referrer"
              className="h-full max-h-[450px] w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl bg-[#111111] lg:col-span-4">
            <img
              src={sd.cubeImage}
              alt="Minimalist Sign Mockup"
              referrerPolicy="no-referrer"
              className="h-full max-h-[450px] w-full object-cover"
            />
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-14">
          <h3 className="text-[28px] font-bold text-white sm:text-[32px]">
            {sd.keyFeaturesTitle}
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-[14px] leading-[1.75] text-[#A1A1AA]">
              <p>{sd.featurePara1}</p>
              <p>{sd.featurePara2}</p>
            </div>

            <div className="space-y-5">
              <p className="text-[14px] leading-[1.75] text-[#A1A1AA]">
                {sd.featurePara3}
              </p>

              <ul className="space-y-3 text-[14px] font-medium text-white">
                {sd.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F20101]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FaqSection onNavigate={onNavigate} />
      <TestimonialsTrack title="What My Clients Say" />
    </div>
  );
};
