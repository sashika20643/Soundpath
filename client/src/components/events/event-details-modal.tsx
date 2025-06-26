import { format } from "date-fns";
import { MapPin, Instagram, Calendar, X } from "lucide-react";
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Event Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {/* Location */}
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{formatLocation(event) || 'No location specified'}</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Created {format(new Date(event.createdAt), 'MMMM d, yyyy')}</span>
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