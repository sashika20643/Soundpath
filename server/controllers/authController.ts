
import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { ResponseFormatter } from "../utils/responseFormatter";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await authService.authenticateUser(req.body);
      
      res.json(
        ResponseFormatter.success(
          { user, token },
          "Login successful"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.createUser(req.body);
      
      res.status(201).json(
        ResponseFormatter.success(user, "User created successfully")
      );
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json(ResponseFormatter.error("Not authenticated"));
        return;
      }

      const user = await authService.getUserById(userId);
      
      if (!user) {
        res.status(404).json(ResponseFormatter.error("User not found"));
        return;
      }

      res.json(ResponseFormatter.success(user, "User retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { ResponseFormatter } from "../utils/responseFormatter";
import { CustomError } from "../middlewares/errorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        throw new CustomError("Invalid credentials", 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new CustomError("Account is disabled", 401);
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new CustomError("Invalid credentials", 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user info and token (exclude password hash)
      const { passwordHash, ...userWithoutPassword } = user;

      res.json(
        ResponseFormatter.success(
          { user: userWithoutPassword, token },
          "Login successful"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        throw new CustomError("Access token required", 401);
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await storage.getUserById(decoded.userId);

      if (!user || !user.isActive) {
        throw new CustomError("Invalid or expired token", 401);
      }

      const { passwordHash, ...userWithoutPassword } = user;

      res.json(
        ResponseFormatter.success(
          { user: userWithoutPassword, valid: true },
          "Token is valid"
        )
      );
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new CustomError("Invalid token", 401));
      } else {
        next(error);
      }
    }
  }
}

export const authController = new AuthController();
