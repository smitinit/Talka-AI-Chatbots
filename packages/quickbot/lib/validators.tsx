// quickbot/src/lib/validators.ts
import { z } from "zod";

/**
 * Client-safe Zod validators for strict runtime validation.
 * No secrets. No private keys. Safe for public usage.
 */

/* ---------------------------------------------
   UI Settings Schema (from bot_ui_settings table)
   Matches the new simplified table structure
   Only includes allowed fields from the whitelist
   Note: id and created_at are excluded as they're database metadata
   and not part of the signed payload
--------------------------------------------- */
export const UiSettingsSchema = z
  .object({
    bot_id: z.string().optional(),
    theme: z.enum(["modern", "classic", "minimal", "bubble", "retro"]),
    chatbot_name: z.string(),
    welcome_message: z.string(),
    quick_questions: z.array(z.string()),
    support_info: z.string().nullable(),
    position: z.string(),
    auto_open_delay_ms: z.number(),
    auto_greet_on_open: z.boolean(),
    ask_email_before_chat: z.boolean(),
    persist_chat: z.boolean(),
    show_timestamps: z.boolean(),
    updated_at: z.string().optional(),
  })
  .passthrough(); // Allow extra fields (id, created_at, old fields) but don't validate them

export type UiSettingsParsed = z.infer<typeof UiSettingsSchema>;

/* ---------------------------------------------
   Signed UI Settings Schema
--------------------------------------------- */
export const SignedUiSettingsSchema = z.object({
  ui_settings: UiSettingsSchema,
  signature: z.string().min(1), // base64 DER ECDSA signature
});

export type SignedUiSettingsParsed = z.infer<typeof SignedUiSettingsSchema>;

/* ---------------------------------------------
   Safe Parsing Helpers
--------------------------------------------- */

/**
 * Parse signed UI settings returned by your SaaS API.
 * Throws a ZodError if shape is invalid.
 */
export function parseSignedUiSettings(
  payload: unknown
): SignedUiSettingsParsed {
  return SignedUiSettingsSchema.parse(payload);
}
