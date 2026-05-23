import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../lib/redis';

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(args[0]!, ...args.slice(1)) as any,
  }),
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 10 requests per minute per IP for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(args[0]!, ...args.slice(1)) as any,
  }),
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 requests per minute per user for AI routes
  keyGenerator: (req) => {
    if (req.user?.id) return req.user.id;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    return Array.isArray(ip) ? ip[0] : ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(args[0]!, ...args.slice(1)) as any,
  }),
});
