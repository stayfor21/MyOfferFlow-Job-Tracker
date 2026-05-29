import React, { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, Building2, Calendar, Flag, GripVertical, Link as LinkIcon, ListChecks, Sparkles, Star } from 'lucide-react';
import Button from '../UI/Button';
import { useTranslation } from '../../i18n.jsx';
import {
  getFollowUpDisplay,
  getNextActionDisplay,
  getPriority,
  isDreamJob,
  priorityStyles
} from '../../utils/jobMetadata';

const statusStyles = {
  applied: 'of-chip-status-applied',
  screening: 'of-chip-status-screening',
  interview: 'of-chip-status-interview',
  offer: 'of-chip-status-offer',
  rejected: 'of-chip-status-rejected'
};

const cardStatusStyles = {
  applied: {
    border: 'rgba(96,165,250,0.55)',
    glow: 'rgba(96,165,250,0.20)',
    dragGlow: 'rgba(96,165,250,0.26)',
    ring: 'rgba(96,165,250,0.35)'
  },
  screening: {
    border: 'rgba(192,132,252,0.55)',
    glow: 'rgba(192,132,252,0.20)',
    dragGlow: 'rgba(192,132,252,0.26)',
    ring: 'rgba(192,132,252,0.35)'
  },
  interview: {
    border: 'rgba(251,191,36,0.55)',
    glow: 'rgba(251,191,36,0.20)',
    dragGlow: 'rgba(251,191,36,0.26)',
    ring: 'rgba(251,191,36,0.35)'
  },
  offer: {
    border: 'rgba(52,211,153,0.55)',
    glow: 'rgba(52,211,153,0.20)',
    dragGlow: 'rgba(52,211,153,0.26)',
    ring: 'rgba(52,211,153,0.35)'
  },
  rejected: {
    border: 'rgba(251,113,133,0.55)',
    glow: 'rgba(251,113,133,0.20)',
    dragGlow: 'rgba(251,113,133,0.26)',
    ring: 'rgba(251,113,133,0.35)'
  }
};

const followUpToneStyles = {
  amber: 'of-chip-warning',
  blue: 'of-chip-blue',
  indigo: 'of-chip-violet',
  violetAmber: 'of-chip-reminder',
  emerald: 'of-chip-success',
  emeraldAmber: 'of-chip-warning',
  suggestion: 'of-chip-default',
  muted: 'of-chip-slate'
};

function getCardStatusStyle(status) {
  return cardStatusStyles[status] || cardStatusStyles.applied;
}

function MetaLine({ icon: Icon, children }) {
  if (!children) return null;

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-zinc-500">
      {Icon && <Icon size={12} className="shrink-0 text-zinc-500" />}
      <span className="truncate">{children}</span>
    </div>
  );
}

function CompactRow({ icon: Icon, label, children, aside, title }) {
  if (!children) return null;

  return (
    <div
      title={title}
      className="flex min-h-7 items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.018] px-2.5 py-1 text-[12px] text-zinc-300"
    >
      {Icon && <Icon size={12} className="shrink-0 text-zinc-500" />}
      <span className="shrink-0 font-medium text-zinc-500">{label}</span>
      <span className="text-zinc-600">&middot;</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {aside && (
        <span className="shrink-0 rounded-full border border-white/[0.06] bg-zinc-950/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
          {aside}
        </span>
      )}
    </div>
  );
}

