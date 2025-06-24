"use server";

import crypto from "node:crypto";
import { ApiKeyRow, apiKeySchema } from "./apiSchema";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { Result } from "@/types/result";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";
import { sha256 } from "js-sha256";
import { generateApiMeshToken } from "../../lib/meshtoken-gen";
import { auth } from "@clerk/nextjs/server";
import { deleteCachedApiKey } from "@/lib/cache";

export async function createApiKey(
  bot_id: string,
  name: string,
  permissions: string[]
): Promise<Result<ApiKeyRow>> {
  const parsed = apiKeySchema.safeParse({ name, permissions });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    };
  }

  const client = createServerSupabaseClient();
  const { userId } = await auth();

  if (!userId) {
    return { ok: false, message: "User authentication failed" };
  }

  const { count, error: countErr } = await client
    .from("api_keys")
    .select("*", { count: "exact", head: true })
    .eq("bot_id", bot_id);

  if (countErr) {
    return { ok: false, message: supabaseErrorToMessage(countErr!) };
  }

  if ((count ?? 0) > 3) {
    return {
      ok: false,
      message: "You can only have a maximum of 3 API keys per bot.",
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);

  const api_mesh_token = generateApiMeshToken({
    token: rawToken,
    bot_id,
    user_id: userId!,
  });

  const { data, error } = await client
    .from("api_keys")
    .insert({
      bot_id,
      name: parsed.data.name,
      permissions: parsed.data.permissions,
      token_hash: tokenHash,
      api_mesh_token,
    })
    .select()
    .maybeSingle();

  if (error) {
    return { ok: false, message: supabaseErrorToMessage(error!) };
  }

  return {
    ok: true,
    data: {
      ...data,
      token_hash: api_mesh_token,
    },
  };
}

export async function deleteApiKey(api_id: string) {
  const client = createServerSupabaseClient();

  const { error, data } = await client
    .from("api_keys")
    .delete()
    .eq("api_id", api_id)
    .select("*");

  if (error) {
    console.error("Error deleting API key:", error);
    return { ok: false, message: "Failed to delete API key" };
  }
  if (data[0].token_hash) {
    console.log("Deleting cached API key:", data[0].token_hash);
    await deleteCachedApiKey(data[0].token_hash);
  }
  return { ok: true };
}
