"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { ProjectService } from "@/services/project.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
        router.refresh(); // Update the background page
        onClose();        // Close modal
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update project.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Edit Project Details</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Project Title</label>
                <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="font-bold text-slate-900"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Problem Statement</label>
                <textarea 
                    value={formData.problem_statement}
                    onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
                    className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Proposed Solution</label>
                <textarea 
                    value={formData.proposed_solution}
                    onChange={(e) => setFormData({...formData, proposed_solution: e.target.value})}
                    className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
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