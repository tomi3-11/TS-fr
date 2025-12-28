"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare, PenTool } from "lucide-react";

// 1. Validation Schema
const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(20, "Content must be at least 20 characters long to be meaningful."),
  post_type: z.enum(["proposal", "discussion"]),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostFormValues) => Promise<void>;
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      post_type: "discussion",
      title: "",
      content: ""
    }
  });

  const postType = watch("post_type");

  // STRICT RESET: Wipes the form clean every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      reset({ 
        post_type: "discussion", 
        title: "", 
        content: "" 
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: CreatePostFormValues) => {
    await onSubmit(data);
    reset(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start a New Thread">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-2">
        
        {/* Type Selector (Segmented Control) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setValue("post_type", "discussion")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-200",
              postType === "discussion" 
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Discussion
          </button>
          <button
            type="button"
            onClick={() => setValue("post_type", "proposal")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-200",
              postType === "proposal" 
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <FileText className="h-4 w-4" />
            Proposal
          </button>
        </div>

        {/* Title Input */}
        <div className="space-y-1">
            <Input 
              label="Subject" 
              placeholder={postType === 'proposal' ? "e.g., Request for New Feature..." : "e.g., Thoughts on the new architecture..."}
              className="font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal h-11"
              error={errors.title?.message}
              {...register("title")}
            />
        </div>
        
        {/* Content Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
             <PenTool className="w-3 h-3 text-slate-400" /> Content
          </label>
          <div className="relative">
              <textarea
                className={cn(
                  "flex min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-none shadow-sm",
                  "text-slate-900 placeholder:text-slate-400",
                  errors.content && "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder="Share your detailed thoughts, context, or requirements here..."
                {...register("content")}
              />
              {/* Character hint or icon could go here */}
          </div>
          {errors.content && (
            <p className="text-xs font-bold text-red-600 ml-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-600 inline-block" />
                {errors.content.message}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 mt-6">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="w-full sm:w-auto text-slate-500 hover:text-slate-800 font-bold"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                isLoading={isSubmitting}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8"
            >
              Post
            </Button>
        </div>
      </form>
    </Modal>
  );
}