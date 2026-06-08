import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { generateRecommendations, EngineError } from '../lib/recommendations/engine';
import { RecommendationService } from '../services/recommendationService';
import { GenerateRecommendationsInputSchema } from '../types/recommendations';
import { RATE_LIMIT_HOURLY } from '../lib/recommendations/constants';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/recommendations/generate
//  Generate a new set of AI-powered recommendations
// ═══════════════════════════════════════════════════════════════════════════

router.post('/generate', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    // 1. Parse and validate input
    const parseResult = GenerateRecommendationsInputSchema.safeParse(req.body || {});
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: parseResult.error.message },
      });
      return;
    }
    const { forceRefresh, focusCategory } = parseResult.data;

    // 2. Check rate limit
    const canGenerate = await RecommendationService.checkRateLimit(userId, RATE_LIMIT_HOURLY);
    if (!canGenerate) {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `You can generate at most ${RATE_LIMIT_HOURLY} recommendation sets per hour. Please wait and try again.`,
        },
      });
      return;
    }

    // 3. Record rate limit event
    await RecommendationService.recordRateLimitEvent(userId);

    // 4. Run the engine
    const result = await generateRecommendations(userId, { forceRefresh, focusCategory });

    res.json(result);
  } catch (err) {
    if (err instanceof EngineError) {
      const statusCode = err.code === 'NO_PLATFORMS' ? 422 : 500;
      res.status(statusCode).json({
        success: false,
        error: { code: err.code, message: err.message },
      });
      return;
    }
    console.error('[Recommendations] Generate error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'ENGINE_ERROR', message: (err as Error).message },
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  GET /api/recommendations/history
//  Get the latest recommendation run for the authenticated user
// ═══════════════════════════════════════════════════════════════════════════

router.get('/history', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const latestRun = await RecommendationService.getLatestRun(userId);

    if (!latestRun) {
      res.json({
        success: true,
        data: null,
        message: 'No recommendations generated yet.',
      });
      return;
    }

    // Get previous score for delta calculation
    const previousScore = await RecommendationService.getPreviousScore(userId);

    res.json({
      success: true,
      data: {
        ...latestRun,
        previousScores: previousScore,
      },
    });
  } catch (err) {
    console.error('[Recommendations] History error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: (err as Error).message },
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  PATCH /api/recommendations/:id/complete
//  Mark a recommendation as completed
// ═══════════════════════════════════════════════════════════════════════════

router.patch('/:id/complete', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;
  const recId = req.params.id;

  try {
    await RecommendationService.markComplete(recId, userId);
    res.json({ success: true, message: 'Recommendation marked as complete.' });
  } catch (err) {
    console.error('[Recommendations] Complete error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: (err as Error).message },
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  PATCH /api/recommendations/:id/dismiss
//  Dismiss a recommendation
// ═══════════════════════════════════════════════════════════════════════════

router.patch('/:id/dismiss', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;
  const recId = req.params.id;

  try {
    await RecommendationService.dismiss(recId, userId);
    res.json({ success: true, message: 'Recommendation dismissed.' });
  } catch (err) {
    console.error('[Recommendations] Dismiss error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: (err as Error).message },
    });
  }
});

export default router;
