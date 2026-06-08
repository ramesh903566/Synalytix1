import type { PlatformConnector, RawPlatformMetrics } from "./types";
import { GITHUB_WEIGHTS } from "../constants";
import { supabase as db } from "../../../lib/supabase";
import { logger } from "../../../lib/logger";

interface GitHubMetrics extends RawPlatformMetrics {
  commitStreakDays: number;
  repoCount: number;
  hasReadmeOnAll: boolean;
  languages: string[];
  openSourceContribs: number;
  daysSinceLastCommit: number;
  totalStars: number;
}

export const githubConnector: PlatformConnector = {
  slug: "github",
  displayName: "GitHub",

  async isConnected(userId: string): Promise<boolean> {
    const { data } = await db
      .from("platform_connections")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "github")
      .single();
    return !!data;
  },

  async fetchRawData(userId: string): Promise<RawPlatformMetrics> {
    const { data: conn } = await db
      .from("platform_connections")
      .select("access_token_encrypted, platform_username")
      .eq("user_id", userId)
      .eq("platform", "github")
      .single();

    if (!conn) throw new Error("GitHub not connected");

    const { decryptToken } = await import("../../../lib/crypto");
    const token = decryptToken(conn.access_token_encrypted);
    const username = conn.platform_username;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );
    if (!reposRes.ok) throw new Error(`GitHub repos fetch failed: ${reposRes.status}`);
    const repos: Array<{
      name: string;
      stargazers_count: number;
      language: string | null;
      fork: boolean;
      has_readme?: boolean;
    }> = (await reposRes.json()) as any;

    const ownRepos = repos.filter((r) => !r.fork);

    const statsRes = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers }
    );
    const events: Array<{ type: string; created_at: string }> =
      statsRes.ok ? ((await statsRes.json()) as any) : [];

    const pushDays = new Set(
      events
        .filter((e) => e.type === "PushEvent")
        .map((e) => new Date(e.created_at).toISOString().slice(0, 10))
    );

    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (pushDays.has(d.toISOString().slice(0, 10))) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    const lastPush = events.find((e) => e.type === "PushEvent");
    const daysSinceLastCommit = lastPush
      ? Math.floor(
          (Date.now() - new Date(lastPush.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 999;

    const languages = [
      ...new Set(ownRepos.map((r) => r.language).filter(Boolean) as string[]),
    ];

    let hasReadmeOnAll = false;
    try {
      const readmeChecks = await Promise.allSettled(
        ownRepos.slice(0, 5).map((r) =>
          fetch(`https://api.github.com/repos/${username}/${r.name}/readme`, {
            headers,
          }).then((res) => res.ok)
        )
      );
      hasReadmeOnAll = readmeChecks.every(
        (r) => r.status === "fulfilled" && r.value === true
      );
    } catch {
      hasReadmeOnAll = false;
    }

    const prRes = await fetch(
      `https://api.github.com/search/issues?q=type:pr+author:${username}+is:merged+-user:${username}&per_page=10`,
      { headers }
    );
    const prData: { total_count: number } = prRes.ok
      ? ((await prRes.json()) as any)
      : { total_count: 0 };

    const metrics: GitHubMetrics = {
      commitStreakDays: streakDays,
      repoCount: ownRepos.length,
      hasReadmeOnAll,
      languages,
      openSourceContribs: prData.total_count,
      daysSinceLastCommit,
      totalStars: ownRepos.reduce((s, r) => s + r.stargazers_count, 0),
    };

    logger.info("GitHub metrics fetched", { userId, repoCount: ownRepos.length });
    return metrics;
  },

  computeScore(raw: RawPlatformMetrics): number {
    const m = raw as GitHubMetrics;
    let score = 0;

    score += Math.min(m.commitStreakDays / 30, 1) * GITHUB_WEIGHTS.commitStreakDays * 100;
    score += Math.min(m.repoCount / 20, 1) * GITHUB_WEIGHTS.repoCount * 100;
    score += (m.hasReadmeOnAll ? 1 : 0) * GITHUB_WEIGHTS.hasReadmeOnAll * 100;
    
    const langScore = m.languages.length >= 3 ? 1 : m.languages.length === 2 ? 0.5 : 0.25;
    score += langScore * GITHUB_WEIGHTS.languageDiversity * 100;

    score += Math.min(m.openSourceContribs / 10, 1) * GITHUB_WEIGHTS.openSourceContribs * 100;
    score += Math.max(0, 1 - m.daysSinceLastCommit / 30) * GITHUB_WEIGHTS.lastCommitRecency * 100;

    return Math.round(Math.min(score, 100));
  },

  extractMetrics(raw: RawPlatformMetrics): RawPlatformMetrics {
    const m = raw as GitHubMetrics;
    return {
      commitStreakDays: m.commitStreakDays,
      repoCount: m.repoCount,
      languages: m.languages,
      openSourceContribs: m.openSourceContribs,
      daysSinceLastCommit: m.daysSinceLastCommit,
      totalStars: m.totalStars,
    };
  },
};
