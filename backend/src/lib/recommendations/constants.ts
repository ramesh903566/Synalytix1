// ═══════════════════════════════════════════════════════════════════════════
// Recommendation Engine Constants
// ═══════════════════════════════════════════════════════════════════════════

export const GITHUB_SCORE_WEIGHTS = {
  commitStreakDays: 0.25,
  repoCount: 0.15,
  hasReadmeOnAll: 0.15,
  topLanguagesDiversity: 0.20,
  openSourceContributions: 0.15,
  lastCommitRecency: 0.10,
};

export const LEETCODE_SCORE_WEIGHTS = {
  problemsSolved: 0.30,
  hardRatio: 0.25,
  contestParticipation: 0.20,
  streakDays: 0.15,
  acceptanceRate: 0.10,
};

export const LINKEDIN_SCORE_WEIGHTS = {
  profileCompleteness: 0.30,
  postFrequencyPerMonth: 0.25,
  followerGrowthRate: 0.20,
  engagementRate: 0.15,
  hasAboutSection: 0.10,
};

export const CONFIDENCE_THRESHOLD = 0.70;

export const CACHE_TTL_SECONDS = 3600;

/** How long (in minutes) to cache recommendations in the api_cache table */
export const CACHE_TTL_MINUTES = 60;

export const RATE_LIMIT_HOURLY = 10;

export const CATEGORY_LABELS: Record<string, string> = {
  CAREER_GROWTH: 'Career Growth',
  PERSONAL_BRANDING: 'Personal Branding',
  TECHNICAL_SKILLS: 'Technical Skills',
  NETWORKING: 'Networking',
  OPEN_SOURCE: 'Open Source',
  ENTREPRENEURSHIP: 'Entrepreneurship',
};

export const PRIORITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};
