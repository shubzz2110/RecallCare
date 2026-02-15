import PageHeading from "@/components/common/PageHeading";
import MissedAppointments from "@/components/dashboard/MissedAppointments";
import TodaysAppointment from "@/components/dashboard/TodaysAppointment";
import UpcomingFollowUps from "@/components/dashboard/UpcomingFollowUps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { setTitle } from "@/lib/set-title";
import { LayoutDashboard, Plus } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    setTitle("Dashboard");
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/test");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <PageHeading
        title="Dashboard"
        icon={<LayoutDashboard />}
        description="Today’s visits and follow-ups at a glance."
      />
      <Card>
        <CardContent>
          <div className="flex flex-col xl:flex-row xl:items-center gap-5">
            <CardTitle>Quick Links</CardTitle>
            <Button
              onClick={() => fetchUsers()}
              variant={"outline"}
              size={"lg"}
            >
              <Plus />
              Add Patient
            </Button>
            <Button variant={"outline"} size={"lg"}>
              <Plus />
              Create Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-8">
        <TodaysAppointment />
        <UpcomingFollowUps />
        <MissedAppointments />
      </div>
    </div>
  );
}
