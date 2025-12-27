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
  ShieldAlert
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  project: Project;
}

export function ProjectOwnerControls({ project }: Props) {
  const router = useRouter();
  const { user } = useAuth(); // Assuming user object has { id, role }
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  // --- 1. ROBUST PERMISSION LOGIC ---
  
  // A. Safely extract Project Owner ID
  const projectOwnerId = typeof project.owner === 'object' ? project.owner.id : -1;

  // B. Check Ownership (Convert both to String to prevent 1 !== "1" errors)
  const isOwner = String(user.id) === String(projectOwnerId);

  // C. Check Roles (Adjust 'role' property name to match your Auth User type)
  // Assuming user.role is 'ADMIN', 'MODERATOR', or 'USER'
  const hasPrivileges = 
    // @ts-ignore - remove ignore if your User type has role defined
    ['ADMIN', 'MODERATOR', 'SUPERUSER'].includes(user.role?.toUpperCase());

  // D. Final Gate: If not owner AND not admin, hide everything.
  if (!isOwner && !hasPrivileges) {
      return null;
  }

  // --- 2. LIFECYCLE LOGIC ---
  let nextStage: ProjectStatus | null = null;
  let nextLabel = "";
  
  switch (project.status) {
    case 'PROPOSED':
      nextStage = 'APPROVED';
      nextLabel = 'Approve Project';
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

  // --- 3. HANDLERS ---
  const handleTransition = async () => {
    if (!nextStage) return;
    if (!confirm(`Move project status to ${nextStage}?`)) return;

    setIsProcessing(true);
    try {
        await ProjectService.transition(project.id, nextStage);
        router.refresh(); 
    } catch (e) {
        console.error("Transition failed", e);
        alert("Failed to update status.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    setIsProcessing(true);
    try {
        await ProjectService.delete(project.id);
        router.push("/dashboard/projects");
    } catch (e) {
        console.error("Delete failed", e);
        alert("Failed to delete project.");
        setIsProcessing(false);
    }
  };

  return (
    <>
        {/* DEBUGGING: Uncomment the line below if buttons are STILL hidden */}
        {/* <div className="text-xs text-red-500 mb-2">Debug: UserID({user.id}) vs OwnerID({projectOwnerId})</div> */}

        <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8 border border-slate-800 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Left: Info */}
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                        {hasPrivileges && !isOwner ? (
                             <ShieldAlert className="text-amber-400 w-5 h-5" />
                        ) : (
                             <Settings2 className="text-slate-400 w-5 h-5" />
                        )}
                        {hasPrivileges && !isOwner ? "Admin Override" : "Owner Controls"}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        {hasPrivileges && !isOwner 
                            ? "You are viewing this as a moderator." 
                            : "Manage your project lifecycle."}
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    
                    {/* EDIT */}
                    <Button 
                        onClick={() => setIsEditOpen(true)}
                        disabled={isProcessing}
                        className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    >
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                    </Button>

                    {/* WITHDRAW */}
                    <Button 
                        onClick={handleDelete}
                        disabled={isProcessing}
                        className="bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Withdraw
                    </Button>

                    {/* TRANSITION (Primary Action) */}
                    {nextStage && (
                        <Button 
                            onClick={handleTransition}
                            disabled={isProcessing}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-lg shadow-emerald-900/20"
                        >
                            {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <ArrowRightCircle className="w-4 h-4 mr-2" />}
                            {nextLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>

        {/* Modal */}
        <EditProjectModal 
            project={project} 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
        />
    </>
  );
}