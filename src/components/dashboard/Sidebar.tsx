"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Terminal,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Feed", href: "/dashboard", icon: LayoutDashboard },
  { name: "Communities", href: "/dashboard/communities", icon: Users },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Applications", href: "/dashboard/applications", icon: FileText },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full border-r border-slate-200 bg-white w-64 fixed left-0 top-0 bottom-0 z-30 hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          Tech MSpace
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}