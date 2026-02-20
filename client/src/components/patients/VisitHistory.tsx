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

// interface VisitsResponse {
//   success: boolean;
//   appointments: Patient[];
//   patientsCount: number;
// }

// async function fetchVisits() {}

export default function VisitHistory() {
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
        <TableRow>
          <TableCell>
            <div className="space-y-1.5">
              <h1 className="font-semibold">
                {moment(new Date()).format("DD MMM YYYY")}
              </h1>
              <p className="uppercase font-normal text-muted-foreground text-sm">
                {moment(new Date()).format("hh:mm a")}
              </p>
            </div>
          </TableCell>
          <TableCell className="whitespace-normal overflow-hidden" title="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
            ea hic quam nostrum modi vel ipsum quibusdam id quidem aperiam,
            deleniti autem architecto dolores officiis dicta adipisci neque.
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <h1 className="font-semibold">
                {moment(new Date()).format("DD MMM YYYY")}
              </h1>
              <p className="font-normal text-muted-foreground text-xs">
                in 3 months
              </p>
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-secondary">Completed</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
