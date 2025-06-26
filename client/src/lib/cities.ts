// Major cities database for autocomplete
export const cities = {
  "North America": {
    "United States": [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
      "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
      "San Francisco", "Columbus", "Charlotte", "Indianapolis", "Seattle", "Denver",
      "Boston", "Nashville", "Detroit", "Portland", "Las Vegas", "Miami", "Atlanta",
      "Washington", "Minneapolis", "Cleveland", "Orlando", "Tampa"
    ],
    "Canada": [
      "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg",
      "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax",
      "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina", "Sherbrooke",
      "Barrie", "Kelowna", "Abbotsford", "Kingston", "Trois-Rivières", "Guelph"
    ],
    "Mexico": [
      "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León",
      "Juárez", "Zapopan", "Mérida", "San Luis Potosí", "Aguascalientes", "Hermosillo",
      "Saltillo", "Mexicali", "Culiacán", "Guadalupe", "Acapulco", "Tlalnepantla",
      "Cancún", "Querétaro", "Chimalhuacán", "Torreón", "Morelia", "Reynosa"
    ]
  },
  "Europe": {
    "United Kingdom": [
      "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol",
      "Sheffield", "Edinburgh", "Leeds", "Cardiff", "Belfast", "Nottingham",
      "Leicester", "Coventry", "Bradford", "Stoke-on-Trent", "Wolverhampton",
      "Plymouth", "Derby", "Southampton", "Swansea", "Salford", "Aberdeen",
      "Westminster", "Portsmouth", "York", "Peterborough", "Dundee", "Lancaster"
    ],
    "France": [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier",
      "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Toulon", "Saint-Étienne",
      "Le Havre", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis",
      "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Limoges", "Tours"
    ],
    "Germany": [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf",
      "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg",
      "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Mannheim",
      "Karlsruhe", "Augsburg", "Wiesbaden", "Mönchengladbach", "Gelsenkirchen"
    ],
    "Spain": [
      "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia",
      "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo",
      "Gijón", "L'Hospitalet", "Granada", "Vitoria-Gasteiz", "A Coruña", "Elche",
      "Oviedo", "Santa Cruz de Tenerife", "Badalona", "Cartagena", "Terrassa"
    ],
    "Italy": [
      "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence",
      "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", "Trieste", "Brescia",
      "Taranto", "Prato", "Modena", "Reggio Calabria", "Reggio Emilia", "Perugia",
      "Livorno", "Ravenna", "Cagliari", "Foggia", "Rimini", "Salerno", "Ferrara"
    ],
    "Netherlands": [
      "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen",
      "Tilburg", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", "Arnhem",
      "Zaanstad", "Amersfoort", "'s-Hertogenbosch", "Apeldoorn", "Hoofddorp",
      "Maastricht", "Leiden", "Dordrecht", "Zoetermeer", "Zwolle", "Deventer"
    ]
  },
  "Asia": {
    "Japan": [
      "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki",
      "Kyoto", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai",
      "Niigata", "Hamamatsu", "Okayama", "Kumamoto", "Shizuoka", "Kagoshima",
      "Himeji", "Matsuyama", "Utsunomiya", "Matsudo", "Kawaguchi", "Kanazawa"
    ],
    "China": [
      "Shanghai", "Beijing", "Shenzhen", "Guangzhou", "Chengdu", "Tianjin", "Nanjing",
      "Wuhan", "Xi'an", "Hangzhou", "Chongqing", "Zhengzhou", "Qingdao", "Dalian",
      "Dongguan", "Foshan", "Shenyang", "Kunming", "Hefei", "Harbin", "Suzhou",
      "Fuzhou", "Changsha", "Shijiazhuang", "Ningbo", "Jinan", "Wuxi", "Changchun"
    ],
    "India": [
      "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
      "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam",
      "Indore", "Thane", "Bhopal", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
      "Ludhiana", "Coimbatore", "Agra", "Madurai", "Nashik", "Faridabad", "Meerut"
    ],
    "South Korea": [
      "Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan",
      "Changwon", "Goyang", "Yongin", "Seongnam", "Bucheon", "Cheongju", "Ansan",
      "Jeonju", "Anyang", "Cheonan", "Pohang", "Uijeongbu", "Siheung", "Hwaseong",
      "Gimhae", "Gunsan", "Wonju", "Gumi", "Iksan", "Yangsan", "Jeju City"
    ],
    "Thailand": [
      "Bangkok", "Nonthaburi", "Pak Kret", "Hat Yai", "Chiang Mai", "Phuket City",
      "Pattaya", "Udon Thani", "Nakhon Ratchasima", "Khon Kaen", "Surat Thani",
      "Rayong", "Chon Buri", "Lampang", "Songkhla", "Chiang Rai", "Phitsanulok",
      "Nakhon Si Thammarat", "Ubon Ratchathani", "Sakon Nakhon", "Trang", "Krabi"
    ],
    "Singapore": [
      "Singapore", "Jurong West", "Woodlands", "Tampines", "Bedok", "Sengkang",
      "Hougang", "Yishun", "Ang Mo Kio", "Toa Payoh", "Pasir Ris", "Punggol",
      "Choa Chu Kang", "Bishan", "Clementi", "Bukit Merah", "Geylang", "Kallang",
      "Queenstown", "Bukit Batok", "Serangoon", "Marine Parade", "Central Water Catchment"
    ]
  },
  "Africa": {
    "South Africa": [
      "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Pietermaritzburg",
      "Benoni", "Tembisa", "East London", "Vereeniging", "Bloemfontein", "Boksburg",
      "Welkom", "Newcastle", "Krugersdorp", "Diepsloot", "Botshabelo", "Brakpan",
      "Witbank", "Oberholzer", "Centurion", "Roodepoort", "Kimberley", "Rustenburg"
    ],
    "Nigeria": [
      "Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City", "Maiduguri",
      "Zaria", "Aba", "Jos", "Ilorin", "Oyo", "Enugu", "Abeokuta", "Abuja", "Sokoto",
      "Onitsha", "Warri", "Okene", "Calabar", "Uyo", "Katsina", "Ado-Ekiti", "Ogbomoso"
    ],
    "Egypt": [
      "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor",
      "al-Mansura", "El-Mahalla El-Kubra", "Tanta", "Asyut", "Ismailia", "Fayyum",
      "Zagazig", "Aswan", "Damietta", "Damanhur", "al-Minya", "Beni Suef", "Qena",
      "Sohag", "Hurghada", "6th of October City", "Shibin El Kom", "Banha", "Kafr el-Sheikh"
    ],
    "Kenya": [
      "Nairobi", "Mombasa", "Nakuru", "Eldoret", "Kisumu", "Thika", "Malindi", "Kitale",
      "Garissa", "Kakamega", "Nyeri", "Machakos", "Meru", "Kericho", "Embu", "Migori",
      "Homa Bay", "Kilifi", "Naivasha", "Lamu", "Wajir", "Bungoma", "Busia", "Voi"
    ],
    "Morocco": [
      "Casablanca", "Rabat", "Fez", "Marrakech", "Agadir", "Tangier", "Meknès", "Oujda",
      "Kenitra", "Tetouan", "Safi", "Mohammedia", "Khouribga", "El Jadida", "Beni Mellal",
      "Nador", "Taza", "Settat", "Larache", "Ksar el-Kebir", "Khemisset", "Guelmim",
      "Berrechid", "Wazzane", "Errachidia", "Ouarzazate", "Tiznit", "Taroudant"
    ]
  },
  "South America": {
    "Brazil": [
      "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte",
      "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos",
      "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Nova Iguaçu",
      "Teresina", "Natal", "Osasco", "Campo Grande", "Santo André", "João Pessoa"
    ],
    "Argentina": [
      "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "San Miguel de Tucumán", "La Plata",
      "Mar del Plata", "Salta", "Santa Fe", "San Juan", "Resistencia", "Neuquén",
      "Santiago del Estero", "Corrientes", "Posadas", "Bahía Blanca", "Paraná",
      "Formosa", "San Luis", "La Rioja", "Catamarca", "Río Cuarto", "Comodoro Rivadavia"
    ],
    "Chile": [
      "Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco",
      "Rancagua", "Talca", "Arica", "Chillán", "Iquique", "Los Ángeles", "Puerto Montt",
      "Coquimbo", "Osorno", "Valdivia", "Punta Arenas", "Quilpué", "Villa Alemana",
      "Curicó", "Calama", "Copiapó", "Quillota", "Linares", "Ovalle", "Talagante"
    ],
    "Colombia": [
      "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga",
      "Pereira", "Santa Marta", "Ibagué", "Pasto", "Manizales", "Neiva", "Soledad",
      "Armenia", "Villavicencio", "Soacha", "Valledupar", "Montería", "Itagüí",
      "Palmira", "Buenaventura", "Floridablanca", "Sincelejo", "Popayán", "Barrancas"
    ],
    "Peru": [
      "Lima", "Arequipa", "Trujillo", "Chiclayo", "Huancayo", "Piura", "Iquitos", "Cusco",
      "Chimbote", "Tacna", "Juliaca", "Ica", "Sullana", "Ayacucho", "Chincha Alta",
      "Huánuco", "Cajamarca", "Pucallpa", "Puno", "Tarapoto", "Tumbes", "Talara",
      "Jaén", "Huaraz", "Moquegua", "Cerro de Pasco", "Catacaos", "Paita", "Yurimaguas"
    ]
  },
  "Oceania": {
    "Australia": [
      "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle",
      "Canberra", "Central Coast", "Wollongong", "Logan City", "Geelong", "Hobart",
      "Townsville", "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Albury",
      "Launceston", "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Coffs Harbour"
    ],
    "New Zealand": [
      "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings",
      "Dunedin", "Palmerston North", "Nelson", "Rotorua", "New Plymouth", "Whangarei",
      "Invercargill", "Wanganui", "Gisborne", "Timaru", "Masterton", "Levin", "Taupo",
      "Blenheim", "Oamaru", "Cambridge", "Ashburton", "Rangiora", "Pukekohe", "Tokoroa"
    ],
    "Fiji": [
      "Suva", "Lautoka", "Nadi", "Labasa", "Ba", "Tavua", "Sigatoka", "Savusavu",
      "Rakiraki", "Levuka", "Nausori", "Korovou", "Vunisea", "Lambasa", "Seaqaqa"
    ]
  }
};

export function getCitiesForCountry(continent: string, country: string): string[] {
  return cities[continent as keyof typeof cities]?.[country as keyof typeof cities[keyof typeof cities]] || [];
}

export function searchCities(continent: string, country: string, query: string): string[] {
  const countryCities = getCitiesForCountry(continent, country);
  if (!query.trim()) return countryCities.slice(0, 10); // Return first 10 if no query
  
  const lowercaseQuery = query.toLowerCase();
  return countryCities
    .filter(city => city.toLowerCase().includes(lowercaseQuery))
    .slice(0, 10); // Limit to 10 results
}