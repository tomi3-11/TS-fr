"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostService } from "@/services/post.service";
import { CommentService } from "@/services/comment.service";
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";
import { CommentItem } from "@/components/comments/CommentItem";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Calendar, MessageSquare, Zap } from "lucide-react";
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
           PostService.getById(postId, params.slug as string),
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
  }, [postId, params.slug]);

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

  // Handle Nested Reply
  const handleReply = async (parentId: number, content: string) => {
    try {
      await CommentService.reply(parentId, { content });
      const freshComments = await CommentService.getByPost(postId);
      setComments(freshComments);
    } catch (e) {
      console.error("Reply failed");
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await CommentService.delete(commentId);
      const freshComments = await CommentService.getByPost(postId);
      setComments(freshComments);
    } catch (e) {
      console.error("Delete failed");
    }
  };

  if (isLoading) return <div className="flex justify-center h-screen pt-20"><Loader2 className="animate-spin text-slate-900 h-8 w-8"/></div>;
  
  if (!post) return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
       <div className="bg-slate-100 p-4 rounded-full mb-4"><Zap className="h-8 w-8 text-slate-400" /></div>
       <h1 className="text-xl font-bold text-slate-900">Post Not Found</h1>
       <Button variant="outline" onClick={() => router.back()} className="mt-4">Go Back</Button>
    </div>
  );

  const isProposal = post.post_type === "proposal";

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Back Button */}
      <div className="py-4 md:py-6">
        <button 
            onClick={() => router.back()} 
            className="group flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
        </button>
      </div>

      {/* 1. POST CARD */}
      <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="p-5 md:p-10 border-b border-slate-100">
           
           {/* Header Meta */}
           <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest border shadow-sm",
                  isProposal ? "bg-slate-900 text-white border-slate-900" : "bg-emerald-600 text-white border-emerald-600"
              )}>
                {post.post_type}
              </span>
              
              <div className="hidden sm:block w-px h-4 bg-slate-300 mx-1"></div>
              
              <span className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-slate-500">
                 <Calendar className="w-3.5 h-3.5" />
                 {new Date(post.created_at).toLocaleDateString()}
              </span>
           </div>

           {/* Title */}
           <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight break-words tracking-tight">
             {post.title}
           </h1>

           {/* Author */}
           <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                {post.author?.slice(0, 1).toUpperCase()}
              </div>
              <div>
                 <span className="block font-bold text-slate-900 text-sm md:text-base">@{post.author}</span>
                 <span className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Author</span>
              </div>
           </div>
           
           {/* Content */}
           <div className="prose prose-slate prose-base md:prose-lg max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
             {post.content}
           </div>
        </div>
      </div>

      {/* 2. COMMENTS SECTION */}
      <div id="comments" className="bg-slate-50 rounded-xl md:rounded-2xl border border-slate-200 p-5 md:p-8">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-400" />
          Discussion <span className="text-slate-400 font-medium">({comments.length})</span>
        </h3>

        {/* Comment Input */}
        <div className="mb-8 md:mb-10 flex gap-3 md:gap-4">
           <div className="hidden md:flex h-10 w-10 rounded-lg bg-blue-100 items-center justify-center font-bold text-blue-700 mt-1 shrink-0">
              {user?.username?.slice(0,1).toUpperCase() || "U"}
           </div>
           <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full rounded-xl border border-slate-300 p-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px] bg-white shadow-sm resize-y outline-none transition-all placeholder:text-slate-400"
              />
              <div className="flex justify-end mt-2">
                 <Button 
                    onClick={handlePostComment} 
                    isLoading={isSubmitting} 
                    disabled={!newComment.trim()}
                    className="h-10 px-6 text-sm font-bold rounded-lg"
                 >
                   Post Comment
                 </Button>
              </div>
           </div>
        </div>

        {/* Comment List */}
        <div className="space-y-6 md:space-y-8">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                currentUsername={user?.username}
                onReply={handleReply} 
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                 <MessageSquare className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No comments yet.</p>
              <p className="text-slate-400 text-sm">Be the first to start the conversation!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}