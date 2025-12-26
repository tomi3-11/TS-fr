"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare } from "lucide-react";
import { useEffect } from "react"; // Import useEffect

// ... Schema definitions remain the same ...
const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(20, "Content must be at least 20 characters"),
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
    reset(); // Double tap: clear after submit too
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Post">
      {/* Update onSubmit to use our wrapper */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        
        {/* Type Selector (Tabs) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setValue("post_type", "discussion")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              postType === "discussion" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Discussion
          </button>
          <button
            type="button"
            onClick={() => setValue("post_type", "proposal")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              postType === "proposal" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <FileText className="h-4 w-4" />
            Proposal
          </button>
        </div>

        {/* Inputs */}
        <Input 
          label="Title" 
          placeholder="Enter a descriptive title"
          className="text-slate-900 placeholder:text-slate-400"
          error={errors.title?.message}
          {...register("title")}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Content</label>
          <textarea
            className={cn(
              "flex min-h-[150px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50",
              "text-slate-900 placeholder:text-slate-400",
              errors.content && "border-red-500 focus-visible:ring-red-500"
            )}
            placeholder="Share your detailed thoughts here..."
            {...register("content")}
          />
          {errors.content && (
            <p className="text-xs font-medium text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Post
            </Button>
        </div>
      </form>
    </Modal>
  );
}