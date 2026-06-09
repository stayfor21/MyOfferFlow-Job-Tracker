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
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-5 px-4 py-8 text-center sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-6 sm:gap-y-[18px] sm:px-6 sm:text-left lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
        <div className="order-1 flex min-w-0 items-center justify-center gap-3 sm:justify-self-start lg:justify-self-start">
          <LogoMark
            className="!h-8 !w-8 !rounded-xl shadow-[0_8px_18px_rgba(99,91,255,0.14)]"
            glyphClassName="!h-7 !w-7"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-[var(--text)]">MyOfferFlow</p>
            <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-muted)]">
              {t('footer.tagline')}
            </p>
          </div>
        </div>

        <nav className="order-2 flex w-full flex-wrap items-center justify-center gap-x-[18px] gap-y-2 text-sm font-semibold leading-6 text-[var(--text-soft)] sm:order-3 sm:col-span-2 sm:gap-x-6 lg:order-2 lg:col-span-1 lg:justify-self-center">
          {footerLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="rounded-lg transition-colors duration-150 ease-out hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenPlanner}
            className="rounded-lg transition-colors duration-150 ease-out hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20"
          >
            {t('footer.links.planner')}
          </button>
          <a
            href="https://github.com/stayfor21/MyOfferFlow-Job-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.githubAria')}
            className="rounded-lg transition-colors duration-150 ease-out hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20"
          >
            {t('footer.links.github')}
          </a>
        </nav>

        <div className="order-3 min-w-0 text-center text-xs font-medium text-[var(--text-muted)] sm:order-2 sm:justify-self-end sm:text-right lg:order-3 lg:justify-self-end">
          <p className="truncate">{t('footer.status')}</p>
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">v1.1</p>
        </div>
      </div>
    </footer>
  );
}
