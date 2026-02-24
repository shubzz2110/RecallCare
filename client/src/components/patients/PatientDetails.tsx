import { Card, CardContent } from "../ui/card";
import {
  CheckCircle2,
  Copy,
  FileTextIcon,
  Phone,
  User,
  Activity,
  CalendarClock,
  Hash,
  Plus,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { usePatient } from "@/hooks/usePatient";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { useState } from "react";
import { Badge } from "../ui/badge";
import moment from "moment";

interface PatientDetailsProps {
  totalVisits: number;
  lastVisitDate: string | Date | null;
  openAddVisitModal: () => void;
  openScheduleAppointmentModal: () => void;
}

export default function PatientDetails({
  totalVisits,
  lastVisitDate,
  openAddVisitModal,
  openScheduleAppointmentModal,
}: PatientDetailsProps) {
  const { id: patientId } = useParams();
  const navigate = useNavigate();

  const { data: patient, isLoading, isError } = usePatient(patientId);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyPhone = () => {
    if (patient?.phone) {
      navigator.clipboard.writeText(patient.phone);
      setCopiedPhone(true);
      toast.success("Phone number copied");
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="space-y-3 flex flex-col items-center">
          <Spinner className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mx-auto">
            <User size={24} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-foreground font-semibold">Patient not found</h2>
            <p className="text-muted-foreground text-sm">
              This patient may have been removed or doesn't exist.
            </p>
          </div>
          <Button onClick={() => navigate("/patients")} variant="outline">
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Patient Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 shrink-0">
                <User className="text-primary" size={26} />
              </div>
              <div className="min-w-0 space-y-1.5">
                <h1 className="text-foreground font-bold text-xl lg:text-2xl truncate">
                  {patient.name}
                </h1>
                <button
                  onClick={copyPhone}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-sm">{patient.phone}</span>
                  {copiedPhone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="border border-border rounded-xl bg-muted/50 overflow-hidden">
              <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border bg-muted">
                <FileTextIcon size={13} className="text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Notes
                </span>
              </div>
              <div className="px-3.5 py-3 min-h-15 max-h-24 overflow-y-auto">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {patient.notes || (
                    <span className="italic">
                      No notes added for this patient.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              {/* Last Visit */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border border-border rounded-xl p-3.5 bg-accent/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock size={14} className="shrink-0" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Last Visit
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {lastVisitDate ? moment(lastVisitDate).fromNow() : "Never"}
                </span>
              </div>

              {/* Total Visits */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border border-border rounded-xl p-3.5 bg-accent/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash size={14} className="shrink-0" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Total Visits
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {String(totalVisits).padStart(2, "0")}
                </span>
              </div>

              {/* Last Visit Status */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border border-border rounded-xl p-3.5 bg-accent/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity size={14} className="shrink-0" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Status
                  </span>
                </div>
                {totalVisits === 0 ? (
                  <span className="text-xs text-muted-foreground font-medium">
                    N/A
                  </span>
                ) : (
                  <Badge className="bg-secondary text-secondary-foreground text-xs w-fit">
                    Completed
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                <Button onClick={() => openAddVisitModal()}>
                  <Plus />
                  Add Visit
                </Button>
                <Button
                  onClick={() => openScheduleAppointmentModal()}
                  variant={"outline"}
                >
                  <Calendar />
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
