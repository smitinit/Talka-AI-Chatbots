"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteBot } from "@/ManageBot/bot.actions";
import { Bot } from "@/ManageBot/bot.types";

export default function BotCard({ bot }: { bot: Bot }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(() => {
      deleteBot(bot.bot_id!);
    });
  };

  return (
    <li className="border bg-white text-black text-2xl p-2 rounded-2xl flex justify-between items-center">
      <Link href={`/bots/${bot.bot_id}`} className="flex-1">
        <div>
          <p>Bot name: {bot.name}</p>
          <p>Bot description: {bot.description}</p>
        </div>
      </Link>

      <button
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete bot"
        className="ml-2 hover:text-red-500 transition-colors"
      >
        {isPending ? "⏳" : "❌"}
      </button>
    </li>
  );
}
