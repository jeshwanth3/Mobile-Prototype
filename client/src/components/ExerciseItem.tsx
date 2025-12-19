import { useState } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExerciseItemProps {
  name: string;
  sets: number;
  reps: string;
  order: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode; // For input fields when logging
}

export function ExerciseItem({ name, sets, reps, order, isExpanded, onToggle, children }: ExerciseItemProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-white/5 overflow-hidden transition-all duration-300",
      isExpanded ? "bg-card border-primary/20 shadow-lg shadow-black/20" : "bg-card/50 hover:bg-card"
    )}>
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-muted-foreground">
          {order}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sets} sets × {reps} reps
          </p>
        </div>

        {children ? (
          <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")} />
        ) : (
          <Info className="w-5 h-5 text-muted-foreground/50" />
        )}
      </div>

      <AnimatePresence>
        {isExpanded && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-4 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
