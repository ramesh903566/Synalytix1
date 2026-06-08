// ═══════════════════════════════════════════════════════════════════════════
// Recommendation Types (Frontend)
// ═══════════════════════════════════════════════════════════════════════════

export type RecommendationCategory =
  | 'CAREER_GROWTH'
  | 'PERSONAL_BRANDING'
  | 'TECHNICAL_SKILLS'
  | 'NETWORKING'
  | 'OPEN_SOURCE'
  | 'ENTREPRENEURSHIP';

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  category: RecommendationCategory;
  priority: Priority;
  impactScore: number;
  difficulty: Difficulty;
  estimatedTime: string;
  expectedOutcome: string;
  actionSteps: string[];
  dataSources: string[];
  confidenceScore: number;
  completedAt: string | null;
  dismissedAt: string | null;
  createdAt: string;
}

export interface CareerScore {
  career: number;
  employability: number;
  branding: number;
  technical: number;
  computedAt: string;
}

export interface MonthlyWeek {
  week: number;
  goal: string;
  milestones: string[];
}

export interface OpportunityAlert {
  id: string;
  title: string;
  description: string;
  trigger: string;
  detectedAt: string;
}

export interface GapAnalysis {
  skills: string[];
  assets: string[];
  activities: string[];
}

export interface RecommendationsData {
  runId: string;
  recommendations: Recommendation[];
  scores: CareerScore;
  weeklyPlan: string[];
  monthlyRoadmap: MonthlyWeek[];
  gaps: GapAnalysis;
  opportunityAlerts: OpportunityAlert[];
}

export interface RecommendationsHistoryResponse {
  success: boolean;
  data: {
    runId: string;
    recommendations: Recommendation[];
    scores: CareerScore | null;
    generatedAt: string;
    previousScores: CareerScore | null;
  } | null;
  message?: string;
}

export interface GenerateRecommendationsResponse {
  success: boolean;
  data: RecommendationsData;
  error?: { code: string; message: string };
}

export interface RecommendationsFilters {
  category: RecommendationCategory | null;
  priority: Priority | null;
  difficulty: Difficulty | null;
  showCompleted: boolean;
}

export const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  CAREER_GROWTH: 'Career Growth',
  PERSONAL_BRANDING: 'Personal Branding',
  TECHNICAL_SKILLS: 'Technical Skills',
  NETWORKING: 'Networking',
  OPEN_SOURCE: 'Open Source',
  ENTREPRENEURSHIP: 'Entrepreneurship',
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};
