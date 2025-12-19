import { Dumbbell, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface WorkoutCardProps {
  title: string;
  subtitle?: string;
  duration?: string;
  exerciseCount: number;
  onClick?: () => void;
  isNext?: boolean;
}

export function WorkoutCard({ title, subtitle, duration, exerciseCount, onClick, isNext }: WorkoutCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all
        ${isNext 
          ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 shadow-[0_4px_20px_rgba(132,255,95,0.1)]" 
          : "bg-card border-white/5 hover:border-white/10"
        }
      `}
    >
      {isNext && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-background text-xs font-bold rounded-bl-xl">
          UP NEXT
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="p-3 rounded-xl bg-background/50 border border-white/5">
          <Dumbbell className={`w-6 h-6 ${isNext ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{subtitle || "Full body strength session"}</p>

      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          {exerciseCount} Exercises
        </div>
        {duration && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </div>
        )}
      </div>

      <div className="absolute bottom-5 right-5">
        <div className={`p-1.5 rounded-full ${isNext ? "bg-primary text-background" : "bg-white/5 text-white"}`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
