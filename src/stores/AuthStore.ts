import { create } from "zustand";
import AuthState from "../interfaces/AuthState";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token: string) => set({ token }),
  logout: () => set({ token: null }),
}));