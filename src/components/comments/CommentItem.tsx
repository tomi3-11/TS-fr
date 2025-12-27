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
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);

  // FIX 1: Darker Color Palette (Deep Tech Tones)
  const gradients = [
    "bg-gradient-to-br from-slate-800 to-slate-950",   // Dark Slate
    "bg-gradient-to-br from-indigo-900 to-slate-900",  // Deep Indigo
    "bg-gradient-to-br from-emerald-900 to-teal-950",  // Dark Teal
    "bg-gradient-to-br from-red-900 to-rose-950",      // Deep Red
    "bg-gradient-to-br from-blue-900 to-cyan-950",     // Deep Ocean
    "bg-gradient-to-br from-purple-900 to-violet-950", // Deep Void
  ];
  const avatarStyle = gradients[comment.author.length % gradients.length];

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setIsReplying(false);
      setReplyContent("");
      setAreRepliesVisible(true);
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  const isOwner = currentUsername === comment.author;
  const replyCount = comment.replies?.length || 0;

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-top-1">
      
      {/* --- COMMENT CARD --- */}
      <div className={cn(
        "relative flex gap-3 px-0 py-3 transition-all",
        depth > 0 ? "border-l-2 border-slate-100 pl-4" : ""
      )}>
        {/* Avatar */}
        <div className="flex-shrink-0 pt-1">
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center font-bold text-[10px] tracking-wider text-white/90 shadow-sm border border-white/5", avatarStyle)}>
            {comment.author.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-2">
                {/* FIX 2: Monospace Font & Removed '@' */}
                <span className="font-bold text-sm text-slate-900 font-mono tracking-tight">{comment.author}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{new Date(comment.created_at).toLocaleDateString()}</span>
             </div>
             {isOwner && (
                <button onClick={() => onDelete(comment.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                   <Trash2 className="w-3 h-3" />
                </button>
             )}
          </div>

          <p className="text-slate-800 text-sm leading-relaxed mb-2 font-medium">
            {comment.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
             >
                <MessageCircle className="w-3.5 h-3.5" /> Reply
             </button>
          </div>

          {/* Reply Input */}
          {isReplying && (
             <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                <div className="relative">
                    <textarea
                      autoFocus
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      // FIX 3: Removed focus ring/border (outline-none focus:ring-0)
                      className="w-full p-4 text-sm text-slate-900 font-medium border border-slate-200 rounded-xl outline-none focus:ring-0 focus:border-slate-300 min-h-[60px] bg-slate-50 placeholder:text-slate-400 resize-none shadow-inner"
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)} className="h-7 text-xs text-slate-500">Cancel</Button>
                        <Button size="sm" onClick={handleSubmitReply} isLoading={isSubmitting} className="h-7 px-3 text-xs bg-slate-900 hover:bg-slate-700 text-white font-bold">Reply</Button>
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* --- NESTED REPLIES --- */}
      {replyCount > 0 && (
        <div className="pl-4 md:pl-10">
           {!areRepliesVisible ? (
               <button 
                 onClick={() => setAreRepliesVisible(true)}
                 className="flex items-center gap-2 my-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
               >
                  <CornerDownRight className="w-3 h-3" />
                  <span className="group-hover:underline decoration-indigo-500/30">View {replyCount} replies</span>
               </button>
           ) : (
               <div className="relative space-y-1">
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
                   <button onClick={() => setAreRepliesVisible(false)} className="text-[10px] font-bold text-slate-300 hover:text-slate-500 ml-4 mt-2">Hide replies</button>
               </div>
           )}
        </div>
      )}
    </div>
  );
}