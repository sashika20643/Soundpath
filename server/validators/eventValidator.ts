import { z } from "zod";
import { insertEventSchema, updateEventSchema } from "@shared/schema";

export const createEventValidator = {
  body: insertEventSchema,
};

export const updateEventValidator = {
  body: updateEventSchema.omit({ id: true }),
  params: z.object({
    id: z.string().uuid("Invalid event ID format"),
  }),
};

export const getEventValidator = {
  params: z.object({
    id: z.string().uuid("Invalid event ID format"),
  }),
};

export const getEventsValidator = {
  query: z.object({
    continent: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    genreIds: z.string().optional().transform(val => val ? val.split(',') : undefined),
    settingIds: z.string().optional().transform(val => val ? val.split(',') : undefined),
    eventTypeIds: z.string().optional().transform(val => val ? val.split(',') : undefined),
    tags: z.string().optional().transform(val => val ? val.split(',') : undefined),
    search: z.string().optional(),
  }),
};

export const deleteEventValidator = {
  params: z.object({
    id: z.string().uuid("Invalid event ID format"),
  }),
};