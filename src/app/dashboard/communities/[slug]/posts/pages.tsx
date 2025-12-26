"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostService } from "@/services/post.service";
import { CommentService } from "@/services/comment.service"; // Import Service
import { Post } from "@/types/post";
import { Comment } from "@/types/comment"; // Import Type
import { CommentItem } from "@/components/comments/CommentItem"; // Import Component
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Calendar, ArrowBigUp, ArrowBigDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function PostDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Post AND Comments
  useEffect(() => {
    async function loadData() {
      try {
        const [postData, commentsData] = await Promise.all([
           PostService.getById(postId),
           CommentService.getByPost(postId)
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [postId]);

  // Handle Root Comment (Top Level)
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await CommentService.create(postId, { content: newComment });
      
      // Optimistic Add (with author fallback)
      const safeComment = { 
        ...created, 
        author: user?.username || "Me", 
        replies: [] 
      };
      
      setComments([safeComment, ...comments]);
      setNewComment("");
    } catch (e) {
      console.error("Failed to comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Nested Reply (Passed down to recursion)
  const handleReply = async (content: string, parentId: string) => {
    try {
      await CommentService.create(postId, { content, parent_id: parentId });
      // Refresh comments to show correct nesting structure from backend
      // (Recursion is hard to optimistically update accurately without complex logic)
      const freshComments = await CommentService.getByPost(postId);
      setComments(freshComments);
    } catch (e) {
      console.error("Reply failed");
    }
  };

  // Vote Logic (Simplified from previous)
  const handleVote = async (intent: 1 | -1) => { /* ... existing logic ... */ };

  if (isLoading) return <div className="flex justify-center h-screen pt-20"><Loader2 className="animate-spin text-indigo-600"/></div>;
  if (!post) return <div>Not Found</div>;

  const isProposal = post.post_type === "proposal";

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-0">
      
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 mt-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      {/* 1. POST CARD (The content) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-8">
        <div className="p-8 border-b border-slate-100">
           {/* ... Header (Same as before) ... */}
           <div className="flex items-center gap-3 mb-4">
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", isProposal ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700")}>{post.post_type}</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString()}</span>
           </div>
           <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h1>
           <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{post.author?.slice(0, 1)}</div>
              <span className="font-medium">@{post.author}</span>
           </div>
           
           <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
             {post.content}
           </div>
        </div>
      </div>

      {/* 2. COMMENTS SECTION */}
      <div id="comments" className="bg-slate-50 rounded-xl border border-slate-200 p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussion ({comments.length})
        </h3>

        {/* Comment Input */}
        <div className="mb-10 flex gap-4">
           <div className="hidden md:flex h-10 w-10 rounded-full bg-indigo-100 items-center justify-center font-bold text-indigo-600 mt-1">
              {user?.username?.slice(0,1).toUpperCase() || "U"}
           </div>
           <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add to the discussion..."
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] bg-white shadow-sm"
              />
              <div className="flex justify-end mt-2">
                 <Button onClick={handlePostComment} isLoading={isSubmitting} disabled={!newComment.trim()}>
                   Post Comment
                 </Button>
              </div>
           </div>
        </div>

        {/* Comment List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                onReply={handleReply} 
              />
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 italic">
              No comments yet. Be the first to start the conversation!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}