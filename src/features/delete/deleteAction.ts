"use server";

import { createServerSupabaseClient } from "@/db/supabase/client";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";
import { deleteCachedApiKey } from "@/lib/cache";
import { Result } from "@/types/result";
import { redirect } from "next/navigation";

export async function deleteBot(bot_id: string): Promise<Result<null>> {
  const client = createServerSupabaseClient();

  const { data: token_hash, error: apiError } = await client
    .from("api_keys")
    .select("token_hash")
    .eq("bot_id", bot_id)
    .maybeSingle();

  if (token_hash && !apiError) {
    console.log("Deleting cached API key:", token_hash);
    await deleteCachedApiKey(token_hash.token_hash as string);
  }

  const { error } = await client.from("bots").delete().eq("bot_id", bot_id);

  if (error) {
    console.error("DeleteBot →", error);
    return {
      ok: false,
      message: supabaseErrorToMessage(error),
    };
  }

  return redirect("/bots");
}
