import { z } from "zod";

export const botSettingsSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_type: z.string().min(1, "Business type is required"),
  business_description: z.string().transform((val) => val ?? ""),

  product_name: z.string().min(1, "Product name is required"),
  product_description: z.string().transform((val) => val ?? ""),

  support_email: z
    .string()
    .email("Invalid support email format")
    .nullable()
    .transform((val) => val ?? null),

  contacts: z.string().transform((val) => val ?? ""),

  supported_languages: z
    .array(z.string().min(2))
    .nonempty("At least one language must be supported")
    .default(["en"]),

  targeted_audience: z.string().transform((val) => val ?? ""),
  mission: z.string().transform((val) => val ?? ""),
  thesis: z.string().transform((val) => val ?? ""),
  goals: z.string().transform((val) => val ?? ""),
});

export type BotSettingsType = z.infer<typeof botSettingsSchema>;
