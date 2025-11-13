// export const botConfigSchema = z.object({
//   persona: z.string().min(1, "Persona is required"),
//   backstory: z.string().transform((val) => val ?? ""),
//   goals: z.string().transform((val) => val ?? ""),
//   botthesis: z.string().min(1, "Bot thesis is required"),
//   tone_style: z.enum([
//     "formal",
//     "friendly",
//     "professional",
//     "casual",
//     "humorous",
//   ]),
//   writing_style: z.enum(["concise", "elaborate", "technical", "narrative"]),
//   response_style: z.enum(["direct", "indirect", "balanced", "inquisitive"]),
//   language_preference: z.enum(["en", "hi", "fr", "de", "es", "zh"]),
//   default_language: z.enum(["en", "hi", "fr", "de", "es", "zh"]),
//   expertise: z.enum(["finance", "health", "technology", "education", "custom"]),
//   customexpertise: z.string().transform((val) => val ?? ""),

//   use_emojis: z.boolean(),
//   include_citations: z.boolean(),
//   target_audience: z.string().transform((val) => val ?? ""),
//   output_format: z.string().transform((val) => val ?? ""),
//   do_dont: z.string().transform((val) => val ?? ""),
//   preferred_examples: z.string(),
//   persona_tags: z.string().transform((val) => val ?? ""),
// });

import { z } from "zod";

export const botConfigSchema = z.object({
  persona: z.string().min(1, "Persona is required"),
  backstory: z.string().optional().nullable(),
  goals: z.string().optional().nullable(),
  botthesis: z.string().min(1, "Bot thesis is required"),

  tone_style: z
    .enum(["formal", "friendly", "professional", "casual", "humorous"])
    .optional()
    .nullable(),
  writing_style: z
    .enum(["concise", "elaborate", "technical", "narrative"])
    .optional()
    .nullable(),
  response_style: z
    .enum(["direct", "indirect", "balanced", "inquisitive"])
    .optional()
    .nullable(),

  default_language: z.string().min(1, "Default language is required"),

  expertise: z
    .enum(["finance", "health", "technology", "education", "custom"])
    .optional()
    .nullable(),
  customexpertise: z.string().default("").optional().nullable(),

  use_emojis: z.boolean().default(true),
  include_citations: z.boolean().default(false),

  target_audience: z.string().optional().nullable(),
  do_dont: z.string().optional().nullable(),
  preferred_examples: z.string().default(""),
  persona_tags: z.string().default(""),

  greetings: z.string().optional().nullable(),
  fallback_message: z.string().optional().nullable(),
  dos_and_donts: z.string().optional().nullable(),

  version: z.number().default(1),
});

export type BotConfigType = z.infer<typeof botConfigSchema>;
