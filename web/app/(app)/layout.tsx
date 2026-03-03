"use client";

import AuthProvider from "@/providers/AuthProvider";
import AppSidebar from "./components/AppSidebar";
import AppNavbar from "./components/AppNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider allowedRoles={["CLINIC"]}>
        <div className="flex w-full min-h-dvh overflow-hidden">
          <AppSidebar />
          <div className="w-full h-full min-w-0">
            <AppNavbar />
            <main className="grow shrink basis-0 flex flex-col w-full h-full p-4 xl:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
