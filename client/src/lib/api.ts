import { apiRequest } from "./queryClient";
import type { Category, InsertCategory, UpdateCategory, Event, InsertEvent, UpdateEvent } from "@shared/schema";

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

export interface EventsFilters {
  continent?: string;
  country?: string;
  city?: string;
  genreIds?: string[];
  settingIds?: string[];
  eventTypeIds?: string[];
  tags?: string[];
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

export const eventApi = {
  getEvents: async (filters?: EventsFilters): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters?.continent) params.append('continent', filters.continent);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.genreIds?.length) params.append('genreIds', filters.genreIds.join(','));
    if (filters?.settingIds?.length) params.append('settingIds', filters.settingIds.join(','));
    if (filters?.eventTypeIds?.length) params.append('eventTypeIds', filters.eventTypeIds.join(','));
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.search) params.append('search', filters.search);
    
    const url = `/api/events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, { credentials: 'include' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    
    const result: ApiResponse<Event[]> = await response.json();
    return result.data || [];
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await fetch(`/api/events/${id}`, { credentials: 'include' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }
    
    const result: ApiResponse<Event> = await response.json();
    return result.data!;
  },

  createEvent: async (event: InsertEvent): Promise<Event> => {
    const response = await apiRequest('POST', '/api/events', event);
    const result: ApiResponse<Event> = await response.json();
    return result.data!;
  },

  updateEvent: async (id: string, event: Partial<UpdateEvent>): Promise<Event> => {
    const response = await apiRequest('PUT', `/api/events/${id}`, event);
    const result: ApiResponse<Event> = await response.json();
    return result.data!;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/events/${id}`);
  },
};
