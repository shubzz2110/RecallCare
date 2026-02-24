import PageHeading from "@/components/common/PageHeading";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { setTitle } from "@/lib/set-title";
import { errorHandler } from "@/lib/utils";
import type { Appointment } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search, Phone, User, Clock, Filter } from "lucide-react";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";

interface FetchAppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
}

const fetchClinicAppointments =
  async (): Promise<FetchAppointmentsResponse> => {
    const { data } = await api.get("/appointments/clinic-appointments");
    return data;
  };

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "missed":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusDot = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "scheduled":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "missed":
      return "bg-red-500";
    case "cancelled":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, error, isLoading } = useQuery({
    queryKey: ["clinic-appointments"],
    queryFn: () => fetchClinicAppointments(),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  if (error) errorHandler(error);

  const appointments = data?.appointments;

  // Filter and search logic
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patient.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.patient.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        appointment.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, statusFilter]);

  useEffect(() => {
    setTitle("Appointments");
  }, []);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Appointments"
        description="Manage and track all clinic appointments"
        icon={<Calendar className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="p-6">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <InputGroup className="w-full sm:w-96">
              <InputGroupAddon>
                <Search className="h-4 w-4 text-gray-500" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="Search by patient name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="mb-4 h-8 w-8" />
              <p className="text-sm text-gray-500">Loading Appointments...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredAppointments?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">
                No appointments found
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Appointments will appear here once scheduled"}
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading &&
            filteredAppointments &&
            filteredAppointments.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Appointment Date</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Scheduled On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow
                          key={appointment._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="text-gray-900">
                                {moment(appointment.scheduledDate).format(
                                  "MMM DD, YYYY",
                                )}
                              </span>
                              <span className="text-sm text-gray-500">
                                {moment(appointment.scheduledDate).format(
                                  "hh:mm A",
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <User size={18} />
                              <span className="font-medium text-gray-900">
                                {appointment.patient.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {appointment.patient.phone}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {moment(appointment.createdAt).format(
                              "MMM DD, YYYY",
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                                appointment.status,
                              )}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                  appointment.status,
                                )}`}
                              />
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1).toLowerCase()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

          {/* Results Count */}
          {!isLoading &&
            filteredAppointments &&
            filteredAppointments.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredAppointments.length} of {appointments?.length}{" "}
                appointments
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
