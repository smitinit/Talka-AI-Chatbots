// quickbot/lib/api/config.ts

import { parseSignedUiSettings } from "../validators";
import { verifyECDSASignature } from "../crypto/verify";
import { toCamelCase, type UiSettingsCamelCase } from "../utils/transformers";

export interface ConfigFetchResult {
  uiSettings: UiSettingsCamelCase;
}

export interface ConfigFetchError {
  message: string;
}

/**
 * Fetches and verifies the signed bot configuration from the API
 */
export async function fetchBotConfig(
  botId: string
): Promise<ConfigFetchResult | ConfigFetchError> {
  try {
    const res = await fetch(`/api/config/${botId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return { message: "Unable to load chatbot" };
    }

    const raw = await res.json();
    const signed = parseSignedUiSettings(raw);

    // Verify signature
    const publicKey = process.env.NEXT_PUBLIC_QUICKBOT_PUBLIC_KEY;
    if (!publicKey) {
      return { message: "Chatbot misconfigured" };
    }

    // Build payload that was signed (ui_settings only)
    // Filter to only allowed fields to match what the API route signed
    const allowed = [
      "theme",
      "chatbot_name",
      "welcome_message",
      "quick_questions",
      "support_info",
      "position",
      "auto_open_delay_ms",
      "auto_greet_on_open",
      "ask_email_before_chat",
      "persist_chat",
      "show_timestamps",
    ];

    // Filter to only allowed fields (exclude database metadata and extra fields)
    const uiSettingsForVerification = Object.fromEntries(
      Object.entries(signed.ui_settings).filter(
        ([k]) => allowed.includes(k) && k !== "id" && k !== "created_at"
      )
    );

    const payloadToVerify = {
      ui_settings: uiSettingsForVerification,
    };

    const ok = await verifyECDSASignature(
      payloadToVerify,
      signed.signature,
      publicKey
    );

    if (!ok) {
      return { message: "Invalid chatbot configuration" };
    }

    return {
      uiSettings: toCamelCase(signed.ui_settings),
    };
  } catch (err) {
    return {
      message: `Failed to load chatbot: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    };
  }
}
