"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  botRuntimeSettingsSchema,
  type BotRuntimeSettingsType,
} from "./runtimeSchema";
import { useTransition } from "react";
import { toast } from "sonner";
import { useBotData, useBotRuntimeSettings } from "@/components/bot-context";
import { handleBotRuntimeSettingsUpdate } from "./runtimeActions";
import SaveTriggerUI from "@/components/SaveTriggerUI";

export default function BotRun() {
  const { runtimeSettings, setRuntimeSettings } = useBotRuntimeSettings();

  // user's saved settings
  const fetchedSettings = runtimeSettings as BotRuntimeSettingsType;

  // initialize the form and the validator
  const form = useForm<BotRuntimeSettingsType>({
    resolver: zodResolver(
      botRuntimeSettingsSchema
    ) as Resolver<BotRuntimeSettingsType>,
    defaultValues: fetchedSettings,
  });

  // reset the form on changes and set the latest values and also reset isDirty to latest test
  useEffect(() => {
    if (runtimeSettings) form.reset(runtimeSettings);
  }, [runtimeSettings, form]);

  // form states isDirty -> checks the existing settings with current and isSubmitting -> persistive loader
  const { isDirty, isSubmitting } = form.formState;

  // warn user if there is any changes and he is closing the site
  useEffect(() => {
    const warnUser = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warnUser);
    return () => window.removeEventListener("beforeunload", warnUser);
  }, [form.formState.isDirty]);

  // hook
  const [isPendingUpdate, startUpdateTransition] = useTransition();

  // get the bot for the bot_id property
  const { bot } = useBotData();

  // if no bot id throw err
  if (!bot.bot_id) {
    throw new Error("Bot does not exists.");
  }

  // submit function
  function onSubmit(values: BotRuntimeSettingsType) {
    startUpdateTransition(async () => {
      // db call to update the settings
      const result = await handleBotRuntimeSettingsUpdate(bot.bot_id!, values);

      if (!result.ok) {
        toast.error(result.message);
      } else {
        const updated = result.data!;

        // update the global store
        setRuntimeSettings(updated);

        toast.success(
          fetchedSettings ? "Settings updated!" : "Settings saved!"
        );
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Advance Bot Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure your bot&apos;s operational parameters, feature toggles,
            and resource limits.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Feature Settings Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Feature Settings
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="voice_mode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Voice Mode
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Enable voice-based interactions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logging_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Logging Enabled
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Store and track bot conversations
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="use_web_search"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Web Search
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Allow web search for enhanced answers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Integration Settings Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Integration Settings
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="webhook_url"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Webhook URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/webhook"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        URL to send webhook events to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="site_url"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Site URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Your associated website or application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Rate Limiting Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Rate Limiting
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="rate_limit_per_min"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Rate Limit (per minute)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={1000}
                          placeholder="60"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Maximum requests per minute (1-1000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rate_limit"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Overall Rate Limit
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={1000}
                          placeholder="60"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        General rate limit for all requests (1-1000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Resource Quota Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Resource Quotas
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="token_quota"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Token Quota
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="50000"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Total tokens available for this bot
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="api_calls_this_month"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        API Calls This Month
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          disabled
                          {...field}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Current API calls used this month (read-only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Domain & Expertise Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Domain & Expertise
              </h3>
              <FormField
                control={form.control}
                name="expertise_area"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Expertise Area
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Customer Support, Technical Documentation"
                        className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Primary area of expertise for this bot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="focus_domains"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Focus Domains
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comma-separated domains (e.g., support.example.com, help.example.com)"
                        className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const domains = e.target.value
                            .split(",")
                            .map((d) => d.trim())
                            .filter((d) => d);
                          field.onChange(domains);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Domains where this bot will be active
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            {/* <div className="flex justify-end pt-4">
              <Button
                type="submit"
                size="lg"
                className="px-8 h-10 font-medium"
                disabled={isSubmitting || isPendingUpdate || !isDirty}
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div> */}
          </form>
        </Form>
      </div>
      <SaveTriggerUI
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        isPendingUpdate={isPendingUpdate}
        onSave={() => form.handleSubmit(onSubmit)()}
        phrase="Advance Settings"
      />
    </div>
  );
}
