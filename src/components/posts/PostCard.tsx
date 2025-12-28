"use client";

import { useState } from "react";
import Link from "next/link"; 
import { Post } from "@/types/post";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, ExternalLink, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onVote: (id: string, value: 1 | -1) => void;
  communitySlug?: string; 
}

export function PostCard({ post, onVote, communitySlug }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isProposal = post.post_type === "proposal";
  
  // Persistence Logic
  const myVote = post.user_vote || 0; 
  
  const safeAuthor = post.author || "Anonymous";
  const safeTitle = post.title || "Untitled Post";
  const safeContent = post.content;
  
  // Slug Resolution
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
  
  // Dynamic color logic for score
  const scoreColor = myVote === 1 ? "text-orange-600" 
    : myVote === -1 ? "text-indigo-600" 
    : "text-slate-700";

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-4 md:p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-indigo-100 relative overflow-hidden">
      
      {/* Header Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-10">
        
        {/* Left: Community & Author */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
           <Link 
             href={communityUrl}
             onClick={(e) => e.stopPropagation()}
             className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors group/community bg-slate-50 px-2 py-1 rounded-md border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100"
           >
               <Hash className="w-3 h-3 text-slate-400 group-hover/community:text-indigo-500" />
               <span>{targetSlug}</span>
           </Link>
           
           <span className="text-slate-300">•</span>
           
           <div className="flex items-center gap-1 text-slate-500">
               <span className="hidden sm:inline">Posted by</span>
               <span className="font-bold hover:text-slate-800 transition-colors cursor-pointer text-slate-600">@{safeAuthor}</span>
           </div>
           
           <span className="text-slate-300 hidden xs:inline">•</span>
           <span className="text-slate-400 hidden xs:inline">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        {/* Right: Type Badge */}
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 border",
            isProposal 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-emerald-600 border-emerald-200"
          )}>
            {post.post_type}
        </span>
      </div>

      {/* Main Content */}
      <div className="mb-4 relative z-10">
        <Link href={postUrl} className="block group/title">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-snug group-hover/title:text-indigo-600 transition-colors flex items-start gap-2">
              {safeTitle}
              <ExternalLink className="h-4 w-4 opacity-0 group-hover/title:opacity-100 transition-opacity text-indigo-400 mt-1 shrink-0" />
            </h3>
        </Link>
        
        {hasContent && (
           <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
              {displayContent}
              {safeContent.length > MAX_LENGTH && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                  className="inline-block ml-1 font-bold text-xs uppercase tracking-wide text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
           </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50 relative z-10">
        
        {/* Voting Mechanism */}
        <div 
            className={cn(
                "flex items-center rounded-xl border overflow-hidden transition-all duration-200 shadow-sm",
                myVote !== 0 ? (myVote === 1 ? "bg-orange-50 border-orange-100" : "bg-indigo-50 border-indigo-100") : "bg-slate-50 border-slate-100"
            )} 
            onClick={(e) => e.stopPropagation()}
        >
            <button 
              onClick={() => onVote(post.id, 1)}
              className={cn(
                  "p-1.5 px-2.5 hover:bg-white transition-colors active:scale-90",
                  myVote === 1 ? "text-orange-600" : "text-slate-400 hover:text-orange-500"
              )}
              aria-label="Upvote"
            >
              <ArrowBigUp className={cn("h-5 w-5 md:h-6 md:w-6", myVote === 1 && "fill-current")} />
            </button>

            <span className={cn("text-xs md:text-sm font-black min-w-[1.5rem] text-center select-none", scoreColor)}>
                {scoreDisplay}
            </span>

            <button 
              onClick={() => onVote(post.id, -1)}
              className={cn(
                  "p-1.5 px-2.5 hover:bg-white transition-colors active:scale-90",
                  myVote === -1 ? "text-indigo-600" : "text-slate-400 hover:text-indigo-500"
              )}
              aria-label="Downvote"
            >
              <ArrowBigDown className={cn("h-5 w-5 md:h-6 md:w-6", myVote === -1 && "fill-current")} />
            </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
            <Link href={`${postUrl}#comments`}>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden xs:inline">Comments</span>
                </button>
            </Link>
            
            {/* <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <Share2 className="h-4 w-4" />
            </button> */}
        </div>

      </div>
    </div>
  );
}