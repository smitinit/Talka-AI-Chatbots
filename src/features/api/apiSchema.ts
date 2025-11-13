import { z } from "zod";

export const apiKeySchema = z.object({
  name: z.string().min(2, "Key name must be at least 2 characters"),
  permissions: z
    .array(z.enum(["prod", "dev"]))
    .refine((value) => value.length > 0, {
      message: "You must select at least one environment (prod or dev).",
    }),
});

export type ApiKeyFormType = z.infer<typeof apiKeySchema>;

export type ApiKeyRow = {
  id: number;
  bot_id: string;
  user_id: string;
  name: string;
  token_hash: string;
  permissions: ("prod" | "dev")[];
  created_at: string;
  api_id: string;
};
