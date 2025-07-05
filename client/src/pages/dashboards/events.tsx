import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { EventFilters } from "@/components/events/event-filters";
import { CreateEventModal } from "@/components/events/create-event-modal";
import { EditEventModal } from "@/components/events/edit-event-modal";
import { DeleteEventModal } from "@/components/events/delete-event-modal";
import { EventDetailsModal } from "@/components/events/event-details-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { Plus, Eye, Edit, Trash2, MapPin, Calendar, Music } from "lucide-react";
import type { Event, Category } from "@shared/schema";
import type { EventsFilters } from "@/lib/api";

export default function DashboardEvents() {
  const [filters, setFilters] = useState<EventsFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useEvents(filters);
  const { data: categories = [] } = useCategories();

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

  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country].filter(Boolean);
    return parts.join(", ");
  };

  const getEventCategories = (event: Event) => {
    const eventCategories: Category[] = [];
    
    if (event.genreIds) {
      event.genreIds.forEach(id => {
        const category = categories.find(cat => cat.id === id);
        if (category) eventCategories.push(category);
      });
    }
    
    if (event.settingIds) {
      event.settingIds.forEach(id => {
        const category = categories.find(cat => cat.id === id);
        if (category) eventCategories.push(category);
      });
    }
    
    if (event.eventTypeIds) {
      event.eventTypeIds.forEach(id => {
        const category = categories.find(cat => cat.id === id);
        if (category) eventCategories.push(category);
      });
    }
    
    return eventCategories;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Events Management</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <EventFilters
              onFiltersChange={setFilters}
              filters={filters}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first event.
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const eventCategories = getEventCategories(event);
                  
                  return (
                    <Card key={event.id} className="group hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {event.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{formatLocation(event)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          {eventCategories.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {eventCategories.slice(0, 3).map((category) => (
                                <Badge key={category.id} variant="secondary" className="text-xs">
                                  {category.name}
                                </Badge>
                              ))}
                              {eventCategories.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{eventCategories.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {event.shortDescription}
                          </p>
                          
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(event)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(event)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(event)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={selectedEvent}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        event={selectedEvent}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}