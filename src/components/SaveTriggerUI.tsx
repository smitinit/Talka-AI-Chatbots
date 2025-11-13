"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

interface SaveTriggerUIProps {
  isDirty: boolean;
  isSubmitting: boolean;
  isPendingUpdate: boolean;
  onSave: () => void;
  phrase?: string;
}

export default function SaveTriggerUI({
  isDirty,
  isSubmitting,
  isPendingUpdate,
  onSave,
  phrase = "",
}: SaveTriggerUIProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isDirty) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isDirty]);

  const isLoading = isSubmitting || isPendingUpdate;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-60 transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Border line at the top */}
      <div className="h-px bg-linear-to-r from-border via-border to-border" />

      {/* Main container */}
      <div className="bg-background/95 backdrop-blur-md border-t border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left side - Change detection message */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
              <AlertCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">
                Changes detected in {phrase}
              </p>
              <p className="text-xs text-muted-foreground">
                Press save to save your changes
              </p>
            </div>
          </div>

          {/* Right side - Save button */}
          <Button
            onClick={onSave}
            disabled={isLoading}
            size="sm"
            className="ml-auto gap-2 px-4 h-9 font-medium"
          >
            {isLoading ? (
              <>
                {/* <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> */}
                <Spinner />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
