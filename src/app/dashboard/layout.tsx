"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar"; 
import { MobileHeader } from "@/components/layout/MobileHeader"; 
import { cn } from "@/lib/utils";
import { X } from "lucide-react"; // Import X for explicit close button

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix for ensuring consistent UI
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* --- DESKTOP SIDEBAR (Fixed Left) --- */}
      {/* Hidden on mobile, fixed width on desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40 border-r border-slate-200 bg-slate-900 shadow-xl">
        <Sidebar />
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* Padded left on desktop to account for sidebar */}
      <div className="flex-1 flex flex-col md:pl-64 h-full w-full transition-all duration-300 ease-in-out">
        
        {/* Mobile Header (Sticky Top) */}
        <div className="md:hidden sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm text-white">
           <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 w-full max-w-[100vw] scroll-smooth">
           <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-500">
              {children}
           </div>
        </main>
      </div>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          
          {/* Backdrop (Click to close) */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
            onClick={() => setIsSidebarOpen(false)} 
          />
          
          {/* Sidebar Drawer */}
          <div className="relative flex w-72 flex-col bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-300 h-full border-r border-slate-800">
            
            {/* Close Button specific for mobile */}
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full z-50 transition-colors"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Sidebar Content */}
            {/* We assume Sidebar handles its own internal layout. 
                If Sidebar has navigation links, clicking them typically won't close this overlay automatically 
                unless Sidebar accepts an onClose prop. 
                For now, we render it as is to preserve code behavior. */}
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}