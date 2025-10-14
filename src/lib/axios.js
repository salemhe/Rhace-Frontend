import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach a token if you’re using JWT
api.interceptors.request.use((config) => {
  // Try multiple token keys to support different auth flows
  let token =
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("vendor-token") ||
    localStorage.getItem("vendor_token");

  if (token) {
    // Avoid double Bearer prefix
    const hasBearer = /^Bearer\s+/i.test(token);
    const value = hasBearer ? token : `Bearer ${token}`;
    if (!config.headers) config.headers = {};
    config.headers.Authorization = value;
    config.headers.Accept = config.headers.Accept || "application/json";
  }
  return config;
});

export default api;
