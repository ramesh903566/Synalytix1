import { getAIProvider } from "../ai/provider";
import { ALL_CONNECTORS } from "./connectors";
import { buildUnifiedProfile, computeCareerScores } from "./profile-builder";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder";
import { parseAIResponse } from "./parsers";
import { CACHE_TTL_SECONDS, CONFIDENCE_THRESHOLD, RATE_LIMIT_PER_HOUR } from "./constants";
import { supabase as db } from "../supabase";
import { redis } from "../redis";
import { logger } from "../logger";
import type { GenerateOutput } from "../../types/recommendations";

const MAX_RETRIES = 2;

export class RecommendationEngine {
  private ai = getAIProvider();

  async generateForUser(userId: string, orgId: string, forceRefresh = false): Promise<GenerateOutput["data"]> {
    const rateKey = `rate:recs:${userId}`;
    const cacheKey = `cache:recs:${userId}`;

    // 1. Rate limiting
    const requests = await redis.incr(rateKey);
    if (requests === 1) {
      await redis.expire(rateKey, 3600);
    }
    if (requests > RATE_LIMIT_PER_HOUR) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // 2. Cache check
    if (!forceRefresh) {
      const cachedStr = await redis.get(cacheKey);
      if (cachedStr) {
        logger.info("Returning cached recommendations", { userId });
        return JSON.parse(cachedStr);
      }
    }

    // 3. Build unified profile
    const profile = await buildUnifiedProfile(userId, ALL_CONNECTORS);
    const scores = computeCareerScores(profile.scores);

    // 4. Generate prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile);

    // 5. Call AI with retry
    let rawResponse = "";
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        rawResponse = await this.ai.complete(systemPrompt, userPrompt);
        lastError = null;
        break; // Success
      } catch (err) {
        lastError = err as Error;
        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 1000;
          logger.warn(`AI call failed, retrying in ${delay}ms`, {
            attempt,
            error: lastError.message,
          });
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    if (lastError) {
      logger.error("AI generation failed after retries", { userId, error: lastError.message });
      throw new Error(`AI generation failed: ${lastError.message}`);
    }

    // 6. Parse response
    const aiOutput = parseAIResponse(rawResponse);

    // 7. Filter low confidence
    const filteredRecs = aiOutput.recommendations.filter(
      (r) => r.confidence_score >= CONFIDENCE_THRESHOLD
    );

    // 8. DB Transaction: save the run, recs, score, and alerts
    const { data: run, error: runErr } = await db
      .from("RecommendationRun")
      .insert({
        userId,
        orgId,
        profileSnapshot: profile,
        modelUsed: "claude-3-opus-20240229",
      })
      .select("id")
      .single();

    if (runErr || !run) throw new Error("Failed to create recommendation run");

    // Insert CareerScore
    await db.from("CareerScore").insert({
      userId,
      orgId,
      career: scores.career,
      employability: scores.employability,
      branding: scores.branding,
      technical: scores.technical,
    });

    // Insert Recommendations
    const recsToInsert = filteredRecs.map((r) => ({
      runId: run.id,
      userId,
      orgId,
      title: r.title,
      description: r.description,
      reason: r.reason,
      category: r.category,
      priority: r.priority,
      impactScore: r.impact_score,
      difficulty: r.difficulty,
      estimatedTime: r.estimated_time,
      expectedOutcome: r.expected_outcome,
      actionSteps: r.action_steps,
      confidenceScore: r.confidence_score,
    }));

    if (recsToInsert.length > 0) {
      const { data: savedRecs, error: recsErr } = await db
        .from("Recommendation")
        .insert(recsToInsert)
        .select();
      if (recsErr) throw new Error("Failed to save recommendations");

      // Insert Alerts
      if (aiOutput.opportunity_alerts.length > 0) {
        await db.from("OpportunityAlert").insert(
          aiOutput.opportunity_alerts.map((a) => ({
            userId,
            orgId,
            title: a.title,
            description: a.description,
            trigger: a.trigger,
          }))
        );
      }

      // Compute Delta (mock implementation, you'd fetch previous score)
      const scoreDelta = { career: 0, employability: 0, branding: 0, technical: 0 };

      // Get saved alerts
      const { data: savedAlerts } = await db
        .from("OpportunityAlert")
        .select()
        .eq("userId", userId)
        .order("detectedAt", { ascending: false });

      const finalOutput: GenerateOutput["data"] = {
        runId: run.id,
        recommendations: savedRecs as any, // casting due to camelCase/snake_case mapping,
        scores,
        scoreDelta,
        weeklyPlan: aiOutput.weekly_plan,
        monthlyRoadmap: aiOutput.monthly_roadmap,
        gaps: aiOutput.gaps,
        opportunityAlerts: (savedAlerts || []) as any,
      };

      // 9. Cache output
      await redis.set(cacheKey, JSON.stringify(finalOutput), "EX", CACHE_TTL_SECONDS);

      return finalOutput;
    }

    throw new Error("No valid recommendations generated");
  }
}

export const engine = new RecommendationEngine();
