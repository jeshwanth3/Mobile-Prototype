import { db } from "./db";
import { 
  userProfiles, plans, workouts, exercises, workoutLogs, setLogs,
  type UserProfile, type InsertUserProfile,
  type Plan, type InsertPlan,
  type Workout, type InsertWorkout,
  type Exercise, type InsertExercise,
  type WorkoutLog, type InsertWorkoutLog,
  type SetLog, type InsertSetLog
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";
import { chatStorage, type IChatStorage } from "./replit_integrations/chat/storage";

export interface IStorage extends IAuthStorage, IChatStorage {
  // Profile
  getProfile(userId: string): Promise<UserProfile | undefined>;
  createProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  deleteProfile(userId: string): Promise<void>;

  // Plans
  getCurrentPlan(userId: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  
  // Workouts (Template)
  getPlanWorkouts(planId: number): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  
  // Exercises (Template)
  getWorkoutExercises(workoutId: number): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Logs
  createWorkoutLog(log: InsertWorkoutLog): Promise<WorkoutLog>;
  completeWorkoutLog(id: number): Promise<WorkoutLog>;
  getWorkoutLog(id: number): Promise<WorkoutLog | undefined>;
  createSetLog(log: InsertSetLog): Promise<SetLog>;
  getWorkoutLogs(userId: string): Promise<WorkoutLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Include Auth & Chat storage methods by delegation or mixin
  // Ideally, we'd inherit or compose, but for simplicity in this file structure:
  getUser = authStorage.getUser.bind(authStorage);
  upsertUser = authStorage.upsertUser.bind(authStorage);
  getConversation = chatStorage.getConversation.bind(chatStorage);
  getAllConversations = chatStorage.getAllConversations.bind(chatStorage);
  createConversation = chatStorage.createConversation.bind(chatStorage);
  deleteConversation = chatStorage.deleteConversation.bind(chatStorage);
  getMessagesByConversation = chatStorage.getMessagesByConversation.bind(chatStorage);
  createMessage = chatStorage.createMessage.bind(chatStorage);

  // === Profile ===
  async getProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updated] = await db
      .update(userProfiles)
      .set(profile)
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  }

  async deleteProfile(userId: string): Promise<void> {
    await db.delete(userProfiles).where(eq(userProfiles.userId, userId));
  }

  // === Plans ===
  async getCurrentPlan(userId: string): Promise<Plan | undefined> {
    const [plan] = await db
      .select()
      .from(plans)
      .where(and(eq(plans.userId, userId), eq(plans.status, 'active')))
      .orderBy(desc(plans.createdAt))
      .limit(1);
    return plan;
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    // Archive old active plans
    await db
      .update(plans)
      .set({ status: 'archived' })
      .where(and(eq(plans.userId, plan.userId), eq(plans.status, 'active')));

    const [newPlan] = await db.insert(plans).values(plan).returning();
    return newPlan;
  }

  // === Workouts ===
  async getPlanWorkouts(planId: number): Promise<Workout[]> {
    return db.select().from(workouts).where(eq(workouts.planId, planId)).orderBy(workouts.dayNumber);
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  // === Exercises ===
  async getWorkoutExercises(workoutId: number): Promise<Exercise[]> {
    return db.select().from(exercises).where(eq(exercises.workoutId, workoutId)).orderBy(exercises.order);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  // === Logs ===
  async createWorkoutLog(log: InsertWorkoutLog): Promise<WorkoutLog> {
    const [newLog] = await db.insert(workoutLogs).values(log).returning();
    return newLog;
  }

  async completeWorkoutLog(id: number): Promise<WorkoutLog> {
    const [updated] = await db
      .update(workoutLogs)
      .set({ status: 'completed', completedAt: new Date() })
      .where(eq(workoutLogs.id, id))
      .returning();
    return updated;
  }

  async getWorkoutLog(id: number): Promise<WorkoutLog | undefined> {
    const [log] = await db.select().from(workoutLogs).where(eq(workoutLogs.id, id));
    return log;
  }

  async createSetLog(log: InsertSetLog): Promise<SetLog> {
    const [newLog] = await db.insert(setLogs).values(log).returning();
    return newLog;
  }

  async getWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
    return db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)).orderBy(desc(workoutLogs.date));
  }
}

export const storage = new DatabaseStorage();
