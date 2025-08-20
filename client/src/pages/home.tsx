import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { EventCard } from "@/components/events/event-card";
import { EventMap } from "@/components/map/EventMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { GooglePlacesAutocomplete } from "@/components/ui/google-places-autocomplete";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ChatBot } from "@/components/ui/chatbot";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useEvents, useCreateEvent } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import { APP_CONFIG } from "@shared/config";
import {
  MapPin,
  Calendar,
  Music,
  Search,
  Globe,
  Heart,
  Star,
  Users,
  Map,
  Plus,
  Send,
  Volume2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertEventSchema,
  type Event,
  type InsertEvent,
} from "@shared/schema";
import { getContinentCoordinates, getCountryCoordinates, getCityCoordinates } from "@/lib/coordinates";
import { 
  getContinents, 
  getCountriesForContinent, 
  getCitiesForCountry, 
  searchCities,
  getCountryByName
} from "@/lib/locations";

export default function Home() {
  usePageMetadata("home");

  const [searchQuery, setSearchQuery] = useState("");
  const [randomEvents, setRandomEvents] = useState<Event[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<Array<{isoCode: string, name: string}>>([]);
  const [availableCities, setAvailableCities] = useState<Array<{name: string, latitude?: string, longitude?: string}>>([]);
  const [showContinentSuggestions, setShowContinentSuggestions] = useState(false);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const { toast } = useToast();
  const scrollRef = useScrollAnimation();

  const {
    data: allEvents = [],
    isLoading,
    error,
  } = useEvents({ approved: true });
  const { data: categories = [] } = useCategories();
  const createEventMutation = useCreateEvent();

  // Sort events for latest discoveries (most recent by date) and hidden gems (oldest by date)
  const sortedByDateDesc = allEvents
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedByDateAsc = allEvents
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const latestEvents = sortedByDateDesc.slice(0, 6);
  const hiddenGems = sortedByDateAsc.slice(0, 6);

  // Form setup
  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      heroImage: "",
      shortDescription: "",
      longDescription: "",
      date: "",
      tags: [],
      instagramLink: "",
      continent: "",
      country: "",
      city: "",
      locationName: "",
      latitude: undefined,
      longitude: undefined,
      genreIds: [],
      settingIds: [],
      eventTypeIds: [],
    },
  });

  // Get categories by type
  const genreCategories = categories.filter((cat) => cat.type === "genre");
  const settingCategories = categories.filter((cat) => cat.type === "setting");
  const eventTypeCategories = categories.filter(
    (cat) => cat.type === "eventType",
  );

  // Shuffle events for random section - keeping for now but will replace
  useEffect(() => {
    if (allEvents.length > 0) {
      const shuffled = [...allEvents].sort(() => Math.random() - 0.5);
      setRandomEvents(shuffled.slice(0, 6));
    }
  }, [allEvents]);

  const handleSearch = () => {
    window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
  };

  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country, event.continent].filter(Boolean);
    return parts.join(", ");
  };

  // Handle form submission
  const onSubmit = async (data: InsertEvent) => {
    try {
      // Console log the request payload for testing
      console.log("🧪 HOME FORM SUBMISSION PAYLOAD:", {
        ...data,
        fromDashboard: false,
        timestamp: new Date().toISOString(),
        formType: "home_page_public_form",
      });

      // Events from home page require approval (approved: false)
      await createEventMutation.mutateAsync({ ...data, fromDashboard: false });

      toast({
        title: "Event submitted successfully!",
        description:
          "Your musical discovery has been submitted for review. It will appear publicly once approved.",
      });
      form.reset();
      setSelectedContinent("");
      setAvailableCountries([]);
      setAvailableCities([]);
      setSelectedCountryCode("");

      console.log("✅ HOME FORM SUBMISSION SUCCESS");
    } catch (error) {
      console.error("❌ HOME FORM SUBMISSION ERROR:", error);
      toast({
        title: "Failed to submit event",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch continents on component mount
  useEffect(() => {
    const continents = getContinents();
    // You might want to store or process these continents further if needed
    // For now, we'll just log them to verify
    // console.log("Available continents:", continents);
  }, []);

  return (
    <Layout>
      <div
        ref={scrollRef}
        className="min-h-screen"
        style={{
          backgroundColor: "var(--color-warm-white)",
          color: "var(--color-charcoal)",
        }}
      >
        {/* Hero Section - Kinfolk Style with Background Image */}
        <section className="section-padding-large min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Background Image*/}
          <div className="absolute inset-0 z-0">
            <img
              src="https://thearmstronghotel.com/wp-content/uploads/2019/02/applause-audience-band-196652.jpg"
              alt="Musical performance audience"
              className="w-full h-full object-cover"
            />
            {/* Strong dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90"></div>
            {/* Additional center focus overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-black/40 via-transparent to-black/60"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="scroll-animate mb-16">
              <h1 className="font-serif text-hero mb-8 text-white drop-shadow-lg">
                {APP_CONFIG.name}
              </h1>
              <p className="text-large font-light mb-6 text-white/90 drop-shadow-md">
                {APP_CONFIG.tagline}
              </p>
              <p className="text-editorial max-w-3xl mx-auto mb-12 text-white/80 drop-shadow-sm">
                Discover legendary venues, hidden amphitheaters, and
                transcendent festivals in remarkable settings. Each destination
                tells a story of where music and place create something
                extraordinary.
              </p>
            </div>

            {/* Minimalist Action Buttons */}
            <div className="scroll-animate scroll-animate-delay-1 flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="px-8 py-3 text-sm font-medium rounded-lg border border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50">
                Explore Destinations
              </button>
              <Link href="/events">
                <button className="px-8 py-3 text-sm font-medium rounded-lg bg-white/90 text-gray-900 transition-all duration-300 hover:bg-white hover:shadow-lg">
                  Browse Collection
                </button>
              </Link>
            </div>

            {/* Elegant Search */}
            <div className="scroll-animate scroll-animate-delay-2 max-w-lg mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search destinations, genres, experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full py-4 px-6 border-2 border-white/50 focus:border-white bg-white/20 backdrop-blur-md text-white placeholder-white/80 text-center transition-all duration-300 shadow-lg"
                  style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Minimal scroll indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-px h-16 bg-white/40 animate-pulse"></div>
          </div>
        </section>

        {/* World Map Section - Editorial Style */}
        <section
          className="section-padding"
          style={{ backgroundColor: "var(--color-soft-beige)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="scroll-animate text-center mb-20">
              <h2
                className="font-serif text-section-title mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                Around the World
              </h2>
              <p
                className="text-editorial max-w-2xl mx-auto"
                style={{ color: "var(--color-dark-gray)" }}
              >
                Navigate through musical destinations and discover experiences
                that await in every corner of the globe. Each pin represents a
                story waiting to be told.
              </p>
            </div>

            {/* Interactive Google Maps */}
            <div className="scroll-animate scroll-animate-delay-1">
              <EventMap
                events={allEvents}
                height="500px"
                className="mx-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* 🕵️‍♀️ Last Discoveries Section - Most Recent Events */}
        <section
          className="section-padding"
          style={{ backgroundColor: "var(--color-warm-white)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2
                className="font-serif text-section-title mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                Last Discoveries
              </h2>
              <p
                className="text-editorial max-w-2xl mx-auto"
                style={{ color: "var(--color-dark-gray)" }}
              >
                The most recent musical destinations added to our collection,
                featuring the latest discoveries from explorers worldwide.
              </p>
            </div>

            {isLoading ? (
              <div className="grid-magazine">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="card-minimal rounded-lg overflow-hidden opacity-100"
                    style={{ 
                      transitionDelay: `${i * 0.1}s`,
                      animation: 'none'
                    }}
                  >
                    <div
                      className="h-80 animate-pulse"
                      style={{ backgroundColor: "var(--color-light-gray)" }}
                    ></div>
                    <div className="p-8">
                      <div
                        className="h-6 animate-pulse rounded mb-3"
                        style={{ backgroundColor: "var(--color-light-gray)" }}
                      ></div>
                      <div className="flex gap-4 mb-4">
                        <div
                          className="h-4 animate-pulse rounded w-24"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-32"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div
                          className="h-6 animate-pulse rounded-full w-16"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-6 animate-pulse rounded-full w-20"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div
                          className="h-4 animate-pulse rounded"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-4/5"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-3/5"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div
                        className="h-10 animate-pulse rounded"
                        style={{ backgroundColor: "var(--color-light-gray)" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : latestEvents.length > 0 ? (
              <div className="grid-magazine">
                {latestEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="opacity-100 visible"
                    style={{
                      animation: 'none',
                      transform: 'none',
                      transition: 'none'
                    }}
                  >
                    <EventCard
                      event={event}
                      index={index}
                      showNewBadge={true}
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {latestEvents.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div
                  className="w-20 h-20 mx-auto mb-8 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: "var(--color-light-gray)",
                    color: "var(--color-mid-gray)",
                  }}
                >
                  <Music className="w-10 h-10" />
                </div>
                <h3
                  className="font-serif text-2xl mb-4"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  No discoveries yet
                </h3>
                <p
                  className="text-editorial"
                  style={{ color: "var(--color-mid-gray)" }}
                >
                  Be the first to share an extraordinary musical experience.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Submit Discovery Section - Editorial Style */}
        <section
          className="section-padding"
          style={{ backgroundColor: "var(--color-cream)" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="scroll-animate text-center mb-20">
              <h2
                className="font-serif text-section-title mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                Share Your Discovery
              </h2>
              <p
                className="text-editorial max-w-2xl mx-auto"
                style={{ color: "var(--color-dark-gray)" }}
              >
                Help others discover extraordinary musical experiences. Share
                the places where music and location create something
                unforgettable.
              </p>
            </div>

            <div className="scroll-animate scroll-animate-delay-1 form-minimal">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Event Title *
                    </Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Sunset Concert at Red Rocks"
                      className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
                      style={{
                        borderBottomColor: "var(--color-light-gray)",
                        color: "var(--color-charcoal)",
                      }}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="date"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Event Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      {...form.register("date")}
                      className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
                      style={{
                        borderBottomColor: "var(--color-light-gray)",
                        color: "var(--color-charcoal)",
                      }}
                    />
                    {form.formState.errors.date && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="heroImage"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Hero Image URL
                    </Label>
                    <Input
                      id="heroImage"
                      {...form.register("heroImage")}
                      placeholder="https://example.com/image.jpg"
                      className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
                      style={{
                        borderBottomColor: "var(--color-light-gray)",
                        color: "var(--color-charcoal)",
                      }}
                    />
                    {form.formState.errors.heroImage && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.heroImage.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="continent"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Continent *
                    </Label>
                    <div className="relative">
                      <Input
                        id="continent"
                        {...form.register("continent")}
                        placeholder="e.g. North America, Europe, Asia..."
                        className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
                        style={{
                          borderBottomColor: "var(--color-light-gray)",
                          color: "var(--color-charcoal)",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("continent", value);
                          setSelectedContinent(value);
                          setShowContinentSuggestions(true);
                          // Auto-generate coordinates for continent center
                          const continentCoords = getContinentCoordinates(value);
                          if (continentCoords) {
                            form.setValue("latitude", continentCoords.lat);
                            form.setValue("longitude", continentCoords.lng);
                          }
                          // Reset country and city when continent changes
                          form.setValue("country", "");
                          setAvailableCountries([]);
                          form.setValue("city", "");
                          setAvailableCities([]);
                          setSelectedCountryCode("");
                        }}
                        onFocus={() => setShowContinentSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowContinentSuggestions(false), 200)}
                      />
                      {showContinentSuggestions && getContinents().length > 0 && form.watch("continent") && (
                        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                          {getContinents()
                            .filter(continent => 
                              continent.toLowerCase().includes(form.watch("continent")?.toLowerCase() || "")
                            )
                            .slice(0, 5)
                            .map(continent => (
                              <button
                                key={continent}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                onClick={() => {
                                  form.setValue("continent", continent);
                                  setSelectedContinent(continent);
                                  setShowContinentSuggestions(false);
                                  const continentCoords = getContinentCoordinates(continent);
                                  if (continentCoords) {
                                    form.setValue("latitude", continentCoords.lat);
                                    form.setValue("longitude", continentCoords.lng);
                                  }
                                  // Load countries for the selected continent
                                  const countries = getCountriesForContinent(continent);
                                  setAvailableCountries(countries);

                                  // Reset country and city when continent changes
                                  form.setValue("country", "");
                                  setAvailableCities([]);
                                  form.setValue("city", "");
                                  setSelectedCountryCode("");
                                }}
                              >
                                {continent}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                    {form.formState.errors.continent && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.continent.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Country *
                    </Label>
                    <div className="relative">
                      <Input
                        id="country"
                        {...form.register("country")}
                        placeholder="e.g. United States, France, Japan..."
                        className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
                        style={{
                          borderBottomColor: "var(--color-light-gray)",
                          color: "var(--color-charcoal)",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("country", value);
                          setShowCountrySuggestions(true);

                          // Find matching country and load cities
                          const matchingCountry = availableCountries.find(country => 
                            country.name.toLowerCase() === value.toLowerCase()
                          );
                          if (matchingCountry) {
                            setSelectedCountryCode(matchingCountry.isoCode);
                            const cities = getCitiesForCountry(matchingCountry.isoCode);
                            setAvailableCities(cities);
                            form.setValue("city", ""); // Reset city when country changes
                          }

                          // Auto-generate coordinates for country center
                          const countryCoords = getCountryCoordinates(value);
                          if (countryCoords) {
                            form.setValue("latitude", countryCoords.lat);
                            form.setValue("longitude", countryCoords.lng);
                          }
                        }}
                        onFocus={() => setShowCountrySuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 200)}
                        disabled={!selectedContinent}
                      />
                      {showCountrySuggestions && availableCountries.length > 0 && form.watch("country") && (
                        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                          {availableCountries
                            .filter(country => 
                              country.name.toLowerCase().includes(form.watch("country")?.toLowerCase() || "")
                            )
                            .slice(0, 10)
                            .map(country => (
                              <button
                                key={country.isoCode}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                onClick={() => {
                                  form.setValue("country", country.name);
                                  setSelectedCountryCode(country.isoCode);
                                  setShowCountrySuggestions(false);

                                  // Load cities for this country
                                  const cities = getCitiesForCountry(country.isoCode);
                                  setAvailableCities(cities);
                                  form.setValue("city", ""); // Reset city

                                  const countryCoords = getCountryCoordinates(country.name);
                                  if (countryCoords) {
                                    form.setValue("latitude", countryCoords.lat);
                                    form.setValue("longitude", countryCoords.lng);
                                  }
                                }}
                              >
                                {country.name}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                    {form.formState.errors.country && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.country.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      City *
                    </Label>
                    <div className="relative">
                      <Input
                        id="city"
                        {...form.register("city")}
                        placeholder="e.g. New York, Paris, Tokyo..."
                        className="py-4 px-4 text-base border-0 border-b-2 rounded-none bg-transparent focus:bg-transparent focus:ring-0"
                        style={{
                          borderBottomColor: "var(--color-light-gray)",
                          color: "var(--color-charcoal)",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("city", value);
                          setShowCitySuggestions(true);

                          // Find matching city and use its coordinates
                          const matchingCity = availableCities.find(city => 
                            city.name.toLowerCase() === value.toLowerCase()
                          );
                          if (matchingCity && matchingCity.latitude && matchingCity.longitude) {
                            form.setValue("latitude", parseFloat(matchingCity.latitude));
                            form.setValue("longitude", parseFloat(matchingCity.longitude));
                            form.setValue("locationName", `${value}, ${form.watch("country")}, ${selectedContinent}`);
                          } else {
                            // Fallback to approximate coordinates
                            const cityCoords = getCityCoordinates(selectedContinent, form.watch("country") || "", value);
                            if (cityCoords) {
                              form.setValue("latitude", cityCoords.lat);
                              form.setValue("longitude", cityCoords.lng);
                              form.setValue("locationName", `${value}, ${form.watch("country")}, ${selectedContinent}`);
                            }
                          }
                        }}
                        onFocus={() => setShowCitySuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                        disabled={!selectedCountryCode}
                      />
                      {showCitySuggestions && selectedCountryCode && form.watch("city") && (
                        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                          {searchCities(selectedCountryCode, form.watch("city") || "", undefined, 10)
                            .map(city => (
                              <button
                                key={city.name}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                onClick={() => {
                                  form.setValue("city", city.name);
                                  setShowCitySuggestions(false);

                                  if (city.latitude && city.longitude) {
                                    form.setValue("latitude", parseFloat(city.latitude));
                                    form.setValue("longitude", parseFloat(city.longitude));
                                  } else {
                                    const cityCoords = getCityCoordinates(selectedContinent, form.watch("country") || "", city.name);
                                    if (cityCoords) {
                                      form.setValue("latitude", cityCoords.lat);
                                      form.setValue("longitude", cityCoords.lng);
                                    }
                                  }
                                  form.setValue("locationName", `${city.name}, ${form.watch("country")}, ${selectedContinent}`);
                                }}
                              >
                                {city.name}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                    {form.formState.errors.city && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Display selected location coordinates */}
                {form.watch("latitude") !== undefined && form.watch("longitude") !== undefined && (
                  <div
                    className="mt-4 p-4 rounded-lg"
                    style={{ backgroundColor: "var(--color-soft-beige)" }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-dark-gray)" }}
                    >
                      <strong>Location:</strong> {form.watch("city")},{" "}
                      {form.watch("country")}, {form.watch("continent")}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Coordinates: {form.watch("latitude")?.toFixed(6)},{" "}
                      {form.watch("longitude")?.toFixed(6)}
                    </p>
                  </div>
                )}

                {/* Instagram Link */}
                <div className="space-y-8">
                  <h3
                    className="font-serif text-xl"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    Social Media
                  </h3>
                  <div className="space-y-3">
                    <Label
                      htmlFor="instagramLink"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Instagram Link
                    </Label>
                    <Input
                      id="instagramLink"
                      {...form.register("instagramLink")}
                      placeholder="https://instagram.com/..."
                      className="py-4 px-4 text-base border-2 rounded-lg"
                      style={{
                        borderColor: "var(--color-light-gray)",
                        backgroundColor: "var(--color-warm-white)",
                        color: "var(--color-charcoal)",
                      }}
                    />
                    {form.formState.errors.instagramLink && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.instagramLink.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-8">
                  <h3
                    className="font-serif text-xl"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    Description
                  </h3>

                  <div className="space-y-3">
                    <Label
                      htmlFor="shortDescription"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Short Description *
                    </Label>
                    <Textarea
                      id="shortDescription"
                      {...form.register("shortDescription")}
                      placeholder="A captivating summary of this musical experience..."
                      rows={4}
                      className="py-4 px-4 text-base border-2 rounded-lg resize-none"
                      style={{
                        borderColor: "var(--color-light-gray)",
                        backgroundColor: "var(--color-warm-white)",
                        color: "var(--color-charcoal)",
                      }}
                    />
                    {form.formState.errors.shortDescription && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.shortDescription.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="longDescription"
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      Full Story *
                    </Label>
                    <RichTextEditor
                      value={form.watch("longDescription") || ""}
                      onChange={(value) =>
                        form.setValue("longDescription", value)
                      }
                      placeholder="Tell the full story of this extraordinary musical destination..."
                      height="200px"
                    />
                    {form.formState.errors.longDescription && (
                      <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
                        {form.formState.errors.longDescription.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-center pt-8">
                  <button
                    type="submit"
                    disabled={createEventMutation.isPending}
                    className="btn-primary px-12 py-4 text-base font-medium uppercase tracking-wide flex items-center justify-center mx-auto"
                  >
                    {createEventMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Discovery...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Discovery
                      </>
                    )}
                  </button>

                  {/* Form validation errors */}
                  {Object.keys(form.formState.errors).length > 0 && (
                    <div
                      className="mt-6 p-4 rounded-lg"
                      style={{
                        backgroundColor: "#fee2e2",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#dc2626" }}
                      >
                        Please fix the following errors:
                      </p>
                      <ul className="mt-2 text-sm" style={{ color: "#991b1b" }}>
                        {Object.entries(form.formState.errors).map(
                          ([field, error]) => (
                            <li key={field} className="list-disc ml-5">
                              {field}:{" "}
                              {error?.message || "This field is required"}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 💎 Hidden Gems Section - Oldest Events */}
        <section
          className="section-padding"
          style={{ backgroundColor: "var(--color-soft-beige)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2
                className="font-serif text-section-title mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                💎 Hidden Gems
              </h2>
              <p
                className="text-editorial max-w-2xl mx-auto"
                style={{ color: "var(--color-dark-gray)" }}
              >
                Timeless musical treasures from our archives, featuring the
                earliest discoveries that continue to inspire wanderers.
              </p>
            </div>

            {isLoading ? (
              <div className="grid-magazine">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="card-minimal rounded-lg overflow-hidden opacity-100"
                    style={{ 
                      transitionDelay: `${i * 0.15}s`,
                      animation: 'none'
                    }}
                  >
                    <div
                      className="h-80 animate-pulse"
                      style={{ backgroundColor: "var(--color-light-gray)" }}
                    ></div>
                    <div className="p-8">
                      <div
                        className="h-6 animate-pulse rounded mb-3"
                        style={{ backgroundColor: "var(--color-light-gray)" }}
                      ></div>
                      <div className="flex gap-4 mb-4">
                        <div
                          className="h-4 animate-pulse rounded w-24"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-32"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div
                          className="h-6 animate-pulse rounded-full w-16"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-6 animate-pulse rounded-full w-20"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div
                          className="h-4 animate-pulse rounded"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-4/5"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                        <div
                          className="h-4 animate-pulse rounded w-3/5"
                          style={{ backgroundColor: "var(--color-light-gray)" }}
                        ></div>
                      </div>
                      <div
                        className="h-10 animate-pulse rounded"
                        style={{ backgroundColor: "var(--color-light-gray)" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hiddenGems.length > 0 ? (
              <div className="grid-magazine">
                {hiddenGems.map((event, index) => (
                  <div
                    key={event.id}
                    className="opacity-100 visible"
                    style={{
                      animation: 'none',
                      transform: 'none',
                      transition: 'none'
                    }}
                  >
                    <EventCard event={event} index={index} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Floating ChatBot */}
      <ChatBot />
    </Layout>
  );
}