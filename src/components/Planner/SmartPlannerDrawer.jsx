import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Lightbulb,
  MessageSquareReply,
  Plus,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import Button from '../UI/Button';
import CustomSelect from '../UI/CustomSelect';
import { useTranslation } from '../../i18n.jsx';
import {
  addDays,
  getPlannerTasksFromJobs,
  getTodayString,
  sortPlannerTasks
} from '../../utils/planner';

const inputClass = 'h-11 w-full rounded-2xl border border-white/[0.10] bg-zinc-950/60 px-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-zinc-600 focus:border-[#635BFF]/60 focus:ring-4 focus:ring-[#635BFF]/15';
const textareaClass = 'min-h-[74px] w-full resize-none rounded-2xl border border-white/[0.10] bg-zinc-950/60 px-3 py-3 text-sm leading-5 text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-zinc-600 focus:border-[#635BFF]/60 focus:ring-4 focus:ring-[#635BFF]/15';
const labelClass = 'text-[11px] font-semibold leading-4 text-zinc-500';

const tabs = [
  { id: 'today', labelKey: 'planner.tab.today' },
  { id: 'week', labelKey: 'planner.tab.week' },
  { id: 'suggested', labelKey: 'planner.tab.suggested' },
  { id: 'done', labelKey: 'planner.tab.done' }
];

const plannerLocales = {
  en: 'en-US',
  de: 'de-DE',
  ru: 'ru-RU'
};

const typeMeta = {
  manual: { icon: ClipboardList, tone: 'text-slate-300', chip: 'of-chip-slate' },
  next_action: { icon: Clock3, tone: 'text-violet-300', chip: 'of-chip-violet' },
  follow_up: { icon: Bell, tone: 'text-amber-300', chip: 'of-chip-warning' },
  recruiter_reply: { icon: MessageSquareReply, tone: 'text-sky-300', chip: 'of-chip-technical' },
  interview_prep: { icon: Sparkles, tone: 'text-violet-300', chip: 'of-chip-violet' },
  thank_you_note: { icon: MessageSquareReply, tone: 'text-amber-200', chip: 'of-chip-reminder' },
  offer_response: { icon: Briefcase, tone: 'text-emerald-300', chip: 'of-chip-success' },
  feedback_request: { icon: MessageSquareReply, tone: 'text-rose-300', chip: 'of-chip-danger' }
};

function getJobLabel(job, fallback) {
  if (!job) return fallback;
  return [job.company, job.position || job.title].filter(Boolean).join(' · ') || fallback;
}

function getPlannerLocale(language) {
  return plannerLocales[language] || plannerLocales.en;
}

function getCalendarDays(startDate, count = 14) {
  return Array.from({ length: count }, (_, index) => addDays(startDate, index));
}

function formatWeekdayShort(dateKey, language) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(getPlannerLocale(language), { weekday: 'short' }).replace('.', '');
}

