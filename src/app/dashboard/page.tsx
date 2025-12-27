"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FeedService } from "@/services/feed.service";
import { CommunityService } from "@/services/community.service"; 
import { Post } from "@/types/post";
import { Community } from "@/types/community";
import { PostCard } from "@/components/posts/PostCard";
import { PostService } from "@/services/post.service"; 
import { Flame, Clock, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<"latest" | "top">("latest");
  const [posts, setPosts] = useState<Post[]>([]); 
  const [trendingCommunities, setTrendingCommunities] = useState<Community[]>([]);
  
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(true);

  // 1. Fetch Feed Data (Optimized with Cleanup)
  useEffect(() => {
    // Create an abort controller for this specific effect execution
    const controller = new AbortController();
    
    async function loadFeed() {
      // UX Fix: Clear posts immediately to show skeletons. 
      // This prevents the "stuck" feeling where old data persists while new data loads.
      setPosts([]); 
      setIsLoadingFeed(true);
      
      try {
        const data = activeTab === "latest" 
          ? await FeedService.getLatest() 
          : await FeedService.getTop("week");
        
        // Only update state if the request wasn't cancelled
        if (!controller.signal.aborted) {
          setPosts(data?.items || []); 
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error("Feed error", e);
          setPosts([]); 
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingFeed(false);
        }
      }
    }

    loadFeed();

    // Cleanup function: Cancels the API call if the user switches tabs quickly
    return () => {
      controller.abort();
    };
  }, [activeTab]);

  // 2. Fetch Sidebar Data (Runs once)
  useEffect(() => {
    async function loadTrending() {
      try {
        const data = await CommunityService.getAll();
        const sorted = data.sort((a, b) => (b.total_members || 0) - (a.total_members || 0)).slice(0, 5);
        setTrendingCommunities(sorted);
      } catch (e) { console.error(e); } finally { setIsLoadingSidebar(false); }
    }
    loadTrending();
  }, []);

  // 3. Voting Logic
  const handleVote = async (id: string, val: 1 | -1) => {
    setPosts(prev => (prev || []).map(p => {
      if (p.id === id) {
        const current = p.user_vote || 0;
        const nextVote = current === val ? 0 : val;
        const guessDiff = nextVote - current; 
        
        return { 
            ...p, 
            score: p.score + guessDiff, 
            user_vote: nextVote === 0 ? null : nextVote 
        };
      }
      return p;
    }));

    try {
      const response = await PostService.vote(id, val);
      
      setPosts(prev => (prev || []).map(p => {
        if (p.id === id) {
          return { 
             ...p, 
             score: response.new_score, 
             user_vote: response.user_vote === 0 ? null : response.user_vote 
          };
        }
        return p;
      }));
    } catch (e) {
      console.error("Vote failed", e);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      
      {/* HEADER */}
      <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
         <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
               Your Tech Stream
            </h1>
            <p className="text-blue-200/80 font-medium max-w-xl text-lg">
               The pulse of the developer ecosystem. See what's shipping, who's recruiting, and what's breaking.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- MAIN FEED --- */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Toggles */}
           <div className="flex items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
              <button
                onClick={() => setActiveTab("latest")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === "latest" 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                 <Clock className="w-4 h-4" /> Latest
              </button>
              <button
                onClick={() => setActiveTab("top")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === "top" 
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                 <Flame className="w-4 h-4" /> Top Rated
              </button>
           </div>

           {/* Content */}
           <div className="min-h-[400px]">
              {isLoadingFeed ? (
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
                    ))}
                 </div>
              ) : posts && posts.length > 0 ? (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    {posts.map(post => (
                       <PostCard 
                          key={post.id} 
                          post={post} 
                          communitySlug={typeof post.community === 'object' ? (post.community as any).slug : undefined} 
                          onVote={handleVote} 
                       />
                    ))}
                    
                    <div className="py-8 text-center">
                       <p className="text-slate-400 text-sm font-medium">You've reached the end of the stream.</p>
                    </div>
                 </div>
              ) : (
                 <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Zap className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">It's quiet here</h3>
                    <p className="text-slate-500">Be the first to post something in a community!</p>
                 </div>
              )}
           </div>
        </div>

        {/* --- SIDEBAR --- */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-8">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Trending Hubs
                 </h3>
                 <Link href="/dashboard/communities" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              
              <div className="divide-y divide-slate-50">
                 {isLoadingSidebar ? (
                    <div className="p-6 text-center text-slate-400 text-sm">Loading trends...</div>
                 ) : trendingCommunities.map((community, index) => (
                    <Link 
                      key={community.id} 
                      href={`/dashboard/communities/${community.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                    >
                       <span className="text-slate-300 font-black text-lg w-4 text-center group-hover:text-indigo-500 transition-colors">
                          {index + 1}
                       </span>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{community.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{community.total_members} members</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                 ))}
              </div>
           </div>

           <div className="px-4">
               <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-400">
                  <span className="hover:text-slate-600 cursor-pointer">About</span>
                  <span className="hover:text-slate-600 cursor-pointer">Guidelines</span>
                  <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
                  <span className="hover:text-slate-600 cursor-pointer">API Docs</span>
                  <span>© 2025 TechSpace</span>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}