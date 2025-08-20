import {
  users,
  categories,
  events,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type UpdateCategory,
  type Event,
  type InsertEvent,
  type UpdateEvent,
  type ApproveEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc } from "drizzle-orm";

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
  }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent, approved?: boolean): Promise<Event>;
  updateEvent(
    id: string,
    event: Partial<UpdateEvent>,
  ): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  approveEvent(id: string, approved: boolean): Promise<Event | undefined>;
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
    approved?: any;
  }): Promise<Event[]> {
    let query = db.select().from(events);

    const conditions = [];
    console.log("Filtering for ", filters?.approved);

    const approvedRaw = filters?.approved;
    if (filters?.approved == true || filters?.approved == undefined) {
      console.log("Filtering for approved ones", typeof approvedRaw);
      conditions.push(eq(events.approved, true));
    }
    if (filters?.approved == false) {
      console.log("Filtering for approved ones", typeof approvedRaw);
      conditions.push(eq(events.approved, false));
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

    // Note: For array filtering (genreIds, settingIds, eventTypeIds, tags),
    // we'd need to use PostgreSQL array functions for proper filtering
    // For now, we'll implement basic filtering and enhance later

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(events.createdAt));
    return result;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(
    event: InsertEvent,
    approved: boolean = false,
  ): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values({
        ...event,
        approved,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newEvent;
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
}

export const storage = new DatabaseStorage();