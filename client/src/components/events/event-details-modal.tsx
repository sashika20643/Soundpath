import { format } from "date-fns";
import { MapPin, Instagram, Calendar, X, Star, CheckCircle, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories } from "@/hooks/use-categories";
import type { Event } from "@shared/schema";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const { data: genres = [] } = useCategories({ type: "genre" });
  const { data: settings = [] } = useCategories({ type: "setting" });
  const { data: eventTypes = [] } = useCategories({ type: "eventType" });

  if (!event) return null;

  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country, event.continent].filter(Boolean);
    return parts.join(', ');
  };

  const getEventGenres = () => {
    if (!event.genreIds || event.genreIds.length === 0) return [];
    return genres.filter(genre => event.genreIds?.includes(genre.id));
  };

  const getEventSettings = () => {
    if (!event.settingIds || event.settingIds.length === 0) return [];
    return settings.filter(setting => event.settingIds?.includes(setting.id));
  };

  const getEventTypes = () => {
    if (!event.eventTypeIds || event.eventTypeIds.length === 0) return [];
    return eventTypes.filter(eventType => event.eventTypeIds?.includes(eventType.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Image */}
          {event.heroImage && (
            <div className="w-full h-64 overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={event.heroImage} 
                alt={event.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Event Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Approval Status */}
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-5 h-5 ${event.approved ? 'text-green-600' : 'text-orange-500'}`} />
                <span className={`font-medium ${event.approved ? 'text-green-700' : 'text-orange-600'}`}>
                  {event.approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>

            {/* Featured Status */}
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className={`w-5 h-5 ${event.featured ? 'text-yellow-500' : 'text-gray-400'}`} />
                <span className={`font-medium ${event.featured ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {event.featured ? 'Featured' : 'Not Featured'}
                </span>
              </div>
            </div>

            {/* Event Date */}
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">
                  {format(new Date(event.date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Event Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Location Details</h4>
              
              {/* Full Location */}
              <div className="flex items-start text-gray-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div>{formatLocation(event) || 'No location specified'}</div>
                  {event.locationName && (
                    <div className="text-sm text-gray-500">Venue: {event.locationName}</div>
                  )}
                  {(event.latitude && event.longitude) && (
                    <div className="text-sm text-gray-500">
                      Coordinates: {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>

              {/* Instagram Link */}
              {event.instagramLink && (
                <div className="flex items-center">
                  <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                  <a 
                    href={event.instagramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 underline"
                  >
                    View on Instagram
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Timestamps</h4>
              
              {/* Created Date */}
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Created {format(new Date(event.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}</span>
              </div>

              {/* Updated Date */}
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Updated {format(new Date(event.updatedAt), 'MMMM d, yyyy \'at\' h:mm a')}</span>
              </div>

              {/* Event ID */}
              <div className="flex items-start text-gray-600">
                <Globe className="w-4 h-4 mr-2 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Event ID</div>
                  <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1 break-all">
                    {event.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Short Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{event.shortDescription}</p>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.longDescription}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {getEventGenres().length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {getEventGenres().map(genre => (
                    <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            {getEventSettings().length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Settings</h4>
                <div className="flex flex-wrap gap-2">
                  {getEventSettings().map(setting => (
                    <Badge key={setting.id} variant="outline">{setting.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            {getEventTypes().length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Event Types</h4>
                <div className="flex flex-wrap gap-2">
                  {getEventTypes().map(eventType => (
                    <Badge key={eventType.id} variant="default">{eventType.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}