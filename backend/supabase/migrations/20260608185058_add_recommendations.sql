-- Enums
CREATE TYPE "RecommendationCategory" AS ENUM (
  'CAREER_GROWTH',
  'PERSONAL_BRANDING',
  'TECHNICAL_SKILLS',
  'NETWORKING',
  'OPEN_SOURCE',
  'ENTREPRENEURSHIP'
);

CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- RecommendationRun: one row per AI generation call
CREATE TABLE "RecommendationRun" (
  "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId"          TEXT NOT NULL,
  "orgId"           TEXT NOT NULL,
  "profileSnapshot" JSONB NOT NULL,
  "generatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "modelUsed"       TEXT NOT NULL,
  "tokenCount"      INTEGER
);

CREATE INDEX idx_rec_run_user_time ON "RecommendationRun" ("userId", "generatedAt" DESC);
CREATE INDEX idx_rec_run_org      ON "RecommendationRun" ("orgId");

-- Recommendation: individual action items within a run
CREATE TABLE "Recommendation" (
  "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "runId"           TEXT NOT NULL REFERENCES "RecommendationRun"("id") ON DELETE CASCADE,
  "userId"          TEXT NOT NULL,
  "orgId"           TEXT NOT NULL,
  "title"           TEXT NOT NULL,
  "description"     TEXT NOT NULL,
  "reason"          TEXT NOT NULL,
  "category"        "RecommendationCategory" NOT NULL,
  "priority"        "Priority" NOT NULL,
  "impactScore"     INTEGER NOT NULL CHECK ("impactScore" BETWEEN 0 AND 100),
  "difficulty"      "Difficulty" NOT NULL,
  "estimatedTime"   TEXT NOT NULL,
  "expectedOutcome" TEXT NOT NULL,
  "actionSteps"     JSONB NOT NULL DEFAULT '[]',
  "dataSources"     JSONB NOT NULL DEFAULT '[]',
  "confidenceScore" FLOAT NOT NULL CHECK ("confidenceScore" BETWEEN 0 AND 1),
  "completedAt"     TIMESTAMPTZ,
  "dismissedAt"     TIMESTAMPTZ,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rec_user_category ON "Recommendation" ("userId", "category");
CREATE INDEX idx_rec_org_priority  ON "Recommendation" ("orgId", "priority");
CREATE INDEX idx_rec_active        ON "Recommendation" ("userId", "priority")
  WHERE "dismissedAt" IS NULL AND "completedAt" IS NULL;
CREATE INDEX idx_rec_action_steps  ON "Recommendation" USING GIN ("actionSteps" jsonb_path_ops);
CREATE INDEX idx_rec_data_sources  ON "Recommendation" USING GIN ("dataSources" jsonb_path_ops);

-- CareerScore: one row per generation, used for delta calculation
CREATE TABLE "CareerScore" (
  "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId"        TEXT NOT NULL,
  "orgId"         TEXT NOT NULL,
  "career"        INTEGER NOT NULL CHECK ("career" BETWEEN 0 AND 100),
  "employability" INTEGER NOT NULL CHECK ("employability" BETWEEN 0 AND 100),
  "branding"      INTEGER NOT NULL CHECK ("branding" BETWEEN 0 AND 100),
  "technical"     INTEGER NOT NULL CHECK ("technical" BETWEEN 0 AND 100),
  "computedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_career_score_user_time ON "CareerScore" ("userId", "computedAt" DESC);

-- OpportunityAlert: persisted opportunity signals
CREATE TABLE "OpportunityAlert" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId"      TEXT NOT NULL,
  "orgId"       TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "trigger"     TEXT NOT NULL,
  "detectedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "dismissedAt" TIMESTAMPTZ
);

CREATE INDEX idx_opp_alert_user ON "OpportunityAlert" ("userId", "detectedAt" DESC);

-- Enable Row Level Security on all tables
ALTER TABLE "RecommendationRun"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Recommendation"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CareerScore"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OpportunityAlert"   ENABLE ROW LEVEL SECURITY;

-- RLS: users see only their own rows (adjust policy names to match existing conventions)
CREATE POLICY "user_owns_run"   ON "RecommendationRun"  FOR ALL USING (auth.uid()::TEXT = "userId");
CREATE POLICY "user_owns_rec"   ON "Recommendation"     FOR ALL USING (auth.uid()::TEXT = "userId");
CREATE POLICY "user_owns_score" ON "CareerScore"        FOR ALL USING (auth.uid()::TEXT = "userId");
CREATE POLICY "user_owns_alert" ON "OpportunityAlert"   FOR ALL USING (auth.uid()::TEXT = "userId");
