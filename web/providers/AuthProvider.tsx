"use client";

import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const baseURL = String(process.env.NEXT_PUBLIC_API_BASE_URL);

interface AuthProviderProps {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "CLINIC")[];
}

export default function AuthProvider({
  children,
  allowedRoles,
}: AuthProviderProps) {
  const router = useRouter();
  const { user, accessToken, setAuth } = useAuthStore();

  // Silent token rehydration on mount
  // Uses raw axios (not the api instance) to avoid triggering the 401 interceptor
  useEffect(() => {
    if (accessToken && user) return;

    const hydrate = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/auth/token/refresh`,
          {},
          { withCredentials: true },
        );

        if (response.data.success) {
          setAuth(response.data.user, response.data.accessToken);
        } else {
          throw new Error("Refresh failed");
        }
      } catch {
        useAuthStore.getState().clearAuth();
        router.replace("/login?reason=expired");
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Role-based redirect after rehydration
  useEffect(() => {
    if (!user || !allowedRoles) return;

    if (!allowedRoles.includes(user.role as "ADMIN" | "CLINIC")) {
      if (user.role === "ADMIN") {
        router.replace("/internal/clinics");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, allowedRoles, router]);

  return <>{children}</>;
}
