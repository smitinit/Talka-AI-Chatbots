// import { Card, CardContent } from "@/components/ui/card";
// import { getBots } from "@/ManageBot/bot.actions";
// import BotCard from "@/ManageBot/BotCard";
// import { Plus, Bot, AlertCircle } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export const dynamic = "force-dynamic";

// export default async function ManageBots() {
//   const bots = await getBots();

//   return (
//     <div className="min-h-screen bg-muted/30 scroll-smooth">
//       <div className="container mx-auto max-w-7xl p-6">
//         {bots.ok && bots.data.length > 0 && (
//           <div className="mb-12 p-4  rounded-sm  sticky top-0 bg-accent/20 flex justify-between backdrop-blur-[4px] ">
//             <div className="mb-8 text-center">
//               <h1 className="mb-3 text-3xl font-bold tracking-tight">
//                 Bot Management
//               </h1>
//               <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//                 Create and manage your AI bots from one central dashboard
//               </p>
//             </div>
//             <div className="flex flex-col items-end justify-center gap-4">
//               <Button asChild variant="outline">
//                 <Link href="/bots/add">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Another Bot
//                 </Link>
//               </Button>
//               <div className="text-center sm:text-left">
//                 <p className="text-sm text-muted-foreground">
//                   You have{" "}
//                   <span className="font-semibold text-foreground">
//                     {bots.data.length}
//                   </span>{" "}
//                   {bots.data.length === 1 ? "bot" : "bots"} in your collection
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
//           {bots.ok ? (
//             bots.data.length > 0 ? (
//               bots.data.map((bot) => <BotCard bot={bot} key={bot.id} />)
//             ) : (
//               <div className="col-span-full">
//                 <div className="flex flex-col items-center justify-center py-12 text-center border">
//                   <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
//                     <Bot className="text-muted-foreground h-8 w-8" />
//                   </div>
//                   <div className="mb-8 text-center">
//                     <h1 className="mb-3 text-3xl font-bold tracking-tight">
//                       Bot Management
//                     </h1>
//                     <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//                       Create and manage your AI bots from one central dashboard
//                     </p>
//                   </div>
//                   <h3 className="mb-2 text-xl font-semibold">No bots yet</h3>
//                   <p className="text-muted-foreground mb-6 max-w-md">
//                     You haven&apos;t created any AI bots yet. Start by creating
//                     your first bot to get started.
//                   </p>
//                   <Button asChild>
//                     <Link href="/bots/add">
//                       <Plus className="mr-2 h-4 w-4" />
//                       Create Your First Bot
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             )
//           ) : (
//             <div className="col-span-full">
//               <Card className="border-destructive/20 bg-destructive/5">
//                 <CardContent className="flex flex-col items-center justify-center py-12 text-center">
//                   <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
//                     <AlertCircle className="text-destructive h-8 w-8" />
//                   </div>
//                   <h3 className="mb-2 text-xl font-semibold text-destructive">
//                     Failed to load bots
//                   </h3>
//                   <p className="text-muted-foreground mb-6 max-w-md">
//                     {bots.message ||
//                       "There was an error loading your bots. Please try refreshing the page."}
//                   </p>
//                   <Button
//                     variant="outline"
//                     onClick={() => window.location.reload()}
//                   >
//                     Try Again
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

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
import {
  Plus,
  BotIcon,
  AlertCircle,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BotType = {
  bot_id?: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

// Mock data for demonstration - replace with your actual data fetching
const mockBotsResponse = {
  ok: true,
  data: [
    {
      bot_id: "bot_1",
      name: "Customer Support Bot",
      description:
        "Handles customer inquiries and provides instant support for common questions and issues.",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T14:22:00Z",
    },
    {
      bot_id: "bot_2",
      name: "Sales Assistant",
      description:
        "Helps qualify leads and guides potential customers through the sales process.",
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-18T16:45:00Z",
    },
    {
      bot_id: "bot_3",
      name: "FAQ Bot",
      description:
        "Answers frequently asked questions about products and services.",
      created_at: "2024-01-05T14:20:00Z",
      updated_at: "2024-01-05T14:20:00Z",
    },
  ] as BotType[],
  message: "",
};

function BotCard({
  bot,
  onDelete,
}: {
  bot: BotType;
  onDelete: (botId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!bot.bot_id) return;
    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onDelete(bot.bot_id);
    setIsDeleting(false);
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
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ID: {bot.bot_id}
                </span>
              </div>
            </div>
          </div>
          <ExternalLink className="text-muted-foreground h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <CardDescription className="text-sm leading-relaxed line-clamp-3 mb-4">
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
          <Link href={`/bots/${bot.bot_id}/chat`}>
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full">
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted/50 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <BotIcon className="text-muted-foreground h-10 w-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No bots yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
            You haven&apos;t created any AI bots yet. Start by creating your
            first bot to begin automating conversations.
          </p>
          <Button asChild size="lg">
            <Link href="/bots/add">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Bot
            </Link>
          </Button>
        </CardContent>
      </Card>
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

export default function BotManagementDashboard() {
  // Replace this with your actual data fetching logic
  const [bots, setBots] = useState(mockBotsResponse);

  const handleDeleteBot = (botId: string) => {
    setBots((prev) => ({
      ...prev,
      data: prev.data.filter((bot) => bot.bot_id !== botId),
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Bot Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Create and manage your AI bots from one central dashboard
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/bots/add">
                <Plus className="mr-2 h-4 w-4" />
                Add New Bot
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        {bots.ok && bots.data.length > 0 && (
          <div className="mb-8 p-4 rounded-lg bg-muted/30 border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bots</p>
                  <p className="text-2xl font-bold">{bots.data.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bots.data.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      bots.data.filter((bot) => {
                        if (!bot.created_at) return false;
                        const created = new Date(bot.created_at);
                        const now = new Date();
                        return (
                          created.getMonth() === now.getMonth() &&
                          created.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  You have{" "}
                  <span className="font-semibold text-foreground">
                    {bots.data.length}
                  </span>{" "}
                  {bots.data.length === 1 ? "bot" : "bots"} in your collection
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bots Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bots.ok ? (
            bots.data.length > 0 ? (
              bots.data.map((bot) => (
                <BotCard
                  key={bot.bot_id}
                  bot={bot}
                  onDelete={handleDeleteBot}
                />
              ))
            ) : (
              <EmptyState />
            )
          ) : (
            <ErrorState message={bots.message} />
          )}
        </div>

        {/* Quick Actions */}
        {bots.ok && bots.data.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">
                  Need help getting started?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check out our documentation and tutorials to make the most of
                  your bots.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/docs">View Docs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/templates">Browse Templates</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
