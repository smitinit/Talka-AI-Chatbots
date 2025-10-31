"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { DialogDescription } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function Modal({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      router.back();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("bg-card rounded-xl border-none shadow-none ", classname)}
      >
        <VisuallyHidden>
          <DialogTitle>Create Bot Modal</DialogTitle>
          <DialogDescription>
            This modal is to create a new bot.
          </DialogDescription>
        </VisuallyHidden>

        {children}
      </DialogContent>
    </Dialog>
  );
}
