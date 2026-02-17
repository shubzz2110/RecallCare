import PageHeading from "@/components/common/PageHeading";
import AddPatientDialog from "@/components/patients/AddPatientDialog";
import PatientRow from "@/components/patients/PatientRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { api } from "@/lib/api";
import { setTitle } from "@/lib/set-title";
import { errorHandler } from "@/lib/utils";
import type { Patient } from "@/types/types";
import { Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Patients() {
  const [loading, setLoading] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] =
    useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  const fetchClinicPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; patients: Patient[] }>(
        "/patients",
        { params: { search, take: 10 } },
      );
      if (response && response.data) {
        setPatients(response.data.patients);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitle("Patients");
  }, []);

  useEffect(() => {
    fetchClinicPatients();
  }, [search]);
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <div className="flex xl:flex-row justify-between w-full h-max">
        <PageHeading
          title="Patients"
          description="Manage and track clinic patients"
          icon={<Users />}
        />
        <Button
          size={"lg"}
          onClick={() => setShowAddPatientDialog(true)}
          className="hidden md:flex"
        >
          <Plus />
          Add Patient
        </Button>
        <Button
          onClick={() => setShowAddPatientDialog(true)}
          size={"icon-lg"}
          className="md:hidden"
        >
          <Plus />
        </Button>
      </div>
      <div className="flex">
        <InputGroup className="max-w-xs">
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone..."
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Card className="p-0 min-h-80 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted rounded-t-lg hover:bg-muted">
              <TableHead className="w-1/5">Name</TableHead>
              <TableHead className="w-1/5">Phone</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Next Follow-Up</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-1/12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading patients...
                </TableCell>
              </TableRow>
            )}
            {patients.length &&
              !loading &&
              patients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
          </TableBody>
        </Table>
      </Card>
      {showAddPatientDialog && (
        <AddPatientDialog
          showDialog={showAddPatientDialog}
          onCloseDialog={() => setShowAddPatientDialog(false)}
        />
      )}
    </div>
  );
}
