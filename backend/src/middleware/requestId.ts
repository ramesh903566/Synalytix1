import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

export function requestId(req: Request, res: Response, next: NextFunction) {
  (req as any).id = nanoid();
  res.setHeader('X-Request-Id', (req as any).id);
  next();
}
