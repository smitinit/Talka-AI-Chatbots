"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Code, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Badge className="px-3 py-1 text-sm">Now Available</Badge>

            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Personalize Your AI Bot Experience
            </h1>

            <p className="text-muted-foreground max-w-[700px] md:text-xl">
              Create, customize, and deploy your own AI bot with just a few
              clicks.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/bots">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToFeatures}>
                Learn More
              </Button>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="text-primary mr-2 h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-primary mr-2 h-4 w-4" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-primary mr-2 h-4 w-4" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-muted/30 w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-[700px]">
              Everything you need to create and deploy your personalized AI bot
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Sparkles className="text-primary h-6 w-6" />,
                title: "Personalization",
                description:
                  "Customize your bot's personality, knowledge, and responses to match your brand.",
                borderColor: "border-l-primary",
              },
              {
                icon: <Bot className="text-primary h-6 w-6" />,
                title: "Easy Integration",
                description:
                  "Integrate with your website or app in minutes with our simple API.",
                borderColor: "border-l-primary",
              },
              {
                icon: <Code className="text-primary h-6 w-6" />,
                title: "Developer Friendly",
                description:
                  "Access advanced features through our comprehensive API with secure key management.",
                borderColor: "border-l-primary",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className={cn("h-full border-l-4", feature.borderColor)}
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
