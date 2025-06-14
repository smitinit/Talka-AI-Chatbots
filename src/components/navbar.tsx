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
import { Card } from "./ui/card";

export default function Navbar() {
  return (
    <header className="border-b z-100  w-full h-fit">
      <Card className="flex justify-between bg-muted/30 m-0  flex-row items-center gap-4 rounded-none border-none p-4 shadow-none">
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
      </Card>
    </header>
  );
}
