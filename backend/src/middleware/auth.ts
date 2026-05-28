import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 *
 * Every protected route passes through this middleware.
 * It reads the Authorization header, verifies the JWT that Supabase
 * issued when the user logged in on your frontend, and attaches
 * the user's ID to req.userId so route handlers can use it.
 *
 * Your frontend sends requests like:
 *   fetch('/api/data/github/profile', {
 *     headers: { Authorization: `Bearer ${supabase.auth.session()?.access_token}` }
 *   })
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  // 1. Get the Authorization header or query string token
  let token = '';

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    // Fallback for browser redirects where headers can't be set
    token = req.query.token;
  }

  if (!token) {
    console.error('[Auth] No token found in request. Headers:', req.headers.authorization ? 'present' : 'missing', 'Query:', req.query.token ? 'present' : 'missing');
    res.status(401).json({
      success: false,
      error: 'Missing or invalid Authorization token.',
    });
    return;
  }

  console.log('[Auth] Token received, first 20 chars:', token.substring(0, 20), '... length:', token.length);

  // 3. Verify the JWT using Supabase's JWT secret
  // This confirms the token was issued by YOUR Supabase project
  try {
    const secret = process.env.JWT_SECRET!;
    let decoded: jwt.JwtPayload | null = null;

    // Try verifying with the raw string first (Supabase default)
    try {
      decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as jwt.JwtPayload;
    } catch {
      // If raw string fails, try base64-decoded buffer
      try {
        const secretBuffer = Buffer.from(secret, 'base64');
        decoded = jwt.verify(token, secretBuffer, { algorithms: ['HS256'] }) as jwt.JwtPayload;
      } catch (e2: any) {
        console.error('[Auth] JWT verification failed with both methods:', e2.message);
        // Log token header for debugging (safe — no secret data)
        const parts = token.split('.');
        if (parts.length === 3) {
          const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
          console.error('[Auth] Token header:', header);
          console.error('[Auth] JWT_SECRET length:', secret.length);
        }
        throw e2;
      }
    }

    // 4. Attach user ID to request — all route handlers use this
    req.userId = decoded.sub; // Supabase puts user UUID in 'sub' claim
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired. Please sign in again.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token. Please sign in again.',
      });
      return;
    }

    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}

/**
 * Optional auth — doesn't block the request if no token,
 * but attaches userId if token is valid. Useful for public endpoints
 * that behave differently for logged-in users.
 */
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = Buffer.from(process.env.JWT_SECRET!, 'base64');
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }) as jwt.JwtPayload;
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
  } catch {
    // Token invalid — just continue without userId
  }

  next();
}
