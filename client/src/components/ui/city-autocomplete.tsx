import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown } from "lucide-react";


interface CityAutocompleteProps {
  continent: string;
  country: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CityAutocomplete({
  continent,
  country,
  value,
  onChange,
  placeholder = "Enter city name...",
  disabled = false,
  className = ""
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!continent || !country) {
      setSuggestions([]);
      return;
    }

    // Get country code from country name using locations lib
    const { getCountryByName } = require("@/lib/locations");
    const countryData = getCountryByName(country);
    
    if (!countryData) {
      setSuggestions([]);
      return;
    }

    const { searchCities } = require("@/lib/locations");
    const cities = searchCities(countryData.isoCode, value, undefined, 20);
    setSuggestions(cities.map((city: any) => city.name));
  }, [continent, country, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(suggestions[highlightedIndex]);
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const showSuggestions = isOpen && suggestions.length > 0 && !disabled;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        {suggestions.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        )}
      </div>

      {showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((city, index) => (
            <button
              key={city}
              type="button"
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
              }`}
              onClick={() => handleSuggestionClick(city)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                {city}
              </div>
            </button>
          ))}
          {value && !suggestions.includes(value) && (
            <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
              Press Enter to use "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}