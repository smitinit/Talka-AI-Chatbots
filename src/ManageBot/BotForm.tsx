"use client";

import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";

import { addBot } from "@/ManageBot/bot.actions";
import {
  type BotFormInput as BotFormType,
  botSchema,
} from "@/ManageBot/bot.schema";

import type { Result } from "@/types/result";
import type { Bot } from "@/ManageBot/bot.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BotForm() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BotFormType>({
    defaultValues: { name: "", description: "" },
    resolver: zodResolver(botSchema),
    mode: "onChange",
  });

  const [state, dispatch, isPending] = useActionState<Result<Bot>, BotFormType>(
    async (_prevState, formData) => {
      const result = await addBot(formData.name, formData.description);

      if (result.ok) {
        reset();
        setOpen(false);
      }

      return result;
    },
    { ok: true, data: { name: "", description: "" } }
  );

  const onSubmit = handleSubmit((data) =>
    startTransition(() => dispatch(data))
  );

  const isLoading = isSubmitting || isPending;
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="border-muted-foreground/25 hover:border-muted-foreground/50 group cursor-pointer border-2 border-dashed ">
            <CardContent className="flex flex-1 flex-col items-center justify-center h-48 text-center">
              <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                <Plus className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Create New Bot</h3>
              <p className="text-muted-foreground text-sm">
                Click to add a new AI bot
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Bot</DialogTitle>
              <DialogDescription>
                Enter a name for your new AI bot.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  {...register("name")}
                  placeholder="Enter bot name"
                  className="border px-3 py-2 rounded"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bot-name">Bot Description</Label>
                <Input
                  {...register("description")}
                  placeholder="Enter bot description"
                  className="border px-3 py-2 rounded"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            {!state.ok && (
              <p className="text-red-500 mt-2 text-sm">{state.message}</p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Bot"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
