"use client";

import Link from "next/link";
import { Menu, Terminal } from "lucide-react"; 
import { Button } from "@/components/ui/Button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden sticky top-0 z-40">
      {/* Brand Logo - Updated to Tech MSpace Theme */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-blue-400 shadow-md border border-slate-800">
          <Terminal className="h-5 w-5" />
        </div>
        <span className="text-lg font-black tracking-tighter text-slate-900">
          Tech <span className="text-blue-600">MSpace</span>
        </span>
      </Link>

      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}