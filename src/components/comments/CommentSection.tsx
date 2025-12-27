"use client";

import { useState, useEffect } from "react";
import { CommentService } from "@/services/comment.service";
import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/Button";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Top level input state
  const [rootContent, setRootContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await CommentService.getByPost(postId);
      setComments(data);
    } catch (e) {
      console.error("Failed to load comments", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Handle Root Comment
  const handleCreateRoot = async () => {
    if (!rootContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await CommentService.create(postId, { content: rootContent });
      // Prepend to list
      setComments([newComment, ...comments]);
      setRootContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Nested Reply (Passed down to children)
  const handleReply = async (parentId: number, content: string) => {
    const newReply = await CommentService.reply(parentId, { content });
    
    // Helper to insert reply into recursive tree
    const insertReply = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies) {
          return { ...c, replies: insertReply(c.replies) };
        }
        return c;
      });
    };

    setComments(prev => insertReply(prev));
  };

  // Handle Delete (Passed down)
  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    // Optimistic removal helper
    const removeComment = (list: Comment[]): Comment[] => {
      return list
        .filter(c => c.id !== commentId) // Remove if at this level
        .map(c => ({ ...c, replies: removeComment(c.replies || []) })); // Recurse
    };

    setComments(prev => removeComment(prev));

    try {
      await CommentService.delete(commentId);
    } catch (e) {
      console.error("Delete failed", e);
      fetchComments(); // Revert on failure
    }
  };

  if (isLoading) return <div className="py-10 text-center text-slate-400">Loading discussion...</div>;

  return (
    <div className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> 
          Discussion ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>

        {/* 1. Root Input */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
           <textarea
              value={rootContent}
              onChange={(e) => setRootContent(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full p-0 text-slate-700 placeholder:text-slate-400 border-none focus:ring-0 resize-none min-h-[80px]"
           />
           <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400 font-medium">Markdown supported</span>
              <Button 
                onClick={handleCreateRoot} 
                isLoading={isSubmitting} 
                disabled={!rootContent.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
              >
                 <Send className="w-3.5 h-3.5 mr-2" /> Post Comment
              </Button>
           </div>
        </div>

        {/* 2. Comment List */}
        <div className="space-y-6">
           {comments.length === 0 ? (
              <div className="text-center py-10">
                 <p className="text-slate-400 font-medium">No comments yet. Be the first to say something!</p>
              </div>
           ) : (
              comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  currentUsername={user?.username} // Need your AuthContext to provide this
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))
           )}
        </div>

      </div>
    </div>
  );
}