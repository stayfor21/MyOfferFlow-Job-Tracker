import React from 'react';
import { LogoMark } from './BrandLogo';
import { useTranslation } from '../../i18n.jsx';

const footerLinks = [
  { id: 'board', labelKey: 'footer.links.board' },
  { id: 'insights', labelKey: 'footer.links.insights' },
  { id: 'goals', labelKey: 'footer.links.goals' }
];

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function AppFooter({ onOpenPlanner }) {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--border)] bg-transparent">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark
            className="!h-8 !w-8 !rounded-xl shadow-[0_0_18px_rgba(99,91,255,0.22)]"
            glyphClassName="!h-7 !w-7"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-[var(--text)]">OfferFlow</p>
            <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-muted)]">
              {t('footer.tagline')}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[var(--text-soft)] lg:justify-center">
          {footerLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="rounded-lg transition-colors duration-150 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenPlanner}
            className="rounded-lg transition-colors duration-150 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20"
          >
            {t('footer.links.planner')}
          </button>
        </nav>

        <div className="min-w-0 text-left text-xs font-medium text-[var(--text-muted)] lg:text-right">
          <p className="truncate">{t('footer.status')}</p>
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">v1.0</p>
        </div>
      </div>
    </footer>
  );
}
