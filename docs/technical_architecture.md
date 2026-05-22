# Synalytix Technical Architecture

## 13. Technical Architecture

### 13.1 System Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   React SPA  │  │  Browser Ext │  │  Mobile Web  │  │   Webhooks   │   │
│  │   (Vercel)   │  │  (Optional)  │  │  (Responsive)│  │  Receivers   │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼─────────────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │                 │
          └─────────────────┴─────────────────┴─────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE PLATFORM                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │   Realtime   │  │    Auth      │  │   Storage    │   │
│  │   (Data)     │  │  (WebSocket) │  │   (OAuth)    │  │   (Media)    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │                 │          │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐ │
│  │  Edge Func   │  │  Edge Func   │  │  Edge Func   │  │   pg_cron    │ │
│  │  (Webhook)   │  │  (Poller)    │  │  (Token Ref) │  │  (Rollups)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │Instagram │ │    X     │ │ LinkedIn │ │  GitHub  │ │ LeetCode │        │
│  │   API    │ │   API    │ │   API    │ │   API    │ │   API    │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Anthropic Claude API                             │   │
│  │              (Content Rewriting + Insight Generation)               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Architectural Decision:** Supabase is the central nervous system. The React frontend talks directly to Supabase for auth, database reads (via RLS), real-time subscriptions, and storage. Backend logic lives in Supabase Edge Functions (Deno/TypeScript) for webhook handling, polling, token refresh, and AI orchestration. This eliminates the need for a separate VPS/Railway backend in the MVP phase.

### 13.2 Database Schema

**Core Entity Graph:**
```
users (1) ───────<< (N) user_connections
   │                    │
   │                    └─► (1) integration_providers
   │
   ├─<< (N) activity_logs
   ├─<< (N) metrics_timeseries
   ├─<< (N) ai_briefings
   ├─<< (N) broadcast_queue
   ├─<< (N) media_assets
   └─<< (N) projects (native task management)

broadcast_queue (N) ──> (1) media_assets
```

**Table Specifications:**

| Table | Purpose | Key Details |
|---|---|---|
| **`users`** | Identity root | `email`, `password_hash` (bcrypt), `display_name`, `avatar_url`, `timezone`, `persona_type` (student/creator/team). RLS: users read only their own row. |
| **`integration_providers`** | Platform registry | Static seed data for 5 platforms. `slug`, `name`, `category`, `auth_type` (oauth2/api_key/username), `oauth_authorize_url`, `oauth_token_url`, `oauth_scopes`, `api_base_url`, `rate_limit_per_hour`, `polling_interval_minutes`, `webhook_capable`, `normalized_mapping_rules` (JSONB). |
| **`user_connections`** | Token vault & connection state | `user_id`, `provider_id`, `status` (active/paused/error/disconnected), `access_token` (encrypted), `refresh_token` (encrypted), `token_expires_at`, `webhook_secret`, `provider_user_id`, `last_synced_at`, `last_error_message`, `settings` (JSONB). **Encryption:** AES-256-GCM with master key via Edge Function env vars. Unique: `(user_id, provider_id)`. |
| **`activity_logs`** | Event stream | Append-only. `user_id`, `provider_id`, `action_type` (content_published, metric_updated, task_completed, contest_participated, connection_established, broadcast_sent), `entity_type`, `entity_id`, `raw_payload` (JSONB), `normalized_payload` (JSONB). **Partitioned** by `created_at` month. BRIN index on `created_at`. |
| **`metrics_timeseries`** | Pre-aggregated canonical metrics | `user_id`, `provider_id`, `metric_name` (audience_size, content_volume, engagement_rate, consistency_score, growth_velocity, quality_signal), `metric_value` (numeric), `metric_unit`, `bucket_date`, `granularity` (day/week/month). **Rollup source:** pg_cron job scans `activity_logs` hourly. |
| **`ai_briefings`** | Generated insights | `user_id`, `briefing_type` (daily/weekly/contest/career), `content` (text), `priority_score` (0–100), `related_providers` (JSONB array), `action_cta`, `dismissed` (boolean). |
| **`broadcast_queue`** | Cross-post job queue | `user_id`, `status` (pending/processing/success/failed/retrying), `provider_id`, `media_asset_id`, `content_variant` (text), `scheduled_at`, `processed_at`, `retry_count`, `last_error`, `provider_response` (JSONB), `idempotency_key` (hash). Concurrency: `FOR UPDATE SKIP LOCKED` in Edge Function worker. |
| **`media_assets`** | Object metadata | `user_id`, `original_filename`, `storage_path`, `mime_type`, `file_size`, `variants` (JSONB map: `{instagram: "path/1080x1350.jpg", x: "path/1200x675.webp"}`). |

