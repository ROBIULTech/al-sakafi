import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ActionPillButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'red' | 'outline';
  type?: 'button' | 'submit';
  className?: string;
}

export const ActionPillButton: React.FC<ActionPillButtonProps> = ({
  label,
  onClick,
  href,
  variant = 'red',
  type = 'button',
  className = '',
}) => {
  const isRed = variant === 'red';

  const content = (
    <>
      <span
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.06em] whitespace-nowrap transition-transform duration-200 group-hover:scale-[1.02] ${
          isRed
            ? 'bg-[#F20101] text-white'
            : 'border border-white/25 bg-transparent text-white group-hover:border-white/50'
        }`}
      >
        {label}
      </span>
      <span
        className={`inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${
          isRed
            ? 'bg-[#F20101] text-white'
            : 'border border-white/25 bg-transparent text-white group-hover:border-white/50'
        }`}
      >
        <ArrowRight className="h-4 w-4 stroke-[1.75]" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`group inline-flex items-center gap-[2px] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F20101] rounded-full ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group inline-flex items-center gap-[2px] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F20101] rounded-full ${className}`}
    >
      {content}
    </button>
  );
};

export const XfolioLogo: React.FC<{
  className?: string;
  brandName?: string;
  logoImage?: string;
  showText?: boolean;
}> = ({
  className = '',
  brandName = 'XFOLIO',
  logoImage = '',
  showText = true,
}) => (
  <a
    href="#home"
    className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F20101] rounded ${className}`}
  >
    {logoImage ? (
      <img
        src={logoImage}
        alt={brandName || 'Brand Logo'}
        className={
          showText
            ? 'h-8 w-8 object-contain shrink-0'
            : 'h-9 w-auto max-w-[180px] object-contain shrink-0'
        }
      />
    ) : (
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M5 4L14.2 16L5 28H10.5L17 19.3L23.5 28H29L19.8 16L29 4H23.5L17 12.7L10.5 4H5Z"
          stroke="#00BC91"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 28L25 4"
          stroke="#F20101"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M4 4L12.5 15.5"
          stroke="#F20101"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    )}
    {showText && brandName && (
      <span className="text-[19px] font-bold tracking-[0.04em] text-white">
        {brandName}
      </span>
    )}
  </a>
);
