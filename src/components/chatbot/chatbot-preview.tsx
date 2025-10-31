"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import ChatInterface from "./chat-interface";

export default function ChatbotPreview() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6  flex flex-col items-end z-12341234">
      {isOpen && (
        <div className="absolute bottom-full mb-3 w-[calc(100vw-2rem)] sm:w-80 md:w-[96] lg:w-[450px] h-[calc(100vh-6rem)] sm:h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <ChatInterface botId="986dc3db-f76c-48d0-87dc-8fa53bce57f0" />
        </div>
      )}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        )}
      </Button>
    </div>
  );
}
