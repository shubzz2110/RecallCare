import AppNavbar from "@/components/common/AppNavbar";
import AppSidebar from "@/components/common/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function Protected() {
  const user = useAuthStore.getState().user;
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 300);
    return () => clearTimeout(timer);
  }, []);

  console.log(user);

  if (checking) return null;

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />

          <SidebarInset className="flex flex-col">
            <AppNavbar />

            <main className="flex-1 p-6 bg-muted/30 overflow-auto">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
