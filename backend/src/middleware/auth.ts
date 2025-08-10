import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AuthUser {
  id: string;
  organizationId: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: { message: 'Unauthorized' } });
  const token = header.substring(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as any;
    req.user = {
      id: payload.sub,
      organizationId: payload.org,
      roles: payload.roles || []
    };
    next();
  } catch {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
}

export function requireRoles(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles = req.user?.roles || [];
    if (allowed.some(r => roles.includes(r))) return next();
    return res.status(403).json({ error: { message: 'Forbidden' } });
  };
}