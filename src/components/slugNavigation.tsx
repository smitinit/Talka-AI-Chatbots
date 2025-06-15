"use client";

import type React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, FolderCog, ChevronRight, Bot } from "lucide-react";
import { useBot } from "./bot-context";
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
      id: "configure",
      title: "Configure",
      href: `/bots/${slug}/configure`,
      icon: <Settings className="h-4 w-4" />,
      // children: [
      //   {
      //     id: "personality",
      //     title: "Personality",
      //     href: `/bots/${slug}/configure/personality`,
      //     icon: <Bot className="h-4 w-4" />,
      //   },
      //   {
      //     id: "appearance",
      //     title: "Appearance",
      //     href: `/bots/${slug}/configure/appearance`,
      //     icon: <Palette className="h-4 w-4" />,
      //   },
      //   {
      //     id: "notifications",
      //     title: "Notifications",
      //     href: `/bots/${slug}/configure/notifications`,
      //     icon: <Bell className="h-4 w-4" />,
      //     badge: "3",
      //   },
      // ],
    },
    {
      id: "api",
      title: "API",
      href: `/bots/${slug}/talka-api`,
      icon: <Key className="h-4 w-4" />,
      // children: [
      //   {
      //     id: "api-keys",
      //     title: "API Keys",
      //     href: `/bots/${slug}/talka-api/keys`,
      //     icon: <Key className="h-4 w-4" />,
      //   },
      //   {
      //     id: "webhooks",
      //     title: "Webhooks",
      //     href: `/bots/${slug}/talka-api/webhooks`,
      //     icon: <Webhook className="h-4 w-4" />,
      //   },
      //   {
      //     id: "endpoints",
      //     title: "Endpoints",
      //     href: `/bots/${slug}/talka-api/endpoints`,
      //     icon: <Code className="h-4 w-4" />,
      //   },
      // ],
    },
    {
      id: "settings",
      title: "Settings",
      href: `/bots/${slug}/settings`,
      icon: <FolderCog className="h-4 w-4" />,
      // children: [
      //   {
      //     id: "general",
      //     title: "General",
      //     href: `/bots/${slug}/settings/`,
      //     icon: <Globe className="h-4 w-4" />,
      //   },
      //   // {
      //   //   id: "security",
      //   //   title: "Security",
      //   //   href: `/bots/${slug}/settings/security`,
      //   //   icon: <Shield className="h-4 w-4" />,
      //   // },
      //   // {
      //   //   id: "team",
      //   //   title: "Team",
      //   //   href: `/bots/${slug}/settings/team`,
      //   //   icon: <Users className="h-4 w-4" />,
      //   // },
      //   // {
      //   //   id: "billing",
      //   //   title: "Billing",
      //   //   href: `/bots/${slug}/settings/billing`,
      //   //   icon: <CreditCard className="h-4 w-4" />,
      //   //   badge: "Pro",
      //   // },
      //   // {
      //   //   id: "data",
      //   //   title: "Data & Storage",
      //   //   href: `/bots/${slug}/settings/data`,
      //   //   icon: <Database className="h-4 w-4" />,
      //   // },
      // ],
    },
  ];
  const bot = useBot();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const isParentActive = (item: NavigationItem) => {
    if (isActiveLink(item.href)) return true;
    return item.children?.some((child) => isActiveLink(child.href)) || false;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isActiveLink(item.href);
    const isParentExpanded = isParentActive(item);
    const hasChildren = item.children && item.children.length > 0;

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
          {hasChildren && (
            <ChevronRight
              className={`h-4 w-4 shrink-0  ${
                isParentExpanded ? "rotate-90" : ""
              } ${isActive ? "text-primary" : "text-muted-foreground"}`}
            />
          )}
        </Link>

        {hasChildren && isParentExpanded && (
          <div className="space-y-1 pb-2">
            {item.children!.map((child) =>
              renderNavigationItem(child, level + 1)
            )}
          </div>
        )}
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
                    variant="outline"
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
