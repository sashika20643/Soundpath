import { Request, Response, NextFunction } from 'express';

// Simple admin credentials (in production, this should be in environment variables)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Type for admin session data
interface AdminSession {
  isAdmin: boolean;
  username: string;
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
 * Validates the admin token from Authorization header
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
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
    
    // For simplicity, we'll use a basic token validation
    // In production, this should be a proper JWT or session validation
    if (token !== 'authenticated') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin token. Please log in again.'
      });
    }

    // Add admin session info to request
    req.adminSession = {
      isAdmin: true,
      username: ADMIN_CREDENTIALS.username,
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
export function optionalAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token === 'authenticated') {
        req.adminSession = {
          isAdmin: true,
          username: ADMIN_CREDENTIALS.username,
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