"use client";

import type React from "react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X, Bot, Home, Settings, FileText, Sparkles } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/bots",
    description: "Manage your AI bots and view analytics",
    icon: Home,
  },
  {
    title: "Bots",
    href: "/bots",
    description: "Create and configure your AI assistants",
    icon: Bot,
  },
  {
    title: "Templates",
    href: "/#",
    description: "Pre-built bot templates for quick setup",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/#",
    description: "Account and application preferences",
    icon: Settings,
  },
];

const resources = [
  {
    title: "Documentation",
    href: "/#",
    description: "Learn how to build and deploy AI bots",
  },
  {
    title: "API Reference",
    href: "/#",
    description: "Complete API documentation and examples",
  },
  {
    title: "Community",
    href: "/#",
    description: "Join our community of bot builders",
  },
  {
    title: "Support",
    href: "/#",
    description: "Get help from our support team",
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md -z-10" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Talka AI-Chatbots
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {navigationItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {resources.map((resource) => (
                        <ListItem
                          key={resource.title}
                          title={resource.title}
                          href={resource.href}
                        >
                          {resource.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/#" passHref>
                    <Button variant="ghost">Pricing</Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Link href="/bots">Your all Bots</Link>
            </Button>
            <SignedOut>
              <div className="hidden sm:flex items-center space-x-2">
                <SignInButton mode="redirect">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                    userButtonPopoverCard: "shadow-lg border",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}

              <div className="border-t border-border/40 pt-2 mt-2">
                <Link
                  href="/pricing"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Pricing</span>
                </Link>

                <SignedOut>
                  <div className="px-3 py-2 space-y-2">
                    <SignInButton mode="redirect">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="redirect">
                      <Button size="sm" className="w-full">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>

                <SignedIn>
                  <Link
                    href="/bots"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Dashboard</span>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const ListItem = ({
  className,
  title,
  children,
  href,
  icon: Icon,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2">
            {Icon && (
              <Icon className="h-4 w-4 text-primary group-hover:text-primary/80" />
            )}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
