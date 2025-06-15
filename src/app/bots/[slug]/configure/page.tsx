"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const toneOptions = [
  "friendly",
  "professional",
  "casual",
  "formal",
  "humorous",
] as const;
const expertiseOptions = [
  "General Knowledge",
  "tech",
  "business",
  "health",
  "education",
  "custom",
] as const;
const memoryTypeOptions = ["per-user", "global", "session-only"] as const;
const memoryExpirationOptions = [
  "session",
  "24h",
  "7d",
  "30d",
  "perm",
] as const;

const proactivenessOptions = ["low", "medium", "high"] as const;
const responseLengthOptions = ["short", "medium", "long"] as const;

const formSchema = z
  .object({
    tone: z.enum(toneOptions),
    botthesis: z
      .string()
      .min(1, "Bot thesis is required")
      .max(1000, "Too long"),
    expertise: z.enum(expertiseOptions),
    customexpertise: z.string().optional(),
    creativity: z.number().min(0).max(1),
    proactiveness: z.enum(proactivenessOptions),
    responseLength: z.enum(responseLengthOptions),
    humorMode: z.boolean(),
    greeting: z.string().min(1, "Greeting is required"),
    fallback: z.string().min(1, "Fallback response is required"),
    useWebSearch: z.boolean(),
    useDocs: z.boolean(),
    siteUrl: z.string().url("Must be a valid URL").optional(),
    memoryType: z.enum(memoryTypeOptions),
    memoryExpiration: z.enum(memoryExpirationOptions),
    focusDomains: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.expertise === "custom" &&
      (!data.customexpertise || data.customexpertise.trim() === "")
    ) {
      ctx.addIssue({
        path: ["customexpertise"],
        code: "custom",
        message: "Custom expertise is required when selecting 'custom'.",
      });
    }
  });

export type PersonalityFormValues = z.infer<typeof formSchema>;

// const safeEnum = <T extends readonly string[]>(
//   value: unknown,
//   options: T,
//   fallback: T[number]
// ): T[number] =>
//   typeof value === "string" && options.includes(value as T[number])
//     ? (value as T[number])
//     : fallback;

