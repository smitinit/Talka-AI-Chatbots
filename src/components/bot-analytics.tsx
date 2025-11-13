"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  Eye,
} from "lucide-react";
import type { BotType } from "@/features/create/createSchema";
import { Button } from "./ui/button";
import Link from "next/link";

const mockStats = {
  totalConversations: 12847,
  activeUsers: 342,
  avgResponseTime: 270,
  successRate: 98.2,
  uptime: 99.97,
  memoryUsage: 68,
  tokensUsed: 45230,
  tokensLimit: 1000000,
};

export default function BotManagementDashboard({ bot }: { bot: BotType }) {
  const [isOnline] = useState(true);
  const previewUrl = `/bots/${bot.bot_id}/preview`;
  const statusUrl = `/bots/${bot.bot_id}/danger`;

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-8">
        {/* Bot Identity Card */}
        <Card className="border border-border/40 shadow-none bg-card hover:border-border/60 transition-colors duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="w-14 h-14 ring-2 ring-primary/15 shrink-0">
                  <AvatarFallback className="bg-linear-to-br from-primary/90 to-primary text-primary-foreground font-semibold text-base">
                    {bot.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg truncate">
                    {bot.name[0].toUpperCase() + bot.name.slice(1)}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isOnline
                            ? "bg-green-500 animate-pulse"
                            : "bg-destructive"
                        )}
                      />
                      <p className="text-sm text-muted-foreground">
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                    <Link
                      href={statusUrl}
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      [change]
                    </Link>
                  </div>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href={previewUrl}>
                  <Eye className="w-4 h-4" />
                  Preview
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {bot.description}
            </p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground text-base">
              Key Metrics
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Conversations Card */}
            <Card className="border border-border/40 shadow-none bg-card/50 hover:bg-card/70 transition-all duration-300 hover:border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Conversations
                    </p>
                    <div className="text-2xl font-bold text-foreground">
                      {(mockStats.totalConversations / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-500/10">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Users Card */}
            <Card className="border border-border/40 shadow-none bg-card/50 hover:bg-card/70 transition-all duration-300 hover:border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Active Users
                    </p>
                    <div className="text-2xl font-bold text-foreground">
                      {mockStats.activeUsers}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-green-500/10">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+8.2%</span>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Card */}
            <Card className="border border-border/40 shadow-none bg-card/50 hover:bg-card/70 transition-all duration-300 hover:border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Response Time
                    </p>
                    <div className="text-2xl font-bold text-foreground">
                      {mockStats.avgResponseTime}ms
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-orange-500/10">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>-15ms</span>
                </div>
              </CardContent>
            </Card>

            {/* Success Rate Card */}
            <Card className="border border-border/40 shadow-none bg-card/50 hover:bg-card/70 transition-all duration-300 hover:border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Success Rate
                    </p>
                    <div className="text-2xl font-bold text-foreground">
                      {mockStats.successRate}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-500/10">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+0.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Health */}
        <Card className="border border-border/40 shadow-none bg-card">
          <CardHeader className="pb-5 border-b border-border/30">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Uptime */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Uptime
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {mockStats.uptime}%
                </span>
              </div>
              <Progress value={mockStats.uptime} className="h-2 bg-muted/40" />
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Memory Usage
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {mockStats.memoryUsage}%
                </span>
              </div>
              <Progress
                value={mockStats.memoryUsage}
                className="h-2 bg-muted/40"
              />
            </div>

            {/* Token Usage */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Token Usage
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {(
                    (mockStats.tokensUsed / mockStats.tokensLimit) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={(mockStats.tokensUsed / mockStats.tokensLimit) * 100}
                className="h-2 bg-muted/40"
              />
              <div className="text-xs text-muted-foreground pt-1">
                {mockStats.tokensUsed.toLocaleString()} /{" "}
                {mockStats.tokensLimit.toLocaleString()} tokens
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
