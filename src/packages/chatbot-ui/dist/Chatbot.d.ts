export interface ChatbotConfigPayload {
    bot_id: string;
    theme: "light" | "dark";
    greeting: string;
    temperature: number;
}
export interface ChatbotConfigResponse {
    config: ChatbotConfigPayload;
    signature: string;
}
interface ChatbotProps {
    botId: string;
}
export default function Chatbot({ botId }: ChatbotProps): import("react/jsx-runtime").JSX.Element;
export {};
