import type React from "react";
interface ChatbotPreviewProps {
    botId: string;
    position?: "bottom-right" | "bottom-left";
}
declare const ChatbotPreview: React.FC<ChatbotPreviewProps>;
export default ChatbotPreview;
