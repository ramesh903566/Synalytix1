import { useState } from 'react';
import { X, ArrowRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OpportunityAlert } from '../../types/recommendations';

interface OpportunityAlertsProps {
  alerts: OpportunityAlert[];
}

export default function OpportunityAlerts({ alerts }: OpportunityAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visible.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-800">{alert.title}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5 line-clamp-1">{alert.description}</p>
            </div>
            <button className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-widest whitespace-nowrap">
              Take action <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDismissed(prev => new Set(prev).add(alert.id))}
              className="w-5 h-5 rounded-full hover:bg-emerald-200/50 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3 text-emerald-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
