"use client";

import { useState } from "react";
// FIX: Sidebar is in 'components/dashboard', NOT 'components/layout' based on your tree
import { Sidebar } from "@/components/dashboard/Sidebar"; 
import { MobileHeader } from "@/components/layout/MobileHeader"; 
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 w-full transition-all duration-300 ease-in-out">
        
        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 w-full max-w-full">
           {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl animate-in slide-in-from-left duration-200">
            {/* We pass onClose to Sidebar so links can close the menu */}
            {/* TypeScript might complain if Sidebar doesn't accept props yet. See Step 3. */}
            <Sidebar /> 
            
            {/* Close button for accessibility usually goes inside Sidebar, 
                but clicking outside works too via the overlay above. */}
          </div>
        </div>
      )}
    </div>
  );
}