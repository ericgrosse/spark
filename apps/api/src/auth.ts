import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { config } from "./config";

export interface AuthUser {
  id: string;
  role: "USER" | "MODERATOR" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function hashPassword(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1
  });
}

export function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export function signSession(user: AuthUser) {
  return jwt.sign(user, config.JWT_SECRET, { expiresIn: "14d", issuer: "spark-api" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Authentication required." });

  try {
    req.user = jwt.verify(token, config.JWT_SECRET, { issuer: "spark-api" }) as AuthUser;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid session." });
  }
}

export function requireModerator(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !["MODERATOR", "ADMIN"].includes(req.user.role)) {
    return res.status(403).json({ error: "Moderator access required." });
  }

  return next();
}
