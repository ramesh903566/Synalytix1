import { supabase } from './supabase';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

type ApiEnvelope<T = any> = {
  success: boolean;
  data?: T;
  error?: string | { message?: string };
  message?: string;
};

const OAUTH_PLATFORMS = new Set(['github', 'instagram', 'x', 'linkedin']);

function getErrorMessage(body: ApiEnvelope | null, fallback: string) {
  if (typeof body?.error === 'string') return body.error;
  if (body?.error?.message) return body.error.message;
  return body?.message || fallback;
}

async function readJson<T = any>(res: Response, fallback: string): Promise<ApiEnvelope<T>> {
  const body = await res.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new Error(getErrorMessage(body, fallback));
  }
  return body;
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error('Not authenticated');

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Connect a platform — redirects browser to platform OAuth page
export async function connectPlatform(platform: string) {
  if (!OAUTH_PLATFORMS.has(platform)) {
    throw new Error(`${platform} does not support OAuth connection yet.`);
  }

  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/connect/${platform}?format=json`, {
    headers,
  });

  const body = await readJson<{ url: string }>(res, 'Failed to start platform authorization');
  if (!body.data?.url) throw new Error('Backend did not return an authorization URL.');

  window.location.href = body.data.url;
}

// Get connection status
export async function getConnectionStatus() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/status`, { headers });
  return readJson(res, 'Failed to get connection status');
}

// Disconnect a platform
export async function disconnectPlatform(platform: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/disconnect/${platform}`, {
    method: 'DELETE',
    headers,
  });
  return readJson(res, 'Failed to disconnect platform');
}

// Get all platform data at once (for dashboard)
export async function getDashboardSummary() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/summary`, { headers });
  return readJson(res, 'Failed to get dashboard summary');
}

// Platform-specific fetchers
export async function getGitHubData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/github/all`, { headers });
  return readJson(res, 'Failed to get GitHub data');
}

export async function getInstagramData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/instagram/all`, { headers });
  return readJson(res, 'Failed to get Instagram data');
}

export async function getXData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/x/all`, { headers });
  return readJson(res, 'Failed to get X data');
}

export async function getLeetCodeData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/leetcode/all`, { headers });
  return readJson(res, 'Failed to get LeetCode data');
}

export async function getLinkedInData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/linkedin/all`, { headers });
  return readJson(res, 'Failed to get LinkedIn data');
}

// Connect LeetCode (special — just username, no OAuth)
export async function connectLeetCode(username: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/leetcode/connect`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username }),
  });
  return readJson(res, 'Failed to connect LeetCode');
}

// ═══════════════════════════════════════════════════════════════════════════
//  AI RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function generateRecommendations(options?: {
  forceRefresh?: boolean;
  focusCategory?: string;
}) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/recommendations/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(options || {}),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) throw new Error(getErrorMessage(body, 'Failed to generate recommendations'));
  return body;
}

export async function getRecommendationHistory() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/recommendations/history`, { headers });
  return readJson(res, 'Failed to get recommendation history');
}

export async function completeRecommendation(id: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/recommendations/${id}/complete`, {
    method: 'PATCH',
    headers,
  });
  return readJson(res, 'Failed to complete recommendation');
}

export async function dismissRecommendation(id: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/recommendations/${id}/dismiss`, {
    method: 'PATCH',
    headers,
  });
  return readJson(res, 'Failed to dismiss recommendation');
}
