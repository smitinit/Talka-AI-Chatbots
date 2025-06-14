import { ReactNode } from "react";

export const metadata = {
  title: "Talka Dashboard",
  description:
    "Talka Dashboard for managing ai powered personalized chat bots.",
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
