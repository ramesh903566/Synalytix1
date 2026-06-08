import type { UnifiedUserProfile } from "../../types/recommendations";
import type { PlatformConnector, RawPlatformMetrics } from "./connectors/types";
import {
  CAREER_SCORE_COMPOSITE,
  EMPLOYABILITY_COMPOSITE,
  BRANDING_COMPOSITE,
  TECHNICAL_COMPOSITE,
} from "./constants";
import { supabase as db } from "../supabase";

interface PlatformResult {
  slug: string;
  score: number | null;
  metrics: RawPlatformMetrics;
}

export async function buildUnifiedProfile(
  userId: string,
  connectors: PlatformConnector[]
): Promise<UnifiedUserProfile> {
  const { data: userProfile } = await db
    .from("user_profiles")
    .select("career_goal, experience_level, primary_stack")
    .eq("id", userId)
    .single();

  const careerGoal = userProfile?.career_goal ?? "Software Engineer";
  const experienceLevel = (userProfile?.experience_level ?? "student") as
    | "student"
    | "junior"
    | "mid"
    | "senior"
    | "lead";
  const primaryStack: string[] = userProfile?.primary_stack ?? [];

  const results = await Promise.allSettled(
    connectors.map(async (connector): Promise<PlatformResult> => {
      const connected = await connector.isConnected(userId);
      if (!connected) {
        return { slug: connector.slug, score: null, metrics: {} };
      }
      const raw = await connector.fetchRawData(userId);
      const score = connector.computeScore(raw);
      const metrics = connector.extractMetrics(raw);
      return { slug: connector.slug, score, metrics };
    })
  );

  const platformResults: PlatformResult[] = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { slug: "unknown", score: null, metrics: {} }
  );

  const scoreMap: Record<string, number | null> = {};
  const rawMetrics: Record<string, unknown> = {};

  for (const result of platformResults) {
    scoreMap[result.slug] = result.score;
    if (Object.keys(result.metrics).length > 0) {
      rawMetrics[result.slug] = result.metrics;
    }
  }

  const connectedPlatforms = platformResults
    .filter((r) => r.score !== null)
    .map((r) => r.slug);

  return {
    userId,
    careerGoal,
    experienceLevel,
    primaryStack,
    connectedPlatforms,
    scores: {
      github: scoreMap["github"] ?? null,
      linkedin: scoreMap["linkedin"] ?? null,
      leetcode: scoreMap["leetcode"] ?? null,
      x: scoreMap["x"] ?? null,
    },
    rawMetrics,
  };
}

export function computeCareerScores(
  platformScores: Record<string, number | null>
): { career: number; employability: number; branding: number; technical: number; computedAt: string } {
  function weighted(
    weights: Record<string, number>,
    scores: Record<string, number | null>
  ): number {
    let total = 0;
    let weightSum = 0;
    for (const [platform, weight] of Object.entries(weights)) {
      const score = scores[platform];
      if (score !== null && score !== undefined) {
        total += score * weight;
        weightSum += weight;
      }
    }
    return weightSum > 0 ? Math.round(total / weightSum) : 0;
  }

  return {
    career: weighted(CAREER_SCORE_COMPOSITE, platformScores),
    employability: weighted(EMPLOYABILITY_COMPOSITE, platformScores),
    branding: weighted(BRANDING_COMPOSITE, platformScores),
    technical: weighted(TECHNICAL_COMPOSITE, platformScores),
    computedAt: new Date().toISOString(),
  };
}
