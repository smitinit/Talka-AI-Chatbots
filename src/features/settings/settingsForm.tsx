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

import { botSettingsSchema, type BotSettingsType } from "./settingsSchema";
import { useTransition } from "react";
import SectionHeader from "@/components/section-header";
import { toast } from "sonner";
import { useBotData, useBotSettings } from "@/components/bot-context";
import { handleBotSettingsUpdate } from "./settingsActions";

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

  // get the bot for the bot_id property
  const { bot } = useBotData();

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
      }
    });
  }

  return (
    <div className="max-w-full mx-auto ">
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
          {/* === Bot Settings Fields === */}
          <div className="space-y-6">
            <SectionHeader
              title="Bot Settings"
              subtitle="Configure your bot's behavior and capabilities."
            />

            <FormField
              control={form.control}
              name="max_tokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Tokens</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 1000"
                      {...field}
                      min={100}
                      max={4000}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of tokens the bot can generate in a single
                    response.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="top_p"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top P</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 0.9"
                      {...field}
                      step={0.01}
                      min={0}
                      max={1}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls diversity via nucleus sampling.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 0.7"
                      {...field}
                      step={0.01}
                      min={0}
                      max={2}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls randomness in responses.
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
                  <FormLabel>Stop Sequences</FormLabel>
                  <Textarea
                    placeholder="e.g. 'END', 'STOP'"
                    {...field}
                    rows={3}
                  />
                  <FormDescription>
                    Specify sequences that will stop the generation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="json_mode"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel>JSON Mode</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Enable JSON output format for responses.
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
                  <FormLabel>Focus Domains</FormLabel>
                  <Textarea
                    placeholder="e.g. 'healthcare', 'finance'"
                    {...field}
                    rows={3}
                  />
                  <FormDescription>
                    Specify domains to focus the bot&apos;s responses on.
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
    </div>
  );
}
