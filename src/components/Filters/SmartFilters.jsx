import React from 'react';
import { Archive, Briefcase, CalendarClock, EyeOff, Flame, Heart, Inbox, MessageSquare } from 'lucide-react';
import { SMART_FILTERS } from '../../utils/filters';
import { useTranslation } from '../../i18n.jsx';

const icons = {
  all: Inbox,
  dream: Heart,
  high: Flame,
  dueToday: CalendarClock,
  interviews: MessageSquare,
  offers: Briefcase,
  rejected: EyeOff,
  archived: Archive
};

export default function SmartFilters({
  activeFilter,
  onFilterChange,
  counts,
  hideRejected,
  onToggleHideRejected
}) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('filters.aria')} className="mb-6">
      <div className="modal-scrollbar of-command-surface flex touch-pan-x gap-2 overflow-x-auto rounded-[22px] p-2">
        {SMART_FILTERS.map((filter) => {
          const Icon = icons[filter.id] || Inbox;
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.id)}
              className={[
                'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold',
                'transition-[background-color,border-color,color,box-shadow] duration-150 ease-out',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20',
                isActive
                  ? 'border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--text)] shadow-[0_8px_18px_rgba(0,0,0,0.14)]'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--text)]'
              ].join(' ')}
            >
              <Icon size={14} />
              <span className="max-w-[132px] truncate">{t(filter.labelKey)}</span>
              <span
                className={[
                  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                  isActive ? 'bg-[var(--primary-soft)] text-[var(--text)]' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
                ].join(' ')}
              >
                {counts[filter.id] || 0}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          aria-pressed={hideRejected}
          aria-label={t('filters.hideRejectedAria')}
          onClick={onToggleHideRejected}
          className={[
            'ml-1 inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold',
            'transition-[background-color,border-color,color,box-shadow] duration-150 ease-out',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20',
            hideRejected
              ? 'border-[var(--chip-rose-border)] bg-[var(--chip-rose-bg)] text-[var(--chip-rose-text)]'
              : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--text)]'
          ].join(' ')}
        >
          <EyeOff size={14} />
          {hideRejected ? t('filters.showRejected') : t('filters.hideRejected')}
        </button>
      </div>
    </section>
  );
}
