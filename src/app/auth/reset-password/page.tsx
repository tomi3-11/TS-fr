"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, ArrowRight, AlertCircle, CheckCircle2, Lock } from "lucide-react";

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
      // Optional: Auto redirect after 3 seconds
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to reset password. The link may have expired.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // --- State 0: Missing Token (Error View) ---
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
        <div className="w-full max-w-md bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Invalid or Expired Link</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                This password reset link is invalid or has expired. For security reasons, reset links are one-time use only.
            </p>
            <Link href="/auth/forgot-password" className="block w-full">
                <Button variant="outline" className="w-full h-11 border-slate-300 text-slate-700 font-bold hover:bg-slate-50 rounded-xl">
                    Request New Link
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  // --- State 2: Success View ---
  if (isComplete) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
        <div className="w-full max-w-md bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Password Updated!</h1>
            <p className="text-slate-500 mb-8 text-sm">
                Your password has been changed successfully. You will be redirected to the login page shortly.
            </p>
            <Link href="/auth/login" className="block w-full">
                <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg">
                    Log in Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
      </div>
     );
  }

  // --- State 1: Form View ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 transform rotate-6">
                <Lock className="h-6 w-6 text-slate-600" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Set new password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
                Please enter your new strong password below.
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
                <div className="space-y-1">
                    <Input
                        id="password"
                        placeholder="New password"
                        type="password"
                        label="New Password"
                        error={errors.password?.message}
                        {...register("password")}
                        className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                    />
                </div>

                <div className="space-y-1">
                    <Input
                        id="password_confirm"
                        placeholder="Confirm new password"
                        type="password"
                        label="Confirm Password"
                        error={errors.password_confirm?.message}
                        {...register("password_confirm")}
                        className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                    />
                </div>

                {serverError && (
                    <div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in zoom-in-95">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p className="font-medium">{serverError}</p>
                    </div>
                )}

                <Button 
                    type="submit" 
                    isLoading={isLoading} 
                    className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                >
                    Reset Password
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}

// Main Page Component (Must wrap in Suspense for useSearchParams)
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
        </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}