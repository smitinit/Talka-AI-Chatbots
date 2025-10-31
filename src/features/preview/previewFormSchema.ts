import { z } from "zod";

export const previewSchema = z.object({
  previewMode: z.enum(["mobile", "desktop"]),
  theme: z.enum(["light", "dark", "ocean", "forest", "sunset"]),

  chatbotName: z
    .string()
    .min(1, "Chatbot name is required")
    .max(50, "Name too long"),
  chatbotDescription: z
    .string()
    .min(3, "Description required")
    .max(200, "Description too long"),
  quickQuestions: z
    .array(z.string().min(1, "Question cannot be empty"))
    .max(5, "Maximum 5 quick questions"),
  avatarUrl: z.string().url("Must be a valid URL"),
  supportInfo: z
    .string()
    .min(3, "Support info required")
    .max(100, "Support info too long"),
  blogLinks: z
    .array(z.string().url("Invalid blog link"))
    .max(3, "Maximum 3 blog links"),
  welcomeMessage: z
    .string()
    .min(3, "Welcome message required")
    .max(200, "Message too long"),
  showBranding: z.boolean(),
});

export type PreviewType = z.infer<typeof previewSchema>;
export const THEME_PRESETS = {
  light: {
    name: "Light",
    bg: "#FFFFFF",
    text: "#000000",
    accent: "#3B82F6",
  },
  dark: {
    name: "Dark",
    bg: "#1F2937",
    text: "#F3F4F6",
    accent: "#60A5FA",
  },
  ocean: {
    name: "Ocean",
    bg: "#0F172A",
    text: "#E0F2FE",
    accent: "#06B6D4",
  },
  forest: {
    name: "Forest",
    bg: "#1B4332",
    text: "#D8F3DC",
    accent: "#52B788",
  },
  sunset: {
    name: "Sunset",
    bg: "#7C2D12",
    text: "#FED7AA",
    accent: "#FB923C",
  },
};
