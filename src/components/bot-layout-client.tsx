"use client";

import { useEffect, useState, useRef } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import {
  BotProvider,
  useBotConfigs,
  useBotSettings,
  useBotRuntimeSettings,
} from "@/components/bot-context";
import BotManagementDashboard from "@/components/bot-analytics";
import { TabsNavigation } from "@/components/tab-navigation";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  BotType,
  BotConfigType,
  BotSettingsType,
  BotRuntimeSettingsType,
  ApiKeyRow,
  FullBotType,
} from "@/types";

interface BotLayoutClientProps {
  botId: string;
  children: React.ReactNode;
}

type WindowWithRefetch = Window &
  Record<`refetchBot_${string}`, () => Promise<void>>;

async function fetchBotData(
  supabase: NonNullable<ReturnType<typeof useSupabase>["supabase"]>,
  user: NonNullable<ReturnType<typeof useUser>["user"]>,
  botId: string,
  allowMissingConfigs = false
): Promise<FullBotType | null> {
  const [botRes, cfgRes, setRes, runtimeRes, apiRes] = await Promise.all([
    supabase
      .from("bots")
      .select()
      .eq("bot_id", botId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("bot_configs").select().eq("bot_id", botId).maybeSingle(),
    supabase.from("bot_settings").select().eq("bot_id", botId).maybeSingle(),
    supabase
      .from("bot_runtime_settings")
      .select()
      .eq("bot_id", botId)
      .maybeSingle(),
    supabase.from("api_keys").select().eq("bot_id", botId),
  ]);

  const fetchError =
    botRes.error ||
    cfgRes.error ||
    setRes.error ||
    apiRes.error ||
    runtimeRes.error;

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Bot must exist
  if (!botRes.data) {
    throw new Error("Bot not found");
  }

  // Always return data (even if configs are missing) so we can check and redirect
  // The component will handle redirecting to onboarding if configs are missing
  return {
    bot: botRes.data as BotType,
    botConfigs: (cfgRes.data as BotConfigType) || ({} as BotConfigType),
    botSettings: (setRes.data as BotSettingsType) || ({} as BotSettingsType),
    botRuntimeSettings:
      (runtimeRes.data as BotRuntimeSettingsType) ||
      ({} as BotRuntimeSettingsType),
    api: (apiRes.data || []) as ApiKeyRow[],
  };
}

export default function BotLayoutClient({
  botId,
  children,
}: BotLayoutClientProps) {
  const { supabase, isLoaded } = useSupabase();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [fullBotData, setFullBotData] = useState<FullBotType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const lastBotIdRef = useRef<string | null>(null);
  const hasRedirectedRef = useRef(false);

  // Allow missing configs for onboarding page (new bots)
  const isOnboardingPage = pathname?.includes("/onboarding");

  useEffect(() => {
    if (!isLoaded || !supabase || !user) return;

    // Skip if we've already fetched this bot
    if (lastBotIdRef.current === botId && fullBotData) return;

    setLoading(true);
    setError(null);

    fetchBotData(supabase, user, botId, isOnboardingPage)
      .then((data) => {
        if (!data) {
          setError("Bot not found");
          setLoading(false);
          return;
        }

        // Check if onboarding is incomplete (missing configs, settings, or runtime)
        // This check applies to ALL pages except onboarding itself
        if (!isOnboardingPage) {
          // Check if configs exist and have required fields (both persona and botthesis)
          const hasConfigs =
            data.botConfigs &&
            data.botConfigs.persona !== null &&
            data.botConfigs.persona !== undefined &&
            data.botConfigs.persona !== "" &&
            data.botConfigs.botthesis !== null &&
            data.botConfigs.botthesis !== undefined &&
            data.botConfigs.botthesis !== "";

          // Check if settings exist and have required fields (both business_name and product_name)
          const hasSettings =
            data.botSettings &&
            data.botSettings.business_name !== null &&
            data.botSettings.business_name !== undefined &&
            data.botSettings.business_name !== "" &&
            data.botSettings.product_name !== null &&
            data.botSettings.product_name !== undefined &&
            data.botSettings.product_name !== "";

          // Check if runtime settings exist and have required fields
          const hasRuntime =
            data.botRuntimeSettings &&
            data.botRuntimeSettings.rate_limit_per_min !== null &&
            data.botRuntimeSettings.rate_limit_per_min !== undefined &&
            data.botRuntimeSettings.token_quota !== null &&
            data.botRuntimeSettings.token_quota !== undefined;

          // If any are missing, redirect to onboarding
          if (!hasConfigs || !hasSettings || !hasRuntime) {
            if (!hasRedirectedRef.current) {
              hasRedirectedRef.current = true;
              router.replace(`/bots/${botId}/onboarding`);
              return; // Don't set data, let the redirect handle it
            }
          }
        }

        setFullBotData(data);
        lastBotIdRef.current = botId;
        hasRedirectedRef.current = false; // Reset after successful load
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoaded, supabase, user, botId, fullBotData, isOnboardingPage, router]);

  // Expose refetch function for external use
  useEffect(() => {
    if (!isLoaded || !supabase || !user) return;

    const refetchFn = async () => {
      lastBotIdRef.current = null;
      setFullBotData(null);
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBotData(
          supabase,
          user,
          botId,
          isOnboardingPage
        );

        if (!data) {
          setError("Bot not found");
          setLoading(false);
          return;
        }

        // Check if onboarding is incomplete (missing configs, settings, or runtime)
        // This check applies to ALL pages except onboarding itself
        if (!isOnboardingPage) {
          // Check if configs exist and have required fields (both persona and botthesis)
          const hasConfigs =
            data.botConfigs &&
            data.botConfigs.persona !== null &&
            data.botConfigs.persona !== undefined &&
            data.botConfigs.persona !== "" &&
            data.botConfigs.botthesis !== null &&
            data.botConfigs.botthesis !== undefined &&
            data.botConfigs.botthesis !== "";

          // Check if settings exist and have required fields (both business_name and product_name)
          const hasSettings =
            data.botSettings &&
            data.botSettings.business_name !== null &&
            data.botSettings.business_name !== undefined &&
            data.botSettings.business_name !== "" &&
            data.botSettings.product_name !== null &&
            data.botSettings.product_name !== undefined &&
            data.botSettings.product_name !== "";

          // Check if runtime settings exist and have required fields
          const hasRuntime =
            data.botRuntimeSettings &&
            data.botRuntimeSettings.rate_limit_per_min !== null &&
            data.botRuntimeSettings.rate_limit_per_min !== undefined &&
            data.botRuntimeSettings.token_quota !== null &&
            data.botRuntimeSettings.token_quota !== undefined;

          // If any are missing, redirect to onboarding
          if (!hasConfigs || !hasSettings || !hasRuntime) {
            if (!hasRedirectedRef.current) {
              hasRedirectedRef.current = true;
              router.replace(`/bots/${botId}/onboarding`);
              return; // Don't set data, let the redirect handle it
            }
          }
        }

        setFullBotData(data);
        lastBotIdRef.current = botId;
        hasRedirectedRef.current = false; // Reset after successful load
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    (window as unknown as WindowWithRefetch)[`refetchBot_${botId}`] = refetchFn;
    return () => {
      delete (window as unknown as WindowWithRefetch)[`refetchBot_${botId}`];
    };
  }, [isLoaded, supabase, user, botId, isOnboardingPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (error || !fullBotData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">
          Error: {error || "Bot not found"}
        </div>
      </div>
    );
  }

  // Hydrate chatHistory from sessionStorage before rendering
  const storageKey = `quickbot_history_${botId}`;
  let chatHistory: Array<{
    user?: string;
    bot?: string;
    timestamp?: string;
  }> = [];

  if (typeof window !== "undefined") {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        chatHistory = JSON.parse(saved);
      }
    } catch (_) {
      // Ignore parse errors
    }
  }

  return (
    <>
      <div className=" bg-background max-w-[90rem] mx-auto">
        <BotProvider initials={{ ...fullBotData, chatHistory }}>
          <ContextUpdater botId={botId} />
          <div className="flex gap-4">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-[22rem] xl:w-[24rem] lg:shrink-0">
              <BotManagementDashboard bot={fullBotData.bot} />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col  ">
                <TabsNavigation
                  slug={botId}
                  enableMobileAnalytics
                  onOpenAnalytics={() => setIsAnalyticsOpen(true)}
                />
                <main className="flex-1 p-2">
                  <div className="max-w-7xl mx-auto">{children}</div>
                </main>
              </div>
            </div>
          </div>
          <Toaster position="bottom-right" duration={2000} richColors />
        </BotProvider>
      </div>
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Bot analytics</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-6 max-h-[80vh] overflow-y-auto">
            <BotManagementDashboard bot={fullBotData.bot} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper component to access context and update it with newly generated data
function ContextUpdater({ botId }: { botId: string }) {
  const { setConfigs } = useBotConfigs();
  const { setSettings } = useBotSettings();
  const { setRuntimeSettings } = useBotRuntimeSettings();

  useEffect(() => {
    // Check for newly generated data in sessionStorage
    if (typeof window !== "undefined") {
      const storageKey = `generated_bot_data_${botId}`;
      const storedData = sessionStorage.getItem(storageKey);

      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          if (data.bot_configs) {
            setConfigs(data.bot_configs);
          }
          if (data.bot_settings) {
            setSettings(data.bot_settings);
          }
          if (data.bot_runtime_settings) {
            setRuntimeSettings(data.bot_runtime_settings);
          }
          // Clear the stored data after using it
          sessionStorage.removeItem(storageKey);
        } catch (err) {
          console.error("Failed to parse stored bot data:", err);
          sessionStorage.removeItem(storageKey);
        }
      }
    }
  }, [botId, setConfigs, setSettings, setRuntimeSettings]);

  return null;
}
