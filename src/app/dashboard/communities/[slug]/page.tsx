"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { CommunityService } from "@/services/community.service";
import { PostService } from "@/services/post.service";
import { Community } from "@/types/community";
import { Post } from "@/types/post";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/Button";
import { Loader2, Users, PenSquare } from "lucide-react";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { useAuth } from "@/context/AuthContext";

export default function CommunityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleVote = async (postId: string, intent: 1 | -1) => {
    // 1. Find the post to check its current state
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Default to 0 if undefined
    const currentVote = post.user_vote || 0; 
    let newScore = post.score;
    let newVote = currentVote;

    // 2. Calculate the Logic (Mirroring Backend)
    if (intent === 1) {
       // User clicked UP
       if (currentVote === 1) {
          // Already UP? Remove it (Toggle off)
          newVote = 0;
          newScore -= 1;
       } else if (currentVote === -1) {
          // Was DOWN? Switch to UP (+2 swing)
          newVote = 1;
          newScore += 2;
       } else {
          // Was Neutral? Vote UP
          newVote = 1;
          newScore += 1;
       }
    } else {
       // User clicked DOWN
       if (currentVote === -1) {
          // Already DOWN? Remove it (Toggle off)
          newVote = 0;
          newScore += 1;
       } else if (currentVote === 1) {
          // Was UP? Switch to DOWN (-2 swing)
          newVote = -1;
          newScore -= 2;
       } else {
          // Was Neutral? Vote DOWN
          newVote = -1;
          newScore -= 1;
       }
    }

    // 3. Optimistic UI Update
    setPosts(currentPosts => 
      currentPosts.map(p => 
        p.id === postId ? { ...p, score: newScore, user_vote: newVote } : p
      )
    );

    // 4. Call API
    try {
      await PostService.vote(postId, intent);
    } catch (error) {
      console.error("Vote failed, reverting...");
      // Ideally revert state here if API fails
      setPosts(currentPosts => 
        currentPosts.map(p => 
          p.id === postId ? { ...p, score: post.score, user_vote: post.user_vote } : p
        )
      );
    }
  };

  // ... imports

  const handleCreatePost = async (data: any) => {
    try {
      // 1. Send data to API to create the record
      const apiResponse = await PostService.create(slug, data);
      
      // 2. MANUAL CONSTRUCTION (Crucial for UI Persistence)
      // We do NOT re-fetch. We merge the API response (ID, Date) 
      // with the FORM DATA (Title, Content) to guarantee it shows up.
      const newPost: Post = {
        id: apiResponse.id || `temp-${Date.now()}`,
        title: data.title,         // <--- Forced from Form
        content: data.content,     // <--- Forced from Form (Fixes missing description)
        post_type: data.post_type, // <--- Forced from Form
        author: user?.username || "Me",
        score: 0,
        user_vote: 0,
        created_at: new Date().toISOString(),
        community: slug
      };

      // 3. Prepend to the list
      setPosts([newPost, ...posts]); 
      
      // 4. Close Modal
      setIsCreateModalOpen(false);
      
    } catch (error) {
      console.error("Failed to create post", error);
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
             {/* FIX: Corrected onClick handler */}
             <Button onClick={() => setIsCreateModalOpen(true)}>
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
          // FIX: Added 'index' as a fallback to prevent "unique key" crashes
          posts.map((post, index) => (
            <PostCard 
              key={post.id || `post-${index}`} // <--- The Fix
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

      {/* FIX: Added the Modal Component here so it actually renders */}
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}