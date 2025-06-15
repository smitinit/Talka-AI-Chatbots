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

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BotIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getBots } from "@/ManageBot/bot.actions";
import BotCard from "@/ManageBot/BotCard";

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

export default async function BotManagementDashboard() {
  // Replace this with your actual data fetching logic
  const bots = await getBots();
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
              bots.data.map((bot) => <BotCard key={bot.bot_id} bot={bot} />)
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
                  <Link href="/#">View Docs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/#">Browse Templates</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
