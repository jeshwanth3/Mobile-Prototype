import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === Profile Hooks ===
export function useProfile() {
  return useQuery({
    queryKey: [api.onboarding.getProfile.path],
    queryFn: async () => {
      const res = await fetch(api.onboarding.getProfile.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.onboarding.getProfile.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const validated = api.onboarding.createProfile.input.parse(data);
      const res = await fetch(api.onboarding.createProfile.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create profile");
      return api.onboarding.createProfile.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.onboarding.getProfile.path] });
      toast({ title: "Profile Created", description: "Let's build your plan!" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
}

// === Plan Hooks ===
export function useCurrentPlan() {
  return useQuery({
    queryKey: [api.plans.getCurrent.path],
    queryFn: async () => {
      const res = await fetch(api.plans.getCurrent.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch current plan");
      return api.plans.getCurrent.responses[200].parse(await res.json());
    },
  });
}

export function useWorkoutsList() {
  return useQuery({
    queryKey: [api.workouts.list.path],
    queryFn: async () => {
      const res = await fetch(api.workouts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch workouts");
      return (await res.json()) as any[];
    },
  });
}

export function useGeneratePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (profileId: number) => {
      const res = await fetch(api.plans.generate.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      return api.plans.generate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.plans.getCurrent.path] });
      toast({ title: "Plan Ready!", description: "Your custom workout plan is ready." });
    },
    onError: (err) => {
      toast({ title: "Generation Failed", description: err.message, variant: "destructive" });
    }
  });
}
