import { supabase } from '../../lib/supabase';
import { CONNECTORS } from './connectors';
import { UnifiedUserProfile } from '../../types/recommendations';

/**
 * Builds a UnifiedUserProfile by aggregating data from all connected platforms.
 * This is Step 1–2 of the engine pipeline.
 */
export async function buildUserProfile(userId: string): Promise<UnifiedUserProfile> {
  // 1. Fetch user profile metadata (career goal, experience level, etc.)
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('career_goal, experience_level')
    .eq('id', userId)
    .single();

  const careerGoal = userProfile?.career_goal || 'Advance my software engineering career';
  const experienceLevel = userProfile?.experience_level || 'mid';

  // 2. Determine which platforms are connected
  const connectedPlatforms: string[] = [];
  const scores: Record<string, number | null> = {
    github: null,
    linkedin: null,
    leetcode: null,
    x: null,
  };
  const rawMetrics: Record<string, unknown> = {};
  const primaryStack: string[] = [];

  // 3. For each connector, check connection and fetch data
  for (const connector of CONNECTORS) {
    try {
      const connected = await connector.isConnected(userId);
      if (!connected) continue;

      connectedPlatforms.push(connector.slug);

      const rawData = await connector.fetchRawData(userId);
      const score = connector.computeScore(rawData);
      const metrics = connector.extractMetrics(rawData);

      scores[connector.slug] = score;
      rawMetrics[connector.slug] = metrics;

      // Extract languages from GitHub for primaryStack
      if (connector.slug === 'github' && rawData.languages) {
        primaryStack.push(...(rawData.languages as string[]).slice(0, 5));
      }
    } catch (err) {
      console.error(`[ProfileBuilder] Error fetching ${connector.slug}:`, err);
      // Continue with other platforms — don't fail the whole profile
    }
  }

  // 4. Sanitise PII before including in profile (strip emails, tokens)
  const sanitisedMetrics: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rawMetrics)) {
    sanitisedMetrics[key] = sanitisePII(value);
  }

  return {
    userId,
    careerGoal,
    experienceLevel: experienceLevel as UnifiedUserProfile['experienceLevel'],
    primaryStack: primaryStack.length > 0 ? primaryStack : ['General Software Engineering'],
    connectedPlatforms,
    scores: {
      github: scores.github ?? null,
      linkedin: scores.linkedin ?? null,
      leetcode: scores.leetcode ?? null,
      x: scores.x ?? null,
    },
    rawMetrics: sanitisedMetrics,
  };
}

/**
 * Recursively strip PII-like values from objects.
 * Removes email addresses, tokens, and sensitive keys.
 */
function sanitisePII(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Strip email patterns
    if (/\S+@\S+\.\S+/.test(obj)) return '[REDACTED]';
    // Strip token-like strings (long hex/base64)
    if (obj.length > 50 && /^[a-zA-Z0-9+/=_-]+$/.test(obj)) return '[REDACTED]';
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitisePII);
  }

  if (obj && typeof obj === 'object') {
    const sanitised: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      // Skip keys that look like tokens or secrets
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('token') || lowerKey.includes('secret') || lowerKey.includes('password') || lowerKey.includes('email')) {
        continue;
      }
      sanitised[key] = sanitisePII(value);
    }
    return sanitised;
  }

  return obj;
}
