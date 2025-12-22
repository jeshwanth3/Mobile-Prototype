import { Link, useLocation } from "wouter";
import { LayoutDashboard, Dumbbell, MessageSquare, User, TrendingUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/plans", icon: Dumbbell, label: "Plans" },
    { href: "/exercises", icon: BookOpen, label: "Library" },
    { href: "/statistics", icon: TrendingUp, label: "Stats" },
    { href: "/coach", icon: MessageSquare, label: "Coach" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-white/5 pb-safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="relative flex flex-col items-center justify-center py-2 group cursor-pointer">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-0 w-12 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(132,255,95,0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={cn(
                    "w-6 h-6 mb-1 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                  )} 
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
