"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

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
import SectionHeader from "@/components/section-header";
import { toast } from "sonner";

import { useBotConfigs, useBotData } from "@/components/bot-context";
import { botConfigSchema, type BotConfigType } from "./bot-config.schema";
import { handleBotConfigUpdate } from "./bot-config.action";

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
  const router = useRouter();

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

        // reload the page for stailing of the data
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto mb-8 py-10 px-4">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Bot Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure your AI bot&apos;s core identity, personality, and
          design-time settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Identity & Basic Information */}
          <div className="space-y-6">
            <SectionHeader
              title="Identity & Basic Information"
              subtitle="Define your bot's core identity and basic characteristics."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Bot Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Enter bot name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="avatar">Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        id="avatar"
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: URL to bot&apos;s avatar image
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
                    <FormLabel htmlFor="voice">Voice</FormLabel>
                    <FormControl>
                      <Input
                        id="voice"
                        placeholder="Voice identifier"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Voice configuration for TTS
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Personality & Character */}
          <div className="space-y-6">
            <SectionHeader
              title="Personality & Character"
              subtitle="Shape your bot's personality, backstory, and core characteristics."
            />

            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="persona">Persona</FormLabel>
                  <FormControl>
                    <Textarea
                      id="persona"
                      placeholder="Describe your bot's personality and character traits..."
                      className="min-h-[100px] resize-none"
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
                <FormItem>
                  <FormLabel htmlFor="thesis">Bot Mission & Thesis</FormLabel>
                  <FormControl>
                    <Textarea
                      id="thesis"
                      placeholder="What's your bot's purpose, goal, or philosophy?"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="backstory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="backstory">Backstory</FormLabel>
                    <FormControl>
                      <Textarea
                        id="backstory"
                        placeholder="Optional: Bot's background story..."
                        className="min-h-[80px] resize-none"
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
                  <FormItem>
                    <FormLabel htmlFor="goals">Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        id="goals"
                        placeholder="Optional: Bot's objectives and goals..."
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="tone_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="tone">Tone Style</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="tone">
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
                  <FormItem>
                    <FormLabel htmlFor="writing">Writing Style</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="writing">
                          <SelectValue placeholder="Select writing style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="elaborate">Elaborate</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="narrative">Narrative</SelectItem>
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
                  <FormItem>
                    <FormLabel htmlFor="response-style">
                      Response Style
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="response-style">
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

            <FormField
              control={form.control}
              name="knowledge_scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="knowledge-scope">
                    Knowledge Scope
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="knowledge-scope"
                      placeholder="Define knowledge boundaries and focus areas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Language & Communication */}
          <div className="space-y-6">
            <SectionHeader
              title="Language & Communication"
              subtitle="Configure language preferences and communication style."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="language_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="default-language">
                      Default Language
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="default-language">
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

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="use_emojis"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel htmlFor="emoji">Use Emojis</FormLabel>
                        <FormDescription>
                          Allow bot to use emojis in responses
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id="emoji"
                          aria-label="Use emojis in responses"
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
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel htmlFor="citations">
                          Include Citations
                        </FormLabel>
                        <FormDescription>
                          Add source citations to responses
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id="citations"
                          aria-label="include citations"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Greetings & Default Responses */}
          <div className="space-y-6">
            <SectionHeader
              title="Greetings & Default Responses"
              subtitle="Set up how your bot introduces itself and handles unknown queries."
            />

            <FormField
              control={form.control}
              name="greeting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="greet">Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      id="greet"
                      placeholder="How should your bot introduce itself?"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fallback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fallback">Fallback Response</FormLabel>
                  <FormControl>
                    <Textarea
                      id="fallback"
                      placeholder="What should your bot say when it doesn't know the answer?"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Expertise & Knowledge Domain */}
          <div className="space-y-6">
            <SectionHeader
              title="Expertise & Knowledge Domain"
              subtitle="Define your bot's area of expertise and knowledge focus."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="expertise">Expertise Area</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="expertise">
                          <SelectValue placeholder="Select expertise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
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
                    <FormItem>
                      <FormLabel htmlFor="custom">Custom Expertise</FormLabel>
                      <FormControl>
                        <Input
                          id="custom"
                          placeholder="Describe your custom expertise area"
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

          {/* Safety & Content Moderation */}
          <div className="space-y-6">
            <SectionHeader
              title="Safety & Content Moderation"
              subtitle="Configure safety settings and content filtering options."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="content_filter_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="filter">Content Filter Level</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="filter">
                          <SelectValue placeholder="Select filter level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custom_moderation"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="moderation">
                        Custom Moderation
                      </FormLabel>
                      <FormDescription>
                        Enable custom moderation rules
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="moderation"
                        aria-label="include custom moderation"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Memory & Data Retention */}
          <div className="space-y-6">
            <SectionHeader
              title="Memory & Data Retention"
              subtitle="Control how your bot remembers and retains conversation data."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="memory_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="memory">Memory Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="memory">
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
                    <FormDescription>
                      Fundamental to data-retention policy
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
                    <FormLabel htmlFor="memory-expiration">
                      Memory Expiration
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="memory-expiration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="session">Session Only</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                          <SelectItem value="30d">30 Days</SelectItem>
                          <SelectItem value="perm">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Changing later can be destructive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-border/50">
            <Button
              type="submit"
              className="px-8"
              disabled={isPending || !isDirty || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
