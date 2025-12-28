"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Terminal, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Aligned with platform theme */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-slate-950 p-2 rounded-xl shadow-md border border-slate-800 transition-transform group-hover:scale-105 duration-300">
            <Terminal className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            Tech <span className="text-blue-600">MSpace</span>
          </span>
        </Link>

        {/* Desktop Nav - Professional spacing and typography */}
        <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-wider text-slate-500">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#communities" className="hover:text-blue-600 transition-colors">Communities</Link>
          <Link href="#about" className="hover:text-blue-600 transition-colors">About</Link>
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-slate-600 font-bold hover:text-slate-900">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle - Enhanced touch target */}
        <button 
          className="md:hidden p-2.5 -mr-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown - Smooth and Professional */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-2xl p-6 flex flex-col gap-5 animate-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-4">
            <Link href="#features" className="text-base font-bold text-slate-700 active:text-blue-600" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link href="#communities" className="text-base font-bold text-slate-700 active:text-blue-600" onClick={() => setIsMenuOpen(false)}>Communities</Link>
            <Link href="#about" className="text-base font-bold text-slate-700 active:text-blue-600" onClick={() => setIsMenuOpen(false)}>About</Link>
          </nav>
          
          <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button variant="outline" className="w-full h-12 font-bold border-slate-200 text-slate-700 rounded-xl">Log in</Button>
            </Link>
            <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button className="w-full h-12 font-bold bg-slate-900 text-white rounded-xl shadow-lg">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}