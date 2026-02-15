import { api } from "@/lib/api";
import type { User } from "@/types/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isClinicUser: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,

  isAdmin: () => get().user?.role === "ADMIN",
  isClinicUser: () => get().user?.role === "CLINIC",

  setAuth: (user, token) => {
    set({
      user,
      accessToken: token,
    });
  },
  logout: () => {
    set({
      user: null,
      accessToken: null,
    });
    api.post("/auth/logout");
    window.location.href = "/login";
  },
}));
