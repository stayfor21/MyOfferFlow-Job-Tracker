import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import Button from './src/components/UI/Button';
import { useTranslation } from './src/i18n.jsx';

export default function PrepBanner({ show, onPrepare, onLater }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-[200] w-full max-w-[340px]"
        >
          <div className="bg-[#111217] border border-white/[0.08] p-5 shadow-2xl rounded-2xl relative overflow-hidden">
            <div className="flex gap-4 items-start relative z-10">
              <BrainCircuit size={18} className="text-[#635BFF] shrink-0 mt-0.5" />
              <div className="space-y-1 pr-2">
                <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-tight">{t('prep.bannerTitle')}</h4>
                <p className="text-[11px] text-[#8B8FA3] leading-normal">
                  {t('prep.bannerBody')}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 relative z-10">
              <Button type="button" variant="ghost" size="compact" onClick={onLater}>{t('prep.ignore')}</Button>
              <Button type="button" variant="primary" size="compact" onClick={onPrepare}>{t('prep.openTool')}</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
