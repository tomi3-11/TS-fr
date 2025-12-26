"use client";

import Link from "next/link";
import { Community } from "@/types/community";
import { Button } from "@/components/ui/Button";
import { Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  community: Community;
  onJoin?: (slug: string) => void;
  isJoining?: boolean;
}

export function CommunityCard({ community, onJoin, isJoining }: CommunityCardProps) {
  // FIX: Safety check. If name is missing, default to "Untitled Community"
  const safeName = community.name || "Untitled Community";
  const safeDesc = community.description || "No description available.";
  const safeSlug = community.slug || "#";

  // Now we use the safe variable, so it never crashes
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
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden h-full">
      {/* Visual Header */}
      <div className={cn("h-24 bg-gradient-to-r relative", gradient)}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="absolute bottom-0 left-6 transform translate-y-1/2">
            <div className="h-12 w-12 rounded-lg bg-white p-1 shadow-md flex items-center justify-center text-xl font-bold text-slate-800 uppercase border border-slate-100">
                {safeName.slice(0, 2)}
            </div>
         </div>
      </div>

      <div className="flex-1 p-6 pt-8 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {safeName}
            </h3>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {safeDesc}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
           <div className="flex items-center text-xs text-slate-500 font-medium">
              <Users className="h-4 w-4 mr-1.5" />
              <span>Active</span>
           </div>

           <div className="flex gap-2">
             {onJoin && (
               <Button 
                 variant="secondary" 
                 size="sm" 
                 onClick={() => onJoin(safeSlug)}
                 isLoading={isJoining}
                 className="h-8 text-xs"
               >
                 Join
               </Button>
             )}
             <Link href={`/dashboard/communities/${safeSlug}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                    View <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}