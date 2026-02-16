import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const PUBLIC_ROUTES = ["/login", "/setup-password"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // skip refresh on public pages
    const isPublic = PUBLIC_ROUTES.some((route) =>
      location.pathname.startsWith(route),
    );

    if (isPublic) {
      setLoading(false);
      return;
    }

    const refreshSession = async () => {
      try {
        const res = await api.post("/auth/token/refresh");
        setAuth(res.data.user, res.data.accessToken);
      } catch {
        // user not logged in
      } finally {
        setLoading(false);
      }
    };

    refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (loading) return null;
  return <>{children}</>;
}
