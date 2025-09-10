import { db } from "../server/db.js";
import { categories, events } from "../shared/schema.js";
import type { InsertCategory, InsertEvent } from "../shared/schema.js";
import fs from 'fs';
import path from 'path';

// Read and parse the music events data from the attached file
function loadMusicEventsData() {
  try {
    const filePath = path.join(__dirname, '..', 'attached_assets', 'Pasted--AFRICA-REGION-name-Nyege-Nyege-Festival-location-Jinja-Uganda-type--1757538830091_1757538830093.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Clean up the content - add proper array wrapper
    const cleanedContent = '[' + fileContent.trim() + ']';
    
    // Parse as JavaScript
    const musicEventsData = eval('(' + cleanedContent + ')');
    
    return musicEventsData.filter((event: any) => event && event.name); // Filter out any undefined entries
  } catch (error) {
    console.error('Error loading music events data:', error);
    return [];
  }
}

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
  console.log("Starting music events migration...");
  
  try {
    // Load the music events data from the attached file
    const musicEventsData = loadMusicEventsData();
    
    if (musicEventsData.length === 0) {
      console.log("No music events data found. Exiting...");
      return;
    }
    
    console.log(`Loaded ${musicEventsData.length} events for migration`);
    
    // Step 1: Extract unique categories from all the data
    const genreSet = new Set<string>();
    const settingSet = new Set<string>();
    const eventTypeSet = new Set<string>();
    
    musicEventsData.forEach((event: any) => {
      // Add event type
      eventTypeSet.add(event.type);
      
      // Add tags as genres and settings
      event.tags.forEach(tag => {
        // Categorize tags - music genres vs settings/vibes
        const musicGenres = ['electronic', 'classical', 'jazz', 'blues', 'opera', 'folk', 'indie', 'experimental', 'psychedelic', 'rock', 'world music', 'afro-fusion', 'hip-hop', 'reggae', 'dub', 'techno', 'house', 'trance', 'ambient'];
        const settings = ['beach', 'mountain', 'desert', 'island', 'coastal', 'forest', 'river', 'underground', 'historic', 'intimate', 'eco-friendly', 'transformational', 'cultural', 'wellness', 'adventure', 'immersive', 'sustainable', 'late-night', 'underground', 'community', 'art', 'elegant', 'authentic', 'alternative', 'massive', 'waterfront', 'industrial', 'traditional', 'boutique', 'sophisticated', 'outdoor', 'rural', 'urban', 'acoustic', 'artistic', 'unusual', 'socially conscious'];
        
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
      event.tags.forEach(tag => {
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
    
    console.log("Migration completed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateData().catch(console.error);