function formatSelectedDayLabel(dateKey, language, t) {
  const today = getTodayString();
  if (dateKey === today) return t('planner.calendar.today');
  if (dateKey === addDays(today, 1)) return t('planner.calendar.tomorrow');

  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString(getPlannerLocale(language), {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

function getTaskCountLabel(count, t) {
  return count === 1
    ? t('planner.calendar.taskSingular', { count })
    : t('planner.calendar.taskPlural', { count });
}

function CalendarStrip({
  days,
  selectedDate,
  today,
  taskCounts,
  onSelectDay
}) {
  const { t, language, formatDate } = useTranslation();

  return (
    <section className="mb-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays size={15} className="shrink-0 text-[var(--primary)]" />
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {t('planner.calendar.title')}
          </p>
        </div>
        <p className="shrink-0 text-[11px] font-medium text-[var(--text-faint)]">
          {formatDate(selectedDate)}
        </p>
      </div>
      <div className="modal-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {days.map((dateKey) => {
          const count = taskCounts.get(dateKey) || 0;
          const displayCount = count > 9 ? '9+' : String(count);
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === today;
          const date = new Date(`${dateKey}T00:00:00`);
          const dayNumber = Number.isNaN(date.getTime()) ? '' : date.getDate();
          const countText = getTaskCountLabel(count, t);

          return (
            <button
              key={dateKey}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${t('planner.calendar.selectDay')} ${formatSelectedDayLabel(dateKey, language, t)}, ${countText}`}
              onClick={() => onSelectDay(dateKey)}
              className={[
                'h-[68px] w-[68px] shrink-0 rounded-2xl border p-2 text-left transition-[background-color,border-color,box-shadow,color] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#635BFF]/20',
                isSelected
                  ? 'border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--text)] shadow-[0_0_18px_var(--primary-glow)]'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)]',
                isToday && !isSelected ? 'ring-1 ring-[var(--primary-border)]' : ''
              ].join(' ')}
            >
              <span className="block text-[11px] font-semibold uppercase leading-4">
                {isToday ? t('planner.calendar.todayShort') : formatWeekdayShort(dateKey, language)}
              </span>
              <span className="mt-0.5 block text-xl font-bold leading-6 text-[var(--text)]">
                {dayNumber}
              </span>
              <span className="mt-0.5 flex h-[14px] items-center">
                {count > 0 ? (
                  <span
                    className={[
                      'inline-grid h-[14px] place-items-center rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[9px] font-semibold leading-none text-[var(--primary)] tabular-nums',
                      count > 9 ? 'min-w-[18px] px-[3px]' : 'w-[14px]'
                    ].join(' ')}
                  >
                    {displayCount}
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function normalizeManualTasks(tasks, jobs) {
  const jobMap = new Map(jobs.map((job) => [job.id, job]));

  return (Array.isArray(tasks) ? tasks : []).map((task) => {
    const job = task.relatedJobId ? jobMap.get(task.relatedJobId) : null;
    return {
      ...task,
      source: 'manual',
      type: 'manual',
      company: job?.company || '',
      role: job?.position || job?.title || '',
      priority: task.priority || 'medium',
      isDreamJob: Boolean(job?.isDreamJob),
      completed: Boolean(task.completed)
    };
  }).filter((task) => {
    if (!task.relatedJobId) return true;
    const job = jobMap.get(task.relatedJobId);
    return !job?.archived;
  });
}

function TaskCard({
  task,
  onMarkDone,
  onOpenJob,
  onOpenPrep,
  onDelete,
  onAddSuggestion
}) {
  const { t, formatDate } = useTranslation();
  const meta = typeMeta[task.type] || typeMeta.manual;
  const Icon = meta.icon;
  const hasJob = Boolean(task.relatedJobId);
  const isSuggestion = task.source === 'suggestion';
  const jobContext = [task.company, task.role].filter(Boolean).join(' · ');
  const title = task.titleKey ? t(task.titleKey) : task.title;
  const body = task.bodyKey
    ? t(task.bodyKey, { company: task.company || t('job.unknownCompany') })
    : '';

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-zinc-950/45 p-4 transition-[border-color,background-color] duration-150 hover:border-[#8B5CF6]/25 hover:bg-zinc-950/65">
      <div className="flex items-start gap-3">
        <div className={`of-chip mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.chip}`}>
          <Icon size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <h3 className="min-w-0 text-sm font-semibold leading-5 text-zinc-100">{title}</h3>
            {task.priority === 'high' && (
              <span className="of-chip of-chip-priority-high shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                {t('priority.high')}
              </span>
            )}
          </div>
          {body && <p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            {task.date && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-zinc-900/70 px-2.5 py-1">
                <CalendarDays size={12} />
                {formatDate(task.date)}
              </span>
            )}
            {jobContext && (
              <span className="min-w-0 truncate rounded-full border border-white/[0.08] bg-zinc-900/70 px-2.5 py-1">
                {jobContext}
              </span>
            )}
          </div>
          {task.notes && <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{task.notes}</p>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 pl-11">
        {isSuggestion ? (
          <Button type="button" variant="secondary" size="compact" onClick={() => onAddSuggestion(task)}>
            <Plus size={13} />
            {t('planner.addToPlanner')}
          </Button>
        ) : (
          !task.completed && (
            <Button type="button" variant="secondary" size="compact" onClick={() => onMarkDone(task)}>
              <CheckCircle2 size={13} />
              {t('planner.markDone')}
            </Button>
          )
        )}
        {hasJob && (
          <Button type="button" variant="ghost" size="compact" onClick={() => onOpenJob(task.relatedJobId)}>
            {t('planner.openJob')}
          </Button>
        )}
        {task.type === 'interview_prep' && hasJob && (
          <Button type="button" variant="ghost" size="compact" onClick={() => onOpenPrep(task.relatedJobId)}>
            {t('planner.openPrep')}
          </Button>
        )}
        {task.source === 'manual' && (
          <Button
            type="button"
            variant="ghost"
            size="compact"
            onClick={() => onDelete(task.id)}
            aria-label={t('planner.delete')}
            className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <Trash2 size={13} />
            {t('planner.delete')}
          </Button>
        )}
      </div>
    </article>
  );
}

function EmptyState({ suggested = false }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-dashed border-white/[0.10] bg-zinc-950/30 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-zinc-900/70 text-zinc-500">
        {suggested ? <Lightbulb size={18} /> : <CalendarDays size={18} />}
      </div>
      <p className="text-sm font-semibold text-zinc-200">{t('planner.emptyTitle')}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{t('planner.emptyBody')}</p>
    </div>
  );
}

export default function SmartPlannerDrawer({
  isOpen,
  onClose,
  jobs,
  manualTasks,
  setManualTasks,
  completedTaskIds,
  setCompletedTaskIds,
  onOpenJob,
  onOpenPrep
}) {
  const { t, language } = useTranslation();
  const today = getTodayString();
  const [activeTab, setActiveTab] = useState('today');
  const [selectedPlannerDate, setSelectedPlannerDate] = useState(today);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    date: today,
    relatedJobId: '',
    priority: 'medium',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const completedSet = useMemo(() => new Set(Array.isArray(completedTaskIds) ? completedTaskIds : []), [completedTaskIds]);
  const activeJobs = useMemo(() => jobs.filter((job) => !job.archived), [jobs]);
  const manual = useMemo(() => normalizeManualTasks(manualTasks, jobs), [manualTasks, jobs]);
  const derived = useMemo(() => getPlannerTasksFromJobs(activeJobs, t), [activeJobs, t]);
  const isAutoTaskCompleted = (task) => (
    completedSet.has(task.id)
    || (Array.isArray(task.legacyIds) && task.legacyIds.some((legacyId) => completedSet.has(legacyId)))
  );
  const activeAutoTasks = derived.tasks.filter((task) => !isAutoTaskCompleted(task));
  const completedAutoTasks = derived.tasks.filter((task) => isAutoTaskCompleted(task)).map((task) => ({ ...task, completed: true }));
  const activeManualTasks = manual.filter((task) => !task.completed);
  const completedManualTasks = manual.filter((task) => task.completed);
  const activeTasks = sortPlannerTasks([...activeAutoTasks, ...activeManualTasks]);
  const doneTasks = sortPlannerTasks([...completedAutoTasks, ...completedManualTasks]);
  const calendarDays = useMemo(() => getCalendarDays(today, 14), [today]);
  const taskCountsByDate = useMemo(() => {
    const counts = new Map();
    activeTasks.forEach((task) => {
      if (!task.date) return;
      counts.set(task.date, (counts.get(task.date) || 0) + 1);
    });
    return counts;
  }, [activeTasks]);
  const overdueTasks = sortPlannerTasks(activeTasks.filter((task) => task.date && task.date < today));
  const selectedDayTasks = sortPlannerTasks(activeTasks.filter((task) => task.date === selectedPlannerDate));
  const todayTasks = activeTasks.filter((task) => task.date === today);
  const weekEnd = addDays(today, 7);
  const weekTasks = activeTasks.filter((task) => task.date >= today && task.date <= weekEnd);
  const todayOverviewCount = todayTasks.length + overdueTasks.length;
  const selectedDayLabel = formatSelectedDayLabel(selectedPlannerDate, language, t);
  const showCalendar = activeTab === 'today' || activeTab === 'week';
  const jobOptions = [
    { value: '', label: t('planner.noRelatedJob') },
    ...activeJobs.map((job) => ({ value: job.id, label: getJobLabel(job, t('job.unknownCompany')) }))
  ];
  const priorityOptions = ['low', 'medium', 'high'].map((priority) => ({
    value: priority,
    label: t(`priority.${priority}`)
  }));

  useEffect(() => {
    const currentIds = Array.isArray(completedTaskIds) ? completedTaskIds : [];
    const migratedIds = derived.tasks
      .filter((task) => !completedSet.has(task.id))
      .filter((task) => Array.isArray(task.legacyIds) && task.legacyIds.some((legacyId) => completedSet.has(legacyId)))
      .map((task) => task.id)
      .filter((id) => !completedSet.has(id));

    if (migratedIds.length === 0) return;

    setCompletedTaskIds([...currentIds, ...migratedIds]);
  }, [completedSet, completedTaskIds, derived.tasks, setCompletedTaskIds]);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      date: selectedPlannerDate || getTodayString(),
      relatedJobId: '',
      priority: 'medium',
      notes: ''
    });
    setErrors({});
  };

  const createManualTask = (taskData) => {
    const nextTask = {
      id: crypto.randomUUID(),
      type: 'manual',
      title: taskData.title.trim(),
      date: taskData.date,
      notes: taskData.notes || '',
      priority: taskData.priority || 'medium',
      relatedJobId: taskData.relatedJobId || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setManualTasks([...(Array.isArray(manualTasks) ? manualTasks : []), nextTask]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = t('planner.validationTitle');
    if (!form.date) nextErrors.date = t('planner.validationDate');

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    createManualTask(form);
    resetForm();
    setIsAdding(false);
    setActiveTab('week');
    setSelectedPlannerDate(form.date || selectedPlannerDate);
  };

  const handleAddSuggestion = (task) => {
    createManualTask({
      title: task.title,
      date: task.date || getTodayString(),
      notes: task.bodyKey ? t(task.bodyKey, { company: task.company || t('job.unknownCompany') }) : '',
      priority: task.priority || 'medium',
      relatedJobId: task.relatedJobId || ''
    });
    setActiveTab('week');
    setSelectedPlannerDate(task.date || getTodayString());
  };

  const handleSelectDay = (dateKey) => {
    setSelectedPlannerDate(dateKey);
    if (activeTab === 'today' && dateKey !== today) setActiveTab('week');
  };

  const handleToggleAdd = () => {
    setIsAdding((current) => {
      const next = !current;
      if (next) {
        setForm((currentForm) => ({
          ...currentForm,
          date: selectedPlannerDate || getTodayString()
        }));
      }
      return next;
    });
  };

  const handleMarkDone = (task) => {
    if (task.source === 'manual') {
      setManualTasks((Array.isArray(manualTasks) ? manualTasks : []).map((item) => (
        item.id === task.id
          ? { ...item, completed: true, updatedAt: new Date().toISOString() }
          : item
      )));
      return;
    }

    if (!completedSet.has(task.id)) {
      setCompletedTaskIds([...(Array.isArray(completedTaskIds) ? completedTaskIds : []), task.id]);
    }
  };

  const handleDeleteManual = (taskId) => {
    setManualTasks((Array.isArray(manualTasks) ? manualTasks : []).filter((task) => task.id !== taskId));
  };

  const handleOpenJob = (jobId) => {
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return;
    onOpenJob(job);
  };

  const handleOpenPrep = (jobId) => {
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return;
    onOpenPrep(job);
  };

  const renderTaskList = (tasks, emptySuggested = false) => (
    tasks.length > 0 ? (
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMarkDone={handleMarkDone}
            onOpenJob={handleOpenJob}
            onOpenPrep={handleOpenPrep}
            onDelete={handleDeleteManual}
            onAddSuggestion={handleAddSuggestion}
          />
        ))}
      </div>
    ) : <EmptyState suggested={emptySuggested} />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end bg-black/70 backdrop-blur-sm">
          <motion.button
            type="button"
            aria-label={t('common.close')}
            className="absolute inset-0 cursor-default"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="smart-planner-title"
            initial={{ x: 36, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 36, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative flex h-full w-full max-w-[560px] flex-col border-l border-white/[0.08] bg-[#0b0b0f] shadow-2xl shadow-black/70"
          >
            <header className="border-b border-white/[0.08] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex h-9 items-center gap-2 rounded-2xl border border-[#635BFF]/25 bg-[#635BFF]/10 px-3 text-xs font-semibold text-violet-100">
                    <CalendarDays size={15} />
                    {t('planner.badge')}
                  </div>
                  <h2 id="smart-planner-title" className="text-xl font-bold tracking-tight text-zinc-100">
                    {t('planner.title')}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-zinc-500">{t('planner.subtitle')}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={t('common.close')} className="shrink-0">
                  <X size={20} />
                </Button>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'today') setSelectedPlannerDate(today);
                    }}
                    className={[
                      'h-9 shrink-0 rounded-xl border px-3 text-xs font-semibold transition-[background-color,border-color,color] duration-150',
                      activeTab === tab.id
                        ? 'border-[#635BFF]/35 bg-[#635BFF]/15 text-[var(--text)]'
                        : 'border-white/[0.08] bg-zinc-950/50 text-zinc-500 hover:border-[#8B5CF6]/25 hover:bg-[#8B5CF6]/[0.08] hover:text-zinc-200'
                    ].join(' ')}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>
            </header>

            <div className="modal-scrollbar flex-1 overflow-y-auto p-4 sm:p-5">
              {showCalendar && (
                <CalendarStrip
                  days={calendarDays}
                  selectedDate={selectedPlannerDate}
                  today={today}
                  taskCounts={taskCountsByDate}
                  onSelectDay={handleSelectDay}
                />
              )}

              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="rounded-full border border-white/[0.08] bg-zinc-950/50 px-2.5 py-1">
                    {t('planner.section.today')}: {todayOverviewCount}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-zinc-950/50 px-2.5 py-1">
                    {t('planner.tab.week')}: {weekTasks.length}
                  </span>
                </div>
                <Button type="button" variant="secondary" size="compact" onClick={handleToggleAdd}>
                  <Plus size={13} />
                  {t('planner.addTask')}
                </Button>
              </div>

              {isAdding && (
                <form onSubmit={handleSubmit} className="mb-5 rounded-3xl border border-white/[0.08] bg-zinc-950/45 p-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className={labelClass}>{t('planner.form.title')}</label>
                      <input
                        className={inputClass}
                        value={form.title}
                        onChange={(event) => setField('title', event.target.value)}
                      />
                      {errors.title && <p className="text-xs of-validation-error">{errors.title}</p>}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className={labelClass}>{t('planner.form.date')}</label>
                        <input
                          className={`${inputClass} color-scheme-dark`}
                          type="date"
                          value={form.date}
                          onChange={(event) => setField('date', event.target.value)}
                        />
                        {errors.date && <p className="text-xs of-validation-error">{errors.date}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>{t('planner.form.priority')}</label>
                        <CustomSelect
                          value={form.priority}
                          options={priorityOptions}
                          onChange={(value) => setField('priority', value)}
                          ariaLabel={t('planner.form.priority')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('planner.form.relatedJob')}</label>
                      <CustomSelect
                        value={form.relatedJobId}
                        options={jobOptions}
                        onChange={(value) => setField('relatedJobId', value)}
                        ariaLabel={t('planner.form.relatedJob')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('planner.form.notes')}</label>
                      <textarea
                        className={textareaClass}
                        value={form.notes}
                        onChange={(event) => setField('notes', event.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="secondary" onClick={() => { resetForm(); setIsAdding(false); }}>
                        {t('planner.cancel')}
                      </Button>
                      <Button type="submit" variant="primary">
                        {t('planner.createTask')}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'suggested' ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-100">{t('planner.section.suggested')}</h3>
                  {renderTaskList(derived.suggestions, true)}
                </section>
              ) : activeTab === 'done' ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-100">{t('planner.tab.done')}</h3>
                  {renderTaskList(doneTasks)}
                </section>
              ) : (
                <div className="space-y-5">
                  {selectedPlannerDate === today && overdueTasks.length > 0 && (
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold text-zinc-100">{t('planner.section.overdue')}</h3>
                      {renderTaskList(overdueTasks)}
                    </section>
                  )}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-zinc-100">{selectedDayLabel}</h3>
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)]">
                        {getTaskCountLabel(selectedDayTasks.length, t)}
                      </span>
                    </div>
                    {selectedDayTasks.length > 0 ? renderTaskList(selectedDayTasks) : (
                      <div className="rounded-3xl border border-dashed border-white/[0.10] bg-zinc-950/30 p-6 text-center">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-zinc-900/70 text-zinc-500">
                          <CalendarDays size={18} />
                        </div>
                        <p className="text-sm font-semibold text-zinc-200">{t('planner.calendar.emptyDay')}</p>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
