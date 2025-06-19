"use client";

import type { BotConfigType } from "@/features/ConfigureBot/bot-config.schema";
import type { BotType } from "@/features/CreateBot/bot-create.types";
import type { BotSettingsType } from "@/features/SettingBot/bot-setting.schema";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

export interface FullBotType {
  bot: BotType;
  botConfigs: BotConfigType;
  botSettings: BotSettingsType;
}

type BotContextType = {
  bot: BotType;
  setBot: Dispatch<SetStateAction<BotType>>;

  configs: BotConfigType;
  setConfigs: Dispatch<SetStateAction<BotConfigType>>;

  settings: BotSettingsType;
  setSettings: Dispatch<SetStateAction<BotSettingsType>>;
};
const BotContext = createContext<BotContextType | null>(null);

export function BotProvider({
  initials,
  children,
}: {
  initials: FullBotType;
  children: React.ReactNode;
}) {
  const [bot, setBot] = useState(initials.bot);
  const [configs, setConfigs] = useState(initials.botConfigs);
  const [settings, setSettings] = useState(initials.botSettings);

  const values = useMemo<BotContextType>(
    () => ({ bot, setBot, configs, setConfigs, settings, setSettings }),
    [bot, configs, settings]
  );
  return <BotContext.Provider value={values}>{children}</BotContext.Provider>;
}

function useBot(): BotContextType {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error("useBot must be used within a <BotProvider>");
  return ctx;
}

export function useBotData() {
  const { bot, setBot } = useBot();
  return { bot, setBot };
}

export function useBotConfigs() {
  const { configs, setConfigs } = useBot();
  return { configs, setConfigs };
}

export function useBotSettings() {
  const { settings, setSettings } = useBot();
  return { settings, setSettings };
}
