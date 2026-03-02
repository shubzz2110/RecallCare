import PageHeading from "@/components/PageHeading";
import { Stethoscope } from "lucide-react";

export default function ClinicsPage() {
  return (
    <div className="flex flex-col w-full h-full gap-8">
      <PageHeading
        title="Clinics"
        description="Manage your clinics and their details."
        icon={<Stethoscope />}
      />
    </div>
  );
}
