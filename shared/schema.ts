import { pgTable, serial, text, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth and Chat models
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === User Profile ===
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  age: integer("age"),
  gender: text("gender"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  goal: text("goal").notNull(), // 'strength', 'hypertrophy', 'endurance', 'weight_loss'
  activityLevel: text("activity_level"), // 'sedentary', 'active', etc.
  equipment: jsonb("equipment").$type<string[]>(), // ['dumbbells', 'barbell', 'bench', 'bodyweight']
  injuries: jsonb("injuries").$type<string[]>(),
  daysPerWeek: integer("days_per_week").notNull(),
  experienceLevel: text("experience_level").notNull(), // 'beginner', 'intermediate', 'advanced'
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

// === Plans ===
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(), // e.g. "Hypertrophy Block 1"
  status: text("status").notNull().default("active"), // 'active', 'completed', 'archived'
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  weeklySchedule: jsonb("weekly_schedule").$type<string[]>(), // ['Monday', 'Wednesday', 'Friday']
  createdAt: timestamp("created_at").defaultNow(),
});

export const plansRelations = relations(plans, ({ one, many }) => ({
  user: one(users, {
    fields: [plans.userId],
    references: [users.id],
  }),
  workouts: many(workouts),
}));

export const insertPlanSchema = createInsertSchema(plans).omit({ id: true, createdAt: true });
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;

// === Workouts (Template/Planned) ===
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => plans.id),
  dayNumber: integer("day_number"), // 1, 2, 3... order in the week/cycle
  name: text("name").notNull(), // "Upper Body A"
  description: text("description"),
});

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  plan: one(plans, {
    fields: [workouts.planId],
    references: [plans.id],
  }),
  exercises: many(exercises),
}));

export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true });
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

// === Exercises (Template/Planned) ===
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull().references(() => workouts.id),
  name: text("name").notNull(),
  targetSets: integer("target_sets").notNull(),
  targetReps: text("target_reps").notNull(), // "8-12" or "5"
  targetRPE: integer("target_rpe"), // 1-10
  restSeconds: integer("rest_seconds"),
  notes: text("notes"),
  order: integer("order").notNull(), // Display order
});

export const exercisesRelations = relations(exercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
}));

export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

// === Workout Logs ===
export const workoutLogs = pgTable("workout_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  workoutId: integer("workout_id").notNull().references(() => workouts.id), // Link to the template
  date: timestamp("date").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed'
  notes: text("notes"),
});

export const workoutLogsRelations = relations(workoutLogs, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutLogs.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [workoutLogs.workoutId],
    references: [workouts.id],
  }),
  setLogs: many(setLogs),
}));

export const insertWorkoutLogSchema = createInsertSchema(workoutLogs).omit({ id: true, startedAt: true, completedAt: true });
export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type InsertWorkoutLog = z.infer<typeof insertWorkoutLogSchema>;

// === Set Logs ===
export const setLogs = pgTable("set_logs", {
  id: serial("id").primaryKey(),
  workoutLogId: integer("workout_log_id").notNull().references(() => workoutLogs.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  setNumber: integer("set_number").notNull(),
  weight: integer("weight"), // in kg/lbs
  reps: integer("reps"),
  rpe: integer("rpe"),
  completed: boolean("completed").default(true),
});

export const setLogsRelations = relations(setLogs, ({ one }) => ({
  workoutLog: one(workoutLogs, {
    fields: [setLogs.workoutLogId],
    references: [workoutLogs.id],
  }),
  exercise: one(exercises, {
    fields: [setLogs.exerciseId],
    references: [exercises.id],
  }),
}));

export const insertSetLogSchema = createInsertSchema(setLogs).omit({ id: true });
export type SetLog = typeof setLogs.$inferSelect;
export type InsertSetLog = z.infer<typeof insertSetLogSchema>;

// === API Types ===
export type CreateProfileRequest = InsertUserProfile;
export type GeneratePlanRequest = {
  profileId: number;
};
export type LogWorkoutRequest = {
  workoutId: number;
};
export type LogSetRequest = InsertSetLog;
