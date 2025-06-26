import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryService";
import { ResponseFormatter } from "../utils/responseFormatter";

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, search } = req.query as { type?: string; search?: string };
      const categories = await categoryService.getAllCategories({ type, search });
      
      res.json(ResponseFormatter.success(categories, "Categories retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      
      res.json(ResponseFormatter.success(category, "Category retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.createCategory(req.body);
      
      res.status(201).json(ResponseFormatter.success(category, "Category created successfully"));
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      
      res.json(ResponseFormatter.success(category, "Category updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      
      res.json(ResponseFormatter.success(null, "Category deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
