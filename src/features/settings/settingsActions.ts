"use server";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";
import { Result } from "@/types/result";
import { botSettingsSchema, type BotSettingsType } from "./settingsSchema";

export async function handleBotSettingsUpdate(
  botId: string,
  config: BotSettingsType
): Promise<Result<BotSettingsType>> {
  // validate
  const parsed = botSettingsSchema.safeParse(config);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  // db call
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from("bot_settings")
    .update(parsed.data)
    .eq("bot_id", botId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("UpdateSettings →", error);
    return { ok: false, message: supabaseErrorToMessage(error) };
  }

  return { ok: true, data: data };
}
