
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ExternalLink,
  Star,
  ChevronRight,
} from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { EventCard } from "@/components/events/event-card";
import { useEvent, useEvents } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import type { Event, Category } from "@shared/schema";

export default function EventDetails() {
  const [, params] = useRoute("/event/:id");
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Set dynamic page metadata based on event data
  const { data: event, isLoading: eventLoading } = useEvent(params?.id || "");
  const { data: allEvents = [] } = useEvents({ approved: true });
  
  usePageMetadata(
    "eventDetails",
    event ? `${event.title} - Sonic Paths` : undefined,
    event?.shortDescription,
  );

  const { data: categories = [] } = useCategories();

  // Get related events based on similar genres, settings, or location
  const getRelatedEvents = (currentEvent: Event) => {
    if (!currentEvent || allEvents.length === 0) return [];

    const relatedEvents = allEvents
      .filter(e => e.id !== currentEvent.id) // Exclude current event
      .filter(e => {
        // Filter for past events only
        const currentDate = new Date();
        currentDate.setHours(23, 59, 59, 999);
        return new Date(e.date) < currentDate;
      })
      .map(e => {
        let score = 0;
        
        // Score based on shared genres
        const sharedGenres = currentEvent.genreIds?.filter(g => e.genreIds?.includes(g)) || [];
        score += sharedGenres.length * 3;
        
        // Score based on shared settings
        const sharedSettings = currentEvent.settingIds?.filter(s => e.settingIds?.includes(s)) || [];
        score += sharedSettings.length * 2;
        
        // Score based on shared event types
        const sharedEventTypes = currentEvent.eventTypeIds?.filter(et => e.eventTypeIds?.includes(et)) || [];
        score += sharedEventTypes.length * 2;
        
        // Score based on same location
        if (e.city === currentEvent.city) score += 5;
        else if (e.country === currentEvent.country) score += 3;
        else if (e.continent === currentEvent.continent) score += 1;
        
        return { event: e, score };
      })
      .filter(item => item.score > 0) // Only include events with some relevance
      .sort((a, b) => b.score - a.score) // Sort by relevance score
      .slice(0, 6) // Take top 6
      .map(item => item.event);

    return relatedEvents;
  };

  const relatedEvents = event ? getRelatedEvents(event) : [];

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (eventLoading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        {/* Header Skeleton */}
        <div
          className="relative h-96 animate-pulse"
          style={{ backgroundColor: "var(--color-light-gray)" }}
        >
          <div className="absolute top-6 left-6">
            <div
              className="w-24 h-10 animate-pulse rounded"
              style={{ backgroundColor: "var(--color-mid-gray)" }}
            ></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div
            className="h-12 animate-pulse rounded mb-6"
            style={{ backgroundColor: "var(--color-light-gray)" }}
          ></div>
          <div className="flex gap-8 mb-8">
            <div
              className="h-6 animate-pulse rounded w-32"
              style={{ backgroundColor: "var(--color-light-gray)" }}
            ></div>
            <div
              className="h-6 animate-pulse rounded w-40"
              style={{ backgroundColor: "var(--color-light-gray)" }}
            ></div>
          </div>
          <div className="flex gap-2 mb-8">
            <div
              className="h-8 animate-pulse rounded-full w-20"
              style={{ backgroundColor: "var(--color-light-gray)" }}
            ></div>
            <div
              className="h-8 animate-pulse rounded-full w-24"
              style={{ backgroundColor: "var(--color-light-gray)" }}
            ></div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded"
                style={{ backgroundColor: "var(--color-light-gray)" }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        <div className="text-center">
          <Star
            className="w-16 h-16 mx-auto mb-6"
            style={{ color: "var(--color-mid-gray)" }}
          />
          <h1
            className="font-serif text-3xl mb-4"
            style={{ color: "var(--color-charcoal)" }}
          >
            Event Not Found
          </h1>
          <p
            className="text-editorial mb-8"
            style={{ color: "var(--color-dark-gray)" }}
          >
            The musical destination you're looking for doesn't exist or has been
            moved.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 text-sm font-medium rounded-lg border transition-all duration-300"
            style={{
              borderColor: "var(--color-light-gray)",
              color: "var(--color-charcoal)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-soft-beige)";
              e.currentTarget.style.borderColor = "var(--color-mid-gray)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--color-light-gray)";
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country, event.continent].filter(Boolean);
    return parts.join(", ");
  };

  const getEventCategories = (event: Event) => {
    const allEventCategories: Category[] = [];

    if (event.genreIds) {
      event.genreIds.forEach((id) => {
        const category = categories.find((cat) => cat.id === id);
        if (category) allEventCategories.push(category);
      });
    }

    if (event.settingIds) {
      event.settingIds.forEach((id) => {
        const category = categories.find((cat) => cat.id === id);
        if (category) allEventCategories.push(category);
      });
    }

    if (event.eventTypeIds) {
      event.eventTypeIds.forEach((id) => {
        const category = categories.find((cat) => cat.id === id);
        if (category) allEventCategories.push(category);
      });
    }

    return allEventCategories;
  };

  const eventCategories = getEventCategories(event);

  return (
    <Layout>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "var(--color-warm-white)",
          color: "var(--color-charcoal)",
        }}
      >
        {/* Back Button Section */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-500 hover:shadow-lg hover:scale-105"
            style={{
              borderColor: "var(--color-light-gray)",
              color: "var(--color-charcoal)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--color-soft-beige)";
              e.currentTarget.style.borderColor = "var(--color-mid-gray)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--color-light-gray)";
            }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Image Section */}
        <section
          className={`relative h-[500px] overflow-hidden transition-all duration-1000 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {event.heroImage ? (
            <div className="relative w-full h-full group">
              <img
                src={event.heroImage}
                alt={event.title}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  imageLoaded ? "scale-100 blur-0" : "scale-110 blur-sm"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/50"></div>
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: "var(--color-soft-beige)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
              <div
                className="w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-700 hover:scale-110 hover:rotate-12"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                <Star className="w-16 h-16 animate-pulse" />
              </div>
            </div>
          )}

          {/* Floating Title Card */}
          <div className="absolute bottom-8 left-8 right-8">
            <div
              className={`backdrop-blur-md border rounded-2xl p-8 transition-all duration-1000 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h1
                className="font-serif text-3xl md:text-4xl leading-tight mb-4"
                style={{ color: "var(--color-charcoal)" }}
              >
                {event.title}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex items-center gap-3">
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: "var(--color-mid-gray)" }}
                  />
                  <span
                    className="text-lg"
                    style={{ color: "var(--color-dark-gray)" }}
                  >
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: "var(--color-mid-gray)" }}
                  />
                  <span
                    className="text-lg"
                    style={{ color: "var(--color-dark-gray)" }}
                  >
                    {event.locationName
                      ? `${event.locationName}, ${formatLocation(event)}`
                      : formatLocation(event)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          {/* Short Description */}
          {event.shortDescription && (
            <div
              className={`mb-12 transition-all duration-1000 delay-200 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p
                className="text-2xl leading-relaxed font-light"
                style={{ color: "var(--color-dark-gray)" }}
              >
                {event.shortDescription}
              </p>
            </div>
          )}

          {/* Categories/Tags */}
          {(eventCategories.length > 0 ||
            (event.tags && event.tags.length > 0)) && (
            <div
              className={`mb-16 transition-all duration-1000 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h3
                className="font-serif text-2xl mb-6"
                style={{ color: "var(--color-charcoal)" }}
              >
                Categories & Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {eventCategories.map((category, index) => (
                  <span
                    key={category.id}
                    className={`px-4 py-2 text-sm rounded-full border transition-all duration-500 hover:scale-105 hover:shadow-md`}
                    style={{
                      backgroundColor: "var(--color-cream)",
                      color: "var(--color-charcoal)",
                      borderColor: "var(--color-light-gray)",
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {category.name}
                  </span>
                ))}
                {event.tags &&
                  event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-500 hover:scale-105 hover:shadow-md`}
                      style={{
                        backgroundColor: "var(--color-soft-beige)",
                        color: "var(--color-dark-gray)",
                        animationDelay: `${(eventCategories.length + index) * 100}ms`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Long Description */}
          <div
            className={`mb-16 transition-all duration-1000 delay-400 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3
              className="font-serif text-2xl mb-8"
              style={{ color: "var(--color-charcoal)" }}
            >
              About This Experience
            </h3>
            <div
              className="prose prose-lg max-w-none text-editorial leading-relaxed"
              style={{ color: "var(--color-dark-gray)" }}
              dangerouslySetInnerHTML={{ __html: event.longDescription }}
            />
          </div>

          {/* Instagram Link */}
          {event.instagramLink && (
            <div
              className={`mb-16 transition-all duration-1000 delay-500 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <a
                href={event.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium rounded-xl border transition-all duration-500 hover:shadow-xl hover:scale-105"
                style={{
                  borderColor: "var(--color-light-gray)",
                  color: "var(--color-charcoal)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-soft-beige)";
                  e.currentTarget.style.borderColor = "var(--color-mid-gray)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "var(--color-light-gray)";
                }}
              >
                <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                View on Instagram
              </a>
            </div>
          )}
        </section>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <section
            className="max-w-7xl mx-auto px-6 py-12"
            style={{ backgroundColor: "var(--color-cream)" }}
          >
            <div
              className={`transition-all duration-1000 delay-600 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2
                    className="font-serif text-2xl md:text-3xl mb-2"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    Related Events
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-dark-gray)" }}
                  >
                    Similar musical experiences you might enjoy
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {relatedEvents.map((relatedEvent, index) => (
                  <div
                    key={relatedEvent.id}
                    className="group cursor-pointer transition-all duration-500 hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                    onClick={() => (window.location.href = `/event/${relatedEvent.id}`)}
                  >
                    <article
                      className="bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg"
                      style={{
                        borderColor: "var(--color-light-gray)",
                      }}
                    >
                      {/* Compact Image */}
                      <div className="relative h-32 overflow-hidden">
                        {relatedEvent.heroImage ? (
                          <img
                            src={relatedEvent.heroImage}
                            alt={relatedEvent.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-soft-beige)" }}
                          >
                            <Star
                              className="w-8 h-8"
                              style={{ color: "var(--color-mid-gray)" }}
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Compact Content */}
                      <div className="p-4">
                        <h3
                          className="font-serif text-sm font-medium mb-2 line-clamp-2 group-hover:opacity-70 transition-opacity duration-300"
                          style={{ color: "var(--color-charcoal)" }}
                        >
                          {relatedEvent.title}
                        </h3>
                        
                        <div className="flex flex-col gap-1 mb-3 text-xs" style={{ color: "var(--color-mid-gray)" }}>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(relatedEvent.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{relatedEvent.city}, {relatedEvent.country}</span>
                          </div>
                        </div>

                        {/* Tags - max 2 */}
                        {relatedEvent.tags && relatedEvent.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {relatedEvent.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs rounded-full truncate"
                                style={{
                                  backgroundColor: "var(--color-cream)",
                                  color: "var(--color-dark-gray)",
                                  fontSize: "10px",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {relatedEvent.tags.length > 2 && (
                              <span
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: "var(--color-light-gray)",
                                  color: "var(--color-mid-gray)",
                                  fontSize: "10px",
                                }}
                              >
                                +{relatedEvent.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {relatedEvents.length === 6 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => (window.location.href = "/events")}
                    className="group px-6 py-3 text-xs font-medium rounded-lg border transition-all duration-500 hover:shadow-lg hover:scale-105"
                    style={{
                      borderColor: "var(--color-light-gray)",
                      color: "var(--color-charcoal)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-soft-beige)";
                      e.currentTarget.style.borderColor = "var(--color-mid-gray)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "var(--color-light-gray)";
                    }}
                  >
                    <span className="flex items-center gap-2">
                      View More Events
                      <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
