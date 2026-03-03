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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClinics } from "@/hooks/useClinicData";
import { Plus, Search, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CreateClinicModal from "./components/CreateClinicModal";
import { InternalClinics } from "@/types/types";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 20;

export default function ClinicsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const { data, isLoading, isFetched } = useClinics({
    page,
    limit: LIMIT,
    search,
  });

  const [isCreateClinicModalOpen, setIsCreateClinicModalOpen] =
    useState<boolean>(false);

  const clinics = data?.clinics || [];
  const pagination = data?.pagination;

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
          title="Clinics"
          description="Manage your clinics and their details."
          icon={<Stethoscope />}
        />
        <Button onClick={() => setIsCreateClinicModalOpen(true)}>
          <Plus />
          Add Clinic
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
                <TableHead className="w-1/5">ID</TableHead>
                <TableHead className="w-1/5">Name</TableHead>
                <TableHead className="w-1/5">Phone</TableHead>
                <TableHead className="w-1/5">Added on</TableHead>
                <TableHead className="w-1/5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || !isFetched ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : clinics.length === 0 ? (
                <TableRow>
                  <TableHead colSpan={5} className="text-center">
                    No clinics available
                  </TableHead>
                </TableRow>
              ) : (
                clinics.map((clinic: InternalClinics) => {
                  const doctor = clinic.users?.[0] || null;
                  return (
                    <TableRow key={clinic._id}>
                      <TableCell>{clinic._id}</TableCell>
                      <TableCell className="font-semibold!">
                        {clinic.name}
                      </TableCell>
                      <TableCell>{clinic.phone}</TableCell>
                      <TableCell>
                        {moment(clinic.createdAt).format("MMM DD, YYYY")}
                      </TableCell>
                      <TableCell>
                        {doctor && doctor.isActive ? (
                          <Badge className="bg-secondary">Onboarded</Badge>
                        ) : (
                          <Badge className="">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && (
        <AppPagination
          currentPage={page}
          totalCount={pagination.totalClinics}
          pageSize={LIMIT}
          onPageChange={goToPage}
        />
      )}

      {isCreateClinicModalOpen && (
        <CreateClinicModal
          isOpen={isCreateClinicModalOpen}
          onClose={() => setIsCreateClinicModalOpen(false)}
        />
      )}
    </div>
  );
}
