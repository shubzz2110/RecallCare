import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import type { Visit } from "@/types/types";

interface VisitHistoryProps {
  history: Visit[];
}

export default function VisitHistory({ history }: VisitHistoryProps) {
  const getFollowUpLabel = (date: string | Date) => {
    const followUp = moment(date);
    const now = moment();
    const diffDays = followUp.diff(now, "days");

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return followUp.format("dddd");
    if (diffDays < 30) return `in ${followUp.diff(now, "weeks")} weeks`;
    return `In ${followUp.diff(now, "months")} months`;
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted rounded-t-lg hover:bg-muted">
          <TableHead>Visit date</TableHead>
          <TableHead className="lg:w-3/5">Treatment notes</TableHead>
          <TableHead>Follow up Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((visit) => (
          <TableRow key={visit._id}>
            <TableCell>
              <div className="space-y-1.5">
                <h1 className="font-semibold">
                  {moment(visit.visitDate).format("DD MMM YYYY")}
                </h1>
                <p className="uppercase font-normal text-muted-foreground text-sm">
                  {moment(visit.visitDate).format("hh:mm a")}
                </p>
              </div>
            </TableCell>
            <TableCell
              className="whitespace-normal overflow-hidden"
              title={visit.notes || ""}
            >
              {visit.notes || "No Notes"}
            </TableCell>
            <TableCell>
              <div className="space-y-1.5">
                <h1 className="font-semibold">
                  {visit.followUpDate
                    ? moment(visit.followUpDate).format("DD MMM YYYY")
                    : "-"}
                </h1>
                {visit.followUpDate && (
                  <p className="font-normal text-muted-foreground text-xs">
                    {getFollowUpLabel(visit.followUpDate)}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className="bg-secondary">Completed</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
