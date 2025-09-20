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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  getContinentCoordinates,
  getCountryCoordinates,
  getCityCoordinates,
} from "@/lib/coordinates";
import {
  getContinents,
  getCountriesForContinent,
  getCitiesForCountry,
  searchCities,
} from "@/lib/locations";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const continents = getContinents();

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<
    Array<{ isoCode: string; name: string }>
  >([]);
  const [availableCities, setAvailableCities] = useState<
    Array<{ name: string; latitude?: string; longitude?: string }>
  >([]);
  const [showContinentSuggestions, setShowContinentSuggestions] =
    useState(false);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const { data: genres = [] } = useCategories({ type: "genre" });
  const { data: settings = [] } = useCategories({ type: "setting" });
  const { data: eventTypes = [] } = useCategories({ type: "eventType" });

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
      locationName: undefined,
      latitude: undefined,
      longitude: undefined,
      instagramLink: "",
      genreIds: [],
      settingIds: [],
      eventTypeIds: [],
      tags: [],
      featured: false,
    },
  });

  const onSubmit = async (data: InsertEvent) => {
    const eventData = {
      ...data,
      genreIds: selectedGenres,
      settingIds: selectedSettings,
      eventTypeIds: selectedEventTypes,
      tags: selectedTags,
      featured: data.featured || false,
      fromDashboard: true,
    };

    // Console log the request payload for testing
    console.log("🧪 DASHBOARD FORM SUBMISSION PAYLOAD:", {
      ...eventData,
      timestamp: new Date().toISOString(),
      formType: "dashboard_admin_form",
    });

    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        console.log("✅ DASHBOARD FORM SUBMISSION SUCCESS");
        handleClose();
      },
      onError: (error) => {
        console.error("❌ DASHBOARD FORM SUBMISSION ERROR:", error);
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
    setAvailableCountries([]);
    setAvailableCities([]);
    setSelectedCountryCode("");
    setShowContinentSuggestions(false);
    setShowCountrySuggestions(false);
    setShowCitySuggestions(false);
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const toggleCategory = (
    categoryId: string,
    type: "genre" | "setting" | "eventType",
  ) => {
    if (type === "genre") {
      setSelectedGenres((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId],
      );
    } else if (type === "setting") {
      setSelectedSettings((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId],
      );
    } else if (type === "eventType") {
      setSelectedEventTypes((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId],
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Add a new event with detailed information, categories, and location
            data.
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
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.title.message}
                </p>
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
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.shortDescription.message}
              </p>
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
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.longDescription.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="continent">Continent *</Label>
              <div className="relative">
                <Input
                  id="continent"
                  value={selectedContinent}
                  placeholder="e.g. North America, Europe, Asia..."
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedContinent(value);
                    form.setValue("continent", value);
                    setShowContinentSuggestions(true);
                    // Auto-generate coordinates for continent center
                    const continentCoords = getContinentCoordinates(value);
                    if (continentCoords) {
                      form.setValue("latitude", continentCoords.lat);
                      form.setValue("longitude", continentCoords.lng);
                    }
                    // Reset country and city when continent changes
                    form.setValue("country", "");
                    setAvailableCountries([]);
                    form.setValue("city", "");
                    setAvailableCities([]);
                    setSelectedCountryCode("");
                  }}
                  onFocus={() => setShowContinentSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowContinentSuggestions(false), 200)
                  }
                />
                {showContinentSuggestions &&
                  getContinents().length > 0 &&
                  selectedContinent && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                      {getContinents()
                        .filter((continent) =>
                          continent
                            .toLowerCase()
                            .includes(selectedContinent.toLowerCase()),
                        )
                        .slice(0, 5)
                        .map((continent) => (
                          <button
                            key={continent}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                            onClick={() => {
                              setSelectedContinent(continent);
                              form.setValue("continent", continent);
                              setShowContinentSuggestions(false);
                              // Auto-generate coordinates for continent center
                              const continentCoords =
                                getContinentCoordinates(continent);
                              if (continentCoords) {
                                form.setValue("latitude", continentCoords.lat);
                                form.setValue("longitude", continentCoords.lng);
                              }
                              // Load countries for the selected continent
                              const countries =
                                getCountriesForContinent(continent);
                              setAvailableCountries(countries);
                              // Reset country and city when continent changes
                              form.setValue("country", "");
                              setAvailableCities([]);
                              form.setValue("city", "");
                              setSelectedCountryCode("");
                            }}
                          >
                            {continent}
                          </button>
                        ))}
                    </div>
                  )}
              </div>
              {form.formState.errors.continent && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.continent.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <div className="relative">
                <Input
                  id="country"
                  value={form.watch("country") || ""}
                  placeholder="e.g. United States, France, Japan..."
                  onChange={(e) => {
                    const value = e.target.value;
                    form.setValue("country", value);
                    setShowCountrySuggestions(true);

                    // Find matching country and load cities
                    const matchingCountry = availableCountries.find(
                      (country) =>
                        country.name.toLowerCase() === value.toLowerCase(),
                    );
                    if (matchingCountry) {
                      setSelectedCountryCode(matchingCountry.isoCode);
                      const cities = getCitiesForCountry(
                        matchingCountry.isoCode,
                      );
                      setAvailableCities(cities);
                      form.setValue("city", ""); // Reset city when country changes
                    }

                    // Auto-generate coordinates for country center
                    const countryCoords = getCountryCoordinates(value);
                    if (countryCoords) {
                      form.setValue("latitude", countryCoords.lat);
                      form.setValue("longitude", countryCoords.lng);
                    }
                  }}
                  onFocus={() => setShowCountrySuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowCountrySuggestions(false), 200)
                  }
                  disabled={!selectedContinent}
                />
                {showCountrySuggestions &&
                  availableCountries.length > 0 &&
                  form.watch("country") && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                      {availableCountries
                        .filter((country) =>
                          country.name
                            .toLowerCase()
                            .includes(
                              form.watch("country")?.toLowerCase() || "",
                            ),
                        )
                        .slice(0, 10)
                        .map((country) => (
                          <button
                            key={country.isoCode}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                            onClick={() => {
                              form.setValue("country", country.name);
                              setSelectedCountryCode(country.isoCode);
                              setShowCountrySuggestions(false);

                              // Load cities for this country
                              const cities = getCitiesForCountry(
                                country.isoCode,
                              );
                              setAvailableCities(cities);
                              form.setValue("city", ""); // Reset city

                              const countryCoords = getCountryCoordinates(
                                country.name,
                              );
                              if (countryCoords) {
                                form.setValue("latitude", countryCoords.lat);
                                form.setValue("longitude", countryCoords.lng);
                              }
                            }}
                          >
                            {country.name}
                          </button>
                        ))}
                    </div>
                  )}
              </div>
              {form.formState.errors.country && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <div className="relative">
                <Input
                  id="city"
                  value={form.watch("city") || ""}
                  placeholder="e.g. New York, Paris, Tokyo..."
                  onChange={(e) => {
                    const value = e.target.value;
                    form.setValue("city", value);
                    setShowCitySuggestions(true);

                    // Find matching city and use its coordinates
                    const matchingCity = availableCities.find(
                      (city) => city.name.toLowerCase() === value.toLowerCase(),
                    );
                    if (
                      matchingCity &&
                      matchingCity.latitude &&
                      matchingCity.longitude
                    ) {
                      form.setValue(
                        "latitude",
                        parseFloat(matchingCity.latitude),
                      );
                      form.setValue(
                        "longitude",
                        parseFloat(matchingCity.longitude),
                      );
                      form.setValue(
                        "locationName",
                        `${value}, ${form.watch("country")}, ${selectedContinent}`,
                      );
                    } else {
                      // Fallback to approximate coordinates
                      const cityCoords = getCityCoordinates(
                        selectedContinent,
                        form.watch("country") || "",
                        value,
                      );
                      if (cityCoords) {
                        form.setValue("latitude", cityCoords.lat);
                        form.setValue("longitude", cityCoords.lng);
                        form.setValue(
                          "locationName",
                          `${value}, ${form.watch("country")}, ${selectedContinent}`,
                        );
                      }
                    }
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowCitySuggestions(false), 200)
                  }
                  disabled={!selectedCountryCode}
                />
                {showCitySuggestions &&
                  selectedCountryCode &&
                  form.watch("city") && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                      {searchCities(
                        selectedCountryCode,
                        form.watch("city") || "",
                        undefined,
                        10,
                      ).map((city) => (
                        <button
                          key={city.name}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => {
                            form.setValue("city", city.name);
                            setShowCitySuggestions(false);

                            if (city.latitude && city.longitude) {
                              form.setValue(
                                "latitude",
                                parseFloat(city.latitude),
                              );
                              form.setValue(
                                "longitude",
                                parseFloat(city.longitude),
                              );
                            } else {
                              const cityCoords = getCityCoordinates(
                                selectedContinent,
                                form.watch("country") || "",
                                city.name,
                              );
                              if (cityCoords) {
                                form.setValue("latitude", cityCoords.lat);
                                form.setValue("longitude", cityCoords.lng);
                              }
                            }
                            form.setValue(
                              "locationName",
                              `${city.name}, ${form.watch("country")}, ${selectedContinent}`,
                            );
                          }}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              {form.formState.errors.city && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Display selected location coordinates */}
          {form.watch("latitude") && form.watch("longitude") && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Location:</strong> {form.watch("city")},{" "}
                    {form.watch("country")}, {form.watch("continent")}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Coordinates: {form.watch("latitude")?.toFixed(6)},{" "}
                    {form.watch("longitude")?.toFixed(6)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContinent("");
                    form.setValue("continent", "");
                    form.setValue("country", "");
                    form.setValue("city", "");
                    setSelectedCountryCode("");
                    setAvailableCountries([]);
                    setAvailableCities([]);
                    form.setValue("latitude", undefined);
                    form.setValue("longitude", undefined);
                    form.setValue("locationName", undefined);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear location
                </button>
              </div>
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
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.date.message}
              </p>
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
                {genres.map((genre) => (
                  <label key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedGenres.includes(genre.id)}
                      onCheckedChange={() => toggleCategory(genre.id, "genre")}
                    />
                    <span className="text-sm">{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Settings</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {settings.map((setting) => (
                  <label
                    key={setting.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={selectedSettings.includes(setting.id)}
                      onCheckedChange={() =>
                        toggleCategory(setting.id, "setting")
                      }
                    />
                    <span className="text-sm">{setting.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Event Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {eventTypes.map((eventType) => (
                  <label
                    key={eventType.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={selectedEventTypes.includes(eventType.id)}
                      onCheckedChange={() =>
                        toggleCategory(eventType.id, "eventType")
                      }
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
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Event */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={form.watch("featured")}
              onCheckedChange={(checked) =>
                form.setValue("featured", !!checked)
              }
            />
            <Label htmlFor="featured" className="text-base font-medium">
              Featured Event
            </Label>
            <span className="text-sm text-gray-500">
              (Will be highlighted prominently on the site)
            </span>
          </div>

          <DialogFooter className="flex flex-col gap-4">
            {/* Form validation errors */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </p>
                <ul className="mt-2 text-sm text-red-700">
                  {Object.entries(form.formState.errors).map(
                    ([field, error]) => (
                      <li key={field} className="list-disc ml-5">
                        {field}: {error?.message || "This field is required"}
                      </li>
                    ),
                  )}
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
