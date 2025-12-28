"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className={cn(
      "h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-all",
      className
    )}>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Button - Styled for visibility */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Brand/Breadcrumb Context */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Subtle Mobile-Only Logo Visibility */}
          <div className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 border border-blue-600/20">
             <Terminal className="h-4.5 w-4.5" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-none">
              Dashboard
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 hidden sm:block">
              Workspace v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: User Profile & Quick Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        
        {/* User Info - Responsive hiding */}
        <div className="text-right hidden sm:flex flex-col">
          <span className="text-sm font-bold text-slate-900 leading-tight">
            {user?.username || "Guest User"}
          </span>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
            {user?.role || "Developer"}
          </span>
        </div>
        
        {/* Avatar Container */}
        <div className="relative group cursor-pointer">
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-sm md:text-base shadow-md shadow-indigo-200 transition-transform active:scale-95 ring-2 ring-white overflow-hidden">
             {user?.username?.charAt(0).toUpperCase() || "U"}
             
             {/* Subtle Online Status Indicator */}
             <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>

      </div>
    </header>
  );
}