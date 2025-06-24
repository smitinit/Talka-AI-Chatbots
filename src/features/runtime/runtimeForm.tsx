"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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
  botRuntimeSettingsSchema,
  type BotRuntimeSettingsType,
} from "./runtimeSchema";
import { useTransition } from "react";
import { toast } from "sonner";
import { useBotData, useBotRuntimeSettings } from "@/components/bot-context";
import { handleBotRuntimeSettingsUpdate } from "./runtimeActions";

export default function BotRun() {
  const { runtimeSettings, setRuntimeSettings } = useBotRuntimeSettings();

  // user's saved settings
  const fetchedSettings = runtimeSettings as BotRuntimeSettingsType;

  // initialize the form and the validator
  const form = useForm<BotRuntimeSettingsType>({
    resolver: zodResolver(botRuntimeSettingsSchema),
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
    <div className="max-w-4xl mx-auto mb-8 py-10 px-4">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Bot runtime Settings
        </h1>
        <p className="text-muted-foreground">
          Manage runtime settings, operational controls, and day-to-day bot
          operations.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* === Bot Settings Fields === */}
          <FormField
            control={form.control}
            name="greeting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Greeting</FormLabel>
                <FormControl>
                  <Input placeholder="Welcome to our bot!" {...field} />
                </FormControl>
                <FormDescription>
                  The initial message users will see when they start a
                  conversation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fallback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fallback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Sorry, I didn't understand that."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Message shown when the bot cannot answer a question.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    className="input"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Current operational status of the bot.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billing_plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Plan</FormLabel>
                <FormControl>
                  <select
                    className="input"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Select the billing plan for this bot.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memory_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory Type</FormLabel>
                <FormControl>
                  <select
                    className="input"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="per-user">Per User</option>
                    <option value="global">Global</option>
                    <option value="session-only">Session Only</option>
                  </select>
                </FormControl>
                <FormDescription>
                  How the bot stores and manages conversation memory.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memory_expiration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory Expiration</FormLabel>
                <FormControl>
                  <select
                    className="input"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="session">Session</option>
                    <option value="24h">24 hours</option>
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="perm">Permanent</option>
                  </select>
                </FormControl>
                <FormDescription>
                  How long the bot should remember conversations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/avatar.png"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional. URL to the bot&apos;s avatar image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice</FormLabel>
                <FormControl>
                  <Input placeholder="en-US-Wavenet-D" {...field} />
                </FormControl>
                <FormDescription>
                  Optional. Specify the voice model for TTS.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Gender</FormLabel>
                <FormControl>
                  <select
                    className="input"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Gender for the bot&apos;s voice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice_mode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Voice Mode</FormLabel>
                  <FormDescription>
                    Enable or disable voice responses.
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Logging Enabled</FormLabel>
                  <FormDescription>
                    Store chat logs for this bot.
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Use Web Search</FormLabel>
                  <FormDescription>
                    Allow the bot to use web search for answers.
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
            name="webhook_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/webhook" {...field} />
                </FormControl>
                <FormDescription>
                  Optional. URL to send webhook events.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Optional. The website associated with this bot.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rate_limit_per_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Limit (per minute)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    placeholder="60"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of requests allowed per minute (1-1000).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </div>
  );
}
