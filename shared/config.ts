// App Configuration - Single source of truth for app metadata
export const APP_CONFIG = {
  name: "Sonic Paths",
  tagline: "Your sonic atlas for extraordinary musical experiences",
  description: "Discover extraordinary musical experiences around the world through our curated collection of concerts, festivals, and intimate performances.",
  url: "https://sonicpaths.com", // Update with actual domain
  
  // SEO metadata for different pages
  pages: {
    home: {
      title: "Sonic Paths - Discover Extraordinary Musical Experiences Worldwide",
      description: "Explore a curated collection of musical events from rooftop DJ sets in Medellín to folk concerts in Icelandic wilderness. Your digital travel zine meets music atlas.",
      keywords: "music events, concerts, festivals, travel music, live music discovery, musical experiences"
    },
    events: {
      title: "Browse Events - Sonic Paths",
      description: "Browse our comprehensive collection of musical events worldwide. Filter by location, genre, and venue type to find your perfect musical experience.",
      keywords: "music events, concerts, browse events, live music, musical performances"
    },
    eventsPublic: {
      title: "Discover Music Events - Sonic Paths", 
      description: "Discover extraordinary musical experiences with our advanced search. Filter by country, city, genre, and venue type to find hidden musical gems.",
      keywords: "discover music, search events, music discovery, live concerts, musical events"
    },
    eventDetails: {
      title: "Event Details - Sonic Paths",
      description: "Get complete details about this musical experience including venue information, artist details, and booking information.",
      keywords: "event details, concert information, music event, live performance"
    },
    dashboard: {
      title: "Dashboard - Sonic Paths",
      description: "Manage your musical events and categories with our comprehensive dashboard for event organizers and curators.",
      keywords: "event management, music dashboard, organize events"
    },
    map: {
      title: "Map View - Sonic Paths",
      description: "Explore musical events around the world on an interactive map. Discover concerts, festivals, and performances by location.",
      keywords: "music map, events map, concerts worldwide, music discovery map"
    },
    notFound: {
      title: "Page Not Found - Sonic Paths",
      description: "The page you're looking for doesn't exist. Explore our collection of extraordinary musical experiences instead.",
      keywords: "404, page not found, music events"
    },
    contact: {
      title: "Contact Us - Sonic Paths",
      description: "Get in touch with the Sonic Paths team. Share your music discoveries, ask questions, or connect with our community.",
      keywords: "contact, get in touch, music community, questions, support"
    }
  },
  
  // Social media and Open Graph
  social: {
    twitter: "@sonicpaths", // Update with actual handle
    instagram: "@sonicpaths", // Update with actual handle
  },
  
  // Contact and support
  contact: {
    email: "hello@sonicpaths.com", // Update with actual email
    support: "support@sonicpaths.com" // Update with actual email
  }
} as const;

// Helper function to generate page title
export const generatePageTitle = (pageKey: keyof typeof APP_CONFIG.pages): string => {
  const page = APP_CONFIG.pages[pageKey];
  return page?.title || APP_CONFIG.name;
};

// Helper function to generate meta description
export const generateMetaDescription = (pageKey: keyof typeof APP_CONFIG.pages): string => {
  const page = APP_CONFIG.pages[pageKey];
  return page?.description || APP_CONFIG.description;
};

// Helper function to generate meta keywords
export const generateMetaKeywords = (pageKey: keyof typeof APP_CONFIG.pages): string => {
  const page = APP_CONFIG.pages[pageKey];
  return page?.keywords || "";
};