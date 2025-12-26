import { Terminal } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // FIX 1: Removed 'container', added 'w-full'. 
    // This ensures no black bars on the sides.
    // FIX 2: 'grid-cols-1' is default (mobile), 'lg:grid-cols-2' is for desktop.
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: The "Art" Side */}
      {/* Hidden on mobile (hidden), Flex on large screens (lg:flex) */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 bg-zinc-900">
             {/* FIX 3: Adjusted opacity. Was implicitly dark, now clearer. */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
             {/* Lighter gradient so it's not pitch black */}
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-zinc-900/10" />
        </div>
        
        {/* Branding */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Terminal className="mr-2 h-6 w-6 text-indigo-400" />
          Tech MSpace
        </div>
        
        {/* Quote */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-light leading-relaxed text-slate-100">
              &ldquo;This platform changed how I approach open source. Instead of random commits, I'm building systems that solve real local problems.&rdquo;
            </p>
            <footer className="text-sm text-indigo-200">Allowed User - Community Member</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: The Form Side */}
      {/* FIX 4: Added explicit 'bg-white' and padding adjustments for mobile */}
      <div className="flex items-center justify-center p-8 bg-white text-slate-900">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
      
    </div>
  );
}