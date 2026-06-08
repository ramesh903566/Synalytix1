import { PlatformConnector } from './types';
import { ConnectionService } from '../../../services/connectionService';
import { GitHubService } from '../../../services/githubService';
import { GITHUB_SCORE_WEIGHTS } from '../constants';

export const githubConnector: PlatformConnector = {
  slug: 'github',
  displayName: 'GitHub',

  async isConnected(userId: string): Promise<boolean> {
    return ConnectionService.isConnected(userId, 'github');
  },

  async fetchRawData(userId: string): Promise<Record<string, unknown>> {
    const conn = await ConnectionService.getByUserAndPlatform(userId, 'github');
    if (!conn) throw new Error('GitHub not connected');

    const [profile, repos, contributions] = await Promise.all([
      GitHubService.getProfile(conn.decrypted_access_token),
      GitHubService.getAllRepos(conn.decrypted_access_token),
      GitHubService.getContributions(conn.decrypted_access_token, conn.platform_username),
    ]);

    const languages = await GitHubService.getLanguageBreakdown(conn.decrypted_access_token, repos);
    const uniqueLanguages = Object.keys(languages);

    // Compute commit streak from recent push events
    const pushDates = contributions.events
      .filter(e => e.type === 'PushEvent')
      .map(e => new Date(e.created_at).toDateString());
    const uniquePushDays = [...new Set(pushDates)];

    // Count streak days (consecutive from today backwards)
    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (uniquePushDays.includes(d.toDateString())) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    // Check README presence (approximate: repos with description)
    const reposWithReadme = repos.filter(r => r.description && r.description.length > 0);
    const readmeRatio = repos.length > 0 ? reposWithReadme.length / repos.length : 0;

    // Days since last commit
    const lastEvent = contributions.events[0];
    const daysSinceLastCommit = lastEvent
      ? Math.floor((Date.now() - new Date(lastEvent.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    return {
      profile,
      repos: repos.slice(0, 20), // limit for prompt size
      repoCount: repos.length,
      contributions,
      languages: uniqueLanguages,
      languageCount: uniqueLanguages.length,
      totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
      streakDays,
      readmeRatio,
      daysSinceLastCommit,
      openSourceContributions: contributions.recent_pull_requests,
    };
  },

  computeScore(raw: Record<string, unknown>): number {
    const streakDays = (raw.streakDays as number) || 0;
    const repoCount = (raw.repoCount as number) || 0;
    const readmeRatio = (raw.readmeRatio as number) || 0;
    const languageCount = (raw.languageCount as number) || 0;
    const osContribs = (raw.openSourceContributions as number) || 0;
    const daysSince = (raw.daysSinceLastCommit as number) || 999;

    const w = GITHUB_SCORE_WEIGHTS;

    // Commit streak: max 30 days
    const streakScore = Math.min(streakDays / 30, 1) * w.commitStreakDays * 100;
    // Repo count: max 20
    const repoScore = Math.min(repoCount / 20, 1) * w.repoCount * 100;
    // README presence
    const readmeScore = (readmeRatio >= 0.8 ? 1 : readmeRatio) * w.hasReadmeOnAll * 100;
    // Language diversity: 1=5, 2=10, 3+=20
    const langScore = (languageCount >= 3 ? 1 : languageCount >= 2 ? 0.5 : 0.25) * w.topLanguagesDiversity * 100;
    // Open source contributions (max 10 PRs)
    const osScore = Math.min(osContribs / 10, 1) * w.openSourceContributions * 100;
    // Recency: 0 days=10, 30+ days=0
    const recencyScore = Math.max(0, 1 - daysSince / 30) * w.lastCommitRecency * 100;

    return Math.round(Math.min(100, streakScore + repoScore + readmeScore + langScore + osScore + recencyScore));
  },

  extractMetrics(raw: Record<string, unknown>): Record<string, unknown> {
    return {
      repoCount: raw.repoCount,
      totalStars: raw.totalStars,
      streakDays: raw.streakDays,
      languageCount: raw.languageCount,
      languages: raw.languages,
      daysSinceLastCommit: raw.daysSinceLastCommit,
      openSourceContributions: raw.openSourceContributions,
      readmeRatio: raw.readmeRatio,
    };
  },
};
