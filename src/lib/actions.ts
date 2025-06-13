"use server";

import { createServerSupabaseClient } from "../auth/client";

export async function addTask(name: string) {
  const client = createServerSupabaseClient();

  try {
    const response = await client.from("tasks").insert({
      name,
    });

    console.log("Task successfully added!", response);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding task:", error.message);
    } else {
      console.error("Error adding task:", error);
    }
    throw new Error("Failed to add task");
  }
}
