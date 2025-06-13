"use server";

import { createServerSupabaseClient } from "../auth/client";

export async function addBot(name: string, description: string) {
  const client = createServerSupabaseClient();

  try {
    const response = await client.from("bots").insert({
      name,
      description,
    });

    console.log("Bot successfully added!", response);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding bot:", error.message);
    } else {
      console.error("Error adding bot:", error);
    }
    throw new Error("Failed to add bot");
  }
}
