import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    const claims = req.user?.claims;
    const userId = claims?.sub;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let user = await authStorage.getUser(userId);

    // If DEMO_AUTH is on, auto-create the user to avoid redirect loops
    if (!user) {
      await authStorage.upsertUser({
        id: userId,
        email: claims.email ?? "test@fittracker.com",
        firstName: claims.first_name ?? "Test",
        lastName: claims.last_name ?? "User",
        profileImageUrl: claims.profile_image_url,
      });
      user = await authStorage.getUser(userId);
    }

    return res.json(user);
  });
}
