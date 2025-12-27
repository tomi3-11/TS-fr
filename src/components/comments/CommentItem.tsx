"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Trash2, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: Comment;
  currentUsername?: string; 
  onReply: (parentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  depth?: number; 
}

export function CommentItem({ comment, currentUsername, onReply, onDelete, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Collapsing Logic: Default hidden if it's a nested thread
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setIsReplying(false);
      setReplyContent("");
      setAreRepliesVisible(true); // Auto-expand when you reply
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = currentUsername === comment.author;
  const replyCount = comment.replies?.length || 0;

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-top-1">
      {/* --- COMMENT CARD --- */}
      <div className={cn(
        "relative flex gap-3 p-4 rounded-xl transition-all border",
        depth > 0 ? "bg-slate-50/50 border-transparent" : "bg-white border-slate-200 shadow-sm"
      )}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {comment.author.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">@{comment.author}</span>
                <span className="text-xs text-slate-400 font-medium">• {new Date(comment.created_at).toLocaleDateString()}</span>
             </div>
             {isOwner && (
                <button onClick={() => onDelete(comment.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                   <Trash2 className="w-3.5 h-3.5" />
                </button>
             )}
          </div>

          <p className="text-slate-800 text-sm leading-relaxed mb-3 whitespace-pre-wrap font-medium">
            {comment.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
             >
                <MessageCircle className="w-3.5 h-3.5" /> Reply
             </button>
          </div>

          {/* Reply Input (Techy Dark Blue & Visible Text) */}
          {isReplying && (
             <div className="mt-3 pl-2 border-l-2 border-slate-200">
                <textarea
                  autoFocus
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Replying to @${comment.author}...`}
                  // FIX: text-slate-900 makes typing visible
                  className="w-full p-3 text-sm text-slate-900 font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent min-h-[80px] bg-white placeholder:text-slate-400"
                />
                <div className="flex justify-end gap-2 mt-2">
                   <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)} className="text-slate-500">Cancel</Button>
                   <Button size="sm" onClick={handleSubmitReply} isLoading={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white font-bold">Post Reply</Button>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* --- NESTED REPLIES (Collapsible) --- */}
      {replyCount > 0 && (
        <div className="pl-4 md:pl-6">
           
           {/* The "View Replies" Toggle (Facebook Style) */}
           {!areRepliesVisible && (
               <button 
                 onClick={() => setAreRepliesVisible(true)}
                 className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors group"
               >
                  <CornerDownRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900" />
                  <div className="h-px w-6 bg-slate-200 group-hover:bg-slate-900"></div>
                  View {replyCount} {replyCount === 1 ? "reply" : "replies"}
               </button>
           )}

           {/* The Actual Replies */}
           {areRepliesVisible && (
               <div className="relative pl-4 border-l-2 border-slate-100 mt-2 space-y-2">
                   {comment.replies.map((reply) => (
                     <CommentItem 
                       key={reply.id} 
                       comment={reply} 
                       depth={depth + 1}
                       currentUsername={currentUsername}
                       onReply={onReply}
                       onDelete={onDelete}
                     />
                   ))}
                   
                   {/* Hide Button */}
                   <button 
                     onClick={() => setAreRepliesVisible(false)}
                     className="text-[10px] font-bold text-slate-400 hover:text-slate-600 mt-2 pl-2"
                   >
                      Hide replies
                   </button>
               </div>
           )}
        </div>
      )}
    </div>
  );
}