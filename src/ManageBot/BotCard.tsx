"use client";

import { useTransition } from "react";
import Link from "next/link";

import { deleteBot } from "@/ManageBot/bot.actions";
import type { Bot as BotType } from "@/ManageBot/bot.types";

import {
  BotIcon,
  Calendar,
  Clock,
  ExternalLink,
  Settings,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BotCard({ bot }: { bot: BotType }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(() => {
      deleteBot(bot.bot_id!);
    });
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg shrink-0 group-hover:bg-primary/20 transition-colors">
              <BotIcon className="text-primary h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                {bot.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 ">
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
                <Badge
                  onClick={async () => {
                    await navigator.clipboard.writeText(bot.bot_id!);
                  }}
                  variant="outline"
                  className="text-xs cursor-pointer"
                >
                  ID: {bot.bot_id?.slice(0, 16)}...
                </Badge>
              </div>
            </div>
          </div>
          <ExternalLink className="text-muted-foreground h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <CardDescription className="text-sm leading-relaxed line-clamp-2 mb-4">
          {bot.description}
        </CardDescription>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Created: {formatDate(bot.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Updated: {formatDate(bot.updated_at)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/bots/${bot.bot_id}`}>
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Link>
        </Button>
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/bots/${bot.bot_id}/#`}>
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
