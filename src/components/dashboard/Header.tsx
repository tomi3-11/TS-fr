"use client";

import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs (Future) or Mobile Toggle */}
      <div className="font-semibold text-slate-800">
        Dashboard
      </div>

      {/* Right: User Profile Snippet */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-slate-900">{user?.username || "User"}</div>
          <div className="text-xs text-slate-500 capitalize">{user?.role || "Member"}</div>
        </div>
        
        {/* Avatar Circle */}
        <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
           {user?.username?.charAt(0).toUpperCase() || "U"}
           {/* Later we use user.avatar_url if it exists */}
        </div>
      </div>
    </header>
  );
}