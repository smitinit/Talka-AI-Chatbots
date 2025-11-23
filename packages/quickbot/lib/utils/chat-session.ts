/**
 * Client-side chat session management utilities
 * Handles persistent chat history in sessionStorage with 6-hour session expiration
 */

export type LocalChat = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

export type ChatSession = {
  id: string;
  name?: string;
  createdAt: string;
  lastActivity: string;
  messages: LocalChat[];
};

const SESSION_EXPIRY_HOURS = 6;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

/**
 * Get all sessions for a bot, filtering out expired ones
 * @param botId - The bot ID
 * @returns Array of valid sessions
 */
export function getAllSessions(botId: string): ChatSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  const sessionsKey = `quickbot_sessions_${botId}`;
  try {
    const saved = localStorage.getItem(sessionsKey);
    if (saved) {
      const sessions = JSON.parse(saved) as ChatSession[];
      const now = Date.now();
      // Filter out expired sessions (older than 6 hours)
      const validSessions = sessions.filter((session) => {
        const lastActivity = new Date(session.lastActivity).getTime();
        return now - lastActivity < SESSION_EXPIRY_MS;
      });

      // Save back the filtered sessions
      if (validSessions.length !== sessions.length) {
        localStorage.setItem(sessionsKey, JSON.stringify(validSessions));
      }

      return validSessions.sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
      );
    }
  } catch (error) {
    console.error("Failed to load sessions:", error);
  }

  return [];
}

/**
 * Get or create a persistent session ID for the current browser session
 * Only creates a session if hasUserMessages is true
 * @param botId - The bot ID to create a session for
 * @param hasUserMessages - Whether the current session has user messages (default: false)
 * @returns UUID string, empty string if no session exists and hasUserMessages is false
 */
export function getSessionId(
  botId: string,
  hasUserMessages: boolean = false
): string {
  if (typeof window === "undefined") {
    return "";
  }

  const sessionKey = `quickbot_current_session_${botId}`;
  let sessionId = sessionStorage.getItem(sessionKey);

  if (!sessionId) {
    // Only create a session if there are user messages
    // Otherwise, let appendLocalChat create it when a user message is actually sent
    if (!hasUserMessages) {
      return "";
    }

    sessionId = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, sessionId);

    // Create new session in localStorage
    const now = new Date().toISOString();
    const newSession: ChatSession = {
      id: sessionId,
      createdAt: now,
      lastActivity: now,
      messages: [],
    };

    const sessions = getAllSessions(botId);
    sessions.unshift(newSession);
    localStorage.setItem(
      `quickbot_sessions_${botId}`,
      JSON.stringify(sessions)
    );
  } else {
    // Update last activity for current session
    updateSessionActivity(botId, sessionId);
  }

  return sessionId;
}

/**
 * Create a new session
 * Only creates if current session has user messages, otherwise just clears current session
 * @param botId - The bot ID
 * @returns New session ID
 */
export function createNewSession(botId: string): string {
  if (typeof window === "undefined") {
    return "";
  }

  // Check if current session has user messages before creating new one
  const currentSession = getCurrentSession(botId);
  const hasUserMessages =
    currentSession?.messages.some((msg) => msg.role === "user") || false;

  // If current session has user messages, save it before creating new one
  // Otherwise, just clear the current session without saving
  if (currentSession && !hasUserMessages) {
    // Delete empty session
    deleteSession(botId, currentSession.id);
    sessionStorage.removeItem(`quickbot_current_session_${botId}`);
  }

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(`quickbot_current_session_${botId}`, sessionId);

  const now = new Date().toISOString();
  const newSession: ChatSession = {
    id: sessionId,
    createdAt: now,
    lastActivity: now,
    messages: [],
  };

  const sessions = getAllSessions(botId);
  sessions.unshift(newSession);
  localStorage.setItem(`quickbot_sessions_${botId}`, JSON.stringify(sessions));

  return sessionId;
}

/**
 * Switch to a different session
 * @param botId - The bot ID
 * @param sessionId - The session ID to switch to
 */
export function switchToSession(botId: string, sessionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(`quickbot_current_session_${botId}`, sessionId);
  updateSessionActivity(botId, sessionId);
}

/**
 * Update session activity timestamp
 * @param botId - The bot ID
 * @param sessionId - The session ID
 */
