import { AnimatePresence } from 'motion/react';
import RecommendationCard from './RecommendationCard';
import { Recommendation, RecommendationsFilters, PRIORITY_ORDER } from '../../types/recommendations';

interface RecommendationListProps {
  recommendations: Recommendation[];
  filters: RecommendationsFilters;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onExplain: (rec: Recommendation) => void;
}

export default function RecommendationList({
  recommendations,
  filters,
  onComplete,
  onDismiss,
  onExplain,
}: RecommendationListProps) {
  // Apply filters
  let filtered = recommendations.filter(rec => {
    if (!filters.showCompleted && rec.completedAt) return false;
    if (rec.dismissedAt) return false;
    if (filters.category && rec.category !== filters.category) return false;
    if (filters.priority && rec.priority !== filters.priority) return false;
    if (filters.difficulty && rec.difficulty !== filters.difficulty) return false;
    return true;
  });

  // Sort by priority (CRITICAL first), then impact score
  filtered.sort((a, b) => {
    const priDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priDiff !== 0) return priDiff;
    return b.impactScore - a.impactScore;
  });

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-12 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <p className="text-sm font-medium text-[#1A1A1A] mb-1">No recommendations match your filters</p>
        <p className="text-xs text-[#999]">Try adjusting your filters or generating new recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filtered.map(rec => (
          <RecommendationCard
            key={rec.id}
            rec={rec}
            onComplete={onComplete}
            onDismiss={onDismiss}
            onExplain={onExplain}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
