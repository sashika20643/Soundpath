import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/layout";
import { EventMap } from "@/components/map/EventMap";
import { useEvents } from "@/hooks/use-events";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Calendar, Music, Users, Compass, Heart, Star, Navigation, Filter } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

const continents = [
  "North America", "South America", "Europe", "Asia", "Africa", "Oceania"
];

const countries = {
  "North America": ["United States", "Canada", "Mexico"],
  "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
  "Europe": ["United Kingdom", "France", "Germany", "Italy", "Spain", "Netherlands", "Switzerland"],
  "Asia": ["Japan", "China", "India", "South Korea", "Thailand", "Singapore"],
  "Africa": ["South Africa", "Egypt", "Nigeria", "Kenya", "Morocco"],
  "Oceania": ["Australia", "New Zealand", "Fiji"]
};

const cities = {
  "United States": ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami"],
  "United Kingdom": ["London", "Manchester", "Edinburgh", "Birmingham"],
  "France": ["Paris", "Lyon", "Marseille", "Nice"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Salvador", "Brasília"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth"],
};

export default function MapPage() {
  usePageMetadata('map');

  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

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

  // Get statistics
  const stats = useMemo(() => {
    const uniqueCountries = new Set(eventsWithCoordinates.map(e => e?.country).filter(Boolean));
    const uniqueCities = new Set(eventsWithCoordinates.map(e => e?.city).filter(Boolean));
    const uniqueContinents = new Set(eventsWithCoordinates.map(e => e?.continent).filter(Boolean));

    return {
      totalEvents: eventsWithCoordinates.length,
      countries: uniqueCountries.size,
      cities: uniqueCities.size,
      continents: uniqueContinents.size
    };
  }, [eventsWithCoordinates]);

  // Get featured events (first 3)
  const featuredEvents = useMemo(() => 
    eventsWithCoordinates.slice(0, 3),
    [eventsWithCoordinates]
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

  const clearFilters = () => {
    setSelectedContinent("");
    setSelectedCountry("");
    setSelectedCity("");
  };

  return (
    <Layout>
      <div
        ref={scrollRef}
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        {/* Hero Section with Gradient */}
        <section 
          className="section-padding pt-20 pb-16 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, var(--color-cream) 0%, var(--color-soft-beige) 50%, var(--color-warm-white) 100%)`
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="scroll-animate text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-orange-200 bg-white/80 backdrop-blur-sm">
                <Compass className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>
                  Global Music Discovery
                </span>
              </div>

              <h1
                className="font-serif text-6xl md:text-7xl leading-tight mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                Navigate Musical
                <br />
                <span className="italic relative">
                  Landscapes
                  <div 
                    className="absolute -bottom-2 left-0 w-full h-2 opacity-30 rounded"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                </span>
              </h1>

              <p
                className="text-editorial text-xl max-w-3xl mx-auto leading-relaxed mb-12"
                style={{ color: "var(--color-dark-gray)" }}
              >
                Embark on a journey through sound and space. Each pin on our interactive map 
                represents a unique musical moment, waiting to inspire your next adventure. 
                Discover concerts, festivals, and intimate sessions across the globe.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {[
                  { icon: Music, label: "Events", value: stats.totalEvents },
                  { icon: Globe, label: "Countries", value: stats.countries },
                  { icon: MapPin, label: "Cities", value: stats.cities },
                  { icon: Compass, label: "Continents", value: stats.continents }
                ].map((stat, index) => (
                  <div key={index} className="text-center scroll-animate" style={{ animationDelay: `${index * 100}ms` }}>
                    <stat.icon 
                      className="w-8 h-8 mx-auto mb-2" 
                      style={{ color: "var(--color-accent)" }} 
                    />
                    <div 
                      className="text-3xl font-bold mb-1"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section - Enhanced */}
        <section className="section-padding py-6">
          <div className="max-w-7xl mx-auto">
            <Card className="shadow-lg border-0" style={{ backgroundColor: "white" }}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "var(--color-cream)" }}
                    >
                      <Filter className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                    </div>
                    <div>
                      <CardTitle 
                        className="text-xl mb-1"
                        style={{ color: "var(--color-charcoal)" }}
                      >
                        Explore by Location
                      </CardTitle>
                      <p 
                        className="text-sm"
                        style={{ color: "var(--color-mid-gray)" }}
                      >
                        Filter events to focus on specific regions and discover local scenes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="md:hidden"
                    >
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>

                    {(selectedContinent || selectedCountry || selectedCity) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Continent Filter */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Globe className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                      Continent
                    </Label>
                    <Select value={selectedContinent || "all"} onValueChange={handleContinentChange}>
                      <SelectTrigger className="h-11">
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
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Navigation className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                      Country
                    </Label>
                    <Select 
                      value={selectedCountry || "all"} 
                      onValueChange={handleCountryChange}
                      disabled={!selectedContinent}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={selectedContinent ? "All Countries" : "Select continent first"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {availableCountries.map(country => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City Filter */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                      City
                    </Label>
                    <Select 
                      value={selectedCity || "all"} 
                      onValueChange={handleCityChange}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={selectedCountry ? "All Cities" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {availableCities.map(city => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedContinent || selectedCountry || selectedCity) && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {selectedContinent && (
                        <Badge variant="secondary" className="px-3 py-1">
                          🌍 {selectedContinent}
                        </Badge>
                      )}
                      {selectedCountry && (
                        <Badge variant="secondary" className="px-3 py-1">
                          🏳️ {selectedCountry}
                        </Badge>
                      )}
                      {selectedCity && (
                        <Badge variant="secondary" className="px-3 py-1">
                          🏙️ {selectedCity}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="section-padding py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-320px)]">

              {/* Map Column - Takes 2/3 on large screens */}
              <div className="lg:col-span-2 space-y-4 flex flex-col">
                {/* Map Header */}
                <div className="scroll-animate">
                  <div className="flex items-center justify-between">
                    <h2
                      className="font-serif text-3xl"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      {eventsWithCoordinates.length > 0
                        ? `${eventsWithCoordinates.length} Musical Destinations`
                        : "No Events Found"}
                    </h2>
                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: "var(--color-accent)" }}></div>
                        <span className="text-sm" style={{ color: "var(--color-mid-gray)" }}>Loading...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map - Fixed height */}
                <div className="scroll-animate scroll-animate-delay-1">
                  {isLoading ? (
                    <div 
                      className="rounded-xl animate-pulse shadow-lg"
                      style={{ 
                        height: "400px",
                        backgroundColor: "var(--color-light-gray)"
                      }}
                    ></div>
                  ) : (
                    <div className="relative">
                      <EventMap 
                        events={eventsWithCoordinates} 
                        height="400px"
                        className="rounded-xl shadow-lg overflow-hidden"
                      />
                      {eventsWithCoordinates.length > 0 && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                          <p className="text-xs font-medium" style={{ color: "var(--color-charcoal)" }}>
                            Click any pin to explore
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Map Statistics - Fill bottom space */}
                <div className="scroll-animate scroll-animate-delay-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Events", value: stats.totalEvents, icon: Music, color: "text-blue-600" },
                      { label: "Countries", value: stats.countries, icon: Globe, color: "text-green-600" },
                      { label: "Cities", value: stats.cities, icon: MapPin, color: "text-purple-600" },
                      { label: "Continents", value: stats.continents, icon: Compass, color: "text-orange-600" }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div 
                              className="text-2xl font-bold mb-1"
                              style={{ color: "var(--color-charcoal)" }}
                            >
                              {stat.value}
                            </div>
                            <div 
                              className="text-xs font-medium"
                              style={{ color: "var(--color-mid-gray)" }}
                            >
                              {stat.label}
                            </div>
                          </div>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - Takes 1/3 on large screens */}
              <div className="space-y-6">

                {/* Featured Events */}
                {featuredEvents.length > 0 && (
                  <div className="scroll-animate scroll-animate-delay-2">
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                          <span style={{ color: "var(--color-charcoal)" }}>Featured Events</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {featuredEvents.map((event) => (
                          <Link key={event.id} href={`/event/${event.id}`}>
                            <div className="group cursor-pointer p-3 rounded-lg border border-gray-100 hover:border-orange-200 transition-all duration-200 hover:shadow-md">
                              <h4 className="font-medium text-sm mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>{event.city}, {event.country}</span>
                              </div>
                              {event.date && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}

                        <Link href="/events">
                          <Button variant="outline" className="w-full mt-4" size="sm">
                            View All Events
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Location Search Card */}
                <div className="scroll-animate scroll-animate-delay-3">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                        <span style={{ color: "var(--color-charcoal)" }}>Search Locations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Continent Input */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>
                          Continent
                        </Label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. North America, Europe, Asia..."
                            value={selectedContinent}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedContinent(value);
                              setSelectedCountry("");
                              setSelectedCity("");
                            }}
                            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            style={{ color: "var(--color-charcoal)" }}
                          />
                          {selectedContinent && continents.some(c => c.toLowerCase().includes(selectedContinent.toLowerCase())) && (
                            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-32 overflow-y-auto">
                              {continents
                                .filter(continent => 
                                  continent.toLowerCase().includes(selectedContinent.toLowerCase())
                                )
                                .slice(0, 5)
                                .map(continent => (
                                  <button
                                    key={continent}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                    onClick={() => {
                                      setSelectedContinent(continent);
                                      setSelectedCountry("");
                                      setSelectedCity("");
                                    }}
                                  >
                                    {continent}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Country Input */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>
                          Country
                        </Label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. United States, France, Japan..."
                            value={selectedCountry}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedCountry(value);
                              setSelectedCity("");
                            }}
                            disabled={!selectedContinent}
                            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                            style={{ color: selectedContinent ? "var(--color-charcoal)" : "var(--color-mid-gray)" }}
                          />
                          {selectedCountry && availableCountries.some(c => c.toLowerCase().includes(selectedCountry.toLowerCase())) && (
                            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-32 overflow-y-auto">
                              {availableCountries
                                .filter(country => 
                                  country.toLowerCase().includes(selectedCountry.toLowerCase())
                                )
                                .slice(0, 5)
                                .map(country => (
                                  <button
                                    key={country}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setSelectedCity("");
                                    }}
                                  >
                                    {country}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* City Input */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>
                          City
                        </Label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. New York, Paris, Tokyo..."
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedCountry}
                            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                            style={{ color: selectedCountry ? "var(--color-charcoal)" : "var(--color-mid-gray)" }}
                          />
                          {selectedCity && availableCities.some(c => c.toLowerCase().includes(selectedCity.toLowerCase())) && (
                            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-32 overflow-y-auto">
                              {availableCities
                                .filter(city => 
                                  city.toLowerCase().includes(selectedCity.toLowerCase())
                                )
                                .slice(0, 5)
                                .map(city => (
                                  <button
                                    key={city}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                    onClick={() => setSelectedCity(city)}
                                  >
                                    {city}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Clear button */}
                      {(selectedContinent || selectedCountry || selectedCity) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContinent("");
                            setSelectedCountry("");
                            setSelectedCity("");
                          }}
                          className="w-full mt-3"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Call to Action */}
                <div className="scroll-animate scroll-animate-delay-4">
                  <Card 
                    className="shadow-lg border-0 text-center"
                    style={{ backgroundColor: "var(--color-cream)" }}
                  >
                    <CardContent className="p-6">
                      <Heart 
                        className="w-8 h-8 mx-auto mb-3" 
                        style={{ color: "var(--color-accent)" }} 
                      />
                      <h3 
                        className="font-serif text-lg mb-2"
                        style={{ color: "var(--color-charcoal)" }}
                      >
                        Share Your Musical Journey
                      </h3>
                      <p 
                        className="text-sm mb-4"
                        style={{ color: "var(--color-dark-gray)" }}
                      >
                        Know of an amazing musical experience? Add it to our global community.
                      </p>
                      <Link href="/">
                        <Button 
                          className="w-full"
                          style={{ 
                            backgroundColor: "var(--color-accent)",
                            color: "white"
                          }}
                        >
                          Add Event
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section - Event Grid Preview */}
        {eventsWithCoordinates.length > 3 && (
          <section 
            className="section-padding py-16"
            style={{ backgroundColor: "var(--color-soft-beige)" }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="scroll-animate text-center mb-12">
                <h2
                  className="font-serif text-4xl mb-4"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  More Musical Discoveries
                </h2>
                <p
                  className="text-editorial max-w-2xl mx-auto"
                  style={{ color: "var(--color-dark-gray)" }}
                >
                  Explore our complete collection of events or dive deeper into specific locations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {eventsWithCoordinates.slice(3, 6).map((event, index) => (
                  <Link key={event.id} href={`/event/${event.id}`}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {event.continent}
                          </Badge>
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>

                        <h3 className="font-medium mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {event.shortDescription}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{event.city}, {event.country}</span>
                          {event.date && (
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center scroll-animate">
                <Link href="/events">
                  <Button 
                    size="lg"
                    className="px-8"
                    style={{ 
                      backgroundColor: "var(--color-accent)",
                      color: "white"
                    }}
                  >
                    Explore All Events
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}