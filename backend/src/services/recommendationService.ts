import { supabase } from '../../lib/supabase';
import { Recommendation, CareerScore } from '../../types/recommendations';
import { v4 as uuidv4 } from 'uuid';

/**
 * RecommendationService
 * All Supabase CRUD for the recommendations feature.
 */
export const RecommendationService = {

  /** Insert a new recommendation run */
  async createRun(params: {
    userId: string;
    profileSnapshot: Record<string, unknown>;
    modelUsed: string;
    tokenCount?: number;
  }): Promise<string> {
    const id = uuidv4().replace(/-/g, '').slice(0, 25);
    const { error } = await supabase.from('recommendation_runs').insert({
      id,
      user_id: params.userId,
      profile_snapshot: params.profileSnapshot,
      model_used: params.modelUsed,
      token_count: params.tokenCount ?? null,
    });
    if (error) throw new Error(`Failed to create run: ${error.message}`);
    return id;
  },

  /** Bulk insert recommendations for a run */
  async createRecommendations(runId: string, userId: string, items: Omit<Recommendation, 'completedAt' | 'dismissedAt' | 'createdAt'>[]): Promise<Recommendation[]> {
    const rows = items.map(item => ({
      id: item.id,
      run_id: runId,
      user_id: userId,
      title: item.title,
      description: item.description,
      reason: item.reason,
      category: item.category,
      priority: item.priority,
      impact_score: item.impactScore,
      difficulty: item.difficulty,
      estimated_time: item.estimatedTime,
      expected_outcome: item.expectedOutcome,
      action_steps: item.actionSteps,
      data_sources: item.dataSources,
      confidence_score: item.confidenceScore,
    }));

    const { error } = await supabase.from('recommendations').insert(rows);
    if (error) throw new Error(`Failed to insert recommendations: ${error.message}`);

    // Return the full objects with timestamps
    return items.map(item => ({
      ...item,
      completedAt: null,
      dismissedAt: null,
      createdAt: new Date().toISOString(),
    }));
  },

  /** Upsert career score (latest only per user) */
  async upsertCareerScore(userId: string, scores: Omit<CareerScore, 'computedAt'>): Promise<void> {
    const id = uuidv4().replace(/-/g, '').slice(0, 25);
    const { error } = await supabase.from('career_scores').insert({
      id,
      user_id: userId,
      career: scores.career,
      employability: scores.employability,
      branding: scores.branding,
      technical: scores.technical,
    });
    if (error) throw new Error(`Failed to upsert career score: ${error.message}`);
  },

  /** Get the latest recommendation run with all its data */
  async getLatestRun(userId: string): Promise<{
    runId: string;
    recommendations: Recommendation[];
    scores: CareerScore | null;
    generatedAt: string;
  } | null> {
    // Get latest run
    const { data: run } = await supabase
      .from('recommendation_runs')
      .select('id, generated_at')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (!run) return null;

    // Get recommendations for this run
    const { data: recs } = await supabase
      .from('recommendations')
      .select('*')
      .eq('run_id', run.id)
      .order('impact_score', { ascending: false });

    // Get latest career score
    const { data: score } = await supabase
      .from('career_scores')
      .select('*')
      .eq('user_id', userId)
      .order('computed_at', { ascending: false })
      .limit(1)
      .single();

    return {
      runId: run.id,
      recommendations: (recs || []).map(mapDbToRecommendation),
      scores: score ? {
        career: score.career,
        employability: score.employability,
        branding: score.branding,
        technical: score.technical,
        computedAt: score.computed_at,
      } : null,
      generatedAt: run.generated_at,
    };
  },

  /** Mark a recommendation as complete */
  async markComplete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('recommendations')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(`Failed to mark complete: ${error.message}`);
  },

  /** Dismiss a recommendation */
  async dismiss(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('recommendations')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(`Failed to dismiss: ${error.message}`);
  },

  /** Check rate limit: returns true if user can generate */
  async checkRateLimit(userId: string, maxPerHour: number): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('recommendation_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('called_at', oneHourAgo);

    if (error) return false;
    return (count ?? 0) < maxPerHour;
  },

  /** Record a rate limit event */
  async recordRateLimitEvent(userId: string): Promise<void> {
    await supabase.from('recommendation_rate_limits').insert({
      user_id: userId,
    });
  },

  /** Get previous career score for delta calculation */
  async getPreviousScore(userId: string): Promise<CareerScore | null> {
    const { data } = await supabase
      .from('career_scores')
      .select('*')
      .eq('user_id', userId)
      .order('computed_at', { ascending: false })
      .limit(2);

    if (!data || data.length < 2) return null;

    const prev = data[1]; // second most recent
    return {
      career: prev.career,
      employability: prev.employability,
      branding: prev.branding,
      technical: prev.technical,
      computedAt: prev.computed_at,
    };
  },
};

/** Map a DB row to a Recommendation type (snake_case → camelCase) */
function mapDbToRecommendation(row: Record<string, unknown>): Recommendation {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    reason: row.reason as string,
    category: row.category as Recommendation['category'],
    priority: row.priority as Recommendation['priority'],
    impactScore: row.impact_score as number,
    difficulty: row.difficulty as Recommendation['difficulty'],
    estimatedTime: row.estimated_time as string,
    expectedOutcome: row.expected_outcome as string,
    actionSteps: row.action_steps as string[],
    dataSources: row.data_sources as string[],
    confidenceScore: row.confidence_score as number,
    completedAt: (row.completed_at as string) ?? null,
    dismissedAt: (row.dismissed_at as string) ?? null,
    createdAt: row.created_at as string,
  };
}
