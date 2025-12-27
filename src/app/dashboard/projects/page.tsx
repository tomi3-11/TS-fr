"use client";

import { useEffect, useState } from "react";
import { ProjectService } from "@/services/project.service";
import { Project, ProjectStatus } from "@/types/project";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { 
  Plus, 
  Zap, 
  Search, 
  Filter, 
  Trophy, 
  Rocket 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// --- 1. LOCAL STORAGE HELPERS (Persistence) ---
const getLocalVotes = (): Record<number, number> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("project_votes") || "{}");
  } catch {
    return {};
  }
};

const saveLocalVote = (projectId: number, vote: number) => {
  const votes = getLocalVotes();
  if (vote === 0) {
    delete votes[projectId]; // Remove if vote is toggled off
  } else {
    votes[projectId] = vote;
  }
  localStorage.setItem("project_votes", JSON.stringify(votes));
};

// --- 2. STATS COMPONENT ---
function ProjectStats({ projects }: { projects: Project[] }) {
    const totalVotes = projects.reduce((acc, p) => acc + (p.vote_score || 0), 0);
    const activeCount = projects.filter(p => p.status === 'ACTIVE').length;
    const proposedCount = projects.filter(p => p.status === 'PROPOSED').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
                <div className="flex items-center gap-3 opacity-80 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Engagement</span>
                </div>
                <div className="text-2xl font-black">{totalVotes}</div>
                <div className="text-xs text-indigo-100">Total votes cast</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                 <div className="flex items-center gap-3 text-emerald-600 mb-1">
                    <Rocket className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Building</span>
                </div>
                <div className="text-2xl font-black text-slate-800">{activeCount}</div>
                <div className="text-xs text-slate-500">Active projects</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                 <div className="flex items-center gap-3 text-blue-600 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Proposals</span>
                </div>
                <div className="text-2xl font-black text-slate-800">{proposedCount}</div>
                <div className="text-xs text-slate-500">Open for voting</div>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Client-side Filters
  const [activeTab, setActiveTab] = useState<ProjectStatus | 'ALL'>('PROPOSED');
  const [selectedSector, setSelectedSector] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState("");

  // --- 3. LOAD DATA + SYNC LOCAL STORAGE ---
  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await ProjectService.getAll(); 
        
        // Merge API data with LocalStorage memory
        // This ensures red/green buttons stay active even if backend list doesn't return user_vote
        const localVotes = getLocalVotes();
        const mergedData = data.map(p => ({
            ...p,
            user_vote: p.user_vote || localVotes[p.id] || 0
        }));

        setProjects(mergedData);
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  // --- 4. HYBRID VOTING HANDLER ---
  const handleVote = async (id: number, val: 1 | -1) => {
    // A. Optimistic Update (Instant Visual Feedback)
    setProjects(prev => prev.map(p => {
        if (p.id === id) {
            const currentVote = p.user_vote || 0;
            const nextVote = currentVote === val ? 0 : val; // Toggle off if same vote
            const scoreDiff = nextVote - currentVote; 
            
            // Save optimistic state to local storage
            saveLocalVote(id, nextVote);

            return { 
                ...p, 
                vote_score: (p.vote_score || 0) + scoreDiff, 
                user_vote: nextVote 
            };
        }
        return p;
    }));

    try {
        // B. API Call
        // @ts-ignore - Ignoring strict type check if service interface isn't fully updated yet
        const response = await ProjectService.vote(id, val);

        // C. Server Sync (Snap to Truth)
        if (response && typeof response.new_score === 'number') {
            setProjects(prev => prev.map(p => {
                if (p.id === id) {
                    // Update LocalStorage with confirmed server truth
                    saveLocalVote(id, response.user_vote);
                    
                    return { 
                        ...p, 
                        vote_score: response.new_score, // Use real server score
                        user_vote: response.user_vote   // Use real server vote status
                    };
                }
                return p;
            }));
        }
    } catch (e) {
        console.error("Vote failed", e);
        // Optional: Add toast notification here
    }
  };

  // --- 5. FILTERING LOGIC ---
  const filteredProjects = projects.filter(project => {
      if (activeTab !== 'ALL' && project.status !== activeTab) return false;
      if (selectedSector !== 'ALL' && project.sector.toLowerCase() !== selectedSector.toLowerCase()) return false;
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
  });

  const sectors = Array.from(new Set(projects.map(p => p.sector))).filter(Boolean);

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Innovation Hub
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
                Collaborate on open-source solutions for local challenges. 
                Vote on proposals to decide what gets built next.
            </p>
        </div>
        
        <Link href="/dashboard/projects/create">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-xl shadow-slate-200/50 transition-all rounded-full px-6 h-12">
                <Plus className="w-5 h-5" /> Launch Proposal
            </Button>
        </Link>
      </div>

      {/* STATS */}
      {!isLoading && <ProjectStats projects={projects} />}

      {/* CONTROL BAR (Responsive Fixed) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center sticky top-4 z-20 backdrop-blur-md bg-white/90">
         
         {/* Tabs */}
         <div className="flex bg-slate-100/50 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            {(['PROPOSED', 'ACTIVE', 'COMPLETED', 'ALL'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-1 lg:flex-none text-center",
                        activeTab === tab 
                            ? "bg-white text-indigo-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tab === 'PROPOSED' ? 'Voting Phase' : tab === 'ALL' ? 'View All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
            ))}
         </div>

         {/* Search & Filter */}
         <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <select 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
            >
                <option value="ALL">All Sectors</option>
                {sectors.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
         </div>
      </div>

      {/* MAIN GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-72 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
            {filteredProjects.map((project) => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onVote={handleVote} 
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">No projects found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                We couldn't find any projects matching your current filters. Try switching tabs or clearing your search.
            </p>
            <Button 
                variant="outline" 
                onClick={() => { setActiveTab('ALL'); setSelectedSector('ALL'); setSearchQuery(''); }}
            >
                Clear Filters
            </Button>
        </div>
      )}
    </div>
  );
}