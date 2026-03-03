import { api } from "@/lib/api";
import type { User } from "@/types/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  logout: () => void;
  isAdmin: () => boolean;
  isClinicUser: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  isAdmin: () => get().user?.role === "ADMIN",
  isClinicUser: () => get().user?.role === "CLINIC",

  setAuth: (user, token) => {
    set({
      user,
      accessToken: token,
      isHydrated: true,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isHydrated: false,
    });
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      isHydrated: false,
    });
    api.post("/auth/logout").catch(() => {});
    window.location.href = "/login";
  },
}));
