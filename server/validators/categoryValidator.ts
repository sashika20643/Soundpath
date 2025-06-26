import { z } from "zod";
import { insertCategorySchema, updateCategorySchema } from "@shared/schema";

export const createCategoryValidator = {
  body: insertCategorySchema,
};

export const updateCategoryValidator = {
  body: updateCategorySchema.omit({ id: true }),
  params: z.object({
    id: z.string().uuid("Invalid category ID format"),
  }),
};

export const getCategoryValidator = {
  params: z.object({
    id: z.string().uuid("Invalid category ID format"),
  }),
};

export const getCategoriesValidator = {
  query: z.object({
    type: z.enum(["genre", "setting", "eventType"]).optional(),
    search: z.string().optional(),
  }),
};

export const deleteCategoryValidator = {
  params: z.object({
    id: z.string().uuid("Invalid category ID format"),
  }),
};
