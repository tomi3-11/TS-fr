"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectService } from "@/services/project.service";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/Button";
import { ProjectOwnerControls } from "@/components/projects/ProjectOwnerControls";
import { 
  ArrowLeft, 
  CalendarDays, 
  LayoutGrid, 
  Target, 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Flag,
  MessageSquare,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// --- PERSISTENCE HELPERS ---
const getLocalVote = (projectId: number) => {
  if (typeof window === "undefined") return 0;
  try {
    const votes = JSON.parse(localStorage.getItem("project_votes") || "{}");
    return votes[projectId] || 0;
  } catch { return 0; }
};

const saveLocalVote = (projectId: number, vote: number) => {
  const votes = JSON.parse(localStorage.getItem("project_votes") || "{}");
  if (vote === 0) delete votes[projectId];
  else votes[projectId] = vote;
  localStorage.setItem("project_votes", JSON.stringify(votes));
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DISCUSSION' | 'TEAM'>('OVERVIEW');

  // --- DATA LOADING ---
  useEffect(() => {
    async function loadProject() {
      if (isNaN(id)) return;
      try {
        const data = await ProjectService.getById(id);
        
        // Sync local vote state
        const localVote = getLocalVote(id);
        const mergedData = {
            ...data,
            user_vote: data.user_vote || localVote || 0
        };

        setProject(mergedData);
      } catch (e) {
        console.error(e);
        setError("Project not found or server error.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  // --- VOTE HANDLER ---
  const handleVote = async (val: 1 | -1) => {
    if (!project) return;

    // 1. Optimistic Update
    setProject(prev => {
        if (!prev) return null;
        const currentVote = prev.user_vote || 0;
        const nextVote = currentVote === val ? 0 : val;
        const scoreDiff = nextVote - currentVote;
        
        saveLocalVote(prev.id, nextVote);
        
        return { 
            ...prev, 
            vote_score: (prev.vote_score || 0) + scoreDiff, 
            user_vote: nextVote 
        };
    });

    try {
        // 2. API Call
        const response = await ProjectService.vote(project.id, val);
        
        // 3. Server Sync
        if (response && typeof response.new_score === 'number') {
            const finalUserVote = response.user_vote ?? 0;
            saveLocalVote(project.id, finalUserVote);
            
            setProject(prev => prev ? ({
                ...prev,
                vote_score: response.new_score,
                user_vote: finalUserVote
            }) : null);
        }
    } catch (e) {
        console.error("Vote failed", e);
    }
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 animate-pulse space-y-8">
        <div className="h-8 w-32 bg-slate-200 rounded-lg" />
        <div className="h-80 bg-slate-100 rounded-3xl" />
        <div className="grid grid-cols-3 gap-8">
             <div className="col-span-2 h-96 bg-slate-50 rounded-2xl" />
             <div className="col-span-1 h-64 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-red-50 p-6 rounded-full mb-6">
            <Flag className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Project Not Found</h2>
        <p className="text-slate-500 mb-8 text-lg max-w-md">{error || "This project may have been removed or set to private."}</p>
        <Button onClick={() => router.push("/dashboard/projects")} className="bg-slate-900 text-white hover:bg-slate-800">
            Return to Dashboard
        </Button>
      </div>
    );
  }

  // --- DATA PREP ---
  const ownerName = typeof project.owner === 'object' ? project.owner.username : project.owner || "Anonymous";
  const communityName = typeof project.community === 'object' ? project.community.name : project.community || "General";
  
  const score = project.vote_score || 0;
  const myVote = project.user_vote || 0;
  
  // Progress Goal: 20 Votes
  const progress = Math.min(Math.max((score / 20) * 100, 0), 100);
  const isNegative = score < 0;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-24 px-4 md:px-6">
      
      {/* 1. NAVIGATION */}
      <nav className="flex items-center justify-between py-6">
        <button 
            onClick={() => router.back()}
            className="group flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Projects
        </button>
        <Button variant="ghost" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
            <Share2 className="w-4 h-4 mr-2" /> Share Project
        </Button>
      </nav>

      {/* 2. IMMERSIVE HERO HEADER */}
      <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-10 mb-10 overflow-hidden group">
         
         {/* Artistic Background Gradients */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-slate-50 to-transparent rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

         <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
            
            {/* Left: Project Identity */}
            <div className="flex-1 space-y-6 max-w-2xl">
                {/* Badges */}
                <div className="flex flex-wrap gap-3 items-center">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5",
                        project.status === 'PROPOSED' ? "bg-amber-50 text-amber-700 border-amber-100" :
                        project.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-slate-50 text-slate-700 border-slate-100"
                    )}>
                        <Clock className="w-3.5 h-3.5" />
                        {project.status}
                    </span>
                    <span className="px-3 py-1 bg-white text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 shadow-sm flex items-center gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5 text-slate-400" /> 
                        {project.sector}
                    </span>
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                    {project.title}
                </h1>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-3 bg-slate-50/80 pr-4 py-1.5 pl-1.5 rounded-full border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-inner">
                            {ownerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Creator</span>
                            <span className="text-sm font-bold text-slate-700">@{ownerName}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span>Deadline: <span className="text-slate-700">{format(new Date(project.proposal_deadline), "MMMM d, yyyy")}</span></span>
                    </div>
                </div>
            </div>

            {/* Right: Floating Voting Station */}
            <div className="w-full lg:w-auto min-w-[280px]">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-lg shadow-indigo-100/50 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Community Score</span>
                        {score > 0 && <span className="text-emerald-500 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-full">Trending</span>}
                    </div>
                    
                    <div className="text-5xl font-black text-slate-900 mb-6 tabular-nums tracking-tighter">
                        {score > 0 ? `+${score}` : score}
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <button 
                            onClick={() => handleVote(1)}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all active:scale-95 border-2",
                                myVote === 1 
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" 
                                    : "bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/50"
                            )}
                        >
                            <ThumbsUp className={cn("w-6 h-6 mb-1", myVote === 1 && "fill-current")} />
                            <span className="text-[10px] font-bold uppercase">Approve</span>
                        </button>
                        <button 
                            onClick={() => handleVote(-1)}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all active:scale-95 border-2",
                                myVote === -1 
                                    ? "bg-red-50 border-red-500 text-red-700 shadow-sm" 
                                    : "bg-white border-slate-100 text-slate-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50/50"
                            )}
                        >
                            <ThumbsDown className={cn("w-6 h-6 mb-1", myVote === -1 && "fill-current")} />
                            <span className="text-[10px] font-bold uppercase">Reject</span>
                        </button>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="w-full mt-6 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Progress</span>
                            <span>{progress.toFixed(0)}% to Goal</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={cn("h-full transition-all duration-700 ease-out rounded-full", isNegative ? "bg-red-500" : "bg-gradient-to-r from-emerald-400 to-teal-500")}
                                style={{ width: `${isNegative ? 100 : progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* 3. OWNER CONTROLS (Protected) */}
      {project && (
        <div className="mb-10">
            <ProjectOwnerControls project={project} />
        </div>
      )}

      {/* 4. MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-8">
                <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-all relative top-[2px]",
                        activeTab === 'OVERVIEW' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-700"
                    )}
                >
                    Project Overview
                </button>
                <button 
                    onClick={() => setActiveTab('DISCUSSION')}
                    className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-all relative top-[2px] flex items-center gap-2",
                        activeTab === 'DISCUSSION' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-700"
                    )}
                >
                    Discussion <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">0</span>
                </button>
                <button 
                     onClick={() => setActiveTab('TEAM')}
                     className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-all relative top-[2px]",
                        activeTab === 'TEAM' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-700"
                    )}
                >
                    Team
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
                         {/* Problem Section */}
                         <div className="relative pl-6 border-l-2 border-red-200">
                            <h3 className="flex items-center gap-2 text-sm font-extrabold text-red-600 uppercase tracking-widest mb-3">
                                <Target className="w-4 h-4" /> The Challenge
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-lg md:text-xl font-medium">
                                {project.problem_statement}
                            </p>
                         </div>

                         {/* Solution Section */}
                         <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100 shadow-sm">
                            <h3 className="flex items-center gap-2 text-sm font-extrabold text-indigo-600 uppercase tracking-widest mb-4">
                                <Lightbulb className="w-5 h-5" /> Proposed Solution
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-lg">
                                {project.proposed_solution}
                            </p>
                            
                            <div className="mt-6 pt-6 border-t border-indigo-100/50 flex items-center gap-2 text-sm text-indigo-400 font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Feasibility review pending</span>
                            </div>
                         </div>
                    </div>
                )}
                
                {activeTab === 'DISCUSSION' && (
                    <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <MessageSquare className="w-8 h-8 text-indigo-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg">Join the Conversation</h3>
                        <p className="text-slate-500 mb-6 text-sm">Community discussion threads are coming soon.</p>
                        <Button disabled variant="outline">Start Thread</Button>
                    </div>
                )}

                {activeTab === 'TEAM' && (
                    <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Users className="w-8 h-8 text-indigo-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg">Project Team</h3>
                        <p className="text-slate-500 mb-6 text-sm">Applications to join this project are currently closed.</p>
                        <Button disabled variant="outline">Apply to Join</Button>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-indigo-600" /> Project Details
                </h3>
                
                <div className="space-y-6">
                    <div className="group">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Community</span>
                        <div className="flex items-center justify-between mt-2 p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-700 text-sm">{communityName}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                    </div>
                    
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timeline</span>
                        <div className="mt-2 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Created</span>
                                <span className="font-medium text-slate-900">{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Deadline</span>
                                <span className={cn(
                                    "font-medium",
                                    new Date() > new Date(project.proposal_deadline) ? "text-red-600" : "text-emerald-600"
                                )}>
                                    {format(new Date(project.proposal_deadline), "MMM d, yyyy")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC APPLICATION BUTTON (FIXED LOGIC) */}
                    <div className="pt-6 border-t border-slate-100">
                        {project.status === 'PROPOSED' ? (
                            <>
                                <Button 
                                    onClick={() => alert("Applications module coming in the next update!")}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl shadow-lg shadow-slate-200"
                                >
                                    Apply to Join Team
                                </Button>
                                <p className="text-[10px] text-center text-slate-400 mt-3 leading-relaxed">
                                    Applications are open during the proposal phase.
                                </p>
                            </>
                        ) : (
                            <>
                                <Button 
                                    disabled 
                                    className="w-full bg-slate-100 text-slate-400 font-bold h-12 rounded-xl cursor-not-allowed"
                                >
                                    Applications Closed
                                </Button>
                                <p className="text-[10px] text-center text-slate-400 mt-3 leading-relaxed">
                                    Team selection is locked for {project.status.toLowerCase()} projects.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}