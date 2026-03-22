import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('vendor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (logout)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Use the same baseURL as the api instance and ensure the path is correct
        const { data } = await api.post("/auth/refresh", {}, { withCredentials: true });
        localStorage.setItem("token", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("vendor-token");
        localStorage.removeItem("vendor_token");
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath.startsWith("/dashboard/admin")) {
            window.location.href = "/auth/admin/login";
          } else if (currentPath.startsWith("/dashboard/")) {
            window.location.href = "/auth/vendor/login";
          }
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api;

