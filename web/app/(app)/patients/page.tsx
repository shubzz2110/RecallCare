"use client";

import AppPagination from "@/components/AppPagination";
import PageHeading from "@/components/PageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { usePatients } from "@/hooks/usePatientData";
import { Patient } from "@/types/types";
import { Plus, Search, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreatePatientModal from "./components/CreatePatientModal";
import PatientRow from "./components/PatientRow";
import UpdatePatientModal from "./components/UpdatePatientModal";

const LIMIT = 20;

export default function AppPatients() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const { data, isLoading, isFetched } = usePatients({
    page,
    limit: LIMIT,
    search,
  });

  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] =
    useState<boolean>(false);
  const [isUpdatePatientModalOpen, setIsUpdatePatientModalOpen] =
    useState<boolean>(false);

  // This will hold the patient data for which an action is being performed (edit/schedule/call/delete)
  const [actionPatient, setActionPatient] = useState<Patient | null>(null);

  const patients = data?.patients || [];
  const pagination = data?.pagination;

  const handleAction = (action: string, patient: Patient) => {
    switch (action) {
      case "edit":
        setActionPatient(patient);
        setIsUpdatePatientModalOpen(true);
        break;
      case "schedule":
        router.push(`/appointments/new?patientId=${patient._id}`);
        break;
      case "call":
        window.open(`tel:${patient.phone}`, "_blank");
        break;
      case "delete":
        // Handle delete action
        break;
    }
  };

  // Sync URL params helper
  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  // Debounced search — update URL after 400ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput || undefined, page: undefined });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Keep input in sync when URL changes externally (e.g. back button)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const goToPage = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  return (
    <div className="flex flex-col w-full h-full gap-8">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full h-max">
        <PageHeading
          title="Patients"
          description="Manage your patients and their details."
          icon={<Users />}
        />
        <Button onClick={() => setIsCreatePatientModalOpen(true)}>
          <Plus />
          Add Patient
        </Button>
      </div>
      <div className="flex">
        <InputGroup className="max-w-xs">
          <InputGroupInput
            placeholder="Search by name, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-2/5">Name</TableHead>
                <TableHead className="w-1/5">Phone</TableHead>
                <TableHead className="w-1/5">Added on</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || !isFetched ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableHead colSpan={5} className="text-center">
                    No patients available
                  </TableHead>
                </TableRow>
              ) : (
                patients.map((patient: Patient) => (
                  <PatientRow
                    key={patient._id}
                    patient={patient}
                    handleAction={handleAction}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && (
        <AppPagination
          currentPage={page}
          totalCount={pagination.totalPatients}
          pageSize={LIMIT}
          onPageChange={goToPage}
        />
      )}
      {/* Create Patient Modal */}
      {isCreatePatientModalOpen && (
        <CreatePatientModal
          isOpen={isCreatePatientModalOpen}
          onClose={() => setIsCreatePatientModalOpen(false)}
        />
      )}
      {/* Update Patient Modal */}
      {isUpdatePatientModalOpen && (
        <UpdatePatientModal
          isOpen={isUpdatePatientModalOpen}
          onClose={() => {
            setActionPatient(null);
            setIsUpdatePatientModalOpen(false);
          }}
          patient={actionPatient!}
        />
      )}
    </div>
  );
}
