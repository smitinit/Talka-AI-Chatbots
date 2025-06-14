"use client";

import { useEffect } from "react";
import Link from "next/link";

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
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        We encountered an unexpected error. Please try again or return to the
        home page.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Retry
        </button>

        <Link
          href="/"
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
