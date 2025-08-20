import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ExternalLink,
  Star,
  Home,
  Search,
  Menu,
} from "lucide-react";
import { useEvent } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import type { Event, Category } from "@shared/schema";

export default function EventDetails() {
  const [, params] = useRoute("/event/:id");
  const scrollRef = useScrollAnimation();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set dynamic page metadata based on event data
  const { data: event, isLoading: eventLoading } = useEvent(params?.id || "");
  usePageMetadata(
    "eventDetails",
    event ? `${event.title} - Sonic Paths` : undefined,
    event?.description,
  );

  const { data: categories = [] } = useCategories();

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
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-warm-white)",
        color: "var(--color-charcoal)",
      }}
      ref={scrollRef}
    >
      {/* Navigation Bar */}
      <nav
        className="relative z-50 border-b"
        style={{
          backgroundColor: "var(--color-warm-white)",
          borderColor: "var(--color-light-gray)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h2
                className="font-serif text-2xl"
                style={{ color: "var(--color-charcoal)" }}
              >
                Soundpath
              </h2>
            </Link>

            <div className="flex items-center gap-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 hover:shadow-sm"
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
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="hidden md:flex items-center gap-8 text-sm">
                <Link
                  href="/"
                  className="hover:opacity-70 transition-opacity duration-300"
                  style={{ color: "var(--color-dark-gray)" }}
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  className="hover:opacity-70 transition-opacity duration-300"
                  style={{ color: "var(--color-dark-gray)" }}
                >
                  Events
                </Link>
                <Link
                  href="/dashboard"
                  className="hover:opacity-70 transition-opacity duration-300"
                  style={{ color: "var(--color-dark-gray)" }}
                >
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image Section */}
      <section
        className={`relative h-96 overflow-hidden transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {event.heroImage ? (
          <img
            src={event.heroImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-soft-beige)" }}
          >
            <div
              className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: "var(--color-accent)",
                color: "var(--color-accent)",
              }}
            >
              <Star className="w-12 h-12" />
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div
          className={`scroll-animate mb-8 transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1
            className="font-serif text-4xl md:text-5xl leading-tight"
            style={{ color: "var(--color-charcoal)" }}
          >
            {event.title}
          </h1>
        </div>

        {/* Date & Location */}
        <div
          className={`scroll-animate flex flex-col md:flex-row gap-6 md:gap-12 mb-8 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
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

        {/* Short Description */}
        {event.shortDescription && (
          <div
            className={`scroll-animate mb-8 transition-all duration-1000 delay-350 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p
              className="text-xl leading-relaxed"
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
            className={`scroll-animate mb-12 transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3
              className="font-serif text-xl mb-4"
              style={{ color: "var(--color-charcoal)" }}
            >
              Categories & Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {eventCategories.map((category) => (
                <span
                  key={category.id}
                  className="px-4 py-2 text-sm rounded-full border"
                  style={{
                    backgroundColor: "var(--color-cream)",
                    color: "var(--color-charcoal)",
                    borderColor: "var(--color-light-gray)",
                  }}
                >
                  {category.name}
                </span>
              ))}
              {event.tags &&
                event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm rounded-full"
                    style={{
                      backgroundColor: "var(--color-soft-beige)",
                      color: "var(--color-dark-gray)",
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
          className={`scroll-animate mb-12 transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h3
            className="font-serif text-xl mb-6"
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
            className={`scroll-animate transition-all duration-1000 delay-600 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <a
              href={event.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-300 hover:shadow-sm"
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
              <ExternalLink className="w-4 h-4" />
              View on Instagram
            </a>
          </div>
        )}
      </section>

      {/* Footer - Kinfolk Minimal */}
      <footer
        className="section-padding"
        style={{
          backgroundColor: "var(--color-charcoal)",
          color: "var(--color-warm-white)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="scroll-animate text-center mb-16">
            <h3
              className="font-serif text-3xl mb-8"
              style={{ color: "var(--color-warm-white)" }}
            >
              Soundpath
            </h3>
            <p
              className="text-editorial max-w-lg mx-auto mb-12"
              style={{ color: "var(--color-mid-gray)" }}
            >
              Discovering breathtaking musical destinations worldwide. Where
              music and place create something extraordinary.
            </p>
          </div>

          <div className="scroll-animate scroll-animate-delay-1 grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Explore
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/events"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    All Destinations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Discover
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Latest Discoveries
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Hidden Gems
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Connect
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Submit Experience
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                About
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="scroll-animate scroll-animate-delay-2 border-t pt-8 text-center"
            style={{ borderColor: "var(--color-dark-gray)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-mid-gray)" }}>
              © 2025 Soundpath. Crafted for music lovers and wanderers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
