import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const DEMO_AUTH =
  process.env.DEMO_AUTH === "1" ||
  process.env.DEMO_AUTH === "true" ||
  process.env.DEMO_AUTH === "yes";

function getDemoUser() {
  const id = process.env.DEMO_USER_ID ?? "test-user-001";
  const email = process.env.DEMO_USER_EMAIL ?? "test@fittracker.com";
  const firstName = process.env.DEMO_FIRST_NAME ?? "Test";
  const lastName = process.env.DEMO_LAST_NAME ?? "User";
  const profileImageUrl = process.env.DEMO_PROFILE_IMAGE_URL ?? null;

  return { id, email, firstName, lastName, profileImageUrl };
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  // DEMO_AUTH mode: bypass Replit OIDC entirely and treat every visitor as the same user.
  // This is meant for prototypes only (everyone shares one account).
  if (DEMO_AUTH) {
    const demo = getDemoUser();

    // Ensure a user row exists so /api/auth/user returns a real User record.
    await authStorage.upsertUser({
      id: demo.id,
      email: demo.email,
      firstName: demo.firstName,
      lastName: demo.lastName,
      profileImageUrl: demo.profileImageUrl ?? undefined,
    });

    app.set("trust proxy", 1);
    app.use(getSession());

    // Inject a stable "logged in" user into every request.
    app.use((req: any, _res, next) => {
      const farFuture = Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60;
      req.user = {
        expires_at: farFuture,
        refresh_token: null,
        claims: {
          sub: demo.id,
          email: demo.email,
          first_name: demo.firstName,
          last_name: demo.lastName,
          profile_image_url: demo.profileImageUrl,
        },
      };

      // Passport normally adds this, but we bypass passport in demo mode.
      req.isAuthenticated = () => true;
      next();
    });

    // Keep existing client behavior: clicking "Get Started" hits /api/login.
    app.get("/api/login", (_req, res) => res.redirect("/"));

    // Best-effort logout (clears session cookie), then back home.
    app.get("/api/logout", (req: any, res) => {
      try {
        req.session?.destroy(() => res.redirect("/"));
      } catch {
        res.redirect("/");
      }
    });

    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName))
