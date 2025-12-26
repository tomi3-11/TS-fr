"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, ArrowRight, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService } from "@/services/auth.service";

// Schema: Ensure passwords match
const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirm: z.string()
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords do not match",
  path: ["password_confirm"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

// Inner component to handle SearchParams (Suspense Requirement in Next.js)
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  async function onSubmit(data: ResetFormValues) {
    if (!token) {
      setServerError("Invalid or missing reset token.");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await AuthService.confirmPasswordReset(token, data.password);
      setIsComplete(true);
      // Optional: Auto redirect after 3 seconds, or let user click
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to reset password. The link may have expired.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // State 0: Missing Token
  if (!token) {
    return (
      <div className="flex flex-col items-center text-center p-6 bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-lg font-bold text-red-900">Invalid Link</h2>
        <p className="text-sm text-red-700 mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/auth/forgot-password">
           <Button variant="outline" className="bg-white">Request New Link</Button>
        </Link>
      </div>
    );
  }

  // State 2: Success
  if (isComplete) {
     return (
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95">
        <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <KeyRound className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Updated!</h1>
        <p className="text-sm text-slate-500 mb-8">
          Your password has been changed successfully. Redirecting you to login...
        </p>
        <Link href="/auth/login" className="w-full">
          <Button className="w-full">
             Log in Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
     );
  }

  // State 1: Form
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Set new password
        </h1>
        <p className="text-sm text-slate-500">
          Please enter your new strong password below.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              label="New Password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              id="password_confirm"
              placeholder="••••••••"
              type="password"
              label="Confirm New Password"
              error={errors.password_confirm?.message}
              {...register("password_confirm")}
            />

            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Page Component (Must wrap in Suspense for useSearchParams)
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}