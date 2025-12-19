import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export function Layout({ children, showNav = true, className = "" }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${className}`}>
      <main className="flex-1 w-full max-w-md mx-auto pb-24 px-4 sm:px-6">
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
