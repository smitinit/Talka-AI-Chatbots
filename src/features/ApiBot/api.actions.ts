"use server";
import crypto from "node:crypto";
import { ApiKeyRow, apiKeySchema } from "./api.schema";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { Result } from "@/types/result";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";
import { revalidatePath } from "next/cache";

export async function createApiKey(
  bot_id: string,
  name: string,
  permissions: string[]
): Promise<Result<ApiKeyRow>> {
  // 1. validate
  const parsed = apiKeySchema.safeParse({ name, permissions });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    };
  }

  const client = createServerSupabaseClient();

  // 2. optional ownership check (kept from your code)
  const { data: bot } = await client
    .from("bots")
    .select("bot_id")
    .eq("bot_id", bot_id)
    .maybeSingle();

  if (!bot) return { ok: false, message: "Bot not found or not owned by user" };

  // 3. generate token & hash
  const rawToken = crypto.randomBytes(32).toString("hex"); // shown to user once
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // 4. insert only the hash
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
    return { ok: false, message: supabaseErrorToMessage(error) };
  }

  // 5. trigger revalidation & return raw token once
  revalidatePath(`/bots/${bot_id}/talka-api`);
  return { ok: true, data: { ...data, token: rawToken } };
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
