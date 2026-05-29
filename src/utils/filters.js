import { getNextActionDisplay } from './jobMetadata';
import { getTodayString } from './planner';

export const SMART_FILTERS = [
  { id: 'all', labelKey: 'filters.all' },
  { id: 'dream', labelKey: 'filters.dream' },
  { id: 'high', labelKey: 'filters.high' },
  { id: 'dueToday', labelKey: 'filters.dueToday' },
  { id: 'interviews', labelKey: 'filters.interviews' },
  { id: 'offers', labelKey: 'filters.offers' },
  { id: 'rejected', labelKey: 'filters.rejected' },
  { id: 'archived', labelKey: 'filters.archived' }
];

export function isArchived(job) {
  return Boolean(job?.archived);
}

export function isDueToday(job, today = getTodayString()) {
  if (!job || isArchived(job)) return false;
  if (job.followUpDate === today && !job.followUpDone) return true;
  if (job.nextActionDueDate === today) return true;
  return job.status === 'interview';
}

function matchesSmartFilter(job, activeFilter, today) {
  if (activeFilter === 'all') return true;
  if (activeFilter === 'dream') return Boolean(job.isDreamJob);
  if (activeFilter === 'high') return job.priority === 'high';
  if (activeFilter === 'dueToday') return isDueToday(job, today);
  if (activeFilter === 'interviews') return job.status === 'interview';
  if (activeFilter === 'offers') return job.status === 'offer';
  if (activeFilter === 'rejected') return job.status === 'rejected';
  if (activeFilter === 'archived') return isArchived(job);
  return true;
}

function matchesSearch(job, query, t) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  const status = job.status || 'applied';
  const values = [
    job.company || '',
    job.position || job.title || '',
    job.location || '',
    status,
    t(`status.${status}`),
    job.priority ? t(`priority.${job.priority}`) : '',
    getNextActionDisplay(job.nextAction || '', t)
  ];

  return values.some((value) => String(value).toLowerCase().includes(normalized));
}

export function getVisibleJobs(jobs, { searchQuery = '', activeFilter = 'all', hideRejected = false, t = (key) => key } = {}) {
  const today = getTodayString();

  return jobs.filter((job) => {
    if (activeFilter === 'archived') {
      return isArchived(job) && matchesSearch(job, searchQuery, t);
    }

    if (isArchived(job)) return false;
    if (hideRejected && activeFilter !== 'rejected' && job.status === 'rejected') return false;
    if (!matchesSmartFilter(job, activeFilter, today)) return false;
    return matchesSearch(job, searchQuery, t);
  });
}

export function getSmartFilterCounts(jobs) {
  const today = getTodayString();
  const nonArchived = jobs.filter((job) => !isArchived(job));

  return {
    all: nonArchived.length,
    dream: nonArchived.filter((job) => Boolean(job.isDreamJob)).length,
    high: nonArchived.filter((job) => job.priority === 'high').length,
    dueToday: nonArchived.filter((job) => isDueToday(job, today)).length,
    interviews: nonArchived.filter((job) => job.status === 'interview').length,
    offers: nonArchived.filter((job) => job.status === 'offer').length,
    rejected: nonArchived.filter((job) => job.status === 'rejected').length,
    archived: jobs.filter((job) => isArchived(job)).length
  };
}

