"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Zap, MessageSquare, HelpCircle, Phone, Mic, Smile, Paperclip, } from "lucide-react";
import ConnectScreen from "./connect-screen";
const Input = React.forwardRef(({ className = "", ...props }, ref) => (_jsx("input", { ref: ref, className: `bg-transparent flex-1 focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${className}`, ...props })));
Input.displayName = "Input";
function useChatMock(botId) {
    console.log(`[ChatMock] Initialized for bot ${botId}`);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            createdAt: new Date().toISOString(),
        };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setIsLoading(true);
        setTimeout(() => {
            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `You said: **${userMsg.content}**`,
                createdAt: new Date().toISOString(),
            };
            setMessages((m) => [...m, botMsg]);
            setIsLoading(false);
        }, 800);
    };
    return { messages, input, handleSubmit, isLoading, setInput };
}
const ChatInterface = ({ botId,
// isExpanded = false,
// onExpandToggle,
 }) => {
    const { messages, input, handleSubmit, isLoading, setInput } = useChatMock(botId);
    const messagesEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const inputRef = useRef(null);
    const [activeTab, setActiveTab] = useState("message");
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const quickQuestions = [
        "How can I check my account balance?",
        "What are the current interest rates?",
        "How do I apply for a credit card?",
        "Where can I find the nearest branch?",
    ];
    const handleQuickQuestion = (q) => {
        setInput(q);
        setTimeout(() => {
            const form = document.createElement("form");
            const event = new Event("submit", { bubbles: true, cancelable: true });
            Object.defineProperty(event, "target", { value: form });
            handleSubmit(event);
        }, 50);
    };
    const handleConnect = async () => {
        setIsConnecting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsConnecting(false);
        setIsConnected(true);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && input.trim()) {
            e.preventDefault();
            const form = document.createElement("form");
            const event = new Event("submit", { bubbles: true, cancelable: true });
            Object.defineProperty(event, "target", { value: form });
            handleSubmit(event);
        }
    };
    const MarkdownComponents = useMemo(() => ({
        p: ({ children }) => (_jsx("p", { className: "mb-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed", children: children })),
        strong: ({ children }) => (_jsx("strong", { className: "text-gray-900 dark:text-white font-semibold", children: children })),
    }), []);
    const renderTabContent = () => {
        switch (activeTab) {
            case "help":
                return (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center p-6", children: [_jsx(HelpCircle, { className: "w-12 h-12 text-blue-500 mb-4 opacity-60" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "Help & Documentation" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "Check our knowledge base and FAQs for common questions" }), _jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white", children: "View Help Center" })] }));
            case "support":
                return (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center p-6", children: [_jsx(Phone, { className: "w-12 h-12 text-green-500 mb-4 opacity-60" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "Support" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "Our support team is ready to help you with any issues" }), _jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white", children: "Contact Support" })] }));
            default:
                return (_jsxs(_Fragment, { children: [messages.length === 0 && (_jsxs("div", { className: "text-center text-sm text-gray-600 dark:text-gray-400 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-semibold text-base text-gray-900 dark:text-white", children: "How can we help?" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: "Typically replies under an hour" })] }), _jsx("div", { className: "grid gap-2", children: quickQuestions.map((q, i) => (_jsx("button", { onClick: () => handleQuickQuestion(q), className: "px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-gray-600 transition-all text-xs", children: q }, i))) })] })), messages.map((msg) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: "easeOut" }, className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`, children: _jsx("div", { className: `max-w-xs px-4 py-2.5 rounded-2xl ${msg.role === "user"
                                    ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm"}`, children: msg.role === "assistant" ? (_jsx(ReactMarkdown, { components: MarkdownComponents, children: msg.content })) : (_jsx("div", { className: "text-sm", children: msg.content })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start mb-3", children: _jsx("div", { className: "bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-gray-200 dark:border-gray-700 shadow-sm", children: _jsxs("div", { className: "flex space-x-1", children: [_jsx("span", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce" }), _jsx("span", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: "0.1s" } }), _jsx("span", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce", style: { animationDelay: "0.2s" } })] }) }) })), _jsx("div", { ref: messagesEndRef })] }));
        }
    };
    if (!isConnected) {
        return _jsx(ConnectScreen, { onConnect: handleConnect, isLoading: isConnecting });
    }
    if (activeTab !== "message") {
        return (_jsxs("div", { className: "flex flex-col h-full bg-linear-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: activeTab === "help" ? "Help Center" : "Support" }), _jsx("button", { onClick: () => setActiveTab("message"), className: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors", children: "\u00D7" })] }), _jsx("div", { className: "flex-1", children: renderTabContent() }), _jsxs("div", { className: "flex gap-2 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900", children: [_jsxs("button", { onClick: () => setActiveTab("message"), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), _jsx("span", { children: "Message" })] }), _jsxs("button", { onClick: () => setActiveTab("help"), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium border border-blue-200 dark:border-blue-800", children: [_jsx(HelpCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Help" })] }), _jsxs("button", { onClick: () => setActiveTab("support"), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: "Support" })] })] })] }));
    }
    return (_jsxs("div", { className: "flex flex-col h-full bg-linear-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950", children: [_jsx("div", { className: "flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg", children: _jsx(Zap, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white text-sm", children: "Quick Bots" }), _jsxs("div", { className: "flex items-center gap-1 text-xs text-green-600 dark:text-green-400", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), "Online"] })] })] }) }), _jsx("div", { className: "flex-1 flex flex-col w-full px-4 py-4 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(56,56,56,0.4)_transparent] dark:[scrollbar-color:rgba(107,114,128,0.4)_transparent]", children: renderTabContent() }), _jsxs("div", { className: "px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900", children: [_jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors", children: [_jsx("button", { type: "button", className: "text-gray-400 hover:text-blue-500 transition-colors shrink-0", children: _jsx(Smile, { className: "w-4 h-4" }) }), _jsx("button", { type: "button", className: "text-gray-400 hover:text-blue-500 transition-colors shrink-0", children: _jsx(Paperclip, { className: "w-4 h-4" }) }), _jsx(Input, { ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Compose your message...", disabled: isLoading }), _jsx("button", { type: "button", className: "text-gray-400 hover:text-blue-500 transition-colors shrink-0", children: _jsx(Mic, { className: "w-4 h-4" }) }), _jsxs("div", { className: "text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0", children: [_jsx("span", { children: "We run on" }), _jsx("span", { className: "font-semibold text-blue-600 dark:text-blue-400", children: "Quick Bots" })] })] }), _jsxs("div", { className: "flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800", children: [_jsxs("button", { onClick: () => setActiveTab("message"), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), _jsx("span", { children: "Message" })] }), _jsxs("button", { onClick: () => setActiveTab("help"), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium", children: [_jsx(HelpCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Help" })] }), _jsxs("button", { onClick: () => setActiveTab("support"), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: "Support" })] })] })] })] }));
};
export default ChatInterface;
