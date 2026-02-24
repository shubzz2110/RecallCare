import AppPagination from "@/components/common/AppPagination";
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
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface PatientsResponse {
  success: boolean;
  patients: Patient[];
  patientsCount: number;
}

const PAGE_SIZE = 14;

async function fetchPatients(
  page: number,
  search: string,
  pageSize: number,
): Promise<PatientsResponse> {
  const { data } = await api.get<PatientsResponse>("/patients", {
    params: {
      search: search || undefined,
      skip: (page - 1) * pageSize,
      take: pageSize,
    },
  });
  return data;
}

export default function Patients() {
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  // const [showAddVisitDialog, setShowAddVisitDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["patients", currentPage, debouncedSearch],
    queryFn: () => fetchPatients(currentPage, debouncedSearch, PAGE_SIZE),
    staleTime: 30000, // Consider data fresh for 30s
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  const patients = data?.patients || [];
  const totalCount = data?.patientsCount || 0;

  if (error) errorHandler(error);

  // Reset to page 1 when search changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setTitle("Patients");
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-8">
      <div className="flex xl:flex-row justify-between w-full h-max">
        <PageHeading
          title="Patients"
          description="Manage and track clinic patients"
          icon={<Users />}
        />
        <Button
          size="lg"
          onClick={() => setShowAddPatientDialog(true)}
          className="hidden md:flex"
        >
          <Plus />
          Add Patient
        </Button>
        <Button
          onClick={() => setShowAddPatientDialog(true)}
          size="icon-lg"
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading patients...
                </TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  {debouncedSearch
                    ? "No patients match your search"
                    : "No patients found"}
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <PatientRow key={patient._id} patient={patient} />
              ))
            )}
          </TableBody>
        </Table>

        {/* Optional: Show subtle loading indicator during background refetch */}
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse" />
        )}
      </Card>

      <AppPagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />

      {showAddPatientDialog && (
        <AddPatientDialog
          showDialog={showAddPatientDialog}
          onCloseDialog={(v) => {
            setShowAddPatientDialog(v);
            if (!v) refetch(); // Refetch on dialog close
          }}
        />
      )}
    </div>
  );
}
