import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { categoryController } from "./controllers/categoryController";
import { validateRequest } from "./middlewares/validateRequest";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import {
  createCategoryValidator,
  updateCategoryValidator,
  getCategoryValidator,
  getCategoriesValidator,
  deleteCategoryValidator,
} from "./validators/categoryValidator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Category routes
  app.get(
    "/api/categories",
    validateRequest(getCategoriesValidator),
    categoryController.getCategories.bind(categoryController)
  );

  app.get(
    "/api/categories/:id",
    validateRequest(getCategoryValidator),
    categoryController.getCategory.bind(categoryController)
  );

  app.post(
    "/api/categories",
    validateRequest(createCategoryValidator),
    categoryController.createCategory.bind(categoryController)
  );

  app.put(
    "/api/categories/:id",
    validateRequest(updateCategoryValidator),
    categoryController.updateCategory.bind(categoryController)
  );

  app.delete(
    "/api/categories/:id",
    validateRequest(deleteCategoryValidator),
    categoryController.deleteCategory.bind(categoryController)
  );

  // Note: Error handling middleware will be added after Vite setup

  const httpServer = createServer(app);
  return httpServer;
}
