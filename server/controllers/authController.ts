
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
