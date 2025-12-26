import Link from "next/link";
import { Terminal } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      
      {/* Left Column: The "Art" Side */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white dark:border-r lg:flex">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-zinc-900">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
        </div>
        
        {/* Logo Area */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Terminal className="mr-2 h-6 w-6" />
          Tech MSpace
        </div>
        
        {/* Testimonial / Quote Area */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform changed how I approach open source. Instead of random commits, I'm building systems that solve real local problems.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">Allowed User - Community Member</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: The Form Side */}
      <div className="lg:p-8 bg-white min-h-screen flex items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
      
    </div>
  );
}