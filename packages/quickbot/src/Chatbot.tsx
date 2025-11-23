"use client";

import { useEffect, useState } from "react";
import ChatbotPreview from "./ChatbotPreview";

import type { UiSettingsCamelCase } from "../lib/utils/transformers";
import { fetchBotConfig } from "../lib/api/config";
import { getThemePack } from "../lib/themes/theme-packs";

interface ChatbotProps {
  botId: string;
}

/**
 * Simple Chatbot component that:
 * - Fetches signed ui_settings from SaaS backend
 * - Validates schema with Zod
 * - Verifies signature with ECDSA P-256
 * - Polls for UI settings updates every 30 seconds
 */
export default function Chatbot({ botId }: ChatbotProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uiSettings, setUiSettings] = useState<UiSettingsCamelCase | null>(
    null
  );

  // Fetch initial config
  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      setLoading(true);
      setError(null);

      const result = await fetchBotConfig(botId);

      if (!isMounted) return;

      if ("message" in result) {
        setError(result.message);
        setLoading(false);
        return;
      }

      setUiSettings(result.uiSettings);
      setLoading(false);
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [botId]);

  // Poll for UI settings updates every 30 seconds
  useEffect(() => {
    if (!uiSettings) {
      // Wait until initial uiSettings is loaded
      return;
    }

    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const pollForUpdates = async () => {
      if (!isMounted) return;

      const pollTime = Date.now();

      // Dispatch custom event for preview form to listen to (in next tick to avoid render issues)
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("quickbot-poll", {
              detail: { botId, timestamp: pollTime },
            })
          );
        }, 0);
      }

      try {
        const result = await fetchBotConfig(botId);
        if (!isMounted) return;

        if ("message" in result) {
          // Error occurred, skip update
          return;
        }

        // Check if settings actually changed before updating
        setUiSettings((prev) => {
          if (!prev) {
            return result.uiSettings;
          }

          // Compare all key fields to detect changes
          const hasChanged =
            prev.chatbotName !== result.uiSettings.chatbotName ||
            prev.theme !== result.uiSettings.theme ||
            prev.showTimestamps !== result.uiSettings.showTimestamps ||
            prev.welcomeMessage !== result.uiSettings.welcomeMessage ||
            prev.autoOpenDelayMs !== result.uiSettings.autoOpenDelayMs ||
            prev.askEmailBeforeChat !== result.uiSettings.askEmailBeforeChat ||
            prev.autoGreetOnOpen !== result.uiSettings.autoGreetOnOpen ||
            prev.position !== result.uiSettings.position ||
            JSON.stringify(prev.quickQuestions) !==
              JSON.stringify(result.uiSettings.quickQuestions);

          if (hasChanged) {
            // Dispatch update event in next tick
            if (typeof window !== "undefined") {
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("quickbot-update", {
                    detail: { botId, timestamp: pollTime, hasChanges: true },
                  })
                );
              }, 0);
            }
            return result.uiSettings;
          }

          // Dispatch no-change event in next tick
          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("quickbot-update", {
                  detail: { botId, timestamp: pollTime, hasChanges: false },
                })
              );
            }, 0);
          }
          return prev; // No change, keep previous state
        });
      } catch (err) {
        console.error(`[QuickBot] ❌ Poll error:`, err);
      }
    };

    // Poll immediately, then every 30 seconds
    // Dispatch initial poll event in next tick to avoid render issues
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("quickbot-poll", {
            detail: { botId, timestamp: Date.now() },
          })
        );
      }, 0);
    }
    pollForUpdates();
    pollInterval = setInterval(pollForUpdates, 30000);

    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };
  }, [botId, uiSettings]);

  // Get effective values from UI settings
  const effectiveTheme = uiSettings?.theme || "modern";
  const effectivePosition = uiSettings?.position || "bottom-right";

  // Show error
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
          <p className="font-semibold">Chatbot Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Always render ChatbotPreview, even when loading, so loading state is inside the bubble
  const defaultTheme = "modern";
  const defaultThemePack = getThemePack(defaultTheme);

  // Create a key based on uiSettings to force re-render when settings change
  // Include more fields to ensure re-render on any significant change
  const settingsKey = uiSettings
    ? `${uiSettings.chatbotName}-${uiSettings.showTimestamps}-${
        uiSettings.theme
      }-${uiSettings.welcomeMessage?.substring(0, 20)}-${
        uiSettings.autoOpenDelayMs
      }`
    : "loading";

  return (
    <div className="relative z-9999">
      <ChatbotPreview
        key={settingsKey}
        botId={botId}
        isLoading={loading || !uiSettings}
        position={effectivePosition}
        error={error}
        theme={effectiveTheme}
        uiSettings={
          uiSettings || {
            theme: defaultTheme,
            chatbotName: "",
            welcomeMessage: "",
            quickQuestions: [],
            supportInfo: null,
            position: "bottom-right",
            autoOpenDelayMs: 0,
            autoGreetOnOpen: false,
            askEmailBeforeChat: false,
            persistChat: true,
            showTimestamps: true,
            themePack: defaultThemePack,
          }
        }
      />
    </div>
  );
}
