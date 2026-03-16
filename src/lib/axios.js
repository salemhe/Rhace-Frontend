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

  console.log("🌐 Axios REQUEST:", config.method?.toUpperCase(), config.url, "Token:", token ? token.substring(0,20)+'...' : 'MISSING');

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
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Whitelist vendor-safe endpoints - NO auto-logout
        const safeVendorPaths = ['/vendors/profile', '/vendors/', '/dashboard/', '/bookings'];
        const isSafePath = safeVendorPaths.some(path => 
          originalRequest.url?.includes(path)
        );
        
        console.log('401 on:', originalRequest.url, '- Safe?', isSafePath);
        
        if (!isSafePath) {
          // Clear tokens only for non-safe paths
          localStorage.removeItem("token");
          
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            console.log('401 logout from path:', currentPath);
            if (currentPath.startsWith('/dashboard/admin')) {
              window.location.href = '/auth/admin/login';
            } else {
              window.location.href = '/auth/vendor/login';
            }
          }
        }
        // Mark as retried to avoid infinite loops
        originalRequest._retry = true;
      }
      return Promise.reject(error);
    }
  );

export default api;
