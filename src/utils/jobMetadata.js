export const STATUS_LABELS = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected'
};

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export const NEXT_ACTION_PRESETS = [
  'Prepare for interview',
  'Follow up with recruiter',
  'Send thank-you email',
  'Update resume',
  'Wait for response'
];

export const STATUS_ACTION_SUGGESTIONS = {
  applied: ['Follow up with recruiter', 'Wait for response'],
  screening: ['Reply to recruiter', 'Send availability', 'Confirm next steps'],
  interview: ['Prepare for interview', 'Send thank-you email', 'Review interview notes'],
  offer: ['Review offer', 'Negotiate salary', 'Respond to offer'],
  rejected: ['Ask for feedback', 'Review application', 'Update resume']
};

export const NEXT_ACTION_LABEL_KEYS = {
  'Prepare for interview': 'action.prepareInterview',
  'Follow up with recruiter': 'action.followUpRecruiter',
  'Wait for response': 'action.waitResponse',
  'Send availability': 'action.sendAvailability',
  'Reply to recruiter': 'action.replyRecruiter',
  'Confirm next steps': 'action.confirmNext',
  'Send thank-you email': 'action.sendThankYou',
  'Review offer': 'action.reviewOffer',
  'Negotiate salary': 'action.negotiateSalary',
  'Respond to offer': 'action.respondOffer',
  'Ask for feedback': 'action.askFeedback',
  'Review application': 'action.reviewApplication',
  'Update resume': 'action.updateResume',
  'Send portfolio': 'action.sendPortfolio',
  'Review job description': 'action.reviewJobDescription',
  'Practice technical questions': 'action.practiceTechnical',
  'Review interview notes': 'action.reviewInterviewNotes'
};

export function getNextActionLabelKey(value = '') {
  return NEXT_ACTION_LABEL_KEYS[value] || '';
}

export function getNextActionDisplay(value = '', t = (key) => key) {
  const key = getNextActionLabelKey(value);
  return key ? t(key) : value;
}

export const priorityStyles = {
  low: 'of-chip-priority-low',
  medium: 'of-chip-priority-medium',
  high: 'of-chip-priority-high'
};

export function getPriority(job) {
  return job?.priority || 'medium';
}

export function isDreamJob(job) {
  return Boolean(job?.isDreamJob);
}

export function todayString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function addDaysString(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return todayString(date);
}

