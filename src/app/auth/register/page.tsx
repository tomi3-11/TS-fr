"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Terminal, ArrowRight, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

// 1. Extended Schema for Registration
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirm: z.string()
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords do not match",
  path: ["password_confirm"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setServerError(null);
    try {
      await registerUser(data);
      // The context handles the redirect logic
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="group mb-6">
                <div className="h-12 w-12 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Terminal className="h-6 w-6" />
                </div>
            </Link>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-600">
                Join the community of builders shipping real impact.
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username */}
            <div className="space-y-1">
                <Input
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    label="Username"
                    error={errors.username?.message}
                    {...register("username")}
                    className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                />
            </div>

            {/* Email */}
            <div className="space-y-1">
                <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    label="Email Address"
                    error={errors.email?.message}
                    {...register("email")}
                    className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                />
            </div>
            
            {/* Passwords Grid - Stacks on mobile, Side-by-Side on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        label="Password"
                        error={errors.password?.message}
                        {...register("password")}
                        className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                    />
                </div>
                
                <div className="space-y-1">
                    <Input
                        id="password_confirm"
                        placeholder="••••••••"
                        type="password"
                        label="Confirm"
                        error={errors.password_confirm?.message}
                        {...register("password_confirm")}
                        className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                    />
                </div>
            </div>

            {/* Server Error Alert */}
            {serverError && (
                <div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p className="font-medium">{serverError}</p>
                </div>
            )}

            {/* Submit Button */}
            <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </form>
            
            {/* Divider */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                            Already a member?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href="/auth/login" className="block w-full">
                        <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                            Log In
                        </Button>
                    </Link>
                </div>
            </div>
        </div>

        {/* Footer Links */}
        <p className="text-center text-xs text-slate-400">
            By creating an account, you agree to our <a href="#" className="underline hover:text-slate-600">Terms</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}