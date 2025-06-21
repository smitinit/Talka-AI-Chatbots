"use server";
import crypto from "node:crypto";
import { ApiKeyRow, apiKeySchema } from "./api.schema";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { Result } from "@/types/result";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";

export async function createApiKey(
  bot_id: string,
  name: string,
  permissions: string[]
): Promise<Result<ApiKeyRow>> {
  //  validate
  const parsed = apiKeySchema.safeParse({ name, permissions });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    };
  }

  const client = createServerSupabaseClient();

  // Get the total number of API keys for this bot/user and if > 3 return.
  const { count, error: countErr } = await client
    .from("api_keys")
    .select("*", { count: "exact", head: true })
    .eq("bot_id", bot_id);

  if (countErr) {
    return { ok: false, message: supabaseErrorToMessage(countErr!) };
  }
  if (count! > 3) {
    return {
      ok: false,
      message: "You can only have a maximum of 3 API keys per bot.",
    };
  }
  //  generate token & hash
  const rawToken = crypto.randomBytes(32).toString("hex"); // shown to user once
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  //  insert only the hash
  const { data, error } = await client
    .from("api_keys")
    .insert({
      bot_id,
      name: parsed.data.name,
      permissions: parsed.data.permissions,
      token_hash: tokenHash,
    })
    .select()
    .maybeSingle();

  if (error) {
    return { ok: false, message: supabaseErrorToMessage(error!) };
  }

  // revalidatePath(`/bots/${bot_id}/talka-api`);
  return { ok: true, data: { ...data, token_hash: rawToken } };
}

export async function deleteApiKey(api_id: string) {
  const client = createServerSupabaseClient();

  const { error } = await client.from("api_keys").delete().eq("api_id", api_id);

  if (error) {
    console.error("Error deleting API key:", error);
    return { ok: false, message: "Failed to delete API key" };
  }

  return { ok: true };
}
