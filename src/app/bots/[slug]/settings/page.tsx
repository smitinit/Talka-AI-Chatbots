import { BotSettingsType } from "@/features/SettingBot/bot-setting.schema";
import SettingForm from "@/features/SettingBot/SettingsForm";

export default async function Settings() {
  await new Promise((res) => setTimeout(res, 500));

  const fetchedSettings: BotSettingsType = {
    maxTokens: 1024,
    topP: 0.85,
    topK: 20,
    stopSequences: "END, STOP",
    jsonMode: true,
    toolUse: true,

    useWebSearch: true,
    siteUrl: "https://example.com",
    focusDomains: "tech,ai,education",

    loggingEnabled: false,
    voiceMode: true,
    rateLimitPerMin: 30,

    webhookURL: "https://hooks.example.com/webhook",
    billingPlan: "enterprise",

    // Optional fields left out to simulate fallback behavior:
    // tokenQuota
    // apiCallsThisMonth
  };

  return (
    <>
      <SettingForm fetchedSettings={fetchedSettings} />
    </>
  );
}
