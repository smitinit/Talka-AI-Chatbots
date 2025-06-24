"use client";

import { ApiKeyRow } from "@/features/api/apiSchema";
import type { BotConfigType } from "@/features/config/configSchema";
import type { BotType } from "@/features/create/createSchema";
import { BotRuntimeSettingsType } from "@/features/runtime/runtimeSchema";
import type { BotSettingsType } from "@/features/settings/settingsSchema";
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
  botRuntimeSettings: BotRuntimeSettingsType;
  api: ApiKeyRow[];
}

type BotContextType = {
  bot: BotType;
  setBot: Dispatch<SetStateAction<BotType>>;

  configs: BotConfigType;
  setConfigs: Dispatch<SetStateAction<BotConfigType>>;

  settings: BotSettingsType;
  setSettings: Dispatch<SetStateAction<BotSettingsType>>;

  runtimeSettings: BotRuntimeSettingsType;
  setRuntimeSettings: Dispatch<SetStateAction<BotRuntimeSettingsType>>;

  api: ApiKeyRow[];
  setApi: Dispatch<SetStateAction<ApiKeyRow[]>>;
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
  const [api, setApi] = useState<ApiKeyRow[]>(initials.api);
  const [runtimeSettings, setRuntimeSettings] = useState(
    initials.botRuntimeSettings
  );

  const values = useMemo<BotContextType>(
    () => ({
      bot,
      setBot,
      configs,
      setConfigs,
      settings,
      setSettings,
      runtimeSettings,
      setRuntimeSettings,
      api,
      setApi,
    }),
    [bot, configs, settings, api, runtimeSettings]
  );
  // console.log(
  //   "DATA ONLY",
  //   JSON.stringify(
  //     {
  //       bot: values.bot,
  //       configs: values.configs,
  //       settings: values.settings,
  //       api: values.api,
  //     },
  //     null,
  //     2
  //   )
  // );

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

export function useBotRuntimeSettings() {
  const { runtimeSettings, setRuntimeSettings } = useBot();
  return { runtimeSettings, setRuntimeSettings };
}

export function useBotApi() {
  const { api, setApi } = useBot();
  return { api, setApi };
}
