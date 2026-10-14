import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gold"
    | "dark";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#946e28]/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      default:
        "bg-[#785610] text-white font-semibold shadow-sm hover:bg-[#946e28] active:scale-[0.99] border border-[#b48a3c] transition-all",
      gold:
        "bg-[#785610] text-white font-semibold shadow-sm hover:bg-[#946e28] active:scale-[0.99] border border-[#b48a3c] transition-all",
      dark:
        "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800 active:scale-[0.99]",
      destructive:
        "bg-red-600 text-white shadow-xs hover:bg-red-700 active:scale-[0.99]",
      outline:
        "border border-zinc-200 bg-white text-zinc-800 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 active:scale-[0.99]",
      secondary:
        "bg-zinc-100 text-zinc-900 shadow-2xs hover:bg-zinc-200 active:scale-[0.99]",
      ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
      link: "text-[#785610] underline-offset-4 hover:underline p-0 h-auto font-medium",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-6 text-base",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
