"use client";

import Link from "next/link";
import { Community } from "@/types/community";
import { Button } from "@/components/ui/Button";
import { Users, ArrowRight, Check, Plus } from "lucide-react"; // Import Users
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  community: Community;
  onJoin: (slug: string) => void;
  isJoining: boolean;
}

export function CommunityCard({ community, onJoin, isJoining }: CommunityCardProps) {
  // Destructure total_members correctly
  const { name, description, slug, total_members, is_member } = community;
  
  const formattedCount = new Intl.NumberFormat('en-US', { 
    notation: "compact", 
    compactDisplay: "short" 
  }).format(total_members || 0);

  const safeName = name || "Community";
  const safeDesc = description || "No description provided.";

  // Dynamic Gradients for the banner
  const gradients = [
    "bg-gradient-to-br from-violet-600 to-indigo-600",
    "bg-gradient-to-br from-emerald-600 to-teal-600",
    "bg-gradient-to-br from-amber-500 to-orange-600",
    "bg-gradient-to-br from-rose-500 to-pink-600",
    "bg-gradient-to-br from-blue-600 to-cyan-600",
  ];
  const bgGradient = gradients[safeName.length % gradients.length];

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
      
      {/* 1. Header Banner */}
      <div className={cn("h-24 w-full relative", bgGradient)}>
         {/* Texture Overlay */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
         
         {/* Status Badge */}
         <div className="absolute top-4 right-4">
             {is_member ? (
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                   <Check className="w-3 h-3" /> MEMBER
                </span>
             ) : (
                <span className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold px-3 py-1 rounded-full">
                   PUBLIC
                </span>
             )}
         </div>
      </div>

      {/* 2. Content Body */}
      <div className="px-6 flex-1 flex flex-col pt-0 relative">
          
          {/* FLOATING ICON: Users (The universal sign for Community) */}
          <div className="absolute -top-10 left-6 h-20 w-20 bg-white rounded-2xl p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  {/* Using Users icon with a clean stroke */}
                  <Users className="h-9 w-9 text-slate-700" strokeWidth={1.5} />
              </div>
          </div>

          {/* Title */}
          <div className="mt-12 mb-3">
             <Link href={`/dashboard/communities/${slug}`} className="block group-hover:text-indigo-600 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1 tracking-tight">{safeName}</h3>
             </Link>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
             {safeDesc}
          </p>

          {/* Footer: Stats + Action */}
          <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between pb-6">
             
             {/* Member Count */}
             <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {formattedCount} Members
             </div>

             {/* Logic: Is Member ? View : Join */}
             {is_member ? (
                <Link href={`/dashboard/communities/${slug}`}>
                    <Button variant="ghost" size="sm" className="h-9 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                        View <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                </Link>
             ) : (
                <Button 
                     size="sm" 
                     onClick={(e) => {
                       e.stopPropagation();
                       onJoin(slug);
                     }}
                     isLoading={isJoining}
                     className="h-9 px-5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md rounded-lg"
                   >
                     <Plus className="h-3 w-3 mr-1.5" /> Join
                </Button>
             )}
          </div>
      </div>
    </div>
  );
}