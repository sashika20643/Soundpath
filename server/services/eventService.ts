import { storage } from "../storage";
import { CustomError } from "../middlewares/errorHandler";
import type { InsertEvent, UpdateEvent, Event } from "@shared/schema";

export class EventService {
  async getAllEvents(filters?: { 
    continent?: string; 
    country?: string; 
    city?: string; 
    genreIds?: string[]; 
    settingIds?: string[]; 
    eventTypeIds?: string[]; 
    tags?: string[]; 
    search?: string; 
    approved?: boolean;
  }): Promise<Event[]> {
    try {
      return await storage.getEvents(filters);
    } catch (error) {
      throw new CustomError("Failed to fetch events", 500);
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const event = await storage.getEvent(id);
      if (!event) {
        throw new CustomError("Event not found", 404);
      }
      return event;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to fetch event", 500);
    }
  }

  async createEvent(eventData: InsertEvent, approved: boolean = false): Promise<Event> {
    try {
      // Check if event with same title already exists
      const existingEvents = await storage.getEvents({
        search: eventData.title,
      });
      
      const duplicate = existingEvents.find(
        event => event.title.toLowerCase() === eventData.title.toLowerCase()
      );
      
      if (duplicate) {
        throw new CustomError(
          `An event with the title "${eventData.title}" already exists`,
          409
        );
      }

      return await storage.createEvent(eventData, approved);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to create event", 500);
    }
  }

  async updateEvent(id: string, eventData: Partial<UpdateEvent>): Promise<Event> {
    try {
      // Check if event exists
      const existingEvent = await storage.getEvent(id);
      if (!existingEvent) {
        throw new CustomError("Event not found", 404);
      }

      // Check for title conflicts if title is being updated
      if (eventData.title) {
        const allEvents = await storage.getEvents();
        
        const duplicate = allEvents.find(
          event => event.id !== id && event.title.toLowerCase() === eventData.title!.toLowerCase()
        );
        
        if (duplicate) {
          throw new CustomError(
            `An event with the title "${eventData.title}" already exists`,
            409
          );
        }
      }

      const updatedEvent = await storage.updateEvent(id, eventData);
      if (!updatedEvent) {
        throw new CustomError("Failed to update event", 500);
      }

      return updatedEvent;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to update event", 500);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const event = await storage.getEvent(id);
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      const deleted = await storage.deleteEvent(id);
      if (!deleted) {
        throw new CustomError("Failed to delete event", 500);
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to delete event", 500);
    }
  }

  async approveEvent(id: string, approved: boolean): Promise<Event> {
    try {
      const event = await storage.getEvent(id);
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      const approvedEvent = await storage.approveEvent(id, approved);
      if (!approvedEvent) {
        throw new CustomError("Failed to approve event", 500);
      }

      return approvedEvent;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to approve event", 500);
    }
  }
}

export const eventService = new EventService();