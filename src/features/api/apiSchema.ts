// api.schema.ts
import { z } from "zod";

export const apiKeySchema = z.object({
  name: z.string().min(2, "Key name must be at least 2 characters"),
  // “read” and “write” are the only scopes for now
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

export type ApiKeyFormType = z.infer<typeof apiKeySchema>;

export type ApiKeyRow = {
  id: number;
  bot_id: string;
  user_id: string;
  name: string;
  token_hash: string;
  permissions: ("read" | "write")[];
  created_at: string;
  api_id: string;
};
