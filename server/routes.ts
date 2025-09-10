import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { categoryController } from "./controllers/categoryController";
import { eventController } from "./controllers/eventController";
import { validateRequest } from "./middlewares/validateRequest";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import {
  createCategoryValidator,
  updateCategoryValidator,
  getCategoryValidator,
  getCategoriesValidator,
  deleteCategoryValidator,
} from "./validators/categoryValidator";
import {
  createEventValidator,
  updateEventValidator,
  getEventValidator,
  getEventsValidator,
  deleteEventValidator,
  approveEventValidator,
} from "./validators/eventValidator";
import { chatEventValidator } from "./validators/chatEventValidator";
import { chatController } from "./controllers/chatController";
import {
  createContactMessageValidator,
  getContactMessagesValidator,
} from "./validators/contactMessageValidator";
import { contactMessageController } from "./controllers/contactMessageController";
import { authController } from "./controllers/authController";
import { requireAdminAuth } from "./middlewares/authMiddleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Category routes
  app.get(
    "/api/categories",
    validateRequest(getCategoriesValidator),
    categoryController.getCategories.bind(categoryController),
  );

  app.get(
    "/api/categories/:id",
    validateRequest(getCategoryValidator),
    categoryController.getCategory.bind(categoryController),
  );

  app.post(
    "/api/categories",
    validateRequest(createCategoryValidator),
    categoryController.createCategory.bind(categoryController),
  );

  app.put(
    "/api/categories/:id",
    validateRequest(updateCategoryValidator),
    categoryController.updateCategory.bind(categoryController),
  );

  app.delete(
    "/api/categories/:id",
    validateRequest(deleteCategoryValidator),
    categoryController.deleteCategory.bind(categoryController),
  );

  // Event routes
  app.get(
    "/api/events",
    validateRequest(getEventsValidator),
    eventController.getEvents.bind(eventController),
  );

  app.get(
    "/api/events/:id",
    validateRequest(getEventValidator),
    eventController.getEvent.bind(eventController),
  );

  app.post(
    "/api/events",
    validateRequest(createEventValidator),
    eventController.createEvent.bind(eventController),
  );

  app.put(
    "/api/events/:id",
    validateRequest(updateEventValidator),
    eventController.updateEvent.bind(eventController),
  );

  app.delete(
    "/api/events/:id",
    validateRequest(deleteEventValidator),
    eventController.deleteEvent.bind(eventController),
  );

  app.patch(
    "/api/events/:id/approve",
    validateRequest(approveEventValidator),
    eventController.approveEvent.bind(eventController),
  );

  // Contact message routes
  app.get(
    "/api/contact-messages",
    requireAdminAuth,
    validateRequest(getContactMessagesValidator),
    contactMessageController.getContactMessages.bind(contactMessageController),
  );

  app.post(
    "/api/contact-messages",
    validateRequest(createContactMessageValidator),
    contactMessageController.createContactMessage.bind(contactMessageController),
  );

  app.post(
    "/api/chat",
    validateRequest(chatEventValidator),
    chatController.chatWithEvents.bind(chatController),
  );

  // Authentication routes
  app.post("/api/auth/login", authController.login.bind(authController));
  app.post("/api/auth/verify", authController.verify.bind(authController));
  app.post("/api/auth/logout", authController.logout.bind(authController));

  // Note: Error handling middleware will be added after Vite setup

  const httpServer = createServer(app);
  return httpServer;
}
