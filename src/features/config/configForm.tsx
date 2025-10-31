"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { useBotConfigs, useBotData } from "@/components/bot-context";
import { botConfigSchema, type BotConfigType } from "./configSchema";
import { handleBotConfigUpdate } from "./configActions";

export default function BotConfigForm() {
  const { configs, setConfigs } = useBotConfigs();

  // user's saved configs
  const fetchedConfigs = configs as BotConfigType;
  // initialize the form and the validator
  const form = useForm<BotConfigType>({
    resolver: zodResolver(botConfigSchema),
    defaultValues: fetchedConfigs,
  });

  // reset the form on changes and set the latest values and also reset isDirty to latest test
  useEffect(() => {
    if (configs) form.reset(configs);
  }, [configs, form]);

  // form states isDirty -> checks the existing config with current and isSubmitting -> persistive loader
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
  const [isPending, startTransition] = useTransition();

  // get teh bot for the bot_id property
  const { bot } = useBotData();

  // this is for close/open of custom field
  const watchExpertise = form.watch("expertise");

  // if no bot id throw err
  if (!bot.bot_id) {
    throw new Error("Bot does not exists.");
  }

  // submit function
  function onSubmit(values: BotConfigType) {
    console.log(values);
    startTransition(async () => {
      // db call to update the configs
      const result = await handleBotConfigUpdate(bot.bot_id!, values);

      if (!result.ok) {
        toast.error(result.message);
      } else {
        const updated = result.data!;

        // update the global store
        setConfigs(updated);

        toast.success(fetchedConfigs ? "Config updated!" : "Config saved!");
      }
    });
  }
  console.log(form.formState.errors);

  return (
 
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold text-primary">Bot Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Configure your AI bot&apos;s core identity, personality, and
            design-time settings.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Identity & Basic Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  Define your bot&apos;s core identity and basic
                  characteristics.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="default_language"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Default Language
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select default language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Target Audience
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe your bot's target audience (optional)"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Personality & Character
                </h2>
                <p className="text-sm text-muted-foreground">
                  Shape your bot&apos;s personality, backstory, and core
                  characteristics.
                </p>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="persona"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Persona
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your bot's personality and character traits..."
                          className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="botthesis"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Bot Mission & Thesis
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's your bot's purpose, goal, or philosophy?"
                          className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="backstory"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Backstory
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Optional: Bot's background story..."
                            className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
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
                            placeholder="Optional: Bot's objectives and goals..."
                            className="min-h-[100px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="persona_tags"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Persona Tags
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Comma separated tags (optional)"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                          onChange={(e) => {
                            const tags = e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag.length > 0);
                            field.onChange(tags);
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Add tags to describe persona traits (e.g. helpful,
                        witty, patient)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="do_dont"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Do&apos;s & Don&apos;ts
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any specific do's and don'ts for your bot (optional)"
                            className="min-h-[80px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferred_examples"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Preferred Examples
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide example responses or behaviors (optional)"
                            className="min-h-[80px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="tone_style"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Tone Style
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                              <SelectValue placeholder="Select tone style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="friendly">Friendly</SelectItem>
                              <SelectItem value="professional">
                                Professional
                              </SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="humorous">Humorous</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="writing_style"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Writing Style
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                              <SelectValue placeholder="Select writing style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="concise">Concise</SelectItem>
                              <SelectItem value="elaborate">
                                Elaborate
                              </SelectItem>
                              <SelectItem value="technical">
                                Technical
                              </SelectItem>
                              <SelectItem value="narrative">
                                Narrative
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="response_style"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Response Style
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                              <SelectValue placeholder="Select response style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="direct">Direct</SelectItem>
                              <SelectItem value="indirect">Indirect</SelectItem>
                              <SelectItem value="balanced">Balanced</SelectItem>
                              <SelectItem value="inquisitive">
                                Inquisitive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Language & Communication
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure language preferences and communication style.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="language_preference"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Language Preference
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="output_format"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Output Format
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Markdown, Plain text, HTML (optional)"
                          className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="use_emojis"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Use Emojis
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Allow bot to use emojis in responses
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="include_citations"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Include Citations
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Add source citations to responses
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Expertise & Knowledge Domain
                </h2>
                <p className="text-sm text-muted-foreground">
                  Define your bot&apos;s area of expertise and knowledge focus.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Expertise Area
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select expertise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchExpertise === "custom" && (
                  <FormField
                    control={form.control}
                    name="customexpertise"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-foreground">
                          Custom Expertise
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe your custom expertise area"
                            className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-border">
              <Button
                type="submit"
                size="lg"
                className="px-8 h-10 font-medium"
                disabled={isPending || !isDirty || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
