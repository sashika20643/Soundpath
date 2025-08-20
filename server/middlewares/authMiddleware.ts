
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { ResponseFormatter } from '../utils/responseFormatter';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json(ResponseFormatter.error('Access token required'));
      return;
    }

    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json(ResponseFormatter.error('Invalid or expired token'));
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json(ResponseFormatter.error('Admin access required'));
    return;
  }
  next();
};
