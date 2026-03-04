import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Patient } from "@/types/types";
import { Calendar, Edit, EllipsisVertical, Phone, Trash2 } from "lucide-react";
import moment from "moment";

interface PatientRowProps {
  patient: Patient;
  handleAction: (action: string, patient: Patient) => void;
}

export default function PatientRow({ patient, handleAction }: PatientRowProps) {
  return (
    <TableRow key={patient._id}>
      <TableCell className="font-semibold!">{patient.name}</TableCell>
      <TableCell>{patient.phone}</TableCell>
      <TableCell>{moment(patient.createdAt).format("MMM DD, YYYY")}</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon-sm"} variant={"ghost"}>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction("edit", patient)}>
              <Edit className="h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("schedule", patient)}>
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("call", patient)}>
              <Phone className="h-4 w-4" />
              Call
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleAction("delete", patient)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
