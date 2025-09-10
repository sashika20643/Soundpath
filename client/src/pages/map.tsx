import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/layout";
import { EventMap } from "@/components/map/EventMap";
import { useEvents } from "@/hooks/use-events";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe } from "lucide-react";

const continents = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
];

const countries = {
  "North America": ["United States", "Canada", "Mexico"],
  "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
  Europe: [
    "United Kingdom",
    "France",
    "Germany",
    "Italy",
    "Spain",
    "Netherlands",
    "Switzerland",
  ],
  Asia: ["Japan", "China", "India", "South Korea", "Thailand", "Singapore"],
  Africa: ["South Africa", "Egypt", "Nigeria", "Kenya", "Morocco"],
  Oceania: ["Australia", "New Zealand", "Fiji"],
};

const cities = {
  "United States": [
    "New York",
    "Los Angeles",
    "Chicago",
    "San Francisco",
    "Miami",
  ],
  "United Kingdom": ["London", "Manchester", "Edinburgh", "Birmingham"],
  France: ["Paris", "Lyon", "Marseille", "Nice"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Salvador", "Brasília"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  // Add more cities as needed
};

export default function MapPage() {
  usePageMetadata("map");

  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const scrollRef = useScrollAnimation();

  // Build filters for API call
  const filters = useMemo(
    () => ({
      continent: selectedContinent || undefined,
      country: selectedCountry || undefined,
      city: selectedCity || undefined,
      approved: true,
    }),
    [selectedContinent, selectedCountry, selectedCity],
  );

  const { data: allEvents = [], isLoading } = useEvents(filters);

  // Filter events that have coordinates for the map
  const eventsWithCoordinates = useMemo(
    () =>
      allEvents?.filter((event) => event?.latitude && event?.longitude) || [],
    [allEvents],
  );

  // Get available countries based on selected continent
  const availableCountries = selectedContinent
    ? countries[selectedContinent as keyof typeof countries] || []
    : [];

  // Get available cities based on selected country
  const availableCities = selectedCountry
    ? cities[selectedCountry as keyof typeof cities] || []
    : [];

  const handleContinentChange = (value: string) => {
    const continent = value === "all" ? "" : value;
    setSelectedContinent(continent);
    setSelectedCountry("");
    setSelectedCity("");
  };

  const handleCountryChange = (value: string) => {
    const country = value === "all" ? "" : value;
    setSelectedCountry(country);
    setSelectedCity("");
  };

  const handleCityChange = (value: string) => {
    const city = value === "all" ? "" : value;
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
                Navigate through musical destinations around the globe. Use the
                location filters to focus on specific regions and discover
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
                    <Select
                      value={selectedContinent || "all"}
                      onValueChange={handleContinentChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Continents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Continents</SelectItem>
                        {continents.map((continent) => (
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
                        <SelectValue
                          placeholder={
                            selectedContinent
                              ? "All Countries"
                              : "Select continent first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {availableCountries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
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
                    <Select
                      value={selectedCity || "all"}
                      onValueChange={handleCityChange}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedCountry
                              ? "All Cities"
                              : "Select country first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    backgroundColor: "var(--color-light-gray)",
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
                          {
                            new Set(
                              eventsWithCoordinates
                                .map((e) => e?.country)
                                .filter(Boolean),
                            ).size
                          }
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
                          {
                            new Set(
                              eventsWithCoordinates
                                .map((e) => e?.city)
                                .filter(Boolean),
                            ).size
                          }
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
