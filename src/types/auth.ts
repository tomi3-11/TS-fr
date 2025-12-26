export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "moderator";
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirm: string; // The backend expects this exact snake_case
}