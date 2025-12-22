import { useAuth } from "@/hooks/use-auth";
import { useCurrentPlan, useProfile } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2, Zap, Flame, TrendingUp, Target, Award, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: plan, isLoading: planLoading } = useCurrentPlan();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!profileLoading && !profile) {
      setLocation("/onboarding");
    }
  }, [profile, profileLoading, setLocation]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (profileLoading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

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

  const nextWorkout = plan.workouts?.[0];
  const goalIcon = profile.goal === 'strength' ? Target : profile.goal === 'hypertrophy' ? TrendingUp : Zap;
  const GoalIcon = goalIcon;

  return (
    <Layout>
      <PageHeader 
        title={`${getGreeting()}, ${user?.firstName || 'Athlete'}`}
        subtitle={`Time to ${profile.goal.replace('_', ' ')}`}
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

      {/* Hero Section - Profile Snapshot */}
      <div className="bg-gradient-to-br from-primary/15 to-accent/10 rounded-3xl p-6 mb-8 border border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Goal</p>
            <div className="flex items-center gap-2">
              <GoalIcon className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-white capitalize">{profile.goal.replace('_', ' ')}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Experience</p>
            <Badge text={profile.experienceLevel} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="text-lg font-bold text-white">{profile.weight} kg</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Days/Week</p>
            <p className="text-lg font-bold text-primary">{profile.daysPerWeek}x</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Weekly Goal</p>
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-xs text-muted-foreground mt-1">day streak</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">This Week</p>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-bold text-white">2h 20m</p>
          <p className="text-xs text-muted-foreground mt-1">completed</p>
        </Card>
      </div>

      {/* Quick Stats Carousel */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Performance</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <StatPill label="Workouts" value="12/24" primary />
          <StatPill label="Volume" value="2,450 lbs" />
          <StatPill label="Sets Done" value="48" />
          <StatPill label="Avg Duration" value="52 min" />
        </div>
      </div>

      {/* Next Workout - Featured */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Ready to Go?</h3>
        {nextWorkout ? (
          <WorkoutCard
            title={nextWorkout.name}
            subtitle={nextWorkout.description || "Scheduled for today"}
            exerciseCount={5}
            duration="45 min"
            isNext={true}
            onClick={() => setLocation(`/workout/${nextWorkout.id}`)}
          />
        ) : (
          <div className="p-6 rounded-2xl bg-card border border-white/5 text-center">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">All workouts completed!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => setLocation("/stats")}
          className="bg-card border border-white/5 rounded-2xl p-4 text-left hover:border-primary/30 transition-colors"
        >
          <TrendingUp className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground">View Stats</p>
          <p className="text-sm font-bold text-white">Progress</p>
        </button>
        <button
          onClick={() => setLocation("/coach")}
          className="bg-card border border-white/5 rounded-2xl p-4 text-left hover:border-accent/30 transition-colors"
        >
          <Zap className="w-5 h-5 text-accent mb-2" />
          <p className="text-xs text-muted-foreground">Ask AI Coach</p>
          <p className="text-sm font-bold text-white">Guidance</p>
        </button>
      </div>

      {/* Upcoming Workouts */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">This Week</h3>
          <button 
            onClick={() => setLocation("/plans")} 
            className="flex items-center gap-1 text-xs text-primary font-medium hover:gap-2 transition-all"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {plan.workouts?.slice(1, 3).map((workout, idx) => (
            <div
              key={workout.id}
              onClick={() => setLocation(`/workout/${workout.id}`)}
              className="flex items-center justify-between p-4 bg-card rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-bold text-white">{workout.name}</p>
                  <p className="text-xs text-muted-foreground">{idx + 2} exercises</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function StatPill({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className={`flex-shrink-0 px-4 py-3 rounded-full whitespace-nowrap border transition-all ${
      primary
        ? 'bg-primary/20 border-primary/30 text-white'
        : 'bg-card border-white/5 text-muted-foreground hover:border-white/10'
    }`}>
      <p className="text-xs font-medium">{label}</p>
      <p className={`text-lg font-bold ${primary ? 'text-primary' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 rounded-full text-xs font-medium text-accent capitalize">
      {text}
    </span>
  );
}
