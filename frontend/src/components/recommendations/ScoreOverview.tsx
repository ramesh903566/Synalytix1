import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CareerScore } from '../../types/recommendations';

interface ScoreOverviewProps {
  scores: CareerScore;
  previousScores?: CareerScore | null;
}

const SCORE_CARDS = [
  { key: 'career' as const, label: 'Career Score', icon: '🎯' },
  { key: 'employability' as const, label: 'Employability', icon: '💼' },
  { key: 'branding' as const, label: 'Personal Brand', icon: '📢' },
  { key: 'technical' as const, label: 'Technical', icon: '⚡' },
];

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald-500
  if (score >= 50) return '#f59e0b'; // amber-500
  return '#f43f5e'; // rose-500
}

function CircularProgress({ value, size = 64, strokeWidth = 5 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getScoreColor(value);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function ScoreOverview({ scores, previousScores }: ScoreOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {SCORE_CARDS.map((card, i) => {
        const value = scores[card.key];
        const prevValue = previousScores?.[card.key];
        const delta = prevValue != null ? value - prevValue : null;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-white border border-[#EFEFEF] rounded-2xl p-5 hover:border-neutral-300 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-lg">{card.icon}</span>
              {delta !== null && (
                <span
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    delta >= 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {delta >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {delta >= 0 ? '+' : ''}{delta}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <CircularProgress value={value} />
                <span
                  className="absolute text-lg font-bold"
                  style={{ color: getScoreColor(value) }}
                >
                  {value}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-[#999] font-bold uppercase tracking-widest">
                  {card.label}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
