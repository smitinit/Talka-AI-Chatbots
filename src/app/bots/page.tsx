import { Card, CardContent } from "@/components/ui/card";
import { getBots } from "@/ManageBot/bot.actions";
import BotCard from "@/ManageBot/BotCard";
import { Plus, Bot, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ManageBots() {
  const bots = await getBots();

  return (
    <div className="min-h-screen bg-muted/30 scroll-smooth">
      <div className="container mx-auto max-w-7xl p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            Bot Management
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create and manage your AI bots from one central dashboard
          </p>
        </div>

        {bots.ok && bots.data.length > 0 && (
          <div className="mb-12 p-4  rounded-sm mt-4 sticky top-0 bg-accent/20 backdrop-blur-[4px] ">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  You have{" "}
                  <span className="font-semibold text-foreground">
                    {bots.data.length}
                  </span>{" "}
                  {bots.data.length === 1 ? "bot" : "bots"} in your collection
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/bots/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Bot
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {bots.ok ? (
            bots.data.length > 0 ? (
              bots.data.map((bot) => <BotCard bot={bot} key={bot.id} />)
            ) : (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center py-12 text-center border">
                  <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Bot className="text-muted-foreground h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No bots yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    You haven&apos;t created any AI bots yet. Start by creating
                    your first bot to get started.
                  </p>
                  <Button asChild>
                    <Link href="/bots/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Bot
                    </Link>
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-full">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <AlertCircle className="text-destructive h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-destructive">
                    Failed to load bots
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {bots.message ||
                      "There was an error loading your bots. Please try refreshing the page."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
