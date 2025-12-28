"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostService } from "@/services/post.service";
import { CommunityService } from "@/services/community.service";
import { Post } from "@/types/post";
import { Community } from "@/types/community";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Calendar, Zap, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentSection } from "@/components/comments/CommentSection";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Content Toggles
  const [isExpanded, setIsExpanded] = useState(false);
  const CHAR_LIMIT = 600; 

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [postData, communityData] = await Promise.all([
          PostService.getById(postId, slug),
          CommunityService.getOne(slug)
        ]);
        setPost(postData);
        setCommunity(communityData);
      } catch (e) {
        console.error("Failed to load post", e);
        setError("This post could not be found.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [postId, slug]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-900 h-8 w-8" /></div>;
  
  if (error || !post) return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
       <div className="bg-slate-100 p-4 rounded-full mb-4"><Zap className="h-8 w-8 text-slate-400" /></div>
       <h1 className="text-xl font-bold text-slate-900">Post Not Found</h1>
       <Button variant="outline" onClick={() => router.back()} className="mt-4">Go Back</Button>
    </div>
  );

  const isLongContent = post.content ? post.content.length > CHAR_LIMIT : false;
  const displayContent = isExpanded || !isLongContent 
    ? post.content 
    : post.content?.slice(0, CHAR_LIMIT);

  return (
    <div className="min-w-0 w-full animate-in fade-in slide-in-from-bottom-4 pb-20">
      
      {/* Breadcrumb */}
      <div className="mb-4 md:mb-6 px-1">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to {community?.name || "Community"}
        </button>
      </div>

      {/* --- POST CARD --- */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
           
           {/* Header */}
           <div className="px-5 py-6 md:px-10 md:pt-10 md:pb-6 relative">
               <div className="relative z-10">
                   {/* Meta Badges - Wrapped for mobile */}
                   <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest border shadow-sm",
                        post.post_type === "proposal" 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-emerald-600 text-white border-emerald-600"
                      )}>
                        {post.post_type}
                      </span>
                      
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 text-[10px] md:text-xs font-bold border border-slate-200">
                         <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 fill-slate-400 text-slate-400" />
                         {new Intl.NumberFormat('en-US', { notation: "compact" }).format(post.score)} Impact
                      </span>
                   </div>

                   {/* Title - Responsive Text Size */}
                   <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6 md:mb-8 break-words tracking-tight">
                     {post.title}
                   </h1>

                   {/* Author Row - Stacked/Wrapped on very small screens if needed, otherwise flex */}
                   <div className="flex flex-wrap items-center gap-4 text-sm border-t border-slate-100 pt-4 md:pt-6">
                      <div className="flex items-center gap-3">
                         <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                            {post.author.slice(0,1).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm md:text-base">@{post.author}</p>
                            <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-wider font-bold">Author</p>
                         </div>
                      </div>
                      
                      <div className="hidden sm:block h-8 w-px bg-slate-200 mx-1"></div>
                      
                      <div className="flex flex-col ml-auto sm:ml-0">
                         <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs md:text-sm">
                             <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                             {new Date(post.created_at).toLocaleDateString()}
                         </div>
                         <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-wider font-bold text-right sm:text-left">Posted</p>
                      </div>
                   </div>
               </div>
           </div>

           {/* Content Body */}
           <div className="px-5 md:px-10 py-6 md:py-8 relative border-t border-slate-50">
              <div className="prose prose-slate prose-base md:prose-lg max-w-none text-slate-800 leading-relaxed md:leading-loose font-medium whitespace-pre-wrap break-words">
                 {displayContent}
              </div>

              {isLongContent && (
                  <div className={cn("relative mt-4", !isExpanded && "pt-12")}>
                      {!isExpanded && <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent top-[-60px]"></div>}
                      <div className="relative z-10 flex justify-center">
                          <Button 
                            variant="outline"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="rounded-full px-6 border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 bg-white shadow-sm text-xs md:text-sm h-9 md:h-10"
                          >
                             {isExpanded ? (
                                <span className="flex items-center gap-2">Show Less <ChevronUp className="w-3.5 h-3.5" /></span>
                             ) : (
                                <span className="flex items-center gap-2">Continue Reading <ChevronDown className="w-3.5 h-3.5" /></span>
                             )}
                          </Button>
                      </div>
                  </div>
              )}
           </div>

           {/* Footer (Simplified) */}
           <div className="bg-slate-50 px-5 py-4 md:p-6 md:px-10 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs md:text-sm font-bold text-slate-400 hidden sm:block">Join the discussion below.</p>
              <Button variant="ghost" size="sm" className="font-bold text-slate-500 hover:text-slate-900 ml-auto sm:ml-0">
                  <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" /> Share Post
              </Button>
           </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-6 md:mt-8">
         <CommentSection postId={postId} />
      </div>
    </div>
  );
}