import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
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
import { updateEventSchema, type UpdateEvent, type Event } from "@shared/schema";
import { useUpdateEvent } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
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

export function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("");

  const { data: genres = [] } = useCategories({ type: "genre" });
  const { data: settings = [] } = useCategories({ type: "setting" });
  const { data: eventTypes = [] } = useCategories({ type: "eventType" });

  const updateEventMutation = useUpdateEvent();

  const form = useForm<UpdateEvent>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      heroImage: "",
      continent: "",
      country: "",
      city: "",
      instagramLink: "",
      genreIds: [],
      settingIds: [],
      eventTypeIds: [],
      tags: [],
      extraLinks: [],
    },
  });

  // Update form when event changes
  useEffect(() => {
    if (event) {
      const formData = {
        title: event.title || "",
        shortDescription: event.shortDescription || "",
        longDescription: event.longDescription || "",
        heroImage: event.heroImage || "",
        continent: event.continent || "",
        country: event.country || "",
        city: event.city || "",
        instagramLink: event.instagramLink || "",
        extraLinks: event.extraLinks || [],
      };

      console.log('🔄 Resetting form with event data:', formData);

      form.reset(formData, { keepDirty: false, keepTouched: false });
      setSelectedGenres(event.genreIds || []);
      setSelectedSettings(event.settingIds || []);
      setSelectedEventTypes(event.eventTypeIds || []);
      setSelectedTags(event.tags || []);
      setSelectedContinent(event.continent || "");
    }
  }, [event, form]);

  const onSubmit = async (data: UpdateEvent) => {
    if (!event) return;

    // Debug form state
    console.log('📋 Form validation state:', {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
    });

    const eventData = {
      ...data,
      genreIds: selectedGenres,
      settingIds: selectedSettings,
      eventTypeIds: selectedEventTypes,
      tags: selectedTags,
    };

    // Console log for debugging
    console.log('🔄 Updating event:', event.id, eventData);

    updateEventMutation.mutate({ id: event.id, ...eventData }, {
      onSuccess: () => {
        console.log('✅ Event updated successfully');
        handleClose();
      },
      onError: (error) => {
        console.error('❌ Failed to update event:', error);
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

  const availableCountries = selectedContinent ? countries[selectedContinent as keyof typeof countries] || [] : [];

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update event information, categories, and location data.
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
                  if (value !== form.watch("continent")) {
                    form.setValue("country", "");
                    form.setValue("city", "");
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
                  if (value !== form.watch("country")) {
                    form.setValue("city", "");
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
                onChange={(value) => form.setValue("city", value)}
                placeholder="Search for a city..."
                disabled={!form.watch("country")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instagramLink">Instagram Link</Label>
            <Input
              id="instagramLink"
              {...form.register("instagramLink")}
              placeholder="https://instagram.com/..."
            />
          </div>

          {/* Extra Links */}
          <div>
            <Label className="text-base font-medium">Extra Links</Label>
            <div className="space-y-2">
              {form.watch("extraLinks").map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Link Name"
                    value={link.name}
                    onChange={(e) => {
                      const newExtraLinks = [...form.watch("extraLinks")];
                      newExtraLinks[index] = { ...newExtraLinks[index], name: e.target.value };
                      form.setValue("extraLinks", newExtraLinks);
                    }}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Link URL"
                    value={link.url}
                    onChange={(e) => {
                      const newExtraLinks = [...form.watch("extraLinks")];
                      newExtraLinks[index] = { ...newExtraLinks[index], url: e.target.value };
                      form.setValue("extraLinks", newExtraLinks);
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newExtraLinks = form.watch("extraLinks").filter((_, i) => i !== index);
                      form.setValue("extraLinks", newExtraLinks);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setValue("extraLinks", [...form.watch("extraLinks"), { name: "", url: "" }]);
              }}
              className="mt-2"
            >
              Add Link
            </Button>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateEventMutation.isPending}
              className="min-w-[120px]"
            >
              {updateEventMutation.isPending ? "Updating..." : "Update Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}