import { getNextActionDisplay, getNextActionLabelKey } from './jobMetadata';

const TITLE_KEY_ALIASES = {
  'planner.task.prepareInterview': ['Prepare for interview', 'Auf Interview vorbereiten', 'Подготовиться к интервью'],
  'planner.task.sendThankYou': ['Send thank-you note', 'Dankesnachricht senden', 'Отправить благодарность'],
  'planner.task.followUpRecruiter': ['Follow up with recruiter', 'Beim Recruiter nachfassen', 'Написать рекрутеру'],
  'planner.task.recruiterReply': ['Recruiter reply', 'Recruiter-Antwort', 'Ответ рекрутеру'],
  'planner.task.respondOffer': ['Respond to offer', 'Auf Angebot antworten', 'Ответить на оффер'],
  'planner.task.askFeedback': ['Ask for feedback', 'Um Feedback bitten', 'Попросить обратную связь'],
  'action.sendAvailability': ['Send availability', 'Verfügbarkeit senden', 'Отправить доступное время'],
  'action.prepareInterview': ['Prepare for interview', 'Auf Interview vorbereiten', 'Подготовиться к интервью'],
  'action.followUpRecruiter': ['Follow up with recruiter', 'Beim Recruiter nachfassen', 'Написать рекрутеру'],
  'action.waitResponse': ['Wait for response', 'Auf Antwort warten', 'Ждать ответа'],
  'action.sendThankYou': ['Send thank-you email', 'Dankesnachricht senden', 'Отправить благодарственное письмо'],
  'action.reviewOffer': ['Review offer', 'Angebot prüfen', 'Изучить оффер'],
  'action.respondOffer': ['Respond to offer', 'Auf Angebot antworten', 'Ответить на оффер'],
  'action.askFeedback': ['Ask for feedback', 'Um Feedback bitten', 'Попросить обратную связь']
};

export function getTodayString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return getTodayString(date);
}

function dateOnly(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return getTodayString(date);
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  return Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
}

function jobLabel(job) {
  return {
    company: job?.company || '',
    role: job?.position || job?.title || ''
  };
}

function makeAutoTask(job, type, date, options = {}) {
  const safeDate = dateOnly(date);
  const label = jobLabel(job);
  const dateKey = safeDate || 'no-date';
  const legacyTitles = [
    options.title,
    options.titleKey ? TITLE_KEY_ALIASES[options.titleKey] : [],
    options.legacyTitles || []
  ].flat().filter(Boolean);

  return {
    id: `auto:${job.id}:${type}:${dateKey}`,
    legacyIds: legacyTitles.map((title) => `auto:${job.id}:${type}:${dateKey}:${title}`),
    source: 'auto',
    type,
    title: options.title || '',
    titleKey: options.titleKey || '',
    date: safeDate,
    relatedJobId: job.id,
    company: label.company,
    role: label.role,
    priority: job.priority || 'medium',
    isDreamJob: Boolean(job.isDreamJob),
    completed: false,
    ...options,
    legacyIds: legacyTitles.map((title) => `auto:${job.id}:${type}:${dateKey}:${title}`)
  };
}

function makeSuggestion(job, type, title, bodyKey, date, options = {}) {
  const label = jobLabel(job);

  return {
    id: `suggestion:${job?.id || 'global'}:${type}`,
    source: 'suggestion',
    type,
    title,
    bodyKey,
    date: dateOnly(date) || getTodayString(),
    relatedJobId: job?.id || '',
    company: label.company,
    role: label.role,
    priority: job?.priority || 'medium',
    isDreamJob: Boolean(job?.isDreamJob),
    completed: false,
    ...options
  };
}

function addUniqueTask(map, task) {
  if (!task?.id) return;
  if (task.source !== 'suggestion' && !task.date) return;
  if (!map.has(task.id)) map.set(task.id, task);
}

function hasPrepareAction(job) {
  return /prepare|prep|interview/i.test(job?.nextAction || '');
}

