"use client";

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
import { Menu, X, Bot, Home, Settings, FileText } from "lucide-react";
import Logo from "../app/assets/ChatGPT Image Nov 6, 2025, 02_51_42 PM.png";
import Image from "next/image";
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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10 group">
            <Image
              src={Logo.src}
              alt="Quick Bots Logo"
              className="object-contain"
              width={48}
              height={48}
            />
            <h1 className="font-getvoip text-lg font-bold text-foreground tracking-wide">
              QUICK BOTS
            </h1>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Link href="/bots">Your all Bots</Link>
            </Button>
            <ThemeToggle />
            <SignedOut>
              <div className="hidden sm:flex items-center gap-2">
                <SignInButton mode="redirect">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-sm"
                  >
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
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md">
            <div className="px-2 py-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}

              <div className="border-t border-border/30 pt-3 mt-3">
                <Link
                  href="/pricing"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent/50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Pricing</span>
                </Link>

                <SignedOut>
                  <div className="px-3 py-3 space-y-2">
                    <SignInButton mode="redirect">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-sm bg-transparent"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="redirect">
                      <Button size="sm" className="w-full text-sm">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>

                <SignedIn>
                  <Link
                    href="/bots"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent/50 transition-colors duration-200"
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
