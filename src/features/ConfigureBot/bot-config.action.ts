"use server";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";
import { Result } from "@/types/result";
import { botConfigSchema, BotConfigType } from "./bot-config.schema";

export async function handleBotConfigUpdate(
  botId: string,
  config: BotConfigType
): Promise<Result<BotConfigType>> {
  // validate
  const parsed = botConfigSchema.safeParse(config);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  // db call
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from("bot_configs")
    .update(parsed.data)
    .eq("bot_id", botId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("UpdateConfigs →", error);
    return { ok: false, message: supabaseErrorToMessage(error) };
  }

  return { ok: true, data: data };
}
