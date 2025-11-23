"use client";

import { Chatbot } from "@qb/quickbot";
import { usePreviewModal } from "@/contexts/preview-modal-context";

export function ConditionalChatbot({ botId }: { botId: string }) {
  const { isPreviewOpen } = usePreviewModal();

  // Hide chatbot when preview modal is open
  if (isPreviewOpen) {
    return null;
  }

  return <Chatbot botId={botId} />;
}
