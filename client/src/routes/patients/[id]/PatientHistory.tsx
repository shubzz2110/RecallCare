import PageHeading from "@/components/common/PageHeading";
import { ArrowLeftIcon, Calendar, Plus, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import PatientDetails from "@/components/patients/PatientDetails";
import VisitHistory from "@/components/patients/VisitHistory";
import { useState } from "react";
import AddVisitModal from "@/components/patients/AddVisitModal";
import type { Visit } from "@/types/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface PatientVisitResponse {
  success: boolean;
  visits: Visit[];
}

const fetchPatientVisits = async (
  patientId: string | null,
): Promise<PatientVisitResponse> => {
  const { data } = await api.get("/visits/patient-visits", {
    params: { patientId: patientId },
  });
  return data;
};

export default function PatientHistory() {
  const navigate = useNavigate();
  const [showAddVisitModal, setShowAddVisitModal] = useState<boolean>(false);
  const { id: patientId } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["patient-visits", patientId],
    queryFn: () => fetchPatientVisits(patientId || null),
    staleTime: 30000, // Consider data fresh for 30s
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  const history = data?.visits;

  return (
    <div className="flex flex-col w-full h-full gap-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between w-full h-max gap-6">
        <div className="flex gap-2.5">
          <Button
            onClick={() => navigate("/patients")}
            variant={"ghost"}
            size={"icon-lg"}
          >
            <ArrowLeftIcon />
          </Button>
          <PageHeading
            title="Patient History"
            description="Complete medical history and treatment timeline"
            icon={<User />}
          />
        </div>
        <Button onClick={() => setShowAddVisitModal(true)} size={"lg"}>
          <Plus />
          Add Visit
        </Button>
      </div>

      <PatientDetails />

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2.5">
          <Calendar size={18} className="text-muted-foreground" />
          <h1 className="text-foreground font-semibold text-base">
            Visit History
          </h1>
        </div>
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <h1>Loading Visits...</h1>
              </div>
            ) : (
              <VisitHistory history={history || []} />
            )}
          </CardContent>
        </Card>
      </div>
      {showAddVisitModal && (
        <AddVisitModal
          showDialog={showAddVisitModal}
          onCloseDialog={(v) => {
            setShowAddVisitModal(v);
            if (!v) refetch(); // Refetch on dialog close
          }}
        />
      )}
    </div>
  );
}
