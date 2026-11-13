import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ActionPillButton, XfolioLogo } from './ActionPillButton';
import { useSiteContent } from '../context/SiteContentContext';

export type PageRoute =
  | '/'
  | '/about'
  | '/services'
  | '/services-details'
  | '/works'
  | '/works-details'
  | '/blog'
  | '/blog-details'
  | '/contact';

interface LayoutProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { label: string; route: PageRoute; matchPrefix?: string }[] = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Services', route: '/services', matchPrefix: '/services' },
  { label: 'Works', route: '/works', matchPrefix: '/works' },
  { label: 'Blog', route: '/blog', matchPrefix: '/blog' },
];

const FOOTER_NAV: { label: string; route: PageRoute }[] = [
  { label: 'ABOUT US', route: '/about' },
  { label: 'SERVICES', route: '/services' },
  { label: 'PROJECTS', route: '/works' },
  { label: 'BLOG', route: '/blog' },
];

export const Layout: React.FC<LayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();

  const handleNav = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const isNavItemActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.route === '/') return currentRoute === '/';
    if (item.matchPrefix) return currentRoute.startsWith(item.matchPrefix);
    return currentRoute === item.route;
  };

  const getActiveFooterRoute = (): PageRoute => {
    if (currentRoute === '/about') return '/about';
    if (currentRoute.startsWith('/services')) return '/services';
    if (currentRoute.startsWith('/blog')) return '/blog';
    return '/works';
  };

  const activeFooterRoute = getActiveFooterRoute();

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className={currentRoute === '/' ? 'bg-[#000000]' : 'bg-[#080808]'}>
        <header className="mx-auto flex max-w-[1296px] items-center justify-between gap-8 px-4 py-6 sm:px-6 lg:px-8">
          {/* Zone 1: Brand wordmark */}
          <div
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="cursor-pointer"
          >
            <XfolioLogo
              brandName={content.global.brandName}
              logoImage={content.global.logoImage}
              showText={content.global.logoShowText}
            />
          </div>

          {/* Zone 2: Single-line navigation links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-9 text-[14px] font-normal text-white/90"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-white/80 hover:text-[#00BC91]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block">
              <ActionPillButton
                label="CONTACT US"
                onClick={() => handleNav('/contact')}
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-[#F20101] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#080808] px-6 py-5 md:hidden">
            <nav className="flex flex-col gap-4 text-sm">
              {NAV_ITEMS.map((item) => {
                const isActive = isNavItemActive(item);
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNav(item.route)}
                    className={`text-left py-1 cursor-pointer ${
                      isActive ? 'text-[#00BC91] font-semibold' : 'text-white/90 hover:text-[#00BC91]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-2">
                <ActionPillButton
                  label="CONTACT US"
                  onClick={() => handleNav('/contact')}
                />
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Shared Footer */}
      <footer className="border-t border-[#181818] bg-[#080808]">
        <div className="mx-auto max-w-[1296px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Brand Summary */}
            <div className="py-14 lg:col-span-4 lg:pr-10">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('/');
                }}
                className="cursor-pointer w-fit"
              >
                <XfolioLogo
                  brandName={content.global.brandName}
                  logoImage={content.global.logoImage}
                  showText={content.global.logoShowText}
                />
              </div>
              <p className="mt-5 max-w-[300px] text-[13px] leading-[1.65] text-[#8C8C8C]">
                {content.global.footerDescription}
              </p>
            </div>

            {/* Stacked Navigation Cells */}
            <div className="grid grid-cols-2 border-y border-[#181818] sm:grid-cols-4 lg:col-span-2 lg:grid-cols-1 lg:border-x lg:border-y-0 divide-x divide-y sm:divide-y-0 lg:divide-x-0 lg:divide-y divide-[#181818]">
              {FOOTER_NAV.map((nav) => {
                const isActive = activeFooterRoute === nav.route;
                return (
                  <button
                    key={nav.label}
                    type="button"
                    onClick={() => handleNav(nav.route)}
                    className={`flex h-[68px] w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#F20101] text-white'
                        : 'bg-transparent text-white/80 hover:bg-[#121212] hover:text-white'
                    }`}
                  >
                    {nav.label}
                  </button>
                );
              })}
            </div>

            {/* Giant Gradient LET'S TALK */}
            <div className="flex items-center justify-center py-14 lg:col-span-6 lg:pl-10">
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                className="bg-gradient-to-r from-[#A3E635] via-[#F97316] to-[#F20101] bg-clip-text text-[54px] font-extrabold uppercase tracking-[-0.02em] text-transparent transition-transform duration-200 hover:scale-[1.02] sm:text-[72px] xl:text-[84px] cursor-pointer"
              >
                {content.global.footerCtaText}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-[#181818]">
          <div className="mx-auto flex max-w-[1296px] flex-col items-center justify-between gap-4 px-4 py-6 text-[13px] text-[#A1A1AA] sm:flex-row sm:px-6 lg:px-8">
            <p>{content.global.copyrightText}</p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#222222] bg-[#121212] text-xs font-bold text-white hover:border-[#F20101] transition-colors cursor-pointer"
              >
                in
              </button>
              <button
                type="button"
                onClick={() => handleNav('/works')}
                aria-label="Dribbble"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#222222] bg-[#121212] text-white hover:border-[#F20101] transition-colors cursor-pointer"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                  <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                  <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F20101] bg-[#121212] text-xs font-bold text-[#F20101] hover:bg-[#F20101] hover:text-white transition-colors cursor-pointer"
              >
                X
              </button>
              <button
                type="button"
                onClick={() => handleNav('/works')}
                aria-label="Behance"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#222222] bg-[#121212] text-xs font-bold text-white hover:border-[#F20101] transition-colors cursor-pointer"
              >
                Bē
              </button>
            </div>

            <p>
              {content.global.designerLabel}{' '}
              <span className="text-[#F20101]">{content.global.designerName}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
