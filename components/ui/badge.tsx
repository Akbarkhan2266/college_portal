import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "gold"
    | "purple"
    | "blue";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-zinc-900 text-zinc-50 shadow-2xs hover:bg-zinc-800",
    secondary: "border-zinc-200 bg-zinc-100 text-zinc-700",
    destructive: "border-red-200 bg-red-50 text-red-700 font-medium",
    outline: "border-zinc-200 text-zinc-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium",
    warning: "border-amber-200 bg-amber-50 text-amber-900 font-medium",
    gold: "border-[#b48a3c] bg-[#785610] text-white font-medium shadow-2xs",
    purple: "border-purple-200 bg-purple-50 text-purple-800 font-medium",
    blue: "border-blue-200 bg-blue-50 text-blue-800 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap select-none transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
