import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Recommendation, 
  CareerScore, 
  MonthlyWeek, 
  OpportunityAlert, 
  GapAnalysis, 
  RecommendationsFilters,
  RecommendationCategory,
  Priority,
  Difficulty
} from '../types/recommendations';
import * as api from '../lib/api';
import toast from 'react-hot-toast';

interface RecommendationsContextType {
  runId: string | null;
  recommendations: Recommendation[];
  scores: CareerScore | null;
  previousScores: CareerScore | null;
  weeklyPlan: string[];
  monthlyRoadmap: MonthlyWeek[];
  gaps: GapAnalysis;
  opportunityAlerts: OpportunityAlert[];
  filters: RecommendationsFilters;
  selectedRecommendation: Recommendation | null;
  isGenerating: boolean;
  isLoading: boolean;
  lastGeneratedAt: string | null;

  setFilters: (filters: RecommendationsFilters) => void;
  markComplete: (id: string) => Promise<void>;
  dismiss: (id: string) => Promise<void>;
  openExplainer: (rec: Recommendation) => void;
  closeExplainer: () => void;
  triggerRegeneration: (force?: boolean, focusCategory?: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
}

const defaultFilters: RecommendationsFilters = {
  category: null,
  priority: null,
  difficulty: null,
  showCompleted: false,
};

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export function RecommendationsProvider({ children }: { children: ReactNode }) {
  const [runId, setRunId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scores, setScores] = useState<CareerScore | null>(null);
  const [previousScores, setPreviousScores] = useState<CareerScore | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<string[]>([]);
  const [monthlyRoadmap, setMonthlyRoadmap] = useState<MonthlyWeek[]>([]);
  const [gaps, setGaps] = useState<GapAnalysis>({ skills: [], assets: [], activities: [] });
  const [opportunityAlerts, setOpportunityAlerts] = useState<OpportunityAlert[]>([]);
  
  const [filters, setFilters] = useState<RecommendationsFilters>(defaultFilters);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await api.getRecommendationHistory();
      if (res.success && res.data) {
        setRunId(res.data.runId);
        setRecommendations(res.data.recommendations || []);
        setScores(res.data.scores || null);
        setPreviousScores(res.data.previousScores || null);
        setLastGeneratedAt(res.data.generatedAt || null);
        // Map other fields from recommendations list if needed, or if API returns them
        // The history API might just return recommendations. We extract plans/gaps from them if needed, or the API should return full context.
      }
    } catch (err) {
      console.error('Failed to fetch recommendation history:', err);
      toast.error('Failed to load your recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerRegeneration = async (forceRefresh = false, focusCategory?: string) => {
    try {
      setIsGenerating(true);
      const res = await api.generateRecommendations({ forceRefresh, focusCategory });
      if (res.success && res.data) {
        setRunId(res.data.runId);
        setRecommendations(res.data.recommendations);
        setScores(res.data.scores);
        setWeeklyPlan(res.data.weeklyPlan || []);
        setMonthlyRoadmap(res.data.monthlyRoadmap || []);
        setGaps(res.data.gaps || { skills: [], assets: [], activities: [] });
        setOpportunityAlerts(res.data.opportunityAlerts || []);
        setLastGeneratedAt(new Date().toISOString());
        toast.success('Recommendations updated successfully!');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      toast.error(err.message || 'Failed to generate recommendations. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const markComplete = async (id: string) => {
    // Optimistic update
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, completedAt: new Date().toISOString() } : r));
    try {
      await api.completeRecommendation(id);
      toast.success('Marked as complete!');
    } catch (err) {
      console.error('Failed to complete:', err);
      // Revert optimistic update
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, completedAt: null } : r));
      toast.error('Failed to mark as complete.');
    }
  };

  const dismiss = async (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
    try {
      await api.dismissRecommendation(id);
      toast.success('Recommendation dismissed.');
    } catch (err) {
      console.error('Failed to dismiss:', err);
      // Let it be, or refresh
    }
  };

  const openExplainer = (rec: Recommendation) => setSelectedRecommendation(rec);
  const closeExplainer = () => setSelectedRecommendation(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <RecommendationsContext.Provider value={{
      runId,
      recommendations,
      scores,
      previousScores,
      weeklyPlan,
      monthlyRoadmap,
      gaps,
      opportunityAlerts,
      filters,
      selectedRecommendation,
      isGenerating,
      isLoading,
      lastGeneratedAt,
      setFilters,
      markComplete,
      dismiss,
      openExplainer,
      closeExplainer,
      triggerRegeneration,
      fetchHistory
    }}>
      {children}
    </RecommendationsContext.Provider>
  );
}

export function useRecommendationsContext() {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendationsContext must be used within a RecommendationsProvider');
  }
  return context;
}
