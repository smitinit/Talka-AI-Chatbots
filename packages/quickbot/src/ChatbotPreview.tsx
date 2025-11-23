"use client";
/* eslint-disable @next/next/no-img-element */

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ChatInterface from "./ChatInterface";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UiSettingsCamelCase } from "../lib/utils/transformers";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatbotPreviewProps {
  botId: string;
  position: "bottom-right" | "bottom-left";
  isLoading: boolean;
  error?: string | null;
  theme: "modern" | "classic" | "minimal" | "bubble" | "retro";
  uiSettings: UiSettingsCamelCase;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({
  botId,
  position,
  isLoading,
  error,
  theme,
  uiSettings,
}) => {
  // Use UI settings from server only (no prop overrides)
  const effectiveTheme = theme;
  const effectivePosition = position;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load persisted email from sessionStorage
  const emailStorageKey = `quickbot_email_${botId}`;
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(emailStorageKey);
        if (saved) {
          return saved;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return null;
  });

  // Wrapper to persist email when it's set
  const handleSetUserEmail = (
    email: string | null | ((prev: string | null) => string | null)
  ) => {
    setUserEmail((prev) => {
      const newEmail = typeof email === "function" ? email(prev) : email;
      // Save to sessionStorage when email is set
      if (typeof window !== "undefined") {
        try {
          if (newEmail) {
            sessionStorage.setItem(emailStorageKey, newEmail);
          } else {
            sessionStorage.removeItem(emailStorageKey);
          }
        } catch {
          // Ignore storage errors
        }
      }
      return newEmail;
    });
  };

  // Chat messages state - ChatInterface will handle sessionStorage internally
  const [chatMessages, setChatMessages] = useState<
    Array<{
      role: string;
      content: string;
      id?: string;
      files?: Array<{ name: string; type: string; url?: string }>;
      timestamp?: string;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatIsStreaming, setChatIsStreaming] = useState(false);
  const [chatError, setChatError] = useState<Error | null>(null);
  const [chatShowGreeting, setChatShowGreeting] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Check screen size for desktop sizing
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1600);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-open with delay (only once on mount)
  useEffect(() => {
    if (uiSettings.autoOpenDelayMs > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Always show greeting when opening
        setChatShowGreeting(true);
      }, uiSettings.autoOpenDelayMs);
      return () => clearTimeout(timer);
    }
  }, [uiSettings.autoOpenDelayMs]); // Only depend on settings, not isOpen

  // Always show greeting when manually opening chat
  useEffect(() => {
    if (isOpen && !chatShowGreeting) {
      setChatShowGreeting(true);
    }
  }, [isOpen, chatShowGreeting]);

  if (error) {
    setIsExpanded(false);
    setIsOpen(false);
  }

  // Update position class based on effective position
  const posClass =
    effectivePosition === "bottom-right"
      ? "right-4 sm:right-6 md:right-8"
      : "left-4 sm:left-6 md:left-8";

  // Always use fixed positioning for widget mode
  const containerClass = `fixed flex flex-col items-end z-50 ${posClass} bottom-2 sm:bottom-4 md:bottom-4`;

  return (
    <div className={containerClass}>
      {/* Single Resizable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className={cn(
              "absolute bottom-full mb-4 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col",
              effectivePosition === "bottom-right"
                ? "right-0 translate-x-0 md:translate-x-0"
                : "left-0 translate-x-0",
              // Responsive sizing like Crisp - laptop size (360x610) up to 1600px, larger size (400x730) for desktop screens (1600px+)
              isExpanded
                ? "w-[90vw] h-[85vh] sm:w-[500px] sm:h-[600px] md:w-[550px] md:h-[650px] lg:w-[550px] lg:h-[650px] xl:w-[550px] xl:h-[650px] 2xl:w-[550px] 2xl:h-[650px] min-[1600px]:w-[600px] min-[1600px]:h-[730px]"
                : "w-[90vw] h-[75vh] sm:w-[350px] sm:h-[500px] md:w-[360px] md:h-[610px] lg:w-[360px] lg:h-[610px] xl:w-[360px] xl:h-[610px] 2xl:w-[360px] 2xl:h-[610px] min-[1600px]:w-[400px] min-[1600px]:h-[730px]"
            )}
            style={{
              borderRadius: "18px",
              backgroundColor: "#FFFFFF",
              ...(isLargeScreen &&
                !isExpanded && {
                  width: "400px",
                  height: "730px",
                }),
              ...(isLargeScreen &&
                isExpanded && {
                  width: "600px",
                  height: "850px",
                }),
            }}
          >
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ChatInterface
                  botId={botId}
                  theme={effectiveTheme}
                  greeting={uiSettings.welcomeMessage}
                  messages={chatMessages}
                  setMessages={setChatMessages}
                  input={chatInput}
                  setInput={setChatInput}
                  isStreaming={chatIsStreaming}
                  setIsStreaming={setChatIsStreaming}
                  error={chatError}
                  setError={setChatError}
                  showGreeting={chatShowGreeting}
                  setShowGreeting={setChatShowGreeting}
                  uiSettings={uiSettings}
                  userEmail={userEmail}
                  setUserEmail={handleSetUserEmail}
                  askEmailBeforeChat={uiSettings.askEmailBeforeChat}
                  onExpand={() => setIsExpanded(true)}
                  onMinimize={() => setIsExpanded(false)}
                  isExpanded={isExpanded}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        style={{
          backgroundColor: "#005FFF",
        }}
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full
              bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
              shadow-lg hover:shadow-xl transition-all duration-300
              transform hover:scale-110 active:scale-95
              flex items-center justify-center
              backdrop-blur-sm overflow-hidden
              border-2 border-blue-600`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        ) : (
          <img
            src="https://jx3ho0f5cb.ufs.sh/f/AcnTK5Ra9jRcvTpTZ0WYR1e6Druks80ZanCxVzUXKw9tvOqM"
            alt="QB logo"
            className="absolute inset-0 w-full h-full object-cover rounded-full select-none pointer-events-none"
          />
        )}
      </button>
    </div>
  );
};

export default ChatbotPreview;
