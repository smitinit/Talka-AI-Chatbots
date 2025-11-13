import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/db/supabase/supabase-admin";
import { getCachedBotProfile, setCachedBotProfile } from "@/lib/cache";

export const runtime = "nodejs";

function signPayload(payload: object, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ bot_id: string }> }
) {
  const { bot_id } = await context.params;
  console.log(`[Config] Request for bot ${bot_id}`);

  const secret = process.env.NEXT_PUBLIC_BOT_SIGNING_PUBLIC;
  if (!secret) {
    return NextResponse.json(
      { error: "BOT_CONFIG_SIGNING_SECRET missing" },
      { status: 500 }
    );
  }

  // 1 — Check cache first
  let BotProfile = await getCachedBotProfile(bot_id);

  if (!BotProfile) {
    console.log(`[DB] Fetching config/settings/runtime for bot ${bot_id}`);

    const { data: config, error: configErr } = await supabaseAdmin
      .from("bot_configs")
      .select("*")
      .eq("bot_id", bot_id)
      .maybeSingle();

    if (configErr || !config) {
      return NextResponse.json(
        { error: "Bot config not found" },
        { status: 404 }
      );
    }

    const [runtimeRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from("bot_runtime_settings")
        .select("*")
        .eq("bot_id", bot_id)
        .maybeSingle(),
      supabaseAdmin
        .from("bot_settings")
        .select("*")
        .eq("bot_id", bot_id)
        .maybeSingle(),
    ]);

    if (
      runtimeRes.error ||
      !runtimeRes.data ||
      settingsRes.error ||
      !settingsRes.data
    ) {
      return NextResponse.json(
        { error: "Incomplete bot configuration" },
        { status: 404 }
      );
    }

    BotProfile = {
      config,
      runtime_settings: runtimeRes.data,
      settings: settingsRes.data,
    };

    await setCachedBotProfile(bot_id, BotProfile);
  }

  // 2 — Create signature
  const payload = {
    bot_id,
    theme: BotProfile!.settings.theme ?? "light",
    greeting: BotProfile!.settings.greeting ?? "Hello there 👋",
    temperature: BotProfile!.settings.temperature ?? 0.7,
  };

  const signature = signPayload(payload, secret);

  // 3 — Return signed config
  return NextResponse.json({ config: payload, signature });
}
