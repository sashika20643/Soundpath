import { AlertTriangle } from "lucide-react";
import { type Category } from "@shared/schema";
import { useDeleteCategory } from "@/hooks/use-categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function DeleteCategoryModal({ isOpen, onClose, category }: DeleteCategoryModalProps) {
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;
    
    try {
      await deleteCategory.mutateAsync(category.id);
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 mb-2">
              Delete Category
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-medium">"{category?.name}"</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={deleteCategory.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
