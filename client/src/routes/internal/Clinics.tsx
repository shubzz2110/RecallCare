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
import { api } from "@/lib/api";
import { setTitle } from "@/lib/set-title";
import { errorHandler } from "@/lib/utils";
import type { InternalClinics } from "@/types/types";
import { Plus, Search, Stethoscope } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";

export default function Clinics() {
  const [showCreateClinicDialog, setShowCreateClinicDialog] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<InternalClinics[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTitle("Internal | Clinics");
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await api.get<{
        success: boolean;
        clinics: InternalClinics[];
      }>("/internal/clinics");
      setClinics(response.data.clinics || []);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const searchableClinics = useMemo(() => {
    if (!search.trim()) return clinics;

    const term = search.toLowerCase();

    return clinics.filter((clinic) => {
      return clinic.name.toLowerCase().includes(term);
    });
  }, [clinics, search]);

  useEffect(() => {
    fetchClinics();
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
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
          />
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
            <TableHead className="w-1/5">Phone</TableHead>
            <TableHead>Added on</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                Loading clinics...
              </TableCell>
            </TableRow>
          ) : searchableClinics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No clinics found
              </TableCell>
            </TableRow>
          ) : (
            searchableClinics.map((clinic) => {
              const doctor = clinic.users?.[0];
              return (
                <TableRow key={clinic.id}>
                  <TableCell>{clinic.id}</TableCell>
                  <TableCell>{clinic.name}</TableCell>
                  <TableCell>{clinic.phone}</TableCell>
                  <TableCell>
                    {moment(clinic.createdAt).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell>
                    {doctor.isActive ? (
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
      {showCreateClinicDialog && (
        <AddClinicDialog
          showDialog={showCreateClinicDialog}
          onCloseDialog={setShowCreateClinicDialog}
          fetchClinics={fetchClinics}
        />
      )}
    </div>
  );
}
