import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { getAIProvider } from '../../lib/ai/provider';
import { buildUserProfile } from './profile-builder';
import { buildSystemPrompt, buildUserPrompt } from './prompt-builder';
import { parseAIResponse } from './parsers';
import { CONFIDENCE_THRESHOLD, CACHE_TTL_MINUTES } from './constants';
import { RecommendationService } from '../../services/recommendationService';
import {
  GenerateRecommendationsOutput,
  Recommendation,
  RecommendationCategory,
} from '../../types/recommendations';

interface GenerateOptions {
  forceRefresh?: boolean;
  focusCategory?: RecommendationCategory;
}

/**
 * Main engine orchestration.
 * Executes the 8-step pipeline: Collect → Profile → Prompt → AI → Parse → Persist → Cache → Return
 */
export async function generateRecommendations(
  userId: string,
  options: GenerateOptions = {}
): Promise<GenerateRecommendationsOutput> {
  const { forceRefresh = false, focusCategory } = options;

  // ─── Check cache first ──────────────────────────────────────────────────
  if (!forceRefresh) {
    const cached = await getCachedRecommendations(userId);
    if (cached) return cached;
  }

  // ─── Step 1–2: Collect raw metrics & build profile ──────────────────────
  const profile = await buildUserProfile(userId);

  if (profile.connectedPlatforms.length === 0) {
    throw new EngineError('NO_PLATFORMS', 'No platforms connected. Connect at least one platform to generate recommendations.');
  }

  // ─── Step 3: Build AI prompt ────────────────────────────────────────────
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(profile, focusCategory);

  // ─── Step 4: Call AI provider ───────────────────────────────────────────
  const provider = getAIProvider();
  let rawResponse: string;

  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      rawResponse = await provider.complete(systemPrompt, userPrompt);
      break;
    } catch (err) {
      if (attempt === maxRetries) {
        throw new EngineError('AI_ERROR', `AI provider (${provider.name}) failed after ${maxRetries + 1} attempts: ${(err as Error).message}`);
      }
      // Exponential backoff
      await sleep(1000 * Math.pow(2, attempt));
    }
  }

  // ─── Step 5: Parse and validate ─────────────────────────────────────────
  const aiOutput = parseAIResponse(rawResponse!);

  // Filter out low-confidence recommendations
  const filteredRecs = aiOutput.recommendations.filter(
    rec => rec.confidenceScore >= CONFIDENCE_THRESHOLD
  );

  if (filteredRecs.length === 0) {
    throw new EngineError('NO_RECOMMENDATIONS', 'AI generated no recommendations above the confidence threshold. Please try again.');
  }

  // ─── Step 6: Persist to DB ──────────────────────────────────────────────
  const runId = await RecommendationService.createRun({
    userId,
    profileSnapshot: profile as unknown as Record<string, unknown>,
    modelUsed: provider.name,
  });

  // Assign IDs to recommendations
  const recsWithIds: Recommendation[] = filteredRecs.map(rec => ({
    ...rec,
    id: uuidv4().replace(/-/g, '').slice(0, 25),
    completedAt: null,
    dismissedAt: null,
    createdAt: new Date().toISOString(),
  }));

  await RecommendationService.createRecommendations(runId, userId, recsWithIds);

  // Upsert career scores
  await RecommendationService.upsertCareerScore(userId, {
    career: aiOutput.scores.career,
    employability: aiOutput.scores.employability,
    branding: aiOutput.scores.branding,
    technical: aiOutput.scores.technical,
  });

  // Build opportunity alerts with IDs
  const opportunityAlerts = aiOutput.opportunityAlerts.map(alert => ({
    ...alert,
    id: uuidv4().replace(/-/g, '').slice(0, 25),
    detectedAt: new Date().toISOString(),
  }));

  // ─── Step 7: Build response ─────────────────────────────────────────────
  const response: GenerateRecommendationsOutput = {
    success: true,
    data: {
      runId,
      recommendations: recsWithIds,
      scores: {
        career: aiOutput.scores.career,
        employability: aiOutput.scores.employability,
        branding: aiOutput.scores.branding,
        technical: aiOutput.scores.technical,
        computedAt: new Date().toISOString(),
      },
      weeklyPlan: aiOutput.weeklyPlan,
      monthlyRoadmap: aiOutput.monthlyRoadmap,
      gaps: aiOutput.gaps,
      opportunityAlerts,
    },
  };

  // ─── Step 8: Cache response ─────────────────────────────────────────────
  await cacheRecommendations(userId, response);

  return response;
}

// ═══════════════════════════════════════════════════════════════════════════
// Cache helpers (using existing api_cache table)
// ═══════════════════════════════════════════════════════════════════════════

async function getCachedRecommendations(userId: string): Promise<GenerateRecommendationsOutput | null> {
  const cacheKey = `recommendations_${userId}`;
  const { data } = await supabase
    .from('api_cache')
    .select('data, cached_at')
    .eq('cache_key', cacheKey)
    .single();

  if (!data) return null;

  const age = Date.now() - new Date(data.cached_at).getTime();
  if (age > CACHE_TTL_MINUTES * 60 * 1000) return null;

  return data.data as GenerateRecommendationsOutput;
}

async function cacheRecommendations(userId: string, response: GenerateRecommendationsOutput): Promise<void> {
  const cacheKey = `recommendations_${userId}`;
  await supabase.from('api_cache').upsert({
    cache_key: cacheKey,
    data: response,
    cached_at: new Date().toISOString(),
  }, { onConflict: 'cache_key' });
}

// ═══════════════════════════════════════════════════════════════════════════
// Error class
// ═══════════════════════════════════════════════════════════════════════════

export class EngineError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'EngineError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
