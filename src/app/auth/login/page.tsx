"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Terminal, AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setServerError(null);
    
    try {
      await login(data); 
      // Context handles redirect
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid email or password";
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
                Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
                Enter your credentials to access the workspace
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Field - Long and sleek */}
            <div className="space-y-1">
                <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    label="Email Address"
                    error={errors.email?.message}
                    {...register("email")}
                    className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                />
            </div>

            {/* Password Field - Long and sleek */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-bold text-slate-700">Password</label>
                    <Link 
                        href="/auth/forgot-password" 
                        className="text-xs font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                    >
                        Forgot password?
                    </Link>
                </div>
                <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register("password")}
                    className="h-11 bg-white focus:bg-slate-50/50 transition-all border-slate-200"
                />
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
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
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
                            New to Tech MSpace?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href="/auth/register" className="block w-full">
                        <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                            Create an Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
        
        {/* Footer Links */}
        <p className="text-center text-xs text-slate-400">
            By signing in, you agree to our <a href="#" className="underline hover:text-slate-600">Terms</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}