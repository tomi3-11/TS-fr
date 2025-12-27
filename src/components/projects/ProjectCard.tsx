"use client";

import Link from "next/link";
import { Project } from "@/types/project";
import { getStatusConfig, getSectorColor } from "@/lib/project-utils";
import { 
  CalendarDays, 
  Target, 
  Lightbulb, 
  ThumbsUp,
  ThumbsDown,
  LayoutGrid,
  User,
  ArrowRight,
  ExternalLink // Added icon
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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative group">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-50 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                    statusConfig.color
                )}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                </span>
                <span className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600",
                    getSectorColor(project.sector)
                )}>
                    <LayoutGrid className="w-3 h-3" />
                    {project.sector}
                </span>
            </div>
            
            {/* Title Link */}
            <Link href={`/dashboard/projects/${project.id}`} className="group/link">
                <h3 className="font-extrabold text-slate-900 leading-tight group-hover/link:text-indigo-600 transition-colors line-clamp-2 flex items-center gap-2">
                    {project.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-indigo-400" />
                </h3>
            </Link>
        </div>

        <div className="shrink-0 text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
            {isExpired ? "Closed" : format(deadlineDate, "MMM d")}
        </div>
      </div>

      {/* BODY */}
      <Link href={`/dashboard/projects/${project.id}`} className="flex-1 p-4 space-y-4 hover:bg-slate-50/30 transition-colors group/body">
        <div>
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Target className="w-3 h-3" /> Problem
            </h4>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed group-hover/body:text-slate-900 transition-colors">
                {project.problem_statement}
            </p>
        </div>

        <div>
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <Lightbulb className="w-3 h-3" /> Solution
            </h4>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed group-hover/body:text-slate-900 transition-colors">
                {project.proposed_solution}
            </p>
        </div>
      </Link>

      {/* FOOTER: Voting & Actions */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 mt-auto">
        
        {isProposed ? (
            <div className="flex flex-col gap-3">
                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className={cn("h-full transition-all duration-500 rounded-full", isNegative ? "bg-red-500" : "bg-emerald-500")} 
                        style={{ width: `${isNegative ? 100 : progressPercent}%`, opacity: isNegative ? 0.5 : 1 }}
                    />
                </div>

                {/* Voting Controls */}
                <div className="flex items-center justify-between">
                    <button 
                        disabled={isVoting}
                        onClick={(e) => { e.preventDefault(); onVote(project.id, -1); }}
                        className={cn(
                            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border",
                            myVote === -1 
                                ? "bg-white border-red-200 text-red-600 shadow-sm" 
                                : "border-transparent text-slate-400 hover:bg-white hover:text-red-500"
                        )}
                    >
                        <ThumbsDown className={cn("w-4 h-4", myVote === -1 && "fill-current")} />
                        <span className="hidden sm:inline">Down</span>
                    </button>

                    <div className="font-black text-slate-700 text-lg tabular-nums">
                        {project.vote_score}
                    </div>

                    <button 
                        disabled={isVoting}
                        onClick={(e) => { e.preventDefault(); onVote(project.id, 1); }}
                        className={cn(
                            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border",
                            myVote === 1 
                                ? "bg-white border-emerald-200 text-emerald-600 shadow-sm" 
                                : "border-transparent text-slate-400 hover:bg-white hover:text-emerald-500"
                        )}
                    >
                        <span className="hidden sm:inline">Upvote</span>
                        <ThumbsUp className={cn("w-4 h-4", myVote === 1 && "fill-current")} />
                    </button>
                </div>

                {/* ADDED: Explicit View Details Button below Voting */}
                <Link href={`/dashboard/projects/${project.id}`} className="block w-full">
                    <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2">
                        View Full Details <ExternalLink className="w-3 h-3" />
                    </button>
                </Link>
            </div>
        ) : (
            <Link href={`/dashboard/projects/${project.id}`} className="block">
                <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200/50">
                    View Project Details
                </button>
            </Link>
        )}
        
        {/* Author Footnote */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <User className="w-3 h-3" />
            <span>Proposed by @{ownerName}</span>
        </div>
      </div>
    </div>
  );
}