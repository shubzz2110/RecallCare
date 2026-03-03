import PageHeading from "@/components/PageHeading";
import { LayoutDashboard } from "lucide-react";

export default function AppDashboardPage() {
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <PageHeading
        title="Dashboard"
        description="See your clinic's performance, patient stats and other insights."
        icon={<LayoutDashboard />}
      />
    </div>
  );
}
