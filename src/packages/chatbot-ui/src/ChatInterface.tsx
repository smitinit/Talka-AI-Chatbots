"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import {
  Zap,
  HelpCircle,
  Phone,
  Smile,
  Paperclip,
  MessageCircle,
  X,
} from "lucide-react";
import ConnectScreen from "./connect-screen";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`bg-transparent flex-1 focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

type ThemeType = "blue" | "red" | "green";

interface ThemeConfig {
  accent: {
    light: string;
    dark: string;
  };
  gradient: {
    light: string;
    dark: string;
  };
  button: {
    light: string;
    dark: string;
  };
  hover: {
    light: string;
    dark: string;
  };
  border: {
    light: string;
    dark: string;
  };
  typing: {
    light: string;
    dark: string;
  };
  glow: {
    light: string;
    dark: string;
  };
}

const themeConfigs: Record<ThemeType, ThemeConfig> = {
  blue: {
    accent: { light: "bg-blue-600", dark: "dark:bg-blue-500" },
    gradient: {
      light: "bg-linear-to-br from-blue-500 to-blue-700",
      dark: "dark:from-blue-600 dark:to-blue-800",
    },
    button: {
      light: "bg-blue-600 hover:bg-blue-700",
      dark: "dark:bg-blue-600 dark:hover:bg-blue-700",
    },
    hover: { light: "hover:bg-blue-50", dark: "dark:hover:bg-gray-700" },
    border: { light: "border-blue-300", dark: "dark:border-blue-600" },
    typing: { light: "bg-blue-400", dark: "dark:bg-blue-500" },
    glow: {
      light: "focus-within:ring-blue-400",
      dark: "dark:focus-within:ring-blue-500",
    },
  },
  red: {
    accent: { light: "bg-rose-600", dark: "dark:bg-red-500" },
    gradient: {
      light: "bg-linear-to-br from-rose-500 to-red-700",
      dark: "dark:from-red-600 dark:to-red-800",
    },
    button: {
      light: "bg-rose-600 hover:bg-rose-700",
      dark: "dark:bg-red-600 dark:hover:bg-rose-700",
    },
    hover: { light: "hover:bg-red-50", dark: "dark:hover:bg-gray-700" },
    border: { light: "border-red-300", dark: "dark:border-red-600" },
    typing: { light: "bg-rose-400", dark: "dark:bg-red-500" },
    glow: {
      light: "focus-within:ring-rose-400",
      dark: "dark:focus-within:ring-red-500",
    },
  },
  green: {
    accent: { light: "bg-emerald-600", dark: "dark:bg-emerald-500" },
    gradient: {
      light: "bg-linear-to-br from-emerald-500 to-green-700",
      dark: "dark:from-emerald-600 dark:to-green-800",
    },
    button: {
      light: "bg-emerald-600 hover:bg-emerald-700",
      dark: "dark:bg-emerald-600 dark:hover:bg-emerald-700",
    },
    hover: { light: "hover:bg-emerald-50", dark: "dark:hover:bg-gray-700" },
    border: { light: "border-emerald-300", dark: "dark:border-green-600" },
    typing: { light: "bg-emerald-400", dark: "dark:bg-emerald-500" },
    glow: {
      light: "focus-within:ring-emerald-400",
      dark: "dark:focus-within:ring-emerald-500",
    },
  },
};

function useChatMock(botId: string) {
  console.log(`[ChatMock] Initialized for bot ${botId}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `You said: **${userMsg.content}**`,
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, botMsg]);
      setIsLoading(false);
      inputRef.current?.focus();
    }, 800);
  };

  return { messages, input, handleSubmit, isLoading, setInput, inputRef };
}