function updateSessionActivity(botId: string, sessionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const sessions = getAllSessions(botId);
  const session = sessions.find((s) => s.id === sessionId);
  if (session) {
    session.lastActivity = new Date().toISOString();
    localStorage.setItem(
      `quickbot_sessions_${botId}`,
      JSON.stringify(sessions)
    );
  }
}

/**
 * Get current session
 * @param botId - The bot ID
 * @returns Current session or null
 */
export function getCurrentSession(botId: string): ChatSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionId = sessionStorage.getItem(`quickbot_current_session_${botId}`);
  if (!sessionId) {
    return null;
  }

  const sessions = getAllSessions(botId);
  return sessions.find((s) => s.id === sessionId) || null;
}

/**
 * Delete a session
 * @param botId - The bot ID
 * @param sessionId - The session ID to delete
 */
export function deleteSession(botId: string, sessionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const sessions = getAllSessions(botId);
    const filteredSessions = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(
      `quickbot_sessions_${botId}`,
      JSON.stringify(filteredSessions)
    );

    // If deleting current session, clear it from sessionStorage
    const currentSessionId = sessionStorage.getItem(
      `quickbot_current_session_${botId}`
    );
    if (currentSessionId === sessionId) {
      sessionStorage.removeItem(`quickbot_current_session_${botId}`);
    }
  } catch (error) {
    console.error("Failed to delete session:", error);
  }
}

/**
 * Load chat history from current session for a specific bot
 * @param botId - The bot ID
 * @returns Array of chat messages
 */
export function loadLocalChatHistory(botId: string): LocalChat[] {
  if (typeof window === "undefined") {
    return [];
  }

  const session = getCurrentSession(botId);
  if (session) {
    return session.messages.filter(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        ["user", "assistant", "system"].includes(msg.role) &&
        typeof msg.content === "string"
    );
  }

  return [];
}

/**
 * Generate session name from first few words of user message
 * @param content - The message content
 * @returns Session name (first 4 words, max 40 characters)
 */
function generateSessionName(content: string): string {
  const words = content.trim().split(/\s+/);
  const firstWords = words.slice(0, 4).join(" ");
  return firstWords.length > 40 ? firstWords.substring(0, 40) + "..." : firstWords;
}

/**
 * Append a message to local chat history
 * Creates a session if it doesn't exist and the message is from a user
 * @param botId - The bot ID
 * @param message - The message to append
 */
export function appendLocalChat(botId: string, message: LocalChat): void {
  if (typeof window === "undefined") {
    return;
  }

  let sessionId = sessionStorage.getItem(`quickbot_current_session_${botId}`);

  // If no session exists and this is a user message, create one
  if (!sessionId && message.role === "user") {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(`quickbot_current_session_${botId}`, sessionId);

    const now = new Date().toISOString();
    const sessionName = message.content.trim() 
      ? generateSessionName(message.content)
      : undefined;
    
    const newSession: ChatSession = {
      id: sessionId,
      name: sessionName,
      createdAt: now,
      lastActivity: now,
      messages: [],
    };

    const sessions = getAllSessions(botId);
    sessions.unshift(newSession);
    localStorage.setItem(
      `quickbot_sessions_${botId}`,
      JSON.stringify(sessions)
    );
  }

  if (!sessionId) {
    return;
  }

  try {
    const sessions = getAllSessions(botId);
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      // Set session name from first user message if not already set
      if (!session.name && message.role === "user" && message.content.trim()) {
        session.name = generateSessionName(message.content);
      }
      
      session.messages.push(message);
      session.lastActivity = new Date().toISOString();
      localStorage.setItem(
        `quickbot_sessions_${botId}`,
        JSON.stringify(sessions)
      );
    }
  } catch (error) {
    console.error("Failed to append local chat:", error);
  }
}

/**
 * Clear local chat history for current session
 * @param botId - The bot ID
 */
export function clearLocalChat(botId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const sessionId = sessionStorage.getItem(`quickbot_current_session_${botId}`);
  if (!sessionId) {
    return;
  }

  try {
    const sessions = getAllSessions(botId);
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.messages = [];
      session.lastActivity = new Date().toISOString();
      localStorage.setItem(
        `quickbot_sessions_${botId}`,
        JSON.stringify(sessions)
      );
    }
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
