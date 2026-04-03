import { logoutAsync } from '@/redux/slices/authSlice';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && error.response?.error === "jwt expired") {
      logoutAsync()
    }

    return Promise.reject(error);
  }
);

export default api;