import { motion } from 'motion/react';
import { MonthlyWeek } from '../../types/recommendations';

interface MonthlyRoadmapPanelProps {
  roadmap: MonthlyWeek[];
}

export default function MonthlyRoadmapPanel({ roadmap }: MonthlyRoadmapPanelProps) {
  // Determine current week (1-4 based on day of month)
  const dayOfMonth = new Date().getDate();
  const currentWeek = Math.min(4, Math.ceil(dayOfMonth / 7));

  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-5">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-4">Monthly Roadmap</h3>
      <div className="space-y-3">
        {roadmap.map((week, i) => {
          const isCurrent = week.week === currentWeek;
          return (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-3.5 border transition-all ${
                isCurrent
                  ? 'border-brand-primary/30 bg-brand-primary/5 border-l-[3px] border-l-brand-primary'
                  : 'border-neutral-100 bg-neutral-50/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${
                  isCurrent ? 'text-brand-primary' : 'text-[#999]'
                }`}>
                  Week {week.week}
                  {isCurrent && ' · Current'}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[#1A1A1A] mb-1.5">{week.goal}</h4>
              <ul className="space-y-1">
                {week.milestones.map((milestone, j) => (
                  <li key={j} className="flex items-start gap-2 text-[10px] text-[#666]">
                    <span className="w-1 h-1 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                    {milestone}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
