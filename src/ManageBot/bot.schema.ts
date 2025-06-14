import { z } from "zod";

export const botSchema = z.object({
  name: z.string().min(1, "Bot's name is required!"),
  description: z.string().min(1, "Bot's description is required!"),
});

export type BotFormInput = z.infer<typeof botSchema>;
