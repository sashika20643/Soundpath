import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi, type EventsFilters } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Event, InsertEvent, UpdateEvent } from "@shared/schema";

export function useEvents(filters?: EventsFilters) {
  return useQuery({
    queryKey: ['/api/events', filters],
    queryFn: () => eventApi.getEvents(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnMount: true,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['/api/events', id],
    queryFn: () => eventApi.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (event: InsertEvent & { fromDashboard?: boolean }) => eventApi.createEvent(event),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create event",
      });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...event }: { id: string } & Partial<UpdateEvent>) =>
      eventApi.updateEvent(id, event),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events', data.id] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update event",
      });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => eventApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete event",
      });
    },
  });
}

export function useApproveEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      eventApi.approveEvent(id, approved),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events', data.id] });
      toast({
        title: "Success",
        description: `Event ${data.approved ? 'approved' : 'rejected'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update event approval status",
      });
    },
  });
}