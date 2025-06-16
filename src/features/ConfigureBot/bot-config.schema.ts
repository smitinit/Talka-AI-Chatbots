// import { z } from "zod";

// export const botConfigSchema = z
//   .object({
//     /** ─── Identity ─────────────────────────────── */
//     name: z.string().min(2, "Bot name is required"),
//     avatar: z.string().url("Avatar must be a valid URL").optional(),
//     voice: z.string().optional(),
//     gender: z.enum(["male", "female", "neutral"], {
//       required_error: "Gender is required",
//     }),

//     /** ─── Personality ──────────────────────────── */
//     persona: z.string().min(10, "Persona is required"),
//     backstory: z.string().optional(),
//     goals: z.string().optional(),
//     toneStyle: z
//       .enum(["formal", "friendly", "professional", "casual", "humorous"])
//       .optional(),
//     knowledgeScope: z.string().optional(),
//     botthesis: z.string().min(10, "Bot thesis is required"),
//     writingStyle: z
//       .enum(["concise", "elaborate", "technical", "narrative"])
//       .optional(),
//     responseStyle: z
//       .enum(["direct", "indirect", "balanced", "inquisitive"])
//       .optional(),

//     /** ─── Conversation Style ───────────────────── */
//     useEmojis: z.boolean(),
//     allowProfanity: z.boolean(),
//     includeCitations: z.boolean(),
//     languagePreference: z.enum(["en", "hi", "fr", "de", "es", "zh"], {
//       required_error: "Language preference is required",
//     }),

//     /** ─── Safety & Moderation ──────────────────── */
//     safetySettings: z.string().optional(),
//     contentFilterLevel: z.enum(["low", "medium", "high"]),
//     customModeration: z.boolean(),
//     triggerWords: z.array(z.string()),
//     blockList: z.array(z.string()),

//     /** ─── Greetings ────────────────────────────── */
//     greeting: z.string().min(5, "Greeting is required"),
//     fallback: z.string().min(5, "Fallback message is required"),

//     /** ─── Tone & Behaviour ─────────────────────── */
//     tone: z.enum([
//       "neutral",
//       "friendly",
//       "assertive",
//       "empathetic",
//       "sarcastic",
//     ]),
//     proactiveness: z.enum(["passive", "balanced", "aggressive"]),
//     responseLength: z.enum(["short", "medium", "long"]),

//     /** ─── Expertise ────────────────────────────── */
//     expertise: z.enum(
//       ["finance", "health", "technology", "education", "custom"],
//       {
//         required_error: "Expertise is required",
//       }
//     ),
//     customexpertise: z.string().optional(),

//     /** ─── Search & Sources ─────────────────────── */
//     useWebSearch: z.boolean(),
//     siteUrl: z.string().url().optional(),
//     focusDomains: z.string().optional(),

//     /** ─── Memory & Learning ────────────────────── */
//     memoryType: z.enum(["per-user", "global", "session-only"], {
//       required_error: "Memory type is required",
//     }),
//     memoryExpiration: z.enum(["session", "24h", "7d", "30d", "perm"]),
//     /** ─── Creativity & Humor ───────────────────── */
//     creativity: z.number().min(0).max(1),
//     humorMode: z.boolean(),

//     /** ─── Model Behavior ───────────────────────── */
//     modelVersion: z.enum(["gemini-pro", "gemini-1.5-pro"]),
//     maxTokens: z.number().int().min(100).max(4000),
//     topP: z.number().min(0).max(1),
//     topK: z.number().int().min(0),
//     stopSequences: z.array(z.string()),
//     jsonMode: z.boolean(),
//     toolUse: z.boolean(),
//   })
//   .refine(
//     (data) =>
//       data.expertise !== "custom" || (data.customexpertise ?? "").trim().length,
//     {
//       message: "Custom expertise description is required",
//       path: ["customexpertise"],
//     }
//   );

// export type BotConfigsType = z.infer<typeof botConfigSchema>;

import { z } from "zod";

export const botConfigSchema = z.object({
  // Identity & Basic Information
  name: z.string().min(1, "Bot name is required"),
  avatar: z.string().url().optional().or(z.literal("")),
  voice: z.string().optional(),
  gender: z.enum(["male", "female", "neutral"]),

  // Personality & Character
  persona: z.string().min(1, "Persona is required"),
  backstory: z.string().optional(),
  goals: z.string().optional(),
  toneStyle: z.enum([
    "formal",
    "friendly",
    "professional",
    "casual",
    "humorous",
  ]),
  knowledgeScope: z.string().optional(),
  botthesis: z.string().min(1, "Bot thesis is required"),
  writingStyle: z.enum(["concise", "elaborate", "technical", "narrative"]),
  responseStyle: z.enum(["direct", "indirect", "balanced", "inquisitive"]),

  // Language & Communication
  greeting: z.string().min(1, "Greeting message is required"),
  fallback: z.string().min(1, "Fallback response is required"),
  useEmojis: z.boolean(),
  allowProfanity: z.boolean(),
  includeCitations: z.boolean(),
  languagePreference: z.enum(["en", "hi", "fr", "de", "es", "zh"]),
  // Expertise
  expertise: z.enum(["finance", "health", "technology", "education", "custom"]),
  customexpertise: z.string().optional(),

  // Safety & Moderation
  safetySettings: z.string().optional(),
  contentFilterLevel: z.enum(["low", "medium", "high"]),
  customModeration: z.boolean(),

  // Memory & Data Retention
  memoryType: z.enum(["per-user", "global", "session-only"]),
  memoryExpiration: z.enum(["session", "24h", "7d", "30d", "perm"]),
  // Advanced Model Configuration
  modelVersion: z.enum(["gpt-4", "gpt-4.5", "gpt-3.5", "custom"]),
  // System fields (would be set by system, not user)
  ownerId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  status: z.enum(["active", "archived", "deleted"]),
  billingPlan: z.enum(["free", "pro", "enterprise"]),
  defaultLanguage: z.string(),
  embeddingModel: z.string().optional(),
  version: z.number(),
});

export type BotConfigType = z.infer<typeof botConfigSchema>;
