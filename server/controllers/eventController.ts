import { Request, Response, NextFunction } from "express";
import { eventService } from "../services/eventService";
import { ResponseFormatter } from "../utils/responseFormatter";

export class EventController {
  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { continent, country, city, genreIds, settingIds, eventTypeIds, tags, search } = req.query as { 
        continent?: string; 
        country?: string; 
        city?: string; 
        genreIds?: string[]; 
        settingIds?: string[]; 
        eventTypeIds?: string[]; 
        tags?: string[]; 
        search?: string; 
      };
      
      const events = await eventService.getAllEvents({ 
        continent, 
        country, 
        city, 
        genreIds, 
        settingIds, 
        eventTypeIds, 
        tags, 
        search 
      });
      
      res.json(ResponseFormatter.success(events, "Events retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      
      res.json(ResponseFormatter.success(event, "Event retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.createEvent(req.body);
      
      res.status(201).json(ResponseFormatter.success(event, "Event created successfully"));
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.updateEvent(id, req.body);
      
      res.json(ResponseFormatter.success(event, "Event updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await eventService.deleteEvent(id);
      
      res.json(ResponseFormatter.success(null, "Event deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();