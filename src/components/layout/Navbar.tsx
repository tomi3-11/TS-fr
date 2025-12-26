"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Terminal, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          Tech MSpace
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="#communities" className="hover:text-indigo-600 transition-colors">Communities</Link>
          <Link href="#about" className="hover:text-indigo-600 transition-colors">About</Link>
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-slate-600">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          <Link href="#features" className="text-sm font-medium text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>Features</Link>
          <Link href="#communities" className="text-sm font-medium text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>Communities</Link>
          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-100">
            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Log in</Button>
            </Link>
            <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}