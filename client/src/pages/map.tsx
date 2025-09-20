import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/layout";
import { EventMap } from "@/components/map/EventMap";
import { useEvents } from "@/hooks/use-events";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe } from "lucide-react";
import {
  getContinents,
  getCountriesForContinent,
  getCitiesForCountry,
  searchCities,
  getCountryByName,
} from "@/lib/locations";
import {
  getContinentCoordinates,
  getCountryCoordinates,
  getCityCoordinates,
} from "@/lib/coordinates";

const continents = getContinents();

export default function MapPage() {
  usePageMetadata("map");

  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<
    Array<{ isoCode: string; name: string }>
  >([]);
  const [availableCities, setAvailableCities] = useState<
    Array<{ name: string; latitude?: string; longitude?: string }>
  >([]);
  const [showContinentSuggestions, setShowContinentSuggestions] =
    useState(false);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

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

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedCountryCode("");
    setAvailableCountries([]);
    setAvailableCities([]);

    if (continent) {
      // Load countries for this continent
      const countries = getCountriesForContinent(continent);
      setAvailableCountries(countries);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity("");
    setSelectedCountryCode("");
    setAvailableCities([]);

    if (country) {
      // Find country code for city autocomplete
      const countryData = availableCountries.find((c) => c.name === country);
      if (countryData) {
        setSelectedCountryCode(countryData.isoCode);
        // Load cities for this country
        const cities = getCitiesForCountry(countryData.isoCode);
        setAvailableCities(cities);
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
                    <div className="relative">
                      <Input
                        value={selectedContinent}
                        placeholder="e.g. North America, Europe, Asia..."
                        className="py-3 px-4 text-base border-2 rounded-lg"
                        style={{
                          borderColor: "var(--color-light-gray)",
                          backgroundColor: "var(--color-warm-white)",
                          color: "var(--color-charcoal)",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedContinent(value);
                          setShowContinentSuggestions(true);
                          // Reset country and city when continent changes
                          setSelectedCountry("");
                          setAvailableCountries([]);
                          setSelectedCity("");
                          setAvailableCities([]);
                          setSelectedCountryCode("");
                        }}
                        onFocus={() => setShowContinentSuggestions(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setShowContinentSuggestions(false),
                            200,
                          )
                        }
                      />
                      {showContinentSuggestions &&
                        getContinents().length > 0 &&
                        selectedContinent && (
                          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                            {getContinents()
                              .filter((continent) =>
                                continent
                                  .toLowerCase()
                                  .includes(selectedContinent.toLowerCase()),
                              )
                              .slice(0, 5)
                              .map((continent) => (
                                <button
                                  key={continent}
                                  type="button"
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                  onClick={() => {
                                    setSelectedContinent(continent);
                                    setShowContinentSuggestions(false);
                                    // Load countries for the selected continent
                                    const countries =
                                      getCountriesForContinent(continent);
                                    setAvailableCountries(countries);
                                    // Reset country and city when continent changes
                                    setSelectedCountry("");
                                    setAvailableCities([]);
                                    setSelectedCity("");
                                    setSelectedCountryCode("");
                                  }}
                                >
                                  {continent}
                                </button>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Country
                    </Label>
                    <div className="relative">
                      <Input
                        value={selectedCountry}
                        placeholder="e.g. United States, France, Japan..."
                        className="py-3 px-4 text-base border-2 rounded-lg"
                        style={{
                          borderColor: "var(--color-light-gray)",
                          backgroundColor: "var(--color-warm-white)",
                          color: "var(--color-charcoal)",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCountry(value);
                          setShowCountrySuggestions(true);

                          // Find matching country and load cities
                          const matchingCountry = availableCountries.find(
                            (country) =>
                              country.name.toLowerCase() ===
                              value.toLowerCase(),
                          );
                          if (matchingCountry) {
                            setSelectedCountryCode(matchingCountry.isoCode);
                            const cities = getCitiesForCountry(
                              matchingCountry.isoCode,
                            );
                            setAvailableCities(cities);
                            setSelectedCity(""); // Reset city when country changes
                          }
                        }}
                        onFocus={() => setShowCountrySuggestions(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setShowCountrySuggestions(false),
                            200,
                          )
                        }
                        disabled={!selectedContinent}
                      />
                      {showCountrySuggestions &&
                        availableCountries.length > 0 &&
                        selectedCountry && (
                          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                            {availableCountries
                              .filter((country) =>
                                country.name
                                  .toLowerCase()
                                  .includes(selectedCountry.toLowerCase()),
                              )
                              .slice(0, 10)
                              .map((country) => (
                                <button
                                  key={country.isoCode}
                                  type="button"
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                  onClick={() => {
                                    setSelectedCountry(country.name);
                                    setSelectedCountryCode(country.isoCode);
                                    setShowCountrySuggestions(false);

                                    // Load cities for this country
                                    const cities = getCitiesForCountry(
                                      country.isoCode,
                                    );
                                    setAvailableCities(cities);
                                    setSelectedCity(""); // Reset city
                                  }}
                                >
                                  {country.name}
                                </button>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* City Filter */}
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      City
                    </Label>
                    <div className="relative">
                      <Input
                        value={selectedCity}
                        placeholder="e.g. New York, Paris, Tokyo..."
                        className="py-3 px-4 text-base border-2 rounded-lg"
                        style={{
                          borderColor: "var(--color-light-gray)",
                          backgroundColor: "var(--color-warm-white)",
                          color: "var(--color-charcoal)",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCity(value);
                          setShowCitySuggestions(true);
                        }}
                        onFocus={() => setShowCitySuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowCitySuggestions(false), 200)
                        }
                        disabled={!selectedCountryCode}
                      />
                      {showCitySuggestions &&
                        selectedCountryCode &&
                        selectedCity && (
                          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                            {searchCities(
                              selectedCountryCode,
                              selectedCity,
                              undefined,
                              10,
                            ).map((city) => (
                              <button
                                key={city.name}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                onClick={() => {
                                  setSelectedCity(city.name);
                                  setShowCitySuggestions(false);
                                }}
                              >
                                {city.name}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(selectedContinent || selectedCountry || selectedCity) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
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
                      <button
                        onClick={() => {
                          setSelectedContinent("");
                          setSelectedCountry("");
                          setSelectedCity("");
                          setSelectedCountryCode("");
                          setAvailableCountries([]);
                          setAvailableCities([]);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Clear all filters
                      </button>
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
