import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LayoutGroup } from 'framer-motion';
import { CalendarDays, Plus, Search } from 'lucide-react';
import { useLocalStorage } from './components/Board/useLocalStorage';
import KanbanBoard from './components/Board/KanbanBoard';
import Stats from './components/Dashboard/Stats';
import Button from './components/UI/Button';
import BrandLogo from './components/UI/BrandLogo';
import AppFooter from './components/UI/AppFooter';
import LanguageSwitcher from './components/UI/LanguageSwitcher';
import ThemeToggle from './components/UI/ThemeToggle';
import JobModal from './components/Modals/JobModal';
import SmartFilters from './components/Filters/SmartFilters';
import SmartPlannerDrawer from './components/Planner/SmartPlannerDrawer';
import InsightDashboard from './components/Dashboard/InsightDashboard';
import PrepBanner from '../PrepBanner';
import InterviewPrepModal from '../InterviewPrepModal';
import {
  STATUS_LABELS,
  appendTimeline,
  createTimelineEvent,
  getFollowUpTimelineCopy,
  getNextActionDisplay,
  normalizeJobFields
} from './utils/jobMetadata';
import { getPlannerTasksFromJobs, getTodayString } from './utils/planner';
import { getSmartFilterCounts, getVisibleJobs } from './utils/filters';
import { useTranslation } from './i18n.jsx';

