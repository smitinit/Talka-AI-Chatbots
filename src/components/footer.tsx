"use client";

import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
    external?: boolean;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    url: "/",
    title: "Talka",
    alt: "Talka AI Bot Platform",
  },
  tagline = "Create intelligent AI bots with ease. No coding required.",
  menuItems = [
    {
      title: "Features",
      links: [
        { text: "Dashboard", url: "/bots" },
        { text: "Bot Builder", url: "/#" },
        { text: "Templates", url: "/#" },
        { text: "Analytics", url: "/#" },
        { text: "API", url: "/#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", url: "/#" },
        { text: "Terms of Service", url: "/#" },
      ],
    },
  ],
}: FooterProps) => {
  return (
    <footer className="relative border-t border-border/30 bg-background z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="py-12">
          {/* Main footer content */}
          <div className="flex flex-col lg:flex-row gap-12 justify-between mb-8">
            {/* Brand section */}
            <div className="shrink-0">
              <Link
                href={logo.url}
                className="flex items-center gap-2 mb-4 group"
              >
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors duration-200">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {logo.title}
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                {tagline}
              </p>
            </div>

            {/* Newsletter signup */}
            <div className="shrink-0">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Stay updated
                </h4>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-9 text-sm"
                    autoFocus={false}
                  />
                  <Button size="sm" className="shrink-0 text-sm">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get the latest updates and features.
                </p>
              </div>
            </div>

            {/* Menu sections */}
            <div className="flex gap-12">
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx} className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        {link.external ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                          >
                            {link.text}
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <Link
                            href={link.url}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                          >
                            {link.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* Bottom section */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2025 {logo.title}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
