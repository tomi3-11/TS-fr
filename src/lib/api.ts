import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// --- REFRESH QUEUE LOGIC ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 1. Safety check to prevent infinite loops
      if (originalRequest.url.includes("/refresh/")) {
        handleLogout();
        return Promise.reject(error);
      }

      // 2. Queue requests while refreshing
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        // 3. Call Backend (Added Trailing Slash here)
        // Adjust '/auth/refresh/' if your path is different (e.g. '/api/token/refresh/')
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh_token: refreshToken, 
        });

        if (response.status === 200) {
          const newToken = response.data.token || response.data.access_token;
          
          localStorage.setItem("token", newToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
          
          processQueue(null, newToken);
          
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function handleLogout() {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (!path.includes("/login") && !path.includes("/register")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }
}