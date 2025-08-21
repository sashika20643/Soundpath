import { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chatService";
import { ResponseFormatter } from "../utils/responseFormatter";

export class ChatController {
  async chatWithEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userQuery, limit } = req.body as { userQuery: string; limit?: number };

      const answer = await chatService.getChatResponse(userQuery, limit);

      res.json(ResponseFormatter.success(answer, "Chat response generated successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
