"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  "configure",
  "settings",
  "advance",
  "talka-api",
  "danger",
  // "editor",
  // "preview",
];

const routeLabels: Record<string, string> = {
  configure: "Configure",
  "talka-api": "Api / Connect",
  settings: "Settings",
  advance: "Advance Settings",
  danger: "Danger Zone",
};

export function TabsNavigation({ slug }: { slug: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const current = pathname.split("/").pop();
  const activeTab = routes.includes(current ?? "") ? current : "configure";

  return (
    <div className="max-w-4xl mx-auto px-6 pt-6 ">
      <Tabs
        value={activeTab}
        className={cn("w-full overflow-x-auto whitespace-nowrap ")}
      >
        <TabsList
          className={cn(
            "flex items-center rounded-xl bg-muted px-2 py-1 border-border border",
            "space-x-1 "
          )}
        >
          {routes.map((route) => (
            <TabsTrigger
              key={route}
              value={route}
              onClick={() => router.push(`/bots/${slug}/${route}`)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium",
                "transition-colors duration-200",
                "hover:bg-muted/80 hover:text-foreground",
                "data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              {routeLabels[route] || route.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
