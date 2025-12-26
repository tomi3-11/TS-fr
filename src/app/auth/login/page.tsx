"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthService } from "@/services/auth.service";

// 1. Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. Form Setup
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Submit Handler
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await AuthService.login(data);
      console.log("Login Success:", response);
      
      // TODO: Save tokens to Context/Storage here (Part 3)
      
      // Temporary Redirect for testing
      router.push("/"); 
      
    } catch (error: any) {
      // Handle API errors gracefully
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Enter your email to sign in to your account
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
                className="text-xs text-indigo-600 hover:text-indigo-500 font-medium justify-self-end"
              >
                Forgot password?
              </Link>
            </div>

            {serverError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            <Button type="submit" isLoading={isLoading}>
              Sign In with Email
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