### 13.3 Authentication & Authorization

**Layer 1: User-to-Synalytix (System Auth)**
- Supabase Auth handles email/password and OAuth (Google, GitHub) login.
- JWT access token returned to React client, stored in memory.

**Layer 2: Synalytix-to-Platform (Outbound OAuth)**
- When a user connects Instagram, the Edge Function constructs the platform's OAuth 2.0 authorization URL with a cryptographic `state` nonce (JWT with `aud=oauth_callback`).
- Callback verifies `state` before exchanging code for tokens.

**Layer 3: Platform-to-Synalytix (Inbound Webhooks)**
- Unique endpoint per user: `/webhooks/{provider_slug}/{user_connection_uuid}`
- Webhook secret verifies HMAC-SHA256 signatures on incoming payloads.

### 13.4 Data Ingestion Pipeline

| Platform | Primary Strategy | Fallback Strategy | Frequency | Auth Method |
|---|---|---|---|---|
| **Instagram** | Graph API polling | Manual import | Every 6 hours | OAuth 2.0 |
| **X** | API v2 polling | Webhooks | Every 15 min | OAuth 2.0 |
| **LinkedIn** | REST API polling | N/A | Every 6 hours | OAuth 2.0 |
| **GitHub** | Webhooks + GraphQL API | N/A | Real-time (webhook) | OAuth 2.0 |
| **LeetCode** | GraphQL scraping | Manual CSV upload | Every 12 hours | Username + session cookie |

### 13.5 Metric Normalization Engine

Raw platform events land in `activity_logs`. A pg_cron job rolls them into `metrics_timeseries` using the canonical taxonomy:

1. **Ingest**: Platform-specific payloads → `activity_logs.raw_payload`
2. **Map**: Edge Function applies `integration_providers.normalized_mapping_rules` (JSONB path maps)
3. **Transform**:
   - Instagram `engagement_rate` = (likes + comments + saves) / reach
   - X `engagement_rate` = (retweets + replies + bookmarks) / impressions
   - LinkedIn `engagement_rate` = (reactions + comments + shares) / impressions
   - GitHub `engagement_rate` = (stars_this_week + forks) / watchers
   - LeetCode `engagement_rate` = contest_rating_percentile
4. **Store**: Write normalized row to `metrics_timeseries`
5. **Rollup**: pg_cron runs hourly for daily granularity. Weekly/monthly computed on-read from daily rows.

### 13.6 Cross-Post Studio Architecture

**Content Variant Generation Flow:**
1. User provides base text + optional media upload → stored in `media_assets` with `variants = {}`
2. Media resizing: Edge Function creates platform-optimal derivatives (Instagram 1080×1350, X 1200×675, LinkedIn 1200×627)
3. Prompt assembly: Structured prompt to Claude API with platform-specific tone/structure/CTA constraints
4. Model: `claude-3-5-sonnet`, `temperature=0.3`, output strict JSON with 5 platform variants
5. Validation: Parse JSON. Retry once if malformed. Return error to frontend if still failing.
6. Broadcast enqueue: On approval, create `broadcast_queue` rows per selected platform with `idempotency_key`

**Broadcast Dispatcher:**
- Edge Function runs every 60 seconds
- Locks pending rows with `SELECT ... FOR UPDATE SKIP LOCKED`
- Decrypts tokens, calls platform APIs
- Success: `status = 'success'` + `provider_response`
- Failure: `retry_count++`, reschedule with exponential backoff (max 3 retries)
- Permanent failure after 3 retries → notify user via `ai_briefings`

### 13.7 AI Insight Engine Architecture

**Data Context Assembly:**
- Nightly Edge Function (pg_cron at 2 AM user timezone) assembles context from:
  - Last 7 days of `metrics_timeseries`
  - Last 30 days of `activity_logs`
  - Current DPS and 30-day trend
- Sends to Claude with constrained output schema (JSON array of insights)
- Stores in `ai_briefings` with `briefing_type = 'daily'`
- Separate jobs for weekly (`briefing_type = 'weekly'`) and contest (`briefing_type = 'contest'`) briefings

### 13.8 Placement Readiness Algorithm

**Input Vectors & Weights:**
- LeetCode Hard ratio + topic diversity: 25%
- LeetCode rating + contest percentile: 20%
- GitHub repos + stars + commit consistency: 25%
- LinkedIn connections + post engagement: 20%
- X + Instagram follower growth + consistency: 10%

**Benchmark Comparison:**
- Tier-1 (FAANG): 400+ problems, 15+ repos with 100+ stars, 1200+ connections, 800+ DPS
- Tier-2 (Mid-tier): 250+ problems, 8+ repos with 20+ stars, 600+ connections, 650+ DPS
- Startup: 150+ problems, 5+ repos with 5+ stars, 300+ connections, 400+ DPS

