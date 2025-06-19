import { z } from "zod";

export const botSettingsSchema = z.object({
  // Response Generation Settings
  max_tokens: z.coerce.number().min(100).max(4000),
  top_p: z.coerce.number().min(0).max(1),
  top_k: z.coerce.number().min(0),

  stop_sequences: z.array(z.string()).optional(),
  json_mode: z.boolean(),
  tool_use: z.boolean(),

  // Search & Information Sources
  use_web_search: z.boolean(),

  site_url: z.string().url().optional().or(z.literal("")),

  focus_domains: z.array(z.string()).optional(),
  // Operational Controls
  logging_enabled: z.boolean(),
  voice_mode: z.boolean(),
  rate_limit_per_min: z.coerce.number().min(1).max(1000),

  // Integration Settings
  webhook_url: z.string().url().optional().or(z.literal("")),
});

export type BotSettingsType = z.infer<typeof botSettingsSchema>;
