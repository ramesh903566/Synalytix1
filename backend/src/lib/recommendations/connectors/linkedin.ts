import type { PlatformConnector, RawPlatformMetrics } from "./types";
import { LINKEDIN_WEIGHTS } from "../constants";
import { supabase as db } from "../../../lib/supabase";
import { logger } from "../../../lib/logger";

interface LinkedInMetrics extends RawPlatformMetrics {
  profileCompleteness: number;  // 0–1
  hasAboutSection: boolean;
  postFrequencyPerMonth: number;
  followerGrowthRate: number;
  engagementRate: number;
  followerCount: number;
}

export const linkedinConnector: PlatformConnector = {
  slug: "linkedin",
  displayName: "LinkedIn",

  async isConnected(userId: string): Promise<boolean> {
    const { data } = await db
      .from("platform_connections")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "linkedin")
      .single();
    return !!data;
  },

  async fetchRawData(userId: string): Promise<RawPlatformMetrics> {
    const { data: conn } = await db
      .from("platform_connections")
      .select("access_token_encrypted, metadata")
      .eq("user_id", userId)
      .eq("platform", "linkedin")
      .single();

    if (!conn) throw new Error("LinkedIn not connected");

    const { decryptToken } = await import("../../../lib/crypto");
    const token = decryptToken(conn.access_token_encrypted);

    const profileRes = await fetch("https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,summary,headline,positions,educations,skills)", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let profileCompleteness = 0.5;
    let hasAboutSection = false;

    if (profileRes.ok) {
      const profile: {
        summary?: string;
        headline?: string;
        positions?: { values?: unknown[] };
        educations?: { values?: unknown[] };
        skills?: { values?: unknown[] };
      } = (await profileRes.json()) as any;

      const fields = [
        !!profile.summary,
        !!profile.headline,
        (profile.positions?.values?.length ?? 0) > 0,
        (profile.educations?.values?.length ?? 0) > 0,
        (profile.skills?.values?.length ?? 0) > 0,
      ];
      profileCompleteness = fields.filter(Boolean).length / fields.length;
      hasAboutSection = !!profile.summary;
    }

    const cached = (conn.metadata as Record<string, unknown> | null) ?? {};

    const metrics: LinkedInMetrics = {
      profileCompleteness,
      hasAboutSection,
      postFrequencyPerMonth: (cached.postFrequencyPerMonth as number) ?? 0,
      followerGrowthRate: (cached.followerGrowthRate as number) ?? 0,
      engagementRate: (cached.engagementRate as number) ?? 0,
      followerCount: (cached.followerCount as number) ?? 0,
    };

    logger.info("LinkedIn metrics fetched", { userId, profileCompleteness });
    return metrics;
  },

  computeScore(raw: RawPlatformMetrics): number {
    const m = raw as LinkedInMetrics;
    let score = 0;

    score += m.profileCompleteness * LINKEDIN_WEIGHTS.profileCompleteness * 100;
    score += Math.min(m.postFrequencyPerMonth / 4, 1) * LINKEDIN_WEIGHTS.postFrequencyPerMonth * 100;
    score += Math.min(m.followerGrowthRate / 0.05, 1) * LINKEDIN_WEIGHTS.followerGrowthRate * 100;
    score += Math.min(m.engagementRate / 0.03, 1) * LINKEDIN_WEIGHTS.engagementRate * 100;
    score += (m.hasAboutSection ? 1 : 0) * LINKEDIN_WEIGHTS.hasAboutSection * 100;

    return Math.round(Math.min(score, 100));
  },

  extractMetrics(raw: RawPlatformMetrics): RawPlatformMetrics {
    const m = raw as LinkedInMetrics;
    return {
      profileCompleteness: m.profileCompleteness,
      hasAboutSection: m.hasAboutSection,
      postFrequencyPerMonth: m.postFrequencyPerMonth,
      followerCount: m.followerCount,
    };
  },
};
