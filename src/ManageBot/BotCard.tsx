"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteBot } from "@/ManageBot/bot.actions";
import { Bot as BotType } from "@/ManageBot/bot.types";
import { Bot, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BotCard({ bot }: { bot: BotType }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(() => {
      deleteBot(bot.bot_id!);
    });
  };
  const formattedCreateTime = new Date(bot.created_at!).toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
  const formattedUpdateTime = new Date(bot.updated_at!).toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <>
      <Card className="group" key={bot.id}>
        <CardHeader className="">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg shrink-0">
                <Bot className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg sm:text-xl truncate max-w-[150px]">
                {bot.name}
              </CardTitle>
            </div>
            <ExternalLink className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 shrink-0 ml-2" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm sm:text-base lg:text-lg flex flex-col gap-3 sm:gap-4">
            <span className="line-clamp-1">{bot.description}</span>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                Created at: {formattedCreateTime}
              </p>
              <p className="text-muted-foreground text-xs">
                Last updated: {formattedUpdateTime}
              </p>
            </div>
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-0">
          <Link href={`/bots/${bot.bot_id}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Visit
            </Button>
          </Link>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete bot"
            className="w-full sm:w-auto"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
