import { PlatformConnector } from './types';
import { ConnectionService } from '../../../services/connectionService';
import { LinkedInService } from '../../../services/platformServices';
import { LINKEDIN_SCORE_WEIGHTS } from '../constants';

export const linkedinConnector: PlatformConnector = {
  slug: 'linkedin',
  displayName: 'LinkedIn',

  async isConnected(userId: string): Promise<boolean> {
    return ConnectionService.isConnected(userId, 'linkedin');
  },

  async fetchRawData(userId: string): Promise<Record<string, unknown>> {
    const conn = await ConnectionService.getByUserAndPlatform(userId, 'linkedin');
    if (!conn) throw new Error('LinkedIn not connected');

    const [profile, posts] = await Promise.all([
      LinkedInService.getProfile(conn.decrypted_access_token),
      LinkedInService.getPostAnalytics(conn.decrypted_access_token, conn.platform_user_id),
    ]);

    // Profile completeness heuristic
    const hasFirstName = !!profile.first_name;
    const hasLastName = !!profile.last_name;
    const hasHeadline = !!profile.headline;
    const hasPhoto = !!profile.profile_picture_url;
    const completenessFactors = [hasFirstName, hasLastName, hasHeadline, hasPhoto];
    const profileCompleteness = completenessFactors.filter(Boolean).length / completenessFactors.length;

    // Post frequency: posts per month (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPosts = posts.filter(p => new Date(p.created_at) > thirtyDaysAgo);
    const postFrequency = recentPosts.length;

    // Engagement rate (likes + comments per post)
    const totalEngagement = recentPosts.reduce((sum, p) => sum + p.likes + p.comments, 0);
    const engagementRate = recentPosts.length > 0 ? totalEngagement / recentPosts.length : 0;

    return {
      profile,
      posts: posts.slice(0, 10),
      profileCompleteness,
      postFrequency,
      engagementRate,
      hasAboutSection: hasHeadline,
      followerGrowthRate: 0, // Not available via LinkedIn API
    };
  },

  computeScore(raw: Record<string, unknown>): number {
    const completeness = (raw.profileCompleteness as number) || 0;
    const postFreq = (raw.postFrequency as number) || 0;
    const followerGrowth = (raw.followerGrowthRate as number) || 0;
    const engagement = (raw.engagementRate as number) || 0;
    const hasAbout = (raw.hasAboutSection as boolean) || false;

    const w = LINKEDIN_SCORE_WEIGHTS;

    const completenessScore = completeness * w.profileCompleteness * 100;
    // Post frequency: 4+ posts/month = full score
    const postScore = Math.min(postFreq / 4, 1) * w.postFrequencyPerMonth * 100;
    // Follower growth: not available, use base score
    const growthScore = Math.min(followerGrowth / 5, 1) * w.followerGrowthRate * 100;
    // Engagement: 10+ avg interactions = full
    const engagementScore = Math.min(engagement / 10, 1) * w.engagementRate * 100;
    const aboutScore = (hasAbout ? 1 : 0) * w.hasAboutSection * 100;

    return Math.round(Math.min(100, completenessScore + postScore + growthScore + engagementScore + aboutScore));
  },

  extractMetrics(raw: Record<string, unknown>): Record<string, unknown> {
    return {
      profileCompleteness: raw.profileCompleteness,
      postFrequency: raw.postFrequency,
      engagementRate: raw.engagementRate,
      hasAboutSection: raw.hasAboutSection,
    };
  },
};
