import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    
    const variants = {
      // BRAND THEME: Dark Slate (Terminal Vibe)
      primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20 border border-slate-800",
      
      // SECONDARY: Subtle Indigo/Slate mix
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
      
      // OUTLINE: Clean borders
      outline: "bg-transparent border border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900",
      
      // GHOST: Minimalist
      ghost: "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900",

      // DANGER: Critical actions
      danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200",
    };

    const sizes = {
      // Mobile-friendly heights
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm", // Standard 40px touch target
      lg: "h-12 px-8 text-base", // Larger 48px target for main CTAs
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
          "active:scale-[0.98]", // Tactile click effect
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";