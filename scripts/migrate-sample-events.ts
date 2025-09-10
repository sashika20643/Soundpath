import { db } from "../server/db.js";
import { categories, events } from "../shared/schema.js";
import type { InsertCategory, InsertEvent } from "../shared/schema.js";

// Sample music events data from different regions
const sampleMusicEventsData = [
  // AFRICA REGION
  {
    name: "Nyege Nyege Festival",
    location: "Jinja, Uganda",
    type: "festival",
    description: "Set along the banks of the Nile River, Nyege Nyege has emerged as one of Africa's most vital music festivals, showcasing experimental electronic music from across the continent. The four-day immersive experience combines forward-thinking musical curation with the natural beauty of Uganda, creating a cultural melting pot where traditional African sounds collide with cutting-edge electronic production.",
    image: "https://images.unsplash.com/photo-1603224853517-991fa317d42c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "0.43861",
    lng: "33.19750",
    rating: "4.8",
    tags: ["electronic", "experimental", "african", "underground"],
    website: "https://nyegenyege.com/",
    ticketUrl: "https://nyegenyege.com/tickets",
    history: "Founded in 2015, Nyege Nyege (meaning 'the feeling of a sudden uncontrollable urge to move, shake or dance' in Luganda) has grown from a small gathering to an internationally acclaimed festival. Despite occasional controversies, it has become a crucial platform for emerging African electronic musicians and a celebration of the continent's diverse sonic landscapes.",
    events: [
      { name: "Opening Ceremony - Nile Stage", date: "September 15, 2023" },
      { name: "Dark Star Showcase", date: "September 16, 2023" },
      { name: "Hibotep & Friends", date: "September 17, 2023" },
      { name: "Closing Ritual - Beach Stage", date: "September 18, 2023" }
    ],
    performances: [
      { artist: "Kampire", description: "East African bass DJ and core member of Nyege Nyege collective" },
      { artist: "MC Yallah & Debmaster", description: "Kenyan-Ugandan rapper and Parisian producer delivering intense electronic music" },
      { artist: "Otim Alpha", description: "Pioneer of electro acholi, reimagining traditional Ugandan wedding music" },
      { artist: "Hibotep", description: "Ethiopian experimental DJ pushing boundaries with atmospheric sets" }
    ],
    regionId: "africa"
  },
  {
    name: "Lake of Stars Festival",
    location: "Lake Malawi, Malawi",
    type: "festival",
    description: "Held on the stunning shores of Lake Malawi (the third largest lake in Africa), Lake of Stars brings together music, art, and culture against one of the most breathtaking backdrops imaginable. The festival combines international acts with local Malawian talent, creating a unique cultural exchange while contributing significantly to the local economy and tourism.",
    image: "https://images.unsplash.com/photo-1566055909643-a51b4271d2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "-14.03111",
    lng: "34.92111",
    rating: "4.7",
    tags: ["world music", "beach", "cultural", "afro-fusion"],
    website: "https://www.lakeofstars.org/",
    ticketUrl: "https://www.lakeofstars.org/tickets",
    history: "Founded in 2004 by British-Malawian Will Jameson, Lake of Stars was created to promote Malawian arts and tourism. Over the years, it has grown to become one of Africa's most respected music festivals and has generated millions in revenue for the Malawian economy while showcasing the country's rich cultural heritage.",
    events: [
      { name: "Beach Stage Opening", date: "September 27, 2023" },
      { name: "Cultural Workshops", date: "September 28, 2023" },
      { name: "Main Stage Headliners", date: "September 29, 2023" },
      { name: "Sunset Sessions", date: "September 30, 2023" }
    ],
    performances: [
      { artist: "Tay Grin", description: "Malawian hip-hop artist known as 'The Nyau King'" },
      { artist: "Sonye", description: "Popular band blending traditional Malawian sounds with modern instrumentation" },
      { artist: "Faith Mussa", description: "One-man band using loop technology to create layered traditional Malawian sounds" },
      { artist: "Madalitso Band", description: "Two-piece band playing homemade instruments with infectious rhythms" }
    ],
    regionId: "africa"
  },
  {
    name: "Beneath the Baobabs",
    location: "Kilifi, Kenya",
    type: "festival",
    description: "Set in an ancient baobab forest on Kenya's coast, this transformative festival creates a magical environment where music, art, and nature intertwine. The event focuses on sustainability and community, with stages built from natural materials and powered by renewable energy. Dancing beneath stars that shine through the branches of thousand-year-old baobab trees creates an unforgettable experience.",
    image: "https://images.unsplash.com/photo-1591184510259-b6f1be3d7aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "-3.63111",
    lng: "39.85000",
    rating: "4.9",
    tags: ["electronic", "eco-friendly", "transformational", "cultural"],
    website: "https://www.kilifibaobabs.com",
    ticketUrl: "https://www.kilifibaobabs.com/tickets",
    history: "What began as a small New Year's gathering among friends has evolved into a cultural institution that brings together diverse communities while respecting the sacred forest land. The festival places a strong emphasis on environmental conservation and supports local communities through various initiatives.",
    events: [
      { name: "Opening Ceremony", date: "December 28, 2023" },
      { name: "Forest Stage Takeover", date: "December 29, 2023" },
      { name: "Sunrise Sessions", date: "December 30, 2023" },
      { name: "New Year's Celebration", date: "December 31, 2023" }
    ],
    performances: [
      { artist: "Idd Aziz", description: "Kenyan vocalist fusing traditional Taarab music with contemporary sounds" },
      { artist: "Suraj", description: "Berlin-based Kenyan DJ known for deep, hypnotic sets" },
      { artist: "Coco Em", description: "Nairobi-based DJ blending African electronic music with global bass" },
      { artist: "Olith Ratego", description: "Master of Dodo, a traditional form of Luo music from Western Kenya" }
    ],
    regionId: "africa"
  },

  // EUROPE REGION
  {
    name: "Meadows in the Mountains",
    location: "Rhodope Mountains, Bulgaria",
    type: "festival",
    description: "Perched high in Bulgaria's mystical Rhodope Mountains, Meadows in the Mountains offers a truly magical festival experience. At an elevation of 850 meters, attendees dance above the clouds as misty mountain views provide a breathtaking backdrop. The festival balances electronic music with folk traditions, sustainability initiatives, and a strong community ethos. Solar-powered stages, compostable toilets, and locally-sourced food embody the festival's commitment to environmental consciousness.",
    image: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "41.85944",
    lng: "24.84222",
    rating: "4.9",
    tags: ["electronic", "mountain", "eco-friendly", "immersive"],
    website: "https://www.meadowsinthemountains.com/",
    ticketUrl: "https://www.meadowsinthemountains.com/tickets",
    history: "Started in 2011 by the Sasse family, Meadows in the Mountains began as an intimate gathering of friends. The festival has maintained its personal touch while growing into an internationally recognized event known for its breathtaking location and commitment to supporting the local Bulgarian community.",
    events: [
      { name: "Welcome Ceremony", date: "June 2, 2023" },
      { name: "Sunrise Stage - Mountain Top", date: "June 3, 2023" },
      { name: "Yoga & Wellness Sessions", date: "June 4, 2023" },
      { name: "Closing Celebration", date: "June 5, 2023" }
    ],
    performances: [
      { artist: "Dora", description: "Swiss/Bulgarian DJ blending electronic sounds with Balkan elements" },
      { artist: "Stavroz", description: "Belgian collective known for organic electronic compositions" },
      { artist: "Local Bulgarian Folk Musicians", description: "Traditional performances showcasing regional heritage" },
      { artist: "Sassy J", description: "Renowned selector known for eclectic, soulful sets" }
    ],
    regionId: "europe"
  },
  {
    name: "Teatro La Fenice",
    location: "Venice, Italy",
    type: "venue",
    description: "One of the most famous and renowned opera houses in history, Teatro La Fenice ('The Phoenix') has lived up to its name by rising from the ashes of multiple fires. The opulent interior features gold leaf, ornate stucco work, and plush royal blue seating, creating perfect acoustics for opera and classical performances. The experience of attending a performance here, surrounded by centuries of musical history in the magical setting of Venice, is truly unforgettable.",
    image: "https://images.unsplash.com/photo-1553434320-e9f5757e5fa2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "45.43361",
    lng: "12.33333",
    rating: "4.9",
    tags: ["opera", "classical", "historic", "elegant"],
    website: "https://www.teatrolafenice.it/",
    ticketUrl: "https://www.teatrolafenice.it/en/tickets/",
    history: "First opened in 1792, the theater's name reflects its remarkable resilience, having been rebuilt after fires in 1836 and 1996. Many important operas premiered here, including works by Rossini, Bellini, Donizetti, and Verdi. The most recent reconstruction meticulously restored the theater to its original splendor.",
    events: [
      { name: "La Traviata by Giuseppe Verdi", date: "Year-round performances" },
      { name: "The Barber of Seville by Gioachino Rossini", date: "Seasonal" },
      { name: "Symphony Orchestra Concerts", date: "Monthly" },
      { name: "New Year's Concert", date: "December 31, 2023" }
    ],
    performances: [
      { artist: "Teatro La Fenice Orchestra", description: "The resident orchestra of international acclaim" },
      { artist: "Teatro La Fenice Chorus", description: "Exceptional vocal ensemble maintaining operatic traditions" },
      { artist: "International opera stars", description: "Rotating cast of world-renowned singers" },
      { artist: "Guest conductors", description: "Leading maestros from around the world" }
    ],
    regionId: "europe"
  },

  // NORTH AMERICA REGION
  {
    name: "Desert Daze",
    location: "Lake Perris, California, USA",
    type: "festival",
    description: "Set against the otherworldly backdrop of Lake Perris and its distinctive rock formations, Desert Daze has earned a reputation as one of the most forward-thinking music festivals in America. The event blends psychedelic rock, experimental electronic music, and avant-garde art installations in a surreal desert landscape. The lakeside setting allows attendees to swim by day while enjoying mind-expanding musical performances at night under star-filled skies and elaborate light shows.",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "33.85734",
    lng: "-117.17509",
    rating: "4.8",
    tags: ["psychedelic", "rock", "experimental", "immersive"],
    website: "https://desertdaze.org/",
    ticketUrl: "https://desertdaze.org/tickets/",
    history: "Founded in 2012 by Phil Pirrone, Desert Daze began as a small event in the California desert before growing into a major alternative to more commercial festivals. Despite its growth, it has maintained its independent spirit and commitment to creating transformative experiences through carefully curated lineups.",
    events: [
      { name: "Moon Stage Opening", date: "October 12, 2023" },
      { name: "Mystic Bazaar Workshops", date: "October 13, 2023" },
      { name: "Late Night Dome Performances", date: "October 14, 2023" },
      { name: "Sunset Sessions at the Lake", date: "October 15, 2023" }
    ],
    performances: [
      { artist: "Tame Impala", description: "Australian psychedelic music project led by Kevin Parker" },
      { artist: "Stereolab", description: "Pioneering experimental pop group with electronic and krautrock influences" },
      { artist: "The Black Angels", description: "Psychedelic rock band known for their hypnotic sound" },
      { artist: "Flying Lotus", description: "Electronic music producer blending jazz, hip-hop and psychedelia" }
    ],
    regionId: "north-america"
  },
  {
    name: "Burning Man",
    location: "Black Rock Desert, Nevada, USA",
    type: "festival",
    description: "More than a festival, Burning Man is a temporary city that emerges from the dust of Nevada's Black Rock Desert for one week each year. This experimental community celebrates radical self-expression, self-reliance, and art through massive installations, mutant vehicles, and hundreds of sound camps playing every genre of music imaginable. From sunrise yoga sessions accompanied by ambient music to late-night techno sets on desert-stranded pirate ships, Burning Man offers countless musical experiences against the backdrop of an otherworldly landscape.",
    image: "https://images.unsplash.com/photo-1554282350-e1eb9b1ec67d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lat: "40.78361",
    lng: "-119.20500",
    rating: "4.9",
    tags: ["transformational", "art", "electronic", "experimental"],
    website: "https://burningman.org/",
    ticketUrl: "https://burningman.org/event/participation/volunteering/",
    history: "Founded on San Francisco's Baker Beach in 1986 by Larry Harvey and Jerry James, Burning Man moved to the Black Rock Desert in 1990. From humble beginnings with 20 people, it has grown into a 70,000-person phenomenon while maintaining its core values of radical inclusion, decommodification, and leave no trace.",
    events: [
      { name: "Gate Opening", date: "August 27, 2023" },
      { name: "Man Burn", date: "September 2, 2023" },
      { name: "Temple Burn", date: "September 3, 2023" },
      { name: "Exodus", date: "September 4, 2023" }
    ],
    performances: [
      { artist: "Mayan Warrior", description: "Legendary art car combining cutting-edge light technology with Mexican cultural elements" },
      { artist: "Robot Heart", description: "Desert outpost for deep, mystical house and techno" },
      { artist: "Distrikt", description: "One of the most popular sound camps offering high-energy beats" },
      { artist: "Duck Pond", description: "Known for eclectic selection of funky house music" }
    ],
    regionId: "north-america"
  }
];

