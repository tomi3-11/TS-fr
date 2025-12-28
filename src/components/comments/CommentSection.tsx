"use client";

import { useState, useEffect } from "react";
import { CommentService } from "@/services/comment.service";
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rootContent, setRootContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await CommentService.getByPost(postId);
      setComments(data);
    } catch (e) {
      console.error("Failed to fetch comments:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCreateRoot = async () => {
    if (!rootContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await CommentService.create(postId, { content: rootContent });
      // Attach local user context for immediate UI feedback
      const optimisticComment = { ...newComment, author: user?.username || "me", replies: [] };
      setComments([optimisticComment, ...comments]);
      setRootContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    const newReply = await CommentService.reply(parentId, { content });
    const insertReply = (list: Comment[]): Comment[] => {
      return list.map((c) => {
        if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newReply] };
        if (c.replies) return { ...c, replies: insertReply(c.replies) };
        return c;
      });
    };
    setComments((prev) => insertReply(prev));
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Remove this comment?")) return;
    const removeComment = (list: Comment[]): Comment[] => {
      return list
        .filter((c) => c.id !== commentId)
        .map((c) => ({ ...c, replies: removeComment(c.replies || []) }));
    };
    setComments((prev) => removeComment(prev));
    try {
      await CommentService.delete(commentId);
    } catch (e) {
      fetchComments();
    }
  };

  // Calculate total interaction count
  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Discussion</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 border-t border-slate-100 pt-10 md:pt-12">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-500" /> 
          Discussion 
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px]">
            {totalComments}
          </span>
        </h3>
      </div>

      {/* --- ROOT INPUT SECTION --- */}
      <div className="mb-10 group">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5">
          <textarea
            value={rootContent}
            onChange={(e) => setRootContent(e.target.value)}
            placeholder="Share your technical perspective or feedback..."
            className="w-full p-4 md:p-5 text-sm md:text-base text-slate-800 font-medium placeholder:text-slate-400 outline-none border-none focus:ring-0 resize-none min-h-[100px] md:min-h-[120px] bg-transparent"
          />
          
          <div className="flex justify-between items-center bg-slate-50 px-4 py-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Markdown Support</span>
            </div>
            
            <Button 
              onClick={handleCreateRoot} 
              isLoading={isSubmitting} 
              disabled={!rootContent.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 px-5 rounded-lg shadow-lg active:scale-95 transition-transform"
            >
              <Send className="w-3.5 h-3.5 mr-2" /> Post
            </Button>
          </div>
        </div>
      </div>

      {/* --- COMMENTS LIST --- */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageSquare className="h-5 w-5 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold text-sm">The stream is empty</p>
            <p className="text-slate-400 text-xs mt-1 font-medium">Be the first to share a thought.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {comments.map((comment) => (
              <div key={comment.id} className="py-2">
                <CommentItem 
                  comment={comment} 
                  currentUsername={user?.username}
                  onReply={handleReply}
                  onDelete={handleDelete}
                  depth={0}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint */}
      {comments.length > 3 && (
         <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">End of Discussion</p>
         </div>
      )}
    </div>
  );
}