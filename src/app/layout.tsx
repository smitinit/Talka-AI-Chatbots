import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Talka · AI Chatbots",
    template: "%s · Talka",
  },
  description:
    "Talka is a personalized multi-tenant powerhouse for AI-driven chatbots.",
  icons: { icon: "/favicon.ico" },
  // themeColor: "#ffffff",
  // viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Talka · AI Chatbots",
    description:
      "Create, configure and manage AI-powered chatbots in one place.",
    // url: "https://talka.ai",
    siteName: "Talka",
    // images: [{ url: "/og.png", width: 1200, height: 630, alt: "Talka" }],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Talka · AI Chatbots",
    description:
      "Create, configure and manage AI-powered chatbots in one place.",
    // images: ["/og.png"],
  },
  robots: { follow: true, index: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased">
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
