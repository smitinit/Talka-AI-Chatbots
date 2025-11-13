// components/ConfirmActionDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";

interface ConfirmActionDialogProps {
  title: string;
  description: string;
  actionLabel?: string;
  triggerLabel: string;
  onConfirm: () => void;
  variant?: "default" | "destructive" | "outline";
  icon: React.ReactNode;
  disabled?: boolean;
  isDestructive?: boolean;
}

export function ConfirmActionDialog({
  title,
  description,
  actionLabel = "Confirm",
  triggerLabel,
  onConfirm,
  variant = "outline",
  icon,
  disabled,
  isDestructive = false,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} variant={variant}>
          {disabled ? (
            <Spinner />
          ) : (
            <>
              {icon} {triggerLabel}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={isDestructive ? "bg-red-500" : ""}
            onClick={onConfirm}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
