"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CommunityService } from "@/services/community.service";
import { PostService } from "@/services/post.service";
import { Community } from "@/types/community";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Loader2, PenSquare, Users, MessageSquare, FileText, WifiOff, Search } from "lucide-react";
import { PostCard } from "@/components/posts/PostCard";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(5, "Title is too short.").max(100, "Title is too long."),
  content: z.string().min(20, "Content is too short (min 20 chars).").max(5000, "Content exceeds limit."),
  post_type: z.enum(["proposal", "discussion"]),
});
type PostForm = z.infer<typeof postSchema>;

export default function CommunityDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<"proposal" | "discussion" | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { post_type: "discussion" }
  });

  const activeType = watch("post_type");

  useEffect(() => {
    async function loadCommunity() {
      try {
        if (!slug) return;
        const data = await CommunityService.getOne(slug);
        setCommunity(data);
      } catch (e) { console.error(e); } finally { setIsLoadingCommunity(false); }
    }
    loadCommunity();
  }, [slug]);

  useEffect(() => {
    async function loadPosts() {
      setIsLoadingPosts(true);
      setFeedError(null);
      try {
        if (!slug) return;
        const data = await PostService.getByCommunity(slug, filter);
        setPosts(data);
      } catch (e: any) {
        setFeedError("We couldn't load the posts right now.");
      } finally { setIsLoadingPosts(false); }
    }
    loadPosts();
  }, [slug, filter]);

  const handleCreatePost = async (data: PostForm) => {
    try {
      const res = await PostService.create(slug, data);
      try {
          const newPost = await PostService.getById(res.post_id);
          setPosts([newPost, ...posts]);
      } catch (err) { console.warn("Refresh required"); }
      setIsModalOpen(false);
      reset();
    } catch (e) { console.error("Create failed", e); }
  };

  const handleVote = async (id: string, val: 1 | -1) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const current = p.user_vote || 0;
        let nextVote = current === val ? 0 : val;
        let scoreDiff = nextVote - current; 
        return { ...p, score: p.score + scoreDiff, user_vote: nextVote === 0 ? null : nextVote };
      }
      return p;
    }));
    try { await PostService.vote(id, val); } catch (e) { console.error(e); }
  };

  if (isLoadingCommunity) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  if (!community) return <div className="text-center py-20 font-bold text-slate-700">Community not found</div>;

  return (
    // FIX 1: "min-w-0" prevents flex children from blowing out the width
    // FIX 2: "w-full" ensures it takes available space, not screen space
    <div className="flex flex-col gap-6 md:gap-8 min-w-0 w-full animate-in fade-in slide-in-from-bottom-4 pb-20">
      
      {/* --- HERO DASHBOARD CARD --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative mx-4 md:mx-0">
        {/* Decorative Top Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
        
        <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                
                {/* Identity Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-700 text-lg border border-slate-200">
                            {community.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className={cn(
                            "text-xs font-bold px-3 py-1 rounded-full border tracking-wide uppercase", 
                            community.is_member 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-slate-50 text-slate-500 border-slate-200"
                        )}>
                            {community.is_member ? "Member" : "Visitor View"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 break-words leading-tight">
                        {community.name}
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl break-words">
                        {community.description}
                    </p>
                </div>

                {/* Stats Widget (Hidden on tiny screens, shown on md+) */}
                <div className="hidden md:flex flex-col gap-3 min-w-[140px] bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>{community.total_members} Members</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        <span>{posts.length} Posts</span>
                     </div>
                </div>
            </div>
            
            {/* Mobile Stats (Visible only on small screens) */}
            <div className="md:hidden flex items-center gap-4 mt-6 pt-6 border-t border-slate-100 text-sm font-bold text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {community.total_members}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {posts.length}</span>
            </div>
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      <div className="flex flex-col-reverse md:flex-row justify-between gap-4 px-4 md:px-0">
        
        {/* Filters - "Pill" Style */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
          <button 
             onClick={() => setFilter(undefined)}
             className={cn("whitespace-nowrap px-5 py-2.5 text-sm font-bold rounded-full border transition-all", !filter ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}
          >
            All Posts
          </button>
          <button 
             onClick={() => setFilter("proposal")}
             className={cn("whitespace-nowrap px-5 py-2.5 text-sm font-bold rounded-full border transition-all flex items-center gap-2", filter === "proposal" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}
          >
            Proposals
          </button>
          <button 
             onClick={() => setFilter("discussion")}
             className={cn("whitespace-nowrap px-5 py-2.5 text-sm font-bold rounded-full border transition-all flex items-center gap-2", filter === "discussion" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}
          >
            Discussions
          </button>
        </div>

        {community.is_member && (
             <Button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full md:w-auto h-11 shadow-lg shadow-indigo-100 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 flex items-center justify-center gap-2"
             >
                <PenSquare className="w-4 h-4" /> New Post
             </Button>
        )}
      </div>

      {/* --- FEED GRID --- */}
      {/* FIX 3: Ensure feed doesn't overflow horizontally */}
      <div className="px-4 md:px-0 min-w-0 w-full">
        {isLoadingPosts ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm font-semibold">Loading feed...</p>
            </div>
        ) : feedError ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center max-w-lg mx-auto">
                <WifiOff className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-slate-900 font-bold">Feed Unavailable</h3>
                <p className="text-slate-600 mt-1 text-sm">{feedError}</p>
                <Button variant="outline" size="sm" className="mt-4 border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>Retry Connection</Button>
            </div>
        ) : posts.length > 0 ? (
            <div className="space-y-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onVote={handleVote} communitySlug={slug} />
                ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">No posts yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">
                    This community is quiet. Be the first to break the silence.
                </p>
            </div>
        )}
      </div>

      {/* --- CREATE MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a New Post">
        <form onSubmit={handleSubmit(handleCreatePost)} className="space-y-6">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            {["discussion", "proposal"].map(type => (
                <button 
                  key={type} 
                  type="button" 
                  onClick={() => setValue("post_type", type as any)} 
                  className={cn("py-3 text-sm font-bold rounded-lg capitalize transition-all", activeType === type ? "bg-white shadow-sm text-indigo-600 ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700")}
                >
                  {type}
                </button>
            ))}
          </div>
          <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
              <Input {...register("title")} error={errors.title?.message} placeholder="Give your post a clear title" className="h-12 text-lg font-bold text-slate-900 bg-white border-slate-300 focus:border-indigo-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Content</label>
            <textarea className={cn("w-full border rounded-xl p-4 text-slate-900 font-medium min-h-[200px] bg-white border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none", errors.content ? "border-red-500" : "")} placeholder="Write something meaningful..." {...register("content")} />
            {errors.content && <p className="text-red-600 text-xs font-bold px-1">{errors.content.message}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full font-bold h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">Publish Post</Button>
        </form>
      </Modal>
    </div>
  );
}