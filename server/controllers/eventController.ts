import { Request, Response, NextFunction } from "express";
import { eventService } from "../services/eventService";
import { ResponseFormatter } from "../utils/responseFormatter";

export class EventController {
  async getEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        continent,
        country,
        city,
        genreIds,
        settingIds,
        eventTypeIds,
        tags,
        search,
        approved,
      } = req.query as {
        continent?: string;
        country?: string;
        city?: string;
        genreIds?: string[];
        settingIds?: string[];
        eventTypeIds?: string[];
        tags?: string[];
        search?: string;
        approved?: string;
      };

      const events = await eventService.getAllEvents({
        continent,
        country,
        city,
        genreIds,
        settingIds,
        eventTypeIds,
        tags,
        search,
        approved,
      });

      res.json(
        ResponseFormatter.success(events, "Events retrieved successfully"),
      );
    } catch (error) {
      next(error);
    }
  }

  async getEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);

      res.json(
        ResponseFormatter.success(event, "Event retrieved successfully"),
      );
    } catch (error) {
      next(error);
    }
  }

  async createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Check if this is from dashboard (approved=true) or home page (approved=false)
      console.log("Request body:", req.body);
      console.log("fromDashboard property:", req.body.fromDashboard);
      console.log("fromDashboard type:", typeof req.body.fromDashboard);
      
      const isFromDashboard = req.body.fromDashboard === true;
      console.log("isFromDashboard computed value:", isFromDashboard);
      
      // Events from dashboard should be automatically approved
      const approved = isFromDashboard;
      console.log("Final approved status:", approved);
      
      const event = await eventService.createEvent(req.body, approved);

      res
        .status(201)
        .json(ResponseFormatter.success(event, "Event created successfully"));
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.updateEvent(id, req.body);

      res.json(ResponseFormatter.success(event, "Event updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      await eventService.deleteEvent(id);

      res.json(ResponseFormatter.success(null, "Event deleted successfully"));
    } catch (error) {
      next(error);
    }
  }

  async approveEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { approved } = req.body;
      const event = await eventService.approveEvent(id, approved);

      res.json(
        ResponseFormatter.success(
          event,
          `Event ${approved ? "approved" : "rejected"} successfully`,
        ),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
