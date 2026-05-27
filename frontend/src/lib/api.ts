import { supabase } from './supabase';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

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
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('Not authenticated - Cannot connect platform');
  }

  // We navigate to the backend URL directly, passing the token as a query param
  window.location.href = `${BACKEND}/api/auth/connect/${platform}?token=${token}`;
}

// Get connection status
export async function getConnectionStatus() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/status`, { headers });
  if (!res.ok) throw new Error('Failed to get connection status');
  return res.json();
}

// Disconnect a platform
export async function disconnectPlatform(platform: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/disconnect/${platform}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to disconnect platform');
  return res.json();
}

// Get all platform data at once (for dashboard)
export async function getDashboardSummary() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/summary`, { headers });
  if (!res.ok) throw new Error('Failed to get dashboard summary');
  return res.json();
}

// Platform-specific fetchers
export async function getGitHubData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/github/all`, { headers });
  if (!res.ok) throw new Error('Failed to get GitHub data');
  return res.json();
}

export async function getInstagramData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/instagram/all`, { headers });
  if (!res.ok) throw new Error('Failed to get Instagram data');
  return res.json();
}

export async function getXData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/x/all`, { headers });
  if (!res.ok) throw new Error('Failed to get X data');
  return res.json();
}

export async function getLeetCodeData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/leetcode/all`, { headers });
  if (!res.ok) throw new Error('Failed to get LeetCode data');
  return res.json();
}

// Connect LeetCode (special — just username, no OAuth)
export async function connectLeetCode(username: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/leetcode/connect`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('Failed to connect LeetCode');
  return res.json();
}
