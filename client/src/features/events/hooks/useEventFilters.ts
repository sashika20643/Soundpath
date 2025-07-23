import { useState, useMemo } from "react";
import { EventFilters } from "@/types";
import locations from "@/lib/locations.json";

export function useEventFilters() {
  const [filters, setFilters] = useState<EventFilters>({});

  // Memoized location data
  const locationData = useMemo(() => {
    const continents = Object.keys(locations);
    const countries = filters.continent 
      ? Object.keys(locations[filters.continent as keyof typeof locations] || {})
      : [];
    const cities = (filters.continent && filters.country)
      ? (locations[filters.continent as keyof typeof locations]?.[filters.country as keyof typeof locations[keyof typeof locations]] || [])
      : [];

    return { continents, countries, cities };
  }, [filters.continent, filters.country]);

  const updateFilter = (key: keyof EventFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset dependent filters when parent changes
      if (key === 'continent') {
        delete newFilters.country;
        delete newFilters.city;
      } else if (key === 'country') {
        delete newFilters.city;
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    locationData
  };
}