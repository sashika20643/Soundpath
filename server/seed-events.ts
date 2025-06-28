import { db } from "./db";
import { events } from "@shared/schema";

const sampleEvents = [
  {
    title: "Midnight Jazz Under the Northern Lights",
    heroImage: "https://images.unsplash.com/photo-1574192324001-ee41e18ed679?w=800&h=600&fit=crop",
    shortDescription: "An unforgettable winter evening where jazz melodies dance with the aurora borealis in Iceland's remote highlands.",
    longDescription: "Experience the magic of live jazz music set against nature's most spectacular light show. Local musicians perform intimate sets while the northern lights paint the sky in ethereal greens and blues above.",
    date: "2024-12-15",
    tags: ["jazz", "aurora", "winter", "Iceland", "intimate"],
    continent: "Europe",
    country: "Iceland",
    city: "Reykjavik",
    locationName: "Aurora Highlands Amphitheater",
  },
  {
    title: "Rooftop Electronic Sessions in Medellín",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    shortDescription: "Colombia's electronic music scene comes alive on urban rooftops with panoramic views of the valley below.",
    longDescription: "Join local and international DJs as they transform Medellín's skyline into a dancefloor. The city's eternal spring weather provides the perfect backdrop for electronic beats echoing through the mountains.",
    date: "2024-11-22",
    tags: ["electronic", "rooftop", "urban", "Colombia", "dance"],
    continent: "South America",
    country: "Colombia",
    city: "Medellín",
    locationName: "Cielo Rooftop Collective",
  },
  {
    title: "Desert Folk Festival at Joshua Tree",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    shortDescription: "Acoustic folk music resonates through the mystical landscape of Joshua Tree's ancient desert.",
    longDescription: "Three days of intimate folk performances among the otherworldly Joshua trees. Musicians from around the world gather to share stories and songs under the vast desert sky, with campfire sessions extending into the starlit nights.",
    date: "2024-10-05",
    tags: ["folk", "acoustic", "desert", "festival", "camping"],
    continent: "North America",
    country: "United States",
    city: "Joshua Tree",
    locationName: "Desert Oasis Amphitheater",
  },
  {
    title: "Floating Concert on Lake Bled",
    heroImage: "https://images.unsplash.com/photo-1499092346307-2b4e785e5f2c?w=800&h=600&fit=crop",
    shortDescription: "Classical music performed on a floating stage in the middle of Slovenia's fairy-tale lake.",
    longDescription: "A once-in-a-lifetime experience where classical musicians perform on a purpose-built floating platform. The music reflects off the water's surface while Bled Castle watches from its cliff-top perch, creating an enchanting acoustic experience.",
    date: "2024-09-18",
    tags: ["classical", "lake", "floating", "Slovenia", "fairy-tale"],
    continent: "Europe",
    country: "Slovenia",
    city: "Bled",
    locationName: "Lake Bled Floating Stage",
  },
  {
    title: "Underground Hip-Hop in Tokyo's Hidden Basements",
    heroImage: "https://images.unsplash.com/photo-1540659339456-4b0c9c5e0baa?w=800&h=600&fit=crop",
    shortDescription: "Discover Tokyo's underground rap scene in intimate basement venues where raw talent meets urban poetry.",
    longDescription: "Navigate the neon-lit streets of Shibuya to find hidden basement venues where Japan's most talented hip-hop artists share their stories. These intimate spaces pulse with energy as local rappers blend Japanese and English in powerful performances.",
    date: "2024-08-30",
    tags: ["hip-hop", "underground", "urban", "Japan", "intimate"],
    continent: "Asia",
    country: "Japan",
    city: "Tokyo",
    locationName: "Basement Cipher Collective",
  },
  {
    title: "Cliffside Reggae in Blue Mountains",
    heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    shortDescription: "Authentic reggae rhythms echo through Jamaica's misty Blue Mountains at an elevation where clouds meet music.",
    longDescription: "High in the Blue Mountains where the world's finest coffee grows, local reggae artists perform overlooking the Caribbean Sea. The mystical mountain atmosphere, combined with roots reggae, creates a spiritual musical journey.",
    date: "2024-07-14",
    tags: ["reggae", "mountains", "Jamaica", "spiritual", "authentic"],
    continent: "North America",
    country: "Jamaica",
    city: "Kingston",
    locationName: "Blue Mountain Peak Pavilion",
  },
  {
    title: "Bossa Nova Beach Sessions in Rio",
    heroImage: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&h=600&fit=crop",
    shortDescription: "Smooth bossa nova melodies flow with the ocean waves on Ipanema Beach as the sun sets over Rio.",
    longDescription: "Experience the birthplace of bossa nova as local musicians perform the genre's timeless classics. The gentle guitar strings and soft vocals blend with the sound of waves lapping against the famous Ipanema shore while Sugarloaf Mountain watches over the scene.",
    date: "2024-06-27",
    tags: ["bossa-nova", "beach", "sunset", "Brazil", "classic"],
    continent: "South America",
    country: "Brazil",
    city: "Rio de Janeiro",
    locationName: "Ipanema Beach Stage",
  },
  {
    title: "Arctic Folk Stories in Norwegian Fjords",
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    shortDescription: "Traditional Norwegian folk music and storytelling echo through dramatic fjord landscapes under the midnight sun.",
    longDescription: "Journey deep into Norway's fjord country where traditional folk musicians share ancient stories through song. The dramatic landscape of vertical cliffs and pristine waters provides a stunning backdrop for music that has echoed through these valleys for centuries.",
    date: "2024-06-10",
    tags: ["folk", "storytelling", "fjords", "Norway", "traditional"],
    continent: "Europe",
    country: "Norway",
    city: "Flam",
    locationName: "Geiranger Fjord Amphitheater",
  },
  {
    title: "Sahara Blues Nomad Gathering",
    heroImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    shortDescription: "Desert blues masters gather in Morocco's Sahara for a three-day musical journey under infinite stars.",
    longDescription: "Travel into the heart of the Sahara Desert where Tuareg musicians share their hypnotic desert blues. The music, passed down through generations, tells stories of nomadic life while the endless dunes shift around crackling campfires under the clearest night sky on Earth.",
    date: "2024-05-15",
    tags: ["blues", "desert", "nomadic", "Morocco", "stars"],
    continent: "Africa",
    country: "Morocco",
    city: "Merzouga",
    locationName: "Erg Chebbi Dunes Camp",
  },
  {
    title: "Celtic Winds on Irish Cliffs",
    heroImage: "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&h=600&fit=crop",
    shortDescription: "Traditional Celtic music carries on Atlantic winds at the dramatic Cliffs of Moher in Ireland's wild west.",
    longDescription: "Stand on the edge of Europe where ancient Celtic melodies merge with the roar of Atlantic waves crashing 200 meters below. Traditional Irish musicians perform timeless ballads as seabirds circle the dramatic clifftops.",
    date: "2024-04-20",
    tags: ["celtic", "traditional", "cliffs", "Ireland", "Atlantic"],
    continent: "Europe",
    country: "Ireland",
    city: "Doolin",
    locationName: "Cliffs of Moher Viewing Platform",
  },
  {
    title: "Sunrise Meditation Music in Himalayas",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    shortDescription: "Tibetan singing bowls and meditation music welcome the sunrise over the world's highest peaks in Nepal.",
    longDescription: "Begin each day with spiritual music as the first rays of sunlight illuminate the Himalayan giants. Tibetan monks and musicians create ethereal soundscapes using traditional instruments while prayer flags flutter in the mountain breeze.",
    date: "2024-03-25",
    tags: ["meditation", "spiritual", "mountains", "Nepal", "sunrise"],
    continent: "Asia",
    country: "Nepal",
    city: "Pokhara",
    locationName: "Himalayan Sunrise Sanctuary",
  },
  {
    title: "Tango Nights in Buenos Aires",
    heroImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop",
    shortDescription: "Passionate tango music fills the historic streets of San Telmo as couples dance under vintage street lamps.",
    longDescription: "Immerse yourself in the birthplace of tango where every corner tells a story of passion and melancholy. Professional tango orchestras perform in cobblestone plazas while couples demonstrate the dance that captured the world's heart.",
    date: "2024-02-14",
    tags: ["tango", "dance", "historic", "Argentina", "passionate"],
    continent: "South America",
    country: "Argentina",
    city: "Buenos Aires",
    locationName: "Plaza Dorrego Tango Stage",
  },
  {
    title: "Outback Country Music Festival",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    shortDescription: "Australian country music echoes across the red earth under the Southern Cross in the heart of the Outback.",
    longDescription: "Experience authentic Australian country music in its natural habitat - the vast red desert where stories of the land come alive through song. Local musicians share tales of station life while the endless sky stretches overhead.",
    date: "2024-01-18",
    tags: ["country", "outback", "Australia", "storytelling", "desert"],
    continent: "Australia",
    country: "Australia",
    city: "Alice Springs",
    locationName: "Red Centre Amphitheater",
  },
  {
    title: "Midnight Sun Festival in Arctic Finland",
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    shortDescription: "Electronic and ambient music concerts that never end, taking advantage of Finland's endless summer daylight.",
    longDescription: "When the sun never sets, neither does the music. This unique festival takes advantage of the midnight sun phenomenon, hosting continuous electronic and ambient performances in Lapland's pristine wilderness. The eternal daylight creates a dreamlike atmosphere perfect for experimental music.",
    date: "2024-06-21",
    tags: ["electronic", "ambient", "midnight-sun", "Finland", "continuous"],
    continent: "Europe",
    country: "Finland",
    city: "Rovaniemi",
    locationName: "Arctic Circle Sound Garden",
  },
  {
    title: "Flamenco Cave Sessions in Andalusia",
    heroImage: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop",
    shortDescription: "Authentic flamenco guitar and dance performed in ancient caves carved into the hillsides of Granada.",
    longDescription: "Descend into centuries-old caves where the passionate art of flamenco was perfected in secret. The natural acoustics of these underground chambers amplify every guitar note and foot stomp as dancers tell stories of love, loss, and liberation.",
    date: "2024-05-03",
    tags: ["flamenco", "cave", "guitar", "Spain", "passionate"],
    continent: "Europe",
    country: "Spain",
    city: "Granada",
    locationName: "Sacromonte Cave Venues",
  },
  {
    title: "Island Ukulele Circle in Hawaii",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    shortDescription: "Community ukulele sessions on a secluded Hawaiian beach where traditional island music meets the Pacific surf.",
    longDescription: "Join local Hawaiian musicians for intimate ukulele circles on hidden beaches where ancient Polynesian melodies blend with the rhythm of Pacific waves. These gatherings celebrate the island's musical heritage while welcoming travelers to share in the aloha spirit.",
    date: "2024-04-12",
    tags: ["ukulele", "island", "community", "Hawaii", "traditional"],
    continent: "North America",
    country: "United States",
    city: "Hana",
    locationName: "Haleakala Beach Circle",
  },
  {
    title: "Mongolian Throat Singing Under Stars",
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    shortDescription: "Ancient Mongolian throat singing traditions echo across the steppes under one of the world's clearest night skies.",
    longDescription: "Experience one of the world's most unique musical traditions as Mongolian masters demonstrate throat singing techniques passed down through nomadic generations. The vast steppe landscape and unpolluted night sky create the perfect setting for these otherworldly sounds.",
    date: "2024-03-08",
    tags: ["throat-singing", "traditional", "Mongolia", "steppes", "ancient"],
    continent: "Asia",
    country: "Mongolia",
    city: "Ulaanbaatar",
    locationName: "Gobi Desert Ger Camp",
  },
  {
    title: "Vinyl Revival in Detroit Underground",
    heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    shortDescription: "Detroit techno legends spin rare vinyl in underground venues that shaped electronic music history.",
    longDescription: "Return to the birthplace of techno where legendary DJs showcase their vinyl collections in the same underground venues that launched a musical revolution. These intimate sessions feature rare tracks and stories from the artists who created the Detroit sound.",
    date: "2024-02-29",
    tags: ["techno", "vinyl", "underground", "Detroit", "legendary"],
    continent: "North America",
    country: "United States",
    city: "Detroit",
    locationName: "Underground Techno Collective",
  },
  {
    title: "African Drums in Serengeti Camp",
    heroImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop",
    shortDescription: "Traditional African drumming circles around campfires in the Serengeti as wildlife calls provide the backdrop.",
    longDescription: "Gather around crackling campfires in the heart of the Serengeti where traditional drummers share rhythms that have echoed across African savannas for millennia. The distant calls of lions and elephants add to this primal musical experience under African stars.",
    date: "2024-01-25",
    tags: ["drums", "traditional", "Africa", "wildlife", "campfire"],
    continent: "Africa",
    country: "Tanzania",
    city: "Serengeti",
    locationName: "Serengeti Safari Camp",
  },
  {
    title: "Alpine Yodeling Echo Chamber",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    shortDescription: "Traditional Alpine yodeling resonates through Swiss mountain valleys, creating natural echo chambers.",
    longDescription: "High in the Swiss Alps where traditional yodeling was born, master yodelers demonstrate this unique vocal technique. The mountain valleys create natural amphitheaters where the haunting calls echo off glacier-carved walls, connecting performers with centuries of Alpine tradition.",
    date: "2024-12-22",
    tags: ["yodeling", "alpine", "traditional", "Switzerland", "mountains"],
    continent: "Europe",
    country: "Switzerland",
    city: "Zermatt",
    locationName: "Matterhorn Echo Valley",
  }
];

export async function seedEvents() {
  console.log("🌱 Seeding events...");
  
  try {
    // Insert all events
    const insertedEvents = await db.insert(events).values(sampleEvents).returning();
    
    console.log(`✅ Successfully seeded ${insertedEvents.length} events`);
    return insertedEvents;
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEvents()
    .then(() => {
      console.log("🎉 Event seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Event seeding failed:", error);
      process.exit(1);
    });
}