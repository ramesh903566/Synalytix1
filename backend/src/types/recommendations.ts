import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// Enums
// ═══════════════════════════════════════════════════════════════════════════

export const PrioritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const DifficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD']);
export const CategorySchema = z.enum([
  'CAREER_GROWTH',
  'PERSONAL_BRANDING',
  'TECHNICAL_SKILLS',
  'NETWORKING',
  'OPEN_SOURCE',
  'ENTREPRENEURSHIP',
]);

export type Priority = z.infer<typeof PrioritySchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type RecommendationCategory = z.infer<typeof CategorySchema>;

// ═══════════════════════════════════════════════════════════════════════════
// Core Schemas
// ═══════════════════════════════════════════════════════════════════════════

export const RecommendationSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  reason: z.string().min(1).max(400),
  category: CategorySchema,
  priority: PrioritySchema,
  impactScore: z.number().int().min(0).max(100),
  difficulty: DifficultySchema,
  estimatedTime: z.string(),
  expectedOutcome: z.string(),
  actionSteps: z.array(z.string()).min(1).max(7),
  dataSources: z.array(z.string()),
  confidenceScore: z.number().min(0).max(1),
  completedAt: z.string().nullable(),
  dismissedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const CareerScoreSchema = z.object({
  career: z.number().int().min(0).max(100),
  employability: z.number().int().min(0).max(100),
  branding: z.number().int().min(0).max(100),
  technical: z.number().int().min(0).max(100),
  computedAt: z.string(),
});

export const UnifiedUserProfileSchema = z.object({
  userId: z.string(),
  careerGoal: z.string(),
  experienceLevel: z.enum(['student', 'junior', 'mid', 'senior', 'lead']),
  primaryStack: z.array(z.string()),
  connectedPlatforms: z.array(z.string()),
  scores: z.object({
    github: z.number().nullable(),
    linkedin: z.number().nullable(),
    leetcode: z.number().nullable(),
    x: z.number().nullable(),
  }),
  rawMetrics: z.record(z.string(), z.unknown()),
});

// ═══════════════════════════════════════════════════════════════════════════
// AI Output Schema — what the AI must return
// ═══════════════════════════════════════════════════════════════════════════

export const AIRecommendationItemSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  reason: z.string().min(1).max(400),
  category: CategorySchema,
  priority: PrioritySchema,
  impactScore: z.number().int().min(0).max(100),
  difficulty: DifficultySchema,
  estimatedTime: z.string(),
  expectedOutcome: z.string(),
  actionSteps: z.array(z.string()).min(1).max(7),
  dataSources: z.array(z.string()),
  confidenceScore: z.number().min(0).max(1),
});

export const AIOutputSchema = z.object({
  recommendations: z.array(AIRecommendationItemSchema),
  scores: z.object({
    career: z.number().int().min(0).max(100),
    employability: z.number().int().min(0).max(100),
    branding: z.number().int().min(0).max(100),
    technical: z.number().int().min(0).max(100),
  }),
  weeklyPlan: z.array(z.string()).length(5),
  monthlyRoadmap: z.array(
    z.object({
      week: z.number().int().min(1).max(4),
      goal: z.string(),
      milestones: z.array(z.string()),
    })
  ),
  gaps: z.object({
    skills: z.array(z.string()),
    assets: z.array(z.string()),
    activities: z.array(z.string()),
  }),
  opportunityAlerts: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      trigger: z.string(),
    })
  ),
});

// ═══════════════════════════════════════════════════════════════════════════
// API Input/Output Schemas
// ═══════════════════════════════════════════════════════════════════════════

export const GenerateRecommendationsInputSchema = z.object({
  forceRefresh: z.boolean().default(false),
  focusCategory: CategorySchema.optional(),
});

export const MonthlyWeekSchema = z.object({
  week: z.number().int().min(1).max(4),
  goal: z.string(),
  milestones: z.array(z.string()),
});

export const OpportunityAlertSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  trigger: z.string(),
  detectedAt: z.string(),
});

export const GapAnalysisSchema = z.object({
  skills: z.array(z.string()),
  assets: z.array(z.string()),
  activities: z.array(z.string()),
});

export const GenerateRecommendationsOutputSchema = z.object({
  success: z.boolean(),
  data: z.object({
    runId: z.string(),
    recommendations: z.array(RecommendationSchema),
    scores: CareerScoreSchema,
    weeklyPlan: z.array(z.string()).length(5),
    monthlyRoadmap: z.array(MonthlyWeekSchema),
    gaps: GapAnalysisSchema,
    opportunityAlerts: z.array(OpportunityAlertSchema),
  }),
  error: z
    .object({ code: z.string(), message: z.string() })
    .optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// Inferred Types
// ═══════════════════════════════════════════════════════════════════════════

export type Recommendation = z.infer<typeof RecommendationSchema>;
export type CareerScore = z.infer<typeof CareerScoreSchema>;
export type UnifiedUserProfile = z.infer<typeof UnifiedUserProfileSchema>;
export type AIOutput = z.infer<typeof AIOutputSchema>;
export type AIRecommendationItem = z.infer<typeof AIRecommendationItemSchema>;
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;
export type MonthlyWeek = z.infer<typeof MonthlyWeekSchema>;
export type OpportunityAlert = z.infer<typeof OpportunityAlertSchema>;
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;
