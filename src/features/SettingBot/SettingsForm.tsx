"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { botSettingsSchema, type BotSettingsType } from "./bot-setting.schema";
import { useTransition } from "react";
import SectionHeader from "@/components/section-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBotData, useBotSettings } from "@/components/bot-context";
import { deleteBot, handleBotSettingsUpdate } from "./bot-setting.action";

export default function BotSettingsForm() {
  const { settings, setSettings } = useBotSettings();

  // user's saved settings
  const fetchedSettings = settings as BotSettingsType;

  // initialize the form and the validator
  const form = useForm<BotSettingsType>({
    resolver: zodResolver(botSettingsSchema),
    defaultValues: fetchedSettings,
  });

  // reset the form on changes and set the latest values and also reset isDirty to latest test
  useEffect(() => {
    if (settings) form.reset(settings);
  }, [settings, form]);

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
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const router = useRouter();

  // get the bot for the bot_id property
  const { bot } = useBotData();

  // this is for close/open of expert mode
  const [showExpertMode, setShowExpertMode] = useState(false);

  // if no bot id throw err
  if (!bot.bot_id) {
    throw new Error("Bot does not exists.");
  }

  // submit function
  function onSubmit(values: BotSettingsType) {
    startUpdateTransition(async () => {
      // db call to update the settings
      const result = await handleBotSettingsUpdate(bot.bot_id!, values);

      if (!result.ok) {
        toast.error(result.message);
      } else {
        const updated = result.data!;

        // update the global store
        setSettings(updated);

        toast.success(
          fetchedSettings ? "Settings updated!" : "Settings saved!"
        );

        // reload the page for stailing of the data
        router.refresh();
      }
    });
  }

  function handleDeleteBot() {
    startDeleteTransition(async () => {
      // db call to update the settings
      await deleteBot(bot.bot_id!);

      toast.error(`Bot ${bot.name} is deleted`);
    });
  }

  function handleRegenerateKeys() {
    if (
      confirm(
        "Are you sure you want to regenerate API keys? Existing keys will be invalidated."
      )
    ) {
    }
  }

  return (
    <div className="max-w-4xl mx-auto mb-8 py-10 px-4">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Bot Settings
        </h1>
        <p className="text-muted-foreground">
          Manage runtime settings, operational controls, and day-to-day bot
          operations.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Response Generation Settings */}
          <div className="space-y-6">
            <SectionHeader
              title="Response Generation"
              subtitle="Control response length, sampling, and output format."
            />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium">Expert Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Show advanced sampling parameters
                </p>
              </div>
              <Switch
                checked={showExpertMode}
                onCheckedChange={setShowExpertMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="max_tokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="max-tokens">Max Tokens</FormLabel>
                    <FormControl>
                      <Input
                        id="max-tokens"
                        type="number"
                        min={100}
                        max={4000}
                        placeholder="2048"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum response length (100-4000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stop_sequences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="stop-sequences">
                      Stop Sequences
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="stop-sequences"
                        placeholder="\\n\\n, END, STOP"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated sequences to stop generation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showExpertMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/50">
                <FormField
                  control={form.control}
                  name="top_p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="top-p">Top P</FormLabel>
                      <FormControl>
                        <Input
                          id="top-p"
                          type="number"
                          step="0.01"
                          min={0}
                          max={1}
                          placeholder="0.9"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nucleus sampling parameter (0-1)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="top_k"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="top-k">Top K</FormLabel>
                      <FormControl>
                        <Input
                          id="top-k"
                          type="number"
                          min={0}
                          placeholder="40"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Top-K sampling parameter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="json_mode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="json-mode">JSON Mode</FormLabel>
                      <FormDescription>
                        Force responses in JSON format
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="json-mode"
                        aria-label="JSON mode"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tool_use"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="tool-use">Tool Use</FormLabel>
                      <FormDescription>
                        Enable external tool integration
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="tool-use"
                        aria-label="tool use"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Search & Information Sources */}
          <div className="space-y-6">
            <SectionHeader
              title="Search & Information Sources"
              subtitle="Configure external information access and search capabilities."
            />

            <FormField
              control={form.control}
              name="use_web_search"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel htmlFor="web-search">
                      Enable Web Search
                    </FormLabel>
                    <FormDescription>
                      Allow your bot to search the web for information
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="web-search"
                      aria-label="enable web search"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="site_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="site-url">Site URL</FormLabel>
                    <FormControl>
                      <Input
                        id="site-url"
                        placeholder="https://your-documentation-site.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specific site to search or reference
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="focus_domains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="focus-domains">Focus Domains</FormLabel>
                    <FormControl>
                      <Textarea
                        id="focus-domains"
                        placeholder="example.com, docs.example.com"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of domains to focus on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Operational Controls */}
          <div className="space-y-6">
            <SectionHeader
              title="Operational Controls"
              subtitle="Runtime switches and operational settings."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="logging_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="logging">Enable Logging</FormLabel>
                      <FormDescription>
                        Log conversations for analysis and debugging
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="logging"
                        aria-label="enable logging"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voice_mode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="voice-mode">Voice Mode</FormLabel>
                      <FormDescription>
                        Enable voice input and output
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="voice-mode"
                        aria-label="voice mode"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rate_limit_per_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="rate-limit">
                    Rate Limit (per minute)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="rate-limit"
                      type="number"
                      min={1}
                      max={1000}
                      placeholder="60"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum requests per minute per user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Integration Settings */}
          <div className="space-y-6">
            <SectionHeader
              title="Integration Settings"
              subtitle="Configure external integrations and webhooks."
            />

            <FormField
              control={form.control}
              name="webhook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="webhook-url">Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-app.com/webhook"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to receive bot events and notifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-border/50">
            <Button
              type="submit"
              className="px-8"
              disabled={isPendingUpdate || !isDirty || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
      {/* Danger Zone */}
      <div className="space-y-6">
        <SectionHeader
          title="Danger Zone"
          subtitle="Irreversible actions that affect your bot."
        />

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Dangerous Actions
            </CardTitle>
            <CardDescription>
              These actions cannot be undone. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Regenerate API Keys</h4>
                <p className="text-sm text-muted-foreground">
                  Generate new API keys and invalidate existing ones
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerateKeys}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
              <div>
                <h4 className="font-medium text-destructive">Delete Bot</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this bot and all associated data
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteBot}
                className="flex items-center gap-2"
                disabled={isPendingDelete}
              >
                <Trash2 className="h-4 w-4" />
                Delete Bot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
