import { useState } from 'react';
import { MapPin, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Event } from '@shared/schema';

interface EventMapProps {
  events: Event[];
  className?: string;
  height?: string;
}

export function EventMap({ events, className = "", height = "400px" }: EventMapProps) {
  const [showMap, setShowMap] = useState(false);
  
  // Filter events that have coordinates
  const eventsWithCoordinates = events.filter(event => 
    event.latitude && event.longitude
  );

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

  if (!showMap) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700`} style={{ height }}>
        <div className="text-center space-y-4">
          <div className="relative">
            <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {eventsWithCoordinates.length}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Interactive Event Map
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Discover {eventsWithCoordinates.length} musical experiences across the globe with clickable markers and event details.
          </p>
          <Button 
            onClick={() => setShowMap(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4" />
            Load Interactive Map
          </Button>
        </div>
      </div>
    );
  }

  // Simple location grid fallback
  return (
    <div className={`${className} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6`} style={{ height }}>
      <div className="h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Event Locations ({eventsWithCoordinates.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {eventsWithCoordinates.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer" onClick={() => window.location.href = `/event/${event.id}`}>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {event.city}, {event.country}
                  </p>
                  {event.date && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}