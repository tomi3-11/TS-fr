"use client";

import Link from "next/link";
import { Community } from "@/types/community";
import { Button } from "@/components/ui/Button";
import { Users, ArrowRight, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  community: Community;
  onJoin: (slug: string) => void;
  isJoining: boolean;
}

export function CommunityCard({ community, onJoin, isJoining }: CommunityCardProps) {
  const { name, description, slug, total_members, is_member } = community;
  
  const formattedCount = new Intl.NumberFormat('en-US', { 
    notation: "compact", 
    compactDisplay: "short" 
  }).format(total_members || 0);

  const safeName = name || "Community Hub";
  const safeDesc = description || "Join this community to start collaborating on projects.";

  // High-end professional gradients
  const gradients = [
    "from-indigo-600 to-violet-700",
    "from-slate-800 to-slate-950",
    "from-blue-600 to-indigo-600",
    "from-emerald-600 to-teal-700",
  ];
  const bgGradient = gradients[safeName.length % gradients.length];

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 overflow-visible h-full">
      
      {/* 1. Header Banner - overflow-hidden here to clip the texture but not the icon */}
      <div className={cn("h-20 md:h-24 w-full relative rounded-t-2xl overflow-hidden", "bg-gradient-to-br", bgGradient)}>
         {/* Tech Texture Overlay */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
         
         {/* Status Badge */}
         <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
             {is_member ? (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-white text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                   <Check className="w-3 h-3" /> MEMBER
                </span>
             ) : (
                <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                   Public
                </span>
             )}
         </div>
      </div>

      {/* 2. Content Body */}
      <div className="px-5 md:px-6 flex-1 flex flex-col pt-0 relative">
          
          {/* FLOATING ICON: Scaled for mobile */}
          <div className="absolute -top-8 left-5 md:-top-10 md:left-6 h-16 w-16 md:h-20 md:w-20 bg-white rounded-2xl p-1 md:p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300 ring-4 ring-white">
              <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <Users className="h-7 w-7 md:h-9 md:w-9 text-slate-700" strokeWidth={1.5} />
              </div>
          </div>

          {/* Title - Line clamped for alignment */}
          <div className="mt-10 md:mt-12 mb-2 md:mb-3">
             <Link href={`/dashboard/communities/${slug}`} className="block">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
                  {safeName}
                </h3>
             </Link>
          </div>

          {/* Description - Strict line clamping for consistent card height */}
          <p className="text-slate-500 text-xs md:text-sm line-clamp-2 mb-5 font-medium leading-relaxed">
             {safeDesc}
          </p>

          {/* Footer: Stats + Action */}
          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between pb-5 md:pb-6">
             
             {/* Member Count */}
             <div className="flex items-center text-[10px] md:text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                <Users className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />
                {formattedCount} <span className="hidden xs:inline ml-0.5">Members</span>
             </div>

             {/* Action Button */}
             {is_member ? (
                <Link href={`/dashboard/communities/${slug}`}>
                    <Button variant="ghost" size="sm" className="h-8 md:h-9 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3">
                        Enter <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Button>
                </Link>
             ) : (
                <Button 
                     size="sm" 
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       onJoin(slug);
                     }}
                     isLoading={isJoining}
                     className="h-8 md:h-9 px-4 md:px-5 text-[10px] md:text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-md rounded-lg active:scale-95 transition-all"
                   >
                     <Plus className="h-3 w-3 mr-1.5" /> Join
                </Button>
             )}
          </div>
      </div>
    </div>
  );
}