import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateEventModal } from "@/components/events/create-event-modal";
import { useEvents } from "@/hooks/use-events";
import { MapPin, Calendar, Music, Search, Globe, Heart, Star, Users } from "lucide-react";
import type { Event } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [randomEvents, setRandomEvents] = useState<Event[]>([]);
  
  const { data: allEvents = [], isLoading } = useEvents();
  const latestEvents = allEvents.slice(0, 6);

  // Shuffle events for random section
  useEffect(() => {
    if (allEvents.length > 0) {
      const shuffled = [...allEvents].sort(() => Math.random() - 0.5);
      setRandomEvents(shuffled.slice(0, 6));
    }
  }, [allEvents]);

  const handleSearch = () => {
    // Navigate to events page with search query
    window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
  };

  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country, event.continent].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Cinematic overlay pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Music className="w-16 h-16 mx-auto mb-6 text-orange-500" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-transparent">
              Sonic Atlas
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Discover extraordinary musical experiences around the world
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              From rooftop sets in Medellín to wilderness concerts in Iceland — 
              uncover the magic where music and location create unforgettable moments
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search events, cities, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              Explore
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button 
                size="lg"
                className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <Globe className="w-5 h-5 mr-2" />
                Browse All Events
              </Button>
            </Link>
            <Button 
              size="lg"
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2" />
              Submit Event
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Latest Discoveries</h2>
            <p className="text-xl text-gray-400">Fresh musical experiences added to our atlas</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestEvents.map((event) => (
                <Card key={event.id} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-300 group overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-orange-500/20 to-gray-900 flex items-center justify-center">
                    <Music className="w-12 h-12 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                        New
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white group-hover:text-orange-400 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        {formatLocation(event)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.createdAt).toLocaleDateString()}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {event.shortDescription}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {latestEvents.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No events discovered yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </section>

      {/* Random/Featured Events Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Hidden Gems</h2>
            <p className="text-xl text-gray-400">Curated musical treasures from around the globe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {randomEvents.map((event, index) => (
              <Card key={event.id} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-300 group overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-gray-900 flex items-center justify-center">
                  <Star className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      {formatLocation(event)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {event.shortDescription}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-orange-500" />
          <h2 className="text-4xl font-bold mb-6 text-white">Join the Community</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Help us map the world's most extraordinary musical experiences. 
            Share your discoveries and inspire fellow music lovers.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            <Heart className="w-5 h-5 mr-2" />
            Share Your Discovery
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-8 h-8 text-orange-500" />
                <h3 className="text-2xl font-bold text-white">Sonic Atlas</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Discovering the magic where music and location create unforgettable moments. 
                Your guide to extraordinary sonic experiences around the world.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="/events" className="text-gray-400 hover:text-orange-400 transition-colors">All Events</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition-colors">Categories</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Submit Event</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Newsletter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 Sonic Atlas. Crafted with passion for music and discovery.
            </p>
          </div>
        </div>
      </footer>

      {/* Submit Event Modal */}
      <CreateEventModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}