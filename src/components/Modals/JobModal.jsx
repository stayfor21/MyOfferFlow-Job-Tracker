import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  ArchiveRestore,
  Bell,
  Building2,
  CheckCircle2,
  ExternalLink,
  Flag,
  History,
  Link as LinkIcon,
  ListChecks,
  Star,
  Trash2,
  X
} from 'lucide-react';
import Button from '../UI/Button';
import CustomSelect from '../UI/CustomSelect';
import { useTranslation } from '../../i18n.jsx';
import {
  NEXT_ACTION_PRESETS,
  PRIORITY_OPTIONS,
  STATUS_ACTION_SUGGESTIONS,
  STATUS_LABELS,
  addDaysString,
  ensureTimeline,
  getFollowUpStatusConfig,
  getNextActionDisplay,
  getPriority,
  isDreamJob,
  priorityStyles,
  todayString
} from '../../utils/jobMetadata';

const inputClass = 'block h-11 w-full min-w-0 max-w-full box-border rounded-2xl border border-white/[0.10] bg-zinc-950/60 px-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-zinc-600 focus:border-[#635BFF]/60 focus:ring-4 focus:ring-[#635BFF]/15';
const dateInputClass = `${inputClass} job-drawer-date-field color-scheme-dark`;
const textareaClass = 'block min-h-[76px] w-full min-w-0 max-w-full box-border rounded-2xl border border-white/[0.10] bg-zinc-950/60 px-3 py-3 text-sm leading-5 text-zinc-100 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-zinc-600 focus:border-[#635BFF]/60 focus:ring-4 focus:ring-[#635BFF]/15';
const labelClass = 'text-[11px] font-semibold leading-4 text-zinc-500';
const statusChipStyles = {
  applied: 'of-chip-status-applied',
  screening: 'of-chip-status-screening',
  interview: 'of-chip-status-interview',
  offer: 'of-chip-status-offer',
  rejected: 'of-chip-status-rejected'
};

function buildInitialForm(job) {
  const today = todayString();

  return {
    company: job?.company || '',
    position: job?.position || '',
    location: job?.location || '',
    link: job?.link || '',
    status: job?.status || 'applied',
    appliedDate: job?.appliedDate || today,
    notes: job?.notes || '',
    priority: job?.priority || 'medium',
    isDreamJob: Boolean(job?.isDreamJob),
    nextAction: job?.nextAction || '',
    nextActionDueDate: job?.nextActionDueDate || today,
    followUpDate: job?.followUpDate || today,
    followUpDone: Boolean(job?.followUpDone),
    followUpNote: job?.followUpNote || '',
    lastFollowUpAt: job?.lastFollowUpAt || '',
    archived: Boolean(job?.archived),
    archivedAt: job?.archivedAt || '',
    archivedReason: job?.archivedReason || '',
    timeline: Array.isArray(job?.timeline) ? job.timeline : [],
    createdAt: job?.createdAt || '',
    updatedAt: job?.updatedAt || ''
  };
}

