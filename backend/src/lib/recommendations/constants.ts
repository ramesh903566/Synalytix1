export const CONFIDENCE_THRESHOLD = 0.70;
export const CACHE_TTL_SECONDS = 3600;
export const RATE_LIMIT_PER_HOUR = 10;
export const AI_MAX_TOKENS = 4000;
export const AI_TEMPERATURE = 0.4;

// ─── Scoring weights (all weights in a group must sum to 1.0) ─────────────────

export const GITHUB_WEIGHTS = {
  commitStreakDays: 0.25,       // 30+ day streak = 25 pts
  repoCount: 0.15,              // 20+ repos = 15 pts
  hasReadmeOnAll: 0.15,         // boolean gate: all or nothing
  languageDiversity: 0.20,      // 1 lang=5pts, 2=10pts, 3+=20pts
  openSourceContribs: 0.15,     // 10+ external PRs merged = 15pts
  lastCommitRecency: 0.10,      // 0 days=10pts, 30+ days=0pts
} as const;

export const LEETCODE_WEIGHTS = {
  problemsSolved: 0.30,         // 300+ = 30pts
  hardRatio: 0.25,              // ≥20% hard = 25pts
  contestParticipation: 0.20,   // any contest = 10pts, top 25% = 20pts
  streakDays: 0.15,             // 30+ day = 15pts
  acceptanceRate: 0.10,         // ≥55% = 10pts
} as const;

export const LINKEDIN_WEIGHTS = {
  profileCompleteness: 0.30,    // % of sections filled
  postFrequencyPerMonth: 0.25,  // 4+ posts/month = 25pts
  followerGrowthRate: 0.20,     // >5%/month = 20pts
  engagementRate: 0.15,         // >3% avg = 15pts
  hasAboutSection: 0.10,        // boolean gate
} as const;

export const X_WEIGHTS = {
  postFrequency: 0.35,          // 7+ posts/week = 35pts
  followerGrowthRate: 0.25,     // >3%/month = 25pts
  engagementRate: 0.25,         // >2% = 25pts
  hasBio: 0.15,                 // boolean gate
} as const;

// ─── Career score composite weights ───────────────────────────────────────────

export const CAREER_SCORE_COMPOSITE = {
  github: 0.30,
  leetcode: 0.25,
  linkedin: 0.30,
  x: 0.15,
} as const;

export const EMPLOYABILITY_COMPOSITE = {
  github: 0.35,
  leetcode: 0.35,
  linkedin: 0.20,
  x: 0.10,
} as const;

export const BRANDING_COMPOSITE = {
  linkedin: 0.55,
  x: 0.30,
  github: 0.15,
} as const;

export const TECHNICAL_COMPOSITE = {
  leetcode: 0.45,
  github: 0.45,
  x: 0.10,
} as const;

// ─── Labels ───────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  CAREER_GROWTH: "Career Growth",
  PERSONAL_BRANDING: "Personal Branding",
  TECHNICAL_SKILLS: "Technical Skills",
  NETWORKING: "Networking",
  OPEN_SOURCE: "Open Source",
  ENTREPRENEURSHIP: "Entrepreneurship",
};

export const PRIORITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};
