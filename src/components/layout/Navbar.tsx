import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Terminal } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          Tech MSpace
        </Link>

        {/* Desktop Nav - We will protect these later */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="#communities" className="hover:text-indigo-600 transition-colors">Communities</Link>
          <Link href="#about" className="hover:text-indigo-600 transition-colors">About</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}