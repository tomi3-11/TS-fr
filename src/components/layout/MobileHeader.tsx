"use client";

import Link from "next/link";
import { Menu, Zap } from "lucide-react"; // Ensure lucide-react is installed
import { Button } from "@/components/ui/Button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden sticky top-0 z-40">
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <Zap className="h-5 w-5 fill-current" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          TechSpace
        </span>
      </Link>

      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}