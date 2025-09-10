import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Mail, Search, MessageSquare, Calendar, User } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

function useContactMessages() {
  return useQuery<{success: boolean; data: ContactMessage[]}>({
    queryKey: ["/api/contact-messages"],
  });
}

export default function ContactMessagesDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: response, isLoading, error } = useContactMessages();
  
  const contactMessages = response?.data || [];
  
  // Filter messages based on search query
  const filteredMessages = contactMessages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Messages</h1>
          <p className="text-slate-600">Manage messages from your website visitors</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Messages</h1>
          <p className="text-slate-600">Manage messages from your website visitors</p>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Error loading messages</span>
            </div>
            <p className="text-red-600 mt-1">Unable to fetch contact messages. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Messages</h1>
          <p className="text-slate-600">Manage messages from your website visitors</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {contactMessages.length} total messages
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{contactMessages.length}</h3>
                <p className="text-slate-600">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {contactMessages.filter(msg => 
                    new Date(msg.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </h3>
                <p className="text-slate-600">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {new Set(contactMessages.map(msg => msg.email)).size}
                </h3>
                <p className="text-slate-600">Unique Senders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search messages by name, email, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-messages"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {contactMessages.length === 0 ? "No messages yet" : "No matching messages"}
              </h3>
              <p className="text-slate-600">
                {contactMessages.length === 0 
                  ? "Contact messages will appear here when visitors use the contact form." 
                  : "Try adjusting your search terms."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3" />
                        <a 
                          href={`mailto:${message.email}`}
                          className="hover:text-blue-600 transition-colors"
                          data-testid={`link-email-${message.id}`}
                        >
                          {message.email}
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="outline" className="text-xs">
                    Message ID: {message.id.slice(0, 8)}...
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`mailto:${message.email}?subject=Re: Your message to Sonic Paths&body=Hi ${message.name},%0A%0AThank you for reaching out to us.%0A%0A`)}
                    data-testid={`button-reply-${message.id}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredMessages.length > 0 && (
        <div className="text-center py-4">
          <p className="text-slate-500">
            Showing {filteredMessages.length} of {contactMessages.length} messages
          </p>
        </div>
      )}
    </div>
  );
}