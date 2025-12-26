"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService } from "@/services/auth.service";
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
      // NOTE: We don't need router.push here because the Context handles the redirect to /dashboard
      
    } catch (error: any) {
      // Basic error handling
      const message = error.response?.data?.message || "Invalid credentials";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              label="Email"
              error={errors.email?.message}
              {...register("email")}
            />
            
            <div className="grid gap-1">
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                label="Password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Link 
                href="/auth/forgot-password" 
                className="text-xs text-indigo-600 hover:text-indigo-500 font-medium justify-self-end transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1">
                {serverError}
              </div>
            )}

            {/* FIX 5: Simplified Text */}
            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">
              New to Tech MSpace?
            </span>
          </div>
        </div>

        <Link href="/auth/register">
          <Button variant="outline" className="w-full">
            Create an Account
          </Button>
        </Link>
      </div>
    </>
  );
}