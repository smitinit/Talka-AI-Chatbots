"use client";

import placeholderImage from "./assets/placeholder.webp";
import type React from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Timer,
  Zap,
  ZoomIn,
  PersonStanding,
  DollarSign,
  MessagesSquare,
  Bot,
  Sparkles,
  Star,
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

interface PowerFeature {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

const powerFeatures: PowerFeature[] = [
  {
    id: "feature-1",
    title: "AI Personality Customization",
    description:
      "Create unique AI personalities with custom traits, knowledge bases, and conversation styles tailored to your brand.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "feature-2",
    title: "Multi-Platform Integration",
    description:
      "Deploy your AI bot across websites, mobile apps, and messaging platforms with seamless integration.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "feature-3",
    title: "Advanced Analytics",
    description:
      "Track conversations, user satisfaction, and bot performance with comprehensive analytics dashboard.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "feature-4",
    title: "Real-time Learning",
    description:
      "Your AI bot continuously learns from interactions to provide better responses and user experiences.",
    image: "/placeholder.svg?height=300&width=400",
  },
];

const coreFeatures: Feature[] = [
  {
    title: "Lightning Fast",
    description:
      "Optimized for speed with sub-second response times and efficient resource usage for the best user experience.",
    icon: <Timer className="h-6 w-6" />,
  },
  {
    title: "AI-Powered",
    description:
      "Built with cutting-edge AI technology that adapts and learns from every interaction to improve over time.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Enterprise Quality",
    description:
      "Production-ready with enterprise-grade security, reliability, and scalability for businesses of all sizes.",
    icon: <ZoomIn className="h-6 w-6" />,
  },
  {
    title: "Accessible Design",
    description:
      "Built with accessibility in mind, ensuring your AI bot works for everyone, regardless of their abilities.",
    icon: <PersonStanding className="h-6 w-6" />,
  },
  {
    title: "Cost Effective",
    description:
      "Transparent pricing with no hidden fees. Start free and scale as you grow with flexible pricing plans.",
    icon: <DollarSign className="h-6 w-6" />,
  },
  {
    title: "24/7 Support",
    description:
      "Get help when you need it with our dedicated support team and comprehensive documentation.",
    icon: <MessagesSquare className="h-6 w-6" />,
  },
];

const featureItems: FeatureItem[] = [
  {
    id: 1,
    title: "Intelligent Conversation Flow",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Our AI bots understand context and maintain natural conversation flow. They can handle complex queries, remember previous interactions, and provide personalized responses that feel genuinely human.",
  },
  {
    id: 2,
    title: "Custom Knowledge Training",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Train your bot on your specific data, documents, and knowledge base. Upload PDFs, websites, or text files to create a specialized AI assistant that knows your business inside and out.",
  },
  {
    id: 3,
    title: "Multi-Channel Deployment",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Deploy your AI bot across multiple platforms simultaneously. Whether it's your website, mobile app, WhatsApp, Telegram, or custom API integration, manage everything from one dashboard.",
  },
  {
    id: 4,
    title: "Real-Time Analytics & Insights",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Monitor your bot's performance with detailed analytics. Track user satisfaction, conversation success rates, popular queries, and identify areas for improvement with actionable insights.",
  },
  {
    id: 5,
    title: "Advanced Customization Options",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Customize every aspect of your bot's personality, appearance, and behavior. Set custom greetings, fallback responses, conversation tone, and integrate with your existing tools and workflows.",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/6 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent/8 dark:bg-accent/12 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="relative flex flex-col gap-6 lg:gap-8">
            {/* Concentric Circles */}
            <div className="absolute top-1/2 left-1/2 -z-10 mx-auto transform -translate-x-1/2 -translate-y-1/2">
              {/* Subtle Conic Gradient Glow */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_left,#6366f1_0deg,#a855f7_90deg,#6366f1_180deg,#a855f7_270deg)] blur-[120px] opacity-20" />

              {/* Concentric Circles */}
              <div className="size-[500px] md:size-[700px] lg:size-[900px] rounded-full border border-border/15 [mask-image:radial-gradient(circle,white_45%,transparent_75%)] p-8 md:p-12 lg:p-16">
                <div className="size-full rounded-full border border-border/10 p-8 md:p-12 lg:p-16">
                  <div className="size-full rounded-full border border-border/5" />
                </div>
              </div>
            </div>

            {/* Bot Icon */}
            <div className="relative mx-auto flex size-18 md:size-20 items-center justify-center rounded-full border border-border/40 bg-card/80 backdrop-blur-md shadow-xl">
              <Bot className="z-10 size-7 md:size-8 text-primary" />
              {/* Subtle Conic glow */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_center,_#6366f1_0deg,_#a855f7_90deg,_#6366f1_180deg,_#a855f7_270deg)] opacity-20 blur-[60px]" />
            </div>

            {/* Main Heading */}
            <h1 className="mx-auto max-w-4xl text-center text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              Personalize Your{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text ">
                AI Bot
              </span>{" "}
              Experience
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-center text-lg md:text-xl text-muted-foreground leading-relaxed">
              Create, customize, and deploy your own AI bot with just a few
              clicks. No coding required - just intelligent conversations.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col items-center justify-center gap-5 pt-2">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/bots">
                  Get Started Now
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>Trusted by 10,000+ Businesses Worldwide</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-5xl">
            <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl" />
            <img
              src={placeholderImage.src}
              alt="AI Bot Dashboard Preview"
              className="relative z-10 mx-auto h-full w-full rounded-xl md:rounded-2xl object-cover border shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PowerfulFeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="lg:max-w-lg">
            <Badge variant="secondary" className="mb-5 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Powerful Features
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-foreground">
              Built for the Future
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-7 leading-relaxed">
              Discover the powerful features that make our platform stand out
              from the rest. Built with the latest AI technology and designed
              for maximum productivity.
            </p>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group px-6 py-6 text-lg hover:scale-105 transition-transform"
            >
              <Link href="/demo">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 grid gap-6 md:grid-cols-2">
            {powerFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card border hover:border-primary/20"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={placeholderImage.src}
                    alt={feature.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3 transition-all duration-200 group-hover:-translate-y-1 group-hover:text-primary">
                    <Sparkles className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [activeImage, setActiveImage] = useState(featureItems[0].image);

  const handleTabChange = useCallback((tabId: number, image: string) => {
    setActiveTabId(tabId);
    setActiveImage(image);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/4 dark:bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/4 dark:bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-5 px-4 py-2">
            Advanced Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-foreground">
            Everything You Need for Intelligent Conversations
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the powerful features that make our AI bots stand out from
            the rest.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
          <div className="w-full lg:w-1/2">
            <Accordion
              type="single"
              className="space-y-3"
              defaultValue="item-1"
            >
              {featureItems.map((tab) => (
                <div
                  key={tab.id}
                  className="hover:translate-x-1 transition-transform duration-200"
                >
                  <AccordionItem
                    value={`item-${tab.id}`}
                    className="border rounded-xl px-5 bg-card hover:shadow-md transition-all duration-200"
                  >
                    <AccordionTrigger
                      onClick={() => handleTabChange(tab.id, tab.image)}
                      className="cursor-pointer py-6 text-left hover:no-underline"
                    >
                      <h3
                        className={`text-xl md:text-2xl font-semibold transition-colors duration-200 ${
                          tab.id === activeTabId
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        {tab.title}
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {tab.description}
                      </p>
                      <div className="mt-5 lg:hidden">
                        <img
                          src={placeholderImage.src}
                          alt={tab.title}
                          className="w-full rounded-xl object-cover border shadow-md"
                          loading="lazy"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>

          <div className="relative w-full lg:w-1/2 hidden lg:block">
            <div className="sticky top-6">
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl" />
              <img
                key={activeImage}
                src={placeholderImage.src}
                alt="Feature preview"
                className="relative z-10 w-full aspect-[4/3] rounded-xl object-cover border shadow-2xl transition-opacity duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoreFeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-5 px-4 py-2">
            Core Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Why Choose Our Platform
          </h2>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {coreFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="group hover:-translate-y-2 hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 border border-transparent bg-background hover:border-border/50 hover:shadow-lg hover:bg-muted/30">
                <div className="relative mb-5 hover:rotate-6 transition-transform duration-200">
                  <div className="bg-primary/10 p-3 rounded-xl group-hover:scale-105 transition-transform duration-200">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold mb-3 transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/2 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/2 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/3 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent/3 dark:bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-60 h-60 bg-secondary/3 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <Hero />
      <PowerfulFeaturesSection />
      <FeaturesSection />
      <CoreFeaturesSection />

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-primary text-primary-foreground">
        {/* Subtle Conic Gradient Background */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-[140%] w-[140%] rounded-full bg-[conic-gradient(at_center,_#6366f1_0deg,_#a855f7_90deg,_#6366f1_180deg,_#a855f7_270deg)] opacity-10 blur-[100px] pointer-events-none -z-10" />

        <div className="container px-4 md:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-4xl leading-tight">
              Ready to Create Your AI Bot?
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl text-lg md:text-xl leading-relaxed">
              Join thousands of developers and businesses who are already
              building amazing AI experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <Link href="/bots">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:scale-105 transition-all"
              >
                <Link href="/demo">View Live Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
