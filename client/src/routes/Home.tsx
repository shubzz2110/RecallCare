import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth";

export default function HomeRedirect() {
  const user = useAuthStore.getState().user;
  const role = useAuthStore.getState().user?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === "ADMIN") return <Navigate to="/internal/clinics" replace />;

  return <Navigate to="/dashboard" replace />;
}
