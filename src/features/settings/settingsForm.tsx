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
import { Textarea } from "@/components/ui/textarea";

import { botSettingsSchema, type BotSettingsType } from "./settingsSchema";
import { useTransition } from "react";
import { toast } from "sonner";
import { useBotData, useBotSettings } from "@/components/bot-context";
import { handleBotSettingsUpdate } from "./settingsActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SaveTriggerUI from "@/components/SaveTriggerUI";

export default function BotSettingsForm() {
  const { settings, setSettings } = useBotSettings();

  // user's saved settings
  const fetchedSettings = settings as BotSettingsType;

  // initialize the form and the validator
  const form = useForm<BotSettingsType>({
    resolver: zodResolver(botSettingsSchema) as Resolver<BotSettingsType>,
    defaultValues: fetchedSettings,
  });

  // reset the form on changes and set the latest values and also reset isDirty to latest test
  useEffect(() => {
    if (settings) form.reset(settings);
  }, [settings, form]);

  // form states isDirty -> checks the existing settings with current and isSubmitting -> persisting loader
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
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Runtime Bot Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure your bot&apos;s business information, product details, and
            operational settings.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            {/* Business Information Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Business Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Business Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your company name"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        The name of your business.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Business Type *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., SaaS, E-commerce, Agency"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Category or type of your business.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="business_description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Business Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business and what it does..."
                        className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      A brief overview of your business operations and services.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Information Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Product Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Product Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your product name"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        The name of your main product or service.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targeted_audience"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Targeted Audience
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Small businesses, Enterprises"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Who your product is designed for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="product_description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Product Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product features and benefits..."
                        className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Detailed description of your product and its capabilities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Strategic Information Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Strategic Information
              </h3>
              <FormField
                control={form.control}
                name="mission"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Mission
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is your mission or purpose?"
                        className="min-h-[80px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Your company&apos;s mission statement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thesis"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Thesis
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is your core business thesis or philosophy?"
                        className="min-h-[80px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Your fundamental belief or principle.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Goals
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What are your short and long-term goals?"
                        className="min-h-[80px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Your business objectives and targets.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact & Configuration Section */}
            <div className="space-y-6 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Contact & Configuration
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="support_email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Support Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="support@example.com"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Email address for customer support inquiries.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacts"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Contacts
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact information (phone, address, etc.)"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Additional contact details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="supported_languages"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Supported Languages *
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const currentLanguages = field.value || ["en"];
                          if (currentLanguages.includes(value)) {
                            field.onChange(
                              currentLanguages.filter((lang) => lang !== value)
                            );
                          } else {
                            field.onChange([...currentLanguages, value]);
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                          <SelectValue placeholder="Select languages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      Selected: {field.value?.join(", ") || "None"}
                    </div>
                    <FormDescription className="text-xs text-muted-foreground">
                      Languages your bot will support (minimum one required).
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
        phrase="Runtime Settings"
      />
    </div>
  );
}
