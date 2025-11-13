"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { updatePreviewAction, getPreviewAction } from "./previewFormActions";
import {
  previewSchema,
  type PreviewType,
  THEME_PRESETS,
} from "./previewFormSchema";

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
import { AlertTriangleIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Chatbot } from "@/packages/chatbot-ui/src";

export default function PreviewLayoutForm() {
  const router = useRouter();

  const form = useForm<PreviewType>({
    defaultValues: {
      previewMode: "desktop",
      theme: "light",
      chatbotName: "",
      chatbotDescription: "",
      quickQuestions: ["", "", "", "", ""],
      avatarUrl: "",
      supportInfo: "",
      blogLinks: ["", "", ""],
      welcomeMessage: "",
      showBranding: true,
    },
    resolver: zodResolver(previewSchema),
    mode: "onChange",
    shouldFocusError: false,
  });

  type PreviewActionState = {
    ok: boolean;
    data: unknown;
    message: string;
  };

  const [state, dispatch, isPending] = useActionState<
    PreviewActionState,
    PreviewType
  >(
    async (_prevState, formData) => {
      const result = await updatePreviewAction(formData);
      if (result.ok) {
        toast.success("Preview settings saved!");
        router.back();
      }
      return result;
    },
    { ok: true, data: null, message: "" }
  );

  const onSubmit = form.handleSubmit((data) =>
    startTransition(() => dispatch(data))
  );

  const { isDirty, isSubmitting } = form.formState;
  const isLoading = isSubmitting || isPending;

  useEffect(() => {
    (async () => {
      const res = await getPreviewAction();
      if (res.ok && res.data) form.reset(res.data);
    })();
  }, [form]);

  const selectedTheme = form.watch("theme");

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
        <div className="basis-1/2  flex flex-col">
          <div className="overflow-y-auto px-4 py-4">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Basic Info
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Name and description
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
                    name="previewMode"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-medium text-foreground">
                          Preview Mode
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="desktop">Desktop</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chatbotDescription"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-medium text-foreground">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What does your bot do?"
                            className="min-h-[70px] text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Theme & Appearance */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Theme
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Choose a color theme
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="grid grid-cols-5 gap-2">
                          {Object.entries(THEME_PRESETS).map(
                            ([key, preset]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => field.onChange(key)}
                                className={`relative p-2 rounded-lg border-2 transition-all ${
                                  selectedTheme === key
                                    ? "border-primary ring-2 ring-primary ring-offset-1"
                                    : "border-border hover:border-primary/50"
                                }`}
                                title={preset.name}
                              >
                                <div className="space-y-1">
                                  <div
                                    className="w-full h-8 rounded-md border border-border"
                                    style={{ backgroundColor: preset.bg }}
                                  />
                                  <div className="text-xs font-medium text-foreground text-center truncate">
                                    {preset.name}
                                  </div>
                                </div>
                              </button>
                            )
                          )}
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-medium text-foreground">
                          Avatar URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.png"
                            className="h-9 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Messaging & Content */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Messaging
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Welcome message and quick questions
                    </p>
                  </div>

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
                            placeholder="Welcome to our support chatbot!"
                            className="min-h-[60px] text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

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

                {/* Support & Links */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Support
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Contact and resources
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="supportInfo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-medium text-foreground">
                          Support Contact
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="support@example.com"
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
                    name="blogLinks"
                    render={() => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-medium text-foreground">
                          Blog Links
                        </FormLabel>
                        <div className="space-y-2">
                          {[0, 1, 2].map((index) => (
                            <FormField
                              key={index}
                              control={form.control}
                              name={`blogLinks.${index}`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    placeholder={`Link ${index + 1} (optional)`}
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

                {/* Additional Settings */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Settings
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Display options
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="showBranding"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs font-medium text-foreground">
                            Show Branding
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Display powered by info
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
                {!state.ok && state.message && (
                  <div className="flex items-center gap-2 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <AlertTriangleIcon className="h-4 w-4 text-destructive shrink-0" />
                    <p className="text-xs text-destructive">{state.message}</p>
                  </div>
                )}
              </form>
            </Form>
          </div>

          <div className="flex flex-1 gap-3 justify-between">
            <Button
              onClick={onSubmit}
              size="sm"
              className="w-full h-9 text-sm font-medium"
              disabled={isLoading || !isDirty || isSubmitting}
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
        <div className="basis-1/2 border-l border-border bg-card items-center justify-center flex relative">
          <div className="w-[80%]  rounded-lg overflow-hidden relative">
            <Chatbot
              position="bottom-right"
              botId="8bc77785-43dc-4607-b69f-431c7950b235"
              theme="blue"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
