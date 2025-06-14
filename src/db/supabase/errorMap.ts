// lib/supabase/errorMap.ts
import type { PostgrestError } from "@supabase/supabase-js";

export function supabaseErrorToMessage(err: PostgrestError): string {
  switch (err.code) {
    case "23505": // unique_violation
      return "A bot with this name already exists.";
    case "42501": // insufficient_privilege
    case "57P01": // admin_shutdown etc.
      return "Permission denied. Please sign in and try again.";
    case "PGRST116": // RLS failed
      return "You do not have access to that bot.";
    default:
      // Fallback: keep it generic for security & UX
      return "Something went wrong. Please try again.";
  }
}
