import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbService } from '../db';
import { User } from '../../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'dis-invitation-studio-secure-jwt-key-2026';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      businessName: user.businessName
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'] as string;
  }

  if (!token) {
    // Check if user session header exists (for backward compatibility during transitions)
    const userIdHeader = req.headers['x-user-id'] as string;
    if (userIdHeader) {
      const user = dbService.getUserById(userIdHeader);
      if (user && user.isActive) {
        req.user = user;
        return next();
      }
    }
    return res.status(401).json({ error: 'Unauthorized: Authentication token is required' });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication token' });
  }

  const user = dbService.getUserById(decoded.id);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User account no longer exists' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'Forbidden: Account has been deactivated by administrator' });
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in first' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Super Administrator privileges required' });
  }

  next();
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.id) {
      const user = dbService.getUserById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  }
  next();
}
