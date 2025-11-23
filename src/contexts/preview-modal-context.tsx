"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface PreviewModalContextType {
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
}

const PreviewModalContext = createContext<PreviewModalContextType | null>(null);

export function PreviewModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSetIsPreviewOpen = useCallback((open: boolean) => {
    setIsPreviewOpen(open);
  }, []);

  return (
    <PreviewModalContext.Provider
      value={{
        isPreviewOpen,
        setIsPreviewOpen: handleSetIsPreviewOpen,
      }}
    >
      {children}
    </PreviewModalContext.Provider>
  );
}

export function usePreviewModal() {
  const context = useContext(PreviewModalContext);
  if (!context) {
    // Return default values if context is not available (for graceful degradation)
    return {
      isPreviewOpen: false,
      setIsPreviewOpen: () => {},
    };
  }
  return context;
}
