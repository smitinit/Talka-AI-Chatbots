import type React from "react";
import { BotProvider, type FullBotType } from "@/components/bot-context";
import BotManagementDashboard from "@/components/bot-analytics";
import { TabsNavigation } from "@/components/tab-navigation";
import { Toaster } from "@/components/ui/sonner";
import { createServerSupabaseClient } from "@/db/supabase/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BotsLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BotsLayoutProps): Promise<Metadata> {
  const client = createServerSupabaseClient();
  const { data: bot } = await client
    .from("bots")
    .select("name")
    .eq("bot_id", (await params).slug)
    .maybeSingle();

  return {
    title: bot
      ? `${bot.name[0].toUpperCase() + bot.name.slice(1)} · Talka`
      : "Bot · Talka",
    description: bot
      ? `Dashboard and configuration for ${bot.name}.`
      : "AI chatbot dashboard",
  };
}

/* ------------------------------------------------------ */

export default async function BotsLayout({
  children,
  modal,
  params,
}: BotsLayoutProps) {
  const bot_id = (await params).slug;
  console.log("Bot ID:", bot_id);
  const client = createServerSupabaseClient();

  const [botRes, cfgRes, setRes, runtimeRes, apiRes] = await Promise.all([
    client.from("bots").select().eq("bot_id", bot_id).maybeSingle(),
    client
      .from("bot_configs")
      .select()
      .eq("bot_id", bot_id)
      .maybeSingle()
      .throwOnError(),
    client
      .from("bot_settings")
      .select()
      .eq("bot_id", bot_id)
      .maybeSingle()
      .throwOnError(),
    client
      .from("bot_runtime_settings")
      .select()
      .eq("bot_id", bot_id)
      .maybeSingle()
      .throwOnError(),
    client.from("api_keys").select().eq("bot_id", bot_id).throwOnError(),
  ]);

  const error =
    botRes.error ||
    cfgRes.error ||
    setRes.error ||
    apiRes.error ||
    runtimeRes.error;
  if (error) throw new Error(error.message);

  if (
    !botRes.data ||
    !cfgRes.data ||
    !setRes.data ||
    !apiRes.data ||
    !runtimeRes.data
  )
    throw new Error("Bot not found");

  const fullBotData: FullBotType = {
    bot: botRes.data,
    botConfigs: cfgRes.data,
    botSettings: setRes.data,
    botRuntimeSettings: runtimeRes.data,
    api: apiRes.data || [],
  };

  return (
    <>
      <div className=" bg-background max-w-[90rem] mx-auto">
        <BotProvider initials={fullBotData}>
          <div className="flex">
            {/* Sidebar */}
            <BotManagementDashboard bot={botRes.data} />

            {/* Main Content */}
            <div className="flex-1 space-y-6 ">
              <div className="flex flex-col  ">
                <TabsNavigation slug={bot_id} />
                <main className="flex-1 p-2">
                  <div className="max-w-7xl mx-auto">{children}</div>
                </main>
              </div>
            </div>
          </div>
          <Toaster position="bottom-right" duration={2000} closeButton />
        </BotProvider>
        {modal}
      </div>
    </>
  );
}
