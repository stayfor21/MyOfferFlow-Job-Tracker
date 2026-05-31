import React, { useMemo, useState } from 'react';
import { Archive, Plus, Target, TrendingUp } from 'lucide-react';
import Button from '../UI/Button';
import CustomSelect from '../UI/CustomSelect';
import { useTranslation } from '../../i18n.jsx';
import {
  GOAL_PERIODS,
  GOAL_TYPES,
  buildGoalTitle,
  calculateGoalProgress,
  createPlannerRemindersForGoal,
  getGoalDateRange
} from '../../utils/goals';

const inputClass = 'h-11 w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--input-placeholder)] focus:border-[#635BFF]/60 focus:ring-4 focus:ring-[#635BFF]/15';
const labelClass = 'text-[11px] font-semibold leading-4 text-[var(--text-muted)]';

const statusChipClass = {
  completed: 'of-chip-success',
  onTrack: 'of-chip-violet',
  behind: 'of-chip-warning',
  upcoming: 'of-chip-slate',
  missed: 'of-chip-danger'
};

function GoalCard({ goal, progress, onArchive, onManualProgress }) {
  const { t, formatDate } = useTranslation();
  const title = buildGoalTitle(goal, t);
  const statusClass = statusChipClass[progress.status] || statusChipClass.onTrack;

  return (
    <article className="flex min-h-[176px] flex-col rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {t(`goals.period.${goal.period}`)}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[var(--text)]">{title}</h3>
          {goal.type === 'interviews' && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
              {t('goals.helper.interviews')}
            </p>
          )}
        </div>
        <span className={`of-chip ${statusClass} h-5 shrink-0 rounded-full px-2 text-[10px] font-semibold leading-none`}>
          {t(`goals.status.${progress.status}`)}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-end justify-between gap-3">
          <p className="text-xl font-bold leading-none text-[var(--text)]">
            {progress.progress}<span className="text-sm font-semibold text-[var(--text-muted)]"> / {progress.target}</span>
          </p>
          <p className="text-sm font-semibold text-[var(--primary)]">{progress.percentage}%</p>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"
          role="progressbar"
          aria-label={t('goals.progressAria', { progress: progress.progress, target: progress.target })}
          aria-valuemin={0}
          aria-valuemax={progress.target}
          aria-valuenow={Math.min(progress.progress, progress.target)}
        >
          <div
            className={`h-full rounded-full ${progress.status === 'completed' ? 'bg-emerald-500' : 'bg-[#635BFF]'}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[var(--text-muted)]">
        <span className="inline-flex min-w-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1">
          <span>{t('goals.remaining')}:</span>
          <span className="font-semibold text-[var(--text)]">{progress.remaining}</span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1">
          <span>{t('goals.deadline')}:</span>
          <span className="truncate font-semibold text-[var(--text)]">{progress.daysLeft} {t('goals.daysLeft')}</span>
        </span>
      </div>

      <p className="mt-2 text-[11px] font-medium text-[var(--text-faint)]">
        {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
        {goal.type === 'custom' ? (
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="compact" onClick={() => onManualProgress(goal.id, -1)}>-1</Button>
            <Button type="button" variant="secondary" size="compact" onClick={() => onManualProgress(goal.id, 1)}>+1</Button>
          </div>
        ) : <span />}
        <Button type="button" variant="ghost" size="compact" onClick={() => onArchive(goal.id)}>
          <Archive size={13} />
          {t('goals.archive')}
        </Button>
      </div>
    </article>
  );
}

function GoalForm({ onCancel, onCreate }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    type: 'applications',
    target: '10',
    period: 'week',
    startDate: '',
    endDate: '',
    titleOverride: '',
    addPlannerReminders: false
  });
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const typeOptions = GOAL_TYPES.map((type) => ({ value: type, label: t(`goals.type.${type}`) }));
  const periodOptions = GOAL_PERIODS.map((period) => ({ value: period, label: t(`goals.period.${period}`) }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const target = Number(form.target);
    const range = getGoalDateRange(form.period, form.startDate, form.endDate);

    if (!Number.isInteger(target) || target <= 0) nextErrors.target = t('goals.validation.target');
    if (!range.startDate || !range.endDate || range.endDate < range.startDate) nextErrors.date = t('goals.validation.date');

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onCreate({
      type: form.type,
      target,
      period: form.period,
      startDate: range.startDate,
      endDate: range.endDate,
      titleOverride: form.titleOverride.trim(),
      addPlannerReminders: Boolean(form.addPlannerReminders)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>{t('goals.form.type')}</label>
          <CustomSelect value={form.type} options={typeOptions} onChange={(value) => setField('type', value)} ariaLabel={t('goals.form.type')} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>{t('goals.form.period')}</label>
          <CustomSelect value={form.period} options={periodOptions} onChange={(value) => setField('period', value)} ariaLabel={t('goals.form.period')} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>{t('goals.form.target')}</label>
          <input className={inputClass} type="number" min="1" value={form.target} onChange={(event) => setField('target', event.target.value)} />
          {errors.target && <p className="text-xs of-validation-error">{errors.target}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelClass}>{t('goals.form.title')}</label>
          <input className={inputClass} value={form.titleOverride} onChange={(event) => setField('titleOverride', event.target.value)} />
        </div>
        {form.period === 'custom' && (
          <>
            <div className="space-y-2">
              <label className={labelClass}>{t('goals.form.startDate')}</label>
              <input className={`${inputClass} color-scheme-dark`} type="date" value={form.startDate} onChange={(event) => setField('startDate', event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>{t('goals.form.endDate')}</label>
              <input className={`${inputClass} color-scheme-dark`} type="date" value={form.endDate} onChange={(event) => setField('endDate', event.target.value)} />
            </div>
          </>
        )}
      </div>
      {errors.date && <p className="mt-2 text-xs of-validation-error">{errors.date}</p>}
      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 text-sm text-[var(--text-soft)]">
        <input
          type="checkbox"
          checked={form.addPlannerReminders}
          onChange={(event) => setField('addPlannerReminders', event.target.checked)}
          className="h-4 w-4 accent-[#635BFF]"
        />
        {t('goals.form.addPlannerReminders')}
      </label>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('planner.cancel')}</Button>
        <Button type="submit" variant="primary">{t('goals.create')}</Button>
      </div>
    </form>
  );
}

export default function CareerGoals({
  jobs,
  goals,
  setGoals,
  manualTasks,
  setManualTasks,
  completedTaskIds
}) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const activeGoals = useMemo(() => (Array.isArray(goals) ? goals : []).filter((goal) => !goal.isArchived), [goals]);
  const goalProgress = useMemo(() => (
    activeGoals.map((goal) => ({
      goal,
      progress: calculateGoalProgress(goal, jobs, manualTasks, completedTaskIds)
    }))
  ), [activeGoals, completedTaskIds, jobs, manualTasks]);
  const completedCount = goalProgress.filter(({ progress }) => progress.status === 'completed').length;
  const behindCount = goalProgress.filter(({ progress }) => progress.status === 'behind' || progress.status === 'missed').length;

  const handleCreate = (data) => {
    const now = new Date().toISOString();
    const goal = {
      id: crypto.randomUUID(),
      type: data.type,
      target: data.target,
      period: data.period,
      startDate: data.startDate,
      endDate: data.endDate,
      titleOverride: data.titleOverride,
      completedManualCount: 0,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    };

    const reminders = data.addPlannerReminders ? createPlannerRemindersForGoal(goal, t) : [];
    setGoals([...(Array.isArray(goals) ? goals : []), { ...goal, plannerReminderIds: reminders.map((task) => task.id) }]);
    if (reminders.length > 0) {
      setManualTasks([...(Array.isArray(manualTasks) ? manualTasks : []), ...reminders]);
    }
    setIsAdding(false);
  };

  const handleArchive = (goalId) => {
    setGoals((Array.isArray(goals) ? goals : []).map((goal) => (
      goal.id === goalId ? { ...goal, isArchived: true, updatedAt: new Date().toISOString() } : goal
    )));
  };

  const handleManualProgress = (goalId, delta) => {
    setGoals((Array.isArray(goals) ? goals : []).map((goal) => (
      goal.id === goalId
        ? {
          ...goal,
          completedManualCount: Math.min(
            Math.max(1, Number(goal.target || 1)),
            Math.max(0, Number(goal.completedManualCount || 0) + delta)
          ),
          updatedAt: new Date().toISOString()
        }
        : goal
    )));
  };

  return (
    <section id="goals" className="mt-6 scroll-mt-24 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="of-chip of-chip-violet flex h-9 w-9 shrink-0 justify-center rounded-2xl p-0">
            <Target size={17} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-[var(--text)]">{t('goals.title')}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{t('goals.subtitle')}</p>
            {activeGoals.length > 0 && (
              <p className="mt-2 text-xs font-medium text-[var(--text-faint)]">
                {t('goals.summary', { active: activeGoals.length, completed: completedCount, behind: behindCount })}
              </p>
            )}
          </div>
        </div>
        <Button type="button" variant="secondary" size="compact" onClick={() => setIsAdding((current) => !current)} className="shrink-0">
          <Plus size={15} />
          {t('goals.add')}
        </Button>
      </div>

      {isAdding && (
        <div className="mt-5">
          <GoalForm onCancel={() => setIsAdding(false)} onCreate={handleCreate} />
        </div>
      )}

      {activeGoals.length === 0 && !isAdding ? (
        <div className="mt-5 rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-elevated)] p-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]">
            <TrendingUp size={18} />
          </div>
          <p className="text-sm font-semibold text-[var(--text)]">{t('goals.emptyTitle')}</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--text-muted)]">{t('goals.emptyBody')}</p>
          <Button type="button" variant="primary" className="mt-4" onClick={() => setIsAdding(true)}>
            <Plus size={15} />
            {t('goals.add')}
          </Button>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {goalProgress.map(({ goal, progress }) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              progress={progress}
              onArchive={handleArchive}
              onManualProgress={handleManualProgress}
            />
          ))}
        </div>
      )}
    </section>
  );
}
