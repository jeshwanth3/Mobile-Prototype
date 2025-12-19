import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backHref, action }: PageHeaderProps) {
  const [_, setLocation] = useLocation();

  return (
    <div className="pt-6 pb-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          {backHref && (
            <button 
              onClick={() => setLocation(backHref)}
              className="p-2 -ml-2 rounded-full hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            {title}
          </h1>
        </div>
        {action}
      </div>
      {subtitle && <p className="text-sm text-muted-foreground ml-1">{subtitle}</p>}
    </div>
  );
}
