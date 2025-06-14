"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { DialogDescription } from "@radix-ui/react-dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      router.back();
    }
  }

  return createPortal(
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card rounded-xl p-0 border-none shadow-none ">
        <VisuallyHidden>
          <DialogTitle>Create Bot Modal</DialogTitle>
          <DialogDescription>
            This modal is to create a new bot.
          </DialogDescription>
        </VisuallyHidden>

        {children}
      </DialogContent>
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
