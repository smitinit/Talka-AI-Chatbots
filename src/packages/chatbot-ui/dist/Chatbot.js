"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ChatbotPreview from "./ChatbotPreview";
// ─── Verification ─────────────────────────────────────────
async function verifySignature(payload, signature, secret) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const payloadBytes = enc.encode(JSON.stringify(payload));
    const sigBuffer = await crypto.subtle.sign("HMAC", key, payloadBytes);
    const sigHex = Array.from(new Uint8Array(sigBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return sigHex === signature;
}
export default function Chatbot({ botId }) {
    const [config, setConfig] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/bot/${botId}/config`);
                const data = await res.json();
                const valid = await verifySignature(data.config, data.signature, process.env.NEXT_PUBLIC_BOT_SIGNING_PUBLIC || "dev-public-secret");
                if (!valid) {
                    setError("Invalid chatbot configuration signature");
                    console.error("Signature mismatch: config may have been tampered with");
                    return;
                }
                setConfig(data.config);
            }
            catch (err) {
                console.error(err);
                setError("Failed to load chatbot");
            }
        })();
    }, [botId]);
    if (error)
        return (_jsx("div", { className: "p-3 rounded-lg font-semibold bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400", children: error }));
    if (!config)
        return (_jsx(motion.div, { animate: { opacity: [1, 0.5, 1] }, transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
            }, className: "p-4 text-center text-gray-600 dark:text-gray-400 text-sm", children: "Loading chatbot..." }));
    return (_jsx("div", { className: `fixed z-9999 ${config.theme ?? "light"}`, children: _jsx(ChatbotPreview, { botId: botId }) }));
}
