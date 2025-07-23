import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EventFormData } from "@/types";
import { getCityCoordinates } from "@/lib/coordinates";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  heroImage: z.string().url("Must be a valid URL"),
  shortDescription: z.string().min(10, "Description too short").max(500, "Description too long"),
  longDescription: z.string().min(20, "Long description too short"),
  date: z.string().min(1, "Date is required"),
  tags: z.array(z.string()).default([]),
  instagramLink: z.string().url("Must be a valid Instagram URL").optional().or(z.literal("")),
  continent: z.string().min(1, "Continent is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  genreIds: z.array(z.string()).default([]),
  settingIds: z.array(z.string()).default([]),
  eventTypeIds: z.array(z.string()).default([]),
});

export function useEventForm(defaultValues?: Partial<EventFormData>) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      heroImage: "",
      shortDescription: "",
      longDescription: "",
      date: "",
      tags: [],
      instagramLink: "",
      continent: "",
      country: "",
      city: "",
      genreIds: [],
      settingIds: [],
      eventTypeIds: [],
      ...defaultValues,
    },
  });

  const processFormData = (data: EventFormData) => {
    // Generate coordinates and location name
    const coordinates = getCityCoordinates(data.continent, data.country, data.city) || { lat: 0, lng: 0 };
    
    return {
      ...data,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      locationName: `${data.city}, ${data.country}, ${data.continent}`,
      timestamp: new Date().toISOString(),
    };
  };

  return {
    form,
    processFormData,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
  };
}