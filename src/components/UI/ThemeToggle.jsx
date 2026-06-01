import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';
import { useTheme } from '../../theme.jsx';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? t('theme.toLight') : t('theme.toDark');

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={[
        'theme-icon-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border',
        'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary-glow)]'
      ].join(' ')}
    >
      <Icon size={17} />
    </button>
  );
}