export default function ConfigurePage() {
  const [pending, startTransition] = useTransition();
  const form = useForm<PersonalityFormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   tone: safeEnum(base.conversationTone, toneOptions, "friendly"),
    //   botthesis: base.botThesis ?? "",
    //   expertise: safeEnum(
    //     base.areaOfExpertise,
    //     expertiseOptions,
    //     "General Knowledge"
    //   ),
    //   customexpertise: base.customExpertise ?? "",
    //   creativity: base.creativity ?? 0.5,
    //   proactiveness: safeEnum(
    //     base.proactiveness,
    //     proactivenessOptions,
    //     "medium"
    //   ),
    //   responseLength: safeEnum(
    //     base.responseLength,
    //     responseLengthOptions,
    //     "medium"
    //   ),
    //   humorMode: base.humorMode ?? false,
    //   greeting: base.greeting ?? "",
    //   fallback: base.fallback ?? "",
    //   useWebSearch: base.useWebSearch ?? false,
    //   useDocs: base.useDocs ?? false,
    //   siteUrl: base.siteUrl ?? "",
    //   memoryType: safeEnum(base.memoryType, memoryTypeOptions, "session-only"),
    //   memoryExpiration: safeEnum(
    //     base.memoryExpiration,
    //     memoryExpirationOptions,
    //     "session"
    //   ),
    //   focusDomains: base.focusDomains ?? "",
    // },
  });
  const watchExpertise = form.watch("expertise");
  const watchUpload = form.watch("useDocs");
  const onSubmit = async (values: PersonalityFormValues) => {
    try {
      startTransition(async () => {
        console.log(values);
        // await submitPersonalityBase(values, slug);
      });

      toast.success(" Personality updated successfully.");
    } catch (error: unknown) {
      console.error("Error submitting personality form:", error);

      toast.error(`Failed to update personality, try again later!: `);
    }
  };
  return (
    <div className="mx-auto ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="space-y-6">
            <SectionHeader
              flag
              title="Personality Overview"
              subtitle="Define your bot's personality and conversation style."
            />

            {/* Thesis */}
            <FormField
              control={form.control}
              name="botthesis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Thesis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your bot's philosophy, goal or mission..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Default Greeting */}
            <FormField
              control={form.control}
              name="greeting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Greeting</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How should your bot introduce itself?"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fallback Response */}
            <FormField
              control={form.control}
              name="fallback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fallback Response</FormLabel>
                  <FormControl>
                    <Textarea
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Tone */}
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversation Tone</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proactiveness */}
            <FormField
              control={form.control}
              name="proactiveness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proactiveness</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select proactiveness" />
                      </SelectTrigger>
                      <SelectContent>
                        {proactivenessOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Response Length */}
            <FormField
              control={form.control}
              name="responseLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response Length</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select response length" />
                      </SelectTrigger>
                      <SelectContent>
                        {responseLengthOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <SectionHeader
              title="Expertise & Knowledge"
              subtitle="Specify what your bot knows best."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Expertise */}
              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area of Expertise</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select expertise" />
                        </SelectTrigger>
                        <SelectContent>
                          {expertiseOptions.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Expertise */}
              {watchExpertise === "custom" && (
                <FormField
                  control={form.control}
                  name="customexpertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Expertise</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a unique domain" {...field} />
                      </FormControl>
                      <FormDescription>
                        Only fill if Custom is selected above.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <div className="space-y-6">
            <SectionHeader
              title="Data Sources & Search"
              subtitle="Configure how your bot accesses information."
            />

            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
              {/* Web Search */}
              <FormField
                control={form.control}
                name="useWebSearch"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <FormLabel>Web Search</FormLabel>
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

              {/* Use Custom Docs */}
              <FormField
                control={form.control}
                name="useDocs"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <FormLabel>Custom Documents</FormLabel>
                      <FormDescription>
                        Train your bot on your own documents
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
              {watchUpload && (
                <div className="mt-4 rounded-md border border-dashed border-gray-300 p-4 md:col-span-2">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium">
                      Drag & drop files or click to upload
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Supports PDF, TXT, DOCX, and Markdown files (Max 10MB)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Select Files
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Site URL */}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Focus Domains */}
            <FormField
              control={form.control}
              name="focusDomains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Domains</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., Machine Learning, Web Development, Data Science"
                      className="max-h-[150px] min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <SectionHeader
              title="Memory & Learning"
              subtitle="Configure how your bot remembers conversations."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Memory Type */}
              <FormField
                control={form.control}
                name="memoryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Memory Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select memory type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per-user">
                            Per User (Individual Memories)
                          </SelectItem>
                          <SelectItem value="global">
                            Global (Shared Memory)
                          </SelectItem>
                          <SelectItem value="session-only">
                            Session Only (Temporary)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Memory Expiration */}
              <FormField
                control={form.control}
                name="memoryExpiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memory Expiration Control</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select memory expiration" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-6">
            <SectionHeader
              title="Behavior & Creativity"
              subtitle="Control how creative and humorous the bot is."
            />

            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
              {/* Creativity */}
              <FormField
                control={form.control}
                name="creativity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creativity Level</FormLabel>
                    <FormControl>
                      <div className="pt-2">
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          defaultValue={[field.value || 0.5]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {Math.round((field.value || 0.5) * 100)}%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Humor */}
              <FormField
                control={form.control}
                name="humorMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Humor</FormLabel>
                      <FormDescription>
                        Let the bot make jokes and add wit occasionally.
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

          <div className="flex justify-end border-t pt-6">
            <Button type="submit" className="px-3" disabled={pending}>
              {pending ? (
                <div className="flex gap-2">
                  <span>Saving...</span>
                  {/* <Spinner /> */}
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
function SectionHeader({
  flag = false,
  title,
  subtitle,
}: {
  flag?: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={flag ? "space-y-1 py-3" : "space-y-1 border-t py-3"}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
}
