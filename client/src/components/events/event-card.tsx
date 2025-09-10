import { Link } from "wouter";
import { Calendar, MapPin, Music } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  index?: number;
  showNewBadge?: boolean;
}

export function EventCard({ event, index = 0, showNewBadge = false }: EventCardProps) {
  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <article
      className="scroll-animate card-minimal rounded-lg overflow-hidden group"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-80 overflow-hidden">
        {event.heroImage ? (
          <img
            src={event.heroImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center" style="background-color: var(--color-soft-beige)">
                    <div class="w-16 h-16 rounded-full border-2 flex items-center justify-center" style="border-color: var(--color-mid-gray); color: var(--color-mid-gray);">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-2.895 2 2 2s2-.895 2-2M9 19c0-1.105.895-2 2-2s2 .895 2 2m0-14c0 1.105-2.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2z"></path>
                      </svg>
                    </div>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-soft-beige)" }}
          >
            <div
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: "var(--color-mid-gray)",
                color: "var(--color-mid-gray)",
              }}
            >
              <Music className="w-8 h-8" />
            </div>
          </div>
        )}
        {showNewBadge && (
          <div className="absolute top-6 right-6">
            <span
              className="px-3 py-1 text-xs font-medium tracking-wide uppercase"
              style={{
                backgroundColor: "var(--color-charcoal)",
                color: "var(--color-warm-white)",
              }}
            >
              New
            </span>
          </div>
        )}
      </div>

      <div className="p-8">
        <h3
          className="font-serif text-xl mb-3 group-hover:opacity-70 transition-opacity duration-300"
          style={{ color: "var(--color-charcoal)" }}
        >
          {event.title}
        </h3>
        <div
          className="flex items-center gap-4 mb-4 text-sm"
          style={{ color: "var(--color-mid-gray)" }}
        >
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{formatLocation(event)}</span>
          </div>
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: "var(--color-cream)",
                  color: "var(--color-dark-gray)",
                  border: "1px solid var(--color-light-gray)",
                }}
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: "var(--color-light-gray)",
                  color: "var(--color-mid-gray)",
                }}
              >
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <p
          className="text-editorial line-clamp-3 mb-6"
          style={{ color: "var(--color-dark-gray)" }}
        >
          {event.shortDescription}
        </p>
        <Link href={`/event/${event.id}`}>
          <button
            className="w-full py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-300 hover:shadow-sm"
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
            View Details
          </button>
        </Link>
      </div>
    </article>
  );
}