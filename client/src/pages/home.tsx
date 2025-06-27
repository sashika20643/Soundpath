import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useEvents, useCreateEvent } from "@/hooks/use-events";
import { useCategories } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Music, Search, Globe, Heart, Star, Users, Map, Plus, Send, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema, type Event, type InsertEvent } from "@shared/schema";
import { cities } from "@/lib/cities";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [randomEvents, setRandomEvents] = useState<Event[]>([]);
  const [selectedContinent, setSelectedContinent] = useState("");
  const { toast } = useToast();
  
  const { data: allEvents = [], isLoading } = useEvents();
  const { data: categories = [] } = useCategories();
  const createEventMutation = useCreateEvent();
  
  const latestEvents = allEvents.slice(0, 6);

  // Form setup
  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      heroImage: "",
      shortDescription: "",
      longDescription: "",
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
  const genreCategories = categories.filter(cat => cat.type === 'genre');
  const settingCategories = categories.filter(cat => cat.type === 'setting');
  const eventTypeCategories = categories.filter(cat => cat.type === 'eventType');

  // Shuffle events for random section
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
    <div className="min-h-screen bg-black text-white">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with concert atmosphere */}
        <div className="absolute inset-0">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-black/60 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="mb-12 animate-fade-in">
            <Volume2 className="w-20 h-20 mx-auto mb-8 text-orange-500 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-transparent">
                Soundpath
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-orange-300 mb-6 font-light">
              The most breathtaking places on Earth to feel music
            </p>
            <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover legendary venues, hidden amphitheaters, and transcendent festivals in remarkable settings
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Map className="w-6 h-6 mr-3" />
              Explore The Map
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Featured Destinations
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search destinations, events, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-4 bg-black/60 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 rounded-full text-lg backdrop-blur-sm"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full transition-all duration-300"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-orange-400 rounded-full flex justify-center items-start pt-2">
            <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Explore the World</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Navigate through musical destinations and discover experiences that await in every corner of the globe
            </p>
          </div>
          
          {/* Map Placeholder with Event Markers */}
          <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <h3 className="text-2xl font-semibold text-white mb-2">Interactive Map Coming Soon</h3>
                <p className="text-gray-400">
                  Discover {allEvents.length} musical experiences across the globe
                </p>
              </div>
            </div>
            
            {/* Event Location Markers */}
            {allEvents.slice(0, 8).map((event, index) => (
              <div
                key={event.id}
                className="absolute w-4 h-4 bg-orange-500 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform duration-300"
                style={{
                  left: `${20 + (index * 8)}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                title={`${event.title} - ${formatLocation(event)}`}
              >
                <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Discoveries Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Latest Discoveries</h2>
            <p className="text-xl text-gray-400">Fresh musical experiences from around the world</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 h-64 rounded-xl mb-4"></div>
                  <div className="bg-gray-800 h-4 rounded mb-2"></div>
                  <div className="bg-gray-800 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestEvents.map((event, index) => (
                <Card key={event.id} className="bg-gray-900 border-gray-800 hover:border-orange-500 transition-all duration-500 group overflow-hidden transform hover:scale-105">
                  <div className="relative h-64 overflow-hidden">
                    {event.heroImage ? (
                      <img 
                        src={event.heroImage} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-600/30 via-gray-800 to-gray-900 flex items-center justify-center">
                        <Volume2 className="w-16 h-16 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-600 text-white">
                        New
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{formatLocation(event)}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {event.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {latestEvents.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Volume2 className="w-20 h-20 mx-auto mb-6 text-gray-700" />
              <h3 className="text-2xl font-semibold text-gray-500 mb-4">No discoveries yet</h3>
              <p className="text-gray-600 text-lg">Be the first to share an extraordinary musical experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Event Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Submit Event</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Share your discovery of an extraordinary musical experience and help others find breathtaking destinations
            </p>
          </div>

          <Card className="bg-black border-gray-800 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-white">Event Title *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Sunset Concert at Red Rocks"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-400 mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="heroImage" className="text-white">Hero Image URL</Label>
                    <Input
                      id="heroImage"
                      {...form.register("heroImage")}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                    {form.formState.errors.heroImage && (
                      <p className="text-sm text-red-400 mt-1">{form.formState.errors.heroImage.message}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="continent" className="text-white">Continent *</Label>
                    <Select 
                      value={form.watch("continent") || ""}
                      onValueChange={(value) => {
                        form.setValue("continent", value);
                        form.setValue("country", "");
                        form.setValue("city", "");
                        setSelectedContinent(value);
                      }}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
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

                  <div>
                    <Label htmlFor="country" className="text-white">Country *</Label>
                    <Select 
                      value={form.watch("country") || ""}
                      onValueChange={(value) => {
                        form.setValue("country", value);
                        form.setValue("city", "");
                      }}
                      disabled={!form.watch("continent")}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {form.watch("continent") && 
                          Object.keys(cities[form.watch("continent") as keyof typeof cities] || {}).map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-white">City *</Label>
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

                {/* Descriptions */}
                <div>
                  <Label htmlFor="shortDescription" className="text-white">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    {...form.register("shortDescription")}
                    placeholder="A captivating summary of this musical experience..."
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                  {form.formState.errors.shortDescription && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.shortDescription.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="longDescription" className="text-white">Full Description *</Label>
                  <RichTextEditor
                    value={form.watch("longDescription") || ""}
                    onChange={(value) => form.setValue("longDescription", value)}
                    placeholder="Tell the full story of this extraordinary musical destination..."
                    height="200px"
                  />
                  {form.formState.errors.longDescription && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.longDescription.message}</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button 
                    type="submit"
                    size="lg"
                    disabled={createEventMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    {createEventMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Submit Discovery
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hidden Gems Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Hidden Gems</h2>
            <p className="text-xl text-gray-400">Curated musical treasures from around the globe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {randomEvents.map((event, index) => (
              <Card key={event.id} className="bg-gray-900 border-gray-800 hover:border-orange-500 transition-all duration-500 group overflow-hidden transform hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  {event.heroImage ? (
                    <img 
                      src={event.heroImage} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/30 via-gray-800 to-gray-900 flex items-center justify-center">
                      <Star className="w-16 h-16 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-600 text-white">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{formatLocation(event)}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {event.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Volume2 className="w-10 h-10 text-orange-500" />
                <h3 className="text-3xl font-bold text-white">Soundpath</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-lg leading-relaxed">
                Discover legendary venues, hidden amphitheaters, and transcendent festivals in remarkable settings. 
                Your guide to the most breathtaking places on Earth to feel music.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <Volume2 className="w-5 h-5 text-gray-400 hover:text-white" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <Map className="w-5 h-5 text-gray-400 hover:text-white" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-gray-400 hover:text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Explore</h4>
              <ul className="space-y-3">
                <li><Link href="/events" className="text-gray-400 hover:text-orange-400 transition-colors">All Destinations</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition-colors">Categories</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Featured</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Map</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Community</h4>
              <ul className="space-y-3">
                <li><a href="#submit" className="text-gray-400 hover:text-orange-400 transition-colors">Submit Discovery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 mb-4 md:mb-0">
                © 2025 Soundpath. Discovering breathtaking musical destinations worldwide.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors text-sm">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}