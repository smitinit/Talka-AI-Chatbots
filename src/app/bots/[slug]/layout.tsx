import { BotProvider } from "@/components/bot-context";
import BotSidebarLayout from "@/components/slugNavigation";
import { Toaster } from "@/components/ui/sonner";
import { createServerSupabaseClient } from "@/db/supabase/client";
import { ReactNode } from "react";

export const metadata = {
  title: "Talka AI-Chatbots",
  description:
    "Talka Dashboard for managing ai powered personalized chat bots.",
};
export default async function BotsLayout({
  children,
  modal,
  params,
}: {
  children: ReactNode;
  modal: ReactNode;
  params: { slug: string };
}) {
  console.log("asdasdf");
  const client = createServerSupabaseClient();
  const bot_id = params.slug;
  console.log(bot_id);
  const { error, data } = await client
    .from("bots")
    .select()
    .eq("bot_id", bot_id);
  console.log(data);
  if (error) throw new Error(error.message);

  return (
    <BotProvider value={data && data[0]}>
      {modal}
      <>
        <BotSidebarLayout>{children}</BotSidebarLayout>
      </>
      <Toaster />
    </BotProvider>
  );
}
