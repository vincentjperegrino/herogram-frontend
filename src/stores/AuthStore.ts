import { create } from "zustand";
import AuthState from "../interfaces/AuthState";

// Helper functions to handle localStorage directly
const loadTokenFromLocalStorage = () => {
  const token = localStorage.getItem("auth-storage");
  return token ? JSON.parse(token) : null;
};

const saveTokenToLocalStorage = (token: string | null) => {
  if (token) {
    localStorage.setItem("auth-storage", JSON.stringify(token));
  } else {
    localStorage.removeItem("auth-storage");
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: loadTokenFromLocalStorage(), // Initialize with the token from localStorage
  setToken: (token: string) => {
    saveTokenToLocalStorage(token); // Save token to localStorage
    set({ token });
  },
  logout: () => {
    saveTokenToLocalStorage(null); // Remove token from localStorage
    set({ token: null });
  },
}));