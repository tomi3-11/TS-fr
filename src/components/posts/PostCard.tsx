"use client";

import { useState } from "react";
import Link from "next/link"; 
import { Post } from "@/types/post";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onVote: (id: string, value: 1 | -1) => void;
  communitySlug?: string; 
}

export function PostCard({ post, onVote, communitySlug }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isProposal = post.post_type === "proposal";
  const myVote = post.user_vote || 0;
  
  const safeAuthor = post.author || "Anonymous";
  const safeTitle = post.title || "Untitled Post";
  const safeContent = post.content;
  
  const rawCommunity = post.community;
  let resolvedSlug = communitySlug;

  if (rawCommunity) {
      if (typeof rawCommunity === 'object') {
          resolvedSlug = (rawCommunity as any).slug;
      } else {
          resolvedSlug = rawCommunity;
      }
  }
  const targetSlug = resolvedSlug || "general";
  
  const postUrl = `/dashboard/communities/${targetSlug}/posts/${post.id}`;
  const communityUrl = `/dashboard/communities/${targetSlug}`;

  const hasContent = safeContent && safeContent.length > 0;
  const MAX_LENGTH = 180;
  const displayContent = hasContent 
    ? (isExpanded || safeContent.length <= MAX_LENGTH ? safeContent : `${safeContent.slice(0, MAX_LENGTH)}...`)
    : null;

  // Floor score at 0 for display
  const effectiveScore = post.score < 0 ? 0 : post.score;
  const scoreDisplay = new Intl.NumberFormat('en-US', { notation: "compact" }).format(effectiveScore);
  
  // FIX: Explicit Color Logic
  const scoreColor = myVote === 1 ? "text-orange-600" 
    : myVote === -1 ? "text-indigo-600" 
    : "text-slate-700";

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md hover:border-indigo-200 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2 text-xs">
           <Link 
             href={communityUrl}
             onClick={(e) => e.stopPropagation()}
             className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors group/community"
           >
               <div className="h-5 w-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] group-hover/community:bg-indigo-100 group-hover/community:text-indigo-600 border border-slate-200">
                  {targetSlug.slice(0,1).toUpperCase()}
               </div>
               <span>t/{targetSlug}</span>
           </Link>

           <span className="text-slate-300">•</span>

           <div className="flex items-center gap-1 text-slate-500">
               <span>Posted by</span>
               <span className="font-medium hover:text-slate-800 transition-colors cursor-pointer">
                  @{safeAuthor}
               </span>
           </div>

           <span className="text-slate-300 hidden sm:inline">•</span>
           <span className="text-slate-400 hidden sm:inline">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
            isProposal 
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          )}>
            {post.post_type}
        </span>
      </div>

      {/* Main Body */}
      <div className="mb-4 pl-0 md:pl-2 relative z-10">
        <Link href={postUrl} className="block">
           <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug group-hover:text-indigo-600 transition-colors flex items-center gap-2">
             {safeTitle}
             <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
           </h3>
        </Link>
        
        {hasContent && (
           <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mt-2">
              {displayContent}
              {safeContent.length > MAX_LENGTH && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setIsExpanded(!isExpanded);
                  }}
                  className="ml-2 font-medium text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none"
                >
                  {isExpanded ? "Show less" : "See more"}
                </button>
              )}
           </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-4 pt-2 relative z-10">
        
        {/* FIX: Distinct Active States for the Container */}
        <div 
            className={cn(
                "flex items-center rounded-full border overflow-hidden transition-all duration-200",
                myVote === 0 ? "bg-slate-50 border-slate-200" : "",
                myVote === 1 ? "bg-orange-50 border-orange-200" : "", // Distinct Orange Background
                myVote === -1 ? "bg-indigo-50 border-indigo-200" : "" // Distinct Blue Background
            )} 
            onClick={(e) => e.stopPropagation()}
        >
            {/* Upvote Arrow */}
            <button 
              onClick={() => onVote(post.id, 1)}
              className={cn(
                  "p-1.5 px-3 hover:bg-slate-200/50 transition-colors active:scale-95",
                  myVote === 1 ? "text-orange-600" : "text-slate-400 hover:text-orange-600"
              )}
            >
              {/* Fill the arrow if active */}
              <ArrowBigUp className={cn("h-6 w-6", myVote === 1 && "fill-orange-600")} />
            </button>

            {/* Score */}
            <span className={cn("text-xs font-bold min-w-[1.5rem] text-center select-none", scoreColor)}>
                {scoreDisplay}
            </span>

            {/* Downvote Arrow */}
            <button 
              onClick={() => onVote(post.id, -1)}
              className={cn(
                  "p-1.5 px-3 hover:bg-slate-200/50 transition-colors active:scale-95",
                  myVote === -1 ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"
              )}
            >
              {/* Fill the arrow if active */}
              <ArrowBigDown className={cn("h-6 w-6", myVote === -1 && "fill-indigo-600")} />
            </button>
        </div>

        <Link href={`${postUrl}#comments`}>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>Comments</span>
            </button>
        </Link>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors ml-auto">
            <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}