import { z } from "zod";

export const botSettingsSchema = z.object({
  max_tokens: z.coerce.number().min(100).max(4000),
  top_p: z.coerce.number().min(0).max(1),
  temperature: z.coerce.number().min(0).max(2),
  stop_sequences: z.array(z.string()),
  json_mode: z.boolean(),
  focus_domains: z.array(z.string()),
});

export type BotSettingsType = z.infer<typeof botSettingsSchema>;
