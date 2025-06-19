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
  tone_style: z.enum([
    "formal",
    "friendly",
    "professional",
    "casual",
    "humorous",
  ]),

  knowledge_scope: z.string().optional(),
  botthesis: z.string().min(1, "Bot thesis is required"),
  writing_style: z.enum(["concise", "elaborate", "technical", "narrative"]),
  response_style: z.enum(["direct", "indirect", "balanced", "inquisitive"]),

  // Language & Communication
  greeting: z.string().min(1, "Greeting message is required"),
  fallback: z.string().min(1, "Fallback response is required"),
  use_emojis: z.boolean(),
  // allowProfanity: z.boolean(),
  include_citations: z.boolean(),
  language_preference: z.enum(["en", "hi", "fr", "de", "es", "zh"]),

  // Expertise
  expertise: z.enum(["finance", "health", "technology", "education", "custom"]),
  customexpertise: z.string().optional(),

  // Safety & Moderation
  // safetySettings: z.string().optional(),
  content_filter_level: z.enum(["low", "medium", "high"]),
  custom_moderation: z.boolean(),

  // Memory & Data Retention
  memory_type: z.enum(["per-user", "global", "session-only"]),
  memory_expiration: z.enum(["session", "24h", "7d", "30d", "perm"]),

  // System fields (would be set by system, not user)
  // ownerId: z.string().optional(),
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),
  // status: z.enum(["active", "archived", "deleted"]),
  // billingPlan: z.enum(["free", "pro", "enterprise"]),
  // defaultLanguage: z.string(),
  // embeddingModel: z.string().optional(),
  // version: z.number(),
});

export type BotConfigType = z.infer<typeof botConfigSchema>;
