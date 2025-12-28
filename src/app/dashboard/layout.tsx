"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar"; 
import { MobileHeader } from "@/components/layout/MobileHeader"; 
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Function to close sidebar when a link is clicked
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; 

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40 border-r border-slate-800 bg-slate-950 shadow-xl">
        <Sidebar />
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col md:pl-64 h-full w-full">
        
        {/* Mobile Header (Sticky Top) */}
        {/* We removed the extra brand HTML here to prevent duplicates */}
        <div className="md:hidden sticky top-0 z-30 w-full">
           <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 w-full max-w-[100vw]">
           <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-500">
              {children}
           </div>
        </main>
      </div>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
            onClick={closeSidebar} 
          />
          
          <div className="relative flex w-72 flex-col bg-slate-950 shadow-2xl animate-in slide-in-from-left duration-300 h-full border-r border-slate-800">
            <button 
                onClick={closeSidebar}
                className="absolute top-4 right-4 p-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl z-50 border border-slate-800"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Sidebar with the close function passed as a prop */}
            <Sidebar onClose={closeSidebar} /> 
          </div>
        </div>
      )}
    </div>
  );
}