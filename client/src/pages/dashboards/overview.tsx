
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { eventApi } from "@/lib/api";

export default function DashboardOverview() {
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventApi.getEvents(),
  });

  // Calculate statistics
  const totalEvents = events.length;
  const approvedEvents = events.filter(event => event.status === "approved").length;
  const pendingEvents = events.filter(event => event.status === "pending").length;
  const rejectedEvents = events.filter(event => event.status === "rejected").length;

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      description: "All events in the system",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Approved Events",
      value: approvedEvents,
      description: "Events ready for public viewing",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Requests",
      value: pendingEvents,
      description: "Events awaiting approval",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Event Requests",
      value: totalEvents,
      description: "Total submissions received",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor your event management statistics and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Event Status Distribution</CardTitle>
            <CardDescription>
              Overview of event approval status across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <span className="text-sm font-medium">{approvedEvents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${totalEvents > 0 ? (approvedEvents / totalEvents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="text-sm font-medium">{pendingEvents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${totalEvents > 0 ? (pendingEvents / totalEvents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rejected</span>
                </div>
                <span className="text-sm font-medium">{rejectedEvents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${totalEvents > 0 ? (rejectedEvents / totalEvents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button 
              onClick={() => window.location.href = '/dashboards/events'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Manage Events
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin/approvals'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Review Approvals
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              View Public Site
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
