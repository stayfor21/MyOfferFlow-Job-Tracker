import React from 'react';
import { useTranslation } from '../../i18n.jsx';

export function LogoMark({ className = '', glyphClassName = '' }) {
  return (
    <div
      className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-gradient-to-br from-[#8B5CF6] via-[#6D5DFB] to-[#635BFF] shadow-[0_0_28px_rgba(99,91,255,0.32)] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-white/10 opacity-20" />
      <div className="absolute left-1.5 right-1.5 top-1 h-3 rounded-full bg-white/20 blur-sm" />
      <svg viewBox="0 0 44 44" className={`relative h-9 w-9 overflow-visible ${glyphClassName}`}>
        <path
          d="M10.5 27 C15 23 18.5 23 23 19.5 C27 16.5 30.5 15 34 11.8"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect x="6.5" y="23.5" width="10" height="8" rx="2.6" fill="rgba(255,255,255,0.9)" />
        <rect x="17" y="18" width="10" height="8" rx="2.6" fill="rgba(238,242,255,0.94)" />
        <rect x="27.5" y="10.5" width="10" height="9.5" rx="2.8" fill="rgba(255,255,255,0.98)" />
        <path
          d="M30.5 15 L32.7 17.2 L36 13.2"
          fill="none"
          stroke="#635BFF"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function BrandLogo() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3" aria-label="OfferFlow">
      <LogoMark />
      <div className="hidden sm:block">
        <p className="text-xl font-bold tracking-tight text-[var(--text)]">OfferFlow</p>
        <p className="-mt-0.5 text-xs font-medium text-[var(--text-muted)]">{t('brand.tagline')}</p>
      </div>
    </div>
  );
}
