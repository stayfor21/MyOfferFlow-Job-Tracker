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
        <div key={i} className="rounded-2xl border border-white/[0.08] bg-[#111217]/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 text-zinc-100">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-zinc-600">{stat.helper}</p>
            </div>
            <div className={`rounded-2xl border border-white/[0.06] bg-zinc-900/70 p-3 ${stat.color}`}>
              <stat.icon size={22} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
