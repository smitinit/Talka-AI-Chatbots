"use client";

import Link from "next/link";
import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
} from "lucide-react";
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
      title: "Product",
      links: [
        { text: "Dashboard", url: "/bots" },
        { text: "Bot Builder", url: "/#" },
        { text: "Templates", url: "/#" },
        { text: "Analytics", url: "/#" },
        { text: "Integrations", url: "/#" },
        { text: "API", url: "/#-docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/#" },
        { text: "Careers", url: "/#" },
        { text: "Blog", url: "/#" },
        { text: "Contact", url: "/#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Documentation", url: "/#" },
        { text: "Help Center", url: "/#" },
        { text: "Community", url: "/#" },
        { text: "Status", url: "/#", external: true },
        { text: "Changelog", url: "/#" },
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
    <footer className="relative border-t border-border/40 bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        <div className="container mx-auto px-10 pt-16 pb-8">
          {/* Main footer content */}
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            {/* Brand section */}
            <div className="col-span-2 mb-8 lg:mb-0">
              <Link
                href={logo.url}
                className="flex items-center gap-3 mb-4 group"
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {logo.title}
                </span>
              </Link>

              <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
                {tagline}
              </p>

              {/* Newsletter signup */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Stay updated
                </h4>
                <div className="flex gap-2 max-w-sm">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-9 text-sm"
                  />
                  <Button size="sm" className="shrink-0">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get the latest updates and features delivered to your inbox.
                </p>
              </div>
            </div>

            {/* Menu sections */}
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-3">
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
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 block"
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

          {/* Social links section */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Follow us
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    asChild
                  >
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    asChild
                  >
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    asChild
                  >
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    asChild
                  >
                    <a href="mailto:hello@talka.com">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Made with ❤️ for the AI community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
