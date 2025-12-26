"use client";

import { useState } from "react"; // <--- Import useState
import { Post } from "@/types/post";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onVote: (id: string, value: 1 | -1) => void;
}

export function PostCard({ post, onVote }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false); // State for "See More"

  const isProposal = post.post_type === "proposal";
  const myVote = post.user_vote || 0;
  
  // Defensive Data Handling
  const safeAuthor = post.author || "Anonymous";
  const safeTitle = post.title || "Untitled Post";
  const safeContent = post.content || "";

  // Truncation Logic
  const MAX_LENGTH = 180; // Character limit
  const shouldTruncate = safeContent.length > MAX_LENGTH;
  const displayContent = isExpanded || !shouldTruncate 
    ? safeContent 
    : `${safeContent.slice(0, MAX_LENGTH)}...`;

  // Vote Count Logic
  const upCountDisplay = post.score > 0 ? post.score : ""; 
  const downCountDisplay = post.score < 0 ? Math.abs(post.score) : "";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md">
      
      {/* Header Metadata */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
           <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-indigo-50 px-2 py-1 rounded-full transition-colors cursor-pointer group/author">
               <div className="h-4 w-4 rounded-full bg-indigo-200 flex items-center justify-center text-[8px] font-bold text-indigo-700">
                  {safeAuthor.slice(0, 1).toUpperCase()}
               </div>
               <span className="font-semibold text-slate-700 group-hover/author:text-indigo-600">
                  {safeAuthor}
               </span>
           </div>
           <span className="text-slate-300">•</span>
           <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isProposal 
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          )}>
            {post.post_type}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="mb-4 pl-0 md:pl-2">
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {safeTitle}
        </h3>
        
        {/* Render the Safe Content */}
        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
          {displayContent} {/* <--- This must be the variable we calculated */}
          
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 font-medium text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none"
            >
              {isExpanded ? "Show less" : "See more"}
            </button>
          )}
        </div>
      </div>

      {/* Social Action Bar */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
        
        {/* Vote Group */}
        <div className="flex items-center gap-1">
            <button 
              onClick={() => onVote(post.id, 1)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border",
                myVote === 1 
                  ? "bg-orange-50 border-orange-200 text-orange-600" 
                  : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100"
              )}
            >
              <ArrowBigUp className={cn("h-5 w-5", myVote === 1 && "fill-orange-600")} />
              {upCountDisplay && <span>{upCountDisplay}</span>}
            </button>

            <button 
              onClick={() => onVote(post.id, -1)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border",
                myVote === -1 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                  : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100"
              )}
            >
              <ArrowBigDown className={cn("h-5 w-5", myVote === -1 && "fill-indigo-600")} />
              {downCountDisplay && <span>{downCountDisplay}</span>}
            </button>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors ml-auto">
            <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}