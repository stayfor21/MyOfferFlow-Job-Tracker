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
    <footer className="app-footer border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center justify-items-center gap-5 px-4 py-8 text-center sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:justify-items-stretch lg:gap-6 lg:text-left">
        <div className="flex min-w-0 items-center justify-center gap-3 lg:justify-self-start">
          <LogoMark
            className="!h-8 !w-8 !rounded-xl shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
            glyphClassName="!h-7 !w-7"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-[var(--text)]">MyOfferFlow</p>
            <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-muted)]">
              {t('footer.tagline')}
            </p>
          </div>
        </div>

        <nav className="flex w-full flex-wrap items-center justify-center gap-x-[18px] gap-y-2 text-sm font-semibold leading-6 text-[var(--text-soft)] sm:gap-x-6 lg:w-auto lg:flex-nowrap lg:justify-self-center">
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

        <div className="min-w-0 text-center text-xs font-medium text-[var(--text-muted)] lg:justify-self-end lg:text-right">
          <p className="truncate">{t('footer.status')}</p>
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">v1.1</p>
        </div>
      </div>
    </footer>
  );
}
