"use client";

import { useCallback } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { supabaseErrorToMessage } from "@/lib/supabase/errorMap";
import { botSchema } from "@/schema";
import type { BotType } from "@/types";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Result } from "@/types/result";

export function useBotActions() {
  const { supabase, isLoaded: supabaseLoaded } = useSupabase();
  const { user, isLoaded: userLoaded } = useUser();

  const isLoaded = supabaseLoaded && userLoaded;

  const addBot = useCallback(
    async (name: string, description: string): Promise<Result<BotType>> => {
      if (!isLoaded || !supabase || !user) {
        return {
          ok: false,
          message: "User authentication failed",
        };
      }

      const parsed = botSchema.safeParse({ name, description });

      if (!parsed.success) {
        return {
          ok: false,
          message: parsed.error.errors[0]?.message ?? "Invalid input",
        };
      }

      const { data, error } = await supabase
        .from("bots")
        .insert({
          ...parsed.data,
          user_id: user.id,
        })
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("AddBot →", error);
        return {
          ok: false,
          message: supabaseErrorToMessage(error as PostgrestError),
        };
      }

      return { ok: true, data };
    },
    [isLoaded, supabase, user]
  );

  const getBots = useCallback(async (): Promise<Result<BotType[]>> => {
    if (!isLoaded || !supabase || !user) {
      return {
        ok: false,
        message: "User authentication failed",
      };
    }

    const { error, data } = await supabase
      .from("bots")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Get All Bots →", error);
      return {
        ok: false,
        message: supabaseErrorToMessage(error as PostgrestError),
      };
    }

    return { ok: true, data: data as BotType[] };
  }, [isLoaded, supabase, user]);

  const deleteBot = useCallback(
    async (bot_id: string): Promise<Result<null>> => {
      if (!isLoaded || !supabase || !user) {
        return {
          ok: false,
          message: "User authentication failed",
        };
      }

      // Verify bot ownership
      const { data: bot, error: botError } = await supabase
        .from("bots")
        .select("bot_id")
        .eq("bot_id", bot_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (botError || !bot) {
        return {
          ok: false,
          message: "Bot not found or access denied",
        };
      }

      // Get all API keys for this bot to clear cache
      const { data: apiKeys, error: apiError } = await supabase
        .from("api_keys")
        .select("token_hash")
        .eq("bot_id", bot_id);

      if (!apiError && apiKeys) {
        // Note: Cache deletion would need to be handled via API route if needed
        // For now, we'll just delete the bot
      }

      const { error } = await supabase
        .from("bots")
        .delete()
        .eq("bot_id", bot_id);

      if (error) {
        console.error("DeleteBot →", error);
        return {
          ok: false,
          message: supabaseErrorToMessage(error),
        };
      }

      return { ok: true, data: null };
    },
    [isLoaded, supabase, user]
  );

  const deleteAllBots = useCallback(
    async (): Promise<Result<null>> => {
      if (!isLoaded || !supabase || !user) {
        return {
          ok: false,
          message: "User authentication failed",
        };
      }

      // Delete all bots for this user
      const { error } = await supabase
        .from("bots")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("DeleteAllBots →", error);
        return {
          ok: false,
          message: supabaseErrorToMessage(error),
        };
      }

      return { ok: true, data: null };
    },
    [isLoaded, supabase, user]
  );

  return { addBot, getBots, deleteBot, deleteAllBots };
}
