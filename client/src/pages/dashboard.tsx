import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { CategoryFilters } from "@/components/categories/category-filters";
import { CategoryTable } from "@/components/categories/category-table";
import { CreateCategoryModal } from "@/components/categories/create-category-modal";
import { EditCategoryModal } from "@/components/categories/edit-category-modal";
import { DeleteCategoryModal } from "@/components/categories/delete-category-modal";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import type { Category } from "@shared/schema";

export default function Dashboard() {
  usePageMetadata('dashboard');
  
  const [filters, setFilters] = useState<{ type?: string; search?: string }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useCategories(filters);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage genres, settings, and event types</p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <CategoryFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        category={selectedCategory}
      />
      
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        category={selectedCategory}
      />
    </div>
  );
}