export function getPlannerTasksFromJobs(jobs = [], t = (key) => key) {
  const today = getTodayString();
  const tasks = new Map();
  const suggestions = new Map();

  jobs.forEach((job) => {
    if (!job?.id) return;

    const status = job.status || 'applied';
    const nextActionDate = dateOnly(job.nextActionDueDate);
    const followUpDate = dateOnly(job.followUpDate);
    const nextActionTitle = job.nextAction ? getNextActionDisplay(job.nextAction, t) : '';
    const nextActionTitleKey = getNextActionLabelKey(job.nextAction || '');

    if (status === 'applied') {
      if (followUpDate && !job.followUpDone) {
        addUniqueTask(tasks, makeAutoTask(job, 'follow_up', followUpDate, { titleKey: 'planner.task.followUpRecruiter' }));
      } else {
        const baseDate = dateOnly(job.appliedDate || job.createdAt);
        if (baseDate && daysBetween(baseDate, today) > 7) {
          addUniqueTask(suggestions, makeSuggestion(job, 'follow_up', t('planner.suggest.addFollowUp'), 'planner.suggest.noResponse', addDays(today, 1)));
        }
      }
    }

    if (status === 'screening') {
      if (followUpDate && !job.followUpDone) {
        addUniqueTask(tasks, makeAutoTask(job, 'recruiter_reply', followUpDate, { titleKey: 'planner.task.recruiterReply' }));
      }

      if (!job.nextAction) {
        addUniqueTask(suggestions, makeSuggestion(job, 'next_action', t('action.sendAvailability'), 'planner.suggest.sendAvailability', today));
      }
    }

    if (status === 'interview') {
      addUniqueTask(tasks, makeAutoTask(
        job,
        'interview_prep',
        hasPrepareAction(job) && nextActionDate ? nextActionDate : today,
        { titleKey: 'planner.task.prepareInterview' }
      ));

      if (followUpDate && !job.followUpDone) {
        addUniqueTask(tasks, makeAutoTask(job, 'thank_you_note', followUpDate, { titleKey: 'planner.task.sendThankYou' }));
      }
    }

    if (status === 'offer') {
      if (followUpDate && !job.followUpDone) {
        addUniqueTask(tasks, makeAutoTask(job, 'offer_response', followUpDate, { titleKey: 'planner.task.respondOffer' }));
      } else {
        addUniqueTask(suggestions, makeSuggestion(job, 'offer_response', t('planner.suggest.setOfferDeadline'), 'planner.suggest.trackResponse', addDays(today, 1)));
      }
    }

    if (status === 'rejected') {
      if (nextActionDate && job.nextAction) {
        addUniqueTask(tasks, makeAutoTask(job, 'feedback_request', nextActionDate, {
          priority: 'low',
          title: nextActionTitle,
          titleKey: nextActionTitleKey,
          legacyTitles: [job.nextAction, nextActionTitle]
        }));
      } else {
        addUniqueTask(suggestions, makeSuggestion(job, 'feedback_request', t('planner.task.askFeedback'), 'planner.suggest.askFeedback', today, { priority: 'low' }));
      }
    }

    if (nextActionDate && nextActionTitle) {
      const isDuplicatePrep = status === 'interview' && hasPrepareAction(job);
      if (!isDuplicatePrep) {
        addUniqueTask(tasks, makeAutoTask(job, 'next_action', nextActionDate, {
          title: nextActionTitle,
          titleKey: nextActionTitleKey,
          legacyTitles: [job.nextAction, nextActionTitle]
        }));
      }
    }
  });

  if (jobs.length === 0) {
    addUniqueTask(suggestions, {
      id: 'suggestion:global:new_applications',
      source: 'suggestion',
      type: 'manual',
      title: t('planner.suggest.planApplications'),
      bodyKey: 'planner.suggest.planApplicationsBody',
      date: today,
      relatedJobId: '',
      company: '',
      role: '',
      priority: 'medium',
      isDreamJob: false,
      completed: false
    });
  }

  return {
    tasks: Array.from(tasks.values()),
    suggestions: Array.from(suggestions.values())
  };
}

export function sortPlannerTasks(tasks = []) {
  const priorityScore = { high: 0, medium: 1, low: 2 };

  return [...tasks].sort((a, b) => {
    const priorityDelta = (priorityScore[a.priority] ?? 1) - (priorityScore[b.priority] ?? 1);
    if (priorityDelta !== 0) return priorityDelta;
    if (Boolean(a.isDreamJob) !== Boolean(b.isDreamJob)) return a.isDreamJob ? -1 : 1;
    return (a.date || '').localeCompare(b.date || '') || (a.titleKey || a.title).localeCompare(b.titleKey || b.title);
  });
}

export function getPlannerSection(task, today = getTodayString()) {
  if (!task.date) return 'later';
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  if (task.date < today) return 'overdue';
  if (task.date === today) return 'today';
  if (task.date === tomorrow) return 'tomorrow';
  if (task.date <= weekEnd) return 'week';
  return 'later';
}

export function groupPlannerTasks(tasks = [], today = getTodayString()) {
  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    week: [],
    later: []
  };

  sortPlannerTasks(tasks).forEach((task) => {
    groups[getPlannerSection(task, today)].push(task);
  });

  return groups;
}
