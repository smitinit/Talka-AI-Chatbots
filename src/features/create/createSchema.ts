import { z } from "zod";

export const botSchema = z.object({
  name: z
    .string()
    .min(6, "Bot's name should atleast contain 6 characters!")
    .max(15, "Bot's name can not be more than 10 characters!"),
  description: z
    .string()
    .min(10, "Bot's description is required!")
    .max(200, "Bot's description can not be more than 200 words"),
});

export type BotFormInputType = z.infer<typeof botSchema>;

export type BotType = {
  id?: number;
  bot_id?: string;
  name: string;
  description: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};
