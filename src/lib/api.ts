import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); 
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (!path.includes("/login") && !path.includes("/register")) {
           localStorage.removeItem("token");
           localStorage.removeItem("user");
           
           window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);