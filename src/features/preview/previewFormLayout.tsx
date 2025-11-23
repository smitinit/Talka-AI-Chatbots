"use client";

import { startTransition, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePreviewActions } from "@/lib/client/preview";
import { previewSchema } from "@/schema";
import type { PreviewType } from "@/types";
import {
  useBotData,
  useBotConfigs,
  useBotSettings,
} from "@/components/bot-context";
import { useSupabase } from "@/providers/SupabaseProvider";
import { getThemePack } from "@/lib/themes/theme-packs";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangleIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Chatbot } from "@qb/quickbot";

interface PreviewLayoutFormProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function PreviewLayoutForm({
  onDirtyChange,
}: PreviewLayoutFormProps = {}) {
  const { bot } = useBotData();
  const { configs } = useBotConfigs();
  const { settings } = useBotSettings();
  const { isLoaded } = useSupabase();
  const { getPreview, updatePreview } = usePreviewActions();

  const [isLoadingData, setIsLoadingData] = useState(true);

  // Refs for update tracking
  const lastLocalUpdateTimeRef = useRef<number | null>(null);
  const dbUpdatedAtRef = useRef(0);

  const form = useForm<PreviewType>({
    defaultValues: {
      theme: "modern",
      chatbotName: "QuickBot Assistant",
      welcomeMessage: "Hi! How can I assist you today?",
      quickQuestions: ["", "", "", "", ""],
      supportInfo: null,
      position: "bottom-right",
      autoOpenDelayMs: 0,
      autoGreetOnOpen: true,
      askEmailBeforeChat: false,
      persistChat: true,
      showTimestamps: true,
    },
    resolver: zodResolver(previewSchema),
    mode: "onChange",
    shouldFocusError: false,
  });

  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Polling status for chatbot
  const [lastPollTime, setLastPollTime] = useState<number | null>(null);
  const [nextPollIn, setNextPollIn] = useState<number>(30);
  const [pollCount, setPollCount] = useState(0);
  const [lastUpdateHadChanges, setLastUpdateHadChanges] = useState(false);

  const handleUpdate = async (formData: PreviewType) => {
    setIsPending(true);
    setErrorMessage(null);

    const result = await updatePreview(bot.bot_id!, formData);

    if (result.ok) {
      toast.success("Preview settings saved!");

      if (result.data) {
        const dbTime = result.data.updatedAt
          ? new Date(result.data.updatedAt).getTime()
          : Date.now();
        dbUpdatedAtRef.current = dbTime;
        lastLocalUpdateTimeRef.current = dbTime; // Store the timestamp we expect

        const paddedQuickQuestions = [
          ...(result.data.quickQuestions || []),
          ...Array(5 - (result.data.quickQuestions?.length || 0)).fill(""),
        ].slice(0, 5);

        form.reset({
          ...result.data,
          quickQuestions: paddedQuickQuestions,
        });

        // Clear the local update flag after 2 seconds
        setTimeout(() => {
          lastLocalUpdateTimeRef.current = null;
        }, 2000);
      }
    } else {
      const message = result.message || "Failed to save settings";
      setErrorMessage(message);
      const isAuthError =
        message.toLowerCase().includes("authentication") ||
        message.toLowerCase().includes("user authentication");
      toast.error(message, {
        duration: isAuthError ? 8000 : 5000,
      });
      lastLocalUpdateTimeRef.current = null;
    }

    setIsPending(false);
  };

  const onSubmit = form.handleSubmit((data) => {
    // Always force autoGreetOnOpen to true
    const dataWithGreeting = {
      ...data,
      autoGreetOnOpen: true,
    };
    startTransition(() => handleUpdate(dataWithGreeting));
  });

  const { isDirty, isSubmitting } = form.formState;
  const isLoading = isSubmitting || isPending;

  // Notify parent about dirty state changes
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Load initial data on mount
  useEffect(() => {
    if (!bot.bot_id) {
      setIsLoadingData(false);
      return;
    }

    if (!isLoaded) {
      return;
    }

    let isMounted = true;

    (async () => {
      setIsLoadingData(true);
      try {
        const res = await getPreview(bot.bot_id!);

        if (!isMounted) return;

        if (res.ok && res.data) {
          const data = res.data;

          const dbTime = data.updatedAt
            ? new Date(data.updatedAt).getTime()
            : Date.now();
          dbUpdatedAtRef.current = dbTime;

          const paddedQuickQuestions = [
            ...(data.quickQuestions || []),
            ...Array(5 - (data.quickQuestions?.length || 0)).fill(""),
          ].slice(0, 5);

          // Inherit values from config/settings if not set in UI settings
          const formData = {
            ...data,
            chatbotName:
              data.chatbotName ||
              settings?.product_name ||
              "QuickBot Assistant",
            welcomeMessage:
              data.welcomeMessage ||
              configs?.greetings ||
              "Hi! How can I assist you today?",
            supportInfo: data.supportInfo || settings?.support_email || null,
            quickQuestions: paddedQuickQuestions,
            autoGreetOnOpen: true, // Always enabled, user cannot disable
          };

          form.reset(formData);
        } else if (!res.ok) {
          const message = res.message || "Failed to load preview settings";
          const isAuthError =
            message.toLowerCase().includes("authentication") ||
            message.toLowerCase().includes("user authentication");
          toast.error(message, {
            duration: isAuthError ? 8000 : 5000,
          });
        }
      } catch (error) {
        console.error("Error loading preview:", error);
        if (isMounted) {
          toast.error("Failed to load preview settings");
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot.bot_id, isLoaded]);

  // Watch for changes in configs/settings and update form if UI settings don't have values
  useEffect(() => {
    if (!configs || !settings) return;

    const currentValues = form.getValues();

    // Update chatbot_name if it's empty or default and product_name is available
    if (
      (!currentValues.chatbotName ||
        currentValues.chatbotName === "QuickBot Assistant") &&
      settings.product_name
    ) {
      form.setValue("chatbotName", settings.product_name, {
        shouldDirty: false,
      });
    }

    // Update welcome_message if it's empty or default and greetings is available
    if (
      (!currentValues.welcomeMessage ||
        currentValues.welcomeMessage === "Hi! How can I assist you today?") &&
      configs.greetings
    ) {
      form.setValue("welcomeMessage", configs.greetings, {
        shouldDirty: false,
      });
    }

    // Update support_info if it's empty and support_email is available
    if (!currentValues.supportInfo && settings.support_email) {
      form.setValue("supportInfo", settings.support_email, {
        shouldDirty: false,
      });
    }
  }, [configs, settings, form]);

  // Listen to chatbot polling events
  useEffect(() => {
    if (!bot.bot_id) return;

    const handlePoll = (event: CustomEvent) => {
      const detail = event.detail as { botId: string; timestamp: number };
      if (detail.botId === bot.bot_id) {
        setLastPollTime(detail.timestamp);
        setPollCount((prev) => prev + 1);
        setNextPollIn(30); // Reset countdown
      }
    };

    const handleUpdate = (event: CustomEvent) => {
      const detail = event.detail as {
        botId: string;
        timestamp: number;
        hasChanges: boolean;
      };
      if (detail.botId === bot.bot_id) {
        // Use setTimeout to avoid updating state during render
        setTimeout(() => {
          setLastUpdateHadChanges(detail.hasChanges);
        }, 0);
      }
    };

    window.addEventListener("quickbot-poll", handlePoll as EventListener);
    window.addEventListener("quickbot-update", handleUpdate as EventListener);

    return () => {
      window.removeEventListener("quickbot-poll", handlePoll as EventListener);
      window.removeEventListener(
        "quickbot-update",
        handleUpdate as EventListener
      );
    };
  }, [bot.bot_id]);

  // Countdown timer for next poll
  useEffect(() => {
    if (lastPollTime === null) {
      setNextPollIn(30);
      return;
    }

    // Update immediately
    const updateCountdown = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastPollTime) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setNextPollIn(remaining);

      // If we've reached 0, the next poll should happen soon
      if (remaining === 0) {
        // Keep it at 0 until the next poll event comes
        return;
      }
    };

    // Update immediately
    updateCountdown();

    // Then update every second
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPollTime]);

  const themeValue = form.watch("theme");
  const themePack = getThemePack(
    themeValue as "modern" | "classic" | "minimal" | "bubble" | "retro"
  );

  return (
    <Card className="border-none shadow-none p-0">
      <VisuallyHidden>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold">
            Preview Editor
          </CardTitle>
          <p className="text-muted-foreground">
            Customize your chatbot preview settings
          </p>
        </CardHeader>
      </VisuallyHidden>

      <CardContent className="flex flex-row h-[90vh] p-0 gap-0">
        <div className="basis-1/2 flex flex-col relative">
          {isLoadingData ? (
            <div className="flex items-center justify-center h-full">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-y-auto px-4 py-4 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner className="size-6 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Saving settings...
                    </p>
                  </div>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Section: Theme */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Theme
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Choose a theme pack with predefined colors
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Theme Pack
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                                <SelectValue placeholder="Select theme" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                                <SelectItem value="bubble">Bubble</SelectItem>
                                <SelectItem value="retro">Retro</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Theme Preview */}
                    <div className="p-4 rounded-lg border border-border bg-card/50">
                      <p className="text-xs font-medium mb-2">Theme Preview</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Background:
                          </span>
                          <div
                            className="w-full h-6 rounded border border-border mt-1"
                            style={{
                              backgroundColor: themePack.backgroundColor,
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-muted-foreground">Header:</span>
                          <div
                            className="w-full h-6 rounded border border-border mt-1"
                            style={{ backgroundColor: themePack.headerColor }}
                          />
                        </div>
                        <div>
                          <span className="text-muted-foreground">Accent:</span>
                          <div
                            className="w-full h-6 rounded border border-border mt-1"
                            style={{ backgroundColor: themePack.accentColor }}
                          />
                        </div>
                        <div>
                          <span className="text-muted-foreground">Button:</span>
                          <div
                            className="w-full h-6 rounded border border-border mt-1"
                            style={{ backgroundColor: themePack.buttonColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Bot Identity */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Bot Identity
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Name and welcome message
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="chatbotName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Chatbot Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Support Bot"
                              className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="welcomeMessage"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Welcome Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Hi! How can I assist you today?"
                              className="min-h-[60px] text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section: Quick Questions */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Quick Questions
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Up to 5 quick question buttons
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="quickQuestions"
                      render={() => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Quick Questions (up to 5)
                          </FormLabel>
                          <div className="space-y-2">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <FormField
                                key={index}
                                control={form.control}
                                name={`quickQuestions.${index}`}
                                render={({ field }) => (
                                  <FormControl>
                                    <Input
                                      placeholder={`Q${index + 1} (optional)`}
                                      className="h-8 text-xs bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                                      {...field}
                                    />
                                  </FormControl>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section: Support */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Support
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Contact information
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="supportInfo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Support Info
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="support@example.com"
                              className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section: Widget Behavior */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Widget Behavior
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Position and auto-open settings
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Position
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bottom-right">
                                  Bottom Right
                                </SelectItem>
                                <SelectItem value="bottom-left">
                                  Bottom Left
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoOpenDelayMs"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Auto Open Delay (ms)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoGreetOnOpen"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs font-medium text-foreground">
                              Auto Greet On Open
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Show welcome message when widget opens
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={true}
                              onCheckedChange={() => {}}
                              disabled={true}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section: Chat Settings */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Chat Settings
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Chat behavior and persistence
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="askEmailBeforeChat"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs font-medium text-foreground">
                              Ask Email Before Chat
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Request user email before starting conversation
                            </p>
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
                      name="showTimestamps"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs font-medium text-foreground">
                              Show Timestamps
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Display message timestamps
                            </p>
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
                      name="persistChat"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-xs font-medium text-foreground">
                              Persist Chat
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Save chat history across sessions
                            </p>
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

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      <AlertTriangleIcon className="h-4 w-4 text-destructive shrink-0" />
                      <p className="text-xs text-destructive">{errorMessage}</p>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          )}

          {!isLoadingData && (
            <div className="flex flex-1 gap-3 justify-between">
              <Button
                onClick={onSubmit}
                size="sm"
                className="w-full h-9 text-sm font-medium"
                disabled={isLoading || !isDirty || isSubmitting}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="size-4" />
                    Saving...
                  </span>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="basis-1/2 border-l border-border bg-card flex flex-col items-center justify-center p-8 relative">
          {/* Polling Status Indicator */}
          {!isLoadingData && bot.bot_id && (
            <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs space-y-1 shadow-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    lastPollTime ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="text-muted-foreground">Poll #{pollCount}</span>
              </div>
              {lastPollTime ? (
                <>
                  <div className="text-muted-foreground">
                    Last: {new Date(lastPollTime).toLocaleTimeString()}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Next in: {nextPollIn}s
                  </div>
                  {lastUpdateHadChanges && (
                    <div className="text-green-600 font-medium">
                      ✓ Changes detected
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">
                  Waiting for first poll...
                </div>
              )}
            </div>
          )}

          {!isLoadingData && bot.bot_id ? (
            <Chatbot botId={bot.bot_id} />
          ) : (
            <div className="flex items-center justify-center">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
