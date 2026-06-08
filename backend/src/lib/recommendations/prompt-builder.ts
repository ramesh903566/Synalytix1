import { UnifiedUserProfile, RecommendationCategory } from '../../types/recommendations';

export function buildSystemPrompt(): string {
  return `You are a senior career intelligence AI embedded in Synalytix.
Your job is to analyse a developer's unified career profile and generate structured, actionable recommendations.

Rules:
- Respond ONLY with valid JSON. No preamble, no markdown, no explanation outside the JSON.
- Every recommendation must have a confidenceScore between 0.0 and 1.0.
- Discard any recommendation you are less than 70% confident about.
- Prioritise recommendations by real-world career ROI, not by what is easy to implement.
- Be specific: reference actual data points from the profile in the reason field.
- actionSteps must be concrete, imperative, time-bound tasks (not vague advice).
- The weeklyPlan must contain exactly 5 actions derived from CRITICAL and HIGH priority recommendations.
- The monthlyRoadmap must have exactly 4 weeks, each with a goal and 2–4 milestones.
- Generate 6–10 recommendations covering diverse categories.
- The scores object must contain career, employability, branding, and technical scores (0–100) based on the profile data.`;
}

export function buildUserPrompt(
  profile: UnifiedUserProfile,
  focusCategory?: RecommendationCategory
): string {
  const focusLine = focusCategory
    ? `\nFocus especially on the "${focusCategory}" category, but include other categories too.`
    : '';

  return `Analyse this career profile and return the full recommendation payload as JSON.
${focusLine}

Profile:
${JSON.stringify(profile, null, 2)}

Return a JSON object matching this EXACT structure (no extra keys, no missing keys):
{
  "recommendations": [
    {
      "title": "string (max 120 chars)",
      "description": "string (max 600 chars)",
      "reason": "string (max 400 chars, reference specific data)",
      "category": "CAREER_GROWTH" | "PERSONAL_BRANDING" | "TECHNICAL_SKILLS" | "NETWORKING" | "OPEN_SOURCE" | "ENTREPRENEURSHIP",
      "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "impactScore": 0-100,
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "estimatedTime": "e.g. 3 hours, 2 days",
      "expectedOutcome": "string",
      "actionSteps": ["step1", "step2", ...],
      "dataSources": ["github", "leetcode", ...],
      "confidenceScore": 0.0-1.0
    }
  ],
  "scores": {
    "career": 0-100,
    "employability": 0-100,
    "branding": 0-100,
    "technical": 0-100
  },
  "weeklyPlan": ["action1", "action2", "action3", "action4", "action5"],
  "monthlyRoadmap": [
    { "week": 1, "goal": "string", "milestones": ["m1", "m2"] },
    { "week": 2, "goal": "string", "milestones": ["m1", "m2"] },
    { "week": 3, "goal": "string", "milestones": ["m1", "m2"] },
    { "week": 4, "goal": "string", "milestones": ["m1", "m2"] }
  ],
  "gaps": {
    "skills": ["skill1", "skill2"],
    "assets": ["asset1", "asset2"],
    "activities": ["activity1", "activity2"]
  },
  "opportunityAlerts": [
    {
      "title": "string",
      "description": "string",
      "trigger": "string (e.g. github_commits_up_30pct)"
    }
  ]
}`;
}
