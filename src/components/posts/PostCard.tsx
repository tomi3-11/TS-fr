"use client";

import { Post } from "@/types/post";
import { Button } from "@/components/ui/Button";
import { ArrowBigUp, ArrowBigDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onVote: (id: string, value: 1 | -1) => void;
}

export function PostCard({ post, onVote }: PostCardProps) {
  const isProposal = post.post_type === "proposal";

  return (
    <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all duration-200 hover:shadow-sm">
      
      {/* Vote Sidebar (Reddit Style) */}
      <div className="w-12 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center p-2 gap-1">
        
        {/* Upvote Button */}
        <button 
          onClick={() => onVote(post.id, 1)}
          className="p-1 rounded hover:bg-orange-100 text-slate-400 hover:text-orange-600 transition-all active:scale-75"
          title="Upvote"
        >
          <ArrowBigUp className="h-7 w-7" />
        </button>
        
        {/* Score Count */}
        <span className={cn(
            "text-sm font-bold my-1",
            post.score > 0 ? "text-orange-600" : post.score < 0 ? "text-indigo-600" : "text-slate-700"
        )}>
           {/* If backend supported separate counts, we'd show them here. For now, we show net score */}
           {post.score} 
        </span>
        
        {/* Downvote Button */}
        <button 
          onClick={() => onVote(post.id, -1)}
          className="p-1 rounded hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-all active:scale-75"
          title="Downvote"
        >
          <ArrowBigDown className="h-7 w-7" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        {/* Header Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full font-medium capitalize",
            isProposal 
              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          )}>
            {post.post_type}
          </span>
          <span>•</span>
          <span className="font-medium text-slate-900">u/{post.author}</span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        {/* Title & Body */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
          {post.title}
        </h3>
        
        <div className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {post.content}
        </div>

        {/* Action Footer */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8 text-slate-500 px-2 hover:bg-slate-100">
            <MessageSquare className="h-4 w-4 mr-2" />
            0 Comments
          </Button>
        </div>
      </div>
    </div>
  );
}