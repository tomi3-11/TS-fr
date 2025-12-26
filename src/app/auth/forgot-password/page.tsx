"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService } from "@/services/auth.service";

const forgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Controls the view state
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  async function onSubmit(data: ForgotFormValues) {
    setIsLoading(true);
    setServerError(null);
    try {
      await AuthService.requestPasswordReset(data.email);
      setIsSuccess(true); // Switch to success view
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send reset email. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // View 2: Success State (Email Sent)
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-slate-500 max-w-xs mb-8">
          We have sent a password reset link to your email address. It may take a few minutes to arrive.
        </p>
        <Link href="/auth/login" className="w-full">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  // View 1: Input Form
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Reset password
        </h1>
        <p className="text-sm text-slate-500">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              label="Email Address"
              error={errors.email?.message}
              {...register("email")}
            />

            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Send Reset Link
            </Button>
          </div>
        </form>

        <Link href="/auth/login" className="flex items-center justify-center text-sm text-slate-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
}