export const dynamic = "force-dynamic";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BotIcon } from "lucide-react";
import Link from "next/link";
import { getBots } from "@/features/create/createActions";
import BotCard from "@/components/bot-display";
import { Badge } from "@/components/ui/badge";

function EmptyState() {
  return (
    <div className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted/30 mb-6 flex h-20 w-20 items-center justify-center rounded-lg">
          <BotIcon className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No bots yet</h3>
        <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed">
          You haven&apos;t created any AI bots yet. Start by creating your first
          bot to begin automating conversations.
        </p>
      </CardContent>

      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-medium mb-1 text-sm">
              Need help getting started?
            </h3>
            <p className="text-xs text-muted-foreground">
              Check out our documentation and tutorials to make the most of your
              bots.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/#">View Docs</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/#">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BotManagementDashboard() {
  const bots = await getBots();
  if (!bots.ok) {
    throw new Error(
      `Failed to fetch bots: ${bots.message || "Something went wrong"}`
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-primary">
                Bot Management
              </h1>
              <p className="text-muted-foreground text-sm">
                Create and manage your AI bots.
              </p>
            </div>

            <Button asChild size="lg" className="shrink-0 w-full sm:w-auto">
              <Link href="/bots/add">
                <Plus className="mr-2 h-4 w-4" />
                Add New Bot
              </Link>
            </Button>
          </div>

          {bots.ok && bots.data!.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Total Bots
                  </span>
                  <Badge variant="default" className="text-xs font-semibold">
                    {bots.data!.length}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Active
                  </span>
                  <Badge className="bg-emerald-500/90 text-white text-xs font-semibold">
                    {bots.data!.length}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                You have{" "}
                <span className="font-semibold text-foreground">
                  {bots.data!.length}
                </span>{" "}
                {bots.data!.length === 1 ? "bot" : "bots"} in your collection
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bots.ok && bots.data!.length > 0 ? (
            bots.data!.map((bot) => <BotCard key={bot.bot_id} bot={bot} />)
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
