import { useState, useRef, useEffect } from 'react';
import { MapPin, Play, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import type { Event } from '@shared/schema';

interface EventMapProps {
  events: Event[];
  className?: string;
  height?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function EventMap({ events, className = "", height = "400px" }: EventMapProps) {
  const [mapError, setMapError] = useState<string | null>('billing'); // Default to billing error
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(event => 
    event.latitude && event.longitude
  );

  console.log('🗺️ EventMap loaded with', eventsWithCoordinates.length, 'events:', eventsWithCoordinates.map(e => ({ title: e.title, city: e.city, country: e.country })));

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      console.log('🔑 Google Maps API Key status:', apiKey ? 'Present' : 'Missing');
      
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API already loaded');
        setIsGoogleLoaded(true);
        setMapError(null);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        console.log('⏳ Google Maps script tag found, waiting for load...');
        const checkGoogleReady = () => {
          if (window.google && window.google.maps) {
            console.log('✅ Google Maps API loaded successfully');
            setIsGoogleLoaded(true);
            setMapError(null);
          } else {
            setTimeout(checkGoogleReady, 100);
          }
        };
        checkGoogleReady();
        return;
      }

      if (!apiKey) {
        console.error('❌ Google Maps API key not found in environment variables');
        setMapError('api_key_missing');
        return;
      }

      console.log('📡 Loading Google Maps API script...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        console.log('✅ Google Maps API callback executed successfully');
        setIsGoogleLoaded(true);
        setMapError(null);
      };

      script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps API script:', error);
        setMapError('script_load_failed');
      };

      script.onload = () => {
        console.log('📡 Google Maps script loaded, waiting for initialization...');
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  // Initialize map when Google is loaded
  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current || eventsWithCoordinates.length === 0) {
      console.log('🔄 Map initialization skipped:', {
        googleLoaded: isGoogleLoaded,
        mapRefExists: !!mapRef.current,
        eventsCount: eventsWithCoordinates.length
      });
      return;
    }

    try {
      console.log('🗺️ Initializing Google Map with', eventsWithCoordinates.length, 'events');
      
      // Calculate center point from all events
      const avgLat = eventsWithCoordinates.reduce((sum, event) => sum + event.latitude!, 0) / eventsWithCoordinates.length;
      const avgLng = eventsWithCoordinates.reduce((sum, event) => sum + event.longitude!, 0) / eventsWithCoordinates.length;
      
      console.log('📍 Map center calculated:', { lat: avgLat, lng: avgLng });

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: eventsWithCoordinates.length === 1 ? 12 : 6,
        center: { lat: avgLat, lng: avgLng },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      console.log('✅ Map instance created successfully');
      setMapInstance(map);

      // Add markers for each event
      eventsWithCoordinates.forEach((event, index) => {
        console.log(`📌 Creating marker ${index + 1}/${eventsWithCoordinates.length} for event:`, {
          title: event.title,
          location: `${event.city}, ${event.country}`,
          coordinates: { lat: event.latitude, lng: event.longitude }
        });

        const marker = new window.google.maps.Marker({
          position: { lat: event.latitude!, lng: event.longitude! },
          map: map,
          title: event.title,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${event.title}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${event.city}, ${event.country}</p>
              ${event.shortDescription ? `<p style="margin: 0 0 8px 0; font-size: 12px;">${event.shortDescription}</p>` : ''}
              <a href="/event/${event.id}" style="font-size: 12px; color: #007cba; text-decoration: none;">View Details →</a>
            </div>
          `
        });

        marker.addListener('click', () => {
          console.log('🖱️ Map marker clicked for event:', event.title);
          infoWindow.open(map, marker);
        });

        console.log(`✅ Marker created successfully for: ${event.title}`);
      });

      console.log('🎯 All markers created successfully');

    } catch (error) {
      console.error('❌ Error initializing Google Map:', error);
      setMapError('map_initialization_failed');
    }
  }, [isGoogleLoaded, eventsWithCoordinates]);

  if (eventsWithCoordinates.length === 0) {
    console.log('📍 No events with coordinates found, showing empty state');
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No events with location data available</p>
        </div>
      </div>
    );
  }

  // Show interactive map if Google Maps is loaded
  if (isGoogleLoaded && !mapError) {
    console.log('🗺️ Rendering interactive Google Map');
    return (
      <div className={`${className} relative`} style={{ height }}>
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    );
  }

  // Show error message for API key missing
  if (mapError === 'api_key_missing') {
    console.log('❌ Showing API key missing error');
    return (
      <div className={`${className} bg-red-50 rounded-lg border-2 border-red-200 p-8`} style={{ height }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Google Maps API Key Missing
            </h3>
            <p className="text-gray-600 mb-4">
              Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message for script load failure
  if (mapError === 'script_load_failed') {
    console.log('❌ Showing script load failure error');
    return (
      <div className={`${className} bg-red-50 rounded-lg border-2 border-red-200 p-8`} style={{ height }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Failed to Load Google Maps
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading the Google Maps API. Please check your API key and network connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if Google Maps billing is not enabled
  if (mapError === 'billing') {
    console.log('💳 Showing billing requirement message');
    return (
      <div className={`${className} bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 p-8`} style={{ height }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <div className="absolute -mt-8 ml-12 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {eventsWithCoordinates.length}
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Interactive Map Requires Billing
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              To display the interactive Google Map with {eventsWithCoordinates.length} event locations, 
              billing needs to be enabled for the Google Maps API key in the Google Cloud Console.
            </p>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h4 className="font-medium text-gray-800 mb-3">Event Locations Available:</h4>
              <div className="space-y-2 text-sm">
                {eventsWithCoordinates.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate">
                      {event.title} - {event.city}, {event.country}
                    </span>
                  </div>
                ))}
                {eventsWithCoordinates.length > 3 && (
                  <p className="text-gray-500 italic">
                    +{eventsWithCoordinates.length - 3} more events...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show other errors
  if (mapError && mapError !== 'billing') {
    return (
      <div className={`${className} bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Unable to load map</p>
        </div>
      </div>
    );
  }

  // Show the informative billing panel since Google Maps billing is not enabled
  return (
    <div className={`${className} bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 p-8`} style={{ height }}>
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6 relative">
            <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <div className="absolute -mt-8 ml-12 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {eventsWithCoordinates.length}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Interactive Map Requires Billing
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            To display the interactive Google Map with {eventsWithCoordinates.length} event locations, 
            billing needs to be enabled for the Google Maps API key in the Google Cloud Console.
          </p>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-medium text-gray-800 mb-3">Event Locations Available:</h4>
            <div className="space-y-2 text-sm">
              {eventsWithCoordinates.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => window.location.href = `/event/${event.id}`}>
                  <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="truncate">
                    {event.title} - {event.city}, {event.country}
                  </span>
                </div>
              ))}
              {eventsWithCoordinates.length > 3 && (
                <p className="text-gray-500 italic">
                  +{eventsWithCoordinates.length - 3} more events...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}