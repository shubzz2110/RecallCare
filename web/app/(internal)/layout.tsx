import React from "react";
import InternalSidebar from "./components/InternalSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import InternalNavbar from "./components/InternalNavbar";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-dvh overflow-hidden">
      <InternalSidebar />
      <div className="w-full h-full min-w-0">
        <InternalNavbar />
        <main className="grow shrink basis-0 flex flex-col w-full h-full p-4 xl:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
