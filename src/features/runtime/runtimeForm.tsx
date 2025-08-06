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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="space-y-2 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Bot Runtime Settings
          </h1>
          <p className="text-muted-foreground">
            Manage runtime settings, operational controls, and day-to-day bot
            operations.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Settings Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="greeting"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Greeting
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Welcome to our bot!"
                        className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
                      The initial message users will see when they start a
                      conversation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
                      Current operational status of the bot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fallback Message */}
            <FormField
              control={form.control}
              name="fallback"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Fallback Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Sorry, I didn't understand that."
                      className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    Message shown when the bot cannot answer a question.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Configuration Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="billing_plan"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Billing Plan
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
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
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Memory Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                          <SelectValue placeholder="Select memory type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per-user">Per User</SelectItem>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="session-only">
                            Session Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
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
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Memory Expiration
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                          <SelectValue placeholder="Select expiration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="session">Session</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                          <SelectItem value="perm">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
                      How long the bot should remember conversations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Voice & Media Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Voice & Media Settings
              </h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Avatar URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/avatar.png"
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Voice Model
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="en-US-Wavenet-D"
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Voice Gender
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Gender for the bot&apos;s voice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Integration Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Integration Settings
              </h3>
              <div className="grid gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="webhook_url"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Webhook URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/webhook"
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Site URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Rate Limit (per minute)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={1000}
                          placeholder="60"
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Maximum number of requests allowed per minute (1-1000).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Feature Settings
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="voice_mode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Voice Mode
                        </FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Logging Enabled
                        </FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Use Web Search
                        </FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8 border-t border-border">
              <Button
                type="submit"
                size="lg"
                className="px-8 h-11 font-medium"
                disabled={isPendingUpdate || !isDirty || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
