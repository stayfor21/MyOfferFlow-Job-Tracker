import React, { memo, useEffect, useRef } from 'react';
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
    border: 'rgba(96,165,250,0.38)',
    glow: 'rgba(96,165,250,0.08)',
    dragGlow: 'rgba(96,165,250,0.12)',
    ring: 'rgba(96,165,250,0.26)'
  },
  screening: {
    border: 'rgba(192,132,252,0.38)',
    glow: 'rgba(192,132,252,0.08)',
    dragGlow: 'rgba(192,132,252,0.12)',
    ring: 'rgba(192,132,252,0.26)'
  },
  interview: {
    border: 'rgba(251,191,36,0.4)',
    glow: 'rgba(251,191,36,0.08)',
    dragGlow: 'rgba(251,191,36,0.12)',
    ring: 'rgba(251,191,36,0.28)'
  },
  offer: {
    border: 'rgba(52,211,153,0.38)',
    glow: 'rgba(52,211,153,0.08)',
    dragGlow: 'rgba(52,211,153,0.12)',
    ring: 'rgba(52,211,153,0.26)'
  },
  rejected: {
    border: 'rgba(251,113,133,0.38)',
    glow: 'rgba(251,113,133,0.08)',
    dragGlow: 'rgba(251,113,133,0.12)',
    ring: 'rgba(251,113,133,0.26)'
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

const interactiveSelector = [
  'button',
  'a',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[data-no-drag="true"]'
].join(',');

function getCardStatusStyle(status) {
  return cardStatusStyles[status] || cardStatusStyles.applied;
}

function MetaLine({ icon: Icon, children }) {
  if (!children) return null;

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
      {Icon && <Icon size={12} className="shrink-0 text-[var(--text-muted)]" />}
      <span className="truncate">{children}</span>
    </div>
  );
}

function CompactRow({ icon: Icon, label, children, aside, title }) {
  if (!children) return null;

  return (
    <div
      title={title}
      className="flex min-h-7 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[12px] text-[var(--text-soft)]"
    >
      {Icon && <Icon size={12} className="shrink-0 text-[var(--text-muted)]" />}
      <span className="shrink-0 font-medium text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--text-faint)]">&middot;</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {aside && (
        <span className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
          {aside}
        </span>
      )}
    </div>
  );
}

