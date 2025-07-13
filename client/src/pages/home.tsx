import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { EventCard } from "@/components/events/event-card";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
import { cities } from "@/lib/cities";

export default function Home() {
  usePageMetadata("home");

  const [searchQuery, setSearchQuery] = useState("");
  const [randomEvents, setRandomEvents] = useState<Event[]>([]);
  const [selectedContinent, setSelectedContinent] = useState("");
  const { toast } = useToast();
  const scrollRef = useScrollAnimation();

  const { data: allEvents = [], isLoading, error } = useEvents();
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
      await createEventMutation.mutateAsync(data);
      toast({
        title: "Event submitted successfully!",
        description: "Your musical discovery has been added to Soundpath.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to submit event",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

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

            {/* Minimalist Map Container */}
            <div
              className="scroll-animate scroll-animate-delay-1 relative h-96 rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--color-light-gray)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-current flex items-center justify-center"
                    style={{
                      borderColor: "var(--color-mid-gray)",
                      color: "var(--color-mid-gray)",
                    }}
                  >
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3
                    className="font-serif text-2xl mb-3"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    Interactive Map
                  </h3>
                  <p
                    className="text-editorial"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    {allEvents.length} musical experiences across the globe
                  </p>
                </div>
              </div>

              {/* Subtle Event Location Indicators */}
              {allEvents.slice(0, 8).map((event, index) => (
                <div
                  key={event.id}
                  className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-125 transition-transform duration-300"
                  style={{
                    backgroundColor: "var(--color-charcoal)",
                    left: `${20 + index * 8}%`,
                    top: `${30 + (index % 3) * 20}%`,
                  }}
                  title={`${event.title} - ${formatLocation(event)}`}
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* 🕵️‍♀️ Last Discoveries Section - Most Recent Events */}
        <section
          className="section-padding"
          style={{ backgroundColor: "var(--color-warm-white)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="scroll-animate text-center mb-20">
              <h2
                className="font-serif text-section-title mb-8"
                style={{ color: "var(--color-charcoal)" }}
              >
                🕵️‍♀️ Last Discoveries
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
                    className="scroll-animate card-minimal rounded-lg overflow-hidden"
                    style={{ transitionDelay: `${i * 0.1}s` }}
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
            ) : (
              <div className="grid-magazine">
                {latestEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    showNewBadge={true}
                  />
                ))}
              </div>
            )}

            {latestEvents.length === 0 && !isLoading && (
              <div className="scroll-animate text-center py-20">
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
                <div className="space-y-8">
                  <h3
                    className="font-serif text-xl"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label
                        htmlFor="continent"
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: "var(--color-charcoal)" }}
                      >
                        Continent *
                      </Label>
                      <Select
                        value={form.watch("continent") || ""}
                        onValueChange={(value) => {
                          form.setValue("continent", value);
                          form.setValue("country", "");
                          form.setValue("city", "");
                          setSelectedContinent(value);
                        }}
                      >
                        <SelectTrigger
                          className="py-4 border-0 border-b-2 rounded-none bg-transparent"
                          style={{
                            borderBottomColor: "var(--color-light-gray)",
                          }}
                        >
                          <SelectValue placeholder="Select continent" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(cities).map((continent) => (
                            <SelectItem key={continent} value={continent}>
                              {continent}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: "var(--color-charcoal)" }}
                      >
                        Country *
                      </Label>
                      <Select
                        value={form.watch("country") || ""}
                        onValueChange={(value) => {
                          form.setValue("country", value);
                          form.setValue("city", "");
                        }}
                        disabled={!form.watch("continent")}
                      >
                        <SelectTrigger
                          className="py-4 border-0 border-b-2 rounded-none bg-transparent"
                          style={{
                            borderBottomColor: "var(--color-light-gray)",
                          }}
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {form.watch("continent") &&
                            Object.keys(
                              cities[
                                form.watch("continent") as keyof typeof cities
                              ] || {},
                            ).map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="city"
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: "var(--color-charcoal)" }}
                      >
                        City *
                      </Label>
                      <CityAutocomplete
                        continent={selectedContinent}
                        country={form.watch("country") || ""}
                        value={form.watch("city") || ""}
                        onChange={(value) => form.setValue("city", value)}
                        placeholder="Search for a city..."
                        disabled={!form.watch("country")}
                      />
                    </div>
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
                    className="btn-primary px-12 py-4 text-base font-medium uppercase tracking-wide"
                  >
                    {createEventMutation.isPending
                      ? "Submitting..."
                      : "Submit Discovery"}
                  </button>
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
            <div className="scroll-animate text-center mb-20">
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
                    className="scroll-animate card-minimal rounded-lg overflow-hidden"
                    style={{ transitionDelay: `${i * 0.15}s` }}
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
            ) : (
              <div className="grid-magazine">
                {hiddenGems.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer - Kinfolk Minimal */}
        <footer
          className="section-padding"
          style={{
            backgroundColor: "var(--color-charcoal)",
            color: "var(--color-warm-white)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="scroll-animate text-center mb-16">
              <h3
                className="font-serif text-3xl mb-8"
                style={{ color: "var(--color-warm-white)" }}
              >
                Soundpath
              </h3>
              <p
                className="text-editorial max-w-lg mx-auto mb-12"
                style={{ color: "var(--color-mid-gray)" }}
              >
                Discovering breathtaking musical destinations worldwide. Where
                music and place create something extraordinary.
              </p>
            </div>

            <div className="scroll-animate scroll-animate-delay-1 grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
              <div>
                <h4
                  className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                  style={{ color: "var(--color-warm-white)" }}
                >
                  Explore
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/events"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      All Destinations
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Featured
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                  style={{ color: "var(--color-warm-white)" }}
                >
                  Community
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#submit"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Submit Discovery
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Guidelines
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                  style={{ color: "var(--color-warm-white)" }}
                >
                  Connect
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Newsletter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                  style={{ color: "var(--color-warm-white)" }}
                >
                  Legal
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="scroll-animate scroll-animate-delay-2 text-center pt-12"
              style={{ borderTop: "1px solid var(--color-dark-gray)" }}
            >
              <p className="text-sm" style={{ color: "var(--color-mid-gray)" }}>
                © 2025 Soundpath. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
