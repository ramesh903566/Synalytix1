import type { PlatformConnector, RawPlatformMetrics } from "./types";
import { X_WEIGHTS } from "../constants";
import { supabase as db } from "../../../lib/supabase";
import { logger } from "../../../lib/logger";

interface XMetrics extends RawPlatformMetrics {
  postFrequency: number;        // posts per week (last 30 days)
  followerGrowthRate: number;   // % per month
  engagementRate: number;       // avg engagement / followers
  followerCount: number;
  hasBio: boolean;
}

export const xConnector: PlatformConnector = {
  slug: "x",
  displayName: "X (Twitter)",

  async isConnected(userId: string): Promise<boolean> {
    const { data } = await db
      .from("platform_connections")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "x")
      .single();
    return !!data;
  },

  async fetchRawData(userId: string): Promise<RawPlatformMetrics> {
    const { data: conn } = await db
      .from("platform_connections")
      .select("access_token_encrypted, platform_user_id")
      .eq("user_id", userId)
      .eq("platform", "x")
      .single();

    if (!conn) throw new Error("X not connected");

    const { decryptToken } = await import("../../../lib/crypto");
    const token = decryptToken(conn.access_token_encrypted);
    const xUserId = conn.platform_user_id;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const userRes = await fetch(
      `https://api.twitter.com/2/users/${xUserId}?user.fields=public_metrics,description`,
      { headers }
    );
    if (!userRes.ok) throw new Error(`X user fetch failed: ${userRes.status}`);
    const userData: {
      data: {
        description: string;
        public_metrics: {
          followers_count: number;
          tweet_count: number;
        };
      };
    } = (await userRes.json()) as any;

    const followers = userData.data.public_metrics.followers_count;
    const hasBio = !!userData.data.description;

    const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${xUserId}/tweets?max_results=100&start_time=${sinceDate}&tweet.fields=public_metrics`,
      { headers }
    );

    let postFrequency = 0;
    let engagementRate = 0;

    if (tweetsRes.ok) {
      const tweetsData: {
        data?: Array<{
          public_metrics: {
            like_count: number;
            retweet_count: number;
            reply_count: number;
          };
        }>;
        meta?: { result_count: number };
      } = (await tweetsRes.json()) as any;

      const tweets = tweetsData.data ?? [];
      postFrequency = tweets.length / 4.3; // 30 days ÷ 4.3 = weekly

      if (tweets.length > 0 && followers > 0) {
        const totalEngagement = tweets.reduce(
          (sum, t) =>
            sum +
            t.public_metrics.like_count +
            t.public_metrics.retweet_count +
            t.public_metrics.reply_count,
          0
        );
        engagementRate = totalEngagement / tweets.length / followers;
      }
    }

    const metrics: XMetrics = {
      postFrequency,
      followerGrowthRate: 0,
      engagementRate,
      followerCount: followers,
      hasBio,
    };

    logger.info("X metrics fetched", { userId, followerCount: followers });
    return metrics;
  },

  computeScore(raw: RawPlatformMetrics): number {
    const m = raw as XMetrics;
    let score = 0;

    score += Math.min(m.postFrequency / 7, 1) * X_WEIGHTS.postFrequency * 100;
    score += Math.min(m.followerGrowthRate / 0.03, 1) * X_WEIGHTS.followerGrowthRate * 100;
    score += Math.min(m.engagementRate / 0.02, 1) * X_WEIGHTS.engagementRate * 100;
    score += (m.hasBio ? 1 : 0) * X_WEIGHTS.hasBio * 100;

    return Math.round(Math.min(score, 100));
  },

  extractMetrics(raw: RawPlatformMetrics): RawPlatformMetrics {
    const m = raw as XMetrics;
    return {
      postFrequency: m.postFrequency,
      followerCount: m.followerCount,
      engagementRate: m.engagementRate,
      hasBio: m.hasBio,
    };
  },
};
