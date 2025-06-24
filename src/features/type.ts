import { z } from "zod";
import { botConfigSchema } from "./config/configSchema";
import { botRuntimeSettingsSchema } from "./runtime/runtimeSchema";
import { botSettingsSchema } from "./settings/settingsSchema";

export const fullBotSchema = z.object({
  bot_configs: botConfigSchema,
  bot_settings: botSettingsSchema,
  bot_runtime_settings: botRuntimeSettingsSchema,
});

export type FullBotPayload = z.infer<typeof fullBotSchema>;
