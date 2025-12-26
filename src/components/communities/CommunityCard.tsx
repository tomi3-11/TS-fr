"use client";

import Link from "next/link";
import { Community } from "@/types/community";
import { Button } from "@/components/ui/Button";
import { Users, ArrowRight, Check, Plus } from "lucide-react"; // Added Icons
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  community: Community;
  onJoin?: (slug: string) => void;
  isJoining?: boolean;
}

export function CommunityCard({ community, onJoin, isJoining }: CommunityCardProps) {
  const safeName = community.name || "Untitled Community";
  const safeDesc = community.description || "No description available.";
  const safeSlug = community.slug || "#";
  const memberCount = community.member_count || 0;
  
  // LOGIC: Check membership status
  const isMember = community.is_member;

  // Format count (e.g. 1.2k)
  const formattedCount = new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(memberCount);
  
  // Deterministic Color
  const colorIndex = safeName.length % 5;
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-indigo-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-rose-500 to-pink-500",
  ];
  const gradient = gradients[colorIndex] || gradients[0];

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden h-full relative">
      
      {/* Visual Header */}
      <div className={cn("h-24 bg-gradient-to-r relative", gradient)}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="absolute bottom-0 left-6 transform translate-y-1/2">
            <div className="h-12 w-12 rounded-lg bg-white p-1 shadow-md flex items-center justify-center text-xl font-bold text-slate-800 uppercase border border-slate-100">
                {safeName.slice(0, 2)}
            </div>
         </div>
         
         {/* Member Badge (Top Right) */}
         {isMember && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                <Check className="h-3 w-3 mr-1" /> Joined
            </div>
         )}
      </div>

      <div className="flex-1 p-6 pt-8 flex flex-col">
        <Link href={`/dashboard/communities/${safeSlug}`} className="block">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-2">
                {safeName}
            </h3>
        </Link>
        
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {safeDesc}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
           <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
              <Users className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <span>{formattedCount}</span>
           </div>

           <div className="flex gap-2">
             {/* CONDITIONAL BUTTON LOGIC */}
             {isMember ? (
                // CASE 1: ALREADY MEMBER -> Show View Button
                <Link href={`/dashboard/communities/${safeSlug}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 hover:bg-slate-50 hover:text-indigo-600">
                        View Community <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                </Link>
             ) : (
                // CASE 2: NOT MEMBER -> Show Join Button
                // Note: We check if onJoin exists to prevent errors
                onJoin && (
                   <Button 
                     size="sm" 
                     onClick={(e) => {
                        e.preventDefault(); // Stop Link navigation if nested
                        onJoin(safeSlug);
                     }}
                     isLoading={isJoining}
                     className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                   >
                     <Plus className="h-3 w-3 mr-1.5" /> Join
                   </Button>
                )
             )}
           </div>
        </div>
      </div>
    </div>
  );
}