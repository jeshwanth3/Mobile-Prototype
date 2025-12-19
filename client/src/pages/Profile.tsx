import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: profile } = useProfile();

  if (!user) return null;

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
      
      <p className="text-center text-xs text-muted-foreground/30 mt-8">
        Fit Tracker v1.0.0
      </p>
    </Layout>
  );
}
