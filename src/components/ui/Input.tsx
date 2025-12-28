import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full group">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500 ml-1 group-focus-within:text-indigo-600 transition-colors">
            {label}
          </label>
        )}
        <div className="relative">
            <input
              type={type}
              className={cn(
                // Base Layout
                "flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm md:text-base font-medium transition-all duration-200",
                
                // Colors & Borders
                "border-slate-200 text-slate-900 placeholder:text-slate-400",
                "hover:border-slate-300",
                
                // Focus State (Tech Glow)
                "focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                
                // Disabled State
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
                
                // Error State overrides
                error && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/10 bg-red-50/5 text-red-900 placeholder:text-red-300",
                
                className
              )}
              ref={ref}
              {...props}
            />
        </div>
        {error && (
            <div className="flex items-center gap-1.5 ml-1 animate-in slide-in-from-top-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <p className="text-xs font-bold text-red-500">{error}</p>
            </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };