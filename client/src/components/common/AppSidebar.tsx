import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavLink } from "@/components/common/NavLink";
import { cn } from "@/lib/utils";

const appSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent>
        {/* LOGO */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-border transition-all",
            open ? "px-2 gap-2 justify-start" : "px-0 justify-center",
          )}
        >
          {/* <Orbit className="h-6 w-6 text-primary shrink-0" /> */}
          <img src="/recallcare-logo.png" alt="logo" className="w-12 h-auto" />
          {open && (
            <span className="text-lg font-semibold text-foreground">
              RecallCare
            </span>
          )}
        </div>

        {/* ITEMS */}
        <SidebarGroup>
          <SidebarMenu>
            {appSidebarItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <NavLink
                    to={item.href}
                    className="flex items-center gap-3 px-4 h-9 rounded-md transition-colors text-muted-foreground hover:text-foreground font-normal hover:bg-muted"
                    activeClassName="bg-primary text-white font-medium hover:bg-primary hover:text-white"
                  >
                    <item.icon />
                    {open && <span>{item.name}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
