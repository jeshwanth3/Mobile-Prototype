import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User as UserIcon, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  if (!user) return null;

  const handleResetProfile = async () => {
    if (!window.confirm("Are you sure you want to reset your profile? This will clear your goal, experience level, and weight.")) {
      return;
    }
    
    try {
      setIsResetting(true);
      const res = await fetch("/api/profile/reset", { method: "POST" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
        toast({ title: "Profile reset successfully", description: "You can now set up a new profile" });
      } else {
        toast({ title: "Error", description: "Failed to reset profile", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to reset profile", variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Profile" />

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden mb-4">
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <span className="text-muted-foreground">Goal</span>
            <span className="font-bold text-white capitalize">{profile?.goal || "Not set"}</span>
          </div>
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-bold text-white capitalize">{profile?.experienceLevel || "Not set"}</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-muted-foreground">Current Weight</span>
            <span className="font-bold text-white">{profile?.weight || "-"} kg</span>
          </div>
        </div>

        <Button className="w-full h-14 bg-card hover:bg-white/5 border border-white/5 text-white justify-between px-6 rounded-2xl">
          <span className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Settings
          </span>
        </Button>

        <Button 
          onClick={handleResetProfile}
          disabled={isResetting}
          variant="outline"
          className="w-full h-14 justify-between px-6 rounded-2xl border border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
          data-testid="button-reset-profile"
        >
          <span className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5" />
            {isResetting ? "Resetting..." : "Reset Profile"}
          </span>
        </Button>

        <Button 
          variant="destructive" 
          onClick={() => logout()}
          className="w-full h-14 justify-between px-6 rounded-2xl"
        >
          <span className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            Log Out
          </span>
        </Button>
      </div>
      
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mt-8 mb-4">
        <p className="text-xs text-orange-400">
          <span className="font-semibold">Reset Profile Note:</span> This button allows you to reset your profile details for testing different onboarding scenarios. Only available in production.
        </p>
      </div>
      
      <p className="text-center text-xs text-muted-foreground/30">
        Fit Tracker v1.0.0
      </p>
    </Layout>
  );
}
