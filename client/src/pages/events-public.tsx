import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { EventCard } from "@/components/events/event-card";
import { EventSearchForm } from "@/components/events/event-search-form";
import { Pagination } from "@/components/ui/pagination";
import { useEvents } from "@/hooks/use-events";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { EventsFilters } from "@/lib/api";
import type { Event } from "@shared/schema";

const ITEMS_PER_PAGE = 9;

export default function EventsPublic() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EventsFilters>({});
  const scrollRef = useScrollAnimation();

  const { data: allEvents = [], isLoading } = useEvents(filters);

  // Calculate pagination
  const totalEvents = allEvents.length;
  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = allEvents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: EventsFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Search is handled automatically by the filters
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div
        ref={scrollRef}
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        {/* Hero Section */}
        <section className="section-padding pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="scroll-animate mb-16">
              <h1
                className="font-serif text-5xl md:text-6xl leading-tight mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                Discover Musical
                <br />
                <span className="italic">Experiences</span>
              </h1>
              <p
                className="text-editorial text-xl max-w-2xl mx-auto leading-relaxed"
                style={{ color: "var(--color-dark-gray)" }}
              >
                Explore extraordinary musical destinations worldwide. From
                intimate venues to grand amphitheaters, find experiences that
                resonate with your soul.
              </p>
            </div>

            {/* Search Form */}
            <div className="scroll-animate scroll-animate-delay-1">
              <EventSearchForm
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="scroll-animate mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="font-serif text-3xl"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  {totalEvents > 0
                    ? `${totalEvents} Events Found`
                    : "No Events Found"}
                </h2>
                {totalEvents > 0 && (
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>
              {Object.values(filters).some((value) =>
                Array.isArray(value) ? value.length > 0 : Boolean(value),
              ) && (
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span
                      className="px-3 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: "var(--color-cream)",
                        color: "var(--color-charcoal)",
                      }}
                    >
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.country && (
                    <span
                      className="px-3 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: "var(--color-cream)",
                        color: "var(--color-charcoal)",
                      }}
                    >
                      Country: {filters.country}
                    </span>
                  )}
                  {filters.city && (
                    <span
                      className="px-3 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: "var(--color-cream)",
                        color: "var(--color-charcoal)",
                      }}
                    >
                      City: {filters.city}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="grid-magazine">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div
                    key={i}
                    className="scroll-animate card-minimal rounded-lg overflow-hidden"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div
                      className="h-80 animate-pulse"
                      style={{ backgroundColor: "var(--color-light-gray)" }}
                    ></div>
                    <div className="p-8">
                      <div
                        className="h-6 animate-pulse rounded mb-3"
                        style={{ backgroundColor: "var(--color-light-gray)" }}
                      ></div>
                      <div className="flex gap-4 mb-4">
                        <div
                          className="h-4 animate-pulse rounded w-24"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-32"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div
                          className="h-6 animate-pulse rounded-full w-16"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-6 animate-pulse rounded-full w-20"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div
                          className="h-4 animate-pulse rounded"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-4/5"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-3/5"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div
                        className="h-10 animate-pulse rounded"
                        style={{ backgroundColor: "var(--color-light-gray)" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentEvents.length > 0 ? (
              <div className="grid-magazine">
                {currentEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="scroll-animate text-center py-20">
                <div
                  className="w-24 h-24 rounded-full border-2 flex items-center justify-center mx-auto mb-8"
                  style={{
                    borderColor: "var(--color-light-gray)",
                    color: "var(--color-mid-gray)",
                  }}
                >
                  <span className="text-4xl">🎵</span>
                </div>
                <h3
                  className="font-serif text-2xl mb-4"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  No Events Found
                </h3>
                <p
                  className="text-editorial max-w-md mx-auto"
                  style={{ color: "var(--color-dark-gray)" }}
                >
                  Try adjusting your search filters to discover more musical
                  experiences.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="scroll-animate">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
