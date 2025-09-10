import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { z } from 'zod';

// Login request validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export class AuthController {
  /**
   * POST /api/auth/login
   * Authenticate admin user and return JWT token
   */
  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const validation = loginSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors
        });
      }

      const { username, password } = validation.data;

      // Attempt login
      const authResult = await authService.login({ username, password });

      if (!authResult) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        });
      }

      // Return success with token and user info
      return res.status(200).json({
        success: true,
        data: {
          token: authResult.token,
          user: authResult.user
        }
      });

    } catch (error) {
      console.error('Login controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error during login'
      });
    }
  }

  /**
   * POST /api/auth/verify
   * Verify JWT token and return user info
   */
  async verify(req: Request, res: Response) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const token = authHeader.substring(7);

      // Verify token
      const user = await authService.verifyToken(token);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }

      // Return user info
      return res.status(200).json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Token verification controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error during token verification'
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user (client-side token removal, server just confirms)
   */
  async logout(req: Request, res: Response) {
    try {
      // For JWT tokens, logout is primarily client-side (removing the token)
      // This endpoint just confirms the logout action
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error during logout'
      });
    }
  }
}

export const authController = new AuthController();