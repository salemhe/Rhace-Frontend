import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://rhace-backend-mkne.onrender.com/api', // Adjust baseURL as needed
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newToken = data.accessToken;
          localStorage.setItem("token", newToken);

          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          refreshSubscribers = [];

          // logout logic
          localStorage.clear();

          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;

            if (currentPath.startsWith("/dashboard/admin")) {
              window.location.href = "/auth/admin/login";
            } else {
              window.location.href = "/auth/vendor/login";
            }
          }

          return Promise.reject(err);
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

