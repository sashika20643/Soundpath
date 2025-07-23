export { apiRequest } from "./queryClient";

// Category API functions
export const categoryApi = {
  async getCategories(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data || [];
  },

  async getCategory(id) {
    const response = await fetch(`/api/categories/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  async createCategory(category) {
    const response = await apiRequest('POST', '/api/categories', category);
    const data = await response.json();
    return data.data;
  },

  async updateCategory(id, category) {
    const response = await apiRequest('PATCH', `/api/categories/${id}`, category);
    const data = await response.json();
    return data.data;
  },

  async deleteCategory(id) {
    const response = await apiRequest('DELETE', `/api/categories/${id}`);
    const data = await response.json();
    return data.data;
  }
};

export const eventApi = {
  async getEvents(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    const url = `/api/events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
  }
};