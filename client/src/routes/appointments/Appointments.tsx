import PageHeading from "@/components/common/PageHeading";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { api } from "@/lib/api";
import { setTitle } from "@/lib/set-title";
import { errorHandler } from "@/lib/utils";
import type { Appointment } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search } from "lucide-react";
import { useEffect } from "react";

interface FetchAppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
}

const fetchClinicAppointments =
  async (): Promise<FetchAppointmentsResponse> => {
    const { data } = await api.get("/appointments/clinic-appointments");
    return data;
  };

export default function Appointments() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["clinic-appointments"],
    queryFn: () => fetchClinicAppointments(),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
  if (error) errorHandler(error);

  const appointments = data?.appointments;

  console.log(appointments);

  useEffect(() => {
    setTitle("Appointments");
  }, []);
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <div className="flex justify-between w-full h-max">
        <PageHeading
          title="Appointments"
          description="Here you can add, update patient appointments"
          icon={<Calendar />}
        />
      </div>
      <div className="flex">
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Search by name, phone" />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      {isLoading}
    </div>
  );
}
