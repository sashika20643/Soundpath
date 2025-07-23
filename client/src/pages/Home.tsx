import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Music, ArrowRight, Sparkles } from "lucide-react";
import { PageWrapper } from "@/layouts/PageWrapper";
import { EventCard } from "@/features/events/components/EventCard";
import { EventSearchForm } from "@/features/events/components/EventSearchForm";
import { CreateEventForm } from "@/features/events/components/CreateEventForm";
import { EventMap } from "@/components/map/EventMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-events";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { apiRequest } from "@/lib/api";
import { Event, EventFilters, EventFormData } from "@/types";

export function Home() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [searchFilters, setSearchFilters] = useState<EventFilters>({ approved: true });
  
  // Use scroll animations
  useScrollAnimation();
  
  // Set page metadata
  usePageMetadata('home');

  // Fetch events
  const { data: allEvents = [], isLoading } = useEvents(searchFilters);
  
  // Latest discoveries (6 most recent events by date)
  const latestEvents = allEvents
    .filter(event => event.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 6);

  // Hidden gems (6 oldest events by date, randomized)
  const hiddenGems = allEvents
    .filter(event => event.date)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
    .slice(0, 12)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const handleSearch = (filters: EventFilters) => {
    setSearchFilters({ ...filters, approved: true });
  };

  const handleEventSubmit = async (eventData: EventFormData) => {
    try {
      await apiRequest('POST', `/api/events`, eventData);
      setShowEventForm(false);
      // Refresh events could be handled by React Query automatically
    } catch (error) {
      console.error('Error submitting event:', error);
      throw error;
    }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?cs=srgb&dl=pexels-wendy-wei-1190297.jpg&fm=jpg")'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6 fade-in">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mr-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold">
                Sonic Paths
              </h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto fade-in">
              Discover extraordinary musical experiences around the world. From rooftop DJ sets in Medellín to folk concerts in Icelandic wilderness.
            </p>

            <div className="max-w-2xl mx-auto mb-8 fade-in">
              <EventSearchForm 
                onSearch={handleSearch}
                placeholder="Search events by title, city, or description..."
                showAdvanced={true}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in">
              <Button 
                onClick={() => setShowEventForm(!showEventForm)}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Submit Your Event
              </Button>
              
              <Link href="/events-public">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
                >
                  Browse All Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Submission Form */}
      {showEventForm && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CreateEventForm
              onSubmit={handleEventSubmit}
              title="Submit Your Musical Event"
              buttonText="Submit Event"
              fromDashboard={false}
            />
          </div>
        </section>
      )}

      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore Events Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover musical events across the globe. Click on markers to see event details and get directions.
            </p>
          </div>
          
          <div className="fade-in">
            <EventMap 
              events={allEvents} 
              height="500px"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Last Discoveries Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">🕵️‍♀️</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Last Discoveries
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Fresh musical experiences just added to our collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              latestEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>

          {latestEvents.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recent events found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Hidden Gems Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">💎</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Hidden Gems
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Timeless musical treasures waiting to be rediscovered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              hiddenGems.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>

          {hiddenGems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hidden gems found.</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}