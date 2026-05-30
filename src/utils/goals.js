import { addDays, getTodayString } from './planner';

export const GOAL_TYPES = ['applications', 'interviews', 'followUps', 'interviewPrep', 'opportunities', 'custom'];
export const GOAL_PERIODS = ['week', 'month', 'next7', 'next30', 'custom'];

export function dateOnly(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return getTodayString(date);
}

function startOfWeek(date) {
  const next = new Date(date);
  const day = next.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + delta);
  return next;
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getGoalDateRange(period, customStartDate = '', customEndDate = '', today = getTodayString()) {
  const now = new Date(`${today}T00:00:00`);

  if (period === 'week') {
    const start = startOfWeek(now);
    return { startDate: getTodayString(start), endDate: addDays(getTodayString(start), 6) };
  }

  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: getTodayString(start), endDate: getTodayString(endOfMonth(now)) };
  }

  if (period === 'next30') {
    return { startDate: today, endDate: addDays(today, 29) };
  }

  if (period === 'custom') {
    return { startDate: dateOnly(customStartDate), endDate: dateOnly(customEndDate) };
  }

  return { startDate: today, endDate: addDays(today, 6) };
}

function isWithinRange(value, startDate, endDate) {
  const date = dateOnly(value);
  if (!date || !startDate || !endDate) return false;
  return date >= startDate && date <= endDate;
}

function parseCompletedPlannerId(id) {
  const parts = String(id || '').split(':');
  if (parts[0] !== 'auto' || parts.length < 4) return null;
  return {
    jobId: parts[1],
    type: parts[2],
    date: parts[3]
  };
}

export function calculateGoalProgress(goal, jobs = [], manualTasks = [], completedTaskIds = [], today = getTodayString()) {
  const activeJobs = jobs.filter((job) => !job.archived);
  const activeJobIds = new Set(activeJobs.map((job) => job.id).filter(Boolean));
  const startDate = goal.startDate || today;
  const endDate = goal.endDate || today;
  const completedIds = Array.isArray(completedTaskIds) ? completedTaskIds : [];
  const completedAuto = completedIds.map(parseCompletedPlannerId).filter(Boolean);
  const manual = Array.isArray(manualTasks) ? manualTasks : [];
  let progress = 0;

  if (goal.type === 'custom') {
    progress = Number(goal.completedManualCount || 0);
  }

  if (goal.type === 'applications') {
    progress = activeJobs.filter((job) => isWithinRange(job.appliedDate || job.createdAt, startDate, endDate)).length;
  }

  if (goal.type === 'opportunities') {
    progress = activeJobs.filter((job) => isWithinRange(job.createdAt || job.appliedDate, startDate, endDate)).length;
  }

  if (goal.type === 'interviews') {
    progress = activeJobs.filter((job) => job.status === 'interview').length;
  }

  if (goal.type === 'followUps') {
    const autoTypes = new Set(['follow_up', 'thank_you_note', 'recruiter_reply', 'offer_response']);
    const autoCount = completedAuto.filter((task) => (
      activeJobIds.has(task.jobId)
      && autoTypes.has(task.type)
      && isWithinRange(task.date, startDate, endDate)
    )).length;
    const jobCount = activeJobs.filter((job) => job.followUpDone && isWithinRange(job.followUpDate || job.lastFollowUpAt, startDate, endDate)).length;
    progress = autoCount + jobCount;
  }

  if (goal.type === 'interviewPrep') {
    const autoCount = completedAuto.filter((task) => (
      activeJobIds.has(task.jobId)
      && task.type === 'interview_prep'
      && isWithinRange(task.date, startDate, endDate)
    )).length;
    const manualCount = manual.filter((task) => task.completed && task.relatedGoalId === goal.id && isWithinRange(task.date, startDate, endDate)).length;
    progress = autoCount + manualCount;
  }

  const target = Math.max(1, Number(goal.target || 1));
  const clampedProgress = goal.type === 'custom'
    ? Math.min(target, Math.max(0, progress))
    : Math.max(0, progress);
  const percentage = Math.min(100, Math.round((clampedProgress / target) * 100));
  const remaining = Math.max(0, target - clampedProgress);
  const totalDays = Math.max(1, Math.floor((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000) + 1);
  const elapsedDays = today < startDate ? 0 : Math.min(totalDays, Math.floor((new Date(`${today}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000) + 1);
  const daysLeft = Math.max(0, Math.ceil((new Date(`${endDate}T00:00:00`) - new Date(`${today}T00:00:00`)) / 86400000));
  const expectedProgress = (target * elapsedDays) / totalDays;

  let status = 'onTrack';
  if (today < startDate) status = 'upcoming';
  if (today > endDate && clampedProgress < target) status = 'missed';
  if (clampedProgress >= target) status = 'completed';
  if (status === 'onTrack' && clampedProgress + 0.5 < expectedProgress) status = 'behind';

  return {
    progress: clampedProgress,
    target,
    percentage,
    remaining,
    daysLeft,
    status,
    isComplete: clampedProgress >= target
  };
}

export function buildGoalTitle(goal, t) {
  if (goal.titleOverride) return goal.titleOverride;
  return t(`goals.type.${goal.type}`);
}

export function createPlannerRemindersForGoal(goal, t) {
  if (!goal?.id || goal.type === 'custom') return [];

  const target = Math.max(1, Number(goal.target || 1));
  const startDate = goal.startDate || getTodayString();
  const endDate = goal.endDate || startDate;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const totalDays = Math.max(1, Math.floor((end - start) / 86400000) + 1);
  const reminderCount = Math.min(7, target, totalDays);

  return Array.from({ length: reminderCount }, (_, index) => {
    const offset = reminderCount === 1 ? 0 : Math.round((index * (totalDays - 1)) / (reminderCount - 1));
    const date = addDays(startDate, offset);
    return {
      id: crypto.randomUUID(),
      type: 'manual',
      title: t(`goals.reminder.${goal.type}`),
      date,
      notes: '',
      priority: goal.type === 'interviews' || goal.type === 'interviewPrep' ? 'high' : 'medium',
      relatedJobId: '',
      relatedGoalId: goal.id,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}
