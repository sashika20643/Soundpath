import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../server/db.js";
import { categories, events } from "../shared/schema.js";
import type { InsertCategory, InsertEvent } from "../shared/schema.js";
import { eq, and } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the complete events data from the attached file
function loadAllEventsData() {
  try {
    const filePath = path.join(__dirname, '..', 'attached_assets', 'allevents.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    console.log("Raw file content preview:", fileContent.substring(0, 200));
    
    // Create a safer way to evaluate the JavaScript object
    // Wrap it in a function that returns the array
    const wrappedContent = `(() => { return [${fileContent.trim()}]; })()`;
    
    // Use eval (carefully) to execute the JavaScript
    const parsed = eval(wrappedContent);
    console.log(`Successfully parsed ${parsed.length} events from file`);
    return parsed;
  } catch (error) {
    console.error("Error loading events data:", error);
    return null;
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

  // Country name normalization
  const countryNormalization: Record<string, string> = {
    'USA': 'United States',
    'UK': 'United Kingdom',
    'UAE': 'United Arab Emirates'
  };

  if (parts.length >= 2) {
    const country = parts[parts.length - 1].trim();
    const normalizedCountry = countryNormalization[country] || country;
    
    return {
      continent: continentMap[regionId] || regionId,
      country: normalizedCountry,
      city: parts[0].trim()
    };
  }
  
  const normalizedLocation = countryNormalization[location] || location;
  return {
    continent: continentMap[regionId] || regionId,
    country: normalizedLocation,
    city: normalizedLocation
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

// Helper function to check if an event already exists
async function eventExists(title: string, city: string, country: string): Promise<boolean> {
  const existing = await db.select().from(events).where(
    and(
      eq(events.title, title),
      eq(events.city, city),
      eq(events.country, country)
    )
  ).limit(1);
  
  return existing.length > 0;
}

// Helper function to check if a category already exists
async function categoryExists(name: string, type: string): Promise<string | null> {
  const existing = await db.select().from(categories).where(
    and(
      eq(categories.name, name),
      eq(categories.type, type as any)
    )
  ).limit(1);
  
  return existing.length > 0 ? existing[0].id : null;
}

async function migrateAllEvents() {
  console.log("Starting comprehensive events migration...");
  
  try {
    const allEventsData = loadAllEventsData();
    
    if (!allEventsData) {
      console.log("No events data found. Exiting...");
      return;
    }
    
    console.log(`Processing ${allEventsData.length} events for migration`);
    
    // Step 1: Extract unique categories from all the data
    const genreSet = new Set<string>();
    const settingSet = new Set<string>();
    const eventTypeSet = new Set<string>();
    
    allEventsData.forEach((event: any) => {
      // Add event type
      eventTypeSet.add(event.type);
      
      // Add tags as genres and settings
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach((tag: string) => {
          // Categorize tags - music genres vs settings/vibes
          const musicGenres = ['electronic', 'classical', 'jazz', 'blues', 'opera', 'folk', 'indie', 'experimental', 'psychedelic', 'rock', 'world music', 'afro-fusion', 'hip-hop', 'reggae', 'dub', 'techno', 'house', 'trance', 'ambient', 'funk', 'soul', 'r&b', 'pop', 'country', 'bluegrass', 'metal', 'punk', 'alternative', 'grunge', 'ska', 'latin', 'salsa', 'bossa nova', 'flamenco', 'fado'];
          const settings = ['beach', 'mountain', 'desert', 'island', 'coastal', 'forest', 'river', 'underground', 'historic', 'intimate', 'eco-friendly', 'transformational', 'cultural', 'wellness', 'adventure', 'immersive', 'sustainable', 'late-night', 'community', 'art', 'elegant', 'authentic', 'alternative', 'massive', 'waterfront', 'industrial', 'traditional', 'boutique', 'sophisticated', 'outdoor', 'rural', 'urban', 'acoustic', 'artistic', 'unusual', 'socially conscious', 'african', 'rooftop', 'cave', 'monastery', 'castle', 'palace', 'garden', 'vineyard', 'warehouse', 'club', 'lounge', 'bar', 'theater', 'concert hall', 'arena', 'stadium', 'church', 'cathedral', 'temple', 'park', 'square', 'street', 'plaza'];
          
          if (musicGenres.some(genre => tag.toLowerCase().includes(genre.toLowerCase()))) {
            genreSet.add(tag);
          } else if (settings.some(setting => tag.toLowerCase().includes(setting.toLowerCase()))) {
            settingSet.add(tag);
          } else {
            // Default to genre for unclassified tags
            genreSet.add(tag);
          }
        });
      }
    });
    
    // Step 2: Create categories (with idempotency check)
    console.log("Creating categories...");
    
    const categoriesToInsert: InsertCategory[] = [];
    const categoryMap = new Map<string, string>();
    
    // Process event types
    for (const type of eventTypeSet) {
      const existingId = await categoryExists(type, "eventType");
      if (existingId) {
        categoryMap.set(`eventType:${type}`, existingId);
      } else {
        categoriesToInsert.push({ name: type, type: "eventType" as const });
      }
    }
    
    // Process genres
    for (const genre of genreSet) {
      const existingId = await categoryExists(genre, "genre");
      if (existingId) {
        categoryMap.set(`genre:${genre}`, existingId);
      } else {
        categoriesToInsert.push({ name: genre, type: "genre" as const });
      }
    }
    
    // Process settings
    for (const setting of settingSet) {
      const existingId = await categoryExists(setting, "setting");
      if (existingId) {
        categoryMap.set(`setting:${setting}`, existingId);
      } else {
        categoriesToInsert.push({ name: setting, type: "setting" as const });
      }
    }
    
    // Insert new categories
    let newCategoriesCount = 0;
    if (categoriesToInsert.length > 0) {
      const insertedCategories = await db.insert(categories).values(categoriesToInsert).returning();
      newCategoriesCount = insertedCategories.length;
      
      // Add new categories to the map
      insertedCategories.forEach(cat => {
        categoryMap.set(`${cat.type}:${cat.name}`, cat.id);
      });
    }
    
    console.log(`Created ${newCategoriesCount} new categories (${categoryMap.size} total)`);
    
    // Step 3: Transform and insert events (with idempotency check)
    console.log("Transforming and inserting events...");
    
    const eventsToInsert: InsertEvent[] = [];
    let skippedCount = 0;
    
    for (const event of allEventsData) {
      // Skip if event is undefined or missing required fields
      if (!event || !event.name || !event.location || !event.regionId) {
        skippedCount++;
        console.log("Skipping incomplete event:", event?.name || "unnamed");
        continue;
      }
      
      const location = parseLocation(event.location, event.regionId);
      
      // Check if event already exists
      const exists = await eventExists(event.name, location.city, location.country);
      if (exists) {
        skippedCount++;
        continue;
      }
      
      const eventDate = extractDate(event.events);
      
      // Create genre, setting, and event type ID arrays
      const genreIds: string[] = [];
      const settingIds: string[] = [];
      const eventTypeIds: string[] = [];
      
      // Add event type
      const eventTypeId = categoryMap.get(`eventType:${event.type}`);
      if (eventTypeId) eventTypeIds.push(eventTypeId);
      
      // Add tags to appropriate arrays
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach((tag: string) => {
          const genreId = categoryMap.get(`genre:${tag}`);
          const settingId = categoryMap.get(`setting:${tag}`);
          
          if (genreId) genreIds.push(genreId);
          if (settingId) settingIds.push(settingId);
        });
      }
      
      // Create short description from first 200 characters of description
      const shortDescription = event.description && event.description.length > 200 
        ? event.description.substring(0, 200) + "..." 
        : event.description || "";
        
      // Combine description and history for long description
      const longDescription = event.history 
        ? `${event.description || ""}\n\n**History**: ${event.history}`
        : event.description || "";
      
      eventsToInsert.push({
        title: event.name,
        heroImage: event.image || "",
        shortDescription,
        longDescription,
        date: eventDate,
        tags: event.tags || [],
        continent: location.continent,
        country: location.country,
        city: location.city,
        latitude: event.lat ? parseFloat(event.lat) : undefined,
        longitude: event.lng ? parseFloat(event.lng) : undefined,
        locationName: event.location,
        genreIds,
        settingIds,
        eventTypeIds
      });
    }
    
    // Insert events in batches to handle large volumes
    const batchSize = 100;
    let insertedEventsCount = 0;
    
    for (let i = 0; i < eventsToInsert.length; i += batchSize) {
      const batch = eventsToInsert.slice(i, i + batchSize);
      const insertedBatch = await db.insert(events).values(batch).returning();
      insertedEventsCount += insertedBatch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${insertedBatch.length} events`);
    }
    
    console.log("Comprehensive migration completed successfully!");
    
    // Log summary
    console.log("\n=== MIGRATION SUMMARY ===");
    console.log(`Events processed: ${allEventsData.length}`);
    console.log(`Events inserted: ${insertedEventsCount}`);
    console.log(`Events skipped (duplicates): ${skippedCount}`);
    console.log(`New categories created: ${newCategoriesCount}`);
    console.log(`Total categories: ${categoryMap.size}`);
    console.log(`- Event types: ${eventTypeSet.size}`);
    console.log(`- Genres: ${genreSet.size}`);
    console.log(`- Settings: ${settingSet.size}`);
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateAllEvents().catch(console.error);