function Field({ label, children }) {
  return (
    <div className="w-full min-w-0 max-w-full box-border space-y-2">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="w-full min-w-0 max-w-full box-border rounded-2xl border border-white/[0.08] bg-zinc-950/30 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={16} className="text-[#8B5CF6]" />
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/40 p-3">
      <p className="text-[11px] font-medium text-zinc-600">{label}</p>
      <p className="mt-1 truncate text-sm text-zinc-200">{value || t('common.notSet')}</p>
    </div>
  );
}

function DreamJobToggle({ checked, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <span className={labelClass}>{t('modal.preference')}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={t('card.dreamJob')}
        onClick={() => onChange(!checked)}
        className={[
          'flex h-11 w-full items-center justify-between gap-3 rounded-2xl border px-3 text-left transition-[background-color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#635BFF]/15',
          checked
            ? 'border-[var(--primary-border)] bg-[var(--primary-soft)] shadow-[0_0_18px_var(--primary-glow)]'
            : 'border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]'
        ].join(' ')}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <Star size={15} className={checked ? 'text-[var(--primary-hover)]' : 'text-[var(--text-muted)]'} />
          <span className={checked ? 'text-sm font-semibold text-[var(--text)]' : 'text-sm font-semibold text-[var(--text-soft)]'}>
            {t('card.dreamJob')}
          </span>
        </span>
        <span
          className={[
            'of-switch-track relative h-7 w-12 shrink-0 rounded-full border transition-[background-color,border-color,box-shadow] duration-200',
            checked ? 'of-switch-track-on' : ''
          ].join(' ')}
        >
          <span
            className={[
              'of-switch-thumb absolute left-[3px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-transform duration-200 ease-out',
              checked ? 'translate-x-[20px]' : 'translate-x-0'
            ].join(' ')}
          />
        </span>
      </button>
    </div>
  );
}

export default function JobModal({ job, onClose, onSave, onDelete, onArchive }) {
  const { t, formatDate } = useTranslation();
  const [formData, setFormData] = useState(() => buildInitialForm(job));
  const isEditing = Boolean(job);
  const title = formData.position || job?.title || t('job.untitledRole');
  const company = formData.company || t('job.unknownCompany');
  const roleDetail = job?.category || job?.type || '';
  const compensation = job?.salary || job?.compensation || '';
  const workMode = job?.workMode || '';
  const priority = getPriority(formData);
  const isArchived = Boolean(formData.archived);
  const timeline = useMemo(() => ensureTimeline({ ...job, ...formData }), [formData, job]);
  const actionSuggestions = STATUS_ACTION_SUGGESTIONS[formData.status] || NEXT_ACTION_PRESETS;
  const nextActionDisplayValue = getNextActionDisplay(formData.nextAction || '', t);
  const followUpConfig = getFollowUpStatusConfig(formData.status);
  const statusOptions = Object.keys(STATUS_LABELS).map((status) => ({ value: status, label: t(`status.${status}`) }));
  const priorityOptions = PRIORITY_OPTIONS.map((option) => ({ ...option, label: t(`priority.${option.value}`) }));
  const followUpTitle = t(`follow.title.${formData.status}`);
  const followUpHelper = t(`follow.helper.${formData.status}`);
  const quickActionLabel = (label) => ({
    Today: t('common.today'),
    Tomorrow: t('common.tomorrow'),
    'In 3 days': t('common.in3Days'),
    'In 7 days': t('common.in7Days'),
    'In 2 days': t('common.in2Days'),
    'Ask for feedback': t('action.askFeedback'),
    'No reminder': t('common.noReminder')
  }[label] || label);
  const followUpSummaryLabel = useMemo(() => {
    if (!formData.followUpDate) return '';

    const date = formatDate(formData.followUpDate);
    const isDue = !formData.followUpDone && formData.followUpDate <= todayString();
    const prefix = followUpConfig.futurePrefixKey ? t(followUpConfig.futurePrefixKey) : followUpConfig.futurePrefix || followUpConfig.title;
    const label = isDue && followUpConfig.dueLabel
      ? (followUpConfig.dueLabelKey ? t(followUpConfig.dueLabelKey) : followUpConfig.dueLabel)
      : `${prefix} \u00b7 ${date}`.trim();

    return formData.followUpDone ? `${label} (${t('modal.done').toLowerCase()})` : label;
  }, [formData.followUpDate, formData.followUpDone, followUpConfig, formatDate, t]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const setField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleFollowUpDate = (value) => {
    setFormData((current) => ({
      ...current,
      followUpDate: value,
      followUpDone: false
    }));
  };

  const markFollowUpDone = () => {
    setFormData((current) => ({
      ...current,
      followUpDone: true,
      lastFollowUpAt: new Date().toISOString()
    }));
  };

  const clearFollowUp = () => {
    setFormData((current) => ({
      ...current,
      followUpDate: '',
      followUpDone: false,
      followUpNote: '',
      lastFollowUpAt: ''
    }));
  };

  const handleFollowUpQuickAction = (action) => {
    if (action.clearReminder) {
      clearFollowUp();
      return;
    }

    if (action.nextAction) {
      setField('nextAction', action.nextAction);
      return;
    }

    if (typeof action.days === 'number') {
      handleFollowUpDate(addDaysString(action.days));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...formData,
      followUpDone: formData.followUpDate ? formData.followUpDone : false
    });
  };

  const getTimelineLabel = (event) => {
    if (event.type === 'created') return t('timeline.applicationAdded');
    if (event.type === 'status_changed' && event.metadata?.to) return t('timeline.currentStatus', { status: t(`status.${event.metadata.to}`) });
    if (event.type === 'priority_changed') return t('modal.priority');
    if (event.type === 'dream_job_updated') return t('card.dreamJob');
    if (event.type === 'next_action_updated') return t('modal.nextAction');
    if (event.type === 'follow_up_scheduled') return t(`follow.title.${formData.status}`);
    if (event.type === 'follow_up_completed') return t('modal.markDone');
    if (event.type === 'application_archived') return t('archive.archived');
    if (event.type === 'application_restored') return t('archive.restored');
    return event.label;
  };

  const getTimelineDescription = (event) => {
    if (event.type === 'status_changed' && event.metadata?.from && event.metadata?.to) {
      return `${t(`status.${event.metadata.from}`)} -> ${t(`status.${event.metadata.to}`)}`;
    }
    return event.description;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close application details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="job-drawer-panel relative flex h-full w-full max-w-full flex-col border-l border-white/[0.08] bg-[#0b0b0f] shadow-2xl shadow-black/70 md:w-[min(680px,100%)] lg:w-[min(720px,72vw)] xl:w-[640px] 2xl:w-[680px]"
      >
        <header className="border-b border-white/[0.08] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`of-chip rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusChipStyles[formData.status] || statusChipStyles.applied}`}>
                  {t(`status.${formData.status}`)}
                </span>
                {isDreamJob(formData) && (
                  <span className="of-chip of-chip-dream rounded-full px-2.5 py-1 text-[11px] font-semibold">
                    <Star size={11} />
                    {t('card.dreamJob')}
                  </span>
                )}
                <span className={`of-chip rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[priority] || priorityStyles.medium}`}>
                  <Flag size={11} />
                  {t(`priority.${priority}`)}
                </span>
                {isArchived && (
                  <span className="of-chip of-chip-archived rounded-full px-2.5 py-1 text-[11px] font-semibold">
                    <Archive size={11} />
                    {t('archive.archived')}
                  </span>
                )}
              </div>
              <h2 className="truncate text-xl font-bold text-zinc-100">
                {isEditing ? title : t('modal.add')}
              </h2>
              <p className="mt-1 truncate text-sm text-zinc-500">{company}</p>
            </div>
            <Button
              type="button"
              onClick={onClose}
              aria-label={t('modal.closeDetails')}
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <X size={20} />
            </Button>
          </div>
        </header>

        <div className="modal-scrollbar w-full min-w-0 max-w-full flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {isArchived && (
            <div className="rounded-2xl border p-4 text-sm of-chip-archived">
              {t('archive.notice')}
            </div>
          )}

          <Section title={t('modal.overview')} icon={Building2}>
            <div className="grid min-w-0 grid-cols-1 gap-3">
              <Field label={t('modal.company')}>
                <input
                  className={inputClass}
                  required
                  value={formData.company}
                  onChange={(e) => setField('company', e.target.value)}
                />
              </Field>
              <Field label={t('modal.role')}>
                <input
                  className={inputClass}
                  required
                  value={formData.position}
                  onChange={(e) => setField('position', e.target.value)}
                />
              </Field>
              <Field label={t('modal.location')}>
                <input
                  className={inputClass}
                  placeholder={t('placeholder.location')}
                  value={formData.location}
                  onChange={(e) => setField('location', e.target.value)}
                />
              </Field>
              <Field label={t('modal.dateApplied')}>
                <input
                  className={dateInputClass}
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) => setField('appliedDate', e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label className={labelClass}>{t('modal.jobLink')}</label>
                {formData.link && (
                  <a href={formData.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200">
                    <ExternalLink size={11} />
                    {t('modal.openLink')}
                  </a>
                )}
              </div>
              <input
                type="url"
                className={inputClass}
                placeholder="https://linkedin.com/jobs/..."
                value={formData.link}
                onChange={(e) => setField('link', e.target.value)}
              />
            </div>

            <div className="mt-3 grid min-w-0 grid-cols-1 gap-3">
              <InfoRow label={t('modal.status')} value={t(`status.${formData.status}`)} />
              <InfoRow label={t('modal.source')} value={formData.link ? t('modal.jobLinkSaved') : t('common.notSet')} />
              {roleDetail && <InfoRow label={t('modal.roleDetail')} value={roleDetail} />}
              {workMode && <InfoRow label={t('modal.workMode')} value={workMode} />}
              {compensation && <InfoRow label={t('modal.compensation')} value={compensation} />}
            </div>
          </Section>

          <Section title={t('modal.priority')} icon={Flag}>
            <div className="grid min-w-0 grid-cols-1 gap-4">
              <Field label={t('modal.priority')}>
                <CustomSelect
                  value={formData.priority || 'medium'}
                  options={priorityOptions}
                  onChange={(nextPriority) => setField('priority', nextPriority)}
                  ariaLabel="Priority"
                />
              </Field>

              <DreamJobToggle
                checked={Boolean(formData.isDreamJob)}
                onChange={(value) => setField('isDreamJob', value)}
              />
            </div>
          </Section>

          <Section title={t('modal.actions')} icon={ListChecks}>
            <div className="space-y-3">
              <Field label={t('modal.nextAction')}>
                <input
                  className={inputClass}
                  placeholder={t('placeholder.nextAction')}
                  value={nextActionDisplayValue}
                  onChange={(e) => setField('nextAction', e.target.value)}
                />
              </Field>
              <Field label={t('modal.dueDate')}>
                <input
                  className={dateInputClass}
                  type="date"
                  value={formData.nextActionDueDate || ''}
                  onChange={(e) => setField('nextActionDueDate', e.target.value)}
                />
              </Field>
              <div className="flex min-w-0 flex-wrap gap-2">
                {actionSuggestions.map((action) => (
                  <Button
                    key={action}
                    type="button"
                    variant="secondary"
                    size="compact"
                    onClick={() => setField('nextAction', action)}
                    className="min-w-0 max-w-full rounded-full whitespace-normal text-left leading-tight"
                  >
                    {getNextActionDisplay(action, t)}
                  </Button>
                ))}
              </div>
            </div>
          </Section>

          <Section title={followUpTitle || followUpConfig.title} icon={Bell}>
            <div className="space-y-3">
              <p className="text-xs leading-5 text-zinc-500">{followUpHelper || followUpConfig.helper}</p>

              {followUpSummaryLabel && (
                <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/40 p-3">
                  <p className="text-[11px] font-medium text-zinc-600">
                    {formData.status === 'rejected' ? t('modal.historicalReminder') : t('modal.reminder')}
                  </p>
                  <p className="mt-1 truncate text-sm text-zinc-200">{followUpSummaryLabel}</p>
                </div>
              )}

              <div className="space-y-3">
                <Field label={t('modal.followUpDate')}>
                  <input
                    className={dateInputClass}
                    type="date"
                    value={formData.followUpDate || ''}
                    onChange={(e) => handleFollowUpDate(e.target.value)}
                  />
                </Field>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {followUpConfig.quickActions.map((action) => (
                    <Button
                      key={action.label}
                      type="button"
                      variant="secondary"
                      size="compact"
                      onClick={() => handleFollowUpQuickAction(action)}
                      className="min-w-0 max-w-full whitespace-normal px-2.5 leading-tight"
                    >
                      {quickActionLabel(action.label)}
                    </Button>
                  ))}
                </div>
              </div>

              <Field label={t('modal.followUpNote')}>
                <textarea
                  rows={3}
                  className={`${textareaClass} resize-none`}
                  placeholder={t('placeholder.followUpNote')}
                  value={formData.followUpNote || ''}
                  onChange={(e) => setField('followUpNote', e.target.value)}
                />
              </Field>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="compact"
                  onClick={markFollowUpDone}
                  disabled={!formData.followUpDate}
                  className="of-chip-success hover:border-emerald-400/30 hover:bg-emerald-500/15"
                >
                  <CheckCircle2 size={14} />
                  {t('modal.markDone')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="compact"
                  onClick={clearFollowUp}
                >
                  {t('modal.clearReminder')}
                </Button>
                {formData.followUpDone && (
                  <span className="inline-flex items-center rounded-xl border border-white/[0.08] px-3 py-2 text-xs text-zinc-500">
                    {t('modal.done')} {formatDate(todayString())}
                  </span>
                )}
              </div>
            </div>
          </Section>

          <Section title={t('modal.notes')} icon={LinkIcon}>
            <textarea
              rows={4}
              placeholder={t('placeholder.notes')}
              className={`${textareaClass} resize-none`}
              value={formData.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </Section>

          <Section title={t('modal.timeline')} icon={History}>
            <div className="relative space-y-4">
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/[0.08]" />
              {timeline.map((event) => (
                <div key={event.id} className="relative flex gap-3">
                  <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border border-[#635BFF]/35 bg-[#635BFF]/25 shadow-[0_0_12px_rgba(99,91,255,0.18)]" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-200">{getTimelineLabel(event)}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      {formatDate(event.createdAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {getTimelineDescription(event) && (
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{getTimelineDescription(event)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <footer className="w-full max-w-full shrink-0 overflow-x-clip border-t border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-5">
          <div className="flex w-full max-w-full flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('modal.delete')}
                  onClick={() => onDelete(job.id)}
                  className="shrink-0 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                >
                  <Trash2 size={18} />
                </Button>
              )}
              {isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onArchive(job.id, !isArchived)}
                  className={`max-w-full shrink-0 ${isArchived ? 'of-chip-success hover:border-emerald-400/30 hover:bg-emerald-500/15' : ''}`}
                >
                  {isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                  {isArchived ? t('archive.unarchiveShort') : t('archive.archiveShort')}
                </Button>
              )}
            </div>
            <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.close')}</Button>
              <Button
                type="submit"
                variant="primary"
                className="shrink-0"
              >
                {isEditing ? t('modal.saveChangesShort') : t('modal.saveApplicationShort')}
              </Button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  );
}
