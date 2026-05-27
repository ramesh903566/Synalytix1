import axios from 'axios';
import { XProfile, XTweetMetrics, LinkedInProfile, LeetCodeStats, LeetCodeRecentSubmission } from '../types';

// ═════════════════════════════════════════════════════════════════════════════
// X (TWITTER) SERVICE
// ═════════════════════════════════════════════════════════════════════════════

const X_API = 'https://api.twitter.com/2';

export const XService = {

  /**
   * Get the authenticated user's profile.
   * API: GET /users/me
   */
  async getProfile(accessToken: string): Promise<XProfile> {
    const { data } = await axios.get(`${X_API}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        'user.fields': 'id,name,username,description,profile_image_url,public_metrics,verified',
      },
    });

    const user = data.data;

    return {
      platform: 'x',
      id: user.id,
      username: user.username,
      name: user.name,
      description: user.description ?? null,
      profile_image_url: user.profile_image_url ?? null,
      followers_count: user.public_metrics?.followers_count ?? 0,
      following_count: user.public_metrics?.following_count ?? 0,
      tweet_count: user.public_metrics?.tweet_count ?? 0,
    };
  },

  /**
   * Get recent tweets with engagement metrics.
   * Note: impression_count requires Basic API tier ($100/month).
   * Free tier gives retweet/reply/like/quote counts only.
   * API: GET /users/{id}/tweets
   */
  async getRecentTweets(accessToken: string, userId: string, maxResults = 10): Promise<XTweetMetrics[]> {
    const { data } = await axios.get(`${X_API}/users/${userId}/tweets`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        max_results: maxResults,
        'tweet.fields': 'id,text,created_at,public_metrics',
        exclude: 'retweets,replies',
      },
    });

    if (!data.data) return [];

    return data.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      public_metrics: {
        retweet_count: tweet.public_metrics?.retweet_count ?? 0,
        reply_count: tweet.public_metrics?.reply_count ?? 0,
        like_count: tweet.public_metrics?.like_count ?? 0,
        quote_count: tweet.public_metrics?.quote_count ?? 0,
        impression_count: tweet.public_metrics?.impression_count ?? 0,
      },
    }));
  },

  /**
   * Exchange authorization code for access token (OAuth 2.0 with PKCE).
   */
  async exchangeCodeForToken(params: {
    code: string;
    redirectUri: string;
    codeVerifier: string;
  }): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
    const credentials = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString('base64');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: params.code,
      redirect_uri: params.redirectUri,
      code_verifier: params.codeVerifier,
    });

    const { data } = await axios.post(`https://api.twitter.com/2/oauth2/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    });

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  },

  /**
   * Refresh an expired X access token.
   */
  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const credentials = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString('base64');

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const { data } = await axios.post(`https://api.twitter.com/2/oauth2/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    });

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// LINKEDIN SERVICE
// ═════════════════════════════════════════════════════════════════════════════

const LI_API = 'https://api.linkedin.com/v2';

export const LinkedInService = {

  /**
   * Get the authenticated user's profile.
   * API: GET /userinfo (OpenID Connect endpoint — simpler than v2)
   */
  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    const { data } = await axios.get(`https://api.linkedin.com/v2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      platform: 'linkedin',
      id: data.sub,
      first_name: data.given_name ?? '',
      last_name: data.family_name ?? '',
      headline: data.headline ?? null,
      profile_picture_url: data.picture ?? null,
    };
  },

  /**
   * Get recent posts and their engagement (requires r_organization_social scope).
   * Works for Company Pages. Personal post analytics are not available via API.
   */
  async getPostAnalytics(accessToken: string, personUrn: string): Promise<{
    post_id: string;
    text: string;
    created_at: string;
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    clicks: number;
  }[]> {
    try {
      // Get user's shares (posts)
      const { data: sharesData } = await axios.get(`${LI_API}/ugcPosts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        params: {
          q: 'authors',
          authors: `List(${personUrn})`,
          count: 20,
        },
      });

      if (!sharesData.elements || sharesData.elements.length === 0) return [];

      return sharesData.elements.map((post: any) => ({
        post_id: post.id,
        text: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text ?? '',
        created_at: new Date(post.created?.time ?? 0).toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        clicks: 0,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Exchange authorization code for access token.
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  }> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    });

    const { data } = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
    };
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// LEETCODE SERVICE
// No official API — uses LeetCode's internal GraphQL endpoint.
// No OAuth needed: stats are public. Just store the username.
// ═════════════════════════════════════════════════════════════════════════════

const LC_GRAPHQL = 'https://leetcode.com/graphql';

export const LeetCodeService = {

  /**
   * Get a user's problem-solving statistics.
   * This calls LeetCode's internal GraphQL API (unofficial but stable).
   */
  async getStats(username: string): Promise<LeetCodeStats> {
    const query = `
      query getUserStats($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
        }
      }
    `;

    const { data } = await axios.post(
      LC_GRAPHQL,
      { query, variables: { username } },
      {
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (compatible; Synalytix/1.0)',
        },
      }
    );

    const user = data?.data?.matchedUser;
    if (!user) throw new Error(`LeetCode user "${username}" not found`);

    const stats = user.submitStats?.acSubmissionNum ?? [];
    const allStats = stats.find((s: any) => s.difficulty === 'All');
    const easy = stats.find((s: any) => s.difficulty === 'Easy');
    const medium = stats.find((s: any) => s.difficulty === 'Medium');
    const hard = stats.find((s: any) => s.difficulty === 'Hard');

    const totalSolved = allStats?.count ?? 0;
    const totalSubmissions = allStats?.submissions ?? 0;
    const acceptanceRate =
      totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 100 * 10) / 10 : 0;

    return {
      platform: 'leetcode',
      username: user.username,
      total_solved: totalSolved,
      easy_solved: easy?.count ?? 0,
      medium_solved: medium?.count ?? 0,
      hard_solved: hard?.count ?? 0,
      total_submissions: totalSubmissions,
      acceptance_rate: acceptanceRate,
      ranking: user.profile?.ranking ?? 0,
    };
  },

  /**
   * Get a user's recent submission history.
   */
  async getRecentSubmissions(username: string, limit = 15): Promise<LeetCodeRecentSubmission[]> {
    const query = `
      query getRecentSubmissions($username: String!, $limit: Int!) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const { data } = await axios.post(
      LC_GRAPHQL,
      { query, variables: { username, limit } },
      {
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (compatible; Synalytix/1.0)',
        },
      }
    );

    const submissions = data?.data?.recentSubmissionList ?? [];

    return submissions.map((s: any) => ({
      title: s.title,
      title_slug: s.titleSlug,
      timestamp: new Date(parseInt(s.timestamp) * 1000).toISOString(),
      status_display: s.statusDisplay,
      lang: s.lang,
    }));
  },

  /**
   * Validate that a LeetCode username exists.
   * Call this when the user first enters their username.
   */
  async validateUsername(username: string): Promise<boolean> {
    try {
      await LeetCodeService.getStats(username);
      return true;
    } catch {
      return false;
    }
  },
};
