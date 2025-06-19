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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="rounded-full bg-destructive/10 text-destructive p-4 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-bold mb-1 text-destructive">
        Something went wrong
      </h1>

      <p className="text-muted-foreground mb-6 max-w-md">
        We ran into an error while processing your request. You can retry or
        head back to the dashboard.
      </p>

      <div className="w-full max-w-xl bg-muted p-4 rounded-md text-sm text-left overflow-x-auto border border-border text-red-700">
        <code>{error.message}</code>
      </div>

      {error.digest && (
        <p className="text-xs text-muted-foreground mt-2">
          Error reference: <span className="font-mono">{error.digest}</span>
        </p>
      )}

      <div className="mt-6 flex gap-4">
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
