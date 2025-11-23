"use client";

import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import PreviewLayoutForm from "@/features/preview/previewFormLayout";
import { cn } from "@/lib/utils";
import { Eye, BarChart3 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePreviewModal } from "@/contexts/preview-modal-context";

const routes = [
  "configure",
  "settings",
  "advance",
  "talka-api",
  "danger",
  // "editor",
  // "preview",
];

const routeLabels: Record<string, string> = {
  configure: "Configure",
  "talka-api": "Api / Connect",
  settings: "Settings",
  advance: "Advance Settings",
  danger: "Danger Zone",
};

interface TabsNavigationProps {
  slug: string;
  enableMobileAnalytics?: boolean;
  onOpenAnalytics?: () => void;
}

export function TabsNavigation({
  slug,
  enableMobileAnalytics,
  onOpenAnalytics,
}: TabsNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isPreviewOpen, setIsPreviewOpen } = usePreviewModal();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isDirtyRef = useRef(false);

  const current = pathname.split("/").pop();
  const activeTab = routes.includes(current ?? "") ? current : "configure";

  // Handle modal open/close - simple state management, no URL
  const handlePreviewOpenChange = (open: boolean) => {
    if (!open && isDirtyRef.current) {
      // User is trying to close with unsaved changes
      setShowConfirmDialog(true);
    } else {
      setIsPreviewOpen(open);
    }
  };

  // Handle preview button click
  const handlePreviewClick = () => {
    setIsPreviewOpen(true);
  };

  // Handle dirty state change from form
  const handleDirtyChange = (isDirty: boolean) => {
    isDirtyRef.current = isDirty;
  };

  // Handle confirmation dialog actions
  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setIsPreviewOpen(false);
    isDirtyRef.current = false; // Reset dirty state after closing
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 pt-6 ">
        <Tabs
          value={activeTab}
          className={cn("w-full overflow-x-auto whitespace-nowrap ")}
        >
          <TabsList
            className={cn(
              "flex items-center rounded-xl bg-muted px-2 py-1 border-border border",
              "space-x-1 "
            )}
          >
            {routes.map((route) => (
              <div key={route} className="flex items-center">
                <TabsTrigger
                  value={route}
                  onClick={() => {
                    const newPath = `/bots/${slug}/${route}`;
                    router.push(newPath, { scroll: false });
                  }}
                  className={cn(
                    "px-3 py-0.5 text-sm font-medium",
                    "transition-colors duration-200",
                    "hover:bg-muted/80 hover:text-foreground",
                    "data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  {routeLabels[route] || route.replace("-", " ")}
                </TabsTrigger>
                {/* Add Preview button right after Danger Zone */}
                {route === "danger" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handlePreviewClick}
                      className={cn(
                        "px-3 py-0.5 text-sm font-medium h-auto",
                        "transition-all duration-200",
                        "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
                        "border-blue-200 dark:border-blue-800",
                        "text-blue-700 dark:text-blue-300",
                        "hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40",
                        "hover:border-blue-300 dark:hover:border-blue-700",
                        "hover:shadow-sm",
                        "font-semibold"
                      )}
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Preview
                    </Button>
                    {enableMobileAnalytics && onOpenAnalytics && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenAnalytics}
                        className={cn(
                          "px-3 py-0.5 text-sm font-medium h-auto",
                          "transition-all duration-200 border-blue-200 text-blue-700",
                          "hover:bg-blue-50 dark:hover:bg-blue-950/30",
                          "font-semibold lg:hidden"
                        )}
                      >
                        <BarChart3 className="w-4 h-4 mr-1.5" />
                        Analytics
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onOpenChange={handlePreviewOpenChange}
        closeOnOverlayClick={false}
        classname="sm:max-w-none w-[90%] p-6"
      >
        <PreviewLayoutForm
          key={`preview-${slug}`}
          onDirtyChange={handleDirtyChange}
        />
      </Modal>

      {/* Confirmation Dialog for Unsaved Changes */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the preview form. Are you sure you
              want to close without saving? All your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Close Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
