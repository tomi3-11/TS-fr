import axios from "axios";

// The single source of truth for the API URL
// const API_URL = "https://api.techmspace.dev";
const API_URL = "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// We will add Interceptors (The "Silent Refresh" logic) here later.
// For now, this is enough to start.