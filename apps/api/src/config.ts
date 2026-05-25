import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1).default("postgresql://spark:spark@localhost:5432/spark?schema=public"),
  JWT_SECRET: z.string().min(32).default("development-only-secret-change-me-now"),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  UPLOAD_DIR: z.string().default("uploads")
});

export const config = envSchema.parse(process.env);
