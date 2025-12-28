"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectService } from "@/services/project.service";
import { Project, ProjectStatus } from "@/types/project";
import { Button } from "@/components/ui/Button";
import { EditProjectModal } from "./EditProjectModel";
import { 
  Trash2, 
  ArrowRightCircle, 
  Settings2, 
  Edit3, 
  Loader2,
  ShieldAlert,
  Lock,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
}

export function ProjectOwnerControls({ project }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !user) return null;

  // --- 1. ACCESS LOGIC ---
  let isOwner = false;
  if (typeof project.owner === 'object' && project.owner !== null && 'id' in project.owner) {
      isOwner = String(user.id) === String(project.owner.id);
  } else if (typeof project.owner === 'string') {
      // @ts-ignore
      const currentUsername = user.username || user.email?.split('@')[0] || "";
      isOwner = currentUsername.toLowerCase() === project.owner.toLowerCase();
  }

  // @ts-ignore
  const userRole = user.role?.toUpperCase() || "USER";
  const isAdmin = ['ADMIN', 'MODERATOR', 'SUPERUSER'].includes(userRole);
  const canAccess = isOwner || isAdmin;

  if (!canAccess) return null;

  // --- 2. THRESHOLD LOGIC ---
  const VOTE_THRESHOLD = 10;
  const currentScore = project.vote_score || 0;
  const isLocked = project.status === 'PROPOSED' && currentScore < VOTE_THRESHOLD;

  // --- 3. LIFECYCLE LOGIC ---
  let nextStage: ProjectStatus | null = null;
  let nextLabel = "";
  let actionColor = "bg-emerald-600 hover:bg-emerald-500";
  
  switch (project.status) {
    case 'PROPOSED': 
      nextStage = 'APPROVED'; 
      nextLabel = isLocked 
        ? `${currentScore}/${VOTE_THRESHOLD} Votes to Unlock` 
        : 'Approve Project'; 
      break;
    case 'APPROVED': 
      nextStage = 'ACTIVE'; 
      nextLabel = 'Start Development'; 
      actionColor = "bg-blue-600 hover:bg-blue-500";
      break;
    case 'ACTIVE': 
      nextStage = 'COMPLETED'; 
      nextLabel = 'Mark Completed'; 
      actionColor = "bg-purple-600 hover:bg-purple-500";
      break;
  }

  // --- 4. HANDLERS ---
  const handleTransition = async () => {
    if (isLocked && !isAdmin) {
        alert(`You need ${VOTE_THRESHOLD} upvotes to approve this project. Get the community involved!`);
        return;
    }
    
    if (!nextStage || !confirm(`Move project to ${nextStage}?`)) return;
    
    setIsProcessing(true);
    try {
        await ProjectService.transition(project.id, nextStage);
        router.refresh(); 
    } catch (e) {
        alert("Failed to update status.");
    } finally { setIsProcessing(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project permanently?")) return;
    setIsProcessing(true);
    try {
        await ProjectService.delete(project.id);
        router.push("/dashboard/projects");
    } catch (e: any) {
        const backendMessage = e?.response?.data?.message;
        alert(backendMessage || "Failed to delete project. Please confirm you are the owner or try again.");
        setIsProcessing(false);
    }
  };

  return (
    <>
        <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white mb-8 border border-slate-800 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Header Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                        {isAdmin && !isOwner ? <ShieldAlert className="text-amber-400 w-5 h-5" /> : <Settings2 className="text-slate-400 w-5 h-5" />}
                        {isAdmin && !isOwner ? "Admin Override Mode" : "Project Control Center"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                           <span className={cn("w-2 h-2 rounded-full", isLocked ? "bg-amber-500" : "bg-emerald-500 animate-pulse")} />
                           Status: <span className="font-bold text-slate-300">{project.status}</span>
                        </span>
                        <span className="text-slate-600 hidden sm:inline">|</span>
                        <span>
                          {isLocked 
                            ? "Requires community consensus to proceed." 
                            : "Manage lifecycle and settings."}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                            onClick={() => setIsEditOpen(true)} 
                            disabled={isProcessing} 
                            className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold"
                        >
                            <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button 
                            onClick={handleDelete} 
                            disabled={isProcessing} 
                            className="flex-1 sm:flex-none bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 font-bold"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                    
                    {nextStage && (
                        <Button 
                            onClick={handleTransition} 
                            // Disable if locked (unless Admin override)
                            disabled={isProcessing || (isLocked && !isAdmin)} 
                            className={cn(
                                "w-full sm:w-auto border-0 font-bold shadow-lg transition-all active:scale-95 min-w-[200px] justify-between px-4",
                                isLocked && !isAdmin
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                                    : cn(actionColor, "text-white")
                            )}
                        >
                            <span className="flex items-center">
                                {isProcessing ? (
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                ) : isLocked && !isAdmin ? (
                                    <Lock className="w-4 h-4 mr-2" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                {isLocked && !isAdmin ? "Locked" : "Next Phase"}
                            </span>
                            
                            {!isProcessing && (
                                <span className={cn(
                                    "text-[10px] uppercase tracking-wider font-black py-0.5 px-1.5 rounded ml-3",
                                    isLocked && !isAdmin ? "bg-slate-900 text-slate-600" : "bg-black/20 text-white/90"
                                )}>
                                    {isLocked && !isAdmin ? `${currentScore}/${VOTE_THRESHOLD}` : nextStage}
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>

        <EditProjectModal project={project} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
}