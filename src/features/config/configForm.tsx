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
    <div className="max-w-full mx-auto  ">
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

            <FormField
              control={form.control}
              name="default_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="default-language-select">
                    Default Language
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="default-language-select">
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
                <FormItem>
                  <FormLabel htmlFor="target-audience">
                    Target Audience
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="target-audience"
                      placeholder="Describe your bot's target audience (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <FormField
              control={form.control}
              name="persona_tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="persona-tags">Persona Tags</FormLabel>
                  <FormControl>
                    <Input
                      id="persona-tags"
                      placeholder="Comma separated tags (optional)"
                      value={
                        Array.isArray(field.value) ? field.value.join(", ") : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to describe persona traits (e.g. helpful, witty,
                    patient)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="do_dont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="do-dont">
                    Do&apos;s & Don&apos;ts
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="do-dont"
                      placeholder="List any specific do's and don'ts for your bot (optional)"
                      className="min-h-[60px] resize-none"
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
                <FormItem>
                  <FormLabel htmlFor="preferred-examples">
                    Preferred Examples
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="preferred-examples"
                      placeholder="Provide example responses or behaviors (optional)"
                      className="min-h-[60px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel htmlFor="language-preference">
                      Language Preference
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="language-preference">
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
                  <FormItem>
                    <FormLabel htmlFor="output-format">Output Format</FormLabel>
                    <FormControl>
                      <Input
                        id="output-format"
                        placeholder="e.g. Markdown, Plain text, HTML (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 md:col-span-2">
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
