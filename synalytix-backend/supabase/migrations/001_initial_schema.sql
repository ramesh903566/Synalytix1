-- ═══════════════════════════════════════════════════════════════════════════
-- Synalytix — Supabase Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (needed for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TABLE: platform_connections ────────────────────────────────────────────
-- Stores OAuth tokens for each platform a user connects.
-- Tokens are encrypted at the application layer before being stored here.

CREATE TABLE IF NOT EXISTS platform_connections (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform          TEXT        NOT NULL CHECK (platform IN ('github', 'instagram', 'x', 'linkedin', 'leetcode')),
  access_token      TEXT        NOT NULL,         -- AES-256-GCM encrypted
  refresh_token     TEXT,                         -- AES-256-GCM encrypted (nullable)
  expires_at        TIMESTAMPTZ,                  -- NULL means never expires
  platform_user_id  TEXT        NOT NULL,         -- their ID on that platform
  platform_username TEXT        NOT NULL,         -- their username/handle
  scope             TEXT,                         -- OAuth scopes granted
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- A user can only have one connection per platform
  UNIQUE (user_id, platform)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_id
  ON platform_connections (user_id);

-- Index for finding expiring tokens (used by cron job)
CREATE INDEX IF NOT EXISTS idx_platform_connections_expires_at
  ON platform_connections (expires_at)
  WHERE expires_at IS NOT NULL;

-- ─── TABLE: oauth_states ─────────────────────────────────────────────────────
-- Temporary CSRF protection states for OAuth flows.
-- Each state is used once and deleted immediately after callback.

CREATE TABLE IF NOT EXISTS oauth_states (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform      TEXT        NOT NULL,
  state_token   TEXT        NOT NULL UNIQUE,
  code_verifier TEXT,                      -- For PKCE (X OAuth 2.0)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast state token lookups
CREATE INDEX IF NOT EXISTS idx_oauth_states_token
  ON oauth_states (state_token);

-- Auto-delete states older than 15 minutes
-- (We also delete them programmatically, this is a safety net)
CREATE INDEX IF NOT EXISTS idx_oauth_states_created_at
  ON oauth_states (created_at);

-- ─── TABLE: api_cache ────────────────────────────────────────────────────────
-- Caches API responses to avoid hitting platform rate limits.
-- Each cache entry has a key (e.g., "github_profile_USER_ID") and JSON data.

CREATE TABLE IF NOT EXISTS api_cache (
  cache_key   TEXT        PRIMARY KEY,
  data        JSONB       NOT NULL,
  cached_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for finding stale cache entries
CREATE INDEX IF NOT EXISTS idx_api_cache_cached_at
  ON api_cache (cached_at);

-- ─── TABLE: user_profiles ────────────────────────────────────────────────────
-- Extended profile info beyond what Supabase auth.users stores.
-- Created automatically when a user signs up (via trigger below).

CREATE TABLE IF NOT EXISTS user_profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  handle        TEXT        UNIQUE,
  plan_tier     TEXT        NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'business', 'enterprise')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TRIGGER: auto-create user_profile on signup ────────────────────────────
-- Whenever a new user signs up via Supabase Auth, we automatically create
-- their profile row in user_profiles.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── ROW LEVEL SECURITY (RLS) ────────────────────────────────────────────────
-- RLS ensures users can only access their OWN data.
-- Even if someone gets a valid JWT, they can't read another user's tokens.

-- Enable RLS on all tables
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_cache             ENABLE ROW LEVEL SECURITY;

-- platform_connections: users can only see/modify their own rows
CREATE POLICY "Users can view own connections"
  ON platform_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON platform_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON platform_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
  ON platform_connections FOR DELETE
  USING (auth.uid() = user_id);

-- oauth_states: users can only see/modify their own rows
CREATE POLICY "Users can manage own oauth states"
  ON oauth_states FOR ALL
  USING (auth.uid() = user_id);

-- user_profiles: users can only see/modify their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- api_cache: backend service role has full access (bypasses RLS)
-- We use the service role key in the backend, so no user policy needed here.
-- But we still enable RLS so frontend can't access cache directly.
CREATE POLICY "Service role only for cache"
  ON api_cache FOR ALL
  USING (false);  -- No direct client access; backend uses service role

-- ─── CLEANUP FUNCTION ────────────────────────────────────────────────────────
-- Called periodically to delete stale oauth_states and expired cache entries.
-- You can schedule this via Supabase's pg_cron extension.

CREATE OR REPLACE FUNCTION cleanup_stale_data()
RETURNS void AS $$
BEGIN
  -- Delete oauth states older than 15 minutes
  DELETE FROM oauth_states
  WHERE created_at < NOW() - INTERVAL '15 minutes';

  -- Delete cache entries older than 3 hours
  DELETE FROM api_cache
  WHERE cached_at < NOW() - INTERVAL '3 hours';
END;
$$ LANGUAGE plpgsql;

-- Verify tables were created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = t.table_name AND table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('platform_connections', 'oauth_states', 'api_cache', 'user_profiles')
ORDER BY table_name;
