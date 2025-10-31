"use client";

import type React from "react";
import { useRef, useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Mail, ExternalLink, Zap, Clock } from "lucide-react";

import "./chatbot-styles.css";

interface ChatInterfaceProps {
  botId?: string;
  botName?: string;
  companyName?: string;
  customApiEndpoint?: string;
}
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

export default function ChatInterface({
  botId,
  botName = "Talka",
}: // companyName = "Company Name",
ChatInterfaceProps) {
  const currentBotId = botId;

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: `/api/bot/${currentBotId}/message`,
      headers: {
        "Content-Type": "application/json",
        "x-bot-auth": `${process.env.NEXT_PUBLIC_CHATBOT_API_KEY!}`,
      },

      onError: (error) => {
        console.error("Chat error:", error);
      },
      onFinish: (message) => {
        console.log("Message finished:", message);
      },
    });

  console.log(messages);
  // const [isConnected, setIsConnected] = useState(false);
  // const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab] = useState("messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const handleConnect = async () => {
  //   setIsConnecting(true);
  //   try {
  //     // Optional: Test connection to your API endpoint
  //     const response = await fetch(`/api/bot/${currentBotId}/message`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       setTimeout(() => {
  //         setIsConnecting(false);
  //         setIsConnected(true);
  //       }, 1000);
  //     } else {
  //       throw new Error("Connection failed");
  //     }
  //   } catch (error) {
  //     console.error("Connection error:", error);
  //     // Still connect even if health check fails
  //     setTimeout(() => {
  //       setIsConnecting(false);
  //       setIsConnected(true);
  //     }, 2000);
  //   }
  // };

  const quickQuestions = [
    "How can I check my account balance?",
    "What are the current interest rates for savings accounts or fixed deposits?",
    "How do I apply for a credit card or loan?",
    "Where can I find the nearest ATM or branch?",
    "Can you guide me through the website to find statement, downloads, offers, KYC, settings?",
  ];
  const handleQuickQuestion = (question: string) => {
    // Create a synthetic event to trigger the chat
    const syntheticEvent = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);

    // Submit after a brief delay to ensure input is updated
    setTimeout(() => {
      const form = document.createElement("form");
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(submitEvent, "target", {
        value: form,
        enumerable: true,
      });
      Object.defineProperty(submitEvent, "currentTarget", {
        value: form,
        enumerable: true,
      });

      handleSubmit(submitEvent as unknown as React.FormEvent<HTMLFormElement>);
    }, 100);
  };

  // const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setActiveTab(event.target.value);
  // };

  const MarkdownComponents: Components = useMemo(
    () => ({
      h1: ({ children }) => (
        <h1
          className={`text-base lg:text-lg mb-2 lg:mb-3 text-gray-900 dark:text-gray-100`}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className={`text-sm lg:text-base mb-1.5 lg:mb-2 text-gray-900 dark:text-gray-100`}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`text-xs lg:text-sm mb-1.5 lg:mb-2 text-gray-900 dark:text-gray-100`}
        >
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p
          className={`mb-2 lg:mb-3 last:mb-0 text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul
          className={`mb-2 lg:mb-3 space-y-1 text-sm lg:text-base text-gray-700 dark:text-gray-300`}
        >
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol
          className={`mb-2 lg:mb-3 space-y-1 text-sm lg:text-base text-gray-700 dark:text-gray-300`}
        >
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className={`text-sm lg:text-base text-gray-700 dark:text-gray-300`}>
          {children}
        </li>
      ),
      strong: ({ children }) => (
        <strong className={`text-gray-900 dark:text-gray-100`}>
          {children}
        </strong>
      ),
      em: ({ children }) => (
        <em className={`italic text-gray-700 dark:text-gray-300`}>
          {children}
        </em>
      ),
      code: ({ children, className }) => {
        const isInline = !className?.includes("language-");
        return isInline ? (
          <code
            className={`px-1.5 py-0.5 text-xs lg:text-sm font-mono text-cyan-700 dark:text-cyan-400`}
          >
            {children}
          </code>
        ) : (
          <code
            className={`block p-2 lg:p-3 text-xs lg:text-sm font-mono overflow-x-auto`}
          >
            {children}
          </code>
        );
      },
      pre: ({ children }) => (
        <pre className={`p-2 lg:p-3 mb-2 lg:mb-3 overflow-x-auto `}>
          {children}
        </pre>
      ),
      blockquote: ({ children, ...props }) => (
        <blockquote
          {...props}
          className={`border-l-4 border-cyan-500 pl-3 lg:pl-4 italic mb-2 lg:mb-3 text-sm lg:text-base text-gray-600 dark:text-gray-400 `}
        >
          {children}
        </blockquote>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline `}
        >
          {children}
        </a>
      ),
    }),
    []
  );
  // Connection Screen
  // if (!isConnected) {
  //   return (
  //     <div className="flex flex-col h-full z-[12341234]">
  //       {/* Enhanced Header */}
  //       <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
  //         <div className="flex items-center gap-2 sm:gap-3">
  //           <div className="flex -space-x-1 sm:-space-x-2">
  //             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
  //               <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
  //             </div>
  //             <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
  //               <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
  //             </div>
  //           </div>
  //           <div>
  //             <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
  //               {botName} / {companyName}
  //             </h4>
  //             <p className="text-xs italic text-gray-500 hidden sm:block">
  //               Powered by Talka AI Chatbots
  //             </p>
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-1 text-xs text-gray-400">
  //           <Shield className="w-3 h-3" />
  //           <span className="hidden sm:inline">Secure</span>
  //         </div>
  //       </div>

  //       {/* Connection Screen */}
  //       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center h-full">
  //         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
  //           <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
  //         </div>

  //         <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
  //           Welcome to {companyName} Chatbot
  //         </h3>
  //         <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-xs sm:max-w-sm px-2">
  //           Connect to our intelligent assistant for instant help and support.
  //           Bot ID:{" "}
  //           <code className="bg-gray-100 px-1 rounded text-xs">
  //             {currentBotId}
  //           </code>
  //         </p>

  //         <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 w-full max-w-xs sm:max-w-sm">
  //           <a
  //             href="#"
  //             className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
  //           >
  //             <div className="flex items-center gap-2 sm:gap-3">
  //               <Globe className="w-4 h-4 text-blue-600" />
  //               <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700">
  //                 Documentation
  //               </span>
  //             </div>
  //             <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500" />
  //           </a>

  //           <a
  //             href="#"
  //             className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
  //           >
  //             <div className="flex items-center gap-2 sm:gap-3">
  //               <Zap className="w-4 h-4 text-purple-600" />
  //               <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700">
  //                 API Setup Guide
  //               </span>
  //             </div>
  //             <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500" />
  //           </a>

  //           <Button
  //             onClick={handleConnect}
  //             disabled={isConnecting}
  //             className="w-full max-w-xs sm:max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-200"
  //           >
  //             {isConnecting ? (
  //               <div className="flex items-center gap-2">
  //                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  //                 <span className="text-sm sm:text-base">Connecting...</span>
  //               </div>
  //             ) : (
  //               <div className="flex items-center gap-2">
  //                 <Zap className="w-4 h-4" />
  //                 <span className="text-sm sm:text-base">
  //                   Connect to {botName}
  //                 </span>
  //               </div>
  //             )}
  //           </Button>
  //         </div>

  //         {error && (
  //           <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
  //             <p className="text-red-600 text-sm">
  //               Connection Error: {error.message}
  //             </p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // Main Chat Interface
  return (
    <div className="flex flex-col h-full bg-white w-full items-center justify-between">
      {/* Header */}
      <div className="flex items-center w-full gap-4 justify-between p-3 sm:p-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex -space-x-1 sm:-space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
              {botName}
            </h4>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              <span className="hidden sm:inline">
                Powered by <u>Talka AI</u>
              </span>
              <span className="sm:hidden">Online</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>24/7</span>
          </div>

          {/* <select
            value={activeTab}
            onChange={handleTabChange}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 hover:border-gray-300 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md appearance-none bg-no-repeat bg-right pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1rem 1rem",
            }}
          >
            <option value="messages">Messages</option>
            <option value="contact">Contact Us</option>
          </select> */}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 relative h-full w-full overflow-y-auto chat-scroll">
        {/* Messages Tab Content */}
        {activeTab === "messages" && (
          <div className="flex-1 flex flex-col m-0 min-h-0">
            {/* Messages */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-scroll h-full sm:space-y-4">
              {messages.length === 0 && (
                <div className="">
                  <div className="text-center sm:py-4">
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      How can I help you today?
                    </h3>
                  </div>

                  {/* Quick Questions */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 px-1 sm:px-2">
                      Quick Questions
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="text-left justify-start text-xs sm:text-sm h-auto p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 w-full">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors flex-shrink-0">
                              <span className="text-blue-600 font-semibold text-xs">
                                {index + 1}
                              </span>
                            </div>
                            <span className="flex-1 text-gray-700 group-hover:text-gray-900 text-left text-wrap">
                              {question}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {message.role === "user" ? (
                          <div className="text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {message.content}
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm  break-words ">
                            <ReactMarkdown components={MarkdownComponents}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-2 sm:p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg max-w-md">
                    <p className="text-red-600 text-sm">
                      Error: {error.message}
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Contact Tab Content */}
        {activeTab === "contact" && (
          <div className="flex-1 m-0 p-3 sm:p-4 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  Get in Touch
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Multiple ways to reach our support team
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Email Support
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Get help via email
                      </p>
                    </div>
                  </div>
                  <a
                    href="mailto:support@talka.ai"
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm break-all"
                  >
                    support@talka.ai
                  </a>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Helpful Links
                  </h4>
                  <div className="space-y-2">
                    <a
                      href="https://talka.ai/docs"
                      className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        Documentation
                      </span>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                    </a>
                    <a
                      href="https://talka.ai/status"
                      className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        System Status
                      </span>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Input Form at Bottom */}
      {activeTab === "messages" && (
        <div className="sticky w-full bottom-0 left-0 right-0 p-2 sm:p-2 border-t border-gray-100 bg-white/95 backdrop-blur-sm shadow-lg z-30">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 sm:gap-3 items-center"
          >
            <div className="flex-1">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5 px-4 text-sm sm:text-base rounded-xl border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 h-11"
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-11 w-11 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
