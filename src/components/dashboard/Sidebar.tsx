"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  User, 
  LogOut, 
  Zap,
  FolderKanban // <-- Recommended icon for Projects
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
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            TechSpace
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            // Check if active (handle sub-paths like /projects/create)
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}