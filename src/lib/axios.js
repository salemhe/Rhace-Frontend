import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for refresh token cookie if you're using httpOnly cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('vendor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const { data } = await api.post("/auth/refresh", {}, {
          withCredentials: true,
        });

        const newToken = data.accessToken || data.token;

        if (!newToken) {
          throw new Error("No access token returned");
        }

        // Save new token
        localStorage.setItem("token", newToken);

        // Update all pending requests
        processQueue(null, newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear everything on refresh failure (token expired or invalid)
        localStorage.removeItem("token");
        localStorage.removeItem("vendor_token");
        localStorage.removeItem("auth_token");

        // Clear Redux state - we'll dispatch this from components or use a listener
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;

          if (currentPath.startsWith("/dashboard/admin")) {
            window.location.href = "/auth/admin/login";
          } else if (currentPath.startsWith("/dashboard/")) {
            window.location.href = "/auth/vendor/login";
          } else {
            window.location.href = "/auth/login"; // fallback
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;