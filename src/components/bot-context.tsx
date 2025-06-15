"use client";

import { createContext, useContext } from "react";

export interface Bot {
  id: string;
  name: string;
  description: string;
}

const BotContext = createContext<Bot | null>(null);

export function BotProvider({
  value,
  children,
}: {
  value: Bot;
  children: React.ReactNode;
}) {
  return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
}

export function useBot(): Bot {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error("useBot must be used within a <BotProvider>");
  }
  return context;
}
