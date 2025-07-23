import { useState } from "react";
import { PageWrapper } from "@/layouts/PageWrapper";
import { EventCard } from "@/features/events/components/EventCard";
import { EventFilters } from "@/features/events/components/EventFilters";
import { EventSearchForm } from "@/features/events/components/EventSearchForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-events";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { EventFilters as EventFiltersType } from "@/types";
import { Grid, List, Filter, Search } from "lucide-react";

export function EventsPublic() {
  const [filters, setFilters] = useState<EventFiltersType>({ approved: true });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Set page metadata
  usePageMetadata('eventsPublic');

  // Fetch events
  const { data: events = [], isLoading } = useEvents(filters);

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters({ ...newFilters, approved: true });
  };

  const handleSearch = (searchFilters: EventFiltersType) => {
    setFilters({ ...filters, ...searchFilters, approved: true });
  };

  return (
    <PageWrapper>
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Musical Events
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our curated collection of musical experiences from around the world. 
              Filter by location, genre, or search for specific events to find your next sonic adventure.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <EventSearchForm 
              onSearch={handleSearch}
              showAdvanced={true}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full justify-center"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                </div>

                {/* Filters */}
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                  <EventFilters 
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isLoading ? 'Loading...' : `${events.length} Events Found`}
                  </h2>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Events Grid/List */}
              {isLoading ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : events.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {events.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      showApprovalStatus={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find more events.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setFilters({ approved: true })}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}