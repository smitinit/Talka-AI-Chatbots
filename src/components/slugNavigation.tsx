"use client";

import type React from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  LayoutDashboard,
  SlidersHorizontal,
  Code,
  Settings2,
} from "lucide-react";
import { useBotConfigs } from "./bot-context";

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function BotSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { slug } = useParams();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      id: "bot-overview",
      title: "Bot Overview",
      href: `/bots/${slug}`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: "api",
      title: "API Access",
      href: `/bots/${slug}/talka-api`,
      icon: <Code className="h-5 w-5" />,
    },
    {
      id: "configure",
      title: "Configuration",
      href: `/bots/${slug}/configure`,
      icon: <SlidersHorizontal className="h-5 w-5" />,
    },
    {
      id: "settings",
      title: "Advanced Settings",
      href: `/bots/${slug}/settings`,
      icon: <Settings2 className="h-5 w-5" />,
    },
  ];

  const { configs } = useBotConfigs();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div>{children}</div>
      </div>
    );
  }

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = isActiveLink(item.href);

    return (
      <div key={item.id} className="relative group">
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {/* Icon - Always visible, left-aligned */}
          <div className={`shrink-0 ${isActive ? "text-primary" : ""}`}>
            {item.icon}
          </div>

          {/* Text - Smooth transition */}
          <div
            className={`flex items-center justify-between flex-1 min-w-0 transition-all duration-200 ease-out ${
              isHovered
                ? "opacity-100 translate-x-0 max-w-none"
                : "opacity-0 -translate-x-2 max-w-0 overflow-hidden"
            }`}
          >
            <span className="truncate font-medium whitespace-nowrap">
              {item.title}
            </span>
            {item.badge && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="text-xs shrink-0 ml-2"
              >
                {item.badge}
              </Badge>
            )}
          </div>
        </Link>

        {/* Tooltip for collapsed state */}
        {!isHovered && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border scale-95 group-hover:scale-100">
            {item.title}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-popover" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-16 h-full z-40 transition-all duration-150 ease-out border-r border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 ${
            isHovered ? "w-72" : "w-20"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="">
            <div className="p-4">
              {/* Header - Only bot logo centered */}
              <div className="mb-8 border-b border-border ">
                <div
                  className={`flex items-center gap-3 mb-4 ${
                    !isHovered ? " ml-2 justify-start" : ""
                  }`}
                >
                  <div className="shrink-0">
                    <Bot className="h-7 w-7 text-primary" />
                  </div>
                  <div
                    className={`min-w-0 flex-1 transition-all duration-200 ease-out ${
                      isHovered
                        ? "opacity-100 translate-x-0 max-w-none"
                        : "opacity-0 -translate-x-2 max-w-0 overflow-hidden"
                    }`}
                  >
                    <h2 className="text-xl font-mono text-foreground truncate whitespace-nowrap">
                      {configs.name[0].toUpperCase() + configs.name.slice(1)}
                    </h2>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      Manage your AI assistant
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation - Icons stay left-aligned */}
              <nav className="space-y-2">
                {navigationItems.map((item) => renderNavigationItem(item))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 ml-20">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