export function formatShortDate(value) {
  if (!value) return '';

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatTimelineDate(value) {
  if (!value) return 'No date';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatShortDate(value) || 'No date';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isFollowUpDue(job) {
  if (!job?.followUpDate || job.followUpDone) return false;
  return job.followUpDate <= todayString();
}

export function getFollowUpLabel(job, helpers = {}) {
  if (!job?.followUpDate || job.followUpDone) return '';

  const config = getFollowUpStatusConfig(job?.status);
  const t = helpers.t || ((key) => key);
  const formatDate = helpers.formatDate || formatShortDate;
  if (isFollowUpDue(job)) return config.dueLabelKey ? t(config.dueLabelKey) : config.dueLabel;

  const prefix = config.futurePrefixKey ? t(config.futurePrefixKey) : config.futurePrefix;
  return `${prefix} \u00b7 ${formatDate(job.followUpDate)}`.trim();
}

function getDateOnly(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return todayString(date);
}

function getDaysSince(value) {
  const dateOnly = getDateOnly(value);
  if (!dateOnly) return null;

  const start = new Date(`${dateOnly}T00:00:00`);
  const today = new Date(`${todayString()}T00:00:00`);

  return Math.floor((today.getTime() - start.getTime()) / 86400000);
}

export const FOLLOW_UP_STATUS_CONFIG = {
  applied: {
    title: 'Follow-up Reminder',
    helper: 'Set a reminder to follow up if you do not hear back.',
    dueLabel: 'Follow-up due',
    dueLabelKey: 'follow.appliedDue',
    futurePrefix: 'Follow-up',
    futurePrefixKey: 'follow.appliedFuture',
    dueTone: 'amber',
    futureTone: 'blue',
    quickActions: [
      { label: 'In 3 days', days: 3 },
      { label: 'In 7 days', days: 7 }
    ],
    scheduledEvent: 'Follow-up scheduled',
    completedEvent: 'Follow-up completed'
  },
  screening: {
    title: 'Recruiter Reply',
    helper: 'Track when you need to reply or confirm next steps.',
    dueLabel: 'Recruiter reply due',
    dueLabelKey: 'follow.screeningDue',
    futurePrefix: 'Recruiter reply',
    futurePrefixKey: 'follow.screeningFuture',
    dueTone: 'indigo',
    futureTone: 'blue',
    quickActions: [
      { label: 'Tomorrow', days: 1 },
      { label: 'In 3 days', days: 3 }
    ],
    scheduledEvent: 'Recruiter reply scheduled',
    completedEvent: 'Recruiter reply completed'
  },
  interview: {
    title: 'Post-interview Follow-up',
    helper: 'Set a reminder to send a thank-you note or follow up after the interview.',
    dueLabel: 'Thank-you note due',
    dueLabelKey: 'follow.interviewDue',
    futurePrefix: 'Thank-you note',
    futurePrefixKey: 'follow.interviewFuture',
    dueTone: 'violetAmber',
    futureTone: 'indigo',
    quickActions: [
      { label: 'Today', days: 0 },
      { label: 'Tomorrow', days: 1 },
      { label: 'In 2 days', days: 2 }
    ],
    scheduledEvent: 'Post-interview follow-up scheduled',
    completedEvent: 'Post-interview follow-up completed'
  },
  offer: {
    title: 'Offer Response',
    helper: 'Track your deadline to review, negotiate, or respond to the offer.',
    dueLabel: 'Offer response due',
    dueLabelKey: 'follow.offerDue',
    futurePrefix: 'Response deadline',
    futurePrefixKey: 'follow.offerFuture',
    dueTone: 'emeraldAmber',
    futureTone: 'emerald',
    quickActions: [
      { label: 'Tomorrow', days: 1 },
      { label: 'In 3 days', days: 3 },
      { label: 'In 7 days', days: 7 }
    ],
    scheduledEvent: 'Offer response reminder set',
    completedEvent: 'Offer response completed'
  },
  rejected: {
    title: 'Feedback / Archive',
    helper: 'Optionally ask for feedback or keep this as history.',
    dueLabel: '',
    futurePrefix: 'Feedback reminder',
    futurePrefixKey: 'follow.feedbackFuture',
    dueTone: 'muted',
    futureTone: 'muted',
    quickActions: [
      { label: 'Ask for feedback', nextAction: 'Ask for feedback' },
      { label: 'No reminder', clearReminder: true }
    ],
    scheduledEvent: 'Feedback reminder set',
    completedEvent: 'Feedback reminder completed'
  }
};

export function getFollowUpStatusConfig(status = 'applied') {
  return FOLLOW_UP_STATUS_CONFIG[status] || FOLLOW_UP_STATUS_CONFIG.applied;
}

export function getFollowUpDisplay(job, helpers = {}) {
  const status = job?.status || 'applied';
  const config = getFollowUpStatusConfig(status);
  const t = helpers.t || ((key) => key);
  const formatDate = helpers.formatDate || formatShortDate;

  if (job?.followUpDone) {
    return {
      shouldShowOnCard: false,
      label: '',
      tone: 'muted',
      isDue: false,
      isSuggestion: false
    };
  }

  if (status === 'rejected') {
    return {
      shouldShowOnCard: false,
      label: '',
      tone: 'muted',
      isDue: false,
      isSuggestion: false
    };
  }

  if (job?.followUpDate) {
    const isDue = isFollowUpDue(job);
    const label = isDue
      ? (config.dueLabelKey ? t(config.dueLabelKey) : config.dueLabel)
      : `${config.futurePrefixKey ? t(config.futurePrefixKey) : config.futurePrefix} \u00b7 ${formatDate(job.followUpDate)}`.trim();

    return {
      shouldShowOnCard: Boolean(label),
      label,
      tone: isDue ? config.dueTone : config.futureTone,
      isDue,
      isSuggestion: false
    };
  }

  if (status === 'applied') {
    const age = getDaysSince(job?.createdAt || job?.appliedDate);

    if (age !== null && age > 7) {
      return {
        shouldShowOnCard: true,
        label: t('follow.consider'),
        tone: 'suggestion',
        isDue: false,
        isSuggestion: true
      };
    }
  }

  return {
    shouldShowOnCard: false,
    label: '',
    tone: 'muted',
    isDue: false,
    isSuggestion: false
  };
}

export function getFollowUpTimelineCopy(status = 'applied', action = 'scheduled', hasDate = false) {
  const config = getFollowUpStatusConfig(status);

  if (action === 'completed') return config.completedEvent;
  if (action === 'cleared') return hasDate ? config.scheduledEvent : 'Follow-up cleared';

  return config.scheduledEvent;
}

export function createTimelineEvent(type, label, description = '', metadata = {}) {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    description,
    createdAt: new Date().toISOString(),
    metadata
  };
}

export function ensureTimeline(job) {
  const timeline = Array.isArray(job?.timeline) ? job.timeline : [];
  const createdAt = job?.createdAt || job?.appliedDate || job?.updatedAt || '';
  const status = STATUS_LABELS[job?.status] || job?.status || 'Unknown';
  const fallbackEvents = [];

  if (!timeline.some((event) => event.type === 'created')) {
    fallbackEvents.push({
      id: 'fallback-created',
      type: 'created',
      label: 'Application added',
      description: 'This opportunity was added to your pipeline.',
      createdAt
    });
  }

  if (!timeline.some((event) => event.type === 'status_changed')) {
    fallbackEvents.push({
      id: 'fallback-status',
      type: 'status_changed',
      label: `Current status: ${status}`,
      description: `This application is currently in ${status}.`,
      createdAt: job?.updatedAt || createdAt,
      metadata: { to: job?.status || 'applied' }
    });
  }

  return [...timeline, ...fallbackEvents];
}

export function appendTimeline(job, event) {
  return {
    ...job,
    timeline: [event, ...(Array.isArray(job.timeline) ? job.timeline : [])]
  };
}

export function normalizeJobFields(job) {
  return {
    ...job,
    priority: job?.priority || 'medium',
    isDreamJob: Boolean(job?.isDreamJob),
    nextAction: job?.nextAction || '',
    nextActionDueDate: job?.nextActionDueDate || '',
    followUpDate: job?.followUpDate || '',
    followUpDone: Boolean(job?.followUpDone),
    followUpNote: job?.followUpNote || '',
    lastFollowUpAt: job?.lastFollowUpAt || '',
    archived: Boolean(job?.archived),
    archivedAt: job?.archivedAt || '',
    archivedReason: job?.archivedReason || '',
    timeline: Array.isArray(job?.timeline) ? job.timeline : [],
    createdAt: job?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
