// Theme packs with predefined colors and styles for each theme type

export type ThemeType = "modern" | "classic" | "minimal" | "bubble" | "retro";

export interface ThemePack {
  backgroundColor: string;
  headerColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  buttonColor: string;
  buttonTextColor: string;
  messageBubbleColor: string;
  messageTextColor: string;
  inputBackgroundColor: string;
  inputBorderColor: string;
  shadowColor: string;
}

export const themePacks: Record<ThemeType, ThemePack> = {
  modern: {
    backgroundColor: "#FFFFFF",
    headerColor: "#1F2937",
    textColor: "#111827",
    accentColor: "#3B82F6",
    borderColor: "#E5E7EB",
    buttonColor: "#3B82F6",
    buttonTextColor: "#FFFFFF",
    messageBubbleColor: "#F3F4F6",
    messageTextColor: "#111827",
    inputBackgroundColor: "#FFFFFF",
    inputBorderColor: "#D1D5DB",
    shadowColor: "rgba(0, 0, 0, 0.1)",
  },
  classic: {
    backgroundColor: "#F9FAFB",
    headerColor: "#374151",
    textColor: "#1F2937",
    accentColor: "#6366F1",
    borderColor: "#D1D5DB",
    buttonColor: "#6366F1",
    buttonTextColor: "#FFFFFF",
    messageBubbleColor: "#E5E7EB",
    messageTextColor: "#1F2937",
    inputBackgroundColor: "#FFFFFF",
    inputBorderColor: "#9CA3AF",
    shadowColor: "rgba(0, 0, 0, 0.15)",
  },
  minimal: {
    backgroundColor: "#FFFFFF",
    headerColor: "#000000",
    textColor: "#000000",
    accentColor: "#000000",
    borderColor: "#E5E7EB",
    buttonColor: "#000000",
    buttonTextColor: "#FFFFFF",
    messageBubbleColor: "#F9FAFB",
    messageTextColor: "#000000",
    inputBackgroundColor: "#FFFFFF",
    inputBorderColor: "#E5E7EB",
    shadowColor: "rgba(0, 0, 0, 0.05)",
  },
  bubble: {
    backgroundColor: "#F0F9FF",
    headerColor: "#0EA5E9",
    textColor: "#0C4A6E",
    accentColor: "#0EA5E9",
    borderColor: "#BAE6FD",
    buttonColor: "#0EA5E9",
    buttonTextColor: "#FFFFFF",
    messageBubbleColor: "#E0F2FE",
    messageTextColor: "#0C4A6E",
    inputBackgroundColor: "#FFFFFF",
    inputBorderColor: "#7DD3FC",
    shadowColor: "rgba(14, 165, 233, 0.2)",
  },
  retro: {
    backgroundColor: "#FEF3C7",
    headerColor: "#92400E",
    textColor: "#78350F",
    accentColor: "#F59E0B",
    borderColor: "#FCD34D",
    buttonColor: "#F59E0B",
    buttonTextColor: "#FFFFFF",
    messageBubbleColor: "#FDE68A",
    messageTextColor: "#78350F",
    inputBackgroundColor: "#FFFBEB",
    inputBorderColor: "#FCD34D",
    shadowColor: "rgba(245, 158, 11, 0.3)",
  },
};

/**
 * Get theme pack by theme type
 */
export function getThemePack(theme: ThemeType): ThemePack {
  return themePacks[theme] || themePacks.modern;
}

