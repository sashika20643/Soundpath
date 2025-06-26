import { storage } from "../storage";
import { CustomError } from "../middlewares/errorHandler";
import type { InsertCategory, UpdateCategory, Category } from "@shared/schema";

export class CategoryService {
  async getAllCategories(filters?: { type?: string; search?: string }): Promise<Category[]> {
    try {
      return await storage.getCategories(filters);
    } catch (error) {
      throw new CustomError("Failed to fetch categories", 500);
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await storage.getCategory(id);
      if (!category) {
        throw new CustomError("Category not found", 404);
      }
      return category;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to fetch category", 500);
    }
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    try {
      // Check if category with same name and type already exists
      const existingCategories = await storage.getCategories({
        type: categoryData.type,
      });
      
      const duplicate = existingCategories.find(
        cat => cat.name.toLowerCase() === categoryData.name.toLowerCase()
      );
      
      if (duplicate) {
        throw new CustomError(
          `A ${categoryData.type} category with the name "${categoryData.name}" already exists`,
          409
        );
      }

      return await storage.createCategory(categoryData);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to create category", 500);
    }
  }

  async updateCategory(id: string, categoryData: Partial<UpdateCategory>): Promise<Category> {
    try {
      // Check if category exists
      const existingCategory = await storage.getCategory(id);
      if (!existingCategory) {
        throw new CustomError("Category not found", 404);
      }

      // Check for name conflicts if name is being updated
      if (categoryData.name) {
        const categoriesOfType = await storage.getCategories({
          type: categoryData.type || existingCategory.type,
        });
        
        const duplicate = categoriesOfType.find(
          cat => cat.id !== id && cat.name.toLowerCase() === categoryData.name!.toLowerCase()
        );
        
        if (duplicate) {
          throw new CustomError(
            `A ${categoryData.type || existingCategory.type} category with the name "${categoryData.name}" already exists`,
            409
          );
        }
      }

      const updatedCategory = await storage.updateCategory(id, categoryData);
      if (!updatedCategory) {
        throw new CustomError("Failed to update category", 500);
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to update category", 500);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const category = await storage.getCategory(id);
      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        throw new CustomError("Failed to delete category", 500);
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to delete category", 500);
    }
  }
}

export const categoryService = new CategoryService();
