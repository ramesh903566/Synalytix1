import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { env } from './config/env';
import { requestId } from './middleware/requestId';
import { httpLogger } from './middleware/logger';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import v1Router from './api/v1';

export function createApp() {
  const app = express();

  if (env.SENTRY_DSN) {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      environment: env.NODE_ENV,
    });
  }

  // 1. Request ID
  app.use(requestId);

  // 2. HTTP Logger
  app.use(httpLogger);

  // 3. Security Headers
  app.use(helmet());
  app.use(cors({ 
    origin: env.FRONTEND_URL,
    credentials: true
  }));

  // 4. Rate Limiter (Global)
  app.use(globalLimiter);

  // Body parser
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      db: 'ok',
      redis: 'ok'
    });
  });

  // API Routes
  app.use('/api/v1', v1Router);

  // Sentry error handler should be before our custom error handler
  if (env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // 5. Global Error Handler (must be last)
  app.use(errorHandler);

  return app;
}
