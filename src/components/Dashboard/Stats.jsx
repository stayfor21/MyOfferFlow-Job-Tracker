import React from 'react';
import { TrendingUp, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

export default function Stats({ jobs }) {
  const { t } = useTranslation();
  const stats = [
    { 
      label: t('stats.total'),
      value: jobs.length, 
      helper: jobs.length > 0 ? t('stats.tracked') : t('stats.start'),
      icon: TrendingUp, 
      color: 'text-[#635BFF]'
    },
    { 
      label: t('stats.interviews'),
      value: jobs.filter(j => j.status === 'interview').length, 
      helper: jobs.some(j => j.status === 'interview') ? t('stats.activeStage') : t('stats.prepReady'),
      icon: MessageSquare, 
      color: 'text-amber-500' 
    },
    { 
      label: t('stats.offers'),
      value: jobs.filter(j => j.status === 'offer').length, 
      helper: jobs.some(j => j.status === 'offer') ? t('stats.offerMomentum') : t('stats.keepPushing'),
      icon: CheckCircle2, 
      color: 'text-emerald-500' 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-sm shadow-black/5 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:shadow-[0_16px_36px_var(--shadow-color)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-muted)]">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--text)]">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-[var(--text-faint)]">{stat.helper}</p>
            </div>
            <div className={`rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 ${stat.color}`}>
              <stat.icon size={22} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
