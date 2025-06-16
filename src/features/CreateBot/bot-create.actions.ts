"use server";

import { createServerSupabaseClient } from "@/db/supabase/client";
import { supabaseErrorToMessage } from "@/db/supabase/errorMap";

import type { Bot } from "./bot-create.types";
import { botSchema } from "./bot-create.schema";
import { revalidatePath } from "next/cache";

import type { PostgrestError } from "@supabase/supabase-js";
import type { Result } from "@/types/result";

// Add bot in db
export async function addBot(
  name: string,
  description: string
): Promise<Result<Bot>> {
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
    .select() // so we get the newly created row back
    .single(); // unwrap

  if (error) {
    console.error("AddBot →", error); // full dump for the server log
    const message = supabaseErrorToMessage(error as PostgrestError);
    return { ok: false, message };
  }

  revalidatePath("/bots");
  return { ok: true, data };
}

// Delete bot from db
export async function deleteBot(bot_id: string): Promise<Result<null>> {
  const client = createServerSupabaseClient();

  const { error } = await client.from("bots").delete().eq("bot_id", bot_id);

  if (error) {
    console.error("DeleteBot →", error);
    return {
      ok: false,
      message: supabaseErrorToMessage(error as PostgrestError),
    };
  }

  revalidatePath("/bots");

  return { ok: true, data: null };
}

// Get all bots per tenant from db
export async function getBots(): Promise<Result<Bot[]>> {
  const client = createServerSupabaseClient();

  const { error, data } = await client.from("bots").select();

  if (error) {
    console.error("Get All Bots →", error);
    return {
      ok: false,
      message: supabaseErrorToMessage(error as PostgrestError),
    };
  }

  return { ok: true, data: data as Bot[] };
}

// Update existing bot in db
export async function updataBot(
  bot_id: string,
  newName: string,
  newDescription: string
): Promise<Result<null>> {
  const client = createServerSupabaseClient();

  const { error } = await client
    .from("bots")
    .update({
      name: newName,
      description: newDescription,
    })
    .eq("bot_id", bot_id);
  if (error) {
    console.error("UpdateBot →", error);
    return {
      ok: false,
      message: supabaseErrorToMessage(error as PostgrestError),
    };
  }

  return { ok: true, data: null };
}
