import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { ConnectionService } from '../services/connectionService';
import { GitHubService } from '../services/githubService';
import { InstagramService } from '../services/instagramService';
import { XService, LinkedInService, LeetCodeService } from '../services/platformServices';
import { supabase } from '../lib/supabase';

const router = Router();

// ─── Helper: get decrypted token or return 404 ────────────────────────────────
async function getConnection(userId: string, platform: string, res: Response) {
  const conn = await ConnectionService.getByUserAndPlatform(userId, platform as any);
  if (!conn) {
    res.status(404).json({
      success: false,
      error: `${platform} is not connected. Please connect it first.`,
    });
    return null;
  }
  return conn;
}

// ─── Helper: cache data in Supabase to avoid hammering platform APIs ──────────
async function getCached<T>(
  cacheKey: string,
  ttlMinutes: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Check cache
  const { data: cached } = await supabase
    .from('api_cache')
    .select('data, cached_at')
    .eq('cache_key', cacheKey)
    .single();

  if (cached) {
    const age = Date.now() - new Date(cached.cached_at).getTime();
    if (age < ttlMinutes * 60 * 1000) {
      return cached.data as T;
    }
  }

  // Cache miss — fetch fresh data
  const freshData = await fetchFn();

  // Save to cache
  await supabase.from('api_cache').upsert({
    cache_key: cacheKey,
    data: freshData,
    cached_at: new Date().toISOString(),
  }, { onConflict: 'cache_key' });

  return freshData;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GITHUB ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/github/profile
router.get('/github/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `github_profile_${req.userId}`,
      30, // cache for 30 minutes
      () => GitHubService.getProfile(conn.decrypted_access_token)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/repos
router.get('/github/repos', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.per_page as string) || 30;

  try {
    const data = await getCached(
      `github_repos_${req.userId}_p${page}`,
      30,
      () => GitHubService.getRepos(conn.decrypted_access_token, page, perPage)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/contributions
router.get('/github/contributions', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `github_contributions_${req.userId}`,
      60, // contributions change less often
      () => GitHubService.getContributions(conn.decrypted_access_token, conn.platform_username)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/languages
router.get('/github/languages', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const repos = await GitHubService.getRepos(conn.decrypted_access_token);
    const data = await getCached(
      `github_languages_${req.userId}`,
      120,
      () => GitHubService.getLanguageBreakdown(conn.decrypted_access_token, repos)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/all  — single endpoint that returns everything
router.get('/github/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const [profile, repos, contributions] = await Promise.all([
      getCached(`github_profile_${req.userId}`, 30, () =>
        GitHubService.getProfile(conn.decrypted_access_token)
      ),
      GitHubService.getAllRepos(conn.decrypted_access_token),
      getCached(`github_contributions_${req.userId}`, 60, () =>
        GitHubService.getContributions(conn.decrypted_access_token, conn.platform_username)
      ),
    ]);

    const stats = {
      total_stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      fetched_at: new Date().toISOString(),
    };

    res.json({ success: true, data: { profile, repos, contributions, stats } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  INSTAGRAM ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/instagram/profile
router.get('/instagram/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `ig_profile_${req.userId}`,
      30,
      () => InstagramService.getProfile(conn.decrypted_access_token, conn.platform_user_id)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/instagram/insights?period=month
router.get('/instagram/insights', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  const period = (req.query.period as 'day' | 'week' | 'month') || 'month';

  try {
    const data = await getCached(
      `ig_insights_${req.userId}_${period}`,
      60,
      () => InstagramService.getAccountInsights(
        conn.decrypted_access_token,
        conn.platform_user_id,
        period
      )
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/instagram/media?limit=20
router.get('/instagram/media', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const data = await getCached(
      `ig_media_${req.userId}_${limit}`,
      30,
      () => InstagramService.getMedia(
        conn.decrypted_access_token,
        conn.platform_user_id,
        limit
      )
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/instagram/all  — everything in one call
router.get('/instagram/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  try {
    const [profile, insights, media] = await Promise.all([
      getCached(`ig_profile_${req.userId}`, 30, () =>
        InstagramService.getProfile(conn.decrypted_access_token, conn.platform_user_id)
      ),
      getCached(`ig_insights_${req.userId}_month`, 60, () =>
        InstagramService.getAccountInsights(
          conn.decrypted_access_token,
          conn.platform_user_id,
          'month'
        )
      ),
      getCached(`ig_media_${req.userId}_20`, 30, () =>
        InstagramService.getMedia(conn.decrypted_access_token, conn.platform_user_id, 20)
      ),
    ]);

    res.json({ success: true, data: { profile, insights, media } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  X (TWITTER) ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/x/profile
router.get('/x/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'x', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `x_profile_${req.userId}`,
      30,
      () => XService.getProfile(conn.decrypted_access_token)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/x/tweets?limit=10
router.get('/x/tweets', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'x', res);
  if (!conn) return;

  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const data = await getCached(
      `x_tweets_${req.userId}_${limit}`,
      30,
      () => XService.getRecentTweets(conn.decrypted_access_token, conn.platform_user_id, limit)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/x/all
router.get('/x/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'x', res);
  if (!conn) return;

  try {
    const [profile, tweets] = await Promise.all([
      getCached(`x_profile_${req.userId}`, 30, () =>
        XService.getProfile(conn.decrypted_access_token)
      ),
      getCached(`x_tweets_${req.userId}_10`, 30, () =>
        XService.getRecentTweets(conn.decrypted_access_token, conn.platform_user_id, 10)
      ),
    ]);

    res.json({ success: true, data: { profile, tweets } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  LINKEDIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/linkedin/profile
router.get('/linkedin/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'linkedin', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `li_profile_${req.userId}`,
      60,
      () => LinkedInService.getProfile(conn.decrypted_access_token)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/linkedin/posts
router.get('/linkedin/posts', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'linkedin', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `li_posts_${req.userId}`,
      60,
      () => LinkedInService.getPostAnalytics(conn.decrypted_access_token, conn.platform_user_id)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  LEETCODE ROUTES
//  No OAuth — just username. We store username in platform_connections table.
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/data/leetcode/connect  — user submits their username
router.post('/leetcode/connect', authenticate, async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Username is required' });
    return;
  }

  const cleanUsername = username.trim();

  try {
    // 1. Validate the username exists on LeetCode
    const isValid = await LeetCodeService.validateUsername(cleanUsername);
    if (!isValid) {
      res.status(404).json({
        success: false,
        error: `LeetCode user "${cleanUsername}" not found`,
      });
      return;
    }

    // 2. Fetch their stats to store initial data
    const stats = await LeetCodeService.getStats(cleanUsername);

    // 3. Save to platform_connections (no real token — we store username as the identifier)
    await ConnectionService.upsert({
      user_id: req.userId!,
      platform: 'leetcode',
      access_token: cleanUsername, // LeetCode uses public username, not a real token
      refresh_token: null,
      expires_at: null,
      platform_user_id: cleanUsername,
      platform_username: cleanUsername,
      scope: null,
    });

    res.json({
      success: true,
      message: `LeetCode account @${cleanUsername} connected successfully`,
      data: stats,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/leetcode/stats
router.get('/leetcode/stats', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  // For LeetCode the "access_token" is actually the username
  const username = conn.platform_username;

  try {
    const data = await getCached(
      `lc_stats_${username}`,
      60,
      () => LeetCodeService.getStats(username)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/leetcode/submissions
router.get('/leetcode/submissions', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  const limit = parseInt(req.query.limit as string) || 15;
  const username = conn.platform_username;

  try {
    const data = await getCached(
      `lc_submissions_${username}_${limit}`,
      30,
      () => LeetCodeService.getRecentSubmissions(username, limit)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/leetcode/all
router.get('/leetcode/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  const username = conn.platform_username;

  try {
    const [stats, submissions] = await Promise.all([
      getCached(`lc_stats_${username}`, 60, () => LeetCodeService.getStats(username)),
      getCached(`lc_submissions_${username}_15`, 30, () =>
        LeetCodeService.getRecentSubmissions(username, 15)
      ),
    ]);

    res.json({ success: true, data: { stats, submissions } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD SUMMARY ROUTE
//  Single endpoint that returns a summary across ALL connected platforms.
//  Frontend calls this once to populate the main dashboard.
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/summary', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    // Get all connected platforms for this user
    const connections = await ConnectionService.getAllForUser(userId);
    const connectedPlatforms = connections.map(c => c.platform);

    const summary: Record<string, any> = {
      connected_platforms: connectedPlatforms,
      fetched_at: new Date().toISOString(),
    };

    // Fetch data for each connected platform in parallel
    const fetches = connectedPlatforms.map(async (platform) => {
      try {
        const conn = await ConnectionService.getByUserAndPlatform(userId, platform);
        if (!conn) return;

        switch (platform) {
          case 'github':
            summary.github = await getCached(`github_profile_${userId}`, 30, () =>
              GitHubService.getProfile(conn.decrypted_access_token)
            );
            break;

          case 'instagram':
            const [igProfile, igInsights] = await Promise.all([
              getCached(`ig_profile_${userId}`, 30, () =>
                InstagramService.getProfile(conn.decrypted_access_token, conn.platform_user_id)
              ),
              getCached(`ig_insights_${userId}_month`, 60, () =>
                InstagramService.getAccountInsights(
                  conn.decrypted_access_token,
                  conn.platform_user_id,
                  'month'
                )
              ),
            ]);
            summary.instagram = { ...igProfile, insights: igInsights };
            break;

          case 'x':
            summary.x = await getCached(`x_profile_${userId}`, 30, () =>
              XService.getProfile(conn.decrypted_access_token)
            );
            break;

          case 'linkedin':
            summary.linkedin = await getCached(`li_profile_${userId}`, 60, () =>
              LinkedInService.getProfile(conn.decrypted_access_token)
            );
            break;

          case 'leetcode':
            summary.leetcode = await getCached(`lc_stats_${conn.platform_username}`, 60, () =>
              LeetCodeService.getStats(conn.platform_username)
            );
            break;
        }
      } catch (err: any) {
        // Don't fail the whole summary if one platform errors
        summary[platform] = { error: err.message };
      }
    });

    await Promise.all(fetches);

    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  CACHE INVALIDATION
//  Force fresh data for a user's platform (POST to clear cache)
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/cache/invalidate/:platform', authenticate, async (req: Request, res: Response) => {
  const platform = req.params.platform;
  const userId = req.userId!;

  try {
    // Delete all cache entries for this user + platform
    await supabase
      .from('api_cache')
      .delete()
      .like('cache_key', `${platform}_%_${userId}%`);

    res.json({ success: true, message: `Cache cleared for ${platform}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
