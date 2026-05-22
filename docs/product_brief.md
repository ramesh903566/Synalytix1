# Synalytix Product Brief

## 1. Product Identity

| Attribute | Detail |
|---|---|
| **Name** | Synalytix |
| **Tagline** | *One Dashboard. Five Platforms. Your Complete Digital Identity.* |
| **Category** | SaaS — Personal Analytics & Cross-Platform Content Orchestration |
| **MVP Scope** | Instagram · X (Twitter) · LinkedIn · GitHub · LeetCode |
| **North Star** | A student or developer opens one browser tab every morning and knows exactly where they stand across their entire digital identity — and what one action to take today to improve it. |

Synalytix is **not** a social media scheduler, a GitHub stats viewer, or a LeetCode tracker. It is the first product that treats a student's or early-career professional's **entire digital footprint as one coherent identity** — and gives them the tools to understand it, improve it, and broadcast it.

## 2. The Problem

Modern students, developers, and early-career professionals live fragmented digital lives across five distinct arenas:

- **Instagram** — visual portfolio and personal brand
- **X** — real-time technical thoughts and network building
- **LinkedIn** — professional credibility and hiring pipeline
- **GitHub** — proof of craftsmanship and engineering ability
- **LeetCode** — quantified problem-solving skill and placement readiness

**The Pain Points:**
- Switching between five tabs every morning to check metrics
- No correlation between coding output (GitHub/LeetCode) and social growth (Instagram/X/LinkedIn)
- Manually cross-posting the same milestone across platforms with different tones and formats
- No unified score answering: *"Am I actually ready for that internship?"*
- No AI advisor that reads across all five platforms and spots gaps (e.g., *"You code daily but never post about it"*)

**The Gap:** Existing tools solve pieces. Buffer handles social posting. GitHub has Insights. LeetCode has a profile. But no product treats these five as one interconnected identity.

## 3. The Solution

Synalytix is a unified SaaS dashboard that:

1. **Connects** to your Instagram, X, LinkedIn, GitHub, and LeetCode accounts securely via OAuth/API keys
2. **Aggregates** metrics from all five into a single **Digital Presence Score (DPS)**
3. **Analyzes** cross-platform patterns (e.g., does posting on LinkedIn correlate with GitHub stars?)
4. **Advises** via AI on what to post, when to post, and what skills to prioritize
5. **Broadcasts** content from one Studio to all five platforms, auto-adapted per platform's tone and format

## 4. Target Users

| Persona | Primary Platforms | Why They Need Synalytix |
|---|---|---|
| **CS Student (Placement Track)** | LeetCode + LinkedIn + GitHub | *"Am I FAANG-ready? What is my gap?"* |
| **DevRel / Developer Creator** | GitHub + X + Instagram | *"I build projects but my audience is not growing."* |
| **Internship Hunter** | LinkedIn + GitHub + LeetCode | *"Recruiters check all three. I need them aligned."* |
| **Campus Ambassador / Influencer** | Instagram + X + LinkedIn | *"I post daily but have no analytics across platforms."* |
| **Open Source Builder** | GitHub + X + LinkedIn | *"I shipped a project but nobody noticed."* |

## 5. Core System Modules (MVP)

### Module 1: The App Store (Connection Hub)
A grid of five platform cards grouped by category:
- **Social:** Instagram, X
- **Professional:** LinkedIn
- **Development:** GitHub
- **Skill:** LeetCode

Each card shows connection status, last sync time, and data permissions. Users connect via OAuth (or username/API key where OAuth is unavailable, e.g., LeetCode).

### Module 2: The Command Center (Unified Dashboard)
The post-login landing page. Displays:
- **Digital Presence Score (0–1000):** Weighted composite of all five platforms
- **Five Live Stat Cards:** One per platform with the 3–4 most critical metrics
- **Cross-Platform Activity Feed:** Chronological stream of events from all five sources
- **Today's AI Briefing:** Three actionable insights generated overnight

