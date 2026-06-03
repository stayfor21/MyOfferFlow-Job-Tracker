import React, { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CalendarCheck, Inbox, MessageSquareReply, Trophy, XCircle } from 'lucide-react';
import JobCard from './JobCard';
import { useTranslation } from '../../i18n.jsx';

const emptyStates = {
  applied: {
    icon: Inbox,
    titleKey: 'kanban.noApplications',
    descriptionKey: 'kanban.emptyApplied'
  },
  screening: {
    icon: MessageSquareReply,
    titleKey: 'kanban.noScreenings',
    descriptionKey: 'kanban.emptyScreening'
  },
  interview: {
    icon: CalendarCheck,
    titleKey: 'kanban.noInterviews',
    descriptionKey: 'kanban.emptyInterview'
  },
  offer: {
    icon: Trophy,
    titleKey: 'kanban.noOffers',
    descriptionKey: 'kanban.emptyOffer'
  },
  rejected: {
    icon: XCircle,
    titleKey: 'kanban.noRejections',
    descriptionKey: 'kanban.emptyRejected'
  }
};

const statusDropStyles = {
  applied: {
    text: '#60A5FA',
    border: 'rgba(96,165,250,0.45)',
    dragBorder: 'rgba(96,165,250,0.68)',
    bg: 'rgba(96,165,250,0.08)',
    dragBg: 'rgba(96,165,250,0.12)',
    glow: 'rgba(96,165,250,0.22)',
    dragGlow: 'rgba(96,165,250,0.30)'
  },
  screening: {
    text: '#C084FC',
    border: 'rgba(192,132,252,0.45)',
    dragBorder: 'rgba(192,132,252,0.68)',
    bg: 'rgba(192,132,252,0.08)',
    dragBg: 'rgba(192,132,252,0.12)',
    glow: 'rgba(192,132,252,0.22)',
    dragGlow: 'rgba(192,132,252,0.30)'
  },
  interview: {
    text: '#FBBF24',
    border: 'rgba(251,191,36,0.45)',
    dragBorder: 'rgba(251,191,36,0.68)',
    bg: 'rgba(251,191,36,0.08)',
    dragBg: 'rgba(251,191,36,0.12)',
    glow: 'rgba(251,191,36,0.22)',
    dragGlow: 'rgba(251,191,36,0.30)'
  },
  offer: {
    text: '#34D399',
    border: 'rgba(52,211,153,0.45)',
    dragBorder: 'rgba(52,211,153,0.68)',
    bg: 'rgba(52,211,153,0.08)',
    dragBg: 'rgba(52,211,153,0.12)',
    glow: 'rgba(52,211,153,0.22)',
    dragGlow: 'rgba(52,211,153,0.30)'
  },
  rejected: {
    text: '#FB7185',
    border: 'rgba(251,113,133,0.45)',
    dragBorder: 'rgba(251,113,133,0.68)',
    bg: 'rgba(251,113,133,0.08)',
    dragBg: 'rgba(251,113,133,0.12)',
    glow: 'rgba(251,113,133,0.22)',
    dragGlow: 'rgba(251,113,133,0.30)'
  }
};

function getStatusStyle(columnId) {
  return statusDropStyles[columnId] || statusDropStyles.applied;
}

