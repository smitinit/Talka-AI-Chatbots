import { BotProvider, type FullBotType } from "@/components/bot-context";
import BotSidebarLayout from "@/components/slugNavigation";
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
  const client = createServerSupabaseClient();

  const [botRes, cfgRes, setRes, apiRes] = await Promise.all([
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
    client.from("api_keys").select().eq("bot_id", bot_id).throwOnError(),
  ]);

  const error = botRes.error || cfgRes.error || setRes.error || apiRes.error;
  if (error) throw new Error(error.message);

  if (!botRes.data || !cfgRes.data || !setRes.data || !apiRes.data)
    throw new Error("Bot not found");

  const fullBotData: FullBotType = {
    bot: botRes.data,
    botConfigs: cfgRes.data,
    botSettings: setRes.data,
    api: apiRes.data || [],
  };

  return (
    <BotProvider initials={fullBotData}>
      {modal}
      <BotSidebarLayout>{children}</BotSidebarLayout>
      <Toaster position="top-right" duration={2000} closeButton />
    </BotProvider>
  );
}
