"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ActivityIcon,
  AlertCircle,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Zap,
  Database,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Download,
  Share2,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mock data - in real app this would come from API
const mockMetrics = {
  totalConversations: 12847,
  activeUsers: 342,
  avgResponseTime: 270,
  successRate: 98.2,
  uptime: 99.97,
  memoryUsage: 68,
  tokensUsed: 45230,
  tokensLimit: 100000,
  apiCalls: 8934,
  errors: 23,
};

const mockRecentActivity = [
  {
    id: 1,
    type: "success",
    message: "User query processed successfully",
    time: "2 min ago",
    user: "user_123",
  },
  {
    id: 2,
    type: "warning",
    message: "High response time detected (450ms)",
    time: "5 min ago",
    user: "system",
  },
  {
    id: 3,
    type: "success",
    message: "Knowledge base updated",
    time: "12 min ago",
    user: "admin",
  },
  {
    id: 4,
    type: "error",
    message: "API rate limit exceeded",
    time: "18 min ago",
    user: "user_456",
  },
  {
    id: 5,
    type: "info",
    message: "New user conversation started",
    time: "23 min ago",
    user: "user_789",
  },
];

const mockLogs = [
  "[2025-06-19 11:01:22] ⚙️ Bot configuration loaded successfully",
  "[2025-06-19 11:02:10] ✅ User query: 'What are your capabilities?' - Response: 200ms",
  "[2025-06-19 11:02:33] ⚠️ Fallback triggered: retry mechanism activated",
  "[2025-06-19 11:03:11] ❌ Escalation triggered due to timeout (5000ms)",
  "[2025-06-19 11:03:45] 🔄 Auto-recovery initiated",
  "[2025-06-19 11:04:12] ✅ Service restored - Normal operation resumed",
  "[2025-06-19 11:05:33] 📊 Daily metrics aggregated",
  "[2025-06-19 11:06:21] 🔐 Security scan completed - No threats detected",
];

export default function BotOverviewPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2 mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Bot Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor your AI assistant&apos;s performance and health
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <Card
          className={`border-l-4 ${
            isOnline ? "border-l-green-500 " : "border-l-red-500"
          }`}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <div>
                <p className="font-medium">
                  Bot Status:{" "}
                  <span
                    className={isOnline ? "text-green-700" : "text-red-700"}
                  >
                    {isOnline ? "Online & Operational" : "Offline"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {/* Last updated: {new Date().toLocaleTimeString()} */}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isOnline ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
              >
                {isOnline ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isOnline ? "Stop Bot" : "Start Bot"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Logs & Debug</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Conversations
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockMetrics.totalConversations.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockMetrics.activeUsers}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    +8.2% from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Response Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockMetrics.avgResponseTime}ms
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
                    -15ms from last hour
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockMetrics.successRate}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    +0.3% from last week
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Bot Identity Card - Enhanced */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AX</AvatarFallback>
                    </Avatar>
                    Bot Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">Assistant-X</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={isOnline ? "default" : "destructive"}>
                        {isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm">Chat + Task Automation</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Version:</span>
                      <span className="text-sm">v2.1.4</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Persona:</p>
                    <p className="text-sm text-muted-foreground">
                      Friendly, helpful assistant specialized in customer
                      support and task automation
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ActivityIcon className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uptime</span>
                        <span className="font-medium">
                          {mockMetrics.uptime}%
                        </span>
                      </div>
                      <Progress value={mockMetrics.uptime} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span className="font-medium">
                          {mockMetrics.memoryUsage}%
                        </span>
                      </div>
                      <Progress
                        value={mockMetrics.memoryUsage}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Token Usage</span>
                      <span className="font-medium">
                        {mockMetrics.tokensUsed.toLocaleString()} /{" "}
                        {mockMetrics.tokensLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (mockMetrics.tokensUsed / mockMetrics.tokensLimit) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {mockMetrics.apiCalls}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        API Calls Today
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {mockMetrics.avgResponseTime}ms
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg Latency
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {mockMetrics.errors}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Errors Today
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Recent Activity
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {activity.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {activity.time}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {activity.user}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time (24h avg)</span>
                      <span className="font-medium">270ms</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">98.2%</span>
                    </div>
                    <Progress value={98.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Satisfaction</span>
                      <span className="font-medium">4.7/5.0</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">1.2M</p>
                      <p className="text-xs text-muted-foreground">
                        Total Messages
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">45K</p>
                      <p className="text-xs text-muted-foreground">
                        Unique Users
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">89%</p>
                      <p className="text-xs text-muted-foreground">
                        Resolution Rate
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">2.3</p>
                      <p className="text-xs text-muted-foreground">
                        Avg Session Length
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 rounded border p-4 bg-black text-green-400 font-mono text-sm">
                  <div className="space-y-1">
                    {mockLogs.map((log, index) => (
                      <div
                        key={index}
                        className="hover:bg-green-900/20 px-2 py-1 rounded"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Current Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 rounded border p-4 bg-muted text-sm font-mono">
                    <pre className="whitespace-pre-wrap">
                      {`{
  "bot": {
    "name": "Assistant-X",
    "version": "2.1.4",
    "type": "chat-task-automation",
    "status": "online"
  },
  "ai_model": {
    "provider": "openai",
    "model": "gpt-4-turbo",
    "max_tokens": 4096,
    "temperature": 0.7,
    "top_p": 0.9
  },
  "capabilities": {
    "web_search": true,
    "tool_use": true,
    "memory_enabled": true,
    "voice_mode": false
  },
  "limits": {
    "rate_limit": "60/min",
    "max_conversation_length": 50,
    "token_limit": 100000
  },
  "integrations": {
    "webhook_url": "https://api.example.com/webhook",
    "knowledge_base": "enabled",
    "external_apis": ["weather", "calendar", "email"]
  }
}`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Configuration
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restart Bot
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Config
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Clear Memory
                  </Button>
                  <Separator />
                  <Button
                    className="w-full justify-start"
                    variant="destructive"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency Stop
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