function KanbanEmptyState({ columnId, isDragOver, statusStyle, isFiltered, filteredEmptyState }) {
  const { t } = useTranslation();
  const state = emptyStates[columnId] || emptyStates.applied;
  const Icon = state.icon;
  const title = isFiltered ? t(filteredEmptyState?.titleKey || 'filters.noMatches') : t(state.titleKey);
  const description = isFiltered ? t(filteredEmptyState?.descriptionKey || 'filters.noMatchesHelp') : t(state.descriptionKey);

  return (
    <div
      style={{
        '--drop-border': statusStyle.border,
        '--drop-bg': statusStyle.bg,
        '--drop-glow': statusStyle.glow,
        '--drop-drag-border': statusStyle.dragBorder,
        '--drop-drag-bg': statusStyle.dragBg,
        '--drop-drag-glow': statusStyle.dragGlow,
        '--drop-text': statusStyle.text
      }}
      className={[
        'group/empty box-border min-h-[196px] w-full min-w-0 max-w-full rounded-2xl border border-dashed px-[18px] py-5 text-center',
        'transition-[background-color,border-color,box-shadow] duration-150 ease-out',
        isDragOver
          ? 'border-[var(--drop-drag-border)] bg-[var(--drop-drag-bg)] shadow-[0_0_18px_var(--drop-drag-glow)]'
          : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--drop-border)] hover:bg-[var(--drop-bg)]'
      ].join(' ')}
    >
      <div className="grid w-full min-w-0 max-w-full grid-rows-[48px_38px_minmax(52px,auto)] justify-items-center gap-2.5">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-[var(--surface-elevated)]',
            'transition-[border-color,color,background-color] duration-150 ease-out',
            isDragOver
              ? 'border-[var(--drop-drag-border)] text-[var(--drop-text)]'
              : 'border-[var(--border-subtle)] text-[var(--text-muted)] group-hover/empty:border-[var(--drop-border)] group-hover/empty:text-[var(--drop-text)]'
          ].join(' ')}
        >
          <Icon size={20} />
        </div>
        <p className="flex h-full max-w-[190px] items-center justify-center text-wrap break-words text-center text-sm font-semibold leading-[1.35] text-[var(--text-soft)]">
          {isDragOver ? t('kanban.dropHere') : title}
        </p>
        <p className="mx-auto flex min-h-[52px] max-w-[190px] items-start justify-center text-wrap break-words text-center text-xs leading-[1.45] text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Column({
  column,
  jobs,
  draggedJobId,
  isDragOver,
  onMoveJob,
  onEditJob,
  onCardDragStart,
  onCardDragEnd,
  onTouchDragMove,
  onTouchDrop,
  onDragOverColumn,
  onDragLeaveColumn,
  isFiltered = false,
  filteredEmptyState
}) {
  const { t } = useTranslation();
  const statusStyle = getStatusStyle(column.id);

  const handleDragEnter = (e) => {
    e.preventDefault();
    onDragOverColumn(column.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOverColumn(column.id);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onDragLeaveColumn(column.id);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId) onMoveJob(jobId, column.id);
    onCardDragEnd();
  };

  return (
    <div
      style={{
        '--column-drag-border': statusStyle.dragBorder,
        '--column-drag-bg': statusStyle.bg,
        '--column-drag-glow': statusStyle.glow,
        '--column-text': statusStyle.text
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-column-id={column.id}
      className={[
        'flex min-h-[520px] w-[86vw] min-w-[300px] max-w-[360px] shrink-0 snap-start flex-col rounded-3xl border p-2 sm:w-[320px] xl:min-h-[600px] xl:w-auto xl:min-w-0 xl:max-w-none',
        'transition-[background-color,border-color,box-shadow] duration-150 ease-out',
        isDragOver
          ? 'border-[var(--column-drag-border)] bg-[var(--column-drag-bg)] shadow-[0_0_0_1px_var(--column-drag-glow)]'
          : 'border-[var(--border-subtle)] bg-[var(--surface)] shadow-sm shadow-black/5 hover:border-[var(--border-strong)]'
      ].join(' ')}
    >
      <div className="mb-5 flex min-h-8 min-w-0 items-center justify-between gap-2 px-3 pt-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`inline-flex h-7 min-w-0 items-center rounded-full border px-3 text-xs font-semibold ${column.color}`}>
            {t(column.titleKey)}
          </span>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2 text-xs font-semibold text-[var(--text-muted)]">
            {jobs.length}
          </span>
        </div>
        {isDragOver && (
          <span className="rounded-full border border-[var(--column-drag-border)] bg-[var(--column-drag-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--column-text)]">
            Drop here
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3 px-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isDragging={draggedJobId === job.id}
              onClick={() => onEditJob(job)}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              onTouchDragMove={onTouchDragMove}
              onTouchDrop={onTouchDrop}
            />
          ))}
        </AnimatePresence>
        {jobs.length === 0 && (
          <KanbanEmptyState
            columnId={column.id}
            isDragOver={isDragOver}
            statusStyle={statusStyle}
            isFiltered={isFiltered}
            filteredEmptyState={filteredEmptyState}
          />
        )}
      </div>
    </div>
  );
}

export default memo(Column);
