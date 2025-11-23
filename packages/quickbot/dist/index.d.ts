import * as react_jsx_runtime from 'react/jsx-runtime';

interface ChatbotProps {
    botId: string;
}
/**
 * Simple Chatbot component that:
 * - Fetches signed ui_settings from SaaS backend
 * - Validates schema with Zod
 * - Verifies signature with ECDSA P-256
 * - Polls for UI settings updates every 30 seconds
 */
declare function Chatbot({ botId }: ChatbotProps): react_jsx_runtime.JSX.Element;

export { Chatbot };
