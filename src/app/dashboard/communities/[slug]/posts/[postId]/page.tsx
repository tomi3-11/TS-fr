"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostService } from "@/services/post.service";
import { Post } from "@/types/post";
import { Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await PostService.getById(params.postId as string);
        setPost(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params.postId]);

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-20" />;
  if (!post) return <div>Not Found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center text-sm text-slate-500 mb-6 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <div className="flex gap-2 mb-4">
           <span className={cn("px-2 py-0.5 rounded text-xs font-bold uppercase", post.post_type === 'proposal' ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700")}>
             {post.post_type}
           </span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
           <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-700">
             {post.author.slice(0,1).toUpperCase()}
           </div>
           <span>@{post.author}</span>
           <span>•</span>
           <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
          {post.content}
        </div>
      </div>
    </div>
  );
}