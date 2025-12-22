import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useWorkout, useLogSet, useCompleteWorkoutLog } from "@/hooks/use-workouts";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { ExerciseItem } from "@/components/ExerciseItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, Save, Flag, Clock, Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkoutTracker() {
  const { logId } = useParams();
  const [_, setLocation] = useLocation();
  
  const { data: workout } = useWorkout(1);
  const logSet = useLogSet();
  const completeLog = useCompleteWorkoutLog();

  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  
  // Rest timer state
  const [restSeconds, setRestSeconds] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isRestActive, setIsRestActive] = useState(false);

  const handleInputChange = (exerciseId: number, setNum: number, field: 'weight' | 'reps', value: string) => {
    setInputs(prev => ({
      ...prev,
      [`${exerciseId}-${setNum}-${field}`]: value
    }));
  };

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRestActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            setIsRestActive(false);
            // Play a sound notification (optional)
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestActive, restTimer]);

  const startRest = (seconds: number) => {
    setRestTimer(seconds);
    setIsRestActive(true);
  };

  const handleLogSet = async (exerciseId: number, setNum: number) => {
    const weight = inputs[`${exerciseId}-${setNum}-weight`];
    const reps = inputs[`${exerciseId}-${setNum}-reps`];
    
    if (!weight || !reps) return;

    await logSet.mutateAsync({
      logId: Number(logId),
      data: {
        workoutLogId: Number(logId),
        exerciseId,
        setNumber: setNum,
        weight: Number(weight),
        reps: Number(reps),
        completed: true
      }
    });
    
    // Auto-start 90-second rest after logging a set
    startRest(90);
  };

  const handleFinish = async () => {
    await completeLog.mutateAsync(Number(logId));
    setLocation("/dashboard");
  };

  if (!workout) return null;

  return (
    <Layout showNav={false}>
      <PageHeader 
        title="Active Workout" 
        subtitle="In Progress"
        action={
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFinish}
            className="text-primary hover:text-primary/80 hover:bg-transparent"
          >
            Finish
          </Button>
        }
      />

      {/* Rest Timer */}
      {isRestActive && restTimer > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-black rounded-full px-6 py-3 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-bold">{restTimer}s</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsRestActive(false)}
              className="text-black hover:bg-black/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4 pb-32">
        {workout.exercises?.sort((a, b) => a.order - b.order).map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            name={exercise.name}
            sets={exercise.targetSets}
            reps={exercise.targetReps}
            order={exercise.order}
            isExpanded={expandedExercise === exercise.id}
            onToggle={() => setExpandedExercise(curr => curr === exercise.id ? null : exercise.id)}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground uppercase font-semibold text-center mb-1">
                <div className="col-span-2">Set</div>
                <div className="col-span-4">kg</div>
                <div className="col-span-4">Reps</div>
                <div className="col-span-2"></div>
              </div>

              {Array.from({ length: exercise.targetSets }).map((_, i) => {
                const setNum = i + 1;
                const isLogged = false; // TODO: Check against actual logs

                return (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2 flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono">
                        {setNum}
                      </div>
                    </div>
                    
                    <div className="col-span-4">
                      <Input 
                        type="number" 
                        placeholder="0"
                        className="h-9 text-center bg-background border-white/10"
                        value={inputs[`${exercise.id}-${setNum}-weight`] || ""}
                        onChange={(e) => handleInputChange(exercise.id, setNum, 'weight', e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-4">
                      <Input 
                        type="number" 
                        placeholder={exercise.targetReps}
                        className="h-9 text-center bg-background border-white/10"
                        value={inputs[`${exercise.id}-${setNum}-reps`] || ""}
                        onChange={(e) => handleInputChange(exercise.id, setNum, 'reps', e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-2 flex justify-center">
                      <Button
                        size="icon"
                        className={cn(
                          "w-9 h-9 rounded-lg transition-colors",
                          isLogged ? "bg-primary text-black" : "bg-white/10 hover:bg-primary/50 text-white"
                        )}
                        onClick={() => handleLogSet(exercise.id, setNum)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ExerciseItem>
        ))}
      </div>

      {/* Persistent "Finish" Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-card border-t border-white/5 pb-safe-area-bottom">
        <Button 
          onClick={handleFinish}
          disabled={completeLog.isPending}
          className="w-full h-14 rounded-2xl text-lg font-bold bg-green-500 text-black hover:bg-green-400"
        >
          {completeLog.isPending ? "Saving..." : "Finish Workout"}
          <Flag className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Layout>
  );
}
