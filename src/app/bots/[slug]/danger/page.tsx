"use client";

import { useBotData } from "@/components/bot-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteBot } from "@/features/settings/settingsActions";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function Danger() {
  const [isPendingDelete, startDeleteTransition] = useTransition();
  // get the bot for the bot_id property
  const { bot } = useBotData();

  // if no bot id throw err
  if (!bot.bot_id) {
    throw new Error("Bot does not exists.");
  }
  function handleDeleteBot() {
    startDeleteTransition(async () => {
      // db call to update the settings
      await deleteBot(bot.bot_id!);

      toast.error(`Bot ${bot.name} is deleted`);
    });
  }

  function handleRegenerateKeys() {
    if (
      confirm(
        "Are you sure you want to regenerate API keys? Existing keys will be invalidated."
      )
    ) {
    }
  }
  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-destructive">
          Bot Settings
        </h1>
        <p className="text-muted-foreground">
          Manage runtime settings, operational controls, and day-to-day bot
          operations.
        </p>
      </div>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Dangerous Actions
          </CardTitle>
          <CardDescription>
            These actions cannot be undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Regenerate API Keys</h4>
              <p className="text-sm text-muted-foreground">
                Generate new API keys and invalidate existing ones
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleRegenerateKeys}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
            <div>
              <h4 className="font-medium text-destructive">Delete Bot</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete this bot and all associated data
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteBot}
              className="flex items-center gap-2"
              disabled={isPendingDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Bot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