**Gap Analysis:** `gap = (benchmark_median - user_value) / benchmark_median`. Ranked by weight.

**Output:** `ai_briefings` with `briefing_type = 'career'`: *"You are 73% Tier-1 ready. Your biggest gap is network size (LinkedIn). Spend 30 minutes daily on engagement."*

## 14. Security Architecture

| Threat | Mitigation |
|---|---|
| **Token theft at rest** | AES-256-GCM encryption in `user_connections`. Master key in Edge Function env vars only. |
| **CSRF on OAuth callback** | Cryptographic `state` parameter — JWT nonce verified before token exchange. |
| **Webhook spoofing** | HMAC-SHA256 verification per platform using stored `webhook_secret`. |
| **SQL injection** | Supabase parameterized queries + RLS policies. No raw SQL from user input. |
| **RLS bypass** | All tables have RLS: `USING (auth.uid() = user_id)`. No service role key exposed to frontend. |
| **Rate limiting** | Per-user/per-platform counters enforcing `integration_providers.rate_limit_per_hour`. |
| **Media abuse** | Supabase Storage bucket size limits, MIME whitelist, optional ClamAV scan. |
| **AI prompt injection** | User content escaped in prompts. System instructions fenced. JSON schema validation on output. |

## 15. How to Build It (Implementation Roadmap)

### Phase 1: Foundation (Weeks 1–2)
1. **Supabase project setup**: PostgreSQL, Auth, Storage, Edge Functions enabled.
2. **Database schema**: Create tables with RLS policies. Seed `integration_providers` with 5 platforms.
3. **React scaffold**: Vite or Next.js SPA on Vercel. Install Supabase client SDK.
4. **Auth system**: Email/password + Google OAuth via Supabase Auth. Protected routes.

### Phase 2: Connection Hub (Weeks 3–4)
1. **OAuth flows**: Edge Functions for Instagram, X, LinkedIn, GitHub OAuth initiation and callback handling.
2. **Token vault**: Encrypt/decrypt logic in Edge Functions. Store in `user_connections`.
3. **LeetCode connection**: Username + session cookie capture (no OAuth available).
4. **App Store UI**: 5 platform cards showing connection status, last sync, permissions.

### Phase 3: Data Ingestion (Weeks 5–6)
1. **Polling Edge Functions**: Scheduled via pg_cron for Instagram (6h), X (15m), LinkedIn (6h), LeetCode (12h).
2. **GitHub webhooks**: Webhook receiver Edge Function with HMAC verification.
3. **Activity logging**: Write raw events to `activity_logs` (partitioned).
4. **Metric normalization**: pg_cron job to roll up into `metrics_timeseries` using canonical taxonomy.

### Phase 4: Command Center Dashboard (Weeks 7–8)
1. **Unified dashboard**: React components for DPS score, 5 stat cards, activity feed.
2. **Realtime**: Supabase Realtime subscriptions for live activity feed updates.
3. **Deep dives**: Per-platform detail pages with trend graphs and heatmaps.
4. **DPS calculation**: Edge Function or client-side computation from `metrics_timeseries`.

### Phase 5: AI Insight Engine (Weeks 9–10)
1. **Context assembly Edge Function**: Pulls metrics + activity logs, constructs prompt.
2. **Claude integration**: `claude-3-5-sonnet` with JSON output constraint.
3. **Briefing storage**: Write to `ai_briefings`. Frontend inbox with dismiss action.
4. **Placement Readiness**: Implement gap analysis algorithm, store as career briefings.

### Phase 6: Cross-Post Studio (Weeks 11–12)
1. **Media upload**: Supabase Storage with variant generation (Sharp WASM or external service).
2. **Variant generator Edge Function**: Claude API prompt for 5 platform tones.
3. **Composer UI**: Rich text editor, platform toggles, preview of 5 variants.
4. **Broadcast queue**: `broadcast_queue` table with row-level locking dispatcher.
5. **Platform dispatchers**: Per-platform Edge Functions for Instagram Graph API, X API v2, LinkedIn UGC Posts, GitHub discussions, LeetCode forum.

### Phase 7: Polish & Monetization (Weeks 13–14)
1. **Feature gating**: Free (2 platforms, 3 insights/week) vs Pro (all 5, unlimited) vs Team (shared workspaces).
2. **Billing**: Stripe Checkout + Customer Portal integration. Webhook handling for subscription events.
3. **Performance**: Optimize queries, add caching, tune RLS policies.
4. **Onboarding**: Guided first-connection flow, DPS explanation, sample AI briefing.
