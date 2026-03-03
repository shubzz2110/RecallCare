"use client";

import AuthProvider from "@/providers/AuthProvider";
import InternalSidebar from "./components/InternalSidebar";
import InternalNavbar from "./components/InternalNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider allowedRoles={["ADMIN"]}>
        <div className="flex w-full min-h-dvh overflow-hidden">
          <InternalSidebar />
          <div className="w-full h-full min-w-0">
            <InternalNavbar />
            <main className="grow shrink basis-0 flex flex-col w-full h-full p-4 xl:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
