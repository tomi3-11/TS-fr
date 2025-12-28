import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* --- Left Column: The Brand Experience --- */}
      {/* Hidden on mobile, Visible on Large Screens */}
      <div className="relative hidden h-full flex-col bg-slate-950 p-10 text-white lg:flex border-r border-slate-800">
        
        {/* Background Art */}
        <div className="absolute inset-0 bg-slate-950 overflow-hidden">
             {/* UPDATED IMAGE: 
                - Using a clear shot of code syntax/IDE (Unsplash ID: 1555066931-4365d14bab8c).
                - Increased opacity to 0.4 (40%) so the code is clearly visible.
                - Changed mix-blend-mode to 'luminosity' or 'overlay' to keep the tech vibe.
             */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-left opacity-40" />
             
             {/* Brand Gradient Overlay - Blue/Indigo Tint */}
             {/* Using mix-blend-multiply allows the code text to "shine" through the color */}
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-blue-900/60 to-indigo-900/40 mix-blend-multiply" />
        </div>
        
        {/* Top Branding */}
        <div className="relative z-20 flex items-center text-lg font-bold tracking-tight">
          <Link href="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 backdrop-blur-md">
                <Terminal className="h-5 w-5" />
             </div>
             <span className="drop-shadow-md">Tech MSpace</span>
          </Link>
        </div>
        
        {/* Bottom Testimonial/Quote */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4 max-w-lg">
            <p className="text-xl font-medium leading-relaxed text-slate-200 drop-shadow-md">
              &ldquo;This platform isn't just about code. It's about taking the raw potential of our youth and giving it the infrastructure to build a functioning society.&rdquo;
            </p>
            <footer className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg">
                    <span className="font-bold text-xs text-blue-400">TM</span>
                </div>
                <div>
                    <div className="text-sm font-bold text-white drop-shadow-sm">The Manifesto</div>
                    <div className="text-xs text-slate-300">Operating System of Youth</div>
                </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* --- Right Column: The Form Container --- */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50 text-slate-900 relative">
        
        {/* Mobile-only Home Button */}
        <div className="absolute top-4 left-4 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Home
            </Link>
        </div>

        {/* The Form Wrapper */}
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
      
    </div>
  );
}