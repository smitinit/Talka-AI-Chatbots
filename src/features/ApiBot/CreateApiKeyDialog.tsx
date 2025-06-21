"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiKeySchema, ApiKeyFormType, ApiKeyRow } from "./api.schema";
import { createApiKey } from "./api.actions";
import { toast } from "sonner";
import { useBotApi, useBotData } from "@/components/bot-context";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Plus } from "lucide-react";
import { TokenRevealDialog } from "./TokenRevealDialog";
import { Checkbox } from "@/components/ui/checkbox";

const permissions = [
  {
    id: "read",
    label: "Read",
  },
  {
    id: "write",
    label: "Write",
  },
];

export default function CreateApiKeyDialog() {
  const { bot } = useBotData();
  if (!bot.bot_id) throw new Error("Bot does not exist");

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showToken, setShowToken] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const { api: apiKeys, setApi } = useBotApi();

  const form = useForm<ApiKeyFormType>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: { name: "", permissions: ["read"] },
  });
  const { isDirty, isSubmitting } = form.formState;

  function onSubmit(values: ApiKeyFormType) {
    startTransition(async () => {
      if (apiKeys.some((k) => k.name === values.name)) {
        toast.warning("A key with that name already exists.");
        return;
      }

      const result = await createApiKey(
        bot.bot_id!,
        values.name,
        values.permissions
      );

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      const token = result.data!.token_hash;
      if (token && result.data) {
        setLastToken(token); // show it once

        setShowToken(true);
        const newKey: ApiKeyRow = {
          id: result.data.id,
          bot_id: result.data.bot_id,
          name: result.data.name,
          permissions: result.data.permissions,
          created_at: result.data.created_at,
          api_id: result.data.api_id,
          token_hash: "<hidden>",
          user_id: result.data.user_id,
        };

        setApi((prev) => [...prev, newKey]);
      }

      form.reset({ name: "" }); // clear input for next time
      setOpen(false);

      toast.success("API key created successfully");
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2" disabled={apiKeys.length >= 3}>
            <Plus className="h-4 w-4" />
            Create API Key
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-popover border border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Create New API Key
            </DialogTitle>
            <DialogDescription>
              Enter a label to identify this key.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="keyName">API Key Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        id="keyName"
                        placeholder="e.g. staging key, prod, dev, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Permissions</FormLabel>
                      <FormDescription>
                        Select permission/s that you want to assign to this
                        apikey.
                      </FormDescription>
                    </div>
                    {permissions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center gap-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const current = Array.isArray(field.value)
                                      ? field.value
                                      : [];
                                    field.onChange(
                                      checked
                                        ? [...current, item.id]
                                        : current.filter((v) => v !== item.id)
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty || isPending}
                >
                  {isSubmitting || isPending ? "Creating…" : "Create API Key"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <TokenRevealDialog
        token={lastToken || ""}
        open={showToken}
        onClose={() => setShowToken(false)}
      />
    </>
  );
}
