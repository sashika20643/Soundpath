import { apiRequest } from "./queryClient";
import type { Category, InsertCategory, UpdateCategory } from "@shared/schema";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface CategoriesFilters {
  type?: string;
  search?: string;
}

export const categoryApi = {
  getCategories: async (filters?: CategoriesFilters): Promise<Category[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);
    
    const url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, { credentials: 'include' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const result: ApiResponse<Category[]> = await response.json();
    return result.data || [];
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await fetch(`/api/categories/${id}`, { credentials: 'include' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }
    
    const result: ApiResponse<Category> = await response.json();
    return result.data!;
  },

  createCategory: async (category: InsertCategory): Promise<Category> => {
    const response = await apiRequest('POST', '/api/categories', category);
    const result: ApiResponse<Category> = await response.json();
    return result.data!;
  },

  updateCategory: async (id: string, category: Partial<UpdateCategory>): Promise<Category> => {
    const response = await apiRequest('PUT', `/api/categories/${id}`, category);
    const result: ApiResponse<Category> = await response.json();
    return result.data!;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/categories/${id}`);
  },
};