function JobCard({
  job,
  isDragging = false,
  onClick,
  onDragStart,
  onDragEnd,
  onTouchDragMove,
  onTouchDrop
}) {
  const { t, formatDate } = useTranslation();
  const recentlyDraggedRef = useRef(false);
  const touchDragRef = useRef({ startX: 0, startY: 0, active: false, cancelled: false });
  const pointerDragRef = useRef({ pointerId: null, startX: 0, startY: 0, active: false, cancelled: false });
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
    if (e.target.closest(interactiveSelector)) {
      e.preventDefault();
      return;
    }

    recentlyDraggedRef.current = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', job.id);
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

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    if (event.target.closest(interactiveSelector)) {
      touchDragRef.current = { startX: 0, startY: 0, active: false, cancelled: true };
      return;
    }

    const touch = event.touches[0];
    touchDragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      active: false,
      cancelled: false
    };
  };

  const handleTouchMove = (event) => {
    const state = touchDragRef.current;
    if (state.cancelled || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!state.active) {
      if (distance < 4) return;
      touchDragRef.current = { ...state, active: true };
      recentlyDraggedRef.current = true;
      onDragStart(job.id);
    }

    event.preventDefault();
    const targetColumn = document
      .elementFromPoint(touch.clientX, touch.clientY)
      ?.closest('[data-column-id]');
    onTouchDragMove?.(targetColumn?.dataset.columnId);
  };

  const handleTouchEnd = () => {
    const state = touchDragRef.current;
    if (state.active) {
      onTouchDrop?.(job.id);
      window.setTimeout(() => {
        recentlyDraggedRef.current = false;
      }, 160);
    }
    touchDragRef.current = { startX: 0, startY: 0, active: false, cancelled: false };
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    if (event.target.closest(interactiveSelector)) {
      pointerDragRef.current = { pointerId: null, startX: 0, startY: 0, active: false, cancelled: true };
      return;
    }

    pointerDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      cancelled: false
    };
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      const state = pointerDragRef.current;
      if (state.cancelled || state.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      const distance = Math.hypot(deltaX, deltaY);

      if (!state.active) {
        if (distance < 4) return;
        pointerDragRef.current = { ...state, active: true };
        recentlyDraggedRef.current = true;
        onDragStart(job.id);
      }

      event.preventDefault();
      const targetColumn = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest('[data-column-id]');
      onTouchDragMove?.(targetColumn?.dataset.columnId);
    };

    const handlePointerUp = (event) => {
      const state = pointerDragRef.current;
      if (state.pointerId !== event.pointerId) return;

      if (state.active) {
        onTouchDrop?.(job.id);
        window.setTimeout(() => {
          recentlyDraggedRef.current = false;
        }, 160);
      }

      pointerDragRef.current = { pointerId: null, startX: 0, startY: 0, active: false, cancelled: false };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [job.id, onDragStart, onTouchDragMove, onTouchDrop]);

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
      animate={{ opacity: isDragging ? 0.92 : 1, scale: isDragging ? 1.015 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12, ease: 'easeOut' } }}
      transition={{
        layout: { duration: 0.18, ease: 'easeOut' },
        opacity: { duration: 0.15, ease: 'easeOut' },
        scale: { duration: 0.15, ease: 'easeOut' },
        y: { duration: 0.18, ease: 'easeOut' }
      }}
      draggable={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      className={[
        'of-job-card of-premium-card group select-none transform-gpu [touch-action:pan-x_pan-y] rounded-2xl p-4 will-change-transform',
        'transition-[transform,opacity,box-shadow,border-color,background-color] duration-200 ease-out',
        'hover:-translate-y-px hover:border-[var(--card-accent-border)] hover:bg-[var(--surface)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]',
        'focus-visible:border-[var(--card-accent-border)] focus-visible:shadow-[0_0_16px_var(--card-accent-glow)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--card-accent-ring)]',
        'cursor-grab active:cursor-grabbing',
        isDragging
          ? 'cursor-grabbing border-[var(--card-accent-border)] opacity-90 shadow-[0_14px_32px_rgba(0,0,0,0.26)] ring-1 ring-[var(--card-accent-ring)]'
          : ''
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-semibold leading-snug text-[var(--text)] transition-colors duration-150 group-hover:text-[var(--primary)]">
            {title}
          </h3>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-[var(--text-muted)]">
            <Building2 size={13} className="shrink-0" />
            <span className="truncate">{company}</span>
          </p>
        </div>

        {job.link && (
          <LinkIcon data-no-drag="true" draggable={false} size={14} className="mt-1 shrink-0 text-[var(--text-muted)] transition-colors duration-150 group-hover:text-[#7C73FF]" />
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

      <div className="mt-3 flex min-h-9 items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span
            data-drag-handle="true"
            aria-label={t('card.drag')}
            title={t('card.drag')}
            onClick={(event) => event.stopPropagation()}
            className="of-drag-handle flex h-10 w-10 shrink-0 touch-none cursor-grab items-center justify-center rounded-xl text-[var(--text-faint)] transition-[background-color,color] duration-200 active:cursor-grabbing group-hover:bg-[var(--surface-muted)] group-hover:text-[var(--text-muted)]"
          >
            <GripVertical draggable={false} size={14} />
          </span>
          <div className="min-w-0">
            <MetaLine icon={Calendar}>{cardDate}</MetaLine>
          </div>
        </div>

        {status === 'interview' && (
          <Button
            type="button"
            data-no-drag="true"
            variant="primary"
            size="compact"
            aria-label={t('card.openPrepAria', { title })}
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('open-prep-tool', { detail: job }));
            }}
            className="h-8 min-w-[116px] shrink-0 gap-1.5 whitespace-nowrap px-3 text-[11px] leading-none shadow-[var(--shadow-button)]"
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
