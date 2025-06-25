import { z } from "zod";

export const botConfigSchema = z.object({
  persona: z.string().min(1, "Persona is required"),
  backstory: z.string().transform((val) => val ?? ""),
  goals: z.string().transform((val) => val ?? ""),
  botthesis: z.string().min(1, "Bot thesis is required"),
  tone_style: z.enum([
    "formal",
    "friendly",
    "professional",
    "casual",
    "humorous",
  ]),
  writing_style: z.enum(["concise", "elaborate", "technical", "narrative"]),
  response_style: z.enum(["direct", "indirect", "balanced", "inquisitive"]),
  language_preference: z.enum(["en", "hi", "fr", "de", "es", "zh"]),
  default_language: z.enum(["en", "hi", "fr", "de", "es", "zh"]),
  expertise: z.enum(["finance", "health", "technology", "education", "custom"]),
  customexpertise: z.string().transform((val) => val ?? ""),

  use_emojis: z.boolean(),
  include_citations: z.boolean(),
  target_audience: z.string().transform((val) => val ?? ""),
  output_format: z.string().transform((val) => val ?? ""),
  do_dont: z.string().transform((val) => val ?? ""),
  preferred_examples: z.string(),
  persona_tags: z.string().transform((val) => val ?? ""),
});

export type BotConfigType = z.infer<typeof botConfigSchema>;
