import React, { useState } from 'react';
import {
  Box,
  ChevronsRight,
  CircleDot,
  LayoutGrid,
  Megaphone,
  PenTool,
  ShieldCheck,
} from 'lucide-react';
import { PageRoute } from '../components/Layout';
import { FaqSection } from '../components/SharedSections';
import { SubpageBanner } from '../components/SubpageBanner';
import { useSiteContent } from '../context/SiteContentContext';
import type { ServiceGridCard } from '../data/siteContent';

interface ServicesPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectPlan: (planLabel: string) => void;
}

const ICON_MAP: Record<ServiceGridCard['iconKey'], React.ComponentType<{ className?: string }>> = {
  box: Box,
  'circle-dot': CircleDot,
  shield: ShieldCheck,
  grid: LayoutGrid,
  pen: PenTool,
  megaphone: Megaphone,
};

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectPlan,
}) => {
  const { content } = useSiteContent();
  const sp = content.servicesPage;

  const [selectedPriceId, setSelectedPriceId] = useState<string>(
    sp.pricingList.find((p) => p.featured)?.id || sp.pricingList[0]?.id || 'standard-45'
  );
  const [duration, setDuration] = useState<'01' | '03'>('03');

  const activePrice =
    sp.pricingList.find((p) => p.id === selectedPriceId) || sp.pricingList[0];
  const featureList =
    duration === '01' ? sp.monthlyFeatures01 : sp.monthlyFeatures03;

  return (
    <div className="bg-[#060606]">
      <SubpageBanner
        title="Services"
        breadcrumbLabel="Services"
        onNavigate={onNavigate}
      />

      {/* ======================== 6-CARD SERVICE GRID ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sp.cards.map((card) => {
            const Icon = ICON_MAP[card.iconKey] || Box;
            return (
              <div
                key={card.id || card.num}
                onClick={() => onNavigate('/services-details')}
                className="group flex flex-col justify-between rounded-sm border border-[#191919] bg-[#0b0b0b] p-8 sm:p-10 transition-colors hover:border-[#F20101]/50 cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <Icon className="h-10 w-10 text-[#F20101] stroke-[1.35]" />
                    <span className="text-[48px] font-extrabold leading-none text-white/[0.06] tabular-nums">
                      {card.num}
                    </span>
                  </div>

                  <h2 className="mt-8 text-[19px] font-bold uppercase tracking-wide text-white">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-[13px] leading-[1.7] text-[#A1A1AA]">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between pt-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-[0.06em] transition-colors ${
                      card.featured
                        ? 'text-[#F20101]'
                        : 'text-white group-hover:text-[#F20101]'
                    }`}
                  >
                    VIEW DETAILS
                  </span>
                  <span
                    className={`flex items-center transition-transform duration-200 group-hover:translate-x-1 ${
                      card.featured ? 'text-[#F20101]' : 'text-white/80'
                    }`}
                  >
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                      <path
                        d="M0 6H38M38 6L33 1M38 6L33 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================== FLEXIBLE PRICING PLAN ======================== */}
      <section className="mx-auto max-w-[1296px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#00BC91]">
            {sp.pricingTag}
          </p>
          <h2 className="mt-3 text-[34px] font-bold tracking-[-0.02em] text-white sm:text-[42px]">
            {sp.pricingTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-[14px] leading-[1.6] text-[#A1A1AA]">
            {sp.pricingDesc}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left 3 Plan Selectors */}
          <div className="space-y-5 lg:col-span-7">
            {sp.pricingList.map((plan) => {
              const isSelected = activePrice?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPriceId(plan.id)}
                  className={`flex w-full items-center justify-between gap-6 rounded-xl border p-7 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#1d1d1d] border-r-[#F20101]/70 border-b-[#F20101]/70 bg-[#0d0d0d]'
                      : 'border-[#1a1a1a] bg-[#0b0b0b] hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-[20px] font-bold text-white">{plan.name}</div>
                    <p className="mt-2 max-w-[270px] text-[13px] leading-[1.55] text-[#A1A1AA]">
                      {plan.desc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-[44px] font-extrabold leading-none tabular-nums ${
                        isSelected ? 'text-[#F20101]' : 'text-white'
                      }`}
                    >
                      {plan.price}
                    </div>
                    <div className="mt-1 text-[12px] text-[#A1A1AA]">{plan.unit}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Plan Details Card */}
          <div className="rounded-xl border border-[#1a1a1a] bg-[#0b0b0b] p-7 sm:p-8 lg:col-span-5">
            <div className="flex items-center rounded-full border border-[#1e1e1e] bg-[#121212] p-1">
              <button
                type="button"
                onClick={() => setDuration('01')}
                className={`flex-1 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  duration === '01'
                    ? 'bg-[#00BC91] text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                01 MONTHLY
              </button>
              <button
                type="button"
                onClick={() => setDuration('03')}
                className={`flex-1 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  duration === '03'
                    ? 'bg-[#00BC91] text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                03 MONTHLY
              </button>
            </div>

            <ul className="mt-8 space-y-3.5 text-[13px] text-[#A1A1AA]">
              {featureList.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <ChevronsRight className="h-3.5 w-3.5 shrink-0 text-white/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {activePrice && (
              <button
                type="button"
                onClick={() =>
                  onSelectPlan(
                    `${activePrice.name} (${activePrice.price}${activePrice.unit} · ${duration} Monthly)`
                  )
                }
                className="mt-9 w-full rounded-full bg-[#F20101] py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#d80000] cursor-pointer"
              >
                GET STARTED
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================== FAQ ======================== */}
      <FaqSection onNavigate={onNavigate} />
    </div>
  );
};
