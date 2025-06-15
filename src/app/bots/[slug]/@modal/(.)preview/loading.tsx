"use client";
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 text-muted-foreground pointer-events-auto">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}
