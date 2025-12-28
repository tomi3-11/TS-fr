"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Trash2, CornerDownRight, ChevronUp } from "lucide-react";
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

  // Tech-focused gradient palette
  const gradients = [
    "bg-gradient-to-br from-slate-800 to-slate-950",
    "bg-gradient-to-br from-indigo-900 to-slate-900",
    "bg-gradient-to-br from-emerald-900 to-teal-950",
    "bg-gradient-to-br from-blue-900 to-cyan-950",
    "bg-gradient-to-br from-purple-900 to-violet-950",
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
    <div className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-300">
      
      {/* --- COMMENT CARD --- */}
      <div className={cn(
        "relative flex gap-2 md:gap-3 py-3 transition-all group",
        // Recursive Indentation: Less on mobile, more on desktop
        depth > 0 ? "ml-3 md:ml-6 pl-3 border-l border-slate-200" : ""
      )}>
        {/* Thread Line Connector for depth */}
        {depth > 0 && (
          <div className="absolute left-0 top-0 h-4 w-3 border-b border-slate-200 rounded-bl-lg" />
        )}

        {/* Avatar */}
        <div className="flex-shrink-0 relative z-10">
          <div className={cn(
            "h-7 w-7 md:h-8 md:w-8 rounded-lg flex items-center justify-center font-bold text-[9px] md:text-[10px] tracking-wider text-white shadow-sm border border-white/10 shrink-0", 
            avatarStyle
          )}>
            {comment.author.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
             <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-xs md:text-sm text-slate-900 font-mono tracking-tight truncate">
                  {comment.author}
                </span>
                <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
             </div>
             {isOwner && (
                <button 
                  onClick={() => onDelete(comment.id)} 
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  aria-label="Delete comment"
                >
                   <Trash2 className="w-3.5 h-3.5" />
                </button>
             )}
          </div>

          <p className="text-slate-700 text-sm leading-relaxed mb-2 break-words">
            {comment.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsReplying(!isReplying)}
                className={cn(
                  "flex items-center gap-1.5 text-[10px] md:text-xs font-black transition-colors",
                  isReplying ? "text-indigo-600" : "text-slate-400 hover:text-slate-900"
                )}
             >
                <MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> 
                {isReplying ? "CANCEL" : "REPLY"}
             </button>
          </div>

          {/* Reply Input Box */}
          {isReplying && (
             <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="relative group">
                    <textarea
                      autoFocus
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="w-full p-3 md:p-4 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-300 transition-all min-h-[80px] resize-none shadow-inner"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button 
                          size="sm" 
                          onClick={handleSubmitReply} 
                          isLoading={isSubmitting} 
                          className="h-8 px-4 text-[10px] md:text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-md"
                        >
                          Submit Reply
                        </Button>
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* --- NESTED REPLIES SECTION --- */}
      {replyCount > 0 && (
        <div className="flex flex-col">
           {!areRepliesVisible ? (
               <button 
                 onClick={() => setAreRepliesVisible(true)}
                 className="flex items-center gap-2 ml-10 md:ml-14 my-1 text-[10px] md:text-[11px] font-black text-indigo-500/80 hover:text-indigo-600 transition-all uppercase tracking-widest"
               >
                  <CornerDownRight className="w-3 h-3" />
                  <span>{replyCount} {replyCount === 1 ? "Reply" : "Replies"}</span>
               </button>
           ) : (
               <div className="animate-in fade-in duration-300">
                   <div className="space-y-1">
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
                   </div>
                   <button 
                      onClick={() => setAreRepliesVisible(false)} 
                      className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-slate-400 hover:text-slate-600 ml-10 md:ml-14 mt-2 uppercase tracking-tighter"
                   >
                      <ChevronUp className="w-3 h-3" /> Hide Conversation
                   </button>
               </div>
           )}
        </div>
      )}
    </div>
  );
}