interface ChatInterfaceProps {
  botId: string;
  theme?: ThemeType;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  botId,
  theme = "blue",
}) => {
  const themeBackgrounds = {
    blue: "bg-linear-to-b from-blue-50/40 via-sky-50/30 to-white dark:from-blue-950/20 dark:via-slate-900/50 dark:to-gray-950",
    red: "bg-linear-to-b from-rose-50/40 via-red-50/30 to-white dark:from-red-950/20 dark:via-slate-900/50 dark:to-gray-950",
    green:
      "bg-linear-to-b from-emerald-50/40 via-green-50/30 to-white dark:from-green-950/20 dark:via-slate-900/50 dark:to-gray-950",
  };

  const { messages, input, handleSubmit, isLoading, setInput, inputRef } =
    useChatMock(botId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<"message" | "help">("message");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const themeConfig = themeConfigs[theme];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeTab === "message") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [activeTab, inputRef]);

  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isConnected, inputRef]);

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

  const quickQuestions = [
    "How can I check my account balance?",
    "What are the current interest rates?",
    "How do I apply for a credit card?",
    "Where can I find the nearest branch?",
  ];

  const handleQuickQuestion = (q: string) => {
    setInput(q);
    setTimeout(() => {
      const form = document.createElement("form");
      const event = new Event("submit", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "target", { value: form });
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }, 50);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnecting(false);
    setIsConnected(true);
  };

  const MarkdownComponents = useMemo(
    () => ({
      p: ({ children }: { children?: ReactNode }) => (
        <p className="mb-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </p>
      ),
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="text-gray-900 dark:text-white font-semibold">
          {children}
        </strong>
      ),
    }),
    []
  );

  const getTabButtonClass = (tabName: "message" | "help") => {
    const isActive = activeTab === tabName;
    return isActive
      ? `flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl ${themeConfig.button.light} ${themeConfig.button.dark} text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200`
      : "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 text-sm font-medium transition-all duration-200 backdrop-blur-sm";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "help":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <HelpCircle
              className={`w-12 h-12 ${themeConfig.accent.light} opacity-60 mb-4`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Help & Documentation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Check our knowledge base and FAQs for common questions
            </p>
            <button
              className={`px-4 py-2 ${themeConfig.button.light} ${themeConfig.button.dark} text-white rounded-lg font-medium transition-colors`}
            >
              View Help Center
            </button>
          </div>
        );

        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Phone className="w-12 h-12 text-green-500 mb-4 opacity-60" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Our support team is ready to help you with any issues
            </p>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Contact Support
            </button>
          </div>
        );
      default:
        return (
          <>
            {messages.length === 0 && (
              <>
                {/* Bot's initial message */}
                <div className="flex justify-start mb-4 animate-fade-up">
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border border-gray-200/70 dark:border-gray-700/70 shadow-sm backdrop-blur-sm`}
                  >
                    <p className="text-sm font-medium mb-1">
                      How can I help you today?
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Typically replies within a few seconds.
                    </p>
                  </div>
                </div>

                {/* Suggestion buttons as if part of the chat */}
                <div className="flex justify-start mb-4 animate-fade-up">
                  <div className="max-w-xs bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-2 backdrop-blur-md shadow-sm">
                    <div className="grid gap-2">
                      {quickQuestions.slice(0, 5).map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q)}
                          className={`px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700/70 ${themeConfig.hover.light} ${themeConfig.hover.dark} transition-all duration-200 text-xs font-medium backdrop-blur-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } mb-4 animate-fade-up`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl wrap-break-word whitespace-pre-wrap transition-all duration-200 ${
                    msg.role === "user"
                      ? `${themeConfig.accent.light} ${themeConfig.accent.dark} text-white shadow-lg hover:shadow-xl`
                      : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border border-gray-200/70 dark:border-gray-700/70 shadow-sm hover:shadow-md backdrop-blur-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown components={MarkdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <div className="text-sm">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-gray-200/70 dark:border-gray-700/70 shadow-sm backdrop-blur-sm">
                  <div className="flex space-x-1">
                    <span
                      className={`w-2 h-2 ${themeConfig.typing.light} ${themeConfig.typing.dark} rounded-full animate-bounce`}
                    ></span>
                    <span
                      className={`w-2 h-2 ${themeConfig.typing.light} ${themeConfig.typing.dark} rounded-full animate-bounce`}
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className={`w-2 h-2 ${themeConfig.typing.light} ${themeConfig.typing.dark} rounded-full animate-bounce`}
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        );
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    inputRef.current?.focus();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isConnected) {
    return (
      <ConnectScreen
        onConnect={handleConnect}
        isLoading={isConnecting}
        theme={theme}
      />
    );
  }

  return (
    <div className={`flex flex-col h-full ${themeBackgrounds[theme]}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm backdrop-blur-md">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${themeConfig.gradient.light} ${themeConfig.gradient.dark} rounded-full flex items-center justify-center shadow-lg`}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Quick Bots
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex justify-around gap-2 ">
            <button
              onClick={() => setActiveTab("message")}
              className={getTabButtonClass("message")}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={getTabButtonClass("help")}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.3)_transparent] dark:[scrollbar-color:rgba(75,85,99,0.3)_transparent]">
        {renderTabContent()}
      </div>

      {/* Main Container */}
      <div className="px-4 py-3 border-t border-gray-200/50 dark:border-gray-800/50  ">
        {/* Uploaded File Preview */}
        {uploadedFile && (
          <div className="relative w-full  p-2 mb-2 rounded-xl  flex items-center gap-3 ">
            {uploadedFile.type.startsWith("image/") ? (
              <Image
                src={URL.createObjectURL(uploadedFile) || "/placeholder.svg"}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-300 dark:border-gray-600 shadow-md"
                width={64}
                height={64}
              />
            ) : (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                <div className="text-sm truncate max-w-[180px] font-medium">
                  {uploadedFile.name}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="absolute top-2 right-2 p-0.5 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-red-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className={`flex items-end gap-2 px-3 py-2 rounded-xl   border border-gray-200/60 dark:border-gray-700/60 ${themeConfig.glow.light} ${themeConfig.glow.dark}`}
        >
          {/* Left Buttons */}
          <div className="relative flex items-end gap-1 shrink-0">
            {/* File Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-md transition-all duration-200"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="application/pdf,image/*"
            />

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className=" text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-md transition-all duration-200"
            >
              <Smile className="w-4 h-4" />

              {/* Emoji Picker - anchored to button */}
            </button>
            {showEmojiPicker && (
              <div
                className="absolute bottom-full mb-3  z-50 overflow-hidden "
                ref={emojiPickerRef}
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={
                    typeof document !== "undefined" &&
                    document.documentElement.classList.contains("dark")
                      ? Theme.DARK
                      : Theme.LIGHT
                  }
                  lazyLoadEmojis
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* Textarea */}
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                e.preventDefault();
                const form = document.createElement("form");
                const event = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                Object.defineProperty(event, "target", { value: form });
                handleSubmit(
                  event as unknown as React.FormEvent<HTMLFormElement>
                );
              }
            }}
            placeholder="Type a message..."
            disabled={isLoading}
            className="border-none flex-1 mb-0.5 bg-transparent resize-none focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 overflow-y-auto leading-relaxed max-h-32 pt-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.3)_transparent] dark:[scrollbar-color:rgba(75,85,99,0.3)_transparent]"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
