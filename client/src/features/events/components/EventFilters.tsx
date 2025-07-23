import { useMemo } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEventFilters } from "../hooks/useEventFilters";
import { useCategories } from "@/hooks/use-categories";
import { EventFilters as EventFiltersType } from "@/types";

interface EventFiltersProps {
  onFiltersChange: (filters: EventFiltersType) => void;
  initialFilters?: EventFiltersType;
}

export function EventFilters({ onFiltersChange, initialFilters = {} }: EventFiltersProps) {
  const { filters, updateFilter, clearFilters, hasActiveFilters, locationData } = useEventFilters();
  const { data: categories = [] } = useCategories();

  // Apply initial filters
  useMemo(() => {
    if (Object.keys(initialFilters).length > 0) {
      Object.entries(initialFilters).forEach(([key, value]) => {
        updateFilter(key as keyof EventFiltersType, value);
      });
    }
  }, []);

  // Notify parent of filter changes
  useMemo(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const genreCategories = categories.filter(cat => cat.type === 'genre');
  const settingCategories = categories.filter(cat => cat.type === 'setting');
  const eventTypeCategories = categories.filter(cat => cat.type === 'eventType');

  const handleCategoryToggle = (categoryId: string, type: 'genreIds' | 'settingIds' | 'eventTypeIds') => {
    const currentIds = filters[type] || [];
    const newIds = currentIds.includes(categoryId)
      ? currentIds.filter(id => id !== categoryId)
      : [...currentIds, categoryId];
    updateFilter(type, newIds);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Search Events
          </label>
          <Input
            placeholder="Search by title or description..."
            value={filters.search || ""}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Location Filters */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Location</h4>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Continent */}
            <Select 
              value={filters.continent || ""} 
              onValueChange={(value) => updateFilter('continent', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select continent" />
              </SelectTrigger>
              <SelectContent>
                {locationData.continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country */}
            <Select 
              value={filters.country || ""} 
              onValueChange={(value) => updateFilter('country', value)}
              disabled={!filters.continent}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {locationData.countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City */}
            <Select 
              value={filters.city || ""} 
              onValueChange={(value) => updateFilter('city', value)}
              disabled={!filters.country}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {locationData.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Filters */}
        {genreCategories.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <h4 className="font-medium text-gray-900">Genre</h4>
                <div className="flex items-center gap-2">
                  {(filters.genreIds?.length || 0) > 0 && (
                    <Badge variant="secondary">
                      {filters.genreIds?.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {genreCategories.map((category) => {
                  const isSelected = filters.genreIds?.includes(category.id) || false;
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category.id, 'genreIds')}
                      className={isSelected ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {settingCategories.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <h4 className="font-medium text-gray-900">Setting</h4>
                <div className="flex items-center gap-2">
                  {(filters.settingIds?.length || 0) > 0 && (
                    <Badge variant="secondary">
                      {filters.settingIds?.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {settingCategories.map((category) => {
                  const isSelected = filters.settingIds?.includes(category.id) || false;
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category.id, 'settingIds')}
                      className={isSelected ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {eventTypeCategories.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <h4 className="font-medium text-gray-900">Event Type</h4>
                <div className="flex items-center gap-2">
                  {(filters.eventTypeIds?.length || 0) > 0 && (
                    <Badge variant="secondary">
                      {filters.eventTypeIds?.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {eventTypeCategories.map((category) => {
                  const isSelected = filters.eventTypeIds?.includes(category.id) || false;
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category.id, 'eventTypeIds')}
                      className={isSelected ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}