const COLUMNS = [
  { id: 'applied', titleKey: 'status.applied', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  { id: 'screening', titleKey: 'status.screening', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
  { id: 'interview', titleKey: 'status.interview', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  { id: 'offer', titleKey: 'status.offer', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  { id: 'rejected', titleKey: 'status.rejected', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
];

export default function App() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useLocalStorage('hiretrace-data', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [hideRejected, setHideRejected] = useLocalStorage('offerflow-hide-rejected', false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [manualPlannerTasks, setManualPlannerTasks] = useLocalStorage('offerflow-planner-tasks', []);
  const [completedPlannerTaskIds, setCompletedPlannerTaskIds] = useLocalStorage('offerflow-planner-completed', []);
  const [careerGoals, setCareerGoals] = useLocalStorage('offerflow-career-goals', []);

  const [showPrepPrompt, setShowPrepPrompt] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [prepJob, setPrepJob] = useState(null);
  const [hasSeenPrompt, setHasSeenPrompt] = useLocalStorage('hasSeenInterviewPrompt', false);
  const plannerPreview = useMemo(() => {
    const today = getTodayString();
    const completed = new Set(Array.isArray(completedPlannerTaskIds) ? completedPlannerTaskIds : []);
    const derived = getPlannerTasksFromJobs(jobs, t).tasks.filter((task) => !completed.has(task.id));
    const manual = (Array.isArray(manualPlannerTasks) ? manualPlannerTasks : []).filter((task) => !task.completed);
    const activeTasks = [...derived, ...manual].filter((task) => task.date);

    return {
      hasToday: activeTasks.some((task) => task.date === today),
      hasOverdue: activeTasks.some((task) => task.date < today)
    };
  }, [completedPlannerTaskIds, jobs, manualPlannerTasks, t]);

  useEffect(() => {
    const handleOpenPrep = (e) => {
      setPrepJob(e.detail);
      setIsPrepModalOpen(true);
    };

    window.addEventListener('open-prep-tool', handleOpenPrep);
    return () => window.removeEventListener('open-prep-tool', handleOpenPrep);
  }, []);

  const analyticsJobs = useMemo(() => jobs.filter((job) => !job.archived), [jobs]);
  const filterCounts = useMemo(() => getSmartFilterCounts(jobs), [jobs]);
  const filteredJobs = useMemo(() => (
    getVisibleJobs(jobs, { searchQuery, activeFilter, hideRejected, t })
  ), [activeFilter, hideRejected, jobs, searchQuery, t]);
  const hasFilteredView = Boolean(searchQuery.trim()) || activeFilter !== 'all' || hideRejected;
  const filteredEmptyState = useMemo(() => {
    if (activeFilter === 'archived') {
      return { titleKey: 'filters.noArchived', descriptionKey: 'filters.noMatchesHelp' };
    }

    if (activeFilter === 'rejected') {
      return { titleKey: 'filters.noRejected', descriptionKey: 'filters.noMatchesHelp' };
    }

    return { titleKey: 'filters.noMatches', descriptionKey: 'filters.noMatchesHelp' };
  }, [activeFilter]);

  const buildUpdateEvents = (previousJob, nextJob) => {
    const events = [];

    if ((previousJob.priority || 'medium') !== (nextJob.priority || 'medium')) {
      events.push(createTimelineEvent(
        'priority_changed',
        t('modal.priority'),
        `${t('modal.priority')}: ${t(`priority.${nextJob.priority || 'medium'}`)}.`
      ));
    }

    if (Boolean(previousJob.isDreamJob) !== Boolean(nextJob.isDreamJob)) {
      events.push(createTimelineEvent(
        'dream_job_updated',
        t('card.dreamJob'),
        nextJob.isDreamJob ? t('card.dreamJob') : ''
      ));
    }

    if ((previousJob.nextAction || '') !== (nextJob.nextAction || '') || (previousJob.nextActionDueDate || '') !== (nextJob.nextActionDueDate || '')) {
      events.push(createTimelineEvent(
        'next_action_updated',
        t('modal.nextAction'),
        nextJob.nextAction ? `${t('card.next')}: ${getNextActionDisplay(nextJob.nextAction, t)}` : ''
      ));
    }

    if ((previousJob.followUpDate || '') !== (nextJob.followUpDate || '')) {
      const followUpLabel = nextJob.followUpDate
        ? getFollowUpTimelineCopy(nextJob.status, 'scheduled')
        : t('modal.clearReminder');

      events.push(createTimelineEvent(
        'follow_up_scheduled',
        followUpLabel,
        nextJob.followUpDate ? `${t('modal.reminder')}: ${nextJob.followUpDate}.` : t('modal.clearReminder')
      ));
    }

    if (!previousJob.followUpDone && nextJob.followUpDone) {
      events.push(createTimelineEvent(
        'follow_up_completed',
        getFollowUpTimelineCopy(nextJob.status, 'completed'),
        t('modal.markDone')
      ));
    }

    return events;
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      const nextJob = normalizeJobFields({ ...jobData, id: editingJob.id });
      const events = buildUpdateEvents(editingJob, nextJob);
      const withEvents = events.reduce((job, event) => appendTimeline(job, event), {
        ...nextJob,
        timeline: Array.isArray(editingJob.timeline) ? editingJob.timeline : nextJob.timeline
      });

      setJobs(jobs.map((j) => (j.id === editingJob.id ? withEvents : j)));
    } else {
      const id = crypto.randomUUID();
      const nextJob = normalizeJobFields({ ...jobData, id });
      const withCreatedEvent = appendTimeline(nextJob, createTimelineEvent(
        'created',
        t('timeline.applicationAdded'),
        t('kanban.emptyApplied')
      ));

      setJobs([...jobs, withCreatedEvent]);
    }

    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleMoveJob = useCallback((jobId, newStatus) => {
    const currentJob = jobs.find((job) => job.id === jobId);
    if (!currentJob || currentJob.status === newStatus) return;

    const fromStatus = t(`status.${currentJob.status}`) || STATUS_LABELS[currentJob.status] || currentJob.status;
    const toStatus = t(`status.${newStatus}`) || STATUS_LABELS[newStatus] || newStatus;
    const statusEvent = createTimelineEvent(
      'status_changed',
      `${toStatus}`,
      `${fromStatus} -> ${toStatus}`,
      { from: currentJob.status, to: newStatus }
    );

    setJobs(jobs.map((j) => (
      j.id === jobId
        ? appendTimeline({ ...j, status: newStatus, updatedAt: new Date().toISOString() }, statusEvent)
        : j
    )));

    if (newStatus === 'interview' && !hasSeenPrompt) {
      setShowPrepPrompt(true);
    }
  }, [hasSeenPrompt, jobs, setJobs, t]);

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((j) => j.id !== id));
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleArchiveJob = (jobId, shouldArchive) => {
    const now = new Date().toISOString();
    setJobs(jobs.map((job) => {
      if (job.id !== jobId) return job;

      const event = createTimelineEvent(
        shouldArchive ? 'application_archived' : 'application_restored',
        shouldArchive ? t('archive.archived') : t('archive.restored'),
        shouldArchive ? t('archive.timelineArchived') : t('archive.timelineRestored')
      );

      return appendTimeline({
        ...job,
        archived: shouldArchive,
        archivedAt: shouldArchive ? now : job.archivedAt || '',
        updatedAt: now
      }, event);
    }));
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handlePrepareNow = () => {
    setShowPrepPrompt(false);
    setHasSeenPrompt(true);
    setIsPrepModalOpen(true);
  };

  const handlePrepLater = () => {
    setShowPrepPrompt(false);
    setHasSeenPrompt(true);
  };

  const handleOpenPlannerJob = (job) => {
    setIsPlannerOpen(false);
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleOpenPlannerPrep = (job) => {
    setIsPlannerOpen(false);
    setPrepJob(job);
    setIsPrepModalOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[#635BFF]/30">
      <PrepBanner
        show={showPrepPrompt}
        onPrepare={handlePrepareNow}
        onLater={handlePrepLater}
      />

      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-5 md:h-16 md:grid-cols-[auto_minmax(220px,380px)_auto] md:gap-x-4 md:gap-y-0 md:py-0 lg:grid-cols-[auto_minmax(260px,500px)_auto] xl:grid-cols-[minmax(0,1fr)_minmax(360px,560px)_minmax(0,1fr)] xl:px-6">
          <div className="col-start-1 row-start-1 flex min-w-0 justify-start">
            <BrandLogo />
          </div>

          <div className="col-span-2 row-start-2 flex min-w-0 justify-center md:col-span-1 md:col-start-2 md:row-start-1 md:w-full md:justify-self-center xl:col-span-1 xl:col-start-2">
            <div className="relative w-full md:max-w-[380px] lg:max-w-[500px] xl:max-w-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type="text"
                placeholder={t('header.search')}
                className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] py-2.5 pl-11 pr-4 text-base text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] transition-all focus:border-[#635BFF]/60 focus:outline-none focus:ring-4 focus:ring-[#635BFF]/20 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-start-2 row-start-1 flex min-w-max shrink-0 items-center justify-end gap-2 sm:gap-2.5 md:col-start-3 xl:gap-3">
            <button
              type="button"
              aria-label={t('planner.open')}
              title={t('planner.open')}
              onClick={() => setIsPlannerOpen(true)}
              className={[
                'theme-icon-button relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border',
                'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20',
                isPlannerOpen ? 'border-[#8B5CF6]/35 text-[var(--text)] shadow-[0_0_18px_rgba(99,91,255,0.14)]' : ''
              ].join(' ')}
            >
              <CalendarDays size={17} />
              {(plannerPreview.hasToday || plannerPreview.hasOverdue) && (
                <span
                  aria-hidden="true"
                  className={[
                    'absolute right-2 top-2 h-2 w-2 rounded-full ring-2 ring-zinc-900',
                    plannerPreview.hasOverdue ? 'bg-amber-300' : 'bg-[#635BFF]'
                  ].join(' ')}
                />
              )}
            </button>

            <ThemeToggle />

            <LanguageSwitcher />

            <button
              type="button"
              aria-label={t('header.addJob')}
              title={t('header.addJob')}
              onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
              className={[
                'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#8B5CF6]/30',
                'bg-gradient-to-br from-[#8B5CF6] via-[#6D5DFB] to-[#635BFF] p-0 text-white',
                'shadow-[0_0_22px_rgba(99,91,255,0.20)] transition-[transform,background-color,box-shadow,border-color,filter] duration-200 ease-out',
                'hover:border-[#A78BFA]/45 hover:brightness-110 hover:shadow-[0_0_28px_rgba(99,91,255,0.30)]',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20 active:scale-[0.98]',
                'xl:w-auto xl:gap-2 xl:px-5'
              ].join(' ')}
            >
              <Plus aria-hidden="true" size={21} strokeWidth={2.5} className="h-5 w-5 shrink-0" />
              <span className="hidden xl:inline">{t('header.addJob')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#8B8FA3]">
            {t('main.tagline')}
          </p>
        </div>

        <Stats jobs={analyticsJobs} />

        <SmartFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
          hideRejected={Boolean(hideRejected)}
          onToggleHideRejected={() => setHideRejected(!hideRejected)}
        />

        <section id="board" className="scroll-mt-24">
          <LayoutGroup>
            <KanbanBoard
              columns={COLUMNS}
              jobs={filteredJobs}
              isFiltered={hasFilteredView}
              filteredEmptyState={filteredEmptyState}
              onMoveJob={handleMoveJob}
              onEditJob={(job) => { setEditingJob(job); setIsModalOpen(true); }}
            />
          </LayoutGroup>
        </section>

        <div id="prep-portal"></div>

        <InsightDashboard
          jobs={analyticsJobs}
          columns={COLUMNS}
          careerGoals={careerGoals}
          setCareerGoals={setCareerGoals}
          manualPlannerTasks={manualPlannerTasks}
          setManualPlannerTasks={setManualPlannerTasks}
          completedPlannerTaskIds={completedPlannerTaskIds}
        />
      </main>

      <AppFooter onOpenPlanner={() => setIsPlannerOpen(true)} />

      {isModalOpen && (
        <JobModal
          job={editingJob}
          onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
          onSave={handleSaveJob}
          onDelete={handleDeleteJob}
          onArchive={handleArchiveJob}
        />
      )}

      <SmartPlannerDrawer
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        jobs={jobs}
        manualTasks={manualPlannerTasks}
        setManualTasks={setManualPlannerTasks}
        completedTaskIds={completedPlannerTaskIds}
        setCompletedTaskIds={setCompletedPlannerTaskIds}
        onOpenJob={handleOpenPlannerJob}
        onOpenPrep={handleOpenPlannerPrep}
      />

      <InterviewPrepModal
        isOpen={isPrepModalOpen}
        onClose={() => { setIsPrepModalOpen(false); setPrepJob(null); }}
        initialData={prepJob}
      />
    </div>
  );
}
