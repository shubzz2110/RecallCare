import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";

export default function UpcomingFollowUps() {
  return (
    <Card className="xl:col-span-2 min-h-100">
      <CardHeader>
        <CardTitle>Upcoming Follow-Ups</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Patient</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Reminder</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </CardContent>
    </Card>
  );
}
