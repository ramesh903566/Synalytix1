import { PlatformConnector } from './types';
import { ConnectionService } from '../../../services/connectionService';
import { XService } from '../../../services/platformServices';

export const xConnector: PlatformConnector = {
  slug: 'x',
  displayName: 'X (Twitter)',

  async isConnected(userId: string): Promise<boolean> {
    return ConnectionService.isConnected(userId, 'x');
  },

  async fetchRawData(userId: string): Promise<Record<string, unknown>> {
    const conn = await ConnectionService.getByUserAndPlatform(userId, 'x');
    if (!conn) throw new Error('X not connected');

    const [profile, tweets] = await Promise.all([
      XService.getProfile(conn.decrypted_access_token),
      XService.getRecentTweets(conn.decrypted_access_token, conn.platform_user_id, 20),
    ]);

    // Post frequency: tweets in the dataset
    const postFrequency = tweets.length;

    // Engagement rate: avg (likes + retweets + replies) per tweet
    const totalEngagement = tweets.reduce((sum, t) => {
      const m = t.public_metrics;
      return sum + m.like_count + m.retweet_count + m.reply_count + m.quote_count;
    }, 0);
    const engagementRate = tweets.length > 0 ? totalEngagement / tweets.length : 0;

    return {
      profile,
      tweets: tweets.slice(0, 10),
      followersCount: profile.followers_count,
      followingCount: profile.following_count,
      tweetCount: profile.tweet_count,
      postFrequency,
      engagementRate,
      followerGrowthRate: 0, // Not available in a single snapshot
    };
  },

  computeScore(raw: Record<string, unknown>): number {
    const followers = (raw.followersCount as number) || 0;
    const postFreq = (raw.postFrequency as number) || 0;
    const engagement = (raw.engagementRate as number) || 0;

    // Simple weighted heuristic
    // Followers: max 1000 for full 30pts
    const followerScore = Math.min(followers / 1000, 1) * 30;
    // Post frequency: 10+ tweets in dataset = full 30pts
    const postScore = Math.min(postFreq / 10, 1) * 30;
    // Engagement: 5+ avg interactions = full 25pts
    const engagementScore = Math.min(engagement / 5, 1) * 25;
    // Base score for having account connected
    const baseScore = 15;

    return Math.round(Math.min(100, followerScore + postScore + engagementScore + baseScore));
  },

  extractMetrics(raw: Record<string, unknown>): Record<string, unknown> {
    return {
      followersCount: raw.followersCount,
      tweetCount: raw.tweetCount,
      postFrequency: raw.postFrequency,
      engagementRate: raw.engagementRate,
    };
  },
};
