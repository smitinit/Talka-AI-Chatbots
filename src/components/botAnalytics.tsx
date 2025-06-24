"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Activity,
} from "lucide-react";

const mockStats = {
  totalConversations: 12847,
  activeUsers: 342,
  avgResponseTime: 270,
  successRate: 98.2,
  uptime: 99.97,
  memoryUsage: 68,
  tokensUsed: 45230,
  tokensLimit: 1_00_000,
};
export default function BotManagementDashboard() {
  const [isOnline] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-6">
        {/* Bot Identity Card */}
        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                  AX
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base truncate">
                  Assistant-X
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isOnline
                          ? "bg-green-500 animate-pulse"
                          : "bg-destructive"
                      )}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Version</span>
                <div className="font-medium text-foreground">v2.1.4</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="secondary" className="text-xs font-medium">
                  Chat Assistant
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground text-sm">
              Key Metrics
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/50 shadow-sm bg-card/30 hover:bg-card/50 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-blue-500/10">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Conversations
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {(mockStats.totalConversations / 1000).toFixed(1)}K
                  </div>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/30 hover:bg-card/50 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-green-500/10">
                    <Users className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Active Users
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {mockStats.activeUsers}
                  </div>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.2%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/30 hover:bg-card/50 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-orange-500/10">
                    <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Response Time
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {mockStats.avgResponseTime}ms
                  </div>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    -15ms
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/30 hover:bg-card/50 transition-colors duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-purple-500/10">
                    <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Success Rate
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {mockStats.successRate}%
                  </div>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.3%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Health */}
        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Activity className="w-3.5 h-3.5 text-primary" />
              </div>
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium text-foreground">
                  {mockStats.uptime}%
                </span>
              </div>
              <Progress value={mockStats.uptime} className="h-2 bg-muted/50" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="font-medium text-foreground">
                  {mockStats.memoryUsage}%
                </span>
              </div>
              <Progress
                value={mockStats.memoryUsage}
                className="h-2 bg-muted/50"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Token Usage</span>
                <span className="font-medium text-foreground">
                  {(
                    (mockStats.tokensUsed / mockStats.tokensLimit) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={(mockStats.tokensUsed / mockStats.tokensLimit) * 100}
                className="h-2 bg-muted/50"
              />
              <div className="text-xs text-muted-foreground">
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