// Helper function to parse location into continent, country, city
function parseLocation(location: string, regionId: string): { continent: string; country: string; city: string } {
  const parts = location.split(', ');
  
  // Map regionId to continent
  const continentMap: Record<string, string> = {
    'africa': 'Africa',
    'europe': 'Europe', 
    'north-america': 'North America',
    'south-america': 'South America',
    'asia': 'Asia',
    'oceania': 'Oceania'
  };

  if (parts.length >= 2) {
    return {
      continent: continentMap[regionId] || regionId,
      country: parts[parts.length - 1].trim(),
      city: parts[0].trim()
    };
  }
  
  return {
    continent: continentMap[regionId] || regionId,
    country: location,
    city: location
  };
}

// Helper function to extract earliest date from events array
function extractDate(events: any[]): string {
  if (!events || events.length === 0) {
    return "2024-01-01"; // Default date
  }
  
  // Try to find a valid date from the events
  for (const event of events) {
    if (event.date && event.date !== "Year-round performances" && event.date !== "Seasonal" && event.date !== "Monthly" && event.date !== "Weekly" && event.date !== "Nightly until 4 AM") {
      // Try to parse the date
      const dateStr = event.date;
      if (dateStr.includes(",")) {
        try {
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
          }
        } catch (e) {
          // Continue to next event
        }
      }
    }
  }
  
  return "2024-01-01"; // Default fallback
}

