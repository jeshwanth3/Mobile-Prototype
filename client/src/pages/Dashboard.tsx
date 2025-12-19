import { useAuth } from "@/hooks/use-auth";
import { useCurrentPlan, useWorkoutsList } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useLocation } from "wouter";
import { Loader2, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: plan, isLoading: planLoading } = useCurrentPlan();
  const [_, setLocation] = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // If no plan, redirect to plan generation or show empty state
  if (!plan) {
    return (
      <Layout>
        <div className="flex flex-col h-[80vh] items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
            <Zap className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Active Plan</h2>
          <p className="text-muted-foreground max-w-xs">
            You don't have a workout plan yet. Let AI generate one for you.
          </p>
          <Button 
            onClick={() => setLocation("/plans")}
            className="h-12 px-8 rounded-full bg-primary text-black font-bold"
          >
            Generate Plan
          </Button>
        </div>
      </Layout>
    );
  }

  // Find next workout (simplified logic: just take the first one or based on day)
  const nextWorkout = plan.workouts?.[0];

  return (
    <Layout>
      <PageHeader 
        title={`${getGreeting()}, ${user?.firstName || 'Athlete'}`}
        subtitle="Ready to crush your goals?"
        action={
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary text-black">
                {user?.firstName?.[0] || "U"}
              </div>
            )}
          </div>
        }
      />

      {/* Weekly Stats or Streak (Placeholder) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card p-4 rounded-2xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">Workouts</p>
          <p className="text-2xl font-display font-bold text-white">12 <span className="text-xs font-normal text-muted-foreground">/ 24</span></p>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">Streak</p>
          <p className="text-2xl font-display font-bold text-accent">4 Days</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        Up Next
      </h2>

      {nextWorkout ? (
        <div className="mb-8">
          <WorkoutCard
            title={nextWorkout.name}
            subtitle={nextWorkout.description || "Scheduled for today"}
            exerciseCount={5} // This would come from real data
            duration="45 min"
            isNext={true}
            onClick={() => setLocation(`/workout/${nextWorkout.id}`)}
          />
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-card border border-white/5 text-center mb-8">
          <p className="text-muted-foreground">All workouts completed for this cycle!</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Weekly Schedule</h2>
        <Link href="/plans" className="text-xs text-primary font-medium">View Plan</Link>
      </div>

      <div className="space-y-3">
        {plan.workouts?.slice(1, 4).map((workout) => (
          <WorkoutCard
            key={workout.id}
            title={workout.name}
            exerciseCount={4}
            duration="60 min"
            onClick={() => setLocation(`/workout/${workout.id}`)}
          />
        ))}
      </div>
    </Layout>
  );
}
