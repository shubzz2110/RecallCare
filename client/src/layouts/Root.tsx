import { Outlet } from "react-router";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster position="top-center" richColors theme="light" />
    </AuthProvider>
  );
}
