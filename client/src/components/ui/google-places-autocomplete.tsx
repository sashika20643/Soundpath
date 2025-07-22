import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string, placeDetails?: {
    latitude: number;
    longitude: number;
    continent?: string;
    country?: string;
    city?: string;
    locationName?: string;
  }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder = "Search for a location...",
  disabled = false,
  className = ""
}: GooglePlacesAutocompleteProps) {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const loadGooglePlacesAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleLoaded(true);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkGoogleReady = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsGoogleLoaded(true);
          } else {
            setTimeout(checkGoogleReady, 100);
          }
        };
        checkGoogleReady();
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBgYEHGvG0aTLzG7DZzJ0zR1bQTX7aF4Sw'; // fallback key
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        setIsGoogleLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setIsGoogleLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadGooglePlacesAPI();
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current) return;

    setIsLoading(true);
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['name', 'geometry', 'address_components', 'formatted_address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Place selected:', place);

        if (!place.geometry || !place.geometry.location) {
          console.warn('No geometry for selected place');
          return;
        }

        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // Extract location components
        let continent = '';
        let country = '';
        let city = '';

        if (place.address_components) {
          place.address_components.forEach((component: any) => {
            const types = component.types;
            
            if (types.includes('locality') || types.includes('administrative_area_level_1')) {
              city = component.long_name;
            }
            if (types.includes('country')) {
              country = component.long_name;
            }
          });
        }

        // Map countries to continents (basic mapping)
        const continentMapping: { [key: string]: string } = {
          'United States': 'North America',
          'Canada': 'North America',
          'Mexico': 'North America',
          'United Kingdom': 'Europe',
          'France': 'Europe',
          'Germany': 'Europe',
          'Spain': 'Europe',
          'Italy': 'Europe',
          'Netherlands': 'Europe',
          'Japan': 'Asia',
          'China': 'Asia',
          'India': 'Asia',
          'South Korea': 'Asia',
          'Thailand': 'Asia',
          'Singapore': 'Asia',
          'Australia': 'Oceania',
          'New Zealand': 'Oceania',
          'Brazil': 'South America',
          'Argentina': 'South America',
          'Chile': 'South America',
          'Colombia': 'South America',
          'Peru': 'South America',
          'South Africa': 'Africa',
          'Nigeria': 'Africa',
          'Egypt': 'Africa',
          'Kenya': 'Africa',
          'Morocco': 'Africa'
        };

        continent = continentMapping[country] || '';

        const locationName = place.formatted_address || place.name || '';

        onChange(locationName, {
          latitude,
          longitude,
          continent,
          country,
          city: city || place.name || '',
          locationName
        });
      });

      autocompleteRef.current = autocomplete;
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      setIsLoading(false);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleLoaded, onChange]);

  if (!isGoogleLoaded) {
    return (
      <div className={`relative ${className}`}>
        <Input
          type="text"
          value="Loading Google Places..."
          disabled={true}
          placeholder={placeholder}
          className="pl-10"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className="pl-10"
      />
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
}