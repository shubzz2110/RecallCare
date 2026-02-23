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
    params: { patientId },
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
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const history = data?.visits;

  return (
    <div className="flex flex-col w-full h-full gap-6 lg:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => navigate("/patients")}
            variant="ghost"
            size="icon-lg"
            className="shrink-0"
          >
            <ArrowLeftIcon />
          </Button>
          <PageHeading
            title="Patient History"
            description="Complete medical history and treatment timeline"
            icon={<User />}
          />
        </div>
        <Button
          onClick={() => setShowAddVisitModal(true)}
          size="lg"
          className="w-full sm:w-auto shrink-0"
        >
          <Plus className="mr-1.5" />
          Add Visit
        </Button>
      </div>

      {/* Patient Details Card */}
      <PatientDetails
        lastVisitDate={history ? (history[0]?.visitDate ?? null) : null}
        totalVisits={history?.length || 0}
      />

      {/* Visit History */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calendar size={18} className="text-muted-foreground" />
            <h2 className="text-foreground font-semibold text-base">
              Visit History
            </h2>
          </div>
          {history && history.length > 0 && (
            <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
              {history.length} {history.length === 1 ? "visit" : "visits"}
            </span>
          )}
        </div>

        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Loading visits...
                </p>
              </div>
            ) : history && history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Calendar size={32} className="text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm">
                  No visits recorded yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddVisitModal(true)}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add First Visit
                </Button>
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
            if (!v) refetch();
          }}
        />
      )}
    </div>
  );
}
