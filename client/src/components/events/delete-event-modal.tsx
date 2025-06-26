import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteEvent } from "@/hooks/use-events";
import type { Event } from "@shared/schema";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export function DeleteEventModal({ isOpen, onClose, event }: DeleteEventModalProps) {
  const deleteEventMutation = useDeleteEvent();

  const handleDelete = () => {
    if (!event) return;

    deleteEventMutation.mutate(event.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Delete Event
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to delete "{event.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteEventMutation.isPending}
          >
            {deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}