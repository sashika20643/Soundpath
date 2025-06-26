import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import type { EventsFilters } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface EventFiltersProps {
  onFiltersChange: (filters: EventsFilters) => void;
  filters: EventsFilters;
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

export function EventFilters({ onFiltersChange, filters }: EventFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  const { data: genres = [] } = useCategories({ type: "genre" });
  const { data: settings = [] } = useCategories({ type: "setting" });
  const { data: eventTypes = [] } = useCategories({ type: "eventType" });

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleContinentChange = (value: string) => {
    const newFilters = { 
      ...filters, 
      continent: value === "all" ? undefined : value,
      country: undefined, // Reset country when continent changes
      city: undefined // Reset city when continent changes
    };
    onFiltersChange(newFilters);
  };

  const handleCountryChange = (value: string) => {
    const newFilters = { 
      ...filters, 
      country: value === "all" ? undefined : value,
      city: undefined // Reset city when country changes
    };
    onFiltersChange(newFilters);
  };

  const handleCityChange = (value: string) => {
    onFiltersChange({ ...filters, city: value || undefined });
  };

  const handleCategoryChange = (categoryType: 'genreIds' | 'settingIds' | 'eventTypeIds', categoryId: string) => {
    const currentIds = filters[categoryType] || [];
    const newIds = currentIds.includes(categoryId)
      ? currentIds.filter(id => id !== categoryId)
      : [...currentIds, categoryId];
    
    onFiltersChange({ 
      ...filters, 
      [categoryType]: newIds.length > 0 ? newIds : undefined 
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setTagInput("");
      onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    setSelectedTags([]);
    setTagInput("");
    onFiltersChange({});
  };

  const availableCountries = filters.continent ? countries[filters.continent as keyof typeof countries] || [] : [];

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Events
          </Label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Search by title..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Location Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Continent
            </Label>
            <Select value={filters.continent || "all"} onValueChange={handleContinentChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Continents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Continents</SelectItem>
                {continents.map(continent => (
                  <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </Label>
            <Select 
              value={filters.country || "all"} 
              onValueChange={handleCountryChange}
              disabled={!filters.continent}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {availableCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </Label>
            <Input
              placeholder="Enter city name..."
              value={filters.city || ""}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!filters.country}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Genres
            </Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {genres.map(genre => (
                <label key={genre.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.genreIds || []).includes(genre.id)}
                    onChange={() => handleCategoryChange('genreIds', genre.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Settings
            </Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {settings.map(setting => (
                <label key={setting.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.settingIds || []).includes(setting.id)}
                    onChange={() => handleCategoryChange('settingIds', setting.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{setting.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Event Types
            </Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {eventTypes.map(eventType => (
                <label key={eventType.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.eventTypeIds || []).includes(eventType.id)}
                    onChange={() => handleCategoryChange('eventTypeIds', eventType.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{eventType.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1"
            />
            <Button onClick={addTag} variant="outline" size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}