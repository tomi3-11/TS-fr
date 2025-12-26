"use client";

import { Post } from "@/types/post";
import { Button } from "@/components/ui/Button";
import { ArrowBigUp, ArrowBigDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns"; // You might need: npm install date-fns

interface PostCardProps {
  post: Post;
  onVote: (id: string, value: 1 | -1) => void;
  // voteStatus is tracked locally or via prop if available
}

export function PostCard({ post, onVote }: PostCardProps) {
  const isProposal = post.post_type === "proposal";

  return (
    <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
      {/* Vote Sidebar */}
      <div className="w-12 bg-slate-50 border-r border-slate-100 flex flex-col items-center p-2 gap-1">
        <button 
          onClick={() => onVote(post.id, 1)}
          className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-orange-500 transition-colors"
        >
          <ArrowBigUp className="h-6 w-6" />
        </button>
        
        <span className="text-sm font-bold text-slate-700">{post.score}</span>
        
        <button 
          onClick={() => onVote(post.id, -1)}
          className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-indigo-500 transition-colors"
        >
          <ArrowBigDown className="h-6 w-6" />
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
          {/* Ensure you install date-fns or use a simple formatter */}
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        {/* Title & Body */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
          {post.title}
        </div>
        <div className="text-slate-600 text-sm line-clamp-3 mb-4">
          {post.content}
        </div>

        {/* Action Footer */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8 text-slate-500 px-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </Button>
        </div>
      </div>
    </div>
  );
}