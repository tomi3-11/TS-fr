"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AuthService } from "@/services/auth.service";
import { User, LoginPayload, RegisterPayload } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Check for existing session on App Start
  useEffect(() => {
    async function loadUserFromCookies() {
      const accessToken = Cookies.get("access_token");
      
      if (accessToken) {
        try {
          // Set default header for future requests
          api.defaults.headers.Authorization = `Bearer ${accessToken}`;
          
          // Fetch user profile to verify token is valid
          // If this fails with 401 or 500, we must clear the session
          const { data } = await api.get("/api/v1/auth/user/");
          setUser(data);
          
        } catch (error: any) {
          console.error("Session check failed:", error);

          // FIX: Handle 500 (Server Error) and 401 (Unauthorized)
          // If the backend crashes (500) on this specific endpoint, it usually means 
          // the token is malformed or the user state is corrupted.
          if (error.response?.status === 401 || error.response?.status === 500) {
              console.warn("Invalid token or server error. Forcing logout.");
              // Manually clear cookies here to ensure clean slate before calling logout logic
              Cookies.remove("access_token");
              Cookies.remove("refresh_token");
              delete api.defaults.headers.Authorization;
              setUser(null);
              router.push("/auth/login");
          }
        }
      }
      setIsLoading(false);
    }

    loadUserFromCookies();
  }, [router]);

  // 2. Login Action
  const login = async (payload: LoginPayload) => {
    try {
      const response = await AuthService.login(payload);
      
      // Save tokens
      Cookies.set("access_token", response.tokens.access, { expires: 1 }); // 1 day
      Cookies.set("refresh_token", response.tokens.refresh, { expires: 7 }); // 7 days
      
      // Set Auth Header
      api.defaults.headers.Authorization = `Bearer ${response.tokens.access}`;
      
      // Set User State
      setUser(response.user);
      
      // Navigate to Dashboard
      router.push("/dashboard");
      
    } catch (error) {
      throw error; // Let the UI handle the error message
    }
  };

  // 3. Register Action
  const register = async (payload: RegisterPayload) => {
    try {
      // Register
      await AuthService.register(payload);
      
      // Redirect to login page
      router.push("/auth/login?registered=true");
      
    } catch (error) {
      throw error;
    }
  };

  // 4. Logout Action
  const logout = async () => {
    try {
      // Call API to invalidate token (optional but good practice)
      // await AuthService.logout(); 
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Always clean up client side
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      delete api.defaults.headers.Authorization;
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for using the Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}