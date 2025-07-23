import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi, type CategoriesFilters } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Category, InsertCategory, UpdateCategory } from "@shared/schema";

export function useCategories(filters?: CategoriesFilters) {
  return useQuery({
    queryKey: ['/api/categories', filters],
    queryFn: () => categoryApi.getCategories(filters),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['/api/categories', id],
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (category: InsertCategory) => categoryApi.createCategory(category),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create category",
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...category }: { id: string } & Partial<UpdateCategory>) =>
      categoryApi.updateCategory(id, category),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories', data.id] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update category",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete category",
      });
    },
  });
}
