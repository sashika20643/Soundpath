
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, users } from '../db';
import { eq } from 'drizzle-orm';
import { InsertUser, SelectUser, LoginRequest } from '@shared/schema';
import { CustomError } from '../utils/responseFormatter';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const SALT_ROUNDS = 12;

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: SelectUser): string {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new CustomError('Invalid token', 401);
    }
  }

  async createUser(userData: InsertUser): Promise<SelectUser> {
    try {
      // Check if username already exists
      const existingUser = await db.select().from(users).where(eq(users.username, userData.username));
      if (existingUser.length > 0) {
        throw new CustomError('Username already exists', 400);
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password);

      // Insert user
      const [newUser] = await db.insert(users).values({
        username: userData.username,
        email: userData.email,
        passwordHash,
        role: userData.role || 'user',
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

      return newUser;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError('Failed to create user', 500);
    }
  }

  async authenticateUser(loginData: LoginRequest): Promise<{ user: SelectUser; token: string }> {
    try {
      // Find user by username
      const [user] = await db.select().from(users).where(eq(users.username, loginData.username));
      
      if (!user) {
        throw new CustomError('Invalid username or password', 401);
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(loginData.password, user.passwordHash);
      
      if (!isValidPassword) {
        throw new CustomError('Invalid username or password', 401);
      }

      // Generate token
      const token = this.generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as 'admin' | 'user',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role as 'admin' | 'user',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError('Authentication failed', 500);
    }
  }

  async getUserById(id: string): Promise<SelectUser | null> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as 'admin' | 'user',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      throw new CustomError('Failed to get user', 500);
    }
  }
}

export const authService = new AuthService();
