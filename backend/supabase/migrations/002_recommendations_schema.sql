-- ═══════════════════════════════════════════════════════════════════════════
-- Synalytix — AI Recommendations Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Add career fields to user_profiles ─────────────────────────────────────
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS career_goal      TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('student', 'junior', 'mid', 'senior', 'lead'));

-- ─── TABLE: recommendation_runs ─────────────────────────────────────────────
-- Each time the AI engine generates recommendations, one run is created.

CREATE TABLE IF NOT EXISTS recommendation_runs (
  id                TEXT        PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_snapshot  JSONB       NOT NULL,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_used        TEXT        NOT NULL,
  token_count       INT
);

CREATE INDEX IF NOT EXISTS idx_recommendation_runs_user_generated
  ON recommendation_runs (user_id, generated_at DESC);

-- ─── TABLE: recommendations ─────────────────────────────────────────────────
-- Individual recommendations belonging to a run.

CREATE TABLE IF NOT EXISTS recommendations (
  id                TEXT        PRIMARY KEY,
  run_id            TEXT        NOT NULL REFERENCES recommendation_runs(id) ON DELETE CASCADE,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title             TEXT        NOT NULL,
  description       TEXT        NOT NULL,
  reason            TEXT        NOT NULL,
  category          TEXT        NOT NULL CHECK (category IN (
                      'CAREER_GROWTH', 'PERSONAL_BRANDING', 'TECHNICAL_SKILLS',
                      'NETWORKING', 'OPEN_SOURCE', 'ENTREPRENEURSHIP'
                    )),
  priority          TEXT        NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  impact_score      INT         NOT NULL CHECK (impact_score >= 0 AND impact_score <= 100),
  difficulty        TEXT        NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  estimated_time    TEXT        NOT NULL,
  expected_outcome  TEXT        NOT NULL,
  action_steps      JSONB       NOT NULL,   -- string[]
  data_sources      JSONB       NOT NULL,   -- string[]
  confidence_score  FLOAT       NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),

  completed_at      TIMESTAMPTZ,
  dismissed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_category
  ON recommendations (user_id, category);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_priority
  ON recommendations (user_id, priority);

-- Partial index: active (non-dismissed, non-completed) recommendations only
CREATE INDEX IF NOT EXISTS idx_recommendations_active
  ON recommendations (user_id, priority)
  WHERE dismissed_at IS NULL AND completed_at IS NULL;

-- GIN indexes on JSONB columns
CREATE INDEX IF NOT EXISTS idx_recommendations_action_steps
  ON recommendations USING GIN (action_steps jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_recommendations_data_sources
  ON recommendations USING GIN (data_sources jsonb_path_ops);

-- ─── TABLE: career_scores ───────────────────────────────────────────────────
-- Computed career scores per user, one row per computation.

CREATE TABLE IF NOT EXISTS career_scores (
  id            TEXT        PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career        INT         NOT NULL CHECK (career >= 0 AND career <= 100),
  employability INT         NOT NULL CHECK (employability >= 0 AND employability <= 100),
  branding      INT         NOT NULL CHECK (branding >= 0 AND branding <= 100),
  technical     INT         NOT NULL CHECK (technical >= 0 AND technical <= 100),
  computed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_scores_user_computed
  ON career_scores (user_id, computed_at DESC);

-- ─── TABLE: recommendation_rate_limits ──────────────────────────────────────
-- Track generate calls per user for rate limiting (10/hour).

CREATE TABLE IF NOT EXISTS recommendation_rate_limits (
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  called_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendation_rate_limits_user
  ON recommendation_rate_limits (user_id, called_at DESC);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────

ALTER TABLE recommendation_runs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_scores            ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_rate_limits ENABLE ROW LEVEL SECURITY;

-- recommendation_runs
CREATE POLICY "Users can view own runs"
  ON recommendation_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role insert runs"
  ON recommendation_runs FOR INSERT
  WITH CHECK (true);

-- recommendations
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role insert recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own recommendations"
  ON recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- career_scores
CREATE POLICY "Users can view own scores"
  ON career_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role insert scores"
  ON career_scores FOR INSERT
  WITH CHECK (true);

-- rate_limits: backend service role has full access (bypasses RLS)
CREATE POLICY "Service role only for rate limits"
  ON recommendation_rate_limits FOR ALL
  USING (false);

-- ─── Verify tables ──────────────────────────────────────────────────────────
SELECT table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = t.table_name AND table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('recommendation_runs', 'recommendations', 'career_scores', 'recommendation_rate_limits')
ORDER BY table_name;
