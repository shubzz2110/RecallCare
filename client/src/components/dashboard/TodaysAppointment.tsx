import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function TodaysAppointment() {
  const appointments = [
    {
      time: "10:30AM",
      patient: "Shubham Homkar",
      phone: "9921665205",
      status: "Arrived",
    },
    {
      time: "11:30AM",
      patient: "John Doe",
      phone: "8754455544",
      status: "Pending",
    },
    {
      time: "01:30PM",
      patient: "Titus Wahre",
      phone: "9988777777",
      status: "Pending",
    },
    {
      time: "10:30AM",
      patient: "Glory Fernandez",
      phone: "7766565644",
      status: "Pending",
    },
    {
      time: "10:30AM",
      patient: "Shubham Homkar",
      phone: "9921665205",
      status: "Arrived",
    },
    {
      time: "11:30AM",
      patient: "John Doe",
      phone: "8754455544",
      status: "Pending",
    },
    {
      time: "01:30PM",
      patient: "Titus Wahre",
      phone: "9988777777",
      status: "Pending",
    },
    {
      time: "10:30AM",
      patient: "Glory Fernandez",
      phone: "7766565644",
      status: "Pending",
    },
  ];
  return (
    <Card className="xl:col-span-3 min-h-100">
      <CardHeader>
        <CardTitle>Today&apos;s Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={JSON.stringify(appointment.patient)}>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.patient}</TableCell>
                <TableCell>{appointment.phone}</TableCell>
                <TableCell>{appointment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
