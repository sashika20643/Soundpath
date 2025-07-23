import { useParams } from "wouter";
import { Calendar, MapPin, ExternalLink, ArrowLeft, Instagram } from "lucide-react";
import { Link } from "wouter";
import { PageWrapper } from "@/layouts/PageWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-events";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: events = [], isLoading } = useEvents({});
  
  // Find the specific event
  const event = events.find(e => e.id === id);
  
  // Use scroll animations
  useScrollAnimation();
  
  // Set page metadata
  usePageMetadata('eventDetails', event ? `${event.title} - Sonic Paths` : undefined, event?.shortDescription);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date TBA";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <Skeleton className="h-10 w-24 mb-6" />
          
          {/* Hero Image Skeleton */}
          <Skeleton className="h-96 w-full rounded-lg mb-8" />
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!event) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/events-public">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6 fade-in">
          <Link href="/events-public">
            <Button variant="ghost" className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        {event.heroImage && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden shadow-lg fade-in">
            <img
              src={event.heroImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Event Header */}
        <header className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>

          {/* Event Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>
            )}
            
            {event.city && event.country && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.city}, {event.country}</span>
              </div>
            )}

            {event.instagramLink && (
              <a 
                href={event.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Follow on Instagram</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Short Description */}
          {event.shortDescription && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {event.shortDescription}
            </p>
          )}
        </header>

        {/* Event Content */}
        <div className="fade-in">
          {event.longDescription && (
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: event.longDescription 
                }}
                className="text-gray-700 leading-relaxed space-y-4"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200 fade-in">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events-public">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse More Events
              </Button>
            </Link>
            
            {event.instagramLink && (
              <a 
                href={event.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow Event
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </article>
    </PageWrapper>
  );
}