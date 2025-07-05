import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useCategories } from "@/hooks/use-categories";
import { cities } from "@/lib/cities";
import type { EventsFilters } from "@/lib/api";

interface EventSearchFormProps {
  filters: EventsFilters;
  onFiltersChange: (filters: EventsFilters) => void;
  onSearch: () => void;
}

export function EventSearchForm({ filters, onFiltersChange, onSearch }: EventSearchFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [contentSearch, setContentSearch] = useState("");
  
  const { data: categories = [] } = useCategories();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFiltersChange({ ...filters, search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const genreOptions = categories
    .filter(cat => cat.type === "genre")
    .map(cat => ({ value: cat.id, label: cat.name }));

  const settingOptions = categories
    .filter(cat => cat.type === "setting")
    .map(cat => ({ value: cat.id, label: cat.name }));

  const eventTypeOptions = categories
    .filter(cat => cat.type === "eventType")
    .map(cat => ({ value: cat.id, label: cat.name }));

  // Get unique countries and cities from the cities data
  const countries = Object.keys(cities).flatMap(continent => 
    Object.keys((cities as any)[continent])
  ).filter((country, index, array) => array.indexOf(country) === index);

  const availableCities = filters.country 
    ? Object.keys(cities).flatMap(continent => 
        (cities as any)[continent][filters.country] || []
      ).filter((city, index, array) => array.indexOf(city) === index)
    : [];

  const handleClearFilters = () => {
    setSearchTerm("");
    setContentSearch("");
    onFiltersChange({
      search: "",
      continent: "",
      country: "",
      city: "",
      genreIds: [],
      settingIds: [],
      eventTypeIds: [],
      tags: []
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <div className="mb-8 space-y-6">
      {/* Main Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--color-mid-gray)' }} />
          <Input
            type="text"
            placeholder="Search by title, location, or experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            className="pl-12 pr-12 py-4 text-center border-2 transition-all duration-300"
            style={{
              borderColor: 'var(--color-light-gray)',
              backgroundColor: 'var(--color-warm-white)',
              color: 'var(--color-charcoal)'
            }}
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-300"
            style={{ color: 'var(--color-mid-gray)' }}
          >
            <Filter className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="bg-opacity-50 p-6 rounded-lg border transition-all duration-300"
             style={{ 
               backgroundColor: 'var(--color-cream)', 
               borderColor: 'var(--color-light-gray)' 
             }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg" style={{ color: 'var(--color-charcoal)' }}>
              Advanced Search
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded border transition-all duration-300"
                style={{
                  borderColor: 'var(--color-light-gray)',
                  color: 'var(--color-dark-gray)',
                  backgroundColor: 'transparent'
                }}
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Content / Description
              </label>
              <Input
                type="text"
                placeholder="Search in descriptions..."
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="border transition-all duration-300"
                style={{
                  borderColor: 'var(--color-light-gray)',
                  backgroundColor: 'var(--color-warm-white)',
                  color: 'var(--color-charcoal)'
                }}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Country
              </label>
              <Select value={filters.country || ""} onValueChange={(value) => 
                onFiltersChange({ ...filters, country: value, city: "" })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                City
              </label>
              <Select 
                value={filters.city || ""} 
                onValueChange={(value) => onFiltersChange({ ...filters, city: value })}
                disabled={!filters.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filters.country ? "Select city" : "Select country first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {availableCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Genres
              </label>
              <MultiSelect
                options={genreOptions}
                selected={filters.genreIds || []}
                onChange={(selected) => onFiltersChange({ ...filters, genreIds: selected })}
                placeholder="Select genres..."
                searchable
              />
            </div>

            {/* Settings */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Settings
              </label>
              <MultiSelect
                options={settingOptions}
                selected={filters.settingIds || []}
                onChange={(selected) => onFiltersChange({ ...filters, settingIds: selected })}
                placeholder="Select settings..."
                searchable
              />
            </div>

            {/* Event Types */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Event Types
              </label>
              <MultiSelect
                options={eventTypeOptions}
                selected={filters.eventTypeIds || []}
                onChange={(selected) => onFiltersChange({ ...filters, eventTypeIds: selected })}
                placeholder="Select event types..."
                searchable
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onSearch}
              className="px-8 py-3 text-sm font-medium rounded-lg border transition-all duration-300"
              style={{
                borderColor: 'var(--color-charcoal)',
                color: 'var(--color-warm-white)',
                backgroundColor: 'var(--color-charcoal)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-dark-gray)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}