"use client";

import type React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  LayoutDashboard,
  SlidersHorizontal,
  Code,
  Settings2,
} from "lucide-react";
import { useBotData } from "./bot-context";
import { Button } from "./ui/button";

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavigationItem[];
}

export default function BotSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { slug } = useParams();
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      id: "bot-overview",
      title: "Bot Overview",
      href: `/bots/${slug}`,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "configure",
      title: "Configuration",
      href: `/bots/${slug}/configure`,
      icon: <SlidersHorizontal className="h-4 w-4" />,
    },
    {
      id: "api",
      title: "API Access",
      href: `/bots/${slug}/talka-api`,
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "settings",
      title: "Advanced Settings",
      href: `/bots/${slug}/settings`,
      icon: <Settings2 className="h-4 w-4" />,
    },
  ];

  const { bot } = useBotData();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isActiveLink(item.href);

    return (
      <div key={item.id} className="space-y-1">
        <Link
          href={item.href}
          className={`group flex items-center justify-between px-3 py-2.5 text-sm rounded-lg   ${
            level > 0 ? "ml-4" : ""
          } ${
            isActive
              ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`shrink-0 ${isActive ? "text-primary" : ""}`}>
              {item.icon}
            </div>
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="text-xs shrink-0"
              >
                {item.badge}
              </Badge>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 lg:w-72 shrink-0 border-r border-border/40 bg-background">
          <div className="sticky top-16 h-screen overflow-y-auto ">
            <div className="p-4">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 ">
                  <span className="text-2xl font-mono text-foreground  flex gap-2 ">
                    <Bot className="h-7 w-7" />
                    <h2>{bot.name}</h2>
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    back
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your AI assistant
                </p>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => renderNavigationItem(item))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="p-6">{children}</div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 hidden"
        id="mobile-sidebar-overlay"
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border/40 z-50">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Bot Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure your AI assistant
              </p>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => renderNavigationItem(item))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
