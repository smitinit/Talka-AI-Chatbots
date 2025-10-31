"use client";
import { useState, useCallback, memo, type ReactNode } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import {
  ArrowRight,
  Bot,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import dashboardimage from "./assets/dashboard.png";
import dashboardimagewhite from "./assets/dashboard-white.png";
import feature1 from "./assets/personality image.png";
import feature2 from "./assets/multiplatform-integration.jpeg";
import feature3 from "./assets/advance-analysis.jpeg";
import { useTheme } from "next-themes";

interface PowerFeature {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  icon: ReactNode;
}

interface FeatureItem {
  id: number;
  title: string;
  description: string;
}

const powerFeatures: PowerFeature[] = [
  {
    id: "feature-1",
    title: "AI Personality Customization",
    description:
      "Create unique AI personalities with custom traits, knowledge bases, and conversation styles tailored to your brand.",
    image: feature1,
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: "feature-2",
    title: "Multi-Platform Integration",
    description:
      "Deploy your AI bot across websites, mobile apps, and messaging platforms with seamless integration.",
    image: feature2,
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "feature-3",
    title: "Advanced Analytics",
    description:
      "Track conversations, user satisfaction, and bot performance with comprehensive analytics dashboard.",
    image: feature3,
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

const featureItems: FeatureItem[] = [
  {
    id: 1,
    title: "Intelligent Conversation Flow",
    description:
      "Our AI bots understand context and maintain natural conversation flow. They can handle complex queries, remember previous interactions, and provide personalized responses that feel genuinely human.",
  },
  {
    id: 2,
    title: "Custom Knowledge Training",
    description:
      "Train your bot on your specific data, documents, and knowledge base. Upload PDFs, websites, or text files to create a specialized AI assistant that knows your business inside and out.",
  },
  {
    id: 3,
    title: "Multi-Channel Deployment",
    description:
      "Deploy your AI bot across multiple platforms simultaneously. Whether it's your website, mobile app, WhatsApp, Telegram, or custom API integration, manage everything from one dashboard.",
  },
  {
    id: 4,
    title: "Real-Time Analytics & Insights",
    description:
      "Monitor your bot's performance with detailed analytics. Track user satisfaction, conversation success rates, popular queries, and identify areas for improvement with actionable insights.",
  },
  {
    id: 5,
    title: "Advanced Customization Options",
    description:
      "Customize every aspect of your bot's personality, appearance, and behavior. Set custom greetings, fallback responses, conversation tone, and integrate with your existing tools and workflows.",
  },
];

// ============ HERO SECTION ============

const Hero = memo(function Hero() {
  const { theme } = useTheme();
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[500px] h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-40 sm:w-56 md:w-72 lg:w-80 xl:w-96 h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 bg-accent/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-36 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-36 sm:h-48 md:h-64 lg:h-80 xl:h-96 bg-secondary/4 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20">
          <div className="relative flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12">
            <div className="absolute top-1/2 left-1/2 -z-10 transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_left,hsl(var(--primary))_0deg,hsl(var(--accent))_90deg,hsl(var(--primary))_180deg,hsl(var(--accent))_270deg)] blur-[100px] opacity-15" />
              <div className="size-[400px] sm:size-[500px] md:size-[600px] lg:size-[700px] xl:size-[900px] rounded-full border border-border/10 mask-[radial-gradient(circle,white_45%,transparent_75%)] p-6 sm:p-7 md:p-8 lg:p-8">
                <div className="size-full rounded-full border border-border/8 p-6 sm:p-7 md:p-8 lg:p-8">
                  <div className="size-full rounded-full border border-border/5" />
                </div>
              </div>
            </div>

            <div className="relative mx-auto flex size-14 sm:size-16 md:size-18 lg:size-20 xl:size-24 items-center justify-center rounded-full border border-border/40 bg-card/80 backdrop-blur-md shadow-xl">
              <Sparkles className="z-10 size-5 sm:size-6 md:size-7 lg:size-8 xl:size-10 text-primary" />
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_center,hsl(var(--primary))_0deg,hsl(var(--accent))_90deg,hsl(var(--primary))_180deg,hsl(var(--accent))_270deg)] opacity-20 blur-[60px]" />
            </div>

            <div className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8">
              <Badge
                variant="secondary"
                className="mx-auto px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg font-medium"
              >
                <Sparkles className="mr-1.5 sm:mr-2 h-3 sm:h-3.5 md:h-4 lg:h-4 xl:h-5 w-3 sm:w-3.5 md:w-4 lg:w-4 xl:w-5" />
                AI-Powered Conversations
              </Badge>

              <h1 className="mx-auto max-w-6xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight">
                Build Intelligent{" "}
                <span className="bg-linear-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  AI Bots
                </span>{" "}
                in Minutes
              </h1>

              <p className="mx-auto max-w-4xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed">
                Create, customize, and deploy powerful AI assistants that
                understand your business. No coding required—just intelligent
                conversations that convert.
              </p>
            </div>

            <div className="flex justify-center pt-2 sm:pt-3 md:pt-4 lg:pt-5 xl:pt-6">
              <Button
                size="lg"
                className="px-5 sm:px-6 md:px-7 lg:px-8 xl:px-10 py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                asChild
              >
                <Link href="/bots">
                  Start Building Free
                  <ArrowRight className="ml-2 size-3.5 sm:size-4 md:size-5 lg:size-5 xl:size-6" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-0 sm:px-2 md:px-4 lg:px-6 xl:px-8 group">
            {/* Fade overlay gradient */}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-3xl bg-linear-to-b from-transparent via-transparent to-background pointer-events-none z-20 " />

            {/* Image container with fade effect */}
            <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-3xl">
              <Image
                src={theme === "dark" ? dashboardimage : dashboardimagewhite}
                alt="Talka AI Bot Dashboard Preview"
                className="relative z-10 w-full object-cover border-4 border-border/20 shadow-lg sm:shadow-xl md:shadow-2xl lg:shadow-2xl xl:shadow-2xl transition-transform duration-500 group-hover:scale-105"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                }}
                width={1400}
                height={700}
                priority
                unoptimized={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ============ POWERFUL FEATURES SECTION ============

const PowerfulFeaturesSection = memo(function PowerfulFeaturesSection() {
  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-56 sm:w-72 md:w-80 lg:w-96 xl:w-[500px] h-56 sm:h-72 md:h-80 lg:h-96 xl:h-[500px] bg-primary/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 sm:w-80 md:w-96 lg:w-[500px] xl:w-[600px] h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-accent/4 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="flex flex-col gap-12 sm:gap-14 md:gap-16 lg:gap-20 xl:gap-24">
          <div className="flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
            <Badge
              variant="secondary"
              className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg"
            >
              <Sparkles className="mr-1.5 sm:mr-2 h-3 sm:h-3.5 md:h-4 lg:h-4 xl:h-5 w-3 sm:w-3.5 md:w-4 lg:w-4 xl:w-5" />
              Powerful Features
            </Badge>

            <div className="max-w-3xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 text-foreground">
                Built for the{" "}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  Future
                </span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground leading-relaxed">
                Discover the powerful features that make our platform the choice
                of industry leaders. Built with cutting-edge AI technology and
                designed for maximum impact.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5 pt-2 sm:pt-3 md:pt-4 lg:pt-5 xl:pt-6">
              {[
                "No-code bot builder with drag & drop interface",
                "Advanced AI models with custom training",
                "Real-time analytics and performance insights",
                "Enterprise-grade security and compliance",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 xl:gap-4"
                >
                  <CheckCircle className="h-4 sm:h-4 md:h-5 lg:h-5 xl:h-6 w-4 sm:w-4 md:w-5 lg:w-5 xl:w-6 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg text-muted-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full grid gap-5 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl">
              {powerFeatures.map((feature) => (
                <Card
                  key={feature.id}
                  className="overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-card border hover:border-primary/30 p-0"
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={500}
                      height={280}
                      loading="lazy"
                      unoptimized={false}
                    />
                    <div className="absolute top-2 sm:top-2.5 md:top-3 lg:top-3 xl:top-4 left-2 sm:left-2.5 md:left-3 lg:left-3 xl:left-4 bg-background/90 backdrop-blur-sm rounded-lg p-1 sm:p-1.5 md:p-2 lg:p-2 xl:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7">
                    <h3 className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-semibold mb-2 sm:mb-2.5 md:mb-3 lg:mb-3 xl:mb-4 transition-colors duration-200 group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ============ FEATURES SECTION (FAQ STYLE) ============

const FeaturesSection = memo(function FeaturesSection() {
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const handleTabChange = useCallback(
    (tabId: number) => setActiveTabId(tabId),
    []
  );

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20">
          <Badge
            variant="secondary"
            className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg"
          >
            FAQs
          </Badge>
        </div>

        <div className="mx-auto max-w-4xl px-0 sm:px-2 md:px-4 lg:px-6 xl:px-8">
          <Accordion
            type="single"
            className="space-y-2.5 sm:space-y-3 md:space-y-3 lg:space-y-4 xl:space-y-5"
            defaultValue="item-1"
          >
            {featureItems.map((tab) => (
              <AccordionItem
                key={tab.id}
                value={`item-${tab.id}`}
                className="border rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-2xl px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
              >
                <AccordionTrigger
                  onClick={() => handleTabChange(tab.id)}
                  className="cursor-pointer py-3.5 sm:py-4 md:py-5 lg:py-6 xl:py-7 text-left hover:no-underline"
                >
                  <h3
                    className={`text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-semibold transition-colors duration-200 ${
                      tab.id === activeTabId
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {tab.title}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="pb-3.5 sm:pb-4 md:pb-5 lg:pb-6 xl:pb-7">
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed">
                    {tab.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
});

// ============ PAGE COMPONENT ============

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.05),transparent_50%)]" />
      </div>

      <Hero />
      <PowerfulFeaturesSection />
      <FeaturesSection />
    </div>
  );
}
