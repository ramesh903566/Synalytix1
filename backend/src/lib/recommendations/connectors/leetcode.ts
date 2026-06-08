import { PlatformConnector } from './types';
import { ConnectionService } from '../../../services/connectionService';
import { LeetCodeService } from '../../../services/platformServices';
import { LEETCODE_SCORE_WEIGHTS } from '../constants';

export const leetcodeConnector: PlatformConnector = {
  slug: 'leetcode',
  displayName: 'LeetCode',

  async isConnected(userId: string): Promise<boolean> {
    return ConnectionService.isConnected(userId, 'leetcode');
  },

  async fetchRawData(userId: string): Promise<Record<string, unknown>> {
    const conn = await ConnectionService.getByUserAndPlatform(userId, 'leetcode');
    if (!conn) throw new Error('LeetCode not connected');

    const username = conn.platform_username;
    const [stats, submissions] = await Promise.all([
      LeetCodeService.getStats(username),
      LeetCodeService.getRecentSubmissions(username, 20),
    ]);

    // Compute streak from submissions
    const submissionDates = submissions
      .filter(s => s.status_display === 'Accepted')
      .map(s => new Date(s.timestamp).toDateString());
    const uniqueDays = [...new Set(submissionDates)];

    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (uniqueDays.includes(d.toDateString())) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    // Contest participation: approximate from ranking
    const hasContestRank = stats.ranking > 0 && stats.ranking < 500000;

    return {
      stats,
      submissions: submissions.slice(0, 10),
      problemsSolved: stats.total_solved,
      easySolved: stats.easy_solved,
      mediumSolved: stats.medium_solved,
      hardSolved: stats.hard_solved,
      totalSubmissions: stats.total_submissions,
      acceptanceRate: stats.acceptance_rate,
      ranking: stats.ranking,
      streakDays,
      hardRatio: stats.total_solved > 0 ? stats.hard_solved / stats.total_solved : 0,
      hasContestRank,
    };
  },

  computeScore(raw: Record<string, unknown>): number {
    const problemsSolved = (raw.problemsSolved as number) || 0;
    const hardRatio = (raw.hardRatio as number) || 0;
    const hasContest = (raw.hasContestRank as boolean) || false;
    const streakDays = (raw.streakDays as number) || 0;
    const acceptanceRate = (raw.acceptanceRate as number) || 0;

    const w = LEETCODE_SCORE_WEIGHTS;

    // Problems solved: max 300
    const solvedScore = Math.min(problemsSolved / 300, 1) * w.problemsSolved * 100;
    // Hard ratio: 20%+ is excellent
    const hardScore = Math.min(hardRatio / 0.2, 1) * w.hardRatio * 100;
    // Contest participation: binary
    const contestScore = (hasContest ? 1 : 0) * w.contestParticipation * 100;
    // Streak: max 14 days
    const streakScore = Math.min(streakDays / 14, 1) * w.streakDays * 100;
    // Acceptance rate: max 70%
    const acceptScore = Math.min(acceptanceRate / 70, 1) * w.acceptanceRate * 100;

    return Math.round(Math.min(100, solvedScore + hardScore + contestScore + streakScore + acceptScore));
  },

  extractMetrics(raw: Record<string, unknown>): Record<string, unknown> {
    return {
      problemsSolved: raw.problemsSolved,
      easySolved: raw.easySolved,
      mediumSolved: raw.mediumSolved,
      hardSolved: raw.hardSolved,
      acceptanceRate: raw.acceptanceRate,
      ranking: raw.ranking,
      streakDays: raw.streakDays,
      hardRatio: raw.hardRatio,
    };
  },
};
