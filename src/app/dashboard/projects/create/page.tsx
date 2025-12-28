"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProjectService } from "@/services/project.service";
import { CommunityService } from "@/services/community.service";
import { Community } from "@/types/community";
import { CreateProjectPayload } from "@/types/project"; 
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, AlertCircle, CalendarIcon, Sparkles, Building2, ChevronDown, LayoutGrid, Target, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Validation Schema
const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  problem_statement: z.string().min(20, "Please provide more detail (min 20 chars)"),
  proposed_solution: z.string().min(20, "Please provide more detail (min 20 chars)"),
  sector: z.string().min(1, "Required"),
  community_id: z.string().min(1, "Please select a community"),
  proposal_deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Date must be in the future",
  }),
});

type FormData = z.infer<typeof schema>;

const SECTORS = ["Health", "Education", "Transport", "Agriculture", "Technology", "Finance", "Environment"];

export default function CreateProjectPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // 2. Fetch User's Communities
  useEffect(() => {
    async function loadCommunities() {
      try {
        const data = await CommunityService.getAll();
        setCommunities(data);
      } catch (e) {
        console.error("Failed to load communities", e);
      } finally {
        setIsLoadingCommunities(false);
      }
    }
    loadCommunities();
  }, []);

  // 3. Submit Handler (SMART ID FIX PRESERVED)
  const onSubmit = async (data: FormData) => {
    setServerError(null);

    // --- THE FIX STARTS HERE ---
    const rawId = data.community_id;
    
    // Check if the ID is purely numeric (e.g. "1") or a UUID string (e.g. "550e8400...")
    // parseInt() breaks UUIDs, so we use this check instead.
    const isNumeric = !isNaN(Number(rawId)) && rawId.trim() !== "";
    
    // If it's a number, convert it. If it's a UUID, keep it as a string.
    const finalId = isNumeric ? Number(rawId) : rawId;
    // --- THE FIX ENDS HERE ---

    try {
      const payload: CreateProjectPayload = {
        title: data.title,
        problem_statement: data.problem_statement,
        proposed_solution: data.proposed_solution,
        sector: data.sector,
        community_id: finalId, // Safely handles both ID types
        proposal_deadline: data.proposal_deadline 
      };

      await ProjectService.create(payload);
      
      router.push("/dashboard/projects");
      router.refresh(); 
    } catch (e: any) {
      console.error("Submission Error:", e);
      const msg = e.response?.data?.message || "Validation failed. Please check your inputs.";
      setServerError(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 py-6 px-4 md:px-6 mb-20">
      
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600 text-slate-500 text-xs uppercase font-bold tracking-wide transition-colors"
      >
        <ArrowLeft className="w-3 h-3 mr-2" /> Cancel & Back
      </Button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        
        {/* Decorative Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600"></div>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100 shrink-0 self-start">
               <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">New Project Proposal</h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-lg">
                  Every great system starts with a proposal. Outline the challenge clearly and propose a tech-driven solution.
              </p>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
            
            {serverError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="font-medium">{serverError}</p>
                </div>
            )}

            {/* 1. Project Title */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Project Title</label>
                <Input 
                    {...register("title")} 
                    placeholder="e.g., Smart Traffic Management System" 
                    error={errors.title?.message}
                    className="h-12 md:h-14 text-lg font-bold text-slate-900 placeholder:text-slate-300 border-slate-200 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* 2. Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Community Select */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                        <Building2 className="w-3.5 h-3.5" /> Target Community
                    </label>
                    <div className="relative group">
                        <select 
                            {...register("community_id")}
                            disabled={isLoadingCommunities}
                            className={cn(
                              "w-full h-12 pl-4 pr-10 bg-white border rounded-xl appearance-none text-base md:text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer disabled:opacity-60",
                              errors.community_id ? "border-red-300" : "border-slate-200 group-hover:border-slate-300",
                              "text-slate-900"
                            )}
                        >
                            <option value="" className="text-slate-400">Select Community...</option>
                            {communities.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                           <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                    {errors.community_id && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.community_id.message}</p>}
                </div>

                {/* Sector Select */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                        <LayoutGrid className="w-3.5 h-3.5" /> Sector
                    </label>
                    <div className="relative group">
                        <select 
                            {...register("sector")}
                            className={cn(
                              "w-full h-12 pl-4 pr-10 bg-white border rounded-xl appearance-none text-base md:text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer",
                              errors.sector ? "border-red-300" : "border-slate-200 group-hover:border-slate-300",
                              "text-slate-900"
                            )}
                        >
                            <option value="">Select Sector...</option>
                            {SECTORS.map(s => (
                                <option key={s} value={s.toLowerCase()}>{s}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                           <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                    {errors.sector && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.sector.message}</p>}
                </div>
            </div>

            {/* 3. The Pitch (Problem & Solution) */}
            <div className="grid grid-cols-1 gap-8">
                
                {/* The Problem */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                        <Target className="w-4 h-4 text-red-400" /> Problem Statement
                    </label>
                    <textarea 
                        {...register("problem_statement")}
                        placeholder="Describe the specific challenge clearly..."
                        className={cn(
                          "w-full min-h-[140px] p-4 bg-slate-50/50 border rounded-xl text-base md:text-sm resize-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400 text-slate-800 leading-relaxed",
                          errors.problem_statement ? "border-red-300 bg-red-50/10" : "border-slate-200"
                        )}
                    />
                    {errors.problem_statement ? (
                        <p className="text-red-500 text-[10px] font-bold ml-1">{errors.problem_statement.message}</p>
                    ) : (
                        <p className="text-[10px] text-slate-400 text-right">Be specific. What is broken?</p>
                    )}
                </div>

                {/* The Solution */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wide ml-1">
                        <Lightbulb className="w-4 h-4 text-indigo-500" /> Proposed Solution
                    </label>
                    <textarea 
                        {...register("proposed_solution")}
                        placeholder="How do you plan to solve it using technology?"
                        className={cn(
                          "w-full min-h-[140px] p-4 bg-indigo-50/30 border rounded-xl text-base md:text-sm resize-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-300/70 text-slate-900 leading-relaxed",
                          errors.proposed_solution ? "border-red-300 bg-red-50/10" : "border-indigo-100"
                        )}
                    />
                    {errors.proposed_solution && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.proposed_solution.message}</p>}
                </div>
            </div>

            {/* 4. Deadline */}
            <div className="space-y-2 max-w-[240px]">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Voting Deadline
                </label>
                <Input 
                    type="date"
                    {...register("proposal_deadline")}
                    className="h-12 bg-white text-slate-900 border-slate-200 focus:border-indigo-500 w-full" 
                    error={errors.proposal_deadline?.message}
                />
            </div>

            {/* Footer Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                    * All fields are required for submission
                </span>
                <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-xl w-full sm:w-auto shadow-lg shadow-slate-200 hover:shadow-slate-300 transition-all"
                >
                    Submit Proposal
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}