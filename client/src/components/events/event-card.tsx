import { Link } from "wouter";
import { Calendar, MapPin, Music } from "lucide-react";
import type { Event } from "@shared/schema";
import musicDefaultImage from "@/assets/Musicdefault.jpg";
import { OptimizedImage } from "@/components/ui/optimized-image";

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
      className="scroll-animate card-minimal rounded-lg overflow-hidden group mobile-tap mobile-float"
      style={{ 
        transitionDelay: `${index * 0.1}s`,
        animationDelay: `${index * 0.3}s`
      }}
    >
      <div className="relative h-80 overflow-hidden">
        <OptimizedImage
          src={event.heroImage || musicDefaultImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 md:group-hover:scale-105"
          fallbackSrc={musicDefaultImage}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
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

      <div className="p-4 md:p-8">
        <h3
          className="font-serif text-lg md:text-xl mb-2 md:mb-3 group-hover:opacity-70 transition-opacity duration-300"
          style={{ color: "var(--color-charcoal)" }}
        >
          {event.title}
        </h3>
        <div
          className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm"
          style={{ color: "var(--color-mid-gray)" }}
        >
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatLocation(event)}</span>
          </div>
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
            {event.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 md:px-3 text-xs rounded-full"
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
                className="px-2 py-1 md:px-3 text-xs rounded-full"
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
          className="text-sm md:text-editorial line-clamp-3 mb-4 md:mb-6 text-justify"
          style={{ color: "var(--color-dark-gray)" }}
        >
          {event.shortDescription}
        </p>
        <Link href={`/event/${event.id}`}>
          <button
            className="w-full py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium rounded-lg border transition-all duration-300 hover:shadow-sm mobile-tap mobile-bounce group/button relative overflow-hidden"
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
            <span className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
              View Details
              <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                →
              </span>
            </span>
            {/* Mobile ripple effect */}
            <div className="absolute inset-0 rounded-lg scale-0 transition-transform duration-300 md:hidden" 
                 style={{ backgroundColor: "var(--color-accent)", opacity: 0.1 }} />
          </button>
        </Link>
      </div>
    </article>
  );
}