import PageHeading from "@/components/PageHeading";
import { LayoutDashboard } from "lucide-react";

export default function InternalDashboard() {
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <PageHeading
        title="Dashboard"
        description="See app performance, user stats and other insights."
        icon={<LayoutDashboard />}
      />
    </div>
  );
}
