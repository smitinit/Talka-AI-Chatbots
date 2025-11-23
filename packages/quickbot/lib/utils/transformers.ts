// quickbot/lib/utils/transformers.ts

import type { UiSettingsParsed } from "../validators";
import { getThemePack } from "../themes/theme-packs";

/**
 * Convert snake_case UI settings to camelCase for component usage
 * Includes theme pack colors
 */
export function toCamelCase(uiSettings: UiSettingsParsed) {
  const theme = uiSettings.theme as
    | "modern"
    | "classic"
    | "minimal"
    | "bubble"
    | "retro";
  const themePack = getThemePack(theme);

  return {
    theme,
    chatbotName: uiSettings.chatbot_name || "",
    welcomeMessage: uiSettings.welcome_message || "",
    quickQuestions: uiSettings.quick_questions || [],
    supportInfo: uiSettings.support_info,
    position: uiSettings.position as "bottom-right" | "bottom-left",
    autoOpenDelayMs: uiSettings.auto_open_delay_ms || 0,
    autoGreetOnOpen: uiSettings.auto_greet_on_open ?? false,
    askEmailBeforeChat: uiSettings.ask_email_before_chat ?? false,
    persistChat: uiSettings.persist_chat ?? true,
    showTimestamps: uiSettings.show_timestamps ?? true,
    // Include theme pack colors
    themePack,
  };
}

export type UiSettingsCamelCase = ReturnType<typeof toCamelCase>;
