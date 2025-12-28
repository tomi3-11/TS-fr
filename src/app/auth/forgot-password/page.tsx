"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound, 
  AlertCircle 
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService } from "@/services/auth.service";

const forgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState(""); // Track email for UI feedback

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  async function onSubmit(data: ForgotFormValues) {
    setIsLoading(true);
    setServerError(null);
    try {
      await AuthService.requestPasswordReset(data.email);
      setSentEmail(data.email);
      setIsSuccess(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send reset email. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // --- View 2: Success State ---
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Success Icon */}
            <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Check your inbox
                </h1>
                <p className="text-slate-500 leading-relaxed">
                    We sent a password reset link to <br />
                    <span className="font-bold text-slate-900">{sentEmail}</span>
                </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100">
                Did not receive the email? Check your spam folder or{" "}
                <button 
                    onClick={() => setIsSuccess(false)} 
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                    try another email address
                </button>.
            </div>

            <Link href="/auth/login" className="block w-full">
                <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Log In
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  // --- View 1: Input Form ---
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header / Icon */}
            <div className="text-center mb-10 space-y-4">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner transform rotate-3">
                    <KeyRound className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Forgot Password?
                </h1>
                <p className="text-slate-500 text-lg">
                    No worries! It happens. Please enter the email associated with your account.
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-white p-0 sm:p-8 rounded-3xl sm:border sm:border-slate-200 sm:shadow-xl sm:shadow-slate-200/40">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            label="Email Address"
                            error={errors.email?.message}
                            {...register("email")}
                            className="h-12 bg-white" // Taller input for mobile touch
                        />
                    </div>

                    {/* Custom Error Alert */}
                    {serverError && (
                        <div className="flex items-center gap-3 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="font-medium">{serverError}</p>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        isLoading={isLoading} 
                        className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-transform active:scale-[0.98]"
                    >
                        Send Reset Link
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <Link 
                        href="/auth/login" 
                        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Return to Log In
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}