"use client";

import { useRouter } from "next/navigation";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { addBot } from "@/ManageBot/bot.actions";
import { Result } from "@/types/result";
import type { Bot } from "@/ManageBot/bot.types";
import {
  type BotFormInput as BotFormType,
  botSchema,
} from "@/ManageBot/bot.schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
  });

  const [state, dispatch, isPending] = useActionState<Result<Bot>, BotFormType>(
    async (_prevState, formData) => {
      const result = await addBot(formData.name, formData.description);

      if (result.ok) {
        reset();
        router.refresh();
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
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <input
          {...register("name")}
          placeholder="Enter bot name"
          className="border px-3 py-2 rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        <input
          {...register("description")}
          placeholder="Enter bot description"
          className="border px-3 py-2 rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>

      {!state.ok && (
        <p className="text-red-500 mt-2 text-sm">{state.message}</p>
      )}
    </>
  );
}
