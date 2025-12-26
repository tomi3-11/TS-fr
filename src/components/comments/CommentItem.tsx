"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { Button } from "@/components/ui/Button";
import { MessageSquare, CornerDownRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, parentId: string) => Promise<void>;
  level?: number; // To track nesting depth
}

export function CommentItem({ comment, onReply, level = 0 }: CommentItemProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Styling: Indent based on depth (max 3 levels visual indent)
  const indentClass = level > 0 ? "ml-4 md:ml-8 border-l-2 border-slate-100 pl-4" : "";
  
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    await onReply(replyContent, comment.id);
    setIsSubmitting(false);
    setIsReplying(false);
    setReplyContent("");
  };

  return (
    <div className={cn("mt-4 animate-in fade-in slide-in-from-top-2", indentClass)}>
      
      {/* Comment Header */}
      <div className="flex items-center gap-2 mb-1">
         <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {comment.author.slice(0, 1).toUpperCase()}
         </div>
         <span className="text-xs font-bold text-slate-800">@{comment.author}</span>
         <span className="text-xs text-slate-400">• {new Date(comment.created_at).toLocaleDateString()}</span>
      </div>

      {/* Content */}
      <div className="text-sm text-slate-700 leading-relaxed mb-2">
         {comment.content}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <MessageSquare className="h-3 w-3" /> Reply
        </button>
      </div>

      {/* Reply Form (Conditional) */}
      {isReplying && (
        <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
           <textarea
             value={replyContent}
             onChange={(e) => setReplyContent(e.target.value)}
             placeholder={`Replying to @${comment.author}...`}
             className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
             autoFocus
           />
           <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
              <Button size="sm" onClick={handleReplySubmit} isLoading={isSubmitting}>Reply</Button>
           </div>
        </div>
      )}

      {/* RECURSION: Render Children */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}