"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a <Dialog />");
  }
  return context;
}

export function Dialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, onOpenChange]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open ? children : null}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
  className,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}) {
  const { onOpenChange } = useDialog();
  return (
    <div
      onClick={() => onOpenChange(true)}
      className={cn("inline-block cursor-pointer", className)}
    >
      {children}
    </div>
  );
}

export function DialogContent({
  children,
  className,
  maxWidth = "max-w-lg",
  hideCloseButton = false,
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  hideCloseButton?: boolean;
}) {
  const { onOpenChange } = useDialog();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in-0 duration-200">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!hideCloseButton) onOpenChange(false);
        }}
      />
      <div
        role="dialog"
        className={cn(
          "relative z-50 w-full rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-2xl transition-all duration-200 max-h-[90vh] overflow-y-auto",
          maxWidth,
          className
        )}
      >
        {!hideCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 pt-4 border-t border-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight text-zinc-900", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-zinc-500 mt-1", className)}
      {...props}
    />
  );
}
