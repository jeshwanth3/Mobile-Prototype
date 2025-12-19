import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  if (isLoading) return null;

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[40%] bg-accent/10 blur-[100px] rounded-full" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col z-10 p-6 md:p-12 max-w-md mx-auto w-full justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
            <Dumbbell className="w-8 h-8 text-background" />
          </div>

          <h1 className="text-5xl font-bold font-display tracking-tighter text-white mb-4 leading-[1.1]">
            Fit <span className="text-primary">Tracker</span>
            <br />
            AI Coach
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Your intelligent personal trainer. Custom plans, smart tracking, and real-time coaching powered by AI.
          </p>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full h-14 text-base font-bold bg-white text-black hover:bg-gray-200 rounded-xl"
              onClick={() => window.location.href = "/api/login"}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-xs text-center text-muted-foreground/50 mt-6">
              Powered by Replit AI & OpenAI GPT-5
            </p>
          </div>
        </motion.div>
      </div>

      {/* Hero Image (Abstract Representation) */}
      <div className="h-[30vh] w-full relative z-0 mt-auto">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" 
          alt="Fitness Training" 
          className="w-full h-full object-cover opacity-40 mask-image-gradient"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black)" }}
        />
        {/* Descriptive comment for Unsplash: Dark moody gym atmosphere with weights */}
      </div>
    </div>
  );
}
