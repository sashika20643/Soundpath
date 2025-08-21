import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/layout";
import { EventMap } from "@/components/map/EventMap";
import { useEvents } from "@/hooks/use-events";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe } from "lucide-react";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { 
  getContinents, 
  getCountriesForContinent, 
  getCitiesForCountry 
} from "@/lib/locations";

const continents = getContinents();

export default function MapPage() {
  usePageMetadata('map');

  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<Array<{isoCode: string, name: string}>>([]);

  const scrollRef = useScrollAnimation();

  // Build filters for API call
  const filters = useMemo(() => ({
    continent: selectedContinent || undefined,
    country: selectedCountry || undefined,
    city: selectedCity || undefined,
    approved: true,
  }), [selectedContinent, selectedCountry, selectedCity]);

  const { data: allEvents = [], isLoading } = useEvents(filters);

  // Filter events that have coordinates for the map
  const eventsWithCoordinates = useMemo(() => 
    allEvents?.filter(event => event?.latitude && event?.longitude) || [],
    [allEvents]
  );

  const handleContinentChange = (continent: string) => {
    if (continent === "all") {
      setSelectedContinent("");
      setSelectedCountry("");
      setSelectedCity("");
      setSelectedCountryCode("");
      setAvailableCountries([]);
    } else {
      setSelectedContinent(continent);
      setSelectedCountry("");
      setSelectedCity("");
      setSelectedCountryCode("");

      // Load countries for this continent
      const countries = getCountriesForContinent(continent);
      setAvailableCountries(countries);
    }
  };

  const handleCountryChange = (country: string) => {
    if (country === "all") {
      setSelectedCountry("");
      setSelectedCity("");
      setSelectedCountryCode("");
    } else {
      setSelectedCountry(country);
      setSelectedCity("");

      // Find country code for city autocomplete
      const countryData = availableCountries.find(c => c.name === country);
      if (countryData) {
        setSelectedCountryCode(countryData.isoCode);
      }
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <Layout>
      <div
        ref={scrollRef}
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        {/* Hero Section */}
        <section className="section-padding pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="scroll-animate mb-16">
              <h1
                className="font-serif text-5xl md:text-6xl leading-tight mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                Explore Events
                <br />
                <span className="italic">Worldwide</span>
              </h1>
              <p
                className="text-editorial text-xl max-w-2xl mx-auto leading-relaxed"
                style={{ color: "var(--color-dark-gray)" }}
              >
                Navigate through musical destinations around the globe. 
                Use the location filters to focus on specific regions and discover 
                events in your area of interest.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="scroll-animate mb-6">
                  <h2 
                    className="font-serif text-2xl mb-2 flex items-center gap-2"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    <Globe className="w-6 h-6" />
                    Location Filters
                  </h2>
                  <p 
                    className="text-sm"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Select a location to focus the map view and filter events
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Continent Filter */}
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Continent
                    </Label>
                    <Select value={selectedContinent || "all"} onValueChange={handleContinentChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Continents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Continents</SelectItem>
                        {continents.map(continent => (
                          <SelectItem key={continent} value={continent}>
                            {continent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Country
                    </Label>
                    <Select 
                      value={selectedCountry || "all"} 
                      onValueChange={handleCountryChange}
                      disabled={!selectedContinent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedContinent ? "All Countries" : "Select continent first"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {availableCountries.map(country => (
                          <SelectItem key={country.isoCode} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City Filter */}
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      City
                    </Label>
                    <CityAutocomplete 
                      countryCode={selectedCountryCode}
                      onCitySelect={handleCityChange}
                      placeholder={selectedCountry ? "Enter city name" : "Select country first"}
                      disabled={!selectedCountry}
                    />
                  </div>
                </div>

                {/* Active Filters Display */}
                {(selectedContinent || selectedCountry || selectedCity) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {selectedContinent && (
                        <span
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: "var(--color-cream)",
                            color: "var(--color-charcoal)",
                          }}
                        >
                          {selectedContinent}
                        </span>
                      )}
                      {selectedCountry && (
                        <span
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: "var(--color-cream)",
                            color: "var(--color-charcoal)",
                          }}
                        >
                          {selectedCountry}
                        </span>
                      )}
                      {selectedCity && (
                        <span
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: "var(--color-cream)",
                            color: "var(--color-charcoal)",
                          }}
                        >
                          {selectedCity}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="scroll-animate mb-8">
              <div className="flex items-center justify-between">
                <h2
                  className="font-serif text-3xl"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  {eventsWithCoordinates.length > 0
                    ? `${eventsWithCoordinates.length} Events on Map`
                    : "No Events Found"}
                </h2>
                {isLoading && (
                  <div className="animate-pulse">
                    <div 
                      className="h-4 w-20 rounded"
                      style={{ backgroundColor: "var(--color-light-gray)" }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="scroll-animate scroll-animate-delay-1">
              {isLoading ? (
                <div 
                  className="rounded-lg animate-pulse"
                  style={{ 
                    height: "600px",
                    backgroundColor: "var(--color-light-gray)"
                  }}
                ></div>
              ) : (
                <EventMap 
                  events={eventsWithCoordinates} 
                  height="600px"
                  className="mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Events Summary */}
            {!isLoading && eventsWithCoordinates.length > 0 && (
              <div className="scroll-animate mt-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 
                      className="font-serif text-xl mb-4"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Events Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span 
                          className="font-medium"
                          style={{ color: "var(--color-charcoal)" }}
                        >
                          Total Events:
                        </span>
                        <span 
                          className="ml-2"
                          style={{ color: "var(--color-dark-gray)" }}
                        >
                          {eventsWithCoordinates.length}
                        </span>
                      </div>
                      <div>
                        <span 
                          className="font-medium"
                          style={{ color: "var(--color-charcoal)" }}
                        >
                          Countries:
                        </span>
                        <span 
                          className="ml-2"
                          style={{ color: "var(--color-dark-gray)" }}
                        >
                          {new Set(eventsWithCoordinates.map(e => e?.country).filter(Boolean)).size}
                        </span>
                      </div>
                      <div>
                        <span 
                          className="font-medium"
                          style={{ color: "var(--color-charcoal)" }}
                        >
                          Cities:
                        </span>
                        <span 
                          className="ml-2"
                          style={{ color: "var(--color-dark-gray)" }}
                        >
                          {new Set(eventsWithCoordinates.map(e => e?.city).filter(Boolean)).size}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}