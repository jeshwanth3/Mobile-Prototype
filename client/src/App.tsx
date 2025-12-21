import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Pages
import Landing from "@/pages/Landing";
import TestLogin from "@/pages/TestLogin";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import WorkoutDetail from "@/pages/WorkoutDetail";
import WorkoutTracker from "@/pages/WorkoutTracker";
import Coach from "@/pages/Coach";
import Plans from "@/pages/Plans";
import Statistics from "@/pages/Statistics";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/test-login" component={TestLogin} />

      {/* Protected Routes */}
      <Route path="/onboarding">
        <ProtectedRoute component={Onboarding} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/workout/:id">
        <ProtectedRoute component={WorkoutDetail} />
      </Route>
      <Route path="/track/:logId">
        <ProtectedRoute component={WorkoutTracker} />
      </Route>
      <Route path="/coach">
        <ProtectedRoute component={Coach} />
      </Route>
      <Route path="/plans">
        <ProtectedRoute component={Plans} />
      </Route>
      <Route path="/statistics">
        <ProtectedRoute component={Statistics} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>

      {/* Fallback */}
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
