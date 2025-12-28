"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { ProjectService } from "@/services/project.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Save, Loader2, PenTool } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State (Pre-filled)
  const [formData, setFormData] = useState({
    title: project.title,
    problem_statement: project.problem_statement,
    proposed_solution: project.proposed_solution,
    sector: project.sector
  });

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        await ProjectService.update(project.id, formData);
        router.refresh(); 
        onClose();        
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update project.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <PenTool className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-none">Edit Project</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Update core details for your proposal</p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-2 rounded-lg transition-all"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
            
            {/* Title Field */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Project Title</label>
                <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="font-bold text-slate-900 text-lg h-12 border-slate-200 focus:border-indigo-500 transition-all"
                    placeholder="Enter a descriptive title"
                />
            </div>

            {/* Problem Statement */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Problem Statement</label>
                <textarea 
                    value={formData.problem_statement}
                    onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
                    className={cn(
                        "w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed",
                        "text-slate-900 font-medium placeholder:text-slate-400", 
                        "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all focus:bg-white"
                    )}
                    placeholder="Describe the challenge clearly..."
                />
            </div>

            {/* Proposed Solution */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 text-indigo-600">Proposed Solution</label>
                <textarea 
                    value={formData.proposed_solution}
                    onChange={(e) => setFormData({...formData, proposed_solution: e.target.value})}
                    className={cn(
                        "w-full h-32 p-4 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm leading-relaxed",
                        "text-slate-900 font-medium placeholder:text-indigo-300",
                        "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all focus:bg-white"
                    )}
                    placeholder="How do you plan to solve it?"
                />
            </div>

            {/* Footer Actions */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100 mt-2">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onClose} 
                    className="text-slate-500 hover:text-slate-800 font-bold"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    className="bg-slate-900 hover:bg-slate-800 text-white min-w-[140px] shadow-lg shadow-slate-200 font-bold"
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}