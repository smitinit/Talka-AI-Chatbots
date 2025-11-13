"use client";
import { MessageCircle } from "lucide-react";

interface ConnectScreenProps {
  onConnect: () => void;
  isLoading?: boolean;
  theme?: "blue" | "red" | "green";
}

export default function ConnectScreen({
  onConnect,
  isLoading = false,
  theme = "blue",
}: ConnectScreenProps) {
  // Theme-aware background gradients for calm, elegant aesthetic
  const themeBackgrounds = {
    blue: "bg-linear-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-900/30",
    red: "bg-linear-to-br from-rose-50 via-red-50 to-pink-50 dark:from-red-950/40 dark:via-slate-900 dark:to-rose-900/30",
    green:
      "bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-green-950/40 dark:via-slate-900 dark:to-emerald-900/30",
  };

  const themeIconGradient = {
    blue: "bg-linear-to-br from-blue-500 to-blue-600",
    red: "bg-linear-to-br from-rose-500 to-red-600",
    green: "bg-linear-to-br from-emerald-500 to-green-600",
  };

  const themeButtonGradient = {
    blue: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    red: "from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800",
    green:
      "from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800",
  };

  return (
    <div className={`flex flex-col h-full w-full ${themeBackgrounds[theme]}`}>
      {/* Header */}
      <div className="px-6 pt-8 pb-4 text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 ${themeIconGradient[theme]} rounded-full flex items-center justify-center shadow-lg`}
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quick Bots
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Questions? Chat with us!
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div
                className={`absolute inset-0 bg-linear-to-r ${
                  themeButtonGradient[theme].split(" ")[0]
                } rounded-full animate-spin`}
                style={{
                  clipPath:
                    "polygon(50% 0, 100% 0, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%, 0% 0)",
                }}
              ></div>
              <div className="absolute inset-1 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center">
                <div
                  className={`w-2 h-2 ${
                    themeButtonGradient[theme].split(" ")[0]
                  } rounded-full`}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connecting...
            </p>
          </div>
        ) : (
          <div className="text-center space-y-6 w-full">
            <div className="space-y-3">
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  A
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  J
                </div>
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  S
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 align-middle"></span>
                This would take just a few seconds to connect.
              </p>
            </div>

            <button
              onClick={onConnect}
              className={`w-full px-6 py-3 bg-linear-to-r ${themeButtonGradient[theme]} text-white font-semibold rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md`}
            >
              Connect to QuickBots
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 pb-6 text-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          We take your privacy seriously.{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}
