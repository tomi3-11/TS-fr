import { api } from "@/lib/api";
import { LoginPayload, RegisterPayload, AuthResponse } from "@/types/auth";

export const AuthService = {
  async register(data: RegisterPayload) {
    // The backend endpoint is /api/v1/auth/register/
    const response = await api.post<{ message: string }>("/api/v1/auth/register/", data);
    return response.data;
  },

  async login(data: LoginPayload) {
    // The backend endpoint is /api/v1/auth/login/
    const response = await api.post<AuthResponse>("/api/v1/auth/login/", data);
    return response.data;
  },

  async logout() {
    return api.post("/api/v1/auth/logout/");
  },

  async requestPasswordReset(email: string) {
    // Note: Standardizing on /api/v1/ based on your other endpoints
    const response = await api.post<{ message: string }>("/api/v1/auth/password/reset/", { email });
    return response.data;
  },

  async confirmPasswordReset(token: string, new_password: string) {
    const response = await api.post<{ message: string }>("/api/v1/auth/password/reset/confirm/", {
      token,
      new_password,
    });
    return response.data;
  },
};