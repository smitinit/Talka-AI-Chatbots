"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { addBot } from "@/ManageBot/bot.actions";
import {
  type BotFormInput as BotFormType,
  botSchema,
} from "@/ManageBot/bot.schema";

import type { Result } from "@/types/result";
import type { Bot } from "@/ManageBot/bot.types";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon } from "lucide-react";

export default function BotForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BotFormType>({
    defaultValues: { name: "", description: "" },
    resolver: zodResolver(botSchema),
    mode: "onChange",
    shouldFocusError: false,
  });

  const [state, dispatch, isPending] = useActionState<Result<Bot>, BotFormType>(
    async (_prevState, formData) => {
      const result = await addBot(formData.name, formData.description);

      if (result.ok) {
        reset();
        router.back();
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
    <div className="flex items-start justify-center p-4 ">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold">
            Create New Bot
          </CardTitle>
          <p className="text-muted-foreground">
            Enter a name for your new AI bot.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Enter bot name"
                  className="h-10"
                />
                {errors.name && (
                  <p className="text-destructive dark:text-yellow-200 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Bot Description</Label>
                <Input
                  {...register("description")}
                  placeholder="Enter bot description"
                  id="description"
                  className="h-10"
                />
                {errors.description && (
                  <p className="text-destructive dark:text-yellow-200 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {!state.ok && state.message && (
              <p className="dark:text-yellow-200 text-destructive flex justify-center items-center gap-2  text-sm text-center bg-destructive/10 p-3 rounded-md">
                <AlertTriangleIcon className="h-4 w-4" />
                {state.message}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create Bot"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => router.back()}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
