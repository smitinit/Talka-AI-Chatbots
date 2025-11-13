"use client";

import { useBotData } from "@/components/bot-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteBot } from "./deleteAction";
import { AlertTriangle, Power, PowerOff, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../../components/ConfirmDialog";

export default function DangerSectionPage() {
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

  const [isOnline, setOnline] = useState(false);
  function handleStatusChange() {
    setOnline(!isOnline);
  }
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-semibold text-primary">Danger Zone</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Manage runtime settings, operational controls, and day-to-day bot
          operations. These actions cannot be undone.
        </p>
      </div>

      <Card className="border border-border/50 shadow-none">
        <CardHeader className="pb-6">
          <CardTitle className="text-destructive flex items-center gap-2.5 text-lg">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Dangerous Actions
          </CardTitle>
          <CardDescription className="text-sm">
            These actions cannot be undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200">
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">
                Change Status
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Make status changes to your bots such as pausing or deactivating
                them.
              </p>
            </div>

            <ConfirmActionDialog
              title={isOnline ? "Deactivate Bot" : "Activate Bot"}
              description="Are you sure you want to change the status of this bot? This might affect active integrations."
              triggerLabel={isOnline ? "Switch Off" : "Switch On"}
              icon={
                isOnline ? (
                  <PowerOff className="h-4 w-4" />
                ) : (
                  <Power className="h-4 w-4" />
                )
              }
              variant={isOnline ? "destructive" : "default"}
              actionLabel="Yes, Change"
              onConfirm={handleStatusChange}
              isDestructive={isOnline}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors duration-200">
            <div className="flex-1">
              <h4 className="font-medium text-destructive text-sm">
                Delete Bot
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete this bot and all associated data.
              </p>
            </div>
            <ConfirmActionDialog
              title="Are you sure to delete this bot?"
              description="This action is irreversible. All data associated with this bot will be permanently deleted."
              triggerLabel="Delete Bot"
              icon={<Trash2 className="h-4 w-4" />}
              actionLabel="Yes, Delete"
              variant="destructive"
              onConfirm={handleDeleteBot}
              disabled={isPendingDelete}
              isDestructive={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
