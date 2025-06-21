"use client";

import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div
      className="flex items-center justify-center min-h-screen text-muted-foreground"
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      <span className="ml-3 text-sm font-medium">Loading...</span>
    </div>
  );
}