### Module 3: Per-Platform Deep Dives
Clicking any stat card opens a dedicated analytics page with native-grade depth:
- Trend graphs, heatmaps, performance comparisons vs. previous periods
- Topic/tag breakdowns (what content performs best, what coding topics are weakest)

### Module 4: Cross-Post Studio
A unified content composer that:
- Accepts text, images, and video
- Shows toggles for each of the five platforms
- Auto-rewrites content per platform using AI (Claude API)
- Resizes media to platform-optimal dimensions
- Schedules or publishes immediately
- Reports per-platform success/failure

### Module 5: AI Insight Engine
A recommendation system that:
- Reads normalized data from all five platforms
- Generates daily briefings, weekly reports, and placement readiness assessments
- Suggests cross-post opportunities (e.g., *"Your GitHub repo hit 100 stars — draft an Instagram carousel"*)
- Identifies skill and content gaps

### Module 6: Placement Readiness Tracker (LeetCode-Centric)
A specialized view for students that translates LeetCode + GitHub + LinkedIn data into hiring intelligence:
- Tier-1 / Tier-2 / Startup readiness scores
- Skill gap analysis against industry benchmarks
- Contest calendar and predicted performance

## 6. The Five-Platform Ecosystem (Detailed)

### 6.1 Instagram — The Visual Brand Layer
**Role:** Personal brand proof and visual storytelling.
**Metrics Ingested:**
- Follower growth (daily/weekly/monthly)
- Post performance (reach, impressions, likes, comments, saves, shares)
- Story completion and reply rates
- Reel watch time and viral velocity
- Audience demographics (age, city, active hours)
- Hashtag discovery performance
**Synalytix Value-Add:**
- **Content-Code Correlation:** Overlays Instagram posting days with GitHub commit days to detect "authenticity gaps"
- **Visual Consistency Score:** Analyzes color palette, aspect ratio, and caption length trends vs. engagement
- **Optimal Posting Time:** Per-user audience activity analysis
- **Cross-Post Trigger:** Auto-suggests Instagram content when GitHub/LeetCode milestones occur

### 6.2 X (Twitter) — The Thought Layer
**Role:** Raw technical voice and real-time network pulse.
**Metrics Ingested:**
- Follower velocity and unfollow patterns
- Tweet impressions, engagements, retweets, bookmarks
- Thread performance (drop-off points, total thread reach)
- Content taxonomy (auto-classified: rant, tutorial, milestone, meme, question)
- Reply network (who amplifies you, who you engage with most)
**Synalytix Value-Add:**
- **Voice Fingerprinting:** AI learns your X tone and uses it as the base model for rewriting content to other platforms
- **Bookmark Intelligence:** Identifies which topics get saved most (indicates educational value) and suggests expanding them into LinkedIn articles or Instagram carousels
- **Velocity Tracker:** How fast a tweet picks up steam; correlates with GitHub repo launches

### 6.3 LinkedIn — The Professional Ledger
**Role:** Career credibility, hiring pipeline, and long-form authority.
**Metrics Ingested:**
- Connection count, follower count, profile views, search appearances
- Post impressions by content type (text, image, video, document, newsletter)
- Engagement rate by topic (hiring, technical lessons, career updates)
- Network quality metrics (industry distribution, seniority levels)
**Synalytix Value-Add:**
- **Career Trajectory Mapping:** Correlates LeetCode milestones and GitHub launches with LinkedIn profile view spikes
- **Opportunity Detection:** Alerts when multiple connections join target companies
- **Content Gap Analysis:** Benchmarks posting frequency against placed peers
- **Cross-Post Elevation:** Converts raw X thoughts or GitHub READMEs into professional LinkedIn narratives

