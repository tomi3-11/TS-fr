"use client";

import Link from "next/link";
import { Project } from "@/types/project";
import { getStatusConfig, getSectorColor } from "@/lib/project-utils";
import { 
  Target, 
  Lightbulb, 
  ThumbsUp,
  ThumbsDown,
  LayoutGrid,
  User,
  ArrowRight,
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onVote: (id: number, val: 1 | -1) => void;
  isVoting?: boolean;
}

export function ProjectCard({ project, onVote, isVoting = false }: ProjectCardProps) {
  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  
  const myVote = project.user_vote || 0; 
  const isProposed = project.status === "PROPOSED";
  
  // Safe Date Parsing
  let deadlineDate = new Date();
  try {
      if (project.proposal_deadline) {
          deadlineDate = new Date(project.proposal_deadline);
      }
  } catch (e) {
      console.error("Invalid date", e);
  }
  const isExpired = new Date() > deadlineDate;

  // Safe Owner Handling
  let ownerName = "Anonymous";
  if (project.owner) {
      if (typeof project.owner === 'string') {
          ownerName = project.owner;
      } else if (typeof project.owner === 'object' && 'username' in project.owner) {
          ownerName = project.owner.username;
      }
  }

  // Progress Bar Logic
  const score = project.vote_score || 0;
  const maxScore = 20; 
  const progressPercent = Math.min(Math.max((score / maxScore) * 100, 0), 100);
  const isNegative = score < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative group">
      
      {/* HEADER */}
      <div className="p-5 border-b border-slate-50 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                    statusConfig.color
                )}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                </span>
                <span className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100",
                    getSectorColor(project.sector)
                )}>
                    <LayoutGrid className="w-3 h-3" />
                    {project.sector}
                </span>
            </div>
            
            <div className={cn(
                "shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg border",
                isExpired ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-500 border-slate-100"
            )}>
                {isExpired ? "Closed" : `Ends ${format(deadlineDate, "MMM d")}`}
            </div>
        </div>
        
        {/* Title Link */}
        <Link href={`/dashboard/projects/${project.id}`} className="group/link block">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug group-hover/link:text-indigo-600 transition-colors line-clamp-2">
                {project.title}
                <ArrowRight className="inline-block w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-indigo-500" />
            </h3>
        </Link>
      </div>

      {/* BODY */}
      <Link href={`/dashboard/projects/${project.id}`} className="flex-1 p-5 space-y-5 hover:bg-slate-50/30 transition-colors group/body cursor-pointer">
        <div>
            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                <Target className="w-3 h-3" /> Problem
            </h4>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium group-hover/body:text-slate-800 transition-colors">
                {project.problem_statement}
            </p>
        </div>

        <div>
            <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-500/80 uppercase tracking-widest mb-1.5">
                <Lightbulb className="w-3 h-3" /> Solution
            </h4>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium group-hover/body:text-slate-800 transition-colors">
                {project.proposed_solution}
            </p>
        </div>
      </Link>

      {/* FOOTER: Voting & Actions */}
      <div className="p-5 bg-slate-50/80 border-t border-slate-100 mt-auto backdrop-blur-sm">
        
        {isProposed ? (
            <div className="flex flex-col gap-4">
                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className={cn("h-full transition-all duration-700 ease-out rounded-full", isNegative ? "bg-red-500" : "bg-emerald-500")} 
                        style={{ width: `${isNegative ? 100 : progressPercent}%`, opacity: isNegative ? 0.7 : 1 }}
                    />
                </div>

                {/* Voting Controls */}
                <div className="flex items-center justify-between">
                    <button 
                        disabled={isVoting}
                        onClick={(e) => { e.preventDefault(); onVote(project.id, -1); }}
                        className={cn(
                            "flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all border shadow-sm active:scale-95",
                            myVote === -1 
                                ? "bg-white border-red-200 text-red-600" 
                                : "bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500"
                        )}
                    >
                        <ThumbsDown className={cn("w-4 h-4", myVote === -1 && "fill-current")} />
                        <span className="hidden sm:inline">Down</span>
                    </button>

                    <div className="flex flex-col items-center">
                        <span className={cn(
                            "font-black text-lg tabular-nums leading-none",
                            score > 0 ? "text-emerald-600" : score < 0 ? "text-red-600" : "text-slate-700"
                        )}>
                            {project.vote_score > 0 ? `+${project.vote_score}` : project.vote_score}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                    </div>

                    <button 
                        disabled={isVoting}
                        onClick={(e) => { e.preventDefault(); onVote(project.id, 1); }}
                        className={cn(
                            "flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all border shadow-sm active:scale-95",
                            myVote === 1 
                                ? "bg-white border-emerald-200 text-emerald-600" 
                                : "bg-white border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-500"
                        )}
                    >
                        <span className="hidden sm:inline">Upvote</span>
                        <ThumbsUp className={cn("w-4 h-4", myVote === 1 && "fill-current")} />
                    </button>
                </div>

                {/* View Details Button */}
                <Link href={`/dashboard/projects/${project.id}`} className="block w-full">
                    <button className="w-full py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md group/btn">
                        View Details <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </Link>
            </div>
        ) : (
            <Link href={`/dashboard/projects/${project.id}`} className="block">
                <button className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2">
                    View Project <ArrowRight className="w-3 h-3" />
                </button>
            </Link>
        )}
        
        {/* Author Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
            <div className="bg-slate-200 p-1 rounded-full">
                <User className="w-2.5 h-2.5 text-slate-500" />
            </div>
            <span>Proposed by <span className="text-slate-600 font-bold">{ownerName}</span></span>
        </div>
      </div>
    </div>
  );
}