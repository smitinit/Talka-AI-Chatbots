import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  BotConfigsSchema,
  BotSettingsSchema,
  BotRuntimeSchema,
} from "@/schema";
import { validateBusinessDataForGibberish } from "@/lib/utils/gibberish-detection";

export const runtime = "nodejs";

/* ---------------------------------------------
   Validation Schema
--------------------------------------------- */
const SaveConfigSchema = z.object({
  botId: z.string().min(1),
  bot_configs: z.any(),
  bot_settings: z.any(),
  bot_runtime_settings: z.any(),
  bot_ui_settings: z.any().optional(),
});

/* ---------------------------------------------
   Route Handler
--------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await req.json();
    const parsed = SaveConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const {
      botId,
      bot_configs,
      bot_settings,
      bot_runtime_settings,
      bot_ui_settings,
    } = parsed.data;

    // 2. Pre-check for gibberish in business settings before saving
    if (bot_settings) {
      const gibberishError = validateBusinessDataForGibberish({
        business_name: bot_settings.business_name,
        business_type: bot_settings.business_type,
        business_description: bot_settings.business_description,
        product_name: bot_settings.product_name,
        product_description: bot_settings.product_description,
        target_audience: bot_settings.target_audience,
        problem: bot_settings.problem,
        brand_voice: bot_settings.brand_voice,
      });

      if (gibberishError) {
        return NextResponse.json(
          {
            error: "NO_UNDERSTANDING",
            message: gibberishError,
          },
          { status: 400 }
        );
      }
    }

    // 3. Filter to only allowed fields before validation
    // This ensures we never try to insert removed fields like 'backstory'
    const allowedConfigFields = [
      "persona",
      "botthesis",
      "greetings",
      "fallback_message",
    ];
    const filteredConfigs = Object.fromEntries(
      Object.entries(bot_configs).filter(([key]) =>
        allowedConfigFields.includes(key)
      )
    );

    const allowedSettingsFields = [
      "business_name",
      "business_type",
      "business_description",
      "product_name",
      "product_description",
      "support_email",
      "contacts",
      "supported_languages",
    ];
    const filteredSettings = Object.fromEntries(
      Object.entries(bot_settings).filter(([key]) =>
        allowedSettingsFields.includes(key)
      )
    );

    const allowedRuntimeFields = [
      "rate_limit_per_min",
      "token_quota",
      "api_calls_this_month",
    ];
    const filteredRuntime = Object.fromEntries(
      Object.entries(bot_runtime_settings).filter(([key]) =>
        allowedRuntimeFields.includes(key)
      )
    );

    // 4. Validate with Zod schemas
    const configParse = BotConfigsSchema.safeParse({
      bot_id: botId,
      ...filteredConfigs,
    });
    const settingsParse = BotSettingsSchema.safeParse({
      bot_id: botId,
      ...filteredSettings,
    });
    const runtimeParse = BotRuntimeSchema.safeParse({
      bot_id: botId,
      ...filteredRuntime,
    });

    if (
      !configParse.success ||
      !settingsParse.success ||
      !runtimeParse.success
    ) {
      return NextResponse.json(
        {
          error: "Invalid configuration data",
          details: {
            config: configParse.error,
            settings: settingsParse.error,
            runtime: runtimeParse.error,
          },
        },
        { status: 400 }
      );
    }

    // 5. Prepare bot_ui_settings if provided
    let filteredUiSettings: Record<string, unknown> = {};
    if (bot_ui_settings) {
      const allowedUiFields = [
        "theme",
        "chatbot_name",
        "welcome_message",
        "quick_questions",
        "support_info",
        "position",
        "auto_open_delay_ms",
        "auto_greet_on_open",
        "ask_email_before_chat",
        "persist_chat",
        "show_timestamps",
      ];
      filteredUiSettings = Object.fromEntries(
        Object.entries(bot_ui_settings).filter(([key]) =>
          allowedUiFields.includes(key)
        )
      );

      // Ensure quick_questions is an array with max 5 items
      if (filteredUiSettings.quick_questions) {
        filteredUiSettings.quick_questions = Array.isArray(
          filteredUiSettings.quick_questions
        )
          ? filteredUiSettings.quick_questions.slice(0, 5)
          : [];
      }
    }

    // 6. Upsert to database
    const upsertPromises = [
      supabaseAdmin
        .from("bot_configs")
        .upsert(configParse.data, { onConflict: "bot_id" })
        .select()
        .single(),

      supabaseAdmin
        .from("bot_settings")
        .upsert(settingsParse.data, { onConflict: "bot_id" })
        .select()
        .single(),

      supabaseAdmin
        .from("bot_runtime_settings")
        .upsert(runtimeParse.data, { onConflict: "bot_id" })
        .select()
        .single(),
    ];

    // Add UI settings upsert if provided
    if (bot_ui_settings && Object.keys(filteredUiSettings).length > 0) {
      upsertPromises.push(
        supabaseAdmin
          .from("bot_ui_settings")
          .upsert(
            {
              bot_id: botId,
              ...filteredUiSettings,
            },
            { onConflict: "bot_id" }
          )
          .select()
          .single()
      );
    }

    const results = await Promise.all(upsertPromises);
    const [configRes, settingsRes, runtimeRes, ...uiRes] = results;

    if (configRes.error || settingsRes.error || runtimeRes.error) {
      console.error("Save config errors:", {
        config: configRes.error,
        settings: settingsRes.error,
        runtime: runtimeRes.error,
      });
      return NextResponse.json(
        { error: "Failed to save configuration" },
        { status: 500 }
      );
    }

    if (uiRes.length > 0 && uiRes[0]?.error) {
      console.error("Save UI settings error:", uiRes[0].error);
      // Don't fail the whole request if UI settings fail
    }

    // 7. Return success
    return NextResponse.json({
      success: true,
      data: {
        bot_configs: configRes.data,
        bot_settings: settingsRes.data,
        bot_runtime_settings: runtimeRes.data,
        bot_ui_settings:
          uiRes.length > 0 && !uiRes[0]?.error ? uiRes[0].data : null,
      },
    });
  } catch (err) {
    console.error("SAVE CONFIG ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
