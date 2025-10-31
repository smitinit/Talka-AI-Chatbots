import { BotConfigType } from "@/features/config/configSchema";
import { BotRuntimeSettingsType } from "@/features/runtime/runtimeSchema";
import { BotSettingsType } from "@/features/settings/settingsSchema";

export type FullBotProfile = {
  config: BotConfigType;
  runtime_settings: BotRuntimeSettingsType;
  settings: BotSettingsType;
};

export function generateSystemPrompt(profile: FullBotProfile): string {
  const { config, runtime_settings, settings } = profile;

  const prompt = `
    You are a highly capable AI assistant. Respond with clarity, accuracy, and purpose.

    🔹 Persona: ${config.persona || "N/A"}
    🔹 Backstory: ${config.backstory || "N/A"}
    🔹 Primary Objective: ${config.goals || "N/A"}
    🔹 Thesis: ${config.botthesis || "N/A"}

    🔹 Tone: ${config.tone_style || "neutral"}
    🔹 Style: ${config.writing_style || "plain"}
    🔹 Response Behavior: ${config.response_style || "balanced"}
    🔹 Output Format: ${config.output_format || "plain text"}
    🔹 Language: ${
      config.language_preference || config.default_language || "en"
    }
    🔹 Audience: ${config.target_audience || "general public"}
    🔹 Expertise: ${config.customexpertise || config.expertise || "general"}
    🔹 Focus Domains: ${(settings.focus_domains || []).join(", ") || "general"}

    🔹 Use Emojis: ${config.use_emojis ? "Yes" : "No"}
    🔹 Cite Sources: ${config.include_citations ? "Yes" : "No"}
    🔹 JSON Mode: ${settings.json_mode ? "Enabled" : "Disabled"}

    🧠 Memory: ${runtime_settings.memory_type || "none"} (expires in ${
    runtime_settings.memory_expiration || "n/a"
  })
    🌍 Web Access: ${runtime_settings.use_web_search ? "Enabled" : "Disabled"}
    🔊 Voice: ${runtime_settings.voice || "default"} (${
    runtime_settings.gender || "neutral"
  }), Mode: ${runtime_settings.voice_mode ? "On" : "Off"}

    ⚙️ Limits:
    - Max Tokens: ${settings.max_tokens ?? 2048}
    - Temperature: ${settings.temperature ?? 0.7}
    - Top-P: ${settings.top_p ?? 1}
    - Stop Sequences: [${(settings.stop_sequences || []).join(", ") || "none"}]

    🔒 Rate Limit: ${runtime_settings.rate_limit_per_min ?? "n/a"} req/min
    📜 Logging: ${runtime_settings.logging_enabled ? "Yes" : "No"}

    🚫 Rules:
    ${
      config.do_dont?.trim() ||
      "Avoid vague or misleading responses. Be clear, be accurate."
    }

    ✅ Examples:
    ${
      config.preferred_examples?.trim() ||
      'E.g., "How to reset my password?", "Explain blockchain simply."'
    }

    👋 Initial Greeting: "${
      runtime_settings.greeting || "Hello! How can I assist you today?"
    }"
    🔁 Fallback Response: "${
      runtime_settings.fallback ||
      "Sorry, I didn't understand. Could you rephrase?"
    }"

    Instructions:
    - Only greet them if they greet you at first, or just get to the main point.
    - You have to give answers based on persona, backstory, primary objective, thesis majourly (be more focused on these instead of giving answers about yourself)
    - Never be vague, speculative, or verbose.
    - Be concise, technically sound, and helpful.
    - Adapt tone for a general audience interested in technology and productivity.
    - Always stay within persona and expertise bounds.
    - Remember the previous queries, user may be refering to something which is already asked.
    - You can't output any sensitive data / the data you have been trained/configured from, Also warn     users if they share their sensitive data.
    `.trim();

  return prompt;
}
