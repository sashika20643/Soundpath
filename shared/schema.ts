import { pgTable, text, serial, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  type: z.enum(["genre", "setting", "eventType"], {
    required_error: "Please select a category type",
  }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCategorySchema = createInsertSchema(categories, {
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  type: z.enum(["genre", "setting", "eventType"], {
    required_error: "Please select a category type",
  }),
}).omit({
  createdAt: true,
  updatedAt: true,
}).partial().extend({
  id: z.string().uuid(),
});

export const selectCategorySchema = createSelectSchema(categories);

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Keep existing users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
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
  locationName: text("location_name"),
  genreIds: text("genre_ids").array(),
  settingIds: text("setting_ids").array(),
  eventTypeIds: text("event_type_ids").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Index on date for efficient sorting
  dateIdx: index("events_date_idx").on(table.date),
}));

export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title must be less than 200 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(500, "Short description must be less than 500 characters"),
  longDescription: z.string().min(20, "Long description must be at least 20 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
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
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEventSchema = createInsertSchema(events, {
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title must be less than 200 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(500, "Short description must be less than 500 characters"),
  longDescription: z.string().min(20, "Long description must be at least 20 characters"),
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
}).omit({
  createdAt: true,
  updatedAt: true,
}).partial().extend({
  id: z.string().uuid(),
});

export const selectEventSchema = createSelectSchema(events);

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type Event = typeof events.$inferSelect;
