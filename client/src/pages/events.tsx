import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { EventFilters } from "@/components/events/event-filters";
import { EventTable } from "@/components/events/event-table";
import { CreateEventModal } from "@/components/events/create-event-modal";
import { EditEventModal } from "@/components/events/edit-event-modal";
import { DeleteEventModal } from "@/components/events/delete-event-modal";
import { EventDetailsModal } from "@/components/events/event-details-modal";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import type { Event } from "@shared/schema";
import type { EventsFilters } from "@/lib/api";

export default function Events() {
  usePageMetadata("events");

  const [filters, setFilters] = useState<EventsFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useEvents(filters);

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Event Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage events with detailed information and filtering
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <EventFilters filters={filters} onFiltersChange={setFilters} />

          <EventTable
            events={events}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        event={selectedEvent}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        event={selectedEvent}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        event={selectedEvent}
      />
    </div>
  );
}
