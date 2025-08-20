import {
  pgTable,
  text,
  serial,
  timestamp,
  uuid,
  index,
  boolean,
  real,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Database tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  type: z.enum(["genre", "setting", "eventType"], {
    required_error: "Please select a category type",
  }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCategorySchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  type: z.enum(["genre", "setting", "eventType"], {
    required_error: "Please select a category type",
  }),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const selectCategorySchema = createSelectSchema(categories);

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpdateUser = Partial<InsertUser> & { id: string };

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type UpdateCategory = Partial<InsertCategory> & { id: string };

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type UpdateEvent = Partial<InsertEvent> & { id: string };

export type EventCategory = typeof eventCategories.$inferSelect;

// Validation schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const updateUserSchema = createSelectSchema(users).partial().required({ id: true });
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertCategorySchema = createInsertSchema(categories);
export const updateCategorySchema = createSelectSchema(categories).partial().required({ id: true });

// Events table
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    heroImage: text("hero_image"),
    shortDescription: text("short_description").notNull(),
    longDescription: text("long_description").notNull(),
    date: text("date").notNull(), // ISO date string (YYYY-MM-DD)
    tags: text("tags").array(),
    instagramLink: text("instagram_link"),
    continent: text("continent"),
    country: text("country"),
    city: text("city"),
    latitude: real("latitude"),
    longitude: real("longitude"),
    locationName: text("location_name"),
    genreIds: text("genre_ids").array(),
    settingIds: text("setting_ids").array(),
    eventTypeIds: text("event_type_ids").array(),
    approved: boolean("approved").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Index on date for efficient sorting
    dateIdx: index("events_date_idx").on(table.date),
  }),
);

export const insertEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  shortDescription: z.string().min(1, "Short description is required").max(500),
  longDescription: z.string().min(1, "Long description is required"),
  heroImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  continent: z.string().min(1, "Continent is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  locationName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  date: z.string().min(1, "Date is required"),
  instagramLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  genreIds: z.array(z.string()).default([]),
  settingIds: z.array(z.string()).default([]),
  eventTypeIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  fromDashboard: z.boolean().optional(),
});

export const updateEventSchema = createInsertSchema(events, {
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(500, "Short description must be less than 500 characters"),
  longDescription: z
    .string()
    .min(20, "Long description must be at least 20 characters"),
  heroImage: z.string().url("Must be a valid URL").optional(),
  instagramLink: z.string().url("Must be a valid Instagram URL").optional(),
  tags: z.array(z.string()).optional(),
  continent: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  locationName: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
  settingIds: z.array(z.string()).optional(),
  eventTypeIds: z.array(z.string()).optional(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const selectEventSchema = createSelectSchema(events);

// Schema for approving events
export const approveEventSchema = z.object({
  id: z.string().uuid(),
  approved: z.boolean(),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type ApproveEvent = z.infer<typeof approveEventSchema>;
export type Event = typeof events.$inferSelect;