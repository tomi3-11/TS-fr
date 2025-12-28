"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  User, 
  LogOut, 
  Terminal, 
  FolderKanban
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  onClose?: () => void; // Optional prop to handle closing on mobile
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Communities", href: "/dashboard/communities", icon: Users },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban }, 
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  // Helper to handle link clicks
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex h-full flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6 shrink-0">
        <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-3 group">
          {/* Logo Box - Professional Terminal Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:bg-blue-600/20 group-hover:border-blue-400/50 transition-all duration-300">
            <Terminal className="h-5 w-5" />
          </div>
          {/* Brand Name */}
          <span className="text-xl font-black tracking-tighter text-white">
            Tech <span className="text-blue-500">MSpace</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group relative",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.05)]"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}
                
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

      {/* Footer / User Actions */}
      <div className="border-t border-slate-800 p-4 mt-auto">
        <button
          onClick={() => {
            handleLinkClick();
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent group"
        >
          <LogOut className="h-5 w-5 text-slate-500 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}