"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react"; // Import Menu icon

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Breadcrumb / Title */}
        <div className="font-semibold text-slate-800 text-lg">
          Dashboard
        </div>
      </div>

      {/* Right: User Profile Snippet */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-slate-900">{user?.username || "User"}</div>
          {/* Removed generic "Member" text to keep it clean */}
        </div>
        
        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-sm ring-2 ring-white">
           {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}