### 6.4 GitHub — The Craft Evidence
**Role:** Proof of engineering ability and project execution.
**Metrics Ingested:**
- Repository metrics (stars, forks, watchers, language distribution)
- Commit frequency, contribution graph, lines added/deleted
- Pull request lifecycle (opened, reviewed, merged, rejected)
- Issue resolution velocity
- README completeness and project health signals
- Collaboration patterns (org memberships, co-author networks)
**Synalytix Value-Add:**
- **Code Velocity Narrative:** Not just commit counts, but the story of each project (active → maintenance → abandoned)
- **Language Portfolio Tracking:** Visualizes tech stack balance and suggests gaps for target roles
- **Recruiter Readiness Score:** Evaluates profile completeness, documentation quality, and contribution consistency
- **Build-to-Share Pipeline:** When a repo crosses a threshold (stars, releases), suggests social posts across Instagram/X/LinkedIn

### 6.5 LeetCode — The Skill Quantifier
**Role:** Hard data on algorithmic thinking and placement readiness.
**Metrics Ingested:**
- Problems solved by difficulty (Easy/Medium/Hard) and by topic tag
- Acceptance rate and attempt counts
- Contest rating history, rank percentiles, rating volatility
- Daily submission streaks and activity calendars
- Language usage and per-language success rates
**Synalytix Value-Add:**
- **Placement Readiness Algorithm:** Composite score translating LeetCode progress + GitHub depth + LinkedIn network into hiring tier predictions
- **Topic Mastery Heatmap:** Identifies memorization vs. true understanding (high attempts + low acceptance = weak area)
- **Contest Prediction:** Pre-contest expected solve rate based on recent practice patterns
- **Cross-Platform Celebration:** Auto-generates milestone posts for all four social platforms when streaks or numerical thresholds are hit

## 7. The Unified Metrics Layer (Canonical Taxonomy)

All five platforms speak different languages. Synalytix translates them into a canonical taxonomy stored in `metrics_timeseries`:

| Canonical Metric | Instagram | X | LinkedIn | GitHub | LeetCode |
|---|---|---|---|---|---|
| `audience_size` | Followers | Followers | Connections + Followers | Stars + Watchers | N/A |
| `content_volume` | Posts | Tweets | Articles + Posts | Commits + PRs | Problems Solved |
| `engagement_rate` | Likes/Reach | Engagements/Impressions | Reactions/Views | Stars/Week + Forks | Contest Rank %ile |
| `consistency_score` | Posting streak | Tweet streak | Weekly post count | Commit streak | Daily submission streak |
| `growth_velocity` | Follower %/week | Follower %/week | Profile view %/week | Star velocity | Rating delta/month |
| `quality_signal` | Save rate | Bookmark rate | Comment depth | PR merge rate | Acceptance rate |

This normalization allows the dashboard to answer:
- *"Which platform is growing fastest relative to my effort?"*
- *"Am I more consistent on LeetCode or GitHub?"*
- *"Does my X engagement predict my LinkedIn profile views?"*

## 8. The Digital Presence Score (DPS)

A flagship composite metric (0–1000) calculated from all five platforms.

### Weighting Rationale
| Platform | Weight | Rationale |
|---|---|---|
| LeetCode | 25% | Raw problem-solving ability. The most quantitative signal. |
| GitHub | 25% | Proof of building real things. The most credible signal for recruiters. |
| LinkedIn | 20% | Professional network and visibility. The hiring pipeline. |
| X | 15% | Thought leadership and community engagement. The network effect. |
| Instagram | 15% | Personal brand and visual storytelling. The human layer. |

### Tier Interpretation
- **0–400:** Building foundations. Focus on consistency.
- **400–650:** Emerging presence. Ready for startup internships.
- **650–850:** Strong digital identity. Tier-2 / mid-tier ready.
- **850–1000:** Authority. FAANG-ready profile; recruiters likely already find you.

The AI uses **DPS trend lines**, not absolute numbers, to generate advice: *"Your DPS rose 120 points this month because of a GitHub viral moment. But your LeetCode flatlined. Rebalance effort."*

## 9. The Cross-Post Studio (Five-Platform Broadcast)

### The Composer
A rich text editor with media upload. The user selects destinations via toggles.

### The AI Adaptation Layer
When the user clicks **"Adapt for Each Platform,"** the AI generates five versions:

