"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  User, 
  LogOut, 
  Terminal, // Updated Icon
  FolderKanban
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Communities", href: "/dashboard/communities", icon: Users },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban }, 
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    // THEME UPDATE: Dark Slate Background (Techy Vibe)
    <div className="flex h-full flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Logo Box */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/20 border border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)] group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
            <Terminal className="h-5 w-5" />
          </div>
          {/* Brand Name */}
          <span className="text-lg font-black tracking-tight text-white">
            Tech <span className="text-blue-500">MSpace</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            // Active logic covers sub-routes
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200 group",
                  isActive
                    // Active State: Glowing Blue Background
                    ? "bg-blue-900/20 text-blue-400 border border-blue-800/50 shadow-sm"
                    // Inactive State: Subtle Hover
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
                )}
              >
                <Icon className={cn(
                    "h-5 w-5 transition-colors", 
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                )} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-red-950/30 hover:text-red-400 hover:border hover:border-red-900/30 border border-transparent"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}