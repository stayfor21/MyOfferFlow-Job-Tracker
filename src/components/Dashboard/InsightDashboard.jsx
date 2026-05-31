import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Info, Lightbulb, Sparkles, Zap } from 'lucide-react';
import Button from '../UI/Button';
import CareerGoals from './CareerGoals';
import { todayString } from '../../utils/jobMetadata';
import { useTranslation } from '../../i18n.jsx';

function MetricCard({ label, value, helper, color }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4">
      <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      {helper && <p className="mt-1 text-[11px] font-medium text-[var(--text-faint)]">{helper}</p>}
    </div>
  );
}

export default function InsightDashboard({
  jobs,
  columns,
  careerGoals,
  setCareerGoals,
  manualPlannerTasks,
  setManualPlannerTasks,
  completedPlannerTaskIds
}) {
  const { t } = useTranslation();
  const totalApps = jobs.length;
  const interviews = jobs.filter((j) => j.status === 'interview' || j.status === 'offer').length;
  const offers = jobs.filter((j) => j.status === 'offer').length;
  const rejected = jobs.filter((j) => j.status === 'rejected').length;
  const activeTrials = jobs.filter((j) => j.status === 'screening' || j.status === 'interview').length;
  const activeInterview = jobs.find((j) => j.status === 'interview');
  const overdueFollowUps = jobs.filter((job) => (
    job.followUpDate
    && !job.followUpDone
    && job.status !== 'rejected'
    && job.followUpDate <= todayString()
  )).length;

  const efficiency = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;

  const getFeedback = (pct) => {
    if (totalApps === 0) return t('dashboard.noJobsFeedback');
    if (pct <= 20) return t('dashboard.lowFeedback');
    if (pct <= 50) return t('dashboard.midFeedback');
    return t('dashboard.goodFeedback');
  };

  const getTodayFocus = () => {
    if (activeInterview) {
      return {
        title: t('dashboard.prepareInterview'),
        body: [activeInterview.position || activeInterview.title || 'Interview', activeInterview.company].filter(Boolean).join(' · '),
        action: t('dashboard.openPrep'),
        onAction: () => window.dispatchEvent(new CustomEvent('open-prep-tool', { detail: activeInterview }))
      };
    }

    if (overdueFollowUps > 0) {
      return {
        title: t('dashboard.followUpRecruiter'),
        body: t('dashboard.overdueFollowups', { count: overdueFollowUps, plural: overdueFollowUps === 1 ? '' : 's' })
      };
    }

    if (offers > 0) {
      return {
        title: t('dashboard.reviewOffer'),
        body: t('dashboard.offersMeta', { count: offers, plural: offers === 1 ? '' : 's' })
      };
    }

    if (totalApps === 0) {
      return {
        title: t('dashboard.addFirst'),
        body: t('dashboard.startInsights')
      };
    }

    return {
      title: rejected >= Math.max(3, totalApps / 2) ? t('dashboard.reviewStrategy') : t('dashboard.subtitle'),
      body: t('dashboard.keepCurrent')
    };
  };

  const todayFocus = getTodayFocus();
  const interviewCount = jobs.filter((job) => job.status === 'interview').length;
  const focusMeta = [
    t('dashboard.activeInterviews', { count: interviewCount, plural: interviewCount === 1 ? '' : 's' }),
    t('dashboard.overdueFollowups', { count: overdueFollowUps, plural: overdueFollowUps === 1 ? '' : 's' }),
    t('dashboard.offersMeta', { count: offers, plural: offers === 1 ? '' : 's' })
  ].join(' · ');

  const chartData = columns.map((col) => ({
    label: t(col.titleKey),
    count: jobs.filter((j) => j.status === col.id).length,
    color: col.id === 'applied' ? '#3b82f6'
      : col.id === 'screening' ? '#a855f7'
      : col.id === 'interview' ? '#f59e0b'
      : col.id === 'offer' ? '#10b981'
      : '#f43f5e'
  }));

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <motion.section
      id="insights"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-20 mt-16 scroll-mt-24 border-t border-[var(--border)] pt-10 sm:pt-12"
    >
      <div className="mb-6 flex min-w-0 items-center gap-3">
        <div className="of-chip of-chip-violet flex h-11 w-11 shrink-0 justify-center rounded-2xl p-0">
          <Zap size={19} />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">{t('dashboard.title')}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(320px,0.72fr)_minmax(560px,1.28fr)]">
        <div className="grid min-w-0 gap-5 xl:grid-rows-[auto_minmax(0,1fr)]">
          <div className="min-w-0 rounded-3xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-4 text-left shadow-sm shadow-black/5 sm:p-[18px]">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
              <div className="of-chip of-chip-violet flex h-9 w-9 shrink-0 justify-center rounded-xl p-0">
                <Lightbulb size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase leading-4 tracking-wide text-[var(--text-muted)]">{t('dashboard.todayFocus')}</p>
                <p title={todayFocus.title} className="mt-0.5 line-clamp-2 text-sm font-semibold leading-5 text-[var(--text)]">{todayFocus.title}</p>
                <p title={todayFocus.body} className="mt-0.5 line-clamp-1 text-[13px] leading-5 text-[var(--text-soft)]">{todayFocus.body}</p>
              </div>
              {todayFocus.action && (
                <Button type="button" size="compact" variant="primary" onClick={todayFocus.onAction} className="col-start-2 w-fit shrink-0 sm:col-start-3 sm:row-start-1">
                  <Sparkles size={12} />
                  {todayFocus.action}
                </Button>
              )}
              <p title={focusMeta} className="col-span-2 line-clamp-1 text-[11px] font-medium leading-4 text-[var(--text-muted)] sm:col-span-2 sm:col-start-2">
                {focusMeta}
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-col rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-2xl shadow-black/15 sm:p-6">
            <div className="mb-5 text-center">
              <h3 className="text-base font-semibold text-[var(--text)]">{t('dashboard.efficiency')}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{t('dashboard.efficiencyHelp')}</p>
            </div>

            <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
              <svg viewBox="0 0 176 176" className="h-full w-full -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-[var(--border-strong)]"
                />
                <motion.circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="503"
                  initial={{ strokeDashoffset: 503 }}
                  whileInView={{ strokeDashoffset: 503 - (503 * efficiency) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                  strokeLinecap="round"
                  className="text-[#635BFF] drop-shadow-[0_0_16px_rgba(99,91,255,0.25)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[var(--text)]">{efficiency}%</span>
                <span className="mt-1 text-xs font-medium text-[var(--text-muted)]">{t('dashboard.efficiencyRate')}</span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-4 text-left">
              <Info size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
              <p className="text-sm leading-6 text-[var(--text-soft)]">{getFeedback(efficiency)}</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-2xl shadow-black/15 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[var(--text)]">{t('dashboard.pipeline')}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{t('dashboard.pipelineHelp')}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-2.5 text-[var(--text-muted)]">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {chartData.map((item, idx) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-[var(--text-soft)]">{item.label}</span>
                  <span className="text-[var(--text-muted)]">{item.count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(item.count / maxCount) * 100}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    style={{ backgroundColor: item.color }}
                    className="h-full rounded-full shadow-[0_0_18px_rgba(255,255,255,0.08)]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3 pt-8 lg:grid-cols-4">
            <MetricCard
              label={t('dashboard.successRatio')}
              value={`${totalApps > 0 ? ((offers / totalApps) * 100).toFixed(1) : 0}%`}
              helper={t('dashboard.offersTotal')}
              color="text-emerald-400"
            />
            <MetricCard
              label={t('dashboard.activeTrials')}
              value={activeTrials}
              helper={t('dashboard.screeningInterview')}
              color="text-amber-400"
            />
            <MetricCard
              label={t('dashboard.rejectionRate')}
              value={`${totalApps > 0 ? ((rejected / totalApps) * 100).toFixed(1) : 0}%`}
              helper={t('dashboard.learnAdjust')}
              color="text-rose-400"
            />
            <MetricCard
              label={t('dashboard.totalReach')}
              value={totalApps}
              helper={t('dashboard.trackedJobs')}
              color="text-blue-400"
            />
          </div>
        </div>
      </div>

      <CareerGoals
        jobs={jobs}
        goals={careerGoals}
        setGoals={setCareerGoals}
        manualTasks={manualPlannerTasks}
        setManualTasks={setManualPlannerTasks}
        completedTaskIds={completedPlannerTaskIds}
      />
    </motion.section>
  );
}