| Platform | Tone | Structure | Media | CTA |
|---|---|---|---|---|
| **Instagram** | Casual, emoji-rich, visual | Short hook + carousel slides | 4:5 portrait, dark mode aesthetic | "Save this" / "DM me" |
| **X** | Sarcastic, raw, punchy | Single tweet or thread | 1200×675 screenshot | "What do you think?" |
| **LinkedIn** | Professional, humble, detailed | 3–5 paragraphs with insight | 1200×627 infographic / architecture diagram | "Comment your approach" |
| **GitHub** | Technical, precise, documented | README section or release notes | Architecture diagrams, code snippets | "Star the repo" / "Open an issue" |
| **LeetCode** | Educational, community-focused | Discussion post with explanation | Formatted code blocks | "Upvote if helpful" |

### The Broadcast Engine
- Publishes asynchronously to each platform
- Handles media resizing per platform
- **Isolates failures** (one platform failing does not block others)
- Returns a unified status report

## 10. The AI Insight Engine (Five-Platform Specific)

### Insight Categories

**1. Authenticity & Narrative Alignment**
> *"You posted on Instagram: 'Shipping features daily.' Your GitHub shows 2 commits this week. Your X says 'grind never stops.' Your LeetCode streak is broken. There is a 73% narrative gap between your public voice and actual output. Recommendation: post about the struggle, not just the shipping."*

**2. Optimal Daily Rhythm**
> *"Your LeetCode success rate is 81% at 7:00 AM but 43% at 11:00 PM. Your X posts peak at 9:00 PM. Your Instagram audience is active at 7:00 PM. Your LinkedIn performs best Tuesday 9:00 AM. Recommended rhythm: Code at 7 AM. Commit by noon. Draft X posts at 8 PM. Schedule LinkedIn for Tuesday 9 AM."*

**3. Career Trajectory & Gap Analysis**
> *"You have 342 LeetCode problems, 12 GitHub repos, and 892 LinkedIn connections. The typical Tier-1 intern at your stage has 400+ problems, 15+ repos with 100+ stars, and 1,200+ connections. Your gap is network size and project visibility, not skill. Spend 30 minutes daily on LinkedIn engagement."*

**4. Cross-Platform Synergy**
> *"Your GitHub repo 'synalytix-clone' got 47 stars this week. Your X thread about it got 12,000 impressions. But you never posted it on LinkedIn. LinkedIn technical posts from students with 10+ stars get 3x more recruiter profile views. Cross-post today."*

**5. Contest & Skill Intelligence**
> *"Your LeetCode acceptance rate on Graph problems is 35%. Students placed at your target companies average 78%. Your last 5 incorrect submissions were all BFS implementations with visited-array bugs. Review grid-based BFS patterns before the next contest."*

## 11. Monetization / SaaS Model

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | Connect 2 platforms, basic dashboard, 3 AI insights/week, manual cross-post |
| **Pro** | $9/month | All 5 platforms, full analytics, unlimited AI insights, auto-rewrite, scheduling |
| **Team** | $29/month | Shared workspaces, approval workflows, team leaderboard, shared posting calendar |

## 12. Success Metrics (How You Know It Works)

**User Metrics:**
- 5-platform connection rate (target: 70% of users connect ≥3 platforms)
- Cross-post usage (target: 3 broadcasts/week per active user)
- DPS improvement over 30 days (target: +50 points average)

**Technical Metrics:**
- Ingestion latency: <5 minutes from platform event to dashboard update
- Broadcast success rate: >95% per platform
- AI insight relevance: Measured by user "thumbs up" rate >70%

## 16. The Narrative — Why This Project Matters

Synalytix is not a social media scheduler. It is not a GitHub stats viewer. It is not a LeetCode tracker.

It is the **first product that treats a student's entire digital footprint as one coherent identity** — and gives them the tools to **understand it**, **improve it**, and **broadcast it**.

In a world where recruiters check GitHub, LinkedIn, and LeetCode before the resume, and where developer creators build audiences on X and Instagram to fund their projects, Synalytix is the command center that makes the fragmented digital life **visible, measurable, and actionable**.
