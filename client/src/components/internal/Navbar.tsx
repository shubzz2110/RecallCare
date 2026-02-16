import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";

export default function InternalNavbar() {
  return (
    <nav className="flex items-center justify-between w-full h-16 bg-white/20 backdrop-blur-sm fixed left-0 top-0 border-b border-border px-4 xl:px-8">
      <div className={"flex items-center transition-all gap-1.5"}>
        <img src="/recallcare-logo.png" alt="logo" className="w-12 h-auto" />
        <span className="text-lg font-semibold text-foreground">
          RecallCare
        </span>
      </div>
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
