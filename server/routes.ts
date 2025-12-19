import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // === Onboarding Routes ===
  app.get(api.onboarding.getProfile.path, isAuthenticated, async (req: any, res) => {
    const profile = await storage.getProfile(req.user.claims.sub);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  app.post(api.onboarding.createProfile.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.onboarding.createProfile.input.parse(req.body);
      const profile = await storage.createProfile({ ...input, userId: req.user.claims.sub });
      res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.put(api.onboarding.updateProfile.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.onboarding.updateProfile.input.parse(req.body);
      const profile = await storage.updateProfile(req.user.claims.sub, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // === Plans Routes ===
  app.get(api.plans.getCurrent.path, isAuthenticated, async (req: any, res) => {
    const plan = await storage.getCurrentPlan(req.user.claims.sub);
    if (!plan) return res.status(404).json({ message: "No active plan" });
    const workouts = await storage.getPlanWorkouts(plan.id);
    res.json({ ...plan, workouts });
  });

  app.post(api.plans.generate.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      
      if (!profile) return res.status(400).json({ message: "Complete onboarding first" });

      // Call OpenAI to generate plan
      const prompt = `
        Generate a 4-week fitness plan for a user with the following profile:
        - Goal: ${profile.goal}
        - Experience: ${profile.experienceLevel}
        - Days/Week: ${profile.daysPerWeek}
        - Equipment: ${JSON.stringify(profile.equipment)}
        - Injuries: ${JSON.stringify(profile.injuries)}
        
        Return a JSON object with:
        {
          "name": "Plan Name",
          "weeklySchedule": ["Monday", "Wednesday", "Friday"],
          "workouts": [
            {
              "dayNumber": 1,
              "name": "Workout Name",
              "description": "Focus area",
              "exercises": [
                {
                  "name": "Exercise Name",
                  "targetSets": 3,
                  "targetReps": "10-12",
                  "targetRPE": 8,
                  "restSeconds": 60,
                  "notes": "Technique notes"
                }
              ]
            }
          ]
        }
        Only generate unique workouts for the weekly schedule (e.g. Workout A, Workout B).
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "system", content: "You are an expert fitness coach." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const planData = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Save Plan
      const plan = await storage.createPlan({
        userId,
        name: planData.name,
        weeklySchedule: planData.weeklySchedule,
        status: 'active'
      });

      // Save Workouts & Exercises
      for (const w of planData.workouts) {
        const workout = await storage.createWorkout({
          planId: plan.id,
          dayNumber: w.dayNumber,
          name: w.name,
          description: w.description
        });
        
        let order = 1;
        for (const e of w.exercises) {
          await storage.createExercise({
            workoutId: workout.id,
            name: e.name,
            targetSets: e.targetSets,
            targetReps: e.targetReps,
            targetRPE: e.targetRPE,
            restSeconds: e.restSeconds,
            notes: e.notes,
            order: order++
          });
        }
      }

      res.status(201).json(plan);
    } catch (error) {
      console.error("Plan generation error:", error);
      res.status(500).json({ message: "Failed to generate plan" });
    }
  });

  // === Workouts Routes ===
  app.get(api.workouts.get.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const workout = await storage.getWorkout(id);
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    const exercises = await storage.getWorkoutExercises(id);
    res.json({ ...workout, exercises });
  });

  // === Logging Routes ===
  app.post(api.logs.start.path, isAuthenticated, async (req: any, res) => {
    const { workoutId } = req.body;
    const log = await storage.createWorkoutLog({
      userId: req.user.claims.sub,
      workoutId,
      status: 'in_progress',
      date: new Date() // Explicitly set date
    });
    res.status(201).json(log);
  });

  app.post(api.logs.complete.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const log = await storage.completeWorkoutLog(id);
    res.json(log);
  });

  app.post(api.logs.logSet.path, isAuthenticated, async (req, res) => {
    const input = api.logs.logSet.input.parse(req.body);
    const setLog = await storage.createSetLog(input);
    res.status(201).json(setLog);
  });
  
  app.get(api.logs.getHistory.path, isAuthenticated, async (req: any, res) => {
     const logs = await storage.getWorkoutLogs(req.user.claims.sub);
     res.json(logs);
  });

  return httpServer;
}
