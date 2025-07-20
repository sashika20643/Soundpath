import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents, useApproveEvent } from "@/hooks/use-events";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import type { Event } from "@shared/schema";
import { CheckCircle, XCircle, MapPin, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function ApprovalDashboard() {
  usePageMetadata("dashboard");
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch events based on active tab
  const { data: pendingEvents = [], isLoading: loadingPending } = useEvents({
    approved: false,
  });

  const { data: approvedEvents = [], isLoading: loadingApproved } = useEvents({
    approved: true,
  });

  const approveEventMutation = useApproveEvent();

  const handleApprove = (eventId: string, approved: boolean) => {
    approveEventMutation.mutate({ id: eventId, approved });
  };

  const EventCard = ({
    event,
    showActions = true,
  }: {
    event: Event;
    showActions?: boolean;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.date), "MMM dd, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.city}, {event.country}
              </span>
            </CardDescription>
          </div>
          <Badge variant={event.approved ? "default" : "secondary"}>
            {event.approved ? "Approved" : "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {event.heroImage && (
          <img
            src={event.heroImage}
            alt={event.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        <p className="text-sm text-muted-foreground line-clamp-3">
          {event.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-4">
          <Link href={`/event/${event.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>

          {showActions && !event.approved && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApprove(event.id, false)}
                disabled={approveEventMutation.isPending}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleApprove(event.id, true)}
                disabled={approveEventMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Event Approvals
            </h1>
            <p className="text-gray-600">
              Review and approve events submitted by users
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pending">
                Pending ({pendingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {loadingPending ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pendingEvents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">All caught up!</p>
                    <p className="text-muted-foreground">
                      No events are waiting for approval
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              {loadingApproved ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : approvedEvents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      No approved events
                    </p>
                    <p className="text-muted-foreground">
                      Approved events will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {approvedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
