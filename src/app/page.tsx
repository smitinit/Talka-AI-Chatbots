"use client";

import type React from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Timer,
  Zap,
  Shield,
  Users,
  DollarSign,
  MessagesSquare,
  Bot,
  Sparkles,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Rocket,
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
import placeholderImage from "./assets/placeholder.webp";
import Image from "next/image";

interface PowerFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
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
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: "feature-2",
    title: "Multi-Platform Integration",
    description:
      "Deploy your AI bot across websites, mobile apps, and messaging platforms with seamless integration.",
    image: "/placeholder.svg?height=300&width=400",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "feature-3",
    title: "Advanced Analytics",
    description:
      "Track conversations, user satisfaction, and bot performance with comprehensive analytics dashboard.",
    image: "/placeholder.svg?height=300&width=400",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: "feature-4",
    title: "Real-time Learning",
    description:
      "Your AI bot continuously learns from interactions to provide better responses and user experiences.",
    image: "/placeholder.svg?height=300&width=400",
    icon: <Rocket className="h-5 w-5" />,
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
    title: "Enterprise Security",
    description:
      "Production-ready with enterprise-grade security, reliability, and scalability for businesses of all sizes.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "User-Friendly",
    description:
      "Built with accessibility in mind, ensuring your AI bot works for everyone, regardless of their abilities.",
    icon: <Users className="h-6 w-6" />,
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

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    content:
      "Talka transformed our customer support. Response times dropped by 80% and satisfaction scores increased dramatically.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder at StartupX",
    content:
      "The easiest AI bot platform I've used. Had our first bot running in under 10 minutes with zero coding required.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Watson",
    role: "Head of Operations at ScaleUp",
    content:
      "The analytics insights helped us understand our customers better. ROI was positive within the first month.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 dark:bg-primary/12 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent/6 dark:bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-secondary/4 dark:bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:gap-12">
          <div className="relative flex flex-col gap-8 lg:gap-10">
            {/* Concentric Circles Background */}
            <div className="absolute top-1/2 left-1/2 -z-10 mx-auto transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_left,hsl(var(--primary))_0deg,hsl(var(--accent))_90deg,hsl(var(--primary))_180deg,hsl(var(--accent))_270deg)] blur-[120px] opacity-15" />
              <div className="size-[500px] md:size-[700px] lg:size-[900px] rounded-full border border-border/10 [mask-image:radial-gradient(circle,white_45%,transparent_75%)] p-8 md:p-12 lg:p-16">
                <div className="size-full rounded-full border border-border/8 p-8 md:p-12 lg:p-16">
                  <div className="size-full rounded-full border border-border/5" />
                </div>
              </div>
            </div>

            {/* Bot Icon */}
            <div className="relative mx-auto flex size-20 md:size-24 items-center justify-center rounded-full border border-border/40 bg-card/80 backdrop-blur-md shadow-xl">
              <Sparkles className="z-10 size-8 md:size-10 text-primary" />
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_center,hsl(var(--primary))_0deg,hsl(var(--accent))_90deg,hsl(var(--primary))_180deg,hsl(var(--accent))_270deg)] opacity-20 blur-[60px]" />
            </div>

            {/* Main Heading */}
            <div className="text-center space-y-6">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI-Powered Conversations
              </Badge>

              <h1 className="mx-auto max-w-5xl text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                Build Intelligent{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  AI Bots
                </span>{" "}
                in Minutes
              </h1>

              <p className="mx-auto max-w-3xl text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Create, customize, and deploy powerful AI assistants that
                understand your business. No coding required - just intelligent
                conversations that convert.
              </p>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col items-center justify-center gap-8 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="px-10 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link href="/bots">
                    Start Building Free
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-6 text-lg hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 from 2,000+ reviews</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-muted-foreground/40 rounded-full" />
                <span>Trusted by 10,000+ businesses worldwide</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-6xl">
            <Image
              src={placeholderImage}
              alt="Talka AI Bot Dashboard Preview"
              className="relative z-10 mx-auto h-full w-full rounded-2xl object-cover border border-border/20 shadow-2xl"
              loading="eager"
              fill={false}
              width={1200}
              height={600}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PowerfulFeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/4 dark:bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/4 dark:bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          <div className="lg:max-w-xl">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Powerful Features
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Built for the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Future
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Discover the powerful features that make our platform the choice
              of industry leaders. Built with cutting-edge AI technology and
              designed for maximum impact.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "No-code bot builder with drag & drop interface",
                "Advanced AI models with custom training",
                "Real-time analytics and performance insights",
                "Enterprise-grade security and compliance",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group px-8 py-6 text-lg hover:scale-105 transition-all duration-200"
            >
              <Link href="#">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 grid gap-8 md:grid-cols-2">
            {powerFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="overflow-hidden group hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 bg-card border hover:border-primary/30"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Image
                    src={placeholderImage}
                    alt={feature.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    fill={false}
                    width={400}
                    height={225}
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {feature.icon}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3 transition-all duration-200 group-hover:text-primary">
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
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Advanced Capabilities
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligent Conversations
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover the comprehensive features that make our AI bots the most
            advanced and user-friendly in the market.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <Accordion
              type="single"
              className="space-y-4"
              defaultValue="item-1"
            >
              {featureItems.map((tab) => (
                <div
                  key={tab.id}
                  className="hover:translate-x-2 transition-transform duration-200"
                >
                  <AccordionItem
                    value={`item-${tab.id}`}
                    className="border rounded-2xl px-6 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
                  >
                    <AccordionTrigger
                      onClick={() => handleTabChange(tab.id, tab.image)}
                      className="cursor-pointer py-8 text-left hover:no-underline"
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
                    <AccordionContent className="pb-8">
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {tab.description}
                      </p>
                      <div className="mt-6 lg:hidden">
                        <Image
                          src={placeholderImage}
                          alt={tab.title}
                          className="w-full rounded-xl object-cover border shadow-lg"
                          loading="lazy"
                          width={600}
                          height={400}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>

          <div className="relative w-full lg:w-1/2 hidden lg:block">
            <div className="sticky top-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-2xl" />
              <Image
                key={activeImage}
                src={placeholderImage}
                alt="Feature preview"
                className="relative z-10 w-full aspect-[4/3] rounded-2xl object-cover border border-border/20 shadow-2xl transition-opacity duration-300"
                loading="lazy"
                width={600}
                height={400}
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
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Core Benefits
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Talka
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Built by AI experts, trusted by industry leaders, and designed for
            businesses of all sizes.
          </p>
        </div>

        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {coreFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="group hover:-translate-y-3 hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 border border-transparent bg-background hover:border-border/50 hover:shadow-xl hover:bg-card">
                <div className="relative mb-6 hover:rotate-6 transition-transform duration-200">
                  <div className="bg-primary/10 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-200">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-colors group-hover:text-primary">
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

function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/4 dark:bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/4 dark:bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Customer Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how businesses are transforming their customer experience with
            Talka AI bots.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card border hover:border-primary/20"
            >
              <CardContent className="p-0">
                <div className="flex -space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={placeholderImage}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.05),transparent_50%)]" />
      </div>

      <Hero />
      <PowerfulFeaturesSection />
      <FeaturesSection />
      <CoreFeaturesSection />
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground">
        <div className="absolute inset-0 bg-[conic-gradient(at_center,transparent_0deg,rgba(255,255,255,0.1)_90deg,transparent_180deg,rgba(255,255,255,0.1)_270deg)] pointer-events-none" />

        <div className="container px-4 md:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Ready to Launch
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-5xl leading-tight">
              Ready to Transform Your Business with AI?
            </h2>

            <p className="text-primary-foreground/90 max-w-3xl text-xl md:text-2xl leading-relaxed">
              Join thousands of businesses already using Talka to create
              intelligent, engaging conversations that drive results.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="px-10 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Link href="/bots">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="px-10 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Link href="#">
                  Talk to Sales
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 text-primary-foreground/80 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Free 14-day trial</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-primary-foreground/40 rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-primary-foreground/40 rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
