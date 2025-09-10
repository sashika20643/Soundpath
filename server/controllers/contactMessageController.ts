import type { Request, Response } from "express";
import { storage } from "../storage";
import { insertContactMessageSchema } from "@shared/schema";

export class ContactMessageController {
  async getContactMessages(req: Request, res: Response) {
    try {
      const contactMessages = await storage.getContactMessages();
      res.json({ success: true, data: contactMessages });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch contact messages" 
      });
    }
  }

  async createContactMessage(req: Request, res: Response) {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const newContactMessage = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, data: newContactMessage });
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create contact message" 
      });
    }
  }
}

export const contactMessageController = new ContactMessageController();