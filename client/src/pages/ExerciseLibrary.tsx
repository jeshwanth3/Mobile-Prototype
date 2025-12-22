import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Play, ChevronLeft, BookOpen, Zap, X } from "lucide-react";
import { useLocation } from "wouter";

interface ExerciseGuide {
  id: number;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl: string;
  description: string;
  steps: string[];
  tips: string[];
  commonMistakes: string[];
  muscleGroups: string[];
}

const EXERCISE_GUIDES: ExerciseGuide[] = [
  {
    id: 1,
    name: "Barbell Bench Press",
    category: "Chest",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/embed/gRVjAtPtqK0",
    description: "The barbell bench press is a compound pushing movement that primarily targets the chest, shoulders, and triceps. It's considered the gold standard for building upper body strength and muscle mass.",
    steps: [
      "Set up on a flat bench with feet firmly planted on the floor",
      "Position the bar at chest height (approximately at your nipple line)",
      "Grip the bar slightly wider than shoulder-width with a full hand grip",
      "Arch your back slightly and retract your shoulder blades into the bench",
      "Lower the bar in a controlled manner to your mid-chest",
      "Pause briefly at the bottom position",
      "Drive the bar upward explosively, pushing with your chest and shoulders",
      "Lock out at the top with full elbow extension"
    ],
    tips: [
      "Maintain a strong arch with your upper back throughout",
      "Keep your feet firmly planted for stability and leg drive",
      "Lower the bar at a controlled pace to maximize time under tension",
      "Focus on chest contraction at the top of each rep",
      "Use a spotter for heavier weights for safety"
    ],
    commonMistakes: [
      "Lowering the bar too quickly without control",
      "Not achieving a full stretch at the bottom",
      "Flaring elbows excessively (increases shoulder strain)",
      "Bouncing the weight off the chest",
      "Pressing with arms instead of using chest muscles"
    ],
    muscleGroups: ["Chest", "Shoulders", "Triceps"]
  },
  {
    id: 2,
    name: "Deadlift",
    category: "Back",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/embed/XyvF8FcfZCc",
    description: "The deadlift is a fundamental compound lift that strengthens the entire posterior chain including the back, glutes, and hamstrings. It's one of the most effective exercises for building functional strength.",
    steps: [
      "Stand with feet hip-width apart with bar over mid-foot",
      "Bend down and grip the bar with arms straight",
      "Keep your chest up and create tension in your lats",
      "Lower your hips slightly until your shoulders are over the bar",
      "Drive through your heels and extend your hips and knees simultaneously",
      "Once the bar passes your knees, drive your hips forward powerfully",
      "Complete the lift with a strong lockout at the top",
      "Lower the bar back down by pushing hips back and bending knees"
    ],
    tips: [
      "Keep the bar close to your body throughout the movement",
      "Maintain a neutral spine throughout the entire lift",
      "Use your legs to initiate the movement, not your back",
      "Brace your core before each rep",
      "Practice with lighter weights to perfect your form first"
    ],
    commonMistakes: [
      "Starting with your hips too high",
      "Allowing the bar to drift away from your body",
      "Rounding your lower back",
      "Using too much arm strength",
      "Not fully locking out at the top"
    ],
    muscleGroups: ["Back", "Glutes", "Hamstrings", "Quadriceps"]
  },
  {
    id: 3,
    name: "Squat",
    category: "Legs",
    difficulty: "beginner",
    videoUrl: "https://www.youtube.com/embed/Dy28eq2PjkM",
    description: "The squat is a foundational lower body exercise that works the quadriceps, glutes, and hamstrings. It's essential for building leg strength and muscle mass.",
    steps: [
      "Stand with feet shoulder-width apart",
      "Position the bar across your upper back at shoulder height",
      "Keep your chest up and core engaged",
      "Begin the descent by pushing your hips back and bending your knees",
      "Lower yourself until your thighs are parallel to the ground or deeper",
      "Keep your weight in your heels throughout",
      "Drive through your heels to return to standing position",
      "Maintain upright posture throughout the movement"
    ],
    tips: [
      "Keep your knees tracking over your toes",
      "Maintain an upright torso throughout",
      "Achieve full depth for maximum benefit",
      "Warm up your hips and ankles before squatting",
      "Start light to master the movement pattern"
    ],
    commonMistakes: [
      "Knees caving inward during the descent",
      "Leaning too far forward",
      "Not achieving proper depth",
      "Letting your heels come off the ground",
      "Rounding your lower back"
    ],
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"]
  },
  {
    id: 4,
    name: "Pull-ups",
    category: "Back",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
    description: "Pull-ups are an effective bodyweight exercise that develops lat strength, back width, and arm strength. They require minimal equipment and can be progressively overloaded.",
    steps: [
      "Grip the bar with hands slightly wider than shoulder-width",
      "Hang with your arms fully extended",
      "Pull yourself upward by driving your elbows down and back",
      "Focus on pulling your elbows to your hips",
      "Bring your chest towards the bar at the top",
      "Pause briefly at the top position",
      "Lower yourself in a controlled manner to full arm extension",
      "Repeat for desired reps"
    ],
    tips: [
      "Use an overhand grip for traditional pull-ups",
      "Keep your core tight throughout",
      "Focus on pulling with your back, not just your arms",
      "Use assistance if needed when starting out",
      "Add weight once you can do 8-10 reps easily"
    ],
    commonMistakes: [
      "Using momentum instead of controlled movement",
      "Only partial range of motion",
      "Shrugging shoulders excessively",
      "Not achieving full lockout at the bottom",
      "Pulling mainly with arms instead of back"
    ],
    muscleGroups: ["Back", "Biceps", "Shoulders"]
  },
  {
    id: 5,
    name: "Dumbbell Rows",
    category: "Back",
    difficulty: "beginner",
    videoUrl: "https://www.youtube.com/embed/K5-oRv6NJPE",
    description: "Dumbbell rows are a versatile exercise that strengthen the back and improve posture. They can be performed unilaterally or bilaterally and adapted to any fitness level.",
    steps: [
      "Stand with feet hip-width apart, holding dumbbells at your sides",
      "Hinge at the hips until your torso is nearly parallel to the ground",
      "Let the dumbbells hang from your arms with straight elbows",
      "Row the dumbbells by driving your elbows up and back",
      "Squeeze your shoulder blades together at the top",
      "Lower the dumbbells in a controlled manner",
      "Maintain a neutral spine throughout the movement",
      "Complete all reps on one side before switching"
    ],
    tips: [
      "Keep your back straight throughout the movement",
      "Use heavier weight than you think to avoid momentum",
      "Maintain a strong hip hinge position",
      "Pause briefly at the top for maximum contraction",
      "Control the eccentric (lowering) phase"
    ],
    commonMistakes: [
      "Using momentum instead of muscle control",
      "Rotating your torso during the movement",
      "Not achieving full range of motion",
      "Raising dumbbells with straight arms instead of rowing",
      "Neglecting unilateral training"
    ],
    muscleGroups: ["Back", "Biceps", "Shoulders"]
  },
  {
    id: 6,
    name: "Lateral Raises",
    category: "Shoulders",
    difficulty: "beginner",
    videoUrl: "https://www.youtube.com/embed/q-_P-UmQQXE",
    description: "Lateral raises are an isolation exercise that primarily targets the lateral deltoids, helping build shoulder width and definition.",
    steps: [
      "Stand with feet hip-width apart, holding dumbbells at your sides",
      "Keep a slight bend in your knees and engage your core",
      "With a slight bend in your elbows, raise the dumbbells out to the sides",
      "Raise until your arms are approximately parallel to the ground",
      "Pause briefly at the top of the movement",
      "Lower the dumbbells in a controlled manner back to the starting position",
      "Maintain upright posture throughout"
    ],
    tips: [
      "Keep a slight bend in your elbows throughout",
      "Use lighter weight to maintain proper form",
      "Raise the dumbbells slightly forward of lateral to optimize shoulder activation",
      "Perform slow, controlled reps for maximum effectiveness",
      "Avoid swinging or using momentum"
    ],
    commonMistakes: [
      "Using too much weight",
      "Shrugging shoulders at the top",
      "Only partially raising the dumbbells",
      "Using momentum instead of muscle control",
      "Raising dumbbells too far forward"
    ],
    muscleGroups: ["Shoulders"]
  }
];

