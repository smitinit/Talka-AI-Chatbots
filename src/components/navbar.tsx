"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center gap-4 h-16 border-b p-4">
      <Link href="/" className="text-3xl">
        Talka
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
