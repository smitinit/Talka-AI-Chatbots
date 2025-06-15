import { z } from "zod";

export const botSchema = z.object({
  name: z
    .string()
    .min(1, "Bot's name is required!")
    .max(10, "Bot's name can not be more than 10 characters"),
  description: z
    .string()
    .min(1, "Bot's description is required!")
    .max(200, "Bot's description can not be more than 200 words"),
});

export type BotFormInput = z.infer<typeof botSchema>;
