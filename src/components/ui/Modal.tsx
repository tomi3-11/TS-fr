"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
        // Optional: Add padding-right to body to prevent layout shift from scrollbar disappearing
    } else {
        document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      
      {/* 1. Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 2. Modal Shell */}
      <div 
        className={cn(
          "relative w-full max-w-lg transform flex flex-col rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 border border-slate-200 overflow-hidden max-h-[90vh]",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-10">
          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-xl p-2 -mr-2 text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}