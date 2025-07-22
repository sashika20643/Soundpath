import { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { Label } from './label';

interface PlacesAutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, placeDetails?: any) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  required?: boolean;
  error?: string;
  className?: string;
  types?: string[];
}

export function PlacesAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  onCoordinatesChange,
  required = false,
  error,
  className = "",
  types = ['(cities)']
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>();
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is loaded
    const checkGoogleMaps = () => {
      if ((window as any).google?.maps?.places) {
        setIsGoogleMapsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (isGoogleMapsLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize autocomplete
      autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(
        inputRef.current,
        {
          types,
          fields: ['name', 'formatted_address', 'geometry', 'address_components']
        }
      );

      // Add place changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          console.log('Place selected:', place);
          
          // Extract city and country from place result
          let cityName = '';
          let countryName = '';
          
          if (place.address_components) {
            place.address_components.forEach((component: any) => {
              if (component.types.includes('locality')) {
                cityName = component.long_name;
              } else if (component.types.includes('administrative_area_level_1') && !cityName) {
                cityName = component.long_name;
              } else if (component.types.includes('country')) {
                countryName = component.long_name;
              }
            });
          }

          const displayName = place.formatted_address || place.name || '';
          onChange(displayName, place);

          // Extract coordinates if available
          if (place.geometry?.location && onCoordinatesChange) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            console.log('Coordinates extracted:', { lat, lng });
            onCoordinatesChange(lat, lng);
          }
        }
      });
    }

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        (window as any).google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded, onChange, onCoordinatesChange, types]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label
        htmlFor={id}
        className="text-sm font-medium uppercase tracking-wide"
        style={{ color: "var(--color-charcoal)" }}
      >
        {label} {required && "*"}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
        style={{
          borderBottomColor: "var(--color-light-gray)",
          color: "var(--color-charcoal)",
        }}
        autoComplete="off"
      />
      {!isGoogleMapsLoaded && (
        <p className="text-xs text-gray-500">Loading Google Places...</p>
      )}
      {error && (
        <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}