import { z } from 'zod';
import { 
  insertUserProfileSchema, 
  userProfiles, 
  plans, 
  workouts, 
  exercises, 
  workoutLogs, 
  setLogs,
  insertSetLogSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  onboarding: {
    getProfile: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    createProfile: {
      method: 'POST' as const,
      path: '/api/profile',
      input: insertUserProfileSchema,
      responses: {
        201: z.custom<typeof userProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/profile',
      input: insertUserProfileSchema.partial(),
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  plans: {
    getCurrent: {
      method: 'GET' as const,
      path: '/api/plans/current',
      responses: {
        200: z.custom<typeof plans.$inferSelect & { workouts: (typeof workouts.$inferSelect)[] }>(),
        404: errorSchemas.notFound,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/plans/generate',
      responses: {
        201: z.custom<typeof plans.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  workouts: {
    get: {
      method: 'GET' as const,
      path: '/api/workouts/:id',
      responses: {
        200: z.custom<typeof workouts.$inferSelect & { exercises: (typeof exercises.$inferSelect)[] }>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/workouts', // List all workouts in the current plan
      responses: {
        200: z.array(z.custom<typeof workouts.$inferSelect>()),
      },
    },
  },
  logs: {
    start: {
      method: 'POST' as const,
      path: '/api/logs/start',
      input: z.object({ workoutId: z.number() }),
      responses: {
        201: z.custom<typeof workoutLogs.$inferSelect>(),
      },
    },
    complete: {
      method: 'POST' as const,
      path: '/api/logs/:id/complete',
      responses: {
        200: z.custom<typeof workoutLogs.$inferSelect>(),
      },
    },
    logSet: {
      method: 'POST' as const,
      path: '/api/logs/:id/sets',
      input: insertSetLogSchema,
      responses: {
        201: z.custom<typeof setLogs.$inferSelect>(),
      },
    },
    getHistory: {
      method: 'GET' as const,
      path: '/api/logs/history',
      responses: {
        200: z.array(z.custom<typeof workoutLogs.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
