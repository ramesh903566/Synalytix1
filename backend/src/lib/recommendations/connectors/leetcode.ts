import type { PlatformConnector, RawPlatformMetrics } from "./types";
import { LEETCODE_WEIGHTS } from "../constants";
import { supabase as db } from "../../../lib/supabase";
import { logger } from "../../../lib/logger";

interface LeetCodeMetrics extends RawPlatformMetrics {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  hardRatio: number;
  contestsParticipated: number;
  contestRating: number;
  streakDays: number;
  acceptanceRate: number;
}

const LEETCODE_GQL = "https://leetcode.com/graphql";

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(LEETCODE_GQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`LeetCode GraphQL error: ${res.status}`);
  const json = (await res.json()) as any;
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

export const leetcodeConnector: PlatformConnector = {
  slug: "leetcode",
  displayName: "LeetCode",

  async isConnected(userId: string): Promise<boolean> {
    const { data } = await db
      .from("user_profiles")
      .select("leetcode_handle")
      .eq("id", userId)
      .single();
    return !!data?.leetcode_handle;
  },

  async fetchRawData(userId: string): Promise<RawPlatformMetrics> {
    const { data: profile } = await db
      .from("user_profiles")
      .select("leetcode_handle")
      .eq("id", userId)
      .single();

    if (!profile?.leetcode_handle) throw new Error("LeetCode handle not set");
    const username = profile.leetcode_handle;

    const statsData = await gql<{
      matchedUser: {
        submitStats: {
          acSubmissionNum: Array<{ difficulty: string; count: number }>;
        };
        profile: { reputation: number };
      };
    }>(
      `query userStats($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count }
          }
          profile { reputation }
        }
      }`,
      { username }
    );

    const stats = statsData.matchedUser.submitStats.acSubmissionNum;
    const easy = stats.find((s) => s.difficulty === "Easy")?.count ?? 0;
    const medium = stats.find((s) => s.difficulty === "Medium")?.count ?? 0;
    const hard = stats.find((s) => s.difficulty === "Hard")?.count ?? 0;
    const total = easy + medium + hard;

    const contestData = await gql<{
      userContestRanking: { rating: number; attendedContestsCount: number } | null;
    }>(
      `query contestRating($username: String!) {
        userContestRanking(username: $username) {
          rating
          attendedContestsCount
        }
      }`,
      { username }
    );

    const contestRanking = contestData.userContestRanking;

    const calData = await gql<{
      matchedUser: {
        submissionCalendar: string;
      };
    }>(
      `query streak($username: String!) {
        matchedUser(username: $username) {
          submissionCalendar
        }
      }`,
      { username }
    );

    const calendar: Record<string, number> = JSON.parse(
      calData.matchedUser.submissionCalendar
    );
    let streakDays = 0;
    const todayTs = Math.floor(Date.now() / 1000);
    for (let i = 0; i < 60; i++) {
      const dayTs = todayTs - i * 86400;
      const dayKey = String(dayTs - (dayTs % 86400));
      if (calendar[dayKey]) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    const metrics: LeetCodeMetrics = {
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      hardRatio: total > 0 ? hard / total : 0,
      contestsParticipated: contestRanking?.attendedContestsCount ?? 0,
      contestRating: contestRanking?.rating ?? 0,
      streakDays,
      acceptanceRate: 0,
    };

    logger.info("LeetCode metrics fetched", { userId, totalSolved: total });
    return metrics;
  },

  computeScore(raw: RawPlatformMetrics): number {
    const m = raw as LeetCodeMetrics;
    let score = 0;

    score += Math.min(m.totalSolved / 300, 1) * LEETCODE_WEIGHTS.problemsSolved * 100;
    score += Math.min(m.hardRatio / 0.20, 1) * LEETCODE_WEIGHTS.hardRatio * 100;

    const contestScore =
      m.contestsParticipated === 0
        ? 0
        : m.contestRating >= 1800
        ? 1
        : m.contestRating >= 1400
        ? 0.6
        : 0.3;
    score += contestScore * LEETCODE_WEIGHTS.contestParticipation * 100;

    score += Math.min(m.streakDays / 30, 1) * LEETCODE_WEIGHTS.streakDays * 100;
    score += Math.min(m.acceptanceRate / 0.55, 1) * LEETCODE_WEIGHTS.acceptanceRate * 100;

    return Math.round(Math.min(score, 100));
  },

  extractMetrics(raw: RawPlatformMetrics): RawPlatformMetrics {
    const m = raw as LeetCodeMetrics;
    return {
      totalSolved: m.totalSolved,
      hardSolved: m.hardSolved,
      hardRatio: m.hardRatio,
      contestsParticipated: m.contestsParticipated,
      contestRating: m.contestRating,
      streakDays: m.streakDays,
    };
  },
};
