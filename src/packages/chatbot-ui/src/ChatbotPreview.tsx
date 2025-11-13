"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import ChatInterface from "./ChatInterface";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatbotPreviewProps {
  botId: string;
  position?: "bottom-right" | "bottom-left";
  isLoading: boolean;
  error?: string;
  theme?: "blue" | "red" | "green";
}

const themeGradients: Record<string, string> = {
  blue: "bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
  red: "bg-linear-to-br from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800",
  green:
    "bg-linear-to-br from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800",
};

const themeHeaderGradients: Record<string, string> = {
  blue: "bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600",
  red: "bg-linear-to-r from-rose-600 to-red-500 dark:from-red-700 dark:to-red-600",
  green:
    "bg-linear-to-r from-emerald-600 to-green-500 dark:from-green-700 dark:to-green-600",
};
const themeBorders = {
  blue: "border-blue-600",
  red: "border-rose-600",
  green: "border-emerald-600",
};

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({
  botId,
  position = "bottom-right",
  isLoading,
  error,
  theme = "blue",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const posClass =
    position === "bottom-right"
      ? "right-4 sm:right-6 md:right-8"
      : "left-4 sm:left-6 md:left-8";

  useEffect(() => {
    if (isExpanded && isOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [isExpanded, isOpen]);

  if (error) {
    setIsExpanded(false);
    setIsOpen(false);
    // alert(error);
  }

  return (
    <div
      className={`fixed flex flex-col items-end z-50 ${posClass} bottom-2 sm:bottom-4 md:bottom-4`}
    >
      {/* Overlay for expanded chat */}
      {isExpanded && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 bg-black/40 z-40 dark:bg-black/60"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Expanded Chat Window */}
      {isExpanded && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed inset-4 sm:inset-6 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[550px] md:h-[750px] lg:w-[600px] lg:h-[800px] max-w-[calc(100vw-2rem)] 
                     max-h-[calc(100vh-2rem)] z-50 flex flex-col rounded-3xl border border-gray-200 
                     dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
        >
          <div
            className={`${themeHeaderGradients[theme]} flex items-center justify-between px-4 py-4 shadow-lg`}
          >
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Powered by QuickBots
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
          <ChatInterface botId={botId} theme={theme} />
        </motion.div>
      )}

      {/* Compact Chat Window */}
      {isOpen && !isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className={cn(
            "absolute bottom-full mb-4 w-[400px] sm:w-[400px] md:w-[400px] h-[60vh] sm:h-[68vh] md:h-[75vh] lg:h-[80vh] xl:h-[82vh] max-h-[90vh] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] transition-shadow duration-300 flex flex-col",
            position === "bottom-right"
              ? "right-0 translate-x-0 md:translate-x-0"
              : "left-0 translate-x-0"
          )}
        >
          <div
            className={`${themeHeaderGradients[theme]} flex items-center justify-between px-4 py-3 shadow-md`}
          >
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Powered by QuickBots
            </h3>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface botId={botId} theme={theme} />
          </div>
        </motion.div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full
              ${themeGradients[theme]}
              shadow-lg hover:shadow-xl transition-all duration-300
              transform hover:scale-110 active:scale-95
              flex items-center justify-center
              backdrop-blur-sm overflow-hidden
              border-2 ${themeBorders[theme]}`}
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
