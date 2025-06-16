"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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

export default function BotSettingsForm({
  fetchedSettings,
}: {
  fetchedSettings: BotSettingsType;
}) {
  const form = useForm<BotSettingsType>({
    resolver: zodResolver(botSettingsSchema),
    defaultValues: fetchedSettings,
  });
  const [isPending, startTransition] = useTransition();
  const [showExpertMode, setShowExpertMode] = useState(false);

  function onSubmit(values: BotSettingsType) {
    startTransition(() => {
      //db logic
      console.log(values);
    });
    return null;
  }

  function handleDeleteBot() {
    if (
      confirm(
        "Are you sure you want to delete this bot? This action cannot be undone."
      )
    ) {
      // Delete logic
      console.log("Deleting bot...");
    }
  }

  function handleRegenerateKeys() {
    if (
      confirm(
        "Are you sure you want to regenerate API keys? Existing keys will be invalidated."
      )
    ) {
      // Regenerate keys logic
      console.log("Regenerating keys...");
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
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={100}
                        max={4000}
                        placeholder="2048"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
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
                name="stopSequences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Sequences</FormLabel>
                    <FormControl>
                      <Input placeholder="\\n\\n, END, STOP" {...field} />
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
                  name="topP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top P</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          max={1}
                          placeholder="0.9"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseFloat(e.target.value))
                          }
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
                  name="topK"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top K</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="40"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
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
                name="jsonMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>JSON Mode</FormLabel>
                      <FormDescription>
                        Force responses in JSON format
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
                name="toolUse"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Tool Use</FormLabel>
                      <FormDescription>
                        Enable external tool integration
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

          {/* Search & Information Sources */}
          <div className="space-y-6">
            <SectionHeader
              title="Search & Information Sources"
              subtitle="Configure external information access and search capabilities."
            />

            <FormField
              control={form.control}
              name="useWebSearch"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Web Search</FormLabel>
                    <FormDescription>
                      Allow your bot to search the web for information
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site URL</FormLabel>
                    <FormControl>
                      <Input
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
                name="focusDomains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus Domains</FormLabel>
                    <FormControl>
                      <Textarea
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
                name="loggingEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Logging</FormLabel>
                      <FormDescription>
                        Log conversations for analysis and debugging
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
                name="voiceMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Voice Mode</FormLabel>
                      <FormDescription>
                        Enable voice input and output
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

            <FormField
              control={form.control}
              name="rateLimitPerMin"
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
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value))
                      }
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
              name="webhookURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
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

          {/* Usage & Billing */}
          <div className="space-y-6">
            <SectionHeader
              title="Usage & Billing"
              subtitle="Monitor usage and billing information."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Token Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,450</div>
                  <p className="text-xs text-muted-foreground">
                    of 50,000 monthly tokens
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Billing Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Pro</div>
                  <p className="text-xs text-muted-foreground">$29/month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    API Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">this month</p>
                </CardContent>
              </Card>
            </div>
          </div>

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
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Bot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-border/50">
            <Button type="submit" disabled={isPending} className="px-8">
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
