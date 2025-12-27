"use client";

import { useState, useEffect } from "react";
import { CommentService } from "@/services/comment.service";
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleCreateRoot = async () => {
    if (!rootContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await CommentService.create(postId, { content: rootContent });
      setComments([newComment, ...comments]);
      setRootContent("");
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  const handleReply = async (parentId: number, content: string) => {
    const newReply = await CommentService.reply(parentId, { content });
    const insertReply = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newReply] };
        if (c.replies) return { ...c, replies: insertReply(c.replies) };
        return c;
      });
    };
    setComments(prev => insertReply(prev));
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Delete this comment?")) return;
    const removeComment = (list: Comment[]): Comment[] => {
      return list.filter(c => c.id !== commentId).map(c => ({ ...c, replies: removeComment(c.replies || []) }));
    };
    setComments(prev => removeComment(prev));
    try { await CommentService.delete(commentId); } catch (e) { fetchComments(); }
  };

  if (isLoading) return <div className="py-10 text-center text-slate-400 text-sm">Loading discussion...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto border-t border-slate-100 pt-8">
      
      <div className="flex items-center justify-between mb-6 px-1">
         <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400" /> 
            Discussion <span className="text-slate-400">({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</span>
         </h3>
      </div>

      {/* COMPACT ROOT INPUT */}
      <div className="relative mb-8 group">
         {/* FIX: Removed focus-within rings and borders entirely */}
         <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
            <textarea
                value={rootContent}
                onChange={(e) => setRootContent(e.target.value)}
                placeholder="Start a discussion..."
                className="w-full p-4 text-slate-900 font-medium placeholder:text-slate-400 outline-none border-none focus:ring-0 resize-none min-h-[60px] bg-transparent"
             />
             
             {/* Action Bar */}
             <div className="flex justify-between items-center bg-slate-50/50 px-2 py-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold px-2">MARKDOWN ENABLED</span>
                <Button 
                  onClick={handleCreateRoot} 
                  isLoading={isSubmitting} 
                  disabled={!rootContent.trim()}
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-md font-bold h-8"
                >
                   <Send className="w-3 h-3 mr-1.5" /> Post
                </Button>
             </div>
         </div>
      </div>

      {/* COMMENT LIST */}
      <div className="space-y-4">
           {comments.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                 <p className="text-slate-400 text-sm font-medium">No comments yet. Be the first.</p>
              </div>
           ) : (
              comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  currentUsername={user?.username}
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))
           )}
      </div>
    </div>
  );
}