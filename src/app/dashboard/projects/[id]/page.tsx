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
  Clock
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
        const localVote = getLocalVote(id);
        const mergedData = { ...data, user_vote: data.user_vote || localVote || 0 };
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
    setProject(prev => {
        if (!prev) return null;
        const currentVote = prev.user_vote || 0;
        const nextVote = currentVote === val ? 0 : val;
        const scoreDiff = nextVote - currentVote;
        saveLocalVote(prev.id, nextVote);
        return { ...prev, vote_score: (prev.vote_score || 0) + scoreDiff, user_vote: nextVote };
    });
    try {
        const response = await ProjectService.vote(project.id, val);
        if (response && typeof response.new_score === 'number') {
            const finalUserVote = response.user_vote ?? 0;
            saveLocalVote(project.id, finalUserVote);
            setProject(prev => prev ? ({ ...prev, vote_score: response.new_score, user_vote: finalUserVote }) : null);
        }
    } catch (e) { console.error("Vote failed", e); }
  };

  if (isLoading) return <div className="max-w-6xl mx-auto py-10 px-4 animate-pulse space-y-8"><div className="h-8 w-32 bg-slate-200 rounded-lg" /><div className="h-48 bg-slate-100 rounded-2xl" /><div className="grid grid-cols-3 gap-8"><div className="col-span-2 h-96 bg-slate-50 rounded-2xl" /><div className="col-span-1 h-64 bg-slate-50 rounded-2xl" /></div></div>;

  if (error || !project) return <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4"><div className="bg-red-50 p-6 rounded-full mb-6"><Flag className="w-10 h-10 text-red-500" /></div><h2 className="text-3xl font-black text-slate-900 mb-2">Project Not Found</h2><p className="text-slate-500 mb-8 text-lg max-w-md">{error}</p><Button onClick={() => router.push("/dashboard/projects")} className="bg-slate-900 text-white hover:bg-slate-800">Return to Dashboard</Button></div>;

  const ownerName = typeof project.owner === 'object' ? project.owner.username : project.owner || "Anonymous";
  const communityName = typeof project.community === 'object' ? project.community.name : project.community || "General";
  const score = project.vote_score || 0;
  const myVote = project.user_vote || 0;
  const progress = Math.min(Math.max((score / 20) * 100, 0), 100);
  const isNegative = score < 0;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-24 px-4 md:px-6">
      
      {/* 1. NAVIGATION */}
      <nav className="flex items-center justify-between py-6">
        <button onClick={() => router.back()} className="group flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Projects
        </button>
        <Button variant="ghost" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 h-8 text-xs">
            <Share2 className="w-3.5 h-3.5 mr-2" /> Share
        </Button>
      </nav>

      {/* 2. HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

         <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
            {/* Left: Info */}
            <div className="flex-1 space-y-4 max-w-3xl min-w-0">
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        project.status === 'PROPOSED' ? "bg-amber-50 text-amber-700 border-amber-200/60" :
                        project.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                    )}>
                        <Clock className="w-3 h-3" /> {project.status}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                        <LayoutGrid className="w-3 h-3 text-slate-400" /> {project.sector}
                    </span>
                </div>
                
                {/* FIX: Break words prevents title from overflowing */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight break-words">
                    {project.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pt-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm shrink-0">
                            {ownerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700 truncate max-w-[150px]">@{ownerName}</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span>Deadline: <span className={cn("font-medium", new Date() > new Date(project.proposal_deadline) ? "text-red-600" : "text-slate-700")}>
                            {format(new Date(project.proposal_deadline), "MMM d")}
                        </span></span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="w-full md:w-auto shrink-0 flex flex-col md:items-end gap-3">
                <div className="bg-slate-50 rounded-xl p-1.5 flex items-center border border-slate-200 shadow-sm self-start md:self-auto">
                    <button 
                        onClick={() => handleVote(-1)}
                        className={cn(
                            "h-10 w-12 flex items-center justify-center rounded-lg transition-all active:scale-95",
                            myVote === -1 ? "bg-white text-red-600 shadow-sm border border-red-100" : "text-slate-400 hover:text-red-500 hover:bg-white"
                        )}
                    >
                        <ThumbsDown className={cn("w-5 h-5", myVote === -1 && "fill-current")} />
                    </button>

                    <div className="px-4 flex flex-col items-center min-w-[80px]">
                        <span className={cn(
                            "text-2xl font-black tabular-nums leading-none tracking-tight",
                            score > 0 ? "text-slate-800" : score < 0 ? "text-red-600" : "text-slate-400"
                        )}>
                            {score > 0 ? `+${score}` : score}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Score</span>
                    </div>

                    <button 
                        onClick={() => handleVote(1)}
                        className={cn(
                            "h-10 w-12 flex items-center justify-center rounded-lg transition-all active:scale-95",
                            myVote === 1 ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-slate-400 hover:text-emerald-500 hover:bg-white"
                        )}
                    >
                        <ThumbsUp className={cn("w-5 h-5", myVote === 1 && "fill-current")} />
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full max-w-[200px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={cn("h-full rounded-full transition-all duration-500", isNegative ? "bg-red-500" : "bg-emerald-500")}
                            style={{ width: `${isNegative ? 100 : progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{progress.toFixed(0)}% to Goal</span>
                </div>
            </div>
         </div>
      </div>

      {/* 3. OWNER CONTROLS */}
      {project && <div className="mb-8"><ProjectOwnerControls project={project} /></div>}

      {/* 4. MAIN LAYOUT */}
      {/* FIX: grid-cols-1 by default, min-w-0 stops children from expanding parent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-w-0">
        
        {/* LEFT COLUMN: Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar">
                {['OVERVIEW', 'DISCUSSION', 'TEAM'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "pb-3 text-sm font-bold border-b-2 transition-all relative top-[2px] whitespace-nowrap",
                            activeTab === tab ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Tab Content - FIX: Added break-words to container */}
            <div className="min-h-[400px] break-words">
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                         {/* Problem */}
                         <section>
                            <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <Target className="w-4 h-4" /> The Challenge
                            </h3>
                            {/* FIX: Added whitespace-pre-wrap to respect newlines but wrap text */}
                            <p className="text-slate-800 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                                {project.problem_statement}
                            </p>
                         </section>

                         {/* Solution */}
                         <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">
                                <Lightbulb className="w-4 h-4" /> Proposed Solution
                            </h3>
                            {/* FIX: Added whitespace-pre-wrap to respect newlines but wrap text */}
                            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap">
                                {project.proposed_solution}
                            </p>
                         </section>
                    </div>
                )}
                
                {/* Other tabs remain same... */}
                {activeTab === 'DISCUSSION' && (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                        <MessageSquare className="w-8 h-8 text-slate-300 mb-3" />
                        <h3 className="text-slate-900 font-bold text-sm">Discussion</h3>
                        <p className="text-slate-500 text-xs mb-4">Coming soon.</p>
                        <Button disabled variant="outline" size="sm">Start Thread</Button>
                    </div>
                )}

                {activeTab === 'TEAM' && (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                        <Users className="w-8 h-8 text-slate-300 mb-3" />
                        <h3 className="text-slate-900 font-bold text-sm">Team Roster</h3>
                        <p className="text-slate-500 text-xs mb-4">Applications closed.</p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
            {/* FIX: Added break-words to sidebar container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-24 break-words">
                <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                    <Flag className="w-4 h-4 text-indigo-500" /> Project Meta
                </h3>
                
                <div className="space-y-5">
                    {/* Community - FIX: Allow wrapping */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 shrink-0">
                                <Users className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Community</div>
                                <div className="font-bold text-slate-700 text-xs truncate">{communityName}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="text-slate-500">Submitted</span>
                            <span className="font-medium text-slate-900">{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="text-slate-500">Status</span>
                            <span className="font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-600">{project.status}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        {project.status === 'PROPOSED' ? (
                            <Button 
                                onClick={() => alert("Applications module coming soon!")}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs rounded-xl"
                            >
                                Apply to Join Team
                            </Button>
                        ) : (
                            <Button disabled className="w-full bg-slate-100 text-slate-400 font-bold h-10 text-xs rounded-xl">
                                Applications Closed
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}