export default function ExerciseLibrary() {
  const [_, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseGuide | null>(null);

  const filtered = EXERCISE_GUIDES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.muscleGroups.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  if (selectedExercise) {
    return (
      <Layout>
        <div className="pt-6 pb-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedExercise(null)}
                className="p-2 -ml-2 rounded-full hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="text-2xl font-bold font-display tracking-tight text-white">
                {selectedExercise.name}
              </h1>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              selectedExercise.difficulty === 'beginner' ? 'bg-primary/20 text-primary' :
              selectedExercise.difficulty === 'intermediate' ? 'bg-accent/20 text-accent' :
              'bg-destructive/20 text-destructive'
            }`}>
              {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Video */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={selectedExercise.videoUrl}
              title={selectedExercise.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Overview</h3>
            <p className="text-muted-foreground">{selectedExercise.description}</p>
          </div>

          {/* Muscle Groups */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Muscles Targeted
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedExercise.muscleGroups.map(muscle => (
                <span key={muscle} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">How to Perform</h3>
            <div className="space-y-3">
              {selectedExercise.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{idx + 1}</span>
                  </div>
                  <p className="text-muted-foreground flex-1 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Pro Tips</h3>
            <div className="space-y-2">
              {selectedExercise.tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-card rounded-lg border border-white/5">
                  <div className="text-primary flex-shrink-0 pt-1">✓</div>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-3">Common Mistakes to Avoid</h3>
            <div className="space-y-2">
              {selectedExercise.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-destructive flex-shrink-0 pt-1">✕</div>
                  <p className="text-sm text-destructive/80">{mistake}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Exercise Library" subtitle="Learn proper form with video guides" />

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search exercises, muscles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-11 bg-card border-white/5"
        />
      </div>

      {/* Filter Info */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Exercise Grid */}
      <div className="space-y-3 mb-8">
        {filtered.length > 0 ? (
          filtered.map(exercise => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="w-full text-left"
            >
              <Card className="p-4 hover:border-primary/30 transition-colors cursor-pointer border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">{exercise.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-muted-foreground">
                        {exercise.category}
                      </span>
                      {exercise.muscleGroups.slice(0, 2).map(muscle => (
                        <span key={muscle} className="text-xs text-primary">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Play className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className={`text-xs px-2 py-1 rounded ${
                      exercise.difficulty === 'beginner' ? 'bg-primary/10 text-primary' :
                      exercise.difficulty === 'intermediate' ? 'bg-accent/10 text-accent' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
              </Card>
            </button>
          ))
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No exercises found. Try a different search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
