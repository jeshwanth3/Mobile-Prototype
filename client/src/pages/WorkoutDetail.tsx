import { useParams, useLocation } from "wouter";
import { useWorkout, useStartWorkoutLog } from "@/hooks/use-workouts";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { ExerciseItem } from "@/components/ExerciseItem";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Clock, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WorkoutDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { data: workout, isLoading } = useWorkout(Number(id));
  const startLog = useStartWorkoutLog();
  const { toast } = useToast();

  const handleStartWorkout = async () => {
    try {
      const log = await startLog.mutateAsync(Number(id));
      setLocation(`/track/${log.id}`);
    } catch (error) {
      toast({ title: "Error", description: "Could not start workout", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workout) return null;

  return (
    <Layout showNav={false}>
      <PageHeader 
        title={workout.name} 
        backHref="/dashboard"
      />

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>45-60 min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg">
            <Dumbbell className="w-4 h-4" />
            <span>{workout.exercises?.length || 0} exercises</span>
          </div>
        </div>

        {/* Description */}
        {workout.description && (
          <p className="text-muted-foreground leading-relaxed">
            {workout.description}
          </p>
        )}

        {/* Exercises List */}
        <div className="space-y-4 pb-24">
          <h3 className="font-bold text-white text-lg">Exercises</h3>
          {workout.exercises?.sort((a, b) => a.order - b.order).map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              name={exercise.name}
              sets={exercise.targetSets}
              reps={exercise.targetReps}
              order={exercise.order}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pb-safe-area-bottom">
        <Button 
          onClick={handleStartWorkout}
          disabled={startLog.isPending}
          className="w-full h-14 rounded-2xl text-lg font-bold bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {startLog.isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Play className="w-5 h-5 mr-2 fill-black" />
              Start Workout
            </>
          )}
        </Button>
      </div>
    </Layout>
  );
}
