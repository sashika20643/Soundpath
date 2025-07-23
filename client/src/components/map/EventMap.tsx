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
  
  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(event => 
    event.latitude && event.longitude
  );

  console.log('🗺️ EventMap loaded with', eventsWithCoordinates.length, 'events:', eventsWithCoordinates.map(e => ({ title: e.title, city: e.city, country: e.country })));

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