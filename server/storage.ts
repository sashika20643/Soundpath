import {
  users,
  categories,
  events,
  contactMessages,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type UpdateCategory,
  type Event,
  type InsertEvent,
  type UpdateEvent,
  type ApproveEvent,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(filters?: {
    type?: string;
    search?: string;
  }): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(
    id: string,
    category: Partial<UpdateCategory>,
  ): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Event methods
  getEvents(filters?: {
    continent?: string;
    country?: string;
    city?: string;
    genreIds?: string[];
    settingIds?: string[];
    eventTypeIds?: string[];
    tags?: string[];
    search?: string;
    approved?: string;
    featured?: string;
  }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent, approved?: boolean): Promise<Event>;
  updateEvent(
    id: string,
    event: Partial<UpdateEvent>,
  ): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  approveEvent(id: string, approved: boolean): Promise<Event | undefined>;

  // Contact message methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getCategories(filters?: {
    type?: string;
    search?: string;
  }): Promise<Category[]> {
    let query = db.select().from(categories);

    const conditions = [];

    if (filters?.type) {
      conditions.push(eq(categories.type, filters.type));
    }

    if (filters?.search) {
      conditions.push(like(categories.name, `%${filters.search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(categories.createdAt));
    return result;
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newCategory;
  }

  async updateCategory(
    id: string,
    categoryUpdate: Partial<UpdateCategory>,
  ): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...categoryUpdate,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Event methods
  async getEvents(filters?: {
    continent?: string;
    country?: string;
    city?: string;
    genreIds?: string[];
    settingIds?: string[];
    eventTypeIds?: string[];
    tags?: string[];
    search?: string;
    approved?: string;
    featured?: string;
  }): Promise<Event[]> {
    try {
      let eventsQuery = db.select().from(events);

      const conditions = [];
      console.log("Filtering for ", filters?.approved);

      // Filter by approval status
      if (filters?.approved !== undefined) {
        console.log("Filtering for ", filters.approved);
        console.log("Filtering for ", filters.approved);
        if (filters.approved === 'true') {
          console.log("Filtering for approved ones boolean");
          eventsQuery = eventsQuery.where(eq(events.approved, true));
        } else if (filters.approved === 'false') {
          console.log("Filtering for approved ones boolean");
          eventsQuery = eventsQuery.where(eq(events.approved, false));
        }
      }

      if (filters?.featured !== undefined) {
        console.log("Filtering for featured events: ", filters.featured);
        if (filters.featured === 'true') {
          eventsQuery = eventsQuery.where(eq(events.featured, true));
        } else if (filters.featured === 'false') {
          eventsQuery = eventsQuery.where(eq(events.featured, false));
        }
      }

      if (filters?.continent) {
        conditions.push(eq(events.continent, filters.continent));
      }

      if (filters?.country) {
        conditions.push(eq(events.country, filters.country));
      }

      if (filters?.city) {
        conditions.push(eq(events.city, filters.city));
      }

      if (filters?.search) {
        conditions.push(like(events.title, `%${filters.search}%`));
      }

      if (filters?.genreIds && filters.genreIds.length > 0) {
        const genreIds = filters.genreIds.map(id => `'${id}'`).join(',');
        conditions.push(sql`${events.genreIds} @> ARRAY[${sql.raw(genreIds)}]::text[]`);
      }

      if (filters?.settingIds && filters.settingIds.length > 0) {
        const settingIds = filters.settingIds.map(id => `'${id}'`).join(',');
        conditions.push(sql`${events.settingIds} @> ARRAY[${sql.raw(settingIds)}]::text[]`);
      }

      if (filters?.eventTypeIds && filters.eventTypeIds.length > 0) {
        const eventTypeIds = filters.eventTypeIds.map(id => `'${id}'`).join(',');
        conditions.push(sql`${events.eventTypeIds} @> ARRAY[${sql.raw(eventTypeIds)}]::text[]`);
      }

      if (filters?.tags && filters.tags.length > 0) {
        // Use overlap operator (&&) to check if any of the filter tags exist in the event tags
        // This handles case-insensitive matching by converting both sides to lowercase
        const tagConditions = filters.tags.map(tag =>
          sql`EXISTS (
            SELECT 1 FROM unnest(${events.tags}) AS event_tag
            WHERE LOWER(event_tag) = LOWER(${tag})
          )`
        );
        conditions.push(sql`(${sql.join(tagConditions, sql` OR `)})`);
      }

      if (conditions.length > 0) {
        eventsQuery = eventsQuery.where(and(...conditions)) as any;
      }

      const result = await eventsQuery.orderBy(desc(events.createdAt));

      return result;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(eventData: InsertEvent, approved: boolean = false): Promise<Event> {
    try {
      const id = randomUUID();
      const now = new Date().toISOString();

      const [created] = await db
        .insert(events)
        .values({
          ...eventData,
          id,
          approved,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return created;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async updateEvent(
    id: string,
    eventUpdate: Partial<UpdateEvent>,
  ): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set({
        ...eventUpdate,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  async approveEvent(
    id: string,
    approved: boolean,
  ): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set({
        approved,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    const result = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return result;
  }

  async createContactMessage(
    contactMessage: InsertContactMessage,
  ): Promise<ContactMessage> {
    const [newContactMessage] = await db
      .insert(contactMessages)
      .values({
        ...contactMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newContactMessage;
  }
}

export const storage = new DatabaseStorage();