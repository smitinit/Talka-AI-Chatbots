export const dynamic = "force-dynamic";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BotIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getBots } from "@/features/CreateBot/bot-create.actions";
import BotCard from "@/features/CreateBot/BotDisplayCard";
import { Badge } from "@/components/ui/badge";

function EmptyState() {
  return (
    <div className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/50 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <BotIcon className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No bots yet</h3>
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
          You haven&apos;t created any AI bots yet. Start by creating your first
          bot to begin automating conversations.
        </p>
      </CardContent>

      <div className="mt-12 pt-8 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1">Need help getting started?</h3>
            <p className="text-sm text-muted-foreground">
              Check out our documentation and tutorials to make the most of your
              bots.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/#">View Docs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="col-span-full">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-destructive/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-10 w-10" />
          </div>
          <h3 className="text-2xl font-semibold text-destructive mb-2">
            Failed to load bots
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
            {message ||
              "There was an error loading your bots. Please try refreshing the page."}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function BotManagementDashboard() {
  await new Promise((res) => setTimeout(res, 500));

  const bots = await getBots();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl p-6">
        {/* Header Section */}
        <div className="mb-8 border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Bot Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Create and manage your AI bots.
              </p>
            </div>

            <Button asChild size="lg" className="shrink-0">
              <Link href="/bots/add">
                <Plus className="mr-2 h-4 w-4" />
                Add New Bot
              </Link>
            </Button>
          </div>
          {bots.ok && bots.data!.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-6 ">
                <p className="text-sm text-muted-foreground">
                  Total Bots <Badge>{bots.data!.length}</Badge>
                </p>

                <p className="text-sm text-muted-foreground">
                  Active{" "}
                  <Badge className="bg-green-400">{bots.data!.length}</Badge>
                </p>

                <p className="text-sm text-muted-foreground">
                  This Month{" "}
                  <Badge>
                    {
                      bots.data!.filter((bot) => {
                        if (!bot.created_at) return false;
                        const created = new Date(bot.created_at);
                        const now = new Date();
                        return (
                          created.getMonth() === now.getMonth() &&
                          created.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </Badge>
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                You have{" "}
                <span className="font-semibold text-foreground">
                  {bots.data!.length}
                </span>{" "}
                {bots.data!.length === 1 ? "bot" : "bots"} in your collection
              </p>
            </div>
          )}
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bots.ok ? (
            bots.data!.length > 0 ? (
              bots.data!.map((bot) => <BotCard key={bot.bot_id} bot={bot} />)
            ) : (
              <EmptyState />
            )
          ) : (
            <ErrorState message={bots.message} />
          )}
        </div>
      </div>
    </div>
  );
}
