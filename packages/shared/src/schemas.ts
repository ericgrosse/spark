import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .regex(/[a-z]/, "Use a lowercase letter.")
  .regex(/[A-Z]/, "Use an uppercase letter.")
  .regex(/[0-9]/, "Use a number.")
  .regex(/[^A-Za-z0-9]/, "Use a symbol.");

export const emailSchema = z.string().trim().email().max(254).toLowerCase();

export const createAccountSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(2).max(40),
  birthDate: z.coerce.date()
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().trim().min(1).max(80).optional()
});

export const privacySchema = z.object({
  showDistance: z.boolean().default(true),
  showOnlineStatus: z.boolean().default(true),
  discoveryEnabled: z.boolean().default(true),
  maximumDistanceKm: z.number().int().min(1).max(500).default(80)
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(40),
  bio: z.string().trim().max(500).default(""),
  interests: z.array(z.string().trim().min(2).max(32)).max(12).default([]),
  location: locationSchema.optional(),
  photos: z.array(z.string().url()).max(9).default([]),
  privacy: privacySchema.default({})
});

export const swipeSchema = z.object({
  targetUserId: z.string().uuid(),
  action: z.enum(["like", "pass"])
});

export const messageSchema = z.object({
  matchId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000)
});

export const reportSchema = z.object({
  reportedUserId: z.string().uuid(),
  reason: z.enum(["spam", "harassment", "impersonation", "minor", "unsafe", "other"]),
  details: z.string().trim().max(1000).optional()
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SwipeInput = z.infer<typeof swipeSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
