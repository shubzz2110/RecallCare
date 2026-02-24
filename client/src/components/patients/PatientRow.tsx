import { TableCell, TableRow } from "../ui/table";
// import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Patient } from "@/types/types";
// import { Calendar, EllipsisVertical, Phone, Plus } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
import { useNavigate } from "react-router";

interface PatientRowProps {
  patient: Patient;
}

export default function PatientRow({ patient }: PatientRowProps) {
  const navigate = useNavigate();
  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => navigate(`/patients/${patient._id}`)}
    >
      <TableCell className="font-semibold">{patient.name}</TableCell>
      <TableCell className="font-semibold">+91 {patient.phone}</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        <Badge variant={"outline"}>New Patient</Badge>
      </TableCell>
      {/* <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon-sm"} variant={"ghost"}>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Plus className="h-4 w-4" />
              Add Visit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="h-4 w-4" />
              Call
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell> */}
    </TableRow>
  );
}
