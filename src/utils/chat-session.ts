/**
 * Client-side chat session management utilities
 * Handles persistent chat history in sessionStorage
 */

export type LocalChat = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

/**
 * Get or create a persistent session ID for the current browser session
 * @param botId - The bot ID to create a session for
 * @returns UUID string
 */
export function getSessionId(botId: string): string {
  if (typeof window === "undefined") {
    // Server-side: return a placeholder (shouldn't happen)
    return "";
  }

  const sessionKey = `quickbot_session_${botId}`;
  let sessionId = sessionStorage.getItem(sessionKey);

  if (!sessionId) {
    // Generate new UUID
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, sessionId);
  }

  return sessionId;
}

/**
 * Load chat history from sessionStorage for a specific bot
 * @param botId - The bot ID
 * @returns Array of chat messages
 */
export function loadLocalChatHistory(botId: string): LocalChat[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storageKey = `quickbot_history_${botId}`;
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved) as LocalChat[];
      // Validate structure
      return Array.isArray(parsed)
        ? parsed.filter(
            (msg) =>
              msg &&
              typeof msg === "object" &&
              ["user", "assistant", "system"].includes(msg.role) &&
              typeof msg.content === "string"
          )
        : [];
    }
  } catch (error) {
    console.error("Failed to load local chat history:", error);
  }

  return [];
}

/**
 * Append a message to local chat history
 * @param botId - The bot ID
 * @param message - The message to append
 */
export function appendLocalChat(botId: string, message: LocalChat): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = `quickbot_history_${botId}`;
  try {
    const current = loadLocalChatHistory(botId);
    const updated = [...current, message];
    sessionStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to append local chat:", error);
  }
}

/**
 * Clear local chat history for a specific bot
 * @param botId - The bot ID
 */
export function clearLocalChat(botId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = `quickbot_history_${botId}`;
  try {
    sessionStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Failed to clear local chat:", error);
  }
}

/**
 * Get the full chat history as an array (for API requests)
 * @param botId - The bot ID
 * @returns Array of messages in format suitable for API
 */
export function getChatHistoryForAPI(botId: string): Array<{
  role: string;
  content: string;
  timestamp: string;
}> {
  return loadLocalChatHistory(botId).map((msg) => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
  }));
}

