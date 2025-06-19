"use server";

import { createServerSupabaseClient } from "@/db/supabase/client";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";

import type { BotType } from "./bot-create.types";
import { botSchema } from "./bot-create.schema";
import { revalidatePath } from "next/cache";

import type { PostgrestError } from "@supabase/supabase-js";
import type { Result } from "@/types/result";

// Add bot in db
export async function addBot(
  name: string,
  description: string
): Promise<Result<BotType>> {
  const parsed = botSchema.safeParse({ name, description });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.errors[0]?.message || "Invalid input",
    };
  }
  const client = createServerSupabaseClient();

  const { data, error } = await client
    .from("bots")
    .insert(parsed.data)
    .select() // newly created row back
    .maybeSingle();

  if (error) {
    console.error("AddBot →", error); // full dump for the server log
    const message = supabaseErrorToMessage(error as PostgrestError);
    return { ok: false, message };
  }

  revalidatePath("/bots");
  return { ok: true, data };
}

// Get all bots per tenant from db
export async function getBots(): Promise<Result<BotType[]>> {
  const client = createServerSupabaseClient();

  const { error, data } = await client.from("bots").select();

  if (error) {
    console.error("Get All Bots →", error);
    return {
      ok: false,
      message: supabaseErrorToMessage(error as PostgrestError),
    };
  }

  return { ok: true, data: data as BotType[] };
}
