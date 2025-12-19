import { useAuth } from "@/hooks/use-auth";
import { useCurrentPlan, useGeneratePlan } from "@/hooks/use-plans";
import { useProfile } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Repeat } from "lucide-react";
import { useLocation } from "wouter";

export default function Plans() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: plan, isLoading } = useCurrentPlan();
  const generatePlan = useGeneratePlan();
  const [_, setLocation] = useLocation();

  const handleGenerate = async () => {
    if (!profile) return;
    await generatePlan.mutateAsync(profile.id);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Your Plan" />

      {!plan ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <Calendar className="w-16 h-16 text-muted-foreground/50" />
          <div>
            <h3 className="text-xl font-bold text-white">No active plan</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Ready to start your journey? Let our AI build a custom schedule for you.
            </p>
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={generatePlan.isPending || !profile}
            className="h-14 px-8 rounded-full bg-primary text-black font-bold text-lg"
          >
            {generatePlan.isPending ? "Generating..." : "Build My Plan"}
          </Button>
          {!profile && (
            <p className="text-xs text-destructive">
              Please complete your profile first.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
            <div className="flex gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                4 weeks
              </span>
              <span className="flex items-center gap-1.5">
                <Repeat className="w-4 h-4" />
                Hypertrophy Focus
              </span>
            </div>
            
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-primary rounded-full" />
            </div>
            <p className="text-right text-xs text-muted-foreground mt-2">25% Complete</p>
          </div>

          <h3 className="font-bold text-white text-lg">Workouts</h3>
          <div className="space-y-3">
            {plan.workouts?.map((workout) => (
              <WorkoutCard
                key={workout.id}
                title={workout.name}
                exerciseCount={4} // Dynamic in real app
                duration="60 min"
                onClick={() => setLocation(`/workout/${workout.id}`)}
              />
            ))}
          </div>

          <Button 
            variant="outline"
            className="w-full border-dashed border-white/20 hover:bg-white/5 text-muted-foreground h-12"
            onClick={handleGenerate}
            disabled={generatePlan.isPending}
          >
            Regenerate Plan (Reset Progress)
          </Button>
        </div>
      )}
    </Layout>
  );
}
