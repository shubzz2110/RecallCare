import { LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { errorHandler } from "@/lib/utils";
import { api } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";

export default function AppNavbar() {
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<{ _id: string; name: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const fetchClinic = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/clinics/${useAuthStore.getState().user?.clinic}`,
      );
      setClinic(response.data.clinic);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinic();
  }, []);

  return (
    <header className="flex items-center justify-between w-full h-16 sticky top-0 left-0 border-b border-border px-4 lg:px-8 bg-white/70 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <span className="text-sm text-muted-foreground">{today}</span>
        {}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"lg"} variant={"ghost"} className="flex flex-col h-12!">
            <span className="text-muted-foreground text-xs font-normal leading-2">
              Clinic
            </span>
            <span className="text-foreground font-medium text-sm leading-3">
              {loading && <Skeleton className="h-3 w-8" />}
              {clinic?.name || "Unknown Clinic"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => useAuthStore.getState().logout()}
            variant="destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
