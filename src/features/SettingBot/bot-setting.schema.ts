import { z } from "zod";

export const botSettingsSchema = z.object({
  // Response Generation Settings
  maxTokens: z.number().min(100).max(4000),
  topP: z.number().min(0).max(1),
  topK: z.number().min(0),

  stopSequences: z.string().optional(),
  jsonMode: z.boolean(),
  toolUse: z.boolean(),

  // Search & Information Sources
  useWebSearch: z.boolean(),

  siteUrl: z.string().url().optional().or(z.literal("")),

  focusDomains: z.string().optional(),
  // Operational Controls
  loggingEnabled: z.boolean(),
  voiceMode: z.boolean(),
  rateLimitPerMin: z.number().min(1).max(1000),

  // Integration Settings
  webhookURL: z.string().url().optional().or(z.literal("")),

  // System fields (read-only in UI)
  // tokenQuota: z.number().optional(),
  // apiCallsThisMonth: z.number().optional(),
  // billingPlan: z.enum(["free", "pro", "enterprise"]),
});

export type BotSettingsType = z.infer<typeof botSettingsSchema>;
