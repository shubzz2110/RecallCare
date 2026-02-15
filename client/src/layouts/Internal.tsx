import InternalNavbar from "@/components/internal/Navbar";
import { Outlet } from "react-router";

export default function InternalLayout() {
  return (
    <div className="flex flex-col w-full min-h-dvh">
      <InternalNavbar />
      <div className="flex flex-col w-full h-full container xl:mx-auto xl:max-w-7xlx mt-16 p-4 xl:p-8">
        <Outlet />
      </div>
    </div>
  );
}
