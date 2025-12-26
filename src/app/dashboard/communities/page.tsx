"use client";

import { useState, useEffect } from "react";
import { CommunityService } from "@/services/community.service";
import { Community } from "@/types/community";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { Plus, Search, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

// Validation Schema
const createCommunitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CreateFormValues = z.infer<typeof createCommunitySchema>;

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateFormValues>({
    resolver: zodResolver(createCommunitySchema),
  });

  // 1. CLEAN FETCH: No local storage merging. Trust the API.
  const fetchCommunities = async () => {
    try {
      const data = await CommunityService.getAll();
      setCommunities(data);
    } catch (error) {
      console.error("Failed to fetch communities", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // 2. CLEAN CREATE: Optimistic update
  const onCreateSubmit = async (data: CreateFormValues) => {
    try {
      const newCommunity = await CommunityService.create(data);
      // We assume the creator is a member
      const communityWithState = { ...newCommunity, is_member: true, member_count: 1 };
      setCommunities([communityWithState, ...communities]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create", error);
    }
  };

  // 3. CLEAN JOIN: Optimistic update only. 
  // We accept that this resets on refresh until the Backend API is fixed.
  const onJoin = async (slug: string) => {
    setJoiningSlug(slug);
    try {
      await CommunityService.join(slug);

      // Update UI state immediately for feedback
      setCommunities(currentList => 
        currentList.map(c => {
          if (c.slug === slug) {
            // If already member, do nothing. Else flip to true and increment.
            if (c.is_member) return c;
            return {
              ...c,
              is_member: true,
              member_count: (c.member_count || 0) + 1
            };
          }
          return c;
        })
      );
    } catch (error: any) {
        // Handle "Already Joined" (400) by updating UI state anyway
        if (error.response && error.response.status === 400) {
            setCommunities(currentList => 
                currentList.map(c => c.slug === slug ? { ...c, is_member: true } : c)
            );
        } else {
            console.error("Join failed", error);
        }
    } finally {
      setJoiningSlug(null);
    }
  };

  const filteredCommunities = communities.filter(c => 
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Communities</h1>
          <p className="text-slate-500 mt-1">
            Discover groups tackling problems in your area of interest.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" /> Create Community
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search communities..."
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm text-slate-900"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard 
                key={community.slug} 
                community={community} 
                onJoin={onJoin} 
                isJoining={joiningSlug === community.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
           <div className="bg-indigo-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-indigo-500" />
           </div>
           <h3 className="text-lg font-medium text-slate-900">No communities found</h3>
           <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
             {searchQuery ? "Try a different search term." : "Be the first pioneer. Create a community to start the movement."}
           </p>
           {!searchQuery && (
             <Button variant="outline" onClick={() => setIsModalOpen(true)}>
               Create One Now
             </Button>
           )}
        </div>
      )}

      {/* Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create a New Community"
      >
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <Input 
            label="Community Name" 
            placeholder="e.g. Nairobi Health Tech" 
            className="text-slate-900 placeholder:text-slate-400"
            error={errors.name?.message}
            {...register("name")}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className={cn(
                "flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50",
                "text-slate-900 placeholder:text-slate-400",
                errors.description && "border-red-500 focus-visible:ring-red-500"
              )}
              placeholder="What is this community about? e.g. solving traffic congestion..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
             </Button>
             <Button type="submit" isLoading={isSubmitting}>
                Create Community
             </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}