// Coordinate helper functions for location-based latitude/longitude generation

interface Coordinates {
  lat: number;
  lng: number;
}

// Continent center coordinates (approximate)
const continentCoordinates: { [key: string]: Coordinates } = {
  "Africa": { lat: 0.0236, lng: 17.2236 },
  "Antarctica": { lat: -82.8628, lng: 135.0000 },
  "Asia": { lat: 34.0479, lng: 100.6197 },
  "Europe": { lat: 54.5260, lng: 15.2551 },
  "North America": { lat: 45.0000, lng: -100.0000 },
  "Oceania": { lat: -25.2744, lng: 133.7751 },
  "South America": { lat: -8.7832, lng: -55.4915 }
};

// Country center coordinates (major countries)
const countryCoordinates: { [key: string]: Coordinates } = {
  // North America
  "United States": { lat: 39.8283, lng: -98.5795 },
  "Canada": { lat: 56.1304, lng: -106.3468 },
  "Mexico": { lat: 23.6345, lng: -102.5528 },
  
  // Europe
  "United Kingdom": { lat: 55.3781, lng: -3.4360 },
  "France": { lat: 46.6034, lng: 1.8883 },
  "Germany": { lat: 51.1657, lng: 10.4515 },
  "Spain": { lat: 40.4637, lng: -3.7492 },
  "Italy": { lat: 41.8719, lng: 12.5674 },
  "Netherlands": { lat: 52.1326, lng: 5.2913 },
  
  // Asia
  "Japan": { lat: 36.2048, lng: 138.2529 },
  "China": { lat: 35.8617, lng: 104.1954 },
  "India": { lat: 20.5937, lng: 78.9629 },
  "South Korea": { lat: 35.9078, lng: 127.7669 },
  "Thailand": { lat: 15.8700, lng: 100.9925 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  
  // Africa
  "South Africa": { lat: -30.5595, lng: 22.9375 },
  "Nigeria": { lat: 9.0820, lng: 8.6753 },
  "Egypt": { lat: 26.0975, lng: 31.2357 },
  "Kenya": { lat: -0.0236, lng: 37.9062 },
  "Morocco": { lat: 31.7917, lng: -7.0926 },
  
  // South America
  "Brazil": { lat: -14.2350, lng: -51.9253 },
  "Argentina": { lat: -38.4161, lng: -63.6167 },
  "Chile": { lat: -35.6751, lng: -71.5430 },
  "Colombia": { lat: 4.5709, lng: -74.2973 },
  "Peru": { lat: -9.1900, lng: -75.0152 },
  
  // Oceania
  "Australia": { lat: -25.2744, lng: 133.7751 },
  "New Zealand": { lat: -40.9006, lng: 174.8860 },
  "Fiji": { lat: -16.7784, lng: 179.4144 }
};

// Major city coordinates
const cityCoordinates: { [continent: string]: { [country: string]: { [city: string]: Coordinates } } } = {
  "North America": {
    "United States": {
      "New York": { lat: 40.7128, lng: -74.0060 },
      "Los Angeles": { lat: 34.0522, lng: -118.2437 },
      "Chicago": { lat: 41.8781, lng: -87.6298 },
      "Houston": { lat: 29.7604, lng: -95.3698 },
      "Phoenix": { lat: 33.4484, lng: -112.0740 },
      "Philadelphia": { lat: 39.9526, lng: -75.1652 },
      "San Antonio": { lat: 29.4241, lng: -98.4936 },
      "San Diego": { lat: 32.7157, lng: -117.1611 },
      "Dallas": { lat: 32.7767, lng: -96.7970 },
      "San Jose": { lat: 37.3382, lng: -121.8863 }
    },
    "Canada": {
      "Toronto": { lat: 43.6532, lng: -79.3832 },
      "Montreal": { lat: 45.5017, lng: -73.5673 },
      "Vancouver": { lat: 49.2827, lng: -123.1207 },
      "Calgary": { lat: 51.0447, lng: -114.0719 },
      "Edmonton": { lat: 53.5461, lng: -113.4938 },
      "Ottawa": { lat: 45.4215, lng: -75.6972 }
    },
    "Mexico": {
      "Mexico City": { lat: 19.4326, lng: -99.1332 },
      "Guadalajara": { lat: 20.6597, lng: -103.3496 },
      "Monterrey": { lat: 25.6866, lng: -100.3161 }
    }
  },
  "Europe": {
    "United Kingdom": {
      "London": { lat: 51.5074, lng: -0.1278 },
      "Manchester": { lat: 53.4808, lng: -2.2426 },
      "Birmingham": { lat: 52.4862, lng: -1.8904 },
      "Liverpool": { lat: 53.4084, lng: -2.9916 },
      "Edinburgh": { lat: 55.9533, lng: -3.1883 }
    },
    "France": {
      "Paris": { lat: 48.8566, lng: 2.3522 },
      "Lyon": { lat: 45.7640, lng: 4.8357 },
      "Marseille": { lat: 43.2965, lng: 5.3698 },
      "Nice": { lat: 43.7102, lng: 7.2620 }
    },
    "Germany": {
      "Berlin": { lat: 52.5200, lng: 13.4050 },
      "Munich": { lat: 48.1351, lng: 11.5820 },
      "Hamburg": { lat: 53.5511, lng: 9.9937 },
      "Frankfurt": { lat: 50.1109, lng: 8.6821 }
    },
    "Spain": {
      "Madrid": { lat: 40.4168, lng: -3.7038 },
      "Barcelona": { lat: 41.3851, lng: 2.1734 },
      "Valencia": { lat: 39.4699, lng: -0.3763 },
      "Seville": { lat: 37.3891, lng: -5.9845 }
    },
    "Italy": {
      "Rome": { lat: 41.9028, lng: 12.4964 },
      "Milan": { lat: 45.4642, lng: 9.1900 },
      "Naples": { lat: 40.8518, lng: 14.2681 },
      "Florence": { lat: 43.7696, lng: 11.2558 }
    },
    "Netherlands": {
      "Amsterdam": { lat: 52.3676, lng: 4.9041 },
      "Rotterdam": { lat: 51.9244, lng: 4.4777 },
      "The Hague": { lat: 52.0705, lng: 4.3007 },
      "Utrecht": { lat: 52.0907, lng: 5.1214 }
    }
  },
  "Asia": {
    "Japan": {
      "Tokyo": { lat: 35.6762, lng: 139.6503 },
      "Osaka": { lat: 34.6937, lng: 135.5023 },
      "Kyoto": { lat: 35.0116, lng: 135.7681 },
      "Yokohama": { lat: 35.4437, lng: 139.6380 }
    },
    "China": {
      "Beijing": { lat: 39.9042, lng: 116.4074 },
      "Shanghai": { lat: 31.2304, lng: 121.4737 },
      "Guangzhou": { lat: 23.1291, lng: 113.2644 },
      "Shenzhen": { lat: 22.5431, lng: 114.0579 }
    },
    "India": {
      "Mumbai": { lat: 19.0760, lng: 72.8777 },
      "Delhi": { lat: 28.7041, lng: 77.1025 },
      "Bangalore": { lat: 12.9716, lng: 77.5946 },
      "Chennai": { lat: 13.0827, lng: 80.2707 }
    },
    "South Korea": {
      "Seoul": { lat: 37.5665, lng: 126.9780 },
      "Busan": { lat: 35.1796, lng: 129.0756 },
      "Incheon": { lat: 37.4563, lng: 126.7052 }
    },
    "Thailand": {
      "Bangkok": { lat: 13.7563, lng: 100.5018 },
      "Chiang Mai": { lat: 18.7883, lng: 98.9853 },
      "Phuket": { lat: 7.8804, lng: 98.3923 }
    },
    "Singapore": {
      "Singapore": { lat: 1.3521, lng: 103.8198 }
    }
  },
  "Africa": {
    "South Africa": {
      "Cape Town": { lat: -33.9249, lng: 18.4241 },
      "Johannesburg": { lat: -26.2041, lng: 28.0473 },
      "Durban": { lat: -29.8587, lng: 31.0218 }
    },
    "Nigeria": {
      "Lagos": { lat: 6.5244, lng: 3.3792 },
      "Abuja": { lat: 9.0579, lng: 7.4951 }
    },
    "Egypt": {
      "Cairo": { lat: 30.0444, lng: 31.2357 },
      "Alexandria": { lat: 31.2001, lng: 29.9187 }
    },
    "Kenya": {
      "Nairobi": { lat: -1.2921, lng: 36.8219 },
      "Mombasa": { lat: -4.0435, lng: 39.6682 }
    },
    "Morocco": {
      "Casablanca": { lat: 33.5731, lng: -7.5898 },
      "Marrakech": { lat: 31.6295, lng: -7.9811 }
    }
  },
  "South America": {
    "Brazil": {
      "São Paulo": { lat: -23.5505, lng: -46.6333 },
      "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
      "Brasília": { lat: -15.8267, lng: -47.9218 },
      "Salvador": { lat: -12.9714, lng: -38.5014 }
    },
    "Argentina": {
      "Buenos Aires": { lat: -34.6118, lng: -58.3960 },
      "Córdoba": { lat: -31.4201, lng: -64.1888 },
      "Rosario": { lat: -32.9442, lng: -60.6505 }
    },
    "Chile": {
      "Santiago": { lat: -33.4489, lng: -70.6693 },
      "Valparaíso": { lat: -33.0472, lng: -71.6127 }
    },
    "Colombia": {
      "Bogotá": { lat: 4.7110, lng: -74.0721 },
      "Medellín": { lat: 6.2442, lng: -75.5812 },
      "Cali": { lat: 3.4516, lng: -76.5320 }
    },
    "Peru": {
      "Lima": { lat: -12.0464, lng: -77.0428 },
      "Cusco": { lat: -13.5319, lng: -71.9675 }
    }
  },
  "Oceania": {
    "Australia": {
      "Sydney": { lat: -33.8688, lng: 151.2093 },
      "Melbourne": { lat: -37.8136, lng: 144.9631 },
      "Brisbane": { lat: -27.4698, lng: 153.0251 },
      "Perth": { lat: -31.9505, lng: 115.8605 }
    },
    "New Zealand": {
      "Auckland": { lat: -36.8485, lng: 174.7633 },
      "Wellington": { lat: -41.2865, lng: 174.7762 },
      "Christchurch": { lat: -43.5321, lng: 172.6362 }
    },
    "Fiji": {
      "Suva": { lat: -18.1248, lng: 178.4501 }
    }
  }
};

export function getContinentCoordinates(continent: string): Coordinates | null {
  return continentCoordinates[continent] || null;
}

export function getCountryCoordinates(country: string): Coordinates | null {
  return countryCoordinates[country] || null;
}

export function getCityCoordinates(continent: string, country: string, city: string): Coordinates | null {
  if (cityCoordinates[continent] && 
      cityCoordinates[continent][country] && 
      cityCoordinates[continent][country][city]) {
    return cityCoordinates[continent][country][city];
  }
  
  // Fallback to country coordinates with small random offset for cities
  const countryCoords = getCountryCoordinates(country);
  if (countryCoords) {
    return {
      lat: countryCoords.lat + (Math.random() - 0.5) * 2, // ±1 degree random offset
      lng: countryCoords.lng + (Math.random() - 0.5) * 2
    };
  }
  
  return null;
}