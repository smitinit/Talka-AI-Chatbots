"use client";
import { useEffect, useState } from "react";
import ChatbotPreview from "./ChatbotPreview";

// ─── Types ────────────────────────────────────────────────
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

// ─── Verification ─────────────────────────────────────────
async function verifySignature(
  payload: object,
  signature: string,
  secret: string
): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payloadBytes = enc.encode(JSON.stringify(payload));
  const sigBuffer = await crypto.subtle.sign("HMAC", key, payloadBytes);
  const sigHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return sigHex === signature;
}

// ─── Component ────────────────────────────────────────────
interface ChatbotProps {
  botId: string;
  position?: "bottom-right" | "bottom-left";
  theme?: "blue" | "red" | "green";
}

export default function Chatbot({ botId, position, theme }: ChatbotProps) {
  const [config, setConfig] = useState<ChatbotConfigPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/bot/${botId}/config`
        );
        const data: ChatbotConfigResponse = await res.json();

        const valid = await verifySignature(
          data.config,
          data.signature,
          process.env.NEXT_PUBLIC_BOT_SIGNING_PUBLIC || "dev-public-secret"
        );

        if (!valid) {
          setError("Invalid chatbot configuration signature");
          console.error(
            "Signature mismatch: config may have been tampered with"
          );
          return;
        }

        setConfig(data.config);
      } catch (err) {
        console.error(err);
        setError("Failed to load chatbot");
      }
    })();
  }, [botId]);

  return (
    <div className={`relative z-9999 `}>
      <ChatbotPreview
        botId={botId}
        isLoading={!config}
        position={position}
        error={error}
        theme={theme}
      />
    </div>
  );
}
