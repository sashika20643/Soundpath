import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { GooglePlacesAutocomplete } from "@/components/ui/google-places-autocomplete";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertEventSchema, type InsertEvent } from "@shared/schema";
import { useCreateEvent } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { getContinentCoordinates, getCountryCoordinates, getCityCoordinates } from "@/lib/coordinates";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const continents = [
  "Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"
];

const countries = {
  "North America": ["United States", "Canada", "Mexico"],
  "Europe": ["United Kingdom", "France", "Germany", "Spain", "Italy", "Netherlands"],
  "Asia": ["Japan", "China", "India", "South Korea", "Thailand", "Singapore"],
  "Africa": ["South Africa", "Nigeria", "Egypt", "Kenya", "Morocco"],
  "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
  "Oceania": ["Australia", "New Zealand", "Fiji"],
  "Antarctica": []
};

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("");

  const { data: genres = [] } = useCategories({ type: "genre" });
  const { data: settings = [] } = useCategories({ type: "setting" });
  const { data: eventTypes = [] } = useCategories({ type: "eventType" });

  // Computed values for dropdowns
  const availableCountries = selectedContinent 
    ? countries[selectedContinent as keyof typeof countries] || []
    : [];

  const createEventMutation = useCreateEvent();

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      heroImage: "",
      continent: "",
      country: "",
      city: "",
      locationName: "",
      latitude: undefined,
      longitude: undefined,
      instagramLink: "",
      genreIds: [],
      settingIds: [],
      eventTypeIds: [],
      tags: [],
    },
  });

  const onSubmit = async (data: InsertEvent) => {
    const eventData = {
      ...data,
      genreIds: selectedGenres,
      settingIds: selectedSettings,
      eventTypeIds: selectedEventTypes,
      tags: selectedTags,
      fromDashboard: true,
    };

    // Console log the request payload for testing
    console.log('🧪 DASHBOARD FORM SUBMISSION PAYLOAD:', {
      ...eventData,
      timestamp: new Date().toISOString(),
      formType: 'dashboard_admin_form'
    });

    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        console.log('✅ DASHBOARD FORM SUBMISSION SUCCESS');
        handleClose();
      },
      onError: (error) => {
        console.error('❌ DASHBOARD FORM SUBMISSION ERROR:', error);
      },
    });
  };

  const handleClose = () => {
    form.reset();
    setSelectedGenres([]);
    setSelectedSettings([]);
    setSelectedEventTypes([]);
    setSelectedTags([]);
    setTagInput("");
    setSelectedContinent("");
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const toggleCategory = (categoryId: string, type: 'genre' | 'setting' | 'eventType') => {
    if (type === 'genre') {
      setSelectedGenres(prev => 
        prev.includes(categoryId) 
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    } else if (type === 'setting') {
      setSelectedSettings(prev => 
        prev.includes(categoryId) 
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    } else if (type === 'eventType') {
      setSelectedEventTypes(prev => 
        prev.includes(categoryId) 
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Add a new event with detailed information, categories, and location data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Event title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="heroImage">Hero Image URL</Label>
              <Input
                id="heroImage"
                {...form.register("heroImage")}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description *</Label>
            <Textarea
              id="shortDescription"
              {...form.register("shortDescription")}
              placeholder="Brief description for listing views"
              rows={3}
            />
            {form.formState.errors.shortDescription && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.shortDescription.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="longDescription">Full Description *</Label>
            <RichTextEditor
              value={form.watch("longDescription") || ""}
              onChange={(value) => form.setValue("longDescription", value)}
              placeholder="Detailed description with rich content - supports formatting, links, and images"
              height="250px"
            />
            {form.formState.errors.longDescription && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.longDescription.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Continent *</Label>
              <Select 
                value={selectedContinent}
                onValueChange={(value) => {
                  setSelectedContinent(value);
                  form.setValue("continent", value);
                  form.setValue("country", "");
                  form.setValue("city", "");
                  // Auto-generate coordinates for continent center
                  const continentCoords = getContinentCoordinates(value);
                  if (continentCoords) {
                    form.setValue("latitude", continentCoords.lat);
                    form.setValue("longitude", continentCoords.lng);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select continent" />
                </SelectTrigger>
                <SelectContent>
                  {continents.map(continent => (
                    <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Country *</Label>
              <Select 
                value={form.watch("country")}
                onValueChange={(value) => {
                  form.setValue("country", value);
                  form.setValue("city", "");
                  // Auto-generate coordinates for country center
                  const countryCoords = getCountryCoordinates(value);
                  if (countryCoords) {
                    form.setValue("latitude", countryCoords.lat);
                    form.setValue("longitude", countryCoords.lng);
                  }
                }}
                disabled={!selectedContinent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {availableCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <CityAutocomplete
                continent={selectedContinent}
                country={form.watch("country") || ""}
                value={form.watch("city") || ""}
                onChange={(value) => {
                  form.setValue("city", value);
                  // Auto-generate coordinates for city
                  const cityCoords = getCityCoordinates(selectedContinent, form.watch("country") || "", value);
                  if (cityCoords) {
                    form.setValue("latitude", cityCoords.lat);
                    form.setValue("longitude", cityCoords.lng);
                    form.setValue("locationName", `${value}, ${form.watch("country")}, ${selectedContinent}`);
                  }
                }}
                placeholder="Search for a city..."
                disabled={!form.watch("country")}
              />
            </div>
          </div>
          
          {/* Display selected location coordinates */}
          {form.watch("latitude") && form.watch("longitude") && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Location:</strong> {form.watch("city")}, {form.watch("country")}, {form.watch("continent")}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Coordinates: {form.watch("latitude")?.toFixed(6)}, {form.watch("longitude")?.toFixed(6)}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="date">Event Date *</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              className="w-full"
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="instagramLink">Instagram Link</Label>
            <Input
              id="instagramLink"
              {...form.register("instagramLink")}
              placeholder="https://instagram.com/..."
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Genres</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {genres.map(genre => (
                  <label key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedGenres.includes(genre.id)}
                      onCheckedChange={() => toggleCategory(genre.id, 'genre')}
                    />
                    <span className="text-sm">{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Settings</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {settings.map(setting => (
                  <label key={setting.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSettings.includes(setting.id)}
                      onCheckedChange={() => toggleCategory(setting.id, 'setting')}
                    />
                    <span className="text-sm">{setting.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Event Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {eventTypes.map(eventType => (
                  <label key={eventType.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedEventTypes.includes(eventType.id)}
                      onCheckedChange={() => toggleCategory(eventType.id, 'eventType')}
                    />
                    <span className="text-sm">{eventType.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-base font-medium">Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-4">
            {/* Form validation errors */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </p>
                <ul className="mt-2 text-sm text-red-700">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field} className="list-disc ml-5">
                      {field}: {error?.message || "This field is required"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEventMutation.isPending}
                className="flex items-center"
              >
                {createEventMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}