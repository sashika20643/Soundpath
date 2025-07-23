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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  
  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(event => 
    event.latitude && event.longitude
  );

  // Load Google Maps API
  useEffect(() => {
    console.log('🗺️ EventMap useEffect triggered:', {
      mapLoaded,
      eventsWithCoordinatesLength: eventsWithCoordinates.length,
      events: eventsWithCoordinates.map(e => ({ id: e.id, title: e.title, lat: e.latitude, lng: e.longitude }))
    });
    
    if (eventsWithCoordinates.length === 0) {
      console.log('🚫 No events with coordinates to display');
      return;
    }

    if (mapLoaded && mapInitialized) {
      console.log('🚫 Map already loaded and initialized');
      return;
    }

    const loadGoogleMaps = () => {
      console.log('🔄 Loading Google Maps API...');
      
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps already loaded, initializing...');
        setMapLoaded(true);
        setTimeout(() => {
          initializeMap();
        }, 100);
        return;
      }

      console.log('📦 Creating Google Maps script tag...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google Maps API loaded successfully');
        setMapLoaded(true);
        setTimeout(() => {
          initializeMap();
        }, 100);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API');
        setMapError('Failed to load Google Maps API');
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [eventsWithCoordinates.length]);

  const initializeMap = () => {
    console.log('🚀 Initializing map...', {
      mapRef: mapRef.current,
      googleMaps: !!window.google?.maps,
      eventsCount: eventsWithCoordinates.length
    });
    
    if (!mapRef.current || !window.google || eventsWithCoordinates.length === 0) {
      console.log('❌ Cannot initialize map:', {
        noMapRef: !mapRef.current,
        noGoogle: !window.google,
        noEvents: eventsWithCoordinates.length === 0
      });
      return;
    }

    // Calculate center and bounds
    const bounds = new window.google.maps.LatLngBounds();
    eventsWithCoordinates.forEach(event => {
      bounds.extend(new window.google.maps.LatLng(event.latitude!, event.longitude!));
    });

    // Create map
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: bounds.getCenter(),
        zoom: 2,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#f5f5f5"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}, {"weight": 6}]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#e85d04"}]
          }
        ]
      });

    // Fit bounds
    map.fitBounds(bounds);
    mapInstanceRef.current = map;
    setMapInitialized(true);
    console.log('✅ Map initialized successfully with', eventsWithCoordinates.length, 'events');

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Add markers
    eventsWithCoordinates.forEach(event => {
      const marker = new window.google.maps.Marker({
        position: { lat: event.latitude!, lng: event.longitude! },
        map: map,
        title: event.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#e85d04" stroke="#ffffff" stroke-width="3"/>
              <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4zm0 6c-1.1 0-2-0.9-2-2s0.9-2 2-2 2 0.9 2 2-0.9 2-2 2z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        setSelectedEvent(event);
        
        const content = `
          <div style="max-width: 280px; padding: 8px;">
            <div style="margin-bottom: 12px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.3;">
                ${event.title}
              </h3>
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span style="font-size: 13px; color: #6b7280;">${event.city}, ${event.country}</span>
              </div>
              ${event.date ? `
                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                  <span style="font-size: 13px; color: #6b7280;">${new Date(event.date).toLocaleDateString()}</span>
                </div>
              ` : ''}
            </div>
            
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.4;">
              ${event.shortDescription?.substring(0, 120)}${event.shortDescription && event.shortDescription.length > 120 ? '...' : ''}
            </p>
            
            <a href="/event/${event.id}" style="
              display: inline-flex; 
              align-items: center; 
              gap: 6px; 
              padding: 8px 12px; 
              background: #e85d04; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              font-size: 13px; 
              font-weight: 500;
              transition: background-color 0.2s;
            " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#e85d04'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
              </svg>
              View Details
            </a>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, marker);
        
        // Center map on marker
        map.panTo(marker.getPosition());
      });

      markersRef.current.push(marker);
    });
    
    } catch (error) {
      console.error('❌ Error creating Google Map:', error);
      if (error.toString().includes('BillingNotEnabledMapError')) {
        setMapError('billing');
      } else {
        setMapError('unknown');
      }
      return;
    }
  };

  if (eventsWithCoordinates.length === 0) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No events with location data available</p>
        </div>
      </div>
    );
  }



  // Show error message if Google Maps billing is not enabled
  if (mapError === 'billing') {
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

  // Google Maps component
  return (
    <div className={`${className} bg-white rounded-lg border border-gray-200 overflow-hidden`} style={{ height }}>
      {mapLoaded && mapInitialized ? (
        <div ref={mapRef} className="w-full h-full" />
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interactive map with {eventsWithCoordinates.length} events...</p>
          </div>
        </div>
      )}
    </div>
  );
}