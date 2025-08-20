import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
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
  const [titleSearch, setTitleSearch] = useState(filters.search || "");
  
  const { data: categories = [] } = useCategories();

  // Debounce title search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleSearch !== filters.search) {
        onFiltersChange({ ...filters, search: titleSearch });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [titleSearch, filters, onFiltersChange]);

  

  const genreOptions = categories
    .filter(cat => cat.type === "genre")
    .map(cat => ({ value: cat.id, label: cat.name }));

  const settingOptions = categories
    .filter(cat => cat.type === "setting")
    .map(cat => ({ value: cat.id, label: cat.name }));

  const eventTypeOptions = categories
    .filter(cat => cat.type === "eventType")
    .map(cat => ({ value: cat.id, label: cat.name }));

  // Get unique countries from cities data
  const countries = Object.keys(cities).flatMap(continent => 
    Object.keys(cities[continent as keyof typeof cities])
  ).filter((country, index, array) => array.indexOf(country) === index);

  const availableCities = filters.country 
    ? Object.keys(cities).flatMap(continent => {
        const continentData = cities[continent as keyof typeof cities];
        if (continentData && typeof continentData === 'object') {
          const countryData = continentData[filters.country as keyof typeof continentData];
          return Array.isArray(countryData) ? countryData : [];
        }
        return [];
      }).filter((city, index, array) => array.indexOf(city) === index)
    : [];

  // Available tags for pill-style selection
  const availableTags = [
    "Electronic", "Live Band", "DJ Set", "Acoustic", "Underground", 
    "Rooftop", "Beach", "Festival", "Intimate", "Outdoor", "Indoor",
    "Jazz", "Rock", "Classical", "World Music", "Experimental",
    "Techno", "House", "Ambient", "Folk", "Alternative"
  ];

  const handleClearFilters = () => {
    setTitleSearch("");
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

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <div className="mb-8 space-y-6">
      {/* Main Search Inputs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Title Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title..."
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Advanced Filters
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <Select value={filters.country || "all"} onValueChange={(value) => 
                  onFiltersChange({ ...filters, country: value === "all" ? "" : value, city: "" })
                }>
                  <SelectTrigger className="border-gray-300 focus:ring-orange-500 focus:border-orange-500">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>
                <Select 
                  value={filters.city || "all"} 
                  onValueChange={(value) => onFiltersChange({ ...filters, city: value === "all" ? "" : value })}
                  disabled={!filters.country}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100">
                    <SelectValue placeholder={filters.country ? "Select city" : "Select country first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {availableCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genres */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
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
                <label className="text-sm font-medium text-gray-700">
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
                <label className="text-sm font-medium text-gray-700">
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

            {/* Tags Section with Pill-Style Buttons */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      (filters.tags || []).includes(tag)
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center pt-4">
              <button
                onClick={onSearch}
                className="px-8 py-3 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200 shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}