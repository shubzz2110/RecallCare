"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";
import { LogOut } from "lucide-react";

export default function InternalNavbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <nav className="flex items-center justify-between w-full h-16 bg-white/20 backdrop-blur-sm sticky left-0 top-0 border-b border-border px-4 xl:px-8">
      <span className="text-sm text-muted-foreground">{today}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"lg"} variant={"ghost"} className="flex flex-col h-12!">
            <span className="text-muted-foreground text-xs font-normal leading-2">
              Welcome
            </span>
            <span className="text-foreground font-medium text-sm leading-3">
              Shubham Homkar
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => useAuthStore.getState().logout()}
            variant="destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
