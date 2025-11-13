import { z } from "zod";

export const botRuntimeSettingsSchema = z.object({
  voice_mode: z.boolean().default(false),
  logging_enabled: z.boolean().default(true),
  use_web_search: z.boolean().default(false),

  webhook_url: z.string().url("Invalid webhook URL").or(z.literal("")), // allow empty string
  site_url: z.string().url("Invalid site URL").or(z.literal("")), // allow empty string

  rate_limit_per_min: z.coerce.number().min(1).max(1000).default(60),
  rate_limit: z.coerce.number().min(1).max(1000).default(60),

  token_quota: z.coerce.number().min(0).default(50000),
  api_calls_this_month: z.coerce.number().min(0).default(0),

  focus_domains: z.array(z.string()).optional().default([]),
  expertise_area: z.string().transform((val) => val ?? ""),
});

export type BotRuntimeSettingsType = z.infer<typeof botRuntimeSettingsSchema>;
