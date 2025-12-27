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
import { ArrowLeft, AlertCircle, CalendarIcon, Sparkles, Building2 } from "lucide-react";
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

  // 3. Submit Handler (SMART ID FIX)
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

      console.log("Submitting Project:", payload);

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
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 py-6 px-4 md:px-0">
      
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-4 pl-0 hover:bg-transparent hover:text-slate-900 text-slate-500 text-xs uppercase font-bold tracking-wide"
      >
        <ArrowLeft className="w-3 h-3 mr-2" /> Cancel & Back
      </Button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-start gap-4">
            <div className="bg-indigo-100 p-2.5 rounded-xl hidden sm:block">
               <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">New Project Proposal</h1>
              <p className="text-sm text-slate-500 mt-1">
                  Outline a problem and your tech solution.
              </p>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            
            {serverError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {serverError}
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Project Title</label>
                <Input 
                    {...register("title")} 
                    placeholder="e.g., Smart Traffic System" 
                    error={errors.title?.message}
                    className="font-semibold text-slate-900 placeholder:text-slate-300"
                />
            </div>

            {/* AUTOMATIC ID SELECTION ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Target Community</label>
                    <div className="relative">
                        <select 
                            {...register("community_id")}
                            disabled={isLoadingCommunities}
                            className={cn(
                              "w-full px-3 py-2 bg-white border rounded-lg appearance-none text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:opacity-50",
                              errors.community_id ? "border-red-300" : "border-slate-200",
                              "text-slate-900"
                            )}
                        >
                            <option value="" className="text-slate-400">Select Community...</option>
                            {communities.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        
                        {/* Icon for UX */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           {isLoadingCommunities ? (
                               <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                           ) : (
                               <Building2 className="w-3.5 h-3.5" />
                           )}
                        </div>
                    </div>
                    {errors.community_id && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.community_id.message}</p>}
                    
                    {!isLoadingCommunities && communities.length === 0 && (
                        <p className="text-[10px] text-orange-500 mt-1">
                            You haven't joined any communities yet.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sector</label>
                    <div className="relative">
                        <select 
                            {...register("sector")}
                            className={cn(
                              "w-full px-3 py-2 bg-white border rounded-lg appearance-none text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all",
                              errors.sector ? "border-red-300" : "border-slate-200",
                              "text-slate-900"
                            )}
                        >
                            <option value="">Select Sector...</option>
                            {SECTORS.map(s => (
                                <option key={s} value={s.toLowerCase()}>{s}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <span className="text-[10px]">▼</span>
                        </div>
                    </div>
                    {errors.sector && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.sector.message}</p>}
                </div>
            </div>

            {/* The Problem */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Problem Statement</label>
                <textarea 
                    {...register("problem_statement")}
                    placeholder="Describe the specific challenge..."
                    className={cn(
                      "w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm resize-none text-slate-900 placeholder:text-slate-400",
                      errors.problem_statement && "border-red-300 bg-red-50/10"
                    )}
                />
                {errors.problem_statement && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.problem_statement.message}</p>}
            </div>

            {/* The Solution */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Proposed Solution</label>
                <textarea 
                    {...register("proposed_solution")}
                    placeholder="How do you plan to solve it?"
                    className={cn(
                      "w-full h-24 p-3 bg-indigo-50/30 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm resize-none text-slate-900 placeholder:text-slate-400",
                      errors.proposed_solution && "border-red-300 bg-red-50/10"
                    )}
                />
                {errors.proposed_solution && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.proposed_solution.message}</p>}
            </div>

            {/* Deadline */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Voting Deadline</label>
                <div className="relative max-w-[200px]">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        type="date"
                        {...register("proposal_deadline")}
                        className="pl-9 text-slate-900" 
                        error={errors.proposal_deadline?.message}
                    />
                </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 hidden sm:block">All fields are required</span>
                <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 h-10 rounded-lg text-sm w-full sm:w-auto"
                >
                    Submit Proposal
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}