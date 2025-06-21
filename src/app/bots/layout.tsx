import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Talka Dashboard",
  description:
    "Manage all your AI-powered personalized chatbots from one dashboard.",
};

export default function BotsLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
