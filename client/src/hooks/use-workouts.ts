import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === Workout Hooks ===
export function useWorkout(id: number) {
  return useQuery({
    queryKey: [api.workouts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.workouts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch workout");
      return api.workouts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useWorkoutsList() {
  return useQuery({
    queryKey: [api.workouts.list.path],
    queryFn: async () => {
      const res = await fetch(api.workouts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch workouts list");
      return api.workouts.list.responses[200].parse(await res.json());
    },
  });
}

// === Logging Hooks ===
export function useStartWorkoutLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workoutId: number) => {
      const res = await fetch(api.logs.start.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to start workout");
      return api.logs.start.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.getHistory.path] });
    },
  });
}

export function useCompleteWorkoutLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (logId: number) => {
      const url = buildUrl(api.logs.complete.path, { id: logId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to complete workout");
      return api.logs.complete.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.getHistory.path] });
      toast({ title: "Workout Complete!", description: "Great job crushing it today." });
    },
  });
}

export function useLogSet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ logId, data }: { logId: number, data: any }) => {
      const validated = api.logs.logSet.input.parse(data);
      const url = buildUrl(api.logs.logSet.path, { id: logId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log set");
      return api.logs.logSet.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Could invalidate specific log query if needed
      // queryClient.invalidateQueries([`workout-log`, variables.logId]);
      toast({ 
        title: "Set Logged", 
        description: `Set ${variables.data.setNumber} completed.`,
        duration: 1500,
      });
    },
  });
}

export function useWorkoutHistory() {
  return useQuery({
    queryKey: [api.logs.getHistory.path],
    queryFn: async () => {
      const res = await fetch(api.logs.getHistory.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.logs.getHistory.responses[200].parse(await res.json());
    },
  });
}
