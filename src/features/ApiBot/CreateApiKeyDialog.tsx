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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Plus } from "lucide-react";
import { TokenRevealDialog } from "./TokenRevealDialog";

export default function CreateApiKeyDialog() {
  const { bot } = useBotData();
  if (!bot.bot_id) throw new Error("Bot does not exist");

  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const { api: apiKeys, setApi } = useBotApi();

  const form = useForm<ApiKeyFormType>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: { name: "", permissions: [] },
  });
  const { isDirty, isSubmitting } = form.formState;

  const [showToken, setShowToken] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);

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
          <Button className="gap-2">
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
                        id="keyName"
                        placeholder="e.g. staging key"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    {(["read", "write"] as const).map((scope) => (
                      <label key={scope} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={field.value.includes(scope)}
                          onChange={(e) =>
                            e.target.checked
                              ? field.onChange([...field.value, scope])
                              : field.onChange(
                                  field.value.filter((v) => v !== scope)
                                )
                          }
                        />
                        {scope}
                      </label>
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
