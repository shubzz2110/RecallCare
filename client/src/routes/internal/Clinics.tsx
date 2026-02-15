import PageHeading from "@/components/common/PageHeading";
import AddClinicDialog from "@/components/internal/clinics/AddClinicDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setTitle } from "@/lib/set-title";
import { Plus, Search, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

export default function Clinics() {
  const [showCreateClinicDialog, setShowCreateClinicDialog] =
    useState<boolean>(false);

  useEffect(() => {
    setTitle("Internal | Clinics");
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-8">
      <div className="flex justify-between w-full h-max">
        <PageHeading
          title="Clinics"
          description="Here you can add, remove, update the Clinics"
          icon={<Stethoscope />}
        />
        <Button size={"lg"} onClick={() => setShowCreateClinicDialog(true)}>
          <Plus />
          Add Clinic
        </Button>
      </div>
      <div className="flex">
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Search by name, email..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead>ID</TableHead>
            <TableHead className="w-1/5">Name</TableHead>
            <TableHead className="w-1/5">Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>uisefyiwe862^&%7jhs</TableCell>
            <TableCell>SmileCare Clinic</TableCell>
            <TableCell>homkar1997@gmail.com</TableCell>
            <TableCell>+91 9921665205</TableCell>
            <TableCell>
              <Badge className="bg-secondary">Onboarded</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {showCreateClinicDialog && (
        <AddClinicDialog
          showDialog={showCreateClinicDialog}
          onCloseDialog={setShowCreateClinicDialog}
        />
      )}
    </div>
  );
}
