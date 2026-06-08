import React from 'react';
import { RecommendationsProvider, useRecommendationsContext } from '../context/RecommendationsContext';
import { useAppContext } from '../context/AppContext';
import ScoreOverview from '../components/recommendations/ScoreOverview';
import FilterBar from '../components/recommendations/FilterBar';
import GenerateButton from '../components/recommendations/GenerateButton';
import RecommendationList from '../components/recommendations/RecommendationList';
import WeeklyPlanPanel from '../components/recommendations/WeeklyPlanPanel';
import CareerGapPanel from '../components/recommendations/CareerGapPanel';
import MonthlyRoadmapPanel from '../components/recommendations/MonthlyRoadmapPanel';
import OpportunityAlerts from '../components/recommendations/OpportunityAlerts';
import ProgressTracker from '../components/recommendations/ProgressTracker';
import ExplainabilityDrawer from '../components/recommendations/ExplainabilityDrawer';
import { Share2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RecommendationsContent() {
  const { 
    recommendations, isLoading, isGenerating, lastGeneratedAt, triggerRegeneration,
    opportunityAlerts, scores, filters, setFilters, markComplete, dismiss, openExplainer,
    weeklyPlan, gaps, monthlyRoadmap, selectedRecommendation, closeExplainer
  } = useRecommendationsContext();
  const { connectedApps } = useAppContext();
  const navigate = useNavigate();

  // If no recommendations and not loading/generating, show empty state
  const showEmptyState = !isLoading && !isGenerating && recommendations.length === 0;
  const hasConnections = connectedApps.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            AI Recommendations
          </h1>
          <p className="text-[#666] mt-1">Your personalised, prioritised career intelligence feed.</p>
        </div>
        <GenerateButton 
          isGenerating={isGenerating} 
          lastGeneratedAt={lastGeneratedAt} 
          onGenerate={() => triggerRegeneration(true)} 
        />
      </div>

      <OpportunityAlerts alerts={opportunityAlerts} />

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-neutral-200 rounded-2xl"></div>)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7 space-y-4">
              <div className="h-12 bg-neutral-200 rounded-lg w-full mb-6"></div>
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-neutral-200 rounded-xl"></div>)}
            </div>
            <div className="xl:col-span-5 space-y-6">
              <div className="h-64 bg-neutral-200 rounded-2xl"></div>
              <div className="h-48 bg-neutral-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      ) : showEmptyState ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#EFEFEF] rounded-2xl">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
            {hasConnections ? "Ready to generate insights!" : "Connect your platforms to get started"}
          </h2>
          <p className="text-[#666] max-w-md text-center mb-8">
            {hasConnections 
              ? "We've detected your connected platforms. Generate your first personalized career recommendations now."
              : "Synalytix analyses your GitHub, LinkedIn, LeetCode and more to generate personalised career recommendations."}
          </p>
          {hasConnections ? (
            <button 
              onClick={() => triggerRegeneration(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Generate Recommendations
            </button>
          ) : (
            <button 
              onClick={() => navigate('/app/apps')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Connect Platforms
            </button>
          )}
        </div>
      ) : (
        <>
          <ScoreOverview scores={scores} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column (List) - 60% approx */}
            <div className="xl:col-span-7 space-y-6">
              <FilterBar filters={filters} onFilterChange={setFilters} />
              <RecommendationList 
                recommendations={recommendations} 
                filters={filters} 
                onComplete={markComplete} 
                onDismiss={dismiss} 
                onExplain={openExplainer} 
              />
            </div>

            {/* Right Column (Panels) - 40% approx */}
            <div className="xl:col-span-5 space-y-6">
              <ProgressTracker />
              <WeeklyPlanPanel weeklyPlan={weeklyPlan} />
              <CareerGapPanel gaps={gaps} />
              <MonthlyRoadmapPanel roadmap={monthlyRoadmap} />
            </div>
          </div>
        </>
      )}

      <ExplainabilityDrawer recommendation={selectedRecommendation} onClose={closeExplainer} />
    </div>
  );
}

export default function Recommendations() {
  return (
    <RecommendationsProvider>
      <RecommendationsContent />
    </RecommendationsProvider>
  );
}