function JobCard({ job, isDragging = false, onClick, onDragStart, onDragEnd }) {
  const { t, formatDate } = useTranslation();
  const recentlyDraggedRef = useRef(false);
  const title = job.title || job.position || job.company || t('job.untitledRole');
  const company = job.company || t('job.unknownCompany');
  const status = job.status || 'applied';
  const accent = getCardStatusStyle(status);
  const priority = getPriority(job);
  const dreamJob = isDreamJob(job);
  const isHighPriority = priority === 'high';
  const nextAction = job.nextAction || '';
  const nextActionDisplay = getNextActionDisplay(nextAction, t);
  const nextActionDue = job.nextActionDueDate || '';
  const followUpDisplay = getFollowUpDisplay(job, { t, formatDate });
  const cardDate = formatDate(job.appliedDate || job.createdAt);

  const handleDragStart = (e) => {
    recentlyDraggedRef.current = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('jobId', job.id);
    onDragStart(job.id);
  };

  const handleDragEnd = () => {
    onDragEnd();
    window.setTimeout(() => {
      recentlyDraggedRef.current = false;
    }, 120);
  };

  const handleClick = () => {
    if (recentlyDraggedRef.current) return;
    onClick();
  };

  return (
    <motion.div
      style={{
        '--card-accent-border': accent.border,
        '--card-accent-glow': accent.glow,
        '--card-accent-drag-glow': accent.dragGlow,
        '--card-accent-ring': accent.ring
      }}
      layout="position"
      initial={{ opacity: 0.9, scale: 0.98, y: 4 }}
      animate={{ opacity: isDragging ? 0.9 : 1, scale: isDragging ? 1.03 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12, ease: 'easeOut' } }}
      transition={{
        layout: { duration: 0.18, ease: 'easeOut' },
        opacity: { duration: 0.15, ease: 'easeOut' },
        scale: { duration: 0.15, ease: 'easeOut' },
        y: { duration: 0.18, ease: 'easeOut' }
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={[
        'group transform-gpu rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-sm shadow-black/20 will-change-transform',
        'transition-[transform,opacity,box-shadow,border-color,background-color] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:border-[var(--card-accent-border)] hover:bg-zinc-900 hover:shadow-[0_0_24px_var(--card-accent-glow)]',
        'focus-visible:border-[var(--card-accent-border)] focus-visible:shadow-[0_0_24px_var(--card-accent-glow)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--card-accent-ring)]',
        'cursor-grab active:cursor-grabbing',
        isDragging
          ? 'cursor-grabbing border-[var(--card-accent-border)] opacity-90 shadow-[0_0_28px_var(--card-accent-drag-glow)] ring-1 ring-[var(--card-accent-ring)]'
          : ''
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-semibold leading-snug text-zinc-100 transition-colors duration-150 group-hover:text-indigo-100">
            {title}
          </h3>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-zinc-500">
            <Building2 size={13} className="shrink-0" />
            <span className="truncate">{company}</span>
          </p>
        </div>

        {job.link && (
          <LinkIcon size={14} className="mt-1 shrink-0 text-zinc-600 transition-colors duration-150 group-hover:text-[#7C73FF]" />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`of-chip h-6 rounded-full px-2.5 text-[11px] font-semibold ${statusStyles[status] || statusStyles.applied}`}>
          {t(`status.${status}`)}
        </span>
        {dreamJob && (
          <span className="of-chip of-chip-dream h-6 rounded-full px-2.5 text-[11px] font-semibold">
            <Star size={11} />
            {t('card.dreamJob')}
          </span>
        )}
        {isHighPriority && (
          <span className={`of-chip h-6 rounded-full px-2.5 text-[11px] font-semibold ${priorityStyles.high}`}>
            <Flag size={11} />
            {t('priority.high')}
          </span>
        )}
      </div>

      {(nextAction || followUpDisplay.shouldShowOnCard) && (
        <div className="mt-3 space-y-2">
          {nextAction && (
            <CompactRow
              icon={ListChecks}
              label={t('card.next')}
              aside={nextActionDue ? formatDate(nextActionDue) : ''}
              title={nextActionDisplay}
            >
              {nextActionDisplay}
            </CompactRow>
          )}
          {followUpDisplay.shouldShowOnCard && (
            <div
              title={followUpDisplay.label}
              className={`of-chip h-6 max-w-full rounded-full px-2.5 text-[11px] font-semibold ${followUpToneStyles[followUpDisplay.tone] || followUpToneStyles.muted}`}
            >
              <Bell size={11} className="shrink-0" />
              <span className="truncate">{followUpDisplay.label}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex min-h-9 items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <GripVertical
            size={13}
            aria-label={t('card.drag')}
            title={t('card.drag')}
            className="shrink-0 text-zinc-700 transition-colors duration-200 group-hover:text-zinc-500"
          />
          <div className="min-w-0">
            <MetaLine icon={Calendar}>{cardDate}</MetaLine>
          </div>
        </div>

        {status === 'interview' && (
          <Button
            type="button"
            variant="primary"
            size="compact"
            aria-label={`Open interview preparation for ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('open-prep-tool', { detail: job }));
            }}
            className="h-8 min-w-[116px] shrink-0 gap-1.5 whitespace-nowrap px-3 text-[11px] leading-none shadow-[0_0_14px_rgba(99,91,255,0.14)]"
          >
            <Sparkles size={12} />
            <span className="text-center">{t('card.prep')}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default memo(JobCard);
