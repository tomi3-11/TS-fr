"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // To get [slug]
import { CommunityService } from "@/services/community.service";
import { PostService } from "@/services/post.service";
import { Community } from "@/types/community";
import { Post } from "@/types/post";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/Button";
import { Loader2, Users, PenSquare } from "lucide-react";

export default function CommunityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [commData, postsData] = await Promise.all([
          CommunityService.getOne(slug),
          PostService.getByCommunity(slug)
        ]);
        setCommunity(commData);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to load community", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleVote = async (postId: string, value: 1 | -1) => {
    // Optimistic Update
    setPosts(currentPosts => 
      currentPosts.map(p => 
        p.id === postId ? { ...p, score: p.score + value } : p
      )
    );
    // Call API
    try {
      await PostService.vote(postId, value);
    } catch (error) {
      // Revert if failed (optional, but good practice)
      console.error("Vote failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!community) return <div>Community not found</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {/* Community Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{community.name}</h1>
            <p className="text-slate-600 max-w-2xl">{community.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1.5" />
                <span>Members</span>
              </div>
              <div>
                Created {new Date(community.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-start">
             {/* We will add a "Join/Leave" button here later */}
             <Button>
                <PenSquare className="h-4 w-4 mr-2" />
                Create Post
             </Button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Discussions & Proposals</h2>
        
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onVote={handleVote} 
            />
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No posts yet. Be the first to share an idea!</p>
          </div>
        )}
      </div>
    </div>
  );
}