async function migrateData() {
  console.log("Starting sample music events migration...");
  
  try {
    const musicEventsData = sampleMusicEventsData;
    
    console.log(`Processing ${musicEventsData.length} sample events for migration`);
    
    // Step 1: Extract unique categories from all the data
    const genreSet = new Set<string>();
    const settingSet = new Set<string>();
    const eventTypeSet = new Set<string>();
    
    musicEventsData.forEach((event: any) => {
      // Add event type
      eventTypeSet.add(event.type);
      
      // Add tags as genres and settings
      event.tags.forEach((tag: string) => {
        // Categorize tags - music genres vs settings/vibes
        const musicGenres = ['electronic', 'classical', 'jazz', 'blues', 'opera', 'folk', 'indie', 'experimental', 'psychedelic', 'rock', 'world music', 'afro-fusion', 'hip-hop', 'reggae', 'dub', 'techno', 'house', 'trance', 'ambient'];
        const settings = ['beach', 'mountain', 'desert', 'island', 'coastal', 'forest', 'river', 'underground', 'historic', 'intimate', 'eco-friendly', 'transformational', 'cultural', 'wellness', 'adventure', 'immersive', 'sustainable', 'late-night', 'underground', 'community', 'art', 'elegant', 'authentic', 'alternative', 'massive', 'waterfront', 'industrial', 'traditional', 'boutique', 'sophisticated', 'outdoor', 'rural', 'urban', 'acoustic', 'artistic', 'unusual', 'socially conscious', 'african'];
        
        if (musicGenres.some(genre => tag.toLowerCase().includes(genre.toLowerCase()))) {
          genreSet.add(tag);
        } else if (settings.some(setting => tag.toLowerCase().includes(setting.toLowerCase()))) {
          settingSet.add(tag);
        } else {
          // Default to genre for unclassified tags
          genreSet.add(tag);
        }
      });
    });
    
    // Step 2: Create categories
    console.log("Creating categories...");
    
    const categoriesToInsert: InsertCategory[] = [
      // Event types
      ...Array.from(eventTypeSet).map(type => ({ name: type, type: "eventType" as const })),
      // Genres
      ...Array.from(genreSet).map(genre => ({ name: genre, type: "genre" as const })),
      // Settings
      ...Array.from(settingSet).map(setting => ({ name: setting, type: "setting" as const }))
    ];
    
    const insertedCategories = await db.insert(categories).values(categoriesToInsert).returning();
    console.log(`Created ${insertedCategories.length} categories`);
    
    // Create lookup maps for category IDs
    const categoryMap = new Map<string, string>();
    insertedCategories.forEach(cat => {
      categoryMap.set(`${cat.type}:${cat.name}`, cat.id);
    });
    
    // Step 3: Transform and insert events
    console.log("Transforming and inserting events...");
    
    const eventsToInsert: InsertEvent[] = musicEventsData.map((event: any) => {
      const location = parseLocation(event.location, event.regionId);
      const eventDate = extractDate(event.events);
      
      // Create genre, setting, and event type ID arrays
      const genreIds: string[] = [];
      const settingIds: string[] = [];
      const eventTypeIds: string[] = [];
      
      // Add event type
      const eventTypeId = categoryMap.get(`eventType:${event.type}`);
      if (eventTypeId) eventTypeIds.push(eventTypeId);
      
      // Add tags to appropriate arrays
      event.tags.forEach((tag: string) => {
        const genreId = categoryMap.get(`genre:${tag}`);
        const settingId = categoryMap.get(`setting:${tag}`);
        
        if (genreId) genreIds.push(genreId);
        if (settingId) settingIds.push(settingId);
      });
      
      // Create short description from first 200 characters of description
      const shortDescription = event.description.length > 200 
        ? event.description.substring(0, 200) + "..." 
        : event.description;
        
      // Combine description and history for long description
      const longDescription = `${event.description}\n\n**History**: ${event.history}`;
      
      return {
        title: event.name,
        heroImage: event.image,
        shortDescription,
        longDescription,
        date: eventDate,
        tags: event.tags,
        continent: location.continent,
        country: location.country,
        city: location.city,
        latitude: parseFloat(event.lat),
        longitude: parseFloat(event.lng),
        locationName: event.location,
        genreIds,
        settingIds,
        eventTypeIds,
        approved: true // Approve all imported events
      };
    });
    
    const insertedEvents = await db.insert(events).values(eventsToInsert).returning();
    console.log(`Successfully inserted ${insertedEvents.length} events`);
    
    console.log("Sample migration completed successfully!");
    
    // Log summary
    console.log("\n=== MIGRATION SUMMARY ===");
    console.log(`Events created: ${insertedEvents.length}`);
    console.log(`Categories created: ${insertedCategories.length}`);
    console.log(`- Event types: ${eventTypeSet.size}`);
    console.log(`- Genres: ${genreSet.size}`);
    console.log(`- Settings: ${settingSet.size}`);
    console.log("\nSample events from:");
    console.log("- Africa: 3 events");
    console.log("- Europe: 2 events");
    console.log("- North America: 2 events");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateData().catch(console.error);