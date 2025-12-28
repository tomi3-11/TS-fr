"use client";

import { useState, useEffect } from "react";
import { CommunityService } from "@/services/community.service";
import { Community } from "@/types/community";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Search, Globe, LayoutGrid, WifiOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { useAuth } from "@/context/AuthContext";

const createSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10),
});
type CreateForm = z.infer<typeof createSchema>;

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading: isAuthLoading } = useAuth();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema)
  });

  const fetchCommunities = async () => {
    try {
      setIsDataLoading(true);
      setServerError(null);
      const data = await CommunityService.getAll();
      setCommunities(data);
    } catch (e: any) { 
      console.error("Fetch error:", e); 
      setServerError("We couldn't reach the community server. Please try again later.");
    } finally { 
      setIsDataLoading(false); 
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
        fetchCommunities();
    }
  }, [isAuthLoading]);

  const handleCreate = async (data: CreateForm) => {
    try {
      await CommunityService.create(data);
      await fetchCommunities(); 
      setIsModalOpen(false);
      reset();
    } catch (e) { console.error(e); }
  };

  const handleJoin = async (slug: string) => {
    setJoiningSlug(slug);
    try {
      await CommunityService.join(slug);
      setCommunities(prev => prev.map(c => {
        if (c.slug === slug) return { ...c, is_member: true, total_members: (c.total_members || 0) + 1 };
        return c;
      }));
    } catch (e: any) {
      if (e.response?.status === 400) setCommunities(prev => prev.map(c => c.slug === slug ? { ...c, is_member: true } : c));
    } finally { setJoiningSlug(null); }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthLoading || isDataLoading) {
     return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  // ERROR UI FOR 500 STATUS
  if (serverError) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in px-4">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <WifiOff className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">System Unavailable</h2>
            <p className="text-slate-500 max-w-md mb-8">{serverError}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                Refresh Page
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20 px-4 md:px-0">
      
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs md:text-sm tracking-wide uppercase">
                  <Globe className="w-4 h-4" /> Explore The Ecosystem
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                  Find Your Community
               </h1>
               <p className="text-slate-400 max-w-lg text-sm md:text-lg">
                  Join groups of like-minded innovators. Collaborate, vote on proposals, and drive change.
               </p>
            </div>
            
            {/* Stat Block - Hidden on small mobile to save space */}
            <div className="hidden md:block bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[140px] text-center">
                <div className="text-3xl font-black">{communities.length}</div>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Active Hubs</div>
            </div>
         </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             </div>
             <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
             />
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto h-12 px-6 shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Create New Hub
          </Button>
      </div>

      {/* Grid */}
      {filteredCommunities.length === 0 ? (
        <div className="text-center py-20">
           <LayoutGrid className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <h3 className="text-slate-900 font-bold text-lg">No communities found</h3>
           <p className="text-slate-500">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredCommunities.map((c) => (
             <CommunityCard key={c.slug} community={c} onJoin={handleJoin} isJoining={joiningSlug === c.slug} />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Launch a Community">
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
          <Input label="Community Name" {...register("name")} error={errors.name?.message} placeholder="e.g. AI Research Lab" className="font-bold text-slate-900 h-12" />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Mission Statement</label>
            <textarea 
              className="w-full border border-slate-300 rounded-xl p-3 text-slate-900 font-medium min-h-[120px] focus:ring-2 focus:ring-indigo-500 resize-none transition-all" 
              {...register("description")} 
              placeholder="What is this group about?"
            />
            {errors.description && <p className="text-red-600 text-xs font-bold">{errors.description.message}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full h-12 font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md">Launch Community</Button>
        </form>
      </Modal>
    </div>
  );
}