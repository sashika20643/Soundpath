
import { Country, State, City } from 'country-state-city';

// Get all continents
export function getContinents(): string[] {
  return [
    "Africa",
    "Antarctica", 
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America"
  ];
}

// Map countries to continents
const countryToContinentMap: { [key: string]: string } = {
  // This is a simplified mapping - you might want to expand this based on your needs
  'AF': 'Asia', 'AL': 'Europe', 'DZ': 'Africa', 'AD': 'Europe', 'AO': 'Africa',
  'AR': 'South America', 'AM': 'Asia', 'AU': 'Oceania', 'AT': 'Europe', 'AZ': 'Asia',
  'BS': 'North America', 'BH': 'Asia', 'BD': 'Asia', 'BB': 'North America', 'BY': 'Europe',
  'BE': 'Europe', 'BZ': 'North America', 'BJ': 'Africa', 'BT': 'Asia', 'BO': 'South America',
  'BA': 'Europe', 'BW': 'Africa', 'BR': 'South America', 'BN': 'Asia', 'BG': 'Europe',
  'BF': 'Africa', 'BI': 'Africa', 'CV': 'Africa', 'KH': 'Asia', 'CM': 'Africa',
  'CA': 'North America', 'CF': 'Africa', 'TD': 'Africa', 'CL': 'South America', 'CN': 'Asia',
  'CO': 'South America', 'KM': 'Africa', 'CG': 'Africa', 'CD': 'Africa', 'CR': 'North America',
  'CI': 'Africa', 'HR': 'Europe', 'CU': 'North America', 'CY': 'Europe', 'CZ': 'Europe',
  'DK': 'Europe', 'DJ': 'Africa', 'DM': 'North America', 'DO': 'North America', 'EC': 'South America',
  'EG': 'Africa', 'SV': 'North America', 'GQ': 'Africa', 'ER': 'Africa', 'EE': 'Europe',
  'SZ': 'Africa', 'ET': 'Africa', 'FJ': 'Oceania', 'FI': 'Europe', 'FR': 'Europe',
  'GA': 'Africa', 'GM': 'Africa', 'GE': 'Asia', 'DE': 'Europe', 'GH': 'Africa',
  'GR': 'Europe', 'GD': 'North America', 'GT': 'North America', 'GN': 'Africa', 'GW': 'Africa',
  'GY': 'South America', 'HT': 'North America', 'HN': 'North America', 'HU': 'Europe', 'IS': 'Europe',
  'IN': 'Asia', 'ID': 'Asia', 'IR': 'Asia', 'IQ': 'Asia', 'IE': 'Europe',
  'IL': 'Asia', 'IT': 'Europe', 'JM': 'North America', 'JP': 'Asia', 'JO': 'Asia',
  'KZ': 'Asia', 'KE': 'Africa', 'KI': 'Oceania', 'KP': 'Asia', 'KR': 'Asia',
  'KW': 'Asia', 'KG': 'Asia', 'LA': 'Asia', 'LV': 'Europe', 'LB': 'Asia',
  'LS': 'Africa', 'LR': 'Africa', 'LY': 'Africa', 'LI': 'Europe', 'LT': 'Europe',
  'LU': 'Europe', 'MG': 'Africa', 'MW': 'Africa', 'MY': 'Asia', 'MV': 'Asia',
  'ML': 'Africa', 'MT': 'Europe', 'MH': 'Oceania', 'MR': 'Africa', 'MU': 'Africa',
  'MX': 'North America', 'FM': 'Oceania', 'MD': 'Europe', 'MC': 'Europe', 'MN': 'Asia',
  'ME': 'Europe', 'MA': 'Africa', 'MZ': 'Africa', 'MM': 'Asia', 'NA': 'Africa',
  'NR': 'Oceania', 'NP': 'Asia', 'NL': 'Europe', 'NZ': 'Oceania', 'NI': 'North America',
  'NE': 'Africa', 'NG': 'Africa', 'MK': 'Europe', 'NO': 'Europe', 'OM': 'Asia',
  'PK': 'Asia', 'PW': 'Oceania', 'PA': 'North America', 'PG': 'Oceania', 'PY': 'South America',
  'PE': 'South America', 'PH': 'Asia', 'PL': 'Europe', 'PT': 'Europe', 'QA': 'Asia',
  'RO': 'Europe', 'RU': 'Europe', 'RW': 'Africa', 'KN': 'North America', 'LC': 'North America',
  'VC': 'North America', 'WS': 'Oceania', 'SM': 'Europe', 'ST': 'Africa', 'SA': 'Asia',
  'SN': 'Africa', 'RS': 'Europe', 'SC': 'Africa', 'SL': 'Africa', 'SG': 'Asia',
  'SK': 'Europe', 'SI': 'Europe', 'SB': 'Oceania', 'SO': 'Africa', 'ZA': 'Africa',
  'SS': 'Africa', 'ES': 'Europe', 'LK': 'Asia', 'SD': 'Africa', 'SR': 'South America',
  'SE': 'Europe', 'CH': 'Europe', 'SY': 'Asia', 'TJ': 'Asia', 'TZ': 'Africa',
  'TH': 'Asia', 'TL': 'Asia', 'TG': 'Africa', 'TO': 'Oceania', 'TT': 'North America',
  'TN': 'Africa', 'TR': 'Asia', 'TM': 'Asia', 'TV': 'Oceania', 'UG': 'Africa',
  'UA': 'Europe', 'AE': 'Asia', 'GB': 'Europe', 'US': 'North America', 'UY': 'South America',
  'UZ': 'Asia', 'VU': 'Oceania', 'VE': 'South America', 'VN': 'Asia', 'YE': 'Asia',
  'ZM': 'Africa', 'ZW': 'Africa'
};

// Get all countries for a continent
export function getCountriesForContinent(continent: string): Array<{isoCode: string, name: string}> {
  const allCountries = Country.getAllCountries();
  return allCountries
    .filter(country => countryToContinentMap[country.isoCode] === continent)
    .map(country => ({
      isoCode: country.isoCode,
      name: country.name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get all states for a country
export function getStatesForCountry(countryCode: string): Array<{isoCode: string, name: string}> {
  return State.getStatesOfCountry(countryCode)
    .map(state => ({
      isoCode: state.isoCode,
      name: state.name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get all cities for a country (or state if provided)
export function getCitiesForCountry(countryCode: string, stateCode?: string): Array<{name: string, latitude?: string, longitude?: string}> {
  let cities;
  
  if (stateCode) {
    cities = City.getCitiesOfState(countryCode, stateCode);
  } else {
    cities = City.getCitiesOfCountry(countryCode);
  }
  
  return cities
    .map(city => ({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Search cities with autocomplete
export function searchCities(
  countryCode: string, 
  query: string, 
  stateCode?: string,
  limit: number = 10
): Array<{name: string, latitude?: string, longitude?: string}> {
  const cities = getCitiesForCountry(countryCode, stateCode);
  
  if (!query.trim()) return cities.slice(0, limit);
  
  const lowercaseQuery = query.toLowerCase();
  return cities
    .filter(city => city.name.toLowerCase().includes(lowercaseQuery))
    .slice(0, limit);
}

// Get country by name
export function getCountryByName(name: string) {
  return Country.getAllCountries().find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
}

// Get continent for country
export function getContinentForCountry(countryCode: string): string | undefined {
  return countryToContinentMap[countryCode];
}
