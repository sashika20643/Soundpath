import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import EventsPublic from "@/pages/events-public";
import DashboardEvents from "@/pages/dashboards/events";
import EventDetails from "@/pages/event-details";
import ApprovalDashboard from "@/pages/approval-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/events" component={EventsPublic} />
      <Route path="/dashboards/events" component={DashboardEvents} />
      <Route path="/admin/approvals" component={ApprovalDashboard} />
      <Route path="/event/:id" component={EventDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
