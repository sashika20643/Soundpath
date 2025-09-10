import { Request, Response, NextFunction } from 'express';
import { authService, AuthUser } from '../services/authService';

// Type for admin session data
interface AdminSession {
  isAdmin: boolean;
  user: AuthUser;
  loginTime: number;
}

// Extend Express Request to include admin session
declare global {
  namespace Express {
    interface Request {
      adminSession?: AdminSession;
    }
  }
}

/**
 * Middleware to check for admin authentication
 * Validates JWT token from Authorization header against database
 */
export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid admin token.'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);
    
    // Verify token using AuthService
    const user = await authService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired admin token. Please log in again.'
      });
    }

    // Add admin session info to request
    req.adminSession = {
      isAdmin: true,
      user,
      loginTime: Date.now()
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed'
    });
  }
}

/**
 * Optional middleware for admin endpoints that provides admin info but doesn't require auth
 */
export async function optionalAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Try to verify token but don't fail if invalid
      const user = await authService.verifyToken(token);
      
      if (user) {
        req.adminSession = {
          isAdmin: true,
          user,
          loginTime: Date.now()
        };
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if auth check fails
  }
}