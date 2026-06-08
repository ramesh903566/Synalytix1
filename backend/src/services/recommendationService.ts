import { engine } from "../lib/recommendations/engine";
import { supabase } from "../lib/supabase";
import { redis } from "../lib/redis";
import type { GenerateInput, GenerateOutput } from "../types/recommendations";

export class RecommendationService {
  async generate(userId: string, orgId: string, input: GenerateInput): Promise<GenerateOutput> {
    const data = await engine.generateForUser(userId, orgId, input.forceRefresh);
    return { success: true, data };
  }

  async fetchExisting(userId: string, orgId: string): Promise<GenerateOutput | null> {
    const cacheKey = `cache:recs:${userId}`;
    const cachedStr = await redis.get(cacheKey);
    if (cachedStr) {
      return { success: true, data: JSON.parse(cachedStr) };
    }

    // Try to fetch latest run from DB
    const { data: runs } = await supabase
      .from("RecommendationRun")
      .select("id")
      .eq("userId", userId)
      .eq("orgId", orgId)
      .order("generatedAt", { ascending: false })
      .limit(1);

    if (!runs || runs.length === 0) return null;
    const runId = runs[0].id;

    const { data: recs } = await supabase
      .from("Recommendation")
      .select("*")
      .eq("runId", runId)
      .is("dismissedAt", null)
      .is("completedAt", null);

    const { data: scores } = await supabase
      .from("CareerScore")
      .select("*")
      .eq("userId", userId)
      .order("computedAt", { ascending: false })
      .limit(1);

    const { data: alerts } = await supabase
      .from("OpportunityAlert")
      .select("*")
      .eq("userId", userId)
      .is("dismissedAt", null)
      .order("detectedAt", { ascending: false });

    // Since we didn't store weeklyPlan/monthlyRoadmap in DB (except as AI raw output),
    // and we only cached the final output, if it's not in Redis, we would ideally regenerate.
    // Here we'll just reconstruct the basic payload.
    return {
      success: true,
      data: {
        runId,
        recommendations: (recs || []) as any,
        scores: scores?.[0] as any,
        scoreDelta: null,
        weeklyPlan: [],
        monthlyRoadmap: [],
        gaps: { skills: [], assets: [], activities: [] },
        opportunityAlerts: (alerts || []) as any,
      },
    };
  }

  async markComplete(recId: string, userId: string) {
    const { error } = await supabase
      .from("Recommendation")
      .update({ completedAt: new Date().toISOString() })
      .eq("id", recId)
      .eq("userId", userId);
    if (error) throw new Error("Failed to mark complete: " + error.message);
  }

  async dismiss(recId: string, userId: string) {
    const { error } = await supabase
      .from("Recommendation")
      .update({ dismissedAt: new Date().toISOString() })
      .eq("id", recId)
      .eq("userId", userId);
    if (error) throw new Error("Failed to dismiss: " + error.message);
  }

  async dismissAlert(alertId: string, userId: string) {
    const { error } = await supabase
      .from("OpportunityAlert")
      .update({ dismissedAt: new Date().toISOString() })
      .eq("id", alertId)
      .eq("userId", userId);
    if (error) throw new Error("Failed to dismiss alert: " + error.message);
  }
}

export const recommendationService = new RecommendationService();
