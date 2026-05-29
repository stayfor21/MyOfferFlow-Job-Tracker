import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarCheck, Info, Lightbulb, Sparkles, Zap } from 'lucide-react';
import Button from '../UI/Button';
import { todayString } from '../../utils/jobMetadata';
import { useTranslation } from '../../i18n.jsx';

function MetricCard({ label, value, helper, color }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/45 p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      {helper && <p className="mt-1 text-[11px] font-medium text-zinc-600">{helper}</p>}
    </div>
  );
}

export default function InsightDashboard({ jobs, columns }) {
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
        body: `${activeInterview.position || activeInterview.title || 'Interview'}${activeInterview.company ? ` at ${activeInterview.company}` : ''}`,
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mt-16 mb-20 border-t border-zinc-800/80 pt-12"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-2.5 text-indigo-300">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('dashboard.title')}</h2>
            <p className="mt-1 text-sm text-zinc-500">{t('dashboard.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.07] p-4 text-left md:max-w-xl">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-300">
            <Lightbulb size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase text-zinc-500">{t('dashboard.todayFocus')}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{todayFocus.title}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">{todayFocus.body}</p>
            <p className="mt-2 text-xs text-zinc-600">{focusMeta}</p>
          </div>
          {todayFocus.action && (
            <Button type="button" size="compact" variant="primary" onClick={todayFocus.onAction} className="mt-0.5 shrink-0">
              <Sparkles size={12} />
              {todayFocus.action}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/[0.08] bg-zinc-900/45 p-5 shadow-2xl shadow-black/15 sm:p-6">
          <div className="mb-6 text-center">
            <h3 className="text-base font-semibold text-zinc-100">{t('dashboard.efficiency')}</h3>
            <p className="mt-1 text-sm text-zinc-500">{t('dashboard.efficiencyHelp')}</p>
          </div>

          <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 176 176" className="h-full w-full -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-zinc-800"
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
              <span className="text-4xl font-bold text-zinc-100">{efficiency}%</span>
              <span className="mt-1 text-xs font-medium text-zinc-500">{t('dashboard.efficiencyRate')}</span>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-4 text-left">
            <Info size={16} className="mt-0.5 shrink-0 text-indigo-300" />
            <p className="text-sm leading-6 text-zinc-400">{getFeedback(efficiency)}</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/[0.08] bg-zinc-900/45 p-5 shadow-2xl shadow-black/15 sm:p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">{t('dashboard.pipeline')}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t('dashboard.pipelineHelp')}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-2.5 text-zinc-500">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {chartData.map((item, idx) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-zinc-300">{item.label}</span>
                  <span className="text-zinc-500">{item.count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800/60">
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

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
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
    </motion.section>
  );
}
