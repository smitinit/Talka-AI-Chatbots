"use client";

import type React from "react";

import { useRef, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import ReactMarkdown from "react-markdown";

import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";

import {
  Smile,
  Paperclip,
  File,
  ImageIcon,
  Clock,
  Maximize2,
  Minimize2,
  MoreVertical,
  Check,
  Sparkles,
  Loader2,
  Plus,
  MessageCircle,
  MessageSquare,
  Trash2,
} from "lucide-react";

// import Image from "next/image";

import TextareaAutosize from "react-textarea-autosize";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../lib/components/dropdown-menu";

import type { UiSettingsCamelCase } from "../lib/utils/transformers";

import {
  getSessionId,
  loadLocalChatHistory,
  appendLocalChat,
  clearLocalChat,
  getChatHistoryForAPI,
  getAllSessions,
  createNewSession,
  switchToSession,
  getCurrentSession,
  deleteSession,
  type ChatSession,
} from "../lib/utils/chat-session";

type ThemeType = "modern" | "classic" | "minimal" | "bubble" | "retro";

type ChatFileAttachment = {
  name: string;
  type: string;
  url?: string;
  uploading?: boolean;
  error?: boolean;
};

type ChatMessage = {
  role: string;
  content: string;
  id?: string;
  files?: ChatFileAttachment[];
  timestamp?: string;
  status?: "sending" | "sent" | "read";
};

interface ChatInterfaceProps {
  botId: string;

  theme?: ThemeType;

  greeting?: string;

  messages?: ChatMessage[];

  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;

  input?: string;

  setInput?: React.Dispatch<React.SetStateAction<string>>;

  isStreaming?: boolean;

  setIsStreaming?: React.Dispatch<React.SetStateAction<boolean>>;

  error?: Error | null;

  setError?: React.Dispatch<React.SetStateAction<Error | null>>;

  showGreeting?: boolean;

  setShowGreeting?: React.Dispatch<React.SetStateAction<boolean>>;

  uiSettings?: UiSettingsCamelCase | null;

  userEmail?: string | null;

  setUserEmail?: React.Dispatch<React.SetStateAction<string | null>>;

  askEmailBeforeChat?: boolean;

  onResetChat?: () => void;

  onExpand?: () => void;

  onMinimize?: () => void;

  isExpanded?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  botId,

  theme = "modern",

  greeting,

  messages: externalMessages,

  setMessages: externalSetMessages,

  input: externalInput,

  setInput: externalSetInput,

  isStreaming: externalIsStreaming,

  setIsStreaming: externalSetIsStreaming,

  error: externalError,

  setError: externalSetError,

  showGreeting: externalShowGreeting,

  setShowGreeting: externalSetShowGreeting,

  uiSettings,

  userEmail: externalUserEmail,

  setUserEmail: externalSetUserEmail,

  askEmailBeforeChat = false,

  onResetChat,

  onExpand,

  onMinimize,

  isExpanded = false,
}) => {
  const [internalUserEmail, setInternalUserEmail] = useState<string | null>(
    null
  );

  const [emailInput, setEmailInput] = useState("");

  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const userEmail = externalUserEmail ?? internalUserEmail;

  const setUserEmail = externalSetUserEmail ?? setInternalUserEmail;

  // Internal state fallbacks

  const [internalInput, setInternalInput] = useState("");

  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([]);

  const [internalIsStreaming, setInternalIsStreaming] = useState(false);

  const [internalError, setInternalError] = useState<Error | null>(null);

  const [internalShowGreeting, setInternalShowGreeting] = useState(true);

  // Use external or internal state

  const input = externalInput ?? internalInput;

  const setInput = externalSetInput ?? setInternalInput;

  const messages = externalMessages ?? internalMessages;

  const setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>> =
    externalSetMessages ?? setInternalMessages;

  const isStreaming = externalIsStreaming ?? internalIsStreaming;

  const setIsStreaming = externalSetIsStreaming ?? setInternalIsStreaming;

  const error = externalError ?? internalError;

  const setError = externalSetError ?? setInternalError;

  const showGreeting = externalShowGreeting ?? internalShowGreeting;

  const themeBackgrounds: Record<ThemeType, string> = {
    modern:
      "bg-linear-to-b from-blue-50/40 via-sky-50/30 to-white dark:from-blue-950/20 dark:via-slate-900/50 dark:to-gray-950",

    classic:
      "bg-linear-to-b from-indigo-50/40 via-indigo-50/30 to-white dark:from-indigo-950/20 dark:via-slate-900/50 dark:to-gray-950",

    minimal:
      "bg-linear-to-b from-gray-50/40 via-gray-50/30 to-white dark:from-gray-950/20 dark:via-gray-900/50 dark:to-gray-950",

    bubble:
      "bg-linear-to-b from-sky-50/40 via-cyan-50/30 to-white dark:from-sky-950/20 dark:via-cyan-900/50 dark:to-gray-950",

    retro:
      "bg-linear-to-b from-amber-50/40 via-orange-50/30 to-white dark:from-amber-950/20 dark:via-orange-900/50 dark:to-gray-950",
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load sessions on mount - filter out sessions with no user messages
  useEffect(() => {
    const allSessions = getAllSessions(botId);
    // Filter out sessions that have no user messages
    const validSessions = allSessions.filter((session) =>
      session.messages.some((msg) => msg.role === "user")
    );
    setSessions(validSessions);

    // Clean up empty sessions from storage
    if (validSessions.length !== allSessions.length) {
      const sessionsKey = `quickbot_sessions_${botId}`;
      localStorage.setItem(sessionsKey, JSON.stringify(validSessions));
    }
  }, [botId]);

  // Load chat history on mount

  useEffect(() => {
    const localHistory = loadLocalChatHistory(botId);

    if (localHistory.length > 0) {
      // Convert local history to message format

      const loadedMessages = localHistory.map((msg, index) => ({
        role: msg.role,

        content: msg.content,

        id: `loaded-${index}-${msg.timestamp}`,

        timestamp: msg.timestamp,
      }));

      // Only set if messages are empty (avoid overwriting external messages)

      if (messages.length === 0) {
        setMessages(loadedMessages);
      }
    }
  }, [botId, messages.length, setMessages]); // Only run on mount or when botId changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Add font size style with !important
  useEffect(() => {
    const styleId = "quickbot-font-size";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .quickbot-container,
        .quickbot-container * {
          font-size: 12.6px !important;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  // Use only allowed config fields

  const quickQuestions = uiSettings?.quickQuestions || [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      setError(
        new Error(
          "Some files were rejected. Only PDF and image files are allowed."
        )
      );
    }

    if (validFiles.length === 0) return;

    // Immediately send each file
    for (const file of validFiles) {
      await sendFileImmediately(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendFileImmediately = async (file: File) => {
    const fileId = `${Date.now()}-${file.name}`;

    // Create a message with the file showing upload status
    const userMessage = {
      role: "user",
      content: "",
      id: fileId,
      timestamp: new Date().toISOString(),
      status: "sending" as const,
      files: [
        {
          name: file.name,
          type: file.type,
          url: undefined,
          uploading: true,
        },
      ],
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get session ID - only create if there are user messages
      const hasUserMessages =
        messages.some((msg) => msg.role === "user") || true; // This is a user message being sent
      const sessionId = getSessionId(botId, hasUserMessages);
      const chatHistory = getChatHistoryForAPI(botId).filter(
        (msg) => msg.role !== "system"
      );

      // Create FormData with the file
      const formData = new FormData();
      formData.append("message", "");
      formData.append("chat_history", JSON.stringify(chatHistory));
      formData.append("file_0", file);

      const response = await fetch(`/api/chat/${botId}`, {
        method: "POST",
        headers: { "x-session-id": sessionId },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update message to show file is uploaded and status to "sent"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === fileId
            ? {
                ...msg,
                status: "sent" as const,
                files: msg.files?.map((f) => ({
                  ...f,
                  uploading: false,
                })),
              }
            : msg
        )
      );

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const assistantMessageId = (Date.now() + 1).toString();
      setIsStreaming(true);

      if (reader) {
        let accumulatedContent = "";
        let assistantMessageCreated = false;
        const assistantMessageTimestamp = new Date().toISOString();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (accumulatedContent) {
              appendLocalChat(botId, {
                role: "assistant",
                content: accumulatedContent,
                timestamp: assistantMessageTimestamp,
              });
            }
            // Update user message status to "read" when bot responds
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === fileId ? { ...msg, status: "read" as const } : msg
              )
            );
            break;
          }

          const chunk = decoder.decode(value);
          accumulatedContent += chunk;

          // Only create assistant message when we have content
          if (!assistantMessageCreated && accumulatedContent.trim()) {
            assistantMessageCreated = true;
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: accumulatedContent,
                id: assistantMessageId,
                timestamp: assistantMessageTimestamp,
              },
            ]);
          } else if (assistantMessageCreated) {
            // Update existing assistant message
            setMessages((prev) => {
              const updated = [...prev];
              const lastMessage = updated[updated.length - 1];
              if (lastMessage && lastMessage.id === assistantMessageId) {
                updated[updated.length - 1] = {
                  ...lastMessage,
                  content: accumulatedContent,
                };
              }
              return updated;
            });
          }
        }
      }

      setIsStreaming(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to upload file"));
      // Update message to show upload failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === fileId
            ? {
                ...msg,
                files: msg.files?.map((f) => ({
                  ...f,
                  uploading: false,
                  error: true,
                })),
              }
            : msg
        )
      );
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Prevent sending if already streaming
    if (isStreaming) {
      return;
    }

    // If email input is being submitted

    if (showEmailPrompt && emailInput.trim()) {
      const email = emailInput.trim();

      // Better email validation regex

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(email)) {
        setUserEmail(email);

        setEmailInput("");

        setShowEmailPrompt(false);

        // Add a system message showing the email

        setMessages((prev) => [
          ...prev,

          {
            role: "system",

            content: `You are now chatting with ${email}`,

            id: `email-${Date.now()}`,

            timestamp: new Date().toISOString(),
          },
        ]);

        return;
      } else {
        // Invalid email, show error

        setError(new Error("Please enter a valid email address"));

        return;
      }
    }

    const text = input.trim();

    if (!text) return;

    // Check if email is required after user tries to send a message

    if (askEmailBeforeChat && !userEmail && !showEmailPrompt) {
      // Show email prompt message

      setShowEmailPrompt(true);

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: "Please enter your email address to continue chatting.",

          id: `email-prompt-${Date.now()}`,

          timestamp: new Date().toISOString(),
        },
      ]);

      return;
    }

    // Don't allow sending if email is required but not provided

    if (askEmailBeforeChat && !userEmail) {
      return;
    }

    const messageText = text;

    setInput("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    const userMessage = {
      role: "user",
      content: messageText,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "sending" as const,
    };

    // Append user message to local storage

    appendLocalChat(botId, {
      role: "user",

      content: messageText,

      timestamp: userMessage.timestamp,
    });

    setMessages((prev) => [...prev, userMessage]);

    // Update status to "sent" after a brief delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" as const } : msg
        )
      );
    }, 100);

    setIsStreaming(true);

    setError(null);

    try {
      // Get session ID - only create if there are user messages
      const hasUserMessages =
        messages.some((msg) => msg.role === "user") || true; // This is a user message being sent
      const sessionId = getSessionId(botId, hasUserMessages);

      // Get chat history for API (exclude system messages and current user message)

      const chatHistory = getChatHistoryForAPI(botId).filter(
        (msg) => msg.role !== "system"
      );

      const body = JSON.stringify({
        message: messageText,
        chat_history: chatHistory,
      });

      const headers = {
        "Content-Type": "application/json",
        "x-session-id": sessionId,
      };

      const response = await fetch(`/api/chat/${botId}`, {
        method: "POST",

        headers,

        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();

      const decoder = new TextDecoder();

      const assistantMessageId = (Date.now() + 1).toString();

      const assistantMessageTimestamp = new Date().toISOString();

      if (reader) {
        let accumulatedContent = "";
        let assistantMessageCreated = false;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Stream complete - append assistant message to local storage

            if (accumulatedContent) {
              appendLocalChat(botId, {
                role: "assistant",

                content: accumulatedContent,

                timestamp: assistantMessageTimestamp,
              });
            }

            // Update user message status to "read" when bot responds
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === userMessage.id
                  ? { ...msg, status: "read" as const }
                  : msg
              )
            );

            break;
          }

          const chunk = decoder.decode(value);

          accumulatedContent += chunk;

          // Only create assistant message when we have content
          if (!assistantMessageCreated && accumulatedContent.trim()) {
            assistantMessageCreated = true;
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: accumulatedContent,
                id: assistantMessageId,
                timestamp: assistantMessageTimestamp,
              },
            ]);
          } else if (assistantMessageCreated) {
            // Update existing assistant message
            setMessages((prev) => {
              const updated = [...prev];

              const lastMessage = updated[updated.length - 1];

              if (lastMessage && lastMessage.id === assistantMessageId) {
                updated[updated.length - 1] = {
                  ...lastMessage,

                  content: accumulatedContent,
                };
              }

              return updated;
            });
          }
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to send message")
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Create new session
  const handleNewSession = () => {
    createNewSession(botId);
    clearLocalChat(botId);
    setMessages([]);
    setInput("");
    setError(null);

    // Use the correct setter (either external or internal)
    if (externalSetShowGreeting) {
      externalSetShowGreeting(true);
    } else {
      setInternalShowGreeting(true);
    }

    const allSessions = getAllSessions(botId);
    setSessions(allSessions);
    onResetChat?.();
  };

  // Switch to a different session
  const handleSwitchSession = (sessionId: string) => {
    switchToSession(botId, sessionId);
    const allSessions = getAllSessions(botId);
    setSessions(allSessions);
    const session = allSessions.find((s) => s.id === sessionId);
    if (session) {
      const loadedMessages = session.messages.map((msg, index) => ({
        role: msg.role,
        content: msg.content,
        id: `loaded-${index}-${msg.timestamp}`,
        timestamp: msg.timestamp,
      }));
      setMessages(loadedMessages);
      // Reset greeting if no messages
      if (loadedMessages.length === 0) {
        if (externalSetShowGreeting) {
          externalSetShowGreeting(true);
        } else {
          setInternalShowGreeting(true);
        }
      } else {
        if (externalSetShowGreeting) {
          externalSetShowGreeting(false);
        } else {
          setInternalShowGreeting(false);
        }
      }
    }
  };

  // Delete a session
  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent switching to the session when clicking delete
    deleteSession(botId, sessionId);
    const allSessions = getAllSessions(botId);
    setSessions(allSessions);

    // If deleting current session, clear messages and show greeting
    const currentSession = getCurrentSession(botId);
    if (!currentSession || currentSession.id === sessionId) {
      setMessages([]);
      if (externalSetShowGreeting) {
        externalSetShowGreeting(true);
      } else {
        setInternalShowGreeting(true);
      }
    }
  };

  // Format session time
  const formatSessionTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleQuickQuestion = async (q: string) => {
    // Don't hide greeting - keep it visible

    setInput(q);

    await handleSend();
  };

  const MarkdownComponents = useMemo(
    () => ({
      p: ({ children }: { children?: ReactNode }) => (
        <p className="mb-2 text-sm leading-relaxed last:mb-0">{children}</p>
      ),

      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
      ),
    }),

    []
  );

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);

    inputRef.current?.focus();

    setShowEmojiPicker(false);
  };

  const backgroundClass = themeBackgrounds[theme] || themeBackgrounds.modern;

  return (
    <div
      className={`flex flex-col h-full ${backgroundClass} quickbot-container overflow-visible`}
    >
      <div className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 border-b border-blue-400/20 shadow-md z-50 overflow-visible">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30 overflow-hidden">
              <img
                src="https://jx3ho0f5cb.ufs.sh/f/AcnTK5Ra9jRcvTpTZ0WYR1e6Druks80ZanCxVzUXKw9tvOqM"
                alt="Chatbot avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm">
                {uiSettings?.chatbotName?.trim() &&
                uiSettings.chatbotName.trim().length > 0
                  ? uiSettings.chatbotName.trim()
                  : "QuickBot Assistant"}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isExpanded && onMinimize ? (
              <button
                type="button"
                onClick={onMinimize}
                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            ) : onExpand ? (
              <button
                type="button"
                onClick={onExpand}
                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                title="Expand"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleNewSession}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
              title="New session"
            >
              <Plus className="w-4 h-4" />
            </button>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                  title="Sessions"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 max-h-[300px] overflow-y-auto !bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg"
                style={{ opacity: 1, visibility: "visible", zIndex: 9999 }}
              >
                <DropdownMenuLabel className="text-xs font-normal text-gray-500 dark:text-gray-400 px-2 py-1.5">
                  Recent sessions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                {sessions.length === 0 ? (
                  <DropdownMenuItem
                    disabled
                    className="text-xs text-gray-400 dark:text-gray-500 py-1.5"
                  >
                    No sessions yet
                  </DropdownMenuItem>
                ) : (
                  sessions.map((session) => {
                    const currentSession = getCurrentSession(botId);
                    const isActive = currentSession?.id === session.id;
                    return (
                      <DropdownMenuItem
                        key={session.id}
                        onClick={() => handleSwitchSession(session.id)}
                        className={`text-xs cursor-pointer py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isActive ? "bg-blue-50 dark:bg-blue-950" : ""
                        }`}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                              {session.name ||
                                formatSessionTime(session.lastActivity)}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                              {session.messages.length} messages •{" "}
                              {formatSessionTime(session.lastActivity)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors flex-shrink-0"
                            title="Delete session"
                          >
                            <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 !bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg"
                style={{ opacity: 1, visibility: "visible", zIndex: 9999 }}
              >
                <DropdownMenuItem className="text-xs cursor-pointer py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <MessageCircle className="w-3.5 h-3.5 mr-2" />
                  Continue on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs cursor-pointer py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  Continue on Telegram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto px-4 py-4 bg-white dark:bg-gray-50 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent] dark:[scrollbar-color:rgba(75,85,99,0.4)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/40 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-gray-500/40 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500/60`}
      >
        {/* Greeting - shown first */}
        {showGreeting && greeting && messages.length === 0 && !isStreaming && (
          <div className="space-y-4 mb-4">
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="https://jx3ho0f5cb.ufs.sh/f/AcnTK5Ra9jRcvTpTZ0WYR1e6Druks80ZanCxVzUXKw9tvOqM"
                  alt="Chatbot avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col items-start max-w-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {uiSettings?.chatbotName?.trim() &&
                    uiSettings.chatbotName.trim().length > 0
                      ? uiSettings.chatbotName.trim()
                      : "QuickBot Assistant"}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    Bot
                  </span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
                  <ReactMarkdown components={MarkdownComponents}>
                    {greeting}
                  </ReactMarkdown>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white">AI Answer</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick questions - shown below greeting */}
        {quickQuestions.length > 0 &&
          quickQuestions.some((q) => q.trim()) &&
          messages.length === 0 &&
          !isStreaming && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {quickQuestions
                .filter((q) => q.trim())
                .slice(0, 5)
                .map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q)}
                    disabled={isStreaming}
                    className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {q}
                  </button>
                ))}
            </div>
          )}

        {/* Date display */}
        {messages.length > 0 && (
          <div className="text-center mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-6">
            {messages
              .filter(
                (message) =>
                  (message.content && message.content.trim()) ||
                  (message.files && message.files.length > 0)
              )
              .map((message) => (
                <div
                  key={message.id || `msg-${Date.now()}`}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="https://jx3ho0f5cb.ufs.sh/f/AcnTK5Ra9jRcvTpTZ0WYR1e6Druks80ZanCxVzUXKw9tvOqM"
                        alt="Chatbot avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${
                      message.role === "user"
                        ? "items-end max-w-xs"
                        : "items-start max-w-md"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {uiSettings?.chatbotName?.trim() &&
                          uiSettings.chatbotName.trim().length > 0
                            ? uiSettings.chatbotName.trim()
                            : "QuickBot Assistant"}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                          Bot
                        </span>
                      </div>
                    )}
                    {/* Display files if present */}
                    {message.files && message.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {message.files.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs ${
                              message.role === "user"
                                ? file.uploading
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                  : file.error
                                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                : "bg-white/20 text-white"
                            }`}
                          >
                            {file.uploading ? null : file.type?.startsWith(
                                // <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                "image/"
                              ) ? (
                              <ImageIcon className="w-3.5 h-3.5" />
                            ) : (
                              <File className="w-3.5 h-3.5" />
                            )}
                            <span className="max-w-[120px] truncate">
                              {file.name}
                              {file.uploading && (
                                <span className="ml-1 text-[10px] opacity-70">
                                  Uploading...
                                </span>
                              )}
                              {file.error && (
                                <span className="ml-1 text-[10px] opacity-70">
                                  Failed
                                </span>
                              )}
                            </span>
                            {file.url && !file.uploading && (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                <Paperclip className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.content && message.content.trim() && (
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          message.role === "user"
                            ? "bg-white dark:bg-gray-100 text-gray-900 border border-gray-200 dark:border-gray-300"
                            : "bg-blue-600 text-white shadow-md"
                        }`}
                      >
                        <ReactMarkdown components={MarkdownComponents}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs text-white">AI Answer</span>
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {message.status === "sending" && (
                          <>
                            <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
                            <span className="text-xs text-gray-400">
                              Sending...
                            </span>
                          </>
                        )}
                        {message.status === "sent" && (
                          <>
                            <Check className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">Sent</span>
                          </>
                        )}
                        {message.status === "read" && (
                          <>
                            <Check className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">Read</span>
                          </>
                        )}
                        {!message.status && (
                          <>
                            <Check className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">Read</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* Typing indicator */}
            {isStreaming && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://jx3ho0f5cb.ufs.sh/f/AcnTK5Ra9jRcvTpTZ0WYR1e6Druks80ZanCxVzUXKw9tvOqM"
                    alt="Chatbot avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {uiSettings?.chatbotName?.trim() &&
                      uiSettings.chatbotName.trim().length > 0
                        ? uiSettings.chatbotName.trim()
                        : "QuickBot Assistant"}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      Bot
                    </span>
                  </div>
                  <div className="bg-blue-600 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-50 relative">
        {/* Email input prompt */}

        {showEmailPrompt && (
          <div className="pb-2">
            <input
              ref={emailInputRef}
              type="email"
              placeholder="your@email.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
        )}

        {/* Message composer */}

        <form
          onSubmit={handleSend}
          className="px-4 py-3 bg-white dark:bg-gray-50 relative border-t border-gray-200 dark:border-gray-700"
        >
          <div className="mb-2">
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
                  e.preventDefault();

                  handleSend();
                }
              }}
              placeholder="Compose your message..."
              minRows={1}
              maxRows={4}
              disabled={isStreaming}
              className="w-full resize-none border-0 bg-transparent py-2 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.4)_transparent] dark:[scrollbar-color:rgba(75,85,99,0.4)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/40 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-gray-500/40 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/60 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500/60"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isStreaming}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isStreaming}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <span>We run on</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-4 4v-4H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="text-blue-600 dark:text-blue-500 font-medium">
                  QuickBots
                </span>
              </div>
            </div>
          </div>

          {/* Emoji picker */}

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full right-0 mb-2 z-50 rounded-xl overflow-hidden shadow-2xl"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.AUTO} />
            </div>
          )}
        </form>

        {/* Error message */}

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 px-2 py-1 bg-red-50 dark:bg-red-950 rounded-lg">
            {error.message}
          </div>
        )}
      </div>

      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
      />
    </div>
  );
};

export default ChatInterface;
