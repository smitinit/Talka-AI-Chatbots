"server only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { BotConfigFull } from "@/types";
import {
  BotConfigsSchema,
  BotSettingsSchema,
  BotRuntimeSchema,
} from "@/schema";

/**
 * Loads a complete bot profile from Supabase
 * Combines bot_configs, bot_settings, and bot_runtime_settings into a unified object
 *
 * @param botId - The bot ID to load
 * @returns BotConfigFull if all three tables have data, null otherwise
 */
export async function getBotProfile(
  botId: string
): Promise<BotConfigFull | null> {
  // Fetch all three tables in parallel
  const [configRes, settingsRes, runtimeRes] = await Promise.all([
    supabaseAdmin.from("bot_configs").select("*").eq("bot_id", botId).single(),

    supabaseAdmin.from("bot_settings").select("*").eq("bot_id", botId).single(),

    supabaseAdmin
      .from("bot_runtime_settings")
      .select("*")
      .eq("bot_id", botId)
      .single(),
  ]);

  // Validate that all three queries succeeded
  if (configRes.error || settingsRes.error || runtimeRes.error) {
    return null;
  }

  // Validate and parse with Zod schemas
  const configParse = BotConfigsSchema.safeParse(configRes.data);
  const settingsParse = BotSettingsSchema.safeParse(settingsRes.data);
  const runtimeParse = BotRuntimeSchema.safeParse(runtimeRes.data);

  if (!configParse.success || !settingsParse.success || !runtimeParse.success) {
    console.error("Schema validation failed:", {
      config: configParse.error,
      settings: settingsParse.error,
      runtime: runtimeParse.error,
    });
    return null;
  }

  // Return unified bot profile
  return {
    bot_id: botId,
    config: configParse.data,
    settings: settingsParse.data,
    runtime: runtimeParse.data,
  };
}
