import { Card, CardContent } from "../ui/card";
import { CheckCircle2, Copy, FileTextIcon, Phone, User } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { usePatient } from "@/hooks/usePatient";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { useState } from "react";
import { Badge } from "../ui/badge";

export default function PatientDetails() {
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
        <div className="space-y-2.5 flex flex-col items-center justify-center">
          <Spinner className="size-10 text-muted-foreground" />
          <h1 className="text-foreground text-base font-normal">
            Loading Patient details...
          </h1>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <h1 className="text-xl text-muted-foreground">Patient not found</h1>
          <Button onClick={() => navigate("/patients")}>
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="xl:col-span-4 space-y-8">
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-center min-h-12 min-w-12 w-12 h-12 rounded-lg bg-primary/10">
                <User className="text-primary" size={26} />
              </div>
              <div className="space-y-2.5">
                <h1 className="text-foreground font-semibold text-xl lg:text-2xl">
                  {patient.name}
                </h1>
                <button
                  onClick={copyPhone}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-1 group"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-mono text-sm">{patient.phone}</span>
                  {copiedPhone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="grow shrink basis-0 border border-border rounded-lg bg-muted w-full min-h-28 max-h-28 overflow-y-auto">
              <div className="space-y-2.5 p-2.5">
                <h1 className="flex items-center gap-1.5 text-sm text-muted-foreground font-semibold">
                  <FileTextIcon size={14} />
                  Notes
                </h1>
                <p className="text-muted-foreground text-sm font-normal">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden xl:col-span-2 space-y-5 xl:block">
            <div className="col-span-2 border border-border rounded-lg p-5 bg-accent">
              <div className="flex items-center justify-between w-full h-max not-last:border-b not-last:border-border py-2.5">
                <span className="text-muted-foreground font-medium text-xs uppercase">
                  Last Visit
                </span>
                <span className="text-foreground text-sm font-semibold">
                  2 months ago
                </span>
              </div>
              <div className="flex items-center justify-between w-full h-max not-last:border-b not-last:border-border py-2.5">
                <span className="text-muted-foreground font-medium text-xs uppercase">
                  Next Follow Up
                </span>
                <span className="text-foreground text-sm font-semibold">
                  10 May 2026
                </span>
              </div>
              <div className="flex items-center justify-between w-full h-max not-last:border-b not-last:border-border py-2.5">
                <span className="text-muted-foreground font-medium text-xs uppercase">
                  Total Visits
                </span>
                <span className="text-foreground text-sm font-semibold">
                  10
                </span>
              </div>
              <div className="flex items-center justify-between w-full h-max not-last:border-b not-last:border-border py-2.5">
                <span className="text-muted-foreground font-medium text-xs uppercase">
                  Last visit status
                </span>
                <Badge className="bg-secondary">Completed</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
