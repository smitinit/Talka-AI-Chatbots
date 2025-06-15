"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import SectionHeader from "@/components/section-header";

export default function SettingsPage() {
  const [botName, setBotName] = useState("MyBot");
  const [model, setModel] = useState("gpt-4");
  const [webhookURL, setWebhookURL] = useState("");
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="max-w-4xl mx-auto mb-8 py-10 px-4">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Bot Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your bot&apos;s core behaviors, integrations, and usage
          settings.
        </p>
      </div>

      <form className="space-y-12">
        {/* Identity */}
        <div className="space-y-6">
          <SectionHeader
            title="Identity & Model"
            subtitle="Name your bot and choose its brain."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Name</Label>
              <Input
                id="bot-name"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Enter bot name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4 Omni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="space-y-6">
          <SectionHeader
            title="Integration"
            subtitle="Configure external hooks and connections."
          />

          <div className="space-y-2 max-w-2xl">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              type="url"
              placeholder="https://example.com/webhook"
              value={webhookURL}
              onChange={(e) => setWebhookURL(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Forward bot interactions to your backend or service.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <SectionHeader
            title="Bot Features"
            subtitle="Enable or disable specific capabilities."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-2">
              <div>
                <Label>Enable Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Save conversations and usage stats.
                </p>
              </div>
              <Switch
                checked={loggingEnabled}
                onCheckedChange={setLoggingEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <div>
                <Label>Voice Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Allow voice input/output for responses.
                </p>
              </div>
              <Switch checked={voiceMode} onCheckedChange={setVoiceMode} />
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="space-y-6">
          <SectionHeader
            title="Token Usage"
            subtitle="Monitor your current usage and limits."
          />
          <p className="text-green-500 font-medium text-sm">
            ~97,300 tokens remaining
          </p>
        </div>

        {/* Danger Zone */}
        <div className="space-y-6">
          <SectionHeader
            title="Danger Zone"
            subtitle="Delete your bot and erase all data."
          />

          <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover border-border">
              <DialogHeader>
                <DialogTitle>Confirm Bot Deletion</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This action is permanent and cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleting(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast.success("Bot deleted.");
                    setIsDeleting(false);
                  }}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
