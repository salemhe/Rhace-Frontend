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
    localStorage.getItem("vendor_token") ||
    localStorage.getItem("admin-token") ||
    localStorage.getItem("admin_token");

  console.log("API baseURL:", import.meta.env.VITE_API_BASE_URL);

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

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data on 401
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("vendor-token");
      localStorage.removeItem("vendor_token");

      // If we're in a browser environment, redirect to appropriate login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/dashboard/admin')) {
          window.location.href = '/auth/admin/login';
        } else if (currentPath.startsWith('/dashboard/')) {
          window.location.href = '/auth/vendor/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
