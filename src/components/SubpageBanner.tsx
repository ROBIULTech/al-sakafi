import React from 'react';
import { PageRoute } from './Layout';

interface SubpageBannerProps {
  title: string;
  breadcrumbLabel: string;
  onNavigate: (route: PageRoute) => void;
}

export const SubpageBanner: React.FC<SubpageBannerProps> = ({
  title,
  breadcrumbLabel,
  onNavigate,
}) => {
  return (
    <section className="relative flex min-h-[265px] flex-col items-center justify-center overflow-hidden border-b border-[#141414] bg-[#080808] px-4 py-16 text-center">
      {/* Subtle Isometric Geometric Grid Pattern matching subpage banner design */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
      >
        <defs>
          <pattern
            id="xfolioCubeGrid"
            width="96"
            height="84"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M48 0 L96 24 L96 60 L48 84 L0 60 L0 24 Z M48 0 L48 42 M48 42 L96 24 M48 42 L0 24 M48 42 L48 84"
              fill="none"
              stroke="#262626"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#xfolioCubeGrid)" />
      </svg>

      {/* Soft Diagonal Light Streaks from top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 80% at 88% 15%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 45%, transparent 72%), linear-gradient(125deg, transparent 35%, rgba(255,255,255,0.025) 52%, transparent 68%)',
        }}
      />

      <div className="relative z-10">
        <h1 className="text-[40px] font-bold tracking-tight text-white sm:text-[54px]">
          {title}
        </h1>
        <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/60 px-5 py-2 text-[12px] font-medium">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-white hover:text-[#00BC91] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-white/40">•</span>
          <span className="text-[#F20101]">{breadcrumbLabel}</span>
        </div>
      </div>
    </section>
  );
};
