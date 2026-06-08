import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // In a real app this would verify JWT from Authorization header
  // For the sake of this prompt, we simulate a logged-in user
  req.user = {
    id: "user-123",
    org_id: "org-123",
  };
  next();
}
