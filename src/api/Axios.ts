import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "../stores/AuthStore";

const baseURL = import.meta.env.VITE_API_BACKEND_URL as string;

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Get the latest token from the store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default api;