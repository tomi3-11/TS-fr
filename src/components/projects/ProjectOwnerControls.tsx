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
  Lock // Added Lock icon
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
  
  switch (project.status) {
    case 'PROPOSED': 
      nextStage = 'APPROVED'; 
      // Change label based on lock status
      nextLabel = isLocked 
        ? `${currentScore}/${VOTE_THRESHOLD} Votes to Unlock` 
        : 'Approve Project'; 
      break;
    case 'APPROVED': 
      nextStage = 'ACTIVE'; 
      nextLabel = 'Start Development'; 
      break;
    case 'ACTIVE': 
      nextStage = 'COMPLETED'; 
      nextLabel = 'Mark Completed'; 
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
    } catch (e) {
        alert("Failed to delete project.");
        setIsProcessing(false);
    }
  };

  return (
    <>
        <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8 border border-slate-800 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                        {isAdmin && !isOwner ? <ShieldAlert className="text-amber-400 w-5 h-5" /> : <Settings2 className="text-slate-400 w-5 h-5" />}
                        {isAdmin && !isOwner ? "Admin Mode" : "Owner Controls"}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                         {isLocked 
                            ? "Project needs more community support to proceed." 
                            : "Manage project lifecycle."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Button onClick={() => setIsEditOpen(true)} disabled={isProcessing} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button onClick={handleDelete} disabled={isProcessing} className="bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50">
                        <Trash2 className="w-4 h-4 mr-2" /> Withdraw
                    </Button>
                    
                    {nextStage && (
                        <Button 
                            onClick={handleTransition} 
                            // Disable if locked (unless Admin override)
                            disabled={isProcessing || (isLocked && !isAdmin)} 
                            className={cn(
                                "border-0 min-w-[180px]",
                                isLocked 
                                    ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                            )}
                        >
                            {isProcessing ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : isLocked ? (
                                <Lock className="w-4 h-4 mr-2" />
                            ) : (
                                <ArrowRightCircle className="w-4 h-4 mr-2" />
                            )}
                            {nextLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>

        <EditProjectModal project={project} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
}