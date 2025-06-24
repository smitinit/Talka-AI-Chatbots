import { z } from "zod";

export const botRuntimeSettingsSchema = z.object({
  greeting: z.string().min(1, "Greeting is required"),
  fallback: z.string().min(1, "Fallback is required"),
  status: z.enum(["active", "archived", "deleted"]),
  billing_plan: z.enum(["free", "pro", "enterprise"]),
  memory_type: z.enum(["per-user", "global", "session-only"]),
  memory_expiration: z.enum(["session", "24h", "7d", "30d", "perm"]),
  avatar: z.string().url().optional(),
  voice: z.string().optional(),
  gender: z.enum(["male", "female", "neutral"]),
  voice_mode: z.boolean(),
  logging_enabled: z.boolean(),
  use_web_search: z.boolean(),
  webhook_url: z.string().url().optional().or(z.literal("")),
  site_url: z.string().url().optional().or(z.literal("")),
  rate_limit_per_min: z.coerce.number().min(1).max(1000),
});

export type BotRuntimeSettingsType = z.infer<typeof botRuntimeSettingsSchema>;
