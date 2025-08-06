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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="space-y-2 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Bot Settings
          </h1>
          <p className="text-muted-foreground">
            Configure AI model parameters and response behavior settings.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* AI Model Parameters */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  AI Model Parameters
                </h2>
                <p className="text-muted-foreground">
                  Configure your bot&apos;s behavior and response generation.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="max_tokens"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Max Tokens
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 1000"
                          min={100}
                          max={4000}
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Maximum number of tokens the bot can generate in a
                        single response.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="top_p"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Top P
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 0.9"
                          step={0.01}
                          min={0}
                          max={1}
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
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
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Temperature
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 0.7"
                          step={0.01}
                          min={0}
                          max={2}
                          className="h-11 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Controls randomness in responses.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Advanced Settings
                </h2>
                <p className="text-muted-foreground">
                  Fine-tune response generation and output formatting.
                </p>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="stop_sequences"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Stop Sequences
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. 'END', 'STOP'"
                          rows={3}
                          className="bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Specify sequences that will stop the generation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="focus_domains"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Focus Domains
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. 'healthcare', 'finance'"
                          rows={3}
                          className="bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Specify domains to focus the bot&apos;s responses on.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="json_mode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          JSON Mode
                        </FormLabel>
                        <FormDescription className="text-sm text-muted-foreground">
                          Enable JSON output format for responses.
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
