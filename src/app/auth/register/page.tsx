"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation"; // Correct import for App Router

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
  const { register: registerUser } = useAuth(); // Rename to avoid conflict with hook-form
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
      // The context will handle the logic (redirect or login)
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed. Try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="text-sm text-slate-500">
          Join the community of builders
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            
            <Input
              id="username"
              placeholder="johndoe"
              type="text"
              label="Username"
              error={errors.username?.message}
              {...register("username")}
            />

            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              label="Email"
              error={errors.email?.message}
              {...register("email")}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                id="password"
                placeholder="••••••••"
                type="password"
                label="Password"
                error={errors.password?.message}
                {...register("password")}
                />
                
                <Input
                id="password_confirm"
                placeholder="••••••••"
                type="password"
                label="Confirm Password"
                error={errors.password_confirm?.message}
                {...register("password_confirm")}
                />
            </div>

            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Sign Up
            </Button>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">
              Already have an account?
            </span>
          </div>
        </div>

        <Link href="/auth/login">
          <Button variant="outline" className="w-full">
            Log in
          </Button>
        </Link>
      </div>
    </div>
  );
}