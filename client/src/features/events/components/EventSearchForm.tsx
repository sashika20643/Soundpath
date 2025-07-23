import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventFilters } from "@/types";
import locations from "@/lib/locations.json";

interface EventSearchFormProps {
  onSearch: (filters: EventFilters) => void;
  placeholder?: string;
  showAdvanced?: boolean;
}

export function EventSearchForm({ 
  onSearch, 
  placeholder = "Search events by title, city, or description...",
  showAdvanced = false 
}: EventSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const continents = Object.keys(locations);
  const countries = selectedContinent 
    ? Object.keys(locations[selectedContinent as keyof typeof locations] || {})
    : [];

  const handleSearch = () => {
    const filters: EventFilters = {
      search: searchQuery.trim() || undefined,
      continent: selectedContinent && selectedContinent !== "__any__" ? selectedContinent : undefined,
      country: selectedCountry && selectedCountry !== "__any__" ? selectedCountry : undefined,
    };
    onSearch(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
        />
        <Button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
        >
          Search
        </Button>
      </div>

      {/* Advanced Search Options */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Continent
            </label>
            <Select 
              value={selectedContinent} 
              onValueChange={(value) => {
                setSelectedContinent(value);
                setSelectedCountry(""); // Reset country when continent changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any continent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any continent</SelectItem>
                {continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Select 
              value={selectedCountry} 
              onValueChange={setSelectedCountry}
              disabled={!selectedContinent}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any country</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}