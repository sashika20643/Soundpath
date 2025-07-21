import { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '@shared/schema';

interface EventMapProps {
  events: Event[];
  className?: string;
  height?: string;
}

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  events: Event[];
}

function MapComponent({ center, zoom, events }: MapComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();
  const [infoWindow, setInfoWindow] = useState<any>();

  useEffect(() => {
    if (ref.current && !map && (window as any).google) {
      const newMap = new (window as any).google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#1a1a1a" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#2c2c2c" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#404040" }]
          }
        ]
      });
      
      const newInfoWindow = new (window as any).google.maps.InfoWindow();
      
      setMap(newMap);
      setInfoWindow(newInfoWindow);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && events.length > 0 && (window as any).google) {
      // Add markers for each event
      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const marker = new (window as any).google.maps.Marker({
            position: { lat: event.latitude, lng: event.longitude },
            map,
            title: event.title,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#f97316', // Orange color from theme
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          });

          marker.addListener('click', () => {
            if (infoWindow) {
              const contentString = `
                <div style="max-width: 300px; padding: 16px; font-family: Inter, sans-serif;">
                  <div style="margin-bottom: 12px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
                      ${event.title}
                    </h3>
                    <div style="display: flex; align-items: center; gap: 6px; color: #666; font-size: 14px; margin-bottom: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>${event.city || 'Unknown'}, ${event.country || 'Unknown'}</span>
                    </div>
                    ${event.date ? `
                      <div style="display: flex; align-items: center; gap: 6px; color: #666; font-size: 14px; margin-bottom: 4px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${format(new Date(event.date), 'MMM dd, yyyy')}</span>
                      </div>
                    ` : ''}
                  </div>
                  <p style="margin: 0 0 16px 0; color: #444; font-size: 14px; line-height: 1.5;">
                    ${event.shortDescription ? event.shortDescription.substring(0, 100) + '...' : 'No description available'}
                  </p>
                  <button 
                    onclick="window.location.href='/event/${event.id}'" 
                    style="
                      background: #f97316; 
                      color: white; 
                      border: none; 
                      padding: 8px 16px; 
                      border-radius: 6px; 
                      font-size: 14px; 
                      font-weight: 500; 
                      cursor: pointer;
                      transition: background-color 0.2s;
                    "
                    onmouseover="this.style.backgroundColor='#ea580c'"
                    onmouseout="this.style.backgroundColor='#f97316'"
                  >
                    View Details
                  </button>
                </div>
              `;

              infoWindow.setContent(contentString);
              infoWindow.open(map, marker);
            }
          });
        }
      });

      // Fit map bounds to show all markers
      if (events.length > 1 && (window as any).google) {
        const bounds = new (window as any).google.maps.LatLngBounds();
        events.forEach((event) => {
          if (event.latitude && event.longitude) {
            bounds.extend({ lat: event.latitude, lng: event.longitude });
          }
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, events, infoWindow]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

export function EventMap({ events, className = "", height = "400px" }: EventMapProps) {
  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(event => 
    event.latitude && event.longitude
  );

  // Calculate center point from all events
  const center = eventsWithCoordinates.length > 0 
    ? eventsWithCoordinates.reduce(
        (acc, event) => ({
          lat: acc.lat + (event.latitude || 0) / eventsWithCoordinates.length,
          lng: acc.lng + (event.longitude || 0) / eventsWithCoordinates.length,
        }),
        { lat: 0, lng: 0 }
      )
    : { lat: 40.7128, lng: -74.0060 }; // Default to NYC

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

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Map unavailable - missing API key</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`} style={{ height }}>
      <Wrapper apiKey={apiKey}>
        <MapComponent 
          center={center} 
          zoom={eventsWithCoordinates.length === 1 ? 12 : 4}
          events={eventsWithCoordinates}
        />
      </Wrapper>
    </div>
  );
}