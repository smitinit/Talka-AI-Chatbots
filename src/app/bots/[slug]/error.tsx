"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We encountered an unexpected error. Please try again or return to the
        home page.
      </p>

      <div className="flex gap-4">
        <form action={() => reset()}>
          <Button variant="default" type="submit">
            Retry
          </Button>
        </form>
        <Link href="/" passHref>
          <Button variant="outline">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
