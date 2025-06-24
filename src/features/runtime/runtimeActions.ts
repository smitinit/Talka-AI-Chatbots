import { Result } from "@/types/result";
import {
  botRuntimeSettingsSchema,
  BotRuntimeSettingsType,
} from "./runtimeSchema";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";

export async function handleBotRuntimeSettingsUpdate(
  botId: string,
  config: BotRuntimeSettingsType
): Promise<Result<BotRuntimeSettingsType>> {
  // validate
  const parsed = botRuntimeSettingsSchema.safeParse(config);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  // db call
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from("bot_runtime_settings")
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
