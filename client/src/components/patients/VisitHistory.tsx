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
import { CalendarCheck, Clock, FileText } from "lucide-react";
import type { Visit } from "@/types/types";

interface VisitHistoryProps {
  history: Visit[];
}

const getFollowUpLabel = (date: string | Date) => {
  const followUp = moment(date);
  const now = moment();
  const diffDays = followUp.diff(now, "days");

  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return followUp.format("dddd");
  if (diffDays < 30) return `in ${followUp.diff(now, "weeks")} weeks`;
  return `in ${followUp.diff(now, "months")}mo`;
};

export default function VisitHistory({ history }: VisitHistoryProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="pl-5">Visit Date</TableHead>
              <TableHead className="lg:w-3/5">Treatment Notes</TableHead>
              <TableHead>Follow-up Date</TableHead>
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((visit) => (
              <TableRow key={visit._id} className="group">
                <TableCell className="pl-5">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">
                      {moment(visit.visitDate).format("DD MMM YYYY")}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock size={10} />
                      {moment(visit.visitDate).format("hh:mm A")}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <p
                    className="text-sm text-foreground line-clamp-2"
                    title={visit.notes || ""}
                  >
                    {visit.notes || (
                      <span className="text-muted-foreground italic text-xs">
                        No notes recorded
                      </span>
                    )}
                  </p>
                </TableCell>

                <TableCell>
                  {visit.followUpDate ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">
                        {moment(visit.followUpDate).format("DD MMM YYYY")}
                      </p>
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded-md bg-primary/10 text-primary `}
                      >
                        {getFollowUpLabel(visit.followUpDate)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                <TableCell className="pr-5">
                  <Badge className="bg-secondary text-secondary-foreground text-xs font-medium">
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {history.map((visit) => (
          <div key={visit._id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm text-foreground">
                  {moment(visit.visitDate).format("DD MMM YYYY")}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {moment(visit.visitDate).format("hh:mm A")}
                </p>
              </div>
              <Badge className="bg-secondary text-secondary-foreground text-xs font-medium shrink-0">
                Completed
              </Badge>
            </div>

            <div className="flex items-start gap-2 bg-muted/50 rounded-md p-2.5">
              <FileText
                size={13}
                className="text-muted-foreground mt-0.5 shrink-0"
              />
              <p className="text-sm text-foreground line-clamp-3">
                {visit.notes || (
                  <span className="text-muted-foreground italic text-xs">
                    No notes recorded
                  </span>
                )}
              </p>
            </div>

            {visit.followUpDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <CalendarCheck size={12} />
                  Follow-up
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs">
                    {moment(visit.followUpDate).format("DD MMM YYYY")}
                  </span>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-md bg-primary/10 text-primary`}
                  >
                    {getFollowUpLabel(visit.followUpDate)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
