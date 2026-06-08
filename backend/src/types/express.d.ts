import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        org_id?: string;
      };
    }
  }
}
