import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
}

export interface AuthToken {
  token: string;
  user: AuthUser;
}

export class AuthService {
  /**
   * Authenticate user with username and password
   * Returns JWT token if successful, null if failed
   */
  async login(credentials: LoginCredentials): Promise<AuthToken | null> {
    try {
      // Find user by username
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, credentials.username))
        .limit(1);

      if (!user) {
        console.log(`❌ Login failed: User '${credentials.username}' not found`);
        return null;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      
      if (!isPasswordValid) {
        console.log(`❌ Login failed: Invalid password for user '${credentials.username}'`);
        return null;
      }

      // Create JWT token
      const tokenPayload = {
        id: user.id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000)
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      console.log(`✅ Login successful for user '${credentials.username}'`);

      return {
        token,
        user: {
          id: user.id,
          username: user.username
        }
      };

    } catch (error) {
      console.error('❌ Authentication error:', error);
      return null;
    }
  }

  /**
   * Verify JWT token and return user info
   * Returns user info if token is valid, null if invalid
   */
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (!decoded || !decoded.id || !decoded.username) {
        // Token has invalid structure - this is normal for expired/malformed tokens
        return null;
      }

      // Verify user still exists in database
      const [user] = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);

      if (!user) {
        console.log(`❌ Token verification failed: User with ID ${decoded.id} not found`);
        return null;
      }

      return {
        id: user.id,
        username: user.username
      };

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        // Token invalid/expired - this is normal behavior, no need to log
        return null;
      } else {
        console.error('❌ Token verification error:', error);
      }
      return null;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<AuthUser | null> {
    try {
      const [user] = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return user || null;
    } catch (error) {
      console.error('❌ Get user error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();