"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { CommunityService } from "@/services/community.service";
import { PostService } from "@/services/post.service";
import { Community } from "@/types/community";
import { Post } from "@/types/post";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/Button";
import { Loader2, Users, PenSquare, LayoutList, FileText, MessageSquare } from "lucide-react";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { cn } from "@/lib/utils";

export default function CommunityDetailPage() {
  const params = useParams();
  const slug = params.slug as string; // THIS is what we need to pass

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState<"proposal" | "discussion" | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [commData, postsData] = await Promise.all([
          CommunityService.getOne(slug),
          PostService.getByCommunity(slug, activeFilter || undefined)
        ]);
        setCommunity(commData);
        setPosts(postsData); // No need for complex mapping anymore
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, activeFilter]);

  const handleVote = async (postId: string, intent: 1 | -1) => {
    setPosts(currentPosts => 
      currentPosts.map(p => {
        if (p.id !== postId) return p;
        const currentVote = p.user_vote || 0;
        let newScore = p.score;
        let newVote = currentVote;

        if (intent === 1) { 
           if (currentVote === 1) { newVote = 0; newScore -= 1; }
           else if (currentVote === -1) { newVote = 1; newScore += 2; }
           else { newVote = 1; newScore += 1; }
        } else { 
           if (currentVote === -1) { newVote = 0; newScore += 1; }
           else if (currentVote === 1) { newVote = -1; newScore -= 2; }
           else { newVote = -1; newScore -= 1; }
        }
        return { ...p, score: newScore, user_vote: newVote };
      })
    );

    try {
      await PostService.vote(postId, intent);
    } catch (error) {
      console.error("Vote failed");
    }
  };

  const handleCreatePost = async (data: any) => {
    try {
      await PostService.create(slug, data);
      const freshPosts = await PostService.getByCommunity(slug, activeFilter || undefined);
      setPosts(freshPosts);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  if (isLoading && !community) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!community) return <div>Community not found</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{community.name}</h1>
            <p className="text-slate-600 max-w-2xl">{community.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-medium">
                <Users className="h-4 w-4 mr-1.5" />
                {community.member_count || 1} Members
              </div>
              <div className="flex items-center text-slate-400">
                Created {new Date(community.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-start">
             <Button onClick={() => setIsCreateModalOpen(true)}>
                <PenSquare className="h-4 w-4 mr-2" />
                Create Post
             </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveFilter(null)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeFilter === null ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <LayoutList className="h-4 w-4" /> All Posts
        </button>
        <button
          onClick={() => setActiveFilter("proposal")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeFilter === "proposal" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <FileText className="h-4 w-4" /> Proposals
        </button>
        <button
          onClick={() => setActiveFilter("discussion")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeFilter === "discussion" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <MessageSquare className="h-4 w-4" /> Discussions
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
           <div className="text-center py-10 text-slate-500">Updating feed...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onVote={handleVote}
              communitySlug={slug} // <--- FIX IS HERE
            />
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No posts found in this category.</p>
          </div>
        )}
